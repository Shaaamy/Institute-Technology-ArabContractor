using AutoMapper;
using Institute.API.DTOs;
using Institute.API.Helpers;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Application.Services;
using Institute.Infrastructure;
using Institute.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System;

var builder = WebApplication.CreateBuilder(args);

// ======= DbContext =======
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ======= Controllers & Swagger =======
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
#region (CORS)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost",
        builder => builder
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());
});
#endregion

//// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
#region( Dependency Injecton ) 
builder.Services.AddScoped(typeof(IRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped(typeof(IReadOnlyService<>), typeof(ReadOnlyService<>));
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<NewsPictureUrlResolver<NewsListDto>>();
builder.Services.AddScoped<NewsPictureUrlResolver<NewsDetailsDto>>();
builder.Services.Configure<BankMisrOptions>(
    builder.Configuration.GetSection("BankMisr"));

builder.Services.AddHttpClient<BankMisrPaymentService>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<ILecturerService, LecturerService>();
builder.Services.AddHttpClient<ClerkService>();
builder.Services.AddScoped(typeof(IClerkService), typeof(ClerkService));

builder.Services.AddScoped<ITransactionLogService, TransactionLogService>();
#endregion
#region(Authentication And Authorization)

builder.Services
.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.Authority = "https://mighty-basilisk-11.clerk.accounts.dev";

    options.RequireHttpsMetadata = true;

    // 🔥 مهم جدًا مع Clerk
    options.MapInboundClaims = false;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true, // 🔥 لازم true
        NameClaimType = "sub"
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("❌ AUTH FAILED");
            Console.WriteLine(context.Exception.Message);
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("✅ TOKEN VALIDATED");
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

#endregion


// ======= AutoMapper =======
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingProfiles>();
});


// ======= Build App =======
var app = builder.Build();

// ======= Middleware =======
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowLocalhost");
app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();    
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("index.html");
app.UseStaticFiles();



app.Run();

