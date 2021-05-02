import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import axios from 'axios';
import { URL } from '../common';

class Export extends Component {
  constructor(props) {
    super(props);
    this.pickedValue = [new Date(), new Date()];
  }

  onDateTimeRangeChange = (changedValue) => {
    this.pickedValue[0] = changedValue[0];
    this.pickedValue[1] = changedValue[1];
  }

  onQueryClick = () => {
    const lowerRequestTimestamp = Math.floor((this.pickedValue[0].getTime())/1000);
    const upperRequestTimestamp = Math.ceil((this.pickedValue[1].getTime())/1000);
    axios.get(URL + `/query/all/${lowerRequestTimestamp}-${upperRequestTimestamp}`)
        .then((response) => {
          if(response.data === "No rows fetched") {
            alert("No data available.");
          }
          else {
            const hiddenElement = document.createElement('a');  
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI('Time,Data\n' + response.data);  
            hiddenElement.target = '_blank';
            hiddenElement.download = 'raw_data.csv';  
            hiddenElement.click(); 
          }
        })
        .catch((error) => {
          console.log("Error in making get request.")
          console.log(error);
        })
  }

  render() {
    return (
      <React.Fragment>
        <DateTimeRangePicker onChange={this.onDateTimeRangeChange} value={this.pickedValue}/>
        <Button variant="success" size="sm" className="ml-2" onClick={this.onQueryClick}>
          Export to CSV
        </Button>
      </React.Fragment>
    );
  }
}

export default Export;
