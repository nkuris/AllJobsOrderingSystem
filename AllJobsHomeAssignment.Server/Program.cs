using AllJobsHomeAssignment.Server.Data;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using System;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            // Serialize enums as their string names so the frontend can compare status values like "ACTIVE"/"INACTIVE"
            options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        // Prevent serialization errors on cyclic navigation properties (Order -> Items -> Order)
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var configuration = builder.Configuration;

// Configure DbContext (MySQL) with retry and server-version fallback
var conn = configuration.GetConnectionString("DefaultConnection");
try
{
    // Try to detect server version (works when DB is reachable)
    var serverVersion = ServerVersion.AutoDetect(conn);
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseMySql(conn, serverVersion, my => my.EnableRetryOnFailure()));
}
catch
{
    // Fallback to a reasonable MySQL server version and enable retries
    var fallbackVersion = new MySqlServerVersion(new Version(8, 0, 32));
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseMySql(conn, fallbackVersion, my => my.EnableRetryOnFailure()));
}

// Configure authentication (JWT)
var jwtSection = configuration.GetSection("Jwt");
var jwtKey = jwtSection["Key"] ?? throw new InvalidOperationException("JWT Key not configured in appsettings.json");
var keyBytes = System.Text.Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                // Return JSON for expired or invalid tokens
                context.NoResult();
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                var msg = context.Exception is Microsoft.IdentityModel.Tokens.SecurityTokenExpiredException
                    ? new { error = "TokenExpired", message = "Token has expired" }
                    : new { error = "AuthenticationFailed", message = context.Exception?.Message ?? "Authentication failed" };
                return context.Response.WriteAsJsonAsync(msg);
            },
            OnChallenge = context =>
            {
                // Customize challenge response body
                context.HandleResponse();
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                var msg = new { error = "Unauthorized", message = context.ErrorDescription ?? "Missing or invalid token" };
                return context.Response.WriteAsJsonAsync(msg);
            },
            OnForbidden = context =>
            {
                // Return JSON for forbidden responses
                context.Response.StatusCode = 403;
                context.Response.ContentType = "application/json";
                var msg = new { error = "Forbidden", message = "You do not have access to this resource" };
                return context.Response.WriteAsJsonAsync(msg);
            }
        };
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(keyBytes)
        };
    });

// Authorization policies can be added; using Role-based checks in controllers via [Authorize(Roles = "ADMIN")]
builder.Services.AddAuthorization();

// Enable CORS for local frontend during development
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost3000", pb =>
    {
        pb.WithOrigins("http://localhost:3000")
          .AllowAnyHeader()
          .AllowAnyMethod()
          .AllowCredentials();
    });
});

// Register business services
builder.Services.AddScoped<AllJobsHomeAssignment.Server.Services.IProductService, AllJobsHomeAssignment.Server.Services.ProductService>();
builder.Services.AddScoped<AllJobsHomeAssignment.Server.Services.IOrderService, AllJobsHomeAssignment.Server.Services.OrderService>();
builder.Services.AddScoped<AllJobsHomeAssignment.Server.Services.IUsersService, AllJobsHomeAssignment.Server.Services.UsersService>();

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Use CORS policy before authentication
app.UseCors("AllowLocalhost3000");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

// Initialize database and seed data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        await DbInitializer.InitializeAsync(services);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while initializing the database.");
        throw;
    }
}

app.Run();
