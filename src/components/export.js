import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { URL } from '../common';
import { isEmpty } from 'lodash';

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
    const lowerRequestTimestamp = this.pickedValue[0].getTime();
    const upperRequestTimestamp = this.pickedValue[1].getTime();
    axios.get(URL + `/query-btw/${lowerRequestTimestamp}/${upperRequestTimestamp}`)
        .then((response) => {
          if(isEmpty(response.data)) {
            toast.info("No data available!");
          }
          else {
            const hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/csv;charset=utf-8,' 
              + encodeURI('Time,Data\n' + response.data.map((e) => new Date(e.timestamp).toISOString() + ',' + e.reading).join('\n'));  
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
