import React, { Component } from 'react';
import { Button, Table } from 'react-bootstrap';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import axios from 'axios';
import { URL } from '../common';

class Metrices extends Component {
  constructor(props) {
    super(props);
    this.pickedValue = [new Date(), new Date()];
    this.state = {
      table: null
    }
  }

  onDateTimeRangeChange = (changedValue) => {
    this.pickedValue[0] = changedValue[0];
    this.pickedValue[1] = changedValue[1];
  }

  onQueryClick = () => {
    const lowerRequestTimestamp = Math.floor((this.pickedValue[0].getTime())/1000);
    const upperRequestTimestamp = Math.ceil((this.pickedValue[1].getTime())/1000);
    axios.get(URL + `/query/mtr/${lowerRequestTimestamp}-${upperRequestTimestamp}`)
        .then((response) => {
          if(response.data === "No data fetched") {
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
    tableData = tableData.split("-")
    return(
      <Table striped bordered hover size="sm" className="w-75">
        <thead>
          <tr>
            <th>Type</th>
            <th>Value(Celsius)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Minimum</td>
            <td>{tableData[0]}</td>
          </tr>
          <tr>
            <td>Maximum</td>
            <td>{tableData[1]}</td>
          </tr>
          <tr>
            <td>Average</td>
            <td>{tableData[2]}</td>
          </tr>
        </tbody>
      </Table>
    );
  }

  render() {
    return (
      <React.Fragment>
        <DateTimeRangePicker onChange={this.onDateTimeRangeChange} value={this.pickedValue}/>
        <Button variant="success" size="sm" className="ml-2" onClick={this.onQueryClick}>
          Show
        </Button>
        {this.state.table}
      </React.Fragment>
    );
  }
}

export default Metrices;
