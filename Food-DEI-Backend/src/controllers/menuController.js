const menu = [
  {
    id: 1,
    name: "Pizza",
    description: "Pizza clasica con salsa de tomate, queso y pepperoni.",
    price: 9.99,
    image:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Pizza-3007395.jpg/1280px-Pizza-3007395.jpg",
    stock: 20,
    categoria: "Fuerte",
  },
  {
    id: 2,
    name: "Lasagna",
    description: "Lasagna clasica con salsa de tomate, queso y carne molida.",
    price: 6.99,
    image:
      "https://cdn.jwplayer.com/v2/media/KcAgyiFk/thumbnails/KnxzkZhO.jpg?width=1280",
    stock: 10,
    categoria: "Fuerte",
  },
  {
    id: 3,
    name: "Ensalada Cesar",
    description: "Ensalada Cesar con lechuga, tomate, pepino y aderezo.",
    price: 6.99,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzcXB8-djWTagt5ePs8o3-9IzOvbiC9wkbG7rot0KJ8ZCJqZRT3GllRMmM&s=10",
    stock: 5,
    categoria: "Light",
  },
];

const reservas = {
  id: 1,
  nombre: "Alex Roldan",
  saldo: 150.0,
  itemsReservados: [{ id: 1, cantidad: 2 }],
  total: 11.00
};

/**
 * Función auxiliar para recalcular el total de la reserva
 * tomando como referencia los precios actuales del menú
 */

const calcularTotalReserva = () => {
  return reservas.itemsReservados.reduce((acumulado, item) => {
    const alimento = menu.find((m) => m.id === item.id);
    return acumulado + (alimento ? alimento.precio * item.cantidad : 0);
  }, 0);
};

// Endpoint para mostrar el menu
app.get('/api/menu', (req, res) => {
  return res.status(200).json(menu);
});

// Endpoint para devolver los detalles de la reserva
app.get('/api/reserva', (req, res) => {
  reservas.total = parseFloat(calcularTotalReserva().toFixed(2));
  return res.status(200).json(reservaUsuario);
});

