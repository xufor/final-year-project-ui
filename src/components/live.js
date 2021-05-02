import React, { Component } from 'react';
import { 
  Chart, 
  CategoryScale, 
  LineController, 
  LineElement, 
  PointElement, 
  LinearScale, 
  Title 
} from 'chart.js';
import axios from 'axios';
import { URL } from '../common';

Chart.register(LineController, CategoryScale, LineElement, PointElement, LinearScale, Title);

class Live extends Component {
  constructor(props) {
    super(props);
    this.interval = null;
    this.liveChart = null;
    this.lastTimestamp = 0;
  }

  componentDidMount() {
    this.initializeChart();
    this.lastTimestamp = Math.floor((new Date().getTime())/1000)-5;
    this.interval = setInterval(this.requestDataAndUpdateChart(), 3000); 
    // although requestDataAndUpdateChart is called here, it will return reference to itself
    // using this we ensure that the function is called once and then further at intervals of 3 seconds
  }

  initializeChart = () => {
    var ctx = document.getElementById('live-chart').getContext('2d');
    this.liveChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Time',
          data: [],
          borderColor: '#0390fc',
          borderWidth: 3
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
            suggestedMin: 20,
            suggestedMax: 50
          }
        }
      }
    });
  }

  requestDataAndUpdateChart = () => {
    axios.get(URL + `/fetch/${this.lastTimestamp}`)
        .then((response) => {
          if(response.data === "No new data") {
            alert("No newer data available.");
            clearInterval(this.interval);
          }
          else {
            const receivedData = response.data;
            const splitData = receivedData.split("-");
            const receivedTimestamp = Number.parseInt(splitData[0]);
            const dateObject = new Date(receivedTimestamp * 1000);
            let s = dateObject.getHours().toString() + 
                    ":" + 
                    dateObject.getMinutes().toString() + 
                    ":" + 
                    dateObject.getSeconds().toString();
            if(this.liveChart.data.labels.length === 15) {
              this.liveChart.data.labels.shift();
              this.liveChart.data.datasets[0].data.shift(); 
            }
            this.liveChart.data.labels.push(s);
            this.liveChart.data.datasets[0].data.push(Math.random() * (50 - 20) + 20); 
            this.liveChart.update();
            this.lastTimestamp = receivedTimestamp;
          }
        })
        .catch((error) => {
          clearInterval(this.interval);
          console.log("Error in making get request.")
          console.log(error);
        })
        return this.requestDataAndUpdateChart; // returning reference to the same function
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div id="live-char-wrapper">
        <canvas id="live-chart"></canvas>
      </div>
    );
  }
}

export default Live;
