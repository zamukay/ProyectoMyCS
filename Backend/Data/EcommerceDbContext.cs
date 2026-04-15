using Microsoft.EntityFrameworkCore;
using EcommerceAPI.Models;

namespace EcommerceAPI.Data
{
    public class EcommerceDbContext : DbContext
    {
        public EcommerceDbContext(DbContextOptions<EcommerceDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Product>().HasData(
                new Product { Id = 1, Name = "Laptop Pro 15\"", Description = "Potente laptop para profesionales con 16GB RAM y 512GB SSD.", Price = 1299.99m, Stock = 15, ImageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
                new Product { Id = 2, Name = "Smartphone X", Description = "Teléfono inteligente de última generación con cámara de 48MP.", Price = 799.50m, Stock = 30, ImageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
                new Product { Id = 3, Name = "Auriculares Inalámbricos", Description = "Auriculares con cancelación de ruido activa y 24 horas de batería.", Price = 199.99m, Stock = 50, ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
                new Product { Id = 4, Name = "Monitor UltraWide 34\"", Description = "Monitor curvo ideal para diseño y gaming.", Price = 450.00m, Stock = 10, ImageUrl = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
            );
        }
    }
}
