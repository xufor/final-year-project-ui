import React, { Component } from 'react';
import { Button, Table } from 'react-bootstrap';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { URL } from '../common';
import { isNull, round } from 'lodash';

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
    const lowerRequestTimestamp = this.pickedValue[0].getTime();
    const upperRequestTimestamp = this.pickedValue[1].getTime();
    axios.get(URL + `/query-mtr/${lowerRequestTimestamp}/${upperRequestTimestamp}`)
        .then((response) => {
          if(isNull(response.data[0][0])) {
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
            toast.error("Some unknown error occured!");
          }
        })
  }

  generateTable = (tableData) => {
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
            <td>{round(tableData[0][0], 2)}</td>
          </tr>
          <tr>
            <td>Maximum</td>
            <td>{round(tableData[0][1], 2)}</td>
          </tr>
          <tr>
            <td>Average</td>
            <td>{round(tableData[0][2], 2)}</td>
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
        <ToastContainer position="bottom-right" limit={3}/>
      </React.Fragment>
    );
  }
}

export default Metrices;
