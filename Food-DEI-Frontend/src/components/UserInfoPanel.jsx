import { useState, useEffect } from "react";

import {
  Navbar,
  NavbarBrand,
  Container,
  Row,
  Col,
  Alert,
  Badge,
} from "reactstrap";

import axios from "axios";

export default function UserInfoPanel({ refreshKey }) {
  const [saldo, setSaldo] = useState(0);
  const [totalReserva, setTotalReserva] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarDatos() {
      try {
        setError("");

        const respuestaReserva = await axios.get(
          "http://localhost:3000/api/reserva",
        );

        setSaldo(Number(respuestaReserva.data.saldo));
        setTotalReserva(Number(respuestaReserva.data.total));
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los datos.");
      }
    }

    cargarDatos();
  }, [refreshKey]);

  return (
    <Navbar color="light" light fixed="top" className="shadow-sm py-3">
      <Container fluid>
        <Row className="align-items-center w-100">
          <Col xs="12" md="6" className="mb-2 mb-md-0">
            <NavbarBrand className="fw-bold">Food DEI</NavbarBrand>

            {error && (
              <Alert color="danger" className="mb-0">
                {error}
              </Alert>
            )}
          </Col>

          <Col xs="12" md="6" className="text-md-end">
            <span className="me-2 fw-semibold">Total de tu Reserva:</span>

            <Badge color="dark" pill>
              ${totalReserva.toFixed(2)}
            </Badge>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}
