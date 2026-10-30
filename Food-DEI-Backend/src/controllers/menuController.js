const menu = [
  {
    id: 1,
    name: "Pizza",
    description: "Pizza clasica con salsa de tomate, queso y pepperoni.",
    price: 9.99,
    image:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Pizza-3007395.jpg/1280px-Pizza-3007395.jpg",
    stock: 2,
    categoria: "Fuerte",
  },
  {
    id: 2,
    name: "Lasagna",
    description: "Lasagna clasica con salsa de tomate, queso y carne molida.",
    price: 6.99,
    image:
      "https://cdn.jwplayer.com/v2/media/KcAgyiFk/thumbnails/KnxzkZhO.jpg?width=1280",
    stock: 3,
    categoria: "Fuerte",
  },
  {
    id: 3,
    name: "Ensalada Cesar",
    description: "Ensalada Cesar con lechuga, tomate, pepino y aderezo.",
    price: 6.99,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzcXB8-djWTagt5ePs8o3-9IzOvbiC9wkbG7rot0KJ8ZCJqZRT3GllRMmM&s=10",
    stock: 1,
    categoria: "Light",
  },
];

const reservas = {
  id: 1,
  nombre: "Alex Roldan",
  saldo: 100.0,
  itemsReservados: [],
  total: 0.0,
};

// Recalcular el total de la reserva
const calcularTotalReserva = () => {
  return reservas.itemsReservados.reduce((acumulado, item) => {
    const alimento = menu.find((m) => m.id === item.id);

    return acumulado + (alimento ? alimento.price * item.cantidad : 0);
  }, 0);
};

// Mostrar el menú
function showMenu(req, res) {
  return res.status(200).json(menu);
}

// Mostrar la reserva
function showReservas(req, res) {
  reservas.total = Number(calcularTotalReserva().toFixed(2));
  return res.status(200).json(reservas);
}

// Actualizar la cantidad de porciones reservadas
function actualizarPorciones(req, res) {
  const id = Number(req.params.id);
  const nuevaCantidad = Number(req.body.cantidad);

  if (!Number.isInteger(nuevaCantidad) || nuevaCantidad <= 0) {
    return res.status(400).json({
      mensaje: "La cantidad debe ser positiva y entera",
    });
  }

  const alimento = menu.find((item) => item.id === id);
  const reservado = reservas.itemsReservados.find((item) => item.id === id);

  if (!alimento || !reservado) {
    return res.status(404).json({
      mensaje: "Alimento no encontrado en la reserva",
    });
  }

  const cantidadAnterior = reservado.cantidad;
  const diferencia = nuevaCantidad - cantidadAnterior;
  const variacionPrecio = diferencia * alimento.price;

  if (diferencia > 0 && alimento.stock < diferencia) {
    return res.status(400).json({
      mensaje: "Stock insuficiente",
    });
  }

  if (variacionPrecio > reservas.saldo) {
    return res.status(400).json({
      mensaje: "Saldo insuficiente para esta cantidad",
    });
  }

  // Actualizar stock y saldo según la diferencia
  alimento.stock -= diferencia;
  reservas.saldo -= variacionPrecio;

  reservado.cantidad = nuevaCantidad;
  reservas.total = Number(calcularTotalReserva().toFixed(2));

  return res.status(200).json({
    mensaje: "Porciones actualizadas correctamente",
    saldo: Number(reservas.saldo.toFixed(2)),
    itemsReservados: reservas.itemsReservados,
    total: reservas.total,
  });
}

// Eliminar un plato de la reserva
function eliminarPlato(req, res) {
  const id = Number(req.params.id);

  const reservado = reservas.itemsReservados.find((item) => item.id === id);

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

  // Devolver el stock y reembolsar el importe
  alimento.stock += reservado.cantidad;
  reservas.saldo += alimento.price * reservado.cantidad;

  reservas.itemsReservados = reservas.itemsReservados.filter(
    (item) => item.id !== id,
  );

  reservas.total = Number(calcularTotalReserva().toFixed(2));

  return res.status(200).json({
    mensaje: "Plato eliminado correctamente",
    saldo: Number(reservas.saldo.toFixed(2)),
    itemsReservados: reservas.itemsReservados,
    total: reservas.total,
  });
}

// Agregar un plato a la reserva
function agregarReserva(req, res) {
  const platilloId = Number(req.body.platilloId);
  const cantidad = Number(req.body.cantidad);

  // Validar los datos
  if (
    !Number.isInteger(platilloId) ||
    platilloId <= 0 ||
    !Number.isInteger(cantidad) ||
    cantidad <= 0
  ) {
    return res.status(400).json({
      error: "El ID y la cantidad deben ser enteros positivos",
    });
  }

  // Buscar el plato
  const platillo = menu.find((item) => item.id === platilloId);

  if (!platillo) {
    return res.status(404).json({
      error: "Platillo no encontrado",
    });
  }

  // Verificar el stock
  if (platillo.stock < cantidad) {
    return res.status(400).json({
      error: "No hay suficiente stock",
    });
  }

  // Verificar el saldo
  const totalCosto = platillo.price * cantidad;

  if (reservas.saldo < totalCosto) {
    return res.status(400).json({
      error: "Saldo insuficiente",
    });
  }

  // Actualizar stock y saldo
  platillo.stock -= cantidad;
  reservas.saldo -= totalCosto;

  // Evitar crear entradas duplicadas del mismo plato
  const reservado = reservas.itemsReservados.find(
    (item) => item.id === platilloId,
  );

  if (reservado) {
    reservado.cantidad += cantidad;
  } else {
    reservas.itemsReservados.push({
      id: platillo.id,
      cantidad,
    });
  }

  // Actualizar el total
  reservas.total = Number(calcularTotalReserva().toFixed(2));

  return res.status(201).json({
    mensaje: "Reserva agregada exitosamente",
    saldo: Number(reservas.saldo.toFixed(2)),
    itemsReservados: reservas.itemsReservados,
    total: reservas.total,
  });
}

export {
  showMenu,
  showReservas,
  actualizarPorciones,
  eliminarPlato,
  agregarReserva,
};
