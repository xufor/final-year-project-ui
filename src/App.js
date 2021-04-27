import './App.css';
import { Container, Row, Col } from 'react-bootstrap';


function App() {
  return (
    <Container fluid className="p-0 h-100">
        <Row id="topbar" className="m-0">
          <Col className="p-3 bg-primary d-flex justify-content-start align-items-center">
            <div className="h2 text-white mb-0 align-middle">
              DataView
            </div>
          </Col>
        </Row>
        <Row id="content">
          <Col className="bg-light d-flex justify-content-center flex-column align-items-center">
          </Col>
        </Row>
      </Container>
  );
}

export default App;
