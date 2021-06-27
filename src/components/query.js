import React, { Component } from 'react';
import { Button, Table } from 'react-bootstrap';
import DateTimePicker from 'react-datetime-picker';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { URL } from '../common';
import { isEmpty } from 'lodash';


class Query extends Component {
  constructor(props) {
    super(props);
    this.pickedValue = new Date();
    this.state = {
      table: null
    }
  }

  onDateTimeChange = (changedValue) => {
    this.pickedValue = changedValue;
  }

  onQueryClick = () => {
    axios.get(URL + `/query-few/${this.pickedValue.getTime()}`)
        .then((response) => {
          if(isEmpty(response.data)) {
            toast.info("No data available!");
          }
          else {
            this.setState({table:this.generateTable(response.data)});
            toast.success("Data successfully loaded!"); 
          }
        })
        .catch((error) => {
          if(error.message === "Network Error") {
            toast.error("Cannot connect to server!");
          }
          else {
            console.log(error);
            toast.error("Some unknown error occured!");
          }
        })
  }
  
  generateTable = (tableData) => {
    return(
      <Table striped bordered hover size="sm" className="w-75">
        <thead>
          <tr>
            <th>Time</th>
            <th>Temperature(Celcius)</th>
          </tr>
        </thead>
        <tbody>
          {
            tableData.map((element) => {
              return (
                <tr key={`${element.timestamp}`}>
                  <td>{new Date(element.timestamp).toGMTString()}</td>
                  <td>{element.reading}</td>
                </tr>
              );
            })
          }
        </tbody>
      </Table>
    );
  }

  render() {
    return (
      <React.Fragment>
        <DateTimePicker onChange={this.onDateTimeChange} value={this.pickedValue}/>
        <Button variant="success" size="sm" className="ml-2" onClick={this.onQueryClick}>
          Query Data
        </Button>
        {this.state.table}
        <ToastContainer position="bottom-right" limit={3}/>
      </React.Fragment>
    );
  }
}

export default Query;
