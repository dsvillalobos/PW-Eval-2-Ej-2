import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Badge,
  Button,
  Alert,
  Spinner,
} from "reactstrap";

import "bootstrap/dist/css/bootstrap.min.css";

export default function Menu({ refreshKey, onReservaActualizada }) {
  const [menu, setMenu] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [platoAgregando, setPlatoAgregando] = useState(null);

  const obtenerMenu = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await axios.get("http://localhost:3000/api/menu");

      setMenu(respuesta.data);
    } catch (error) {
      setError("No se pudo cargar el menú.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerMenu();
  }, [refreshKey]);

  const agregarReserva = async (platilloId) => {
    try {
      setPlatoAgregando(platilloId);
      setError("");
      setMensaje("");

      const respuesta = await axios.post(
        "http://localhost:3000/api/reserva/agregar",
        {
          platilloId: platilloId,
          cantidad: 1,
        },
      );

      setMensaje(respuesta.data.mensaje);

      onReservaActualizada();
    } catch (error) {
      setError(
        error.response?.data?.error ||
          error.response?.data?.mensaje ||
          "No se pudo agregar el plato a la reserva.",
      );
    } finally {
      setPlatoAgregando(null);
    }
  };

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Menú del Día</h2>

      {mensaje && <Alert color="success">{mensaje}</Alert>}

      {error && <Alert color="danger">{error}</Alert>}

      {cargando ? (
        <div className="text-center py-5">
          <Spinner color="primary" />
          <p className="mt-2">Cargando menú...</p>
        </div>
      ) : (
        <Row>
          {menu.map((plato) => (
            <Col xs="12" md="4" key={plato.id}>
              <Card className="mb-3 h-100">
                {plato.image && (
                  <img
                    src={plato.image}
                    alt={plato.name}
                    className="card-img-top"
                    style={{
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                )}

                <CardBody className="d-flex flex-column">
                  <CardTitle tag="h5">{plato.name}</CardTitle>

                  <CardText>
                    <strong>Categoría:</strong> {plato.categoria}
                  </CardText>

                  <CardText>
                    <strong>Precio:</strong>{" "}
                    <Badge color="success">${plato.price.toFixed(2)}</Badge>
                  </CardText>

                  <CardText>
                    <strong>Stock disponible:</strong> {plato.stock}
                  </CardText>

                  <CardText>{plato.description}</CardText>

                  <div className="mt-auto">
                    {plato.stock === 0 ? (
                      <Button color="secondary" disabled block>
                        Agotado
                      </Button>
                    ) : (
                      <Button
                        color="primary"
                        block
                        disabled={platoAgregando !== null}
                        onClick={() => agregarReserva(plato.id)}
                      >
                        {platoAgregando === plato.id
                          ? "Agregando..."
                          : "Añadir a la Reserva"}
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
