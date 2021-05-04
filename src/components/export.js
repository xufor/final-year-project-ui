import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import { ToastContainer, toast } from 'react-toastify';
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
            toast.info("No data available!");
            clearInterval(this.interval);
          }
          else {
            const hiddenElement = document.createElement('a');  
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI('Time,Data\n' + response.data);  
            hiddenElement.target = '_blank';
            hiddenElement.download = 'raw_data.csv';  
            hiddenElement.click();
            toast.success("File successfully downloaded!"); 
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

  render() {
    return (
      <React.Fragment>
        <DateTimeRangePicker onChange={this.onDateTimeRangeChange} value={this.pickedValue}/>
        <Button variant="success" size="sm" className="ml-2" onClick={this.onQueryClick}>
          Export to CSV
        </Button>
        <ToastContainer position="bottom-right" limit={3}/>
      </React.Fragment>
    );
  }
}

export default Export;
