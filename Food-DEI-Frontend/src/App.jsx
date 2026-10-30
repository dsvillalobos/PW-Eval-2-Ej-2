import { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import UserInfoPanel from "./components/UserInfoPanel";
import Menu from "./components/Menu";
import Reserva from "./components/Reserva";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const actualizarDatos = () => {
    setRefreshKey((actual) => actual + 1);
  };

  return (
    <>
      <UserInfoPanel refreshKey={refreshKey} />

      <Container fluid style={{ paddingTop: "120px" }}>
        <Row>
          <Col xs="12" lg="8">
            <Menu
              refreshKey={refreshKey}
              onReservaActualizada={actualizarDatos}
            />
          </Col>

          <Col xs="12" lg="4">
            <Reserva
              refreshKey={refreshKey}
              onReservaActualizada={actualizarDatos}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
