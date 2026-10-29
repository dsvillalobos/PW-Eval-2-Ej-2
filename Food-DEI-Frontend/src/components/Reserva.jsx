import { useEffect, useState } from "react";
import axios from "axios";

import {
  Container,
  ListGroup,
  ListGroupItem,
  Button,
  ButtonGroup,
  UncontrolledAlert,
  Alert,
  Spinner,
} from "reactstrap";

import "bootstrap/dist/css/bootstrap.min.css";

export default function Reserva({ refreshKey, onReservaActualizada }) {
  const [reserva, setReserva] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const API = "http://localhost:3000/api";

  const obtenerReserva = async () => {
    const respuesta = await axios.get(`${API}/reserva`);
    setReserva(respuesta.data);
  };

  const obtenerMenu = async () => {
    const respuesta = await axios.get(`${API}/menu`);
    setMenu(respuesta.data);
  };

  const cargarDatos = async () => {
    try {
      await Promise.all([obtenerReserva(), obtenerMenu()]);
    } catch (error) {
      setError(
        error.response?.data?.mensaje ||
          error.response?.data?.error ||
          "No se pudieron cargar los datos.",
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [refreshKey]);

  const actualizarPorciones = async (id, cantidad) => {
    if (cantidad <= 0) return;

    try {
      setProcesando(true);
      setError("");
      setMensaje("");

      const respuesta = await axios.put(
        `${API}/reserva/actualizar-porciones/${id}`,
        { cantidad },
      );

      setMensaje(respuesta.data.mensaje);

      onReservaActualizada();
    } catch (error) {
      setError(
        error.response?.data?.mensaje ||
          error.response?.data?.error ||
          "No se pudieron actualizar las porciones.",
      );
    } finally {
      setProcesando(false);
    }
  };

  const eliminarPlato = async (id) => {
    try {
      setProcesando(true);
      setError("");
      setMensaje("");

      const respuesta = await axios.delete(`${API}/reserva/eliminar/${id}`);

      setMensaje(respuesta.data.mensaje);

      await cargarDatos();
    } catch (error) {
      setError(
        error.response?.data?.mensaje ||
          error.response?.data?.error ||
          "No se pudo quitar el plato de la reserva.",
      );
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) {
    return (
      <Container className="text-center py-4">
        <Spinner color="primary" />
        <p className="mt-2">Cargando reserva...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h3 className="mb-3">Tu Bandeja de Reserva</h3>

      {error && <UncontrolledAlert color="warning">{error}</UncontrolledAlert>}

      {mensaje && (
        <Alert color="success">
          {mensaje}
          <Button close onClick={() => setMensaje("")} />
        </Alert>
      )}

      {reserva && (
        <>
          <p>
            <strong>Cliente:</strong> {reserva.nombre}
          </p>

          <p>
            <strong>Saldo disponible:</strong> $
            {Number(reserva.saldo).toFixed(2)}
          </p>

          <ListGroup className="mb-3">
            {reserva.itemsReservados.length === 0 ? (
              <ListGroupItem>No has seleccionado ningún plato.</ListGroupItem>
            ) : (
              reserva.itemsReservados.map((item) => {
                const plato = menu.find((producto) => producto.id === item.id);

                if (!plato) return null;

                return (
                  <ListGroupItem
                    key={item.id}
                    className="d-flex justify-content-between align-items-center flex-wrap gap-2"
                  >
                    <div>
                      <strong>{plato.name}</strong>

                      <br />

                      <small>
                        Precio por porción: ${Number(plato.price).toFixed(2)}
                      </small>

                      <br />

                      <small>
                        Subtotal: ${(plato.price * item.cantidad).toFixed(2)}
                      </small>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <ButtonGroup size="sm">
                        <Button
                          color="secondary"
                          outline
                          disabled={procesando || item.cantidad <= 1}
                          onClick={() =>
                            actualizarPorciones(item.id, item.cantidad - 1)
                          }
                        >
                          -
                        </Button>

                        <Button color="light" disabled>
                          {item.cantidad}
                        </Button>

                        <Button
                          color="secondary"
                          outline
                          disabled={procesando}
                          onClick={() =>
                            actualizarPorciones(item.id, item.cantidad + 1)
                          }
                        >
                          +
                        </Button>
                      </ButtonGroup>

                      <Button
                        color="danger"
                        outline
                        size="sm"
                        disabled={procesando}
                        onClick={() => eliminarPlato(item.id)}
                      >
                        Quitar
                      </Button>
                    </div>
                  </ListGroupItem>
                );
              })
            )}
          </ListGroup>

          <div className="text-end">
            <h5>Total: ${Number(reserva.total).toFixed(2)}</h5>
          </div>
        </>
      )}
    </Container>
  );
}
