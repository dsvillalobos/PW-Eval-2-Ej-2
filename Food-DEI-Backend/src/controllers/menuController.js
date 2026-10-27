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
  itemsReservados: [],
};

export const agregarReserva = function (req, res) {
  const { platilloId, cantidad } = req.body;

  // Validaciones
  if (!platilloId || !cantidad) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  // Revisar si el platillo existe en el menú
  const platillo = menu.find((item) => item.id === platilloId);

  if (!platillo) {
    return res.status(404).json({ error: "Platillo no encontrado" });
  }

  // Revisar si hay stock
  if (platillo.stock < cantidad) {
    return res.status(400).json({ error: "No hay suficiente stock" });
  }

  // Revisar si el usuario tiene suficiente saldo
  const totalCosto = platillo.price * cantidad;

  if (reservas.saldo < totalCosto) {
    return res.status(400).json({ error: "Saldo insuficiente" });
  }

  // Actualizar el stock del menu y el saldo del usuario
  platillo.stock -= cantidad;
  reservas.saldo -= totalCosto;

  // Agregar el platillo a los items reservados
  reservas.itemsReservados.push({
    id: platillo.id,
    name: platillo.name,
    cantidad: cantidad,
    totalCosto: totalCosto,
  });

  return res.status(201).json({ message: "Reserva agregada exitosamente" });
};
