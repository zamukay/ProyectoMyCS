using Microsoft.AspNetCore.Mvc;
using EcommerceAPI.Data;
using EcommerceAPI.Models;
using System.ComponentModel.DataAnnotations;

namespace EcommerceAPI.Controllers
{
    // DTO para recibir los datos del formulario
    public class CreateContactMessageDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string? Subject { get; set; }

        [Required]
        public string Message { get; set; } = string.Empty;
    }

    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly EcommerceDbContext _context;
        private readonly ILogger<ContactController> _logger;

        public ContactController(EcommerceDbContext context, ILogger<ContactController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // POST api/contact
        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] CreateContactMessageDto dto)
        {
            // Validar modelo con DataAnnotations
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Datos inválidos. Revisa nombre, email y mensaje."
                });
            }

            // Validaciones manuales con trim
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest(new { success = false, message = "El nombre es obligatorio." });

            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest(new { success = false, message = "El email es obligatorio." });

            if (string.IsNullOrWhiteSpace(dto.Message))
                return BadRequest(new { success = false, message = "El mensaje es obligatorio." });

            try
            {
                var contactMessage = new ContactMessage
                {
                    Name    = dto.Name.Trim(),
                    Email   = dto.Email.Trim(),
                    Message = string.IsNullOrWhiteSpace(dto.Subject)
                                ? dto.Message.Trim()
                                : $"[{dto.Subject.Trim()}] {dto.Message.Trim()}",
                    Date    = DateTime.UtcNow
                };

                _context.ContactMessages.Add(contactMessage);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Nuevo mensaje de contacto guardado. Id: {Id}, Email: {Email}", contactMessage.Id, contactMessage.Email);

                return Ok(new
                {
                    success = true,
                    message = "Mensaje guardado correctamente",
                    id      = contactMessage.Id
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al guardar mensaje de contacto");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor. Intenta de nuevo más tarde."
                });
            }
        }
    }
}
