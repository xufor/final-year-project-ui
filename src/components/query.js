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

  onDateTimeRangeChange = (changedValue) => {
    this.pickedValue = changedValue;
  }

  onQueryClick = () => {
    const requestTimestamp = Math.floor((this.pickedValue.getTime())/1000);
    axios.get(URL + `/query/${requestTimestamp}`)
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
    tableData = tableData.split("#")
    tableData.pop()
    return(
      <Table striped bordered hover size="sm" className="w-75">
        <thead>
          <tr>
            <th>Time</th>
            <th>Temp</th>
          </tr>
        </thead>
        <tbody>
          {
            tableData.map((element) => {
              let arr = element.split("-")
              return <tr key={`${arr[0]}`}><td>{arr[0]}</td><td>{arr[1]}</td></tr>;
            })
          }
        </tbody>
      </Table>
    );
  }

  render() {
    return (
      <React.Fragment>
        <DateTimePicker onChange={this.onDateTimeRangeChange} value={this.pickedValue}/>
        <Button variant="success" size="sm" className="ml-2" onClick={this.onQueryClick}>
          Query Data
        </Button>
        {this.state.table}
      </React.Fragment>
    );
  }
}

export default Query;
