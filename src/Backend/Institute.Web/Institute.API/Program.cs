using Institute.API.Helpers;

builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingProfiles>();
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseCors("AllowLocalhost");
app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();
app.Map("/clerk-proxy", proxyApp =>
{
    proxyApp.Run(async ctx =>
    {
        var factory = ctx.RequestServices.GetRequiredService<IHttpClientFactory>();
        var client = factory.CreateClient("ClerkProxy");

        var remainingPath = ctx.Request.Path.ToString();
        var queryString = ctx.Request.QueryString.ToString();
        var targetUrl = $"https://clerk.acwebsite-icmet-test.azurewebsites.net{remainingPath}{queryString}";

        var requestMessage = new HttpRequestMessage
        {
            RequestUri = new Uri(targetUrl),
            Method = new HttpMethod(ctx.Request.Method)
        };

        foreach (var header in ctx.Request.Headers)
        {
            if (!header.Key.Equals("Host", StringComparison.OrdinalIgnoreCase))
                requestMessage.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
        }

        if (ctx.Request.ContentLength > 0 || ctx.Request.Headers.ContainsKey("Transfer-Encoding"))
            requestMessage.Content = new StreamContent(ctx.Request.Body);

        try
        {
            var response = await client.SendAsync(requestMessage);
            ctx.Response.StatusCode = (int)response.StatusCode;

            foreach (var header in response.Headers)
                ctx.Response.Headers[header.Key] = header.Value.ToArray();
            foreach (var header in response.Content.Headers)
                ctx.Response.Headers[header.Key] = header.Value.ToArray();

            ctx.Response.Headers.Remove("Transfer-Encoding");
            await response.Content.CopyToAsync(ctx.Response.Body);
        }
        catch (Exception ex)
        {
            ctx.Response.StatusCode = 502;
            await ctx.Response.WriteAsync($"Clerk proxy error: {ex.Message}");
        }
    });
});
app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();
