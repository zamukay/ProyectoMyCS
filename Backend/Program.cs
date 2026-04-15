using Microsoft.EntityFrameworkCore;
using EcommerceAPI.Data;
using EcommerceAPI.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();
builder.Services.AddControllers();

// 🔐 Autenticación JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
            )
        };
    });

// 🗄️ Base de datos SQLite
builder.Services.AddDbContext<EcommerceDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// 🌐 CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<EcommerceDbContext>();
    db.Database.Migrate();

    var seedProducts = new List<Product>
    {
        new Product { Id = 1, Name = "Laptop Gamer Alpha", Description = "Laptop de alto rendimiento para gaming y edicion.", Price = 1399.99m, Stock = 10, ImageUrl = "img/laptop-01.jpg" },
        new Product { Id = 2, Name = "Laptop Pro Silver", Description = "Equipo liviano para trabajo profesional y estudio.", Price = 1199.00m, Stock = 14, ImageUrl = "img/laptop-02.jpg" },
        new Product { Id = 3, Name = "Laptop Creator X", Description = "Ideal para diseno, video y multitarea intensiva.", Price = 1499.50m, Stock = 8, ImageUrl = "img/laptop-03.jpg" },
        new Product { Id = 4, Name = "Laptop Ultra 14", Description = "Ultrabook compacta con bateria de larga duracion.", Price = 999.90m, Stock = 18, ImageUrl = "img/laptop-04.jpg" },
        new Product { Id = 5, Name = "Mouse RGB Pro", Description = "Mouse ergonomico con sensor de alta precision.", Price = 59.99m, Stock = 45, ImageUrl = "img/acc-mouse.jpg" },
        new Product { Id = 6, Name = "Teclado Mecanico", Description = "Teclado mecanico con iluminacion RGB personalizable.", Price = 89.90m, Stock = 32, ImageUrl = "img/acc-teclado.jpg" },
        new Product { Id = 7, Name = "Headset Surround", Description = "Auriculares gamer con microfono y sonido envolvente.", Price = 79.99m, Stock = 26, ImageUrl = "img/acc-headset.jpg" },
        new Product { Id = 8, Name = "Mochila Tech", Description = "Mochila reforzada para laptop y accesorios.", Price = 49.99m, Stock = 38, ImageUrl = "img/acc-backpack.jpg" },
        new Product { Id = 9, Name = "Cooler Pad", Description = "Base de enfriamiento para laptop con ventiladores duales.", Price = 39.99m, Stock = 28, ImageUrl = "img/acc-cooler.jpg" },
        new Product { Id = 10, Name = "Mouse Pad XL", Description = "Superficie amplia y antideslizante para setup gamer.", Price = 24.99m, Stock = 60, ImageUrl = "img/acc-pad.jpg" }
    };

    var existingProducts = db.Products.ToDictionary(p => p.Id);
    foreach (var seed in seedProducts)
    {
        if (existingProducts.TryGetValue(seed.Id, out var current))
        {
            current.Name = seed.Name;
            current.Description = seed.Description;
            current.Price = seed.Price;
            current.Stock = seed.Stock;
            current.ImageUrl = seed.ImageUrl;
        }
        else
        {
            db.Products.Add(seed);
        }
    }

    db.SaveChanges();
}

app.Run();