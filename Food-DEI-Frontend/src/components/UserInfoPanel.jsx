
import { useState, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  Container,
  Row,
  Col,
  Alert,
  Badge
} from "reactstrap";

import axios from "axios";

export default function UserInfoPanel() {
  const [saldo, setSaldo] = useState(0);
  const [totalReserva, setTotalReserva] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarDatos() {
      try {
        const respuestaMenu = await axios.get(
          "http://localhost:3000/api/menu"
        );

        const respuestaReserva = await axios.get(
          "http://localhost:3000/api/reserva"
        );

        setSaldo(respuestaMenu.data.saldo);
        setTotalReserva(respuestaReserva.data.totalReserva);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los datos.");
      }
    }

    cargarDatos();
  }, []);

  return (
    <Navbar
      color="light"
      light
      fixed="top"
      className="shadow-sm py-3"
    >
      <Container fluid>
        <Row className="align-items-center w-100">
          <Col xs="12" md="6" className="mb-2 mb-md-0">
            <NavbarBrand className="fw-bold">
              Mi Panel
            </NavbarBrand>

            {error ? (
              <Alert color="danger" className="mb-0">
                {error}
              </Alert>
            ) : (
              <Alert color="info" className="mb-0">
                Tu saldo actual: ${Number(saldo).toFixed(2)}
              </Alert>
            )}
          </Col>

          <Col xs="12" md="6" className="text-md-end">
            <span className="me-2 fw-semibold">
              Total de tu Reserva:
            </span>

            <Badge color="dark" pill>
              ${Number(totalReserva).toFixed(2)}
            </Badge>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}
