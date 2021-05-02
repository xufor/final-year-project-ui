import React, { Component } from 'react';
import { Button, Table } from 'react-bootstrap';
import DateTimePicker from 'react-datetime-picker';
import axios from 'axios';
import { URL } from '../common';


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
    const requestTimestamp = Math.floor((this.pickedValue.getTime())/1000);
    axios.get(URL + `/query/min/${requestTimestamp}`)
        .then((response) => {
          if(response.data === "No rows fetched") {
            alert("No data available.");
          }
          else {
            this.setState({table:this.generateTable(response.data)});
          }
        })
        .catch((error) => {
          console.log("Error in making get request.")
          console.log(error);
        })
  }
  
  generateTable = (tableData) => {
    tableData = tableData.split("\n")
    tableData.pop()
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
              let arr = element.split(",")
              return (
                <tr key={`${arr[0]}`}>
                  <td>{new Date(Number.parseInt(arr[0])*1000).toTimeString()}</td>
                  <td>{arr[1]}</td>
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
      </React.Fragment>
    );
  }
}

export default Query;
