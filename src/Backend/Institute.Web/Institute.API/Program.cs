using AutoMapper;
using Institute.API.DTOs;
using Institute.API.Helpers;
using Institute.Application.Configurations;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Application.Security;
using Institute.Application.Services;
using Institute.Domain.Entities;
using Institute.Infrastructure;
using Institute.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Linq;
using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();
Console.WriteLine("AzureStorage Conn = " + builder.Configuration["AzureStorage:ConnectionString"]);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("CheckoutLimit", opt =>
    {
        opt.PermitLimit = 3;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueLimit = 0;
        opt.QueueProcessingOrder = System.Threading.RateLimiting.QueueProcessingOrder.OldestFirst;
    });
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "أدخل الـ JWT token هنا"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

#region (CORS)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost",
        builder => builder
            .WithOrigins(
                "http://localhost:5173",
                "https://acwebsite-icmet-test.azurewebsites.net",
                "https://icmet-a3bvdmgua9akf7c5.westeurope-01.azurewebsites.net",
                "https://icemt.arabcont.com"

            )
            .AllowAnyHeader()
            .AllowAnyMethod());
});
#endregion

#region (Dependency Injection)
builder.Services.Configure<AzureStorageSettings>(
    builder.Configuration.GetSection("AzureStorage"));
builder.Services.AddScoped(typeof(IRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped(typeof(IReadOnlyService<>), typeof(ReadOnlyService<>));
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<NewsPictureUrlResolver<NewsListDto>>();
builder.Services.AddScoped<NewsPictureUrlResolver<NewsDetailsDto>>();
builder.Services.AddScoped<INewsService, NewsService>();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<ILecturerService, LecturerService>();
builder.Services.AddHttpClient<ClerkService>();
builder.Services.AddScoped(typeof(IClerkService), typeof(ClerkService));
builder.Services.AddScoped<ICheckoutService, CheckoutService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddScoped<IBooksTypeService, BooksTypeService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IPlanworkService, PlanworkService>();
builder.Services.AddScoped<IPlanFileService, PlanFileService>();
builder.Services.AddSingleton<IBlobStorage, BlobStorage>();
builder.Services.AddScoped<IAuthorizationHandler, PermissionHandler>();
builder.Services.AddScoped<IPermissionService, PermissionService>();
builder.Services.AddScoped<IUserPermissionService, UserPermissionService>();
builder.Services.AddScoped<BankPaymentService>();
builder.Services.AddScoped<IRefundService, RefundService>();
builder.Services.AddScoped<IAuthorizationHandler, ManagerAuthorizationHandler>();

builder.Services.Configure<PaymentSettings>(builder.Configuration.GetSection("PaymentSettings"));

builder.Services.AddHttpClient("BankClient", client =>
{
    var paymentSettings = builder.Configuration
        .GetSection("PaymentSettings")
        .Get<PaymentSettings>()
        ?? throw new InvalidOperationException("PaymentSettings section not found.");

    client.BaseAddress = new Uri(paymentSettings.BaseUrl);
    client.Timeout = TimeSpan.FromSeconds(30);
    client.DefaultRequestHeaders.Add("Accept", "application/json");

    var authValue = Convert.ToBase64String(
        Encoding.ASCII.GetBytes(
            $"merchant.{paymentSettings.MerchantId}:{paymentSettings.ApiPassword}"));

    client.DefaultRequestHeaders.Authorization =
        new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authValue);
});
#endregion

#region (Authentication And Authorization)
var clerkAuthority = builder.Configuration["Clerk:Authority"];
var jwksUrl = $"{clerkAuthority}/.well-known/jwks.json";

List<SecurityKey> clerkSigningKeys = new();
using (var startupHttpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(30) })
{
    for (int attempt = 1; attempt <= 3; attempt++)
    {
        try
        {
            var json = await startupHttpClient.GetStringAsync(jwksUrl);
            var jwks = new Microsoft.IdentityModel.Tokens.JsonWebKeySet(json);
            clerkSigningKeys = jwks.GetSigningKeys().ToList();
            Console.WriteLine($"✅ Clerk JWKS fetched manually, {clerkSigningKeys.Count} key(s) loaded (attempt {attempt})");
            break;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Attempt {attempt} to fetch Clerk JWKS failed: {ex}");
            if (attempt < 3) await Task.Delay(1000 * attempt);
        }
    }
}

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = true;
        options.MapInboundClaims = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            NameClaimType = "sub",
            IssuerSigningKeys = clerkSigningKeys,
            IssuerSigningKeyResolver = (token, securityToken, kid, validationParameters) =>
            {
                if (clerkSigningKeys.Any(k => k.KeyId == kid))
                    return clerkSigningKeys.Where(k => k.KeyId == kid);

                try
                {
                    using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(10) };
                    var json = client.GetStringAsync(jwksUrl).GetAwaiter().GetResult();
                    var jwks = new Microsoft.IdentityModel.Tokens.JsonWebKeySet(json);
                    clerkSigningKeys = jwks.GetSigningKeys().ToList();
                    return clerkSigningKeys.Where(k => k.KeyId == kid);
                }
                catch
                {
                    return clerkSigningKeys;
                }
            }
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("❌ AUTH FAILED: " + context.Exception);
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("✅ TOKEN VALIDATED");
                return Task.CompletedTask;
            },
            OnChallenge = context =>
            {
                context.HandleResponse();
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                return context.Response.WriteAsJsonAsync(new
                {
                    error = context.Error,
                    errorDescription = context.ErrorDescription
                });
            }
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("News", policy =>
        policy.Requirements.Add(new PermissionRequirement("News")));

    options.AddPolicy("Books", policy =>
        policy.Requirements.Add(new PermissionRequirement("Books")));

    options.AddPolicy("Lecturers", policy =>
        policy.Requirements.Add(new PermissionRequirement("Lecturers")));

    options.AddPolicy("Courses", policy =>
        policy.Requirements.Add(new PermissionRequirement("Courses")));

    options.AddPolicy("ManagerOnly", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.Requirements.Add(new ManagerRequirement());
    });
});
#endregion

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
