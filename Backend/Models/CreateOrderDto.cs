namespace EcommerceAPI.Models
{
    /// <summary>
    /// DTO que representa los datos de compra enviados al endpoint POST /api/orders.
    /// </summary>
    public class CreateOrderDto
    {
        /// <summary>Lista de ítems incluidos en la orden.</summary>
        public List<OrderItemDto> Items { get; set; } = new();
    }

    /// <summary>
    /// Representa un ítem individual dentro de la orden de compra.
    /// </summary>
    public class OrderItemDto
    {
        /// <summary>Identificador del producto.</summary>
        public int ProductId { get; set; }

        /// <summary>Cantidad de unidades solicitadas.</summary>
        public int Quantity { get; set; }

        /// <summary>Precio unitario del producto al momento de la compra.</summary>
        public decimal UnitPrice { get; set; }
    }
}
