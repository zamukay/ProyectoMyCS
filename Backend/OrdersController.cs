using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EcommerceAPI.Models;

namespace EcommerceAPI.Controllers
{
    /// <summary>
    /// Controlador que gestiona las operaciones relacionadas con órdenes de compra.
    /// Todos los endpoints requieren que el usuario esté autenticado.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        /// <summary>
        /// Crea una nueva orden de compra para el usuario autenticado.
        /// </summary>
        /// <param name="orderDto">Objeto con los datos de la compra (ítems, cantidades y precios).</param>
        /// <returns>Mensaje de éxito junto con un resumen de la orden creada.</returns>
        /// <response code="200">Orden creada exitosamente.</response>
        /// <response code="400">Los datos de la orden son inválidos.</response>
        /// <response code="401">El usuario no está autenticado.</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult CreateOrder([FromBody] CreateOrderDto orderDto)
        {
            // Validación básica: la orden debe contener al menos un ítem.
            if (orderDto.Items == null || orderDto.Items.Count == 0)
            {
                return BadRequest(new { message = "La orden debe contener al menos un ítem." });
            }

            // Calcular el total de la orden sumando (cantidad × precio unitario) por ítem.
            decimal total = orderDto.Items.Sum(item => item.Quantity * item.UnitPrice);

            // Obtener el nombre del usuario autenticado desde los claims del token JWT.
            string? userName = User.Identity?.Name ?? "Usuario";

            return Ok(new
            {
                message   = "¡Orden creada exitosamente!",
                user      = userName,
                itemCount = orderDto.Items.Count,
                total     = total,
                createdAt = DateTime.UtcNow
            });
        }
    }
}
