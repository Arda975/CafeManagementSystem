global using Microsoft.AspNetCore.Mvc;
using AmedimCafeApi.Models;
using Microsoft.OpenApi.Models;
using Npgsql;
using System.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Cafe API", Version = "v1" });
});

// CORS Desteði Ekleniyor
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // React uygulamanýzýn adresi
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add the IConfiguration instance which accesses appsettings.json
IConfiguration configuration = builder.Configuration;

// Add the connection string to the DI container
builder.Services.AddScoped<IDbConnection>(db => new NpgsqlConnection(
    configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS Politikasýný Kullan
app.UseCors("AllowAllOrigins");

app.UseAuthorization();

app.MapControllers();

app.Run();