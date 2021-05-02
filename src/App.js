import React, { Component } from 'react';
import Live from './components/live';
import Export from './components/export';
import Metrices from './components/metrices';
import Query from './components/query';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 0
    }
  }

  onClickMenuItem = (newMode) => {
    this.setState({mode: newMode});
  }

  selectContentToRender = () => {
    switch(this.state.mode) {
      case 1: return <Live/>;
      case 2: return <Export/>;
      case 3: return <Query/>;
      case 4: return <Metrices/>;
      default: return <div id="welcome" className="h3">Welcome to DataView!</div>
    }
  }
  
  render() {
    return (
      <Container fluid id="main" className="p-0">
          <Row id="topbar" className="m-0">
            <Col className="p-3 bg-primary d-flex justify-content-start align-items-center">
              <div className="h1 text-white mb-0 align-middle">
                DataView
              </div>
            </Col>  
          </Row>
          <Row id="middlebar" className="m-0 d-none d-lg-block">
            <Col><div/></Col>
          </Row>
          <Row id="content" className="m-0 no-gutters align-content-start">
            <Col id="menu" className="col-12 col-lg-2">
              <ListGroup variant="flush" className="text-center">
                <ListGroup.Item action onClick={() => this.onClickMenuItem(1)}>Live Data</ListGroup.Item>
                <ListGroup.Item action onClick={() => this.onClickMenuItem(2)}>Export Data</ListGroup.Item>
                <ListGroup.Item action onClick={() => this.onClickMenuItem(3)}>Query Data</ListGroup.Item>
                <ListGroup.Item action onClick={() => this.onClickMenuItem(4)}>Metrices</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col id="content-area" className="col-12 col-lg-10 d-flex justify-content-center align-items-center">
              {this.selectContentToRender()}
            </Col>
          </Row>
        </Container>
    );
  }
}

export default App;
