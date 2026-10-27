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
  total: 11.0,
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

function showMenu(req, res) {
  return res.json(menu);
}

function showReservas(req, res) {
  reservas.total = parseFloat(calcularTotalReserva().toFixed(2));
  return res.json(reservaUsuario);
}

async function actualizarPorciones(req, res) {
  const id = Number(req.params.id);
  const nuevaCantidad = Number(req.body.cantidad);

  if (!Number.isInteger(nuevaCantidad) || nuevaCantidad <= 0) {
    return res.status(400).json({
      mensaje: "La cantidad debe ser positiva y entera",
    });
  }

  const alimento = menu.find((item) => item.id === id);

  const reservado = reserva.itemsReservados.find((item) => item.id === id);

  if (!alimento || !reservado) {
    return res.status(404).json({
      mensaje: "Alimento no encontrado en la reserva",
    });
  }

  const cantidadAnterior = reservado.cantidad;
  const diferencia = nuevaCantidad - cantidadAnterior;

  if (diferencia > 0 && alimento.stock < diferencia) {
    return res.status(400).json({
      mensaje: "Stock insuficiente",
    });
  }

  const variacionPrecio = diferencia * alimento.price;

  if (variacionPrecio > reserva.saldo) {
    return res.status(400).json({
      mensaje: "Saldo insuficiente para esta cantidad",
    });
  }

  alimento.stock -= diferencia;
  reserva.saldo -= variacionPrecio;

  reservado.cantidad = nuevaCantidad;

  const total = reserva.itemsReservados.reduce((suma, item) => {
    const producto = menu.find((plato) => plato.id === item.id);
    return suma + producto.price * item.cantidad;
  }, 0);

  return res.json({
    mensaje: "Porciones actualizadas correctamente",
    saldo: reserva.saldo,
    itemsReservados: reserva.itemsReservados,
    total,
  });
}

async function eliminarPlato(req, res) {
  const id = Number(req.params.id);

  const reservado = reserva.itemsReservados.find((item) => item.id === id);

  if (!reservado) {
    return res.status(404).json({
      mensaje: "El alimento no está en la reserva",
    });
  }

  const alimento = menu.find((item) => item.id === id);

  if (!alimento) {
    return res.status(404).json({
      mensaje: "Alimento no encontrado en el menú",
    });
  }

  alimento.stock += reservado.cantidad;

  reserva.saldo += alimento.price * reservado.cantidad;

  reserva.itemsReservados = reserva.itemsReservados.filter(
    (item) => item.id !== id,
  );

  const total = reserva.itemsReservados.reduce((suma, item) => {
    const producto = menu.find((plato) => plato.id === item.id);
    return suma + producto.price * item.cantidad;
  }, 0);

  return res.json({
    mensaje: "Plato eliminado correctamente",
    saldo: reserva.saldo,
    itemsReservados: reserva.itemsReservados,
    total,
  });
}

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
