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
import { ToastContainer, toast } from 'react-toastify';
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
    this.interval = setInterval(this.requestDataAndUpdateChart(), 1000);
    // although requestDataAndUpdateChart is called here, it will return reference to itself
    // using this we ensure that the function is called once and then further at intervals of 2 seconds
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
          x: {
            title: {
              display: true,
              color: 'red',
              text: "Time"
            }
          },
          y: {
            title: {
              display: true,
              color: 'red',
              text: "Temperature(Celsius)"
            },
            beginAtZero: false,
            suggestedMin: 32,
            suggestedMax: 33,
            precision: 0.01
          }
        }
      }
    });
  }

  requestDataAndUpdateChart = () => {
    axios.get(URL + `/latest`)
      .then((response) => {
        if (response.data === "No data exists") {
          toast.info("No data exists!");
          clearInterval(this.interval);
        }
        else {
          const receivedData = response.data;
          const splitData = receivedData.split("-");
          const receivedTimestamp = Number.parseInt(splitData[0]);
          if (receivedTimestamp !== this.lastTimestamp) {
            if (this.liveChart.data.labels.length === 15) {
              this.liveChart.data.labels.shift();
              this.liveChart.data.datasets[0].data.shift();
            }
            this.liveChart.data.labels.push(new Date(receivedTimestamp * 1000).toTimeString().substring(0, 8));
            this.liveChart.data.datasets[0].data.push(Number.parseFloat(splitData[1]));
            this.liveChart.update();
            this.lastTimestamp = receivedTimestamp;
          }
          else {
            console.log("Stale data received.");
          }
        }
      })
      .catch((error) => {
        if (error.message === "Network Error") {
          toast.error("Cannot connect to server!");
        }
        else {
          toast.error("Some unknown error occured!");
        }
        clearInterval(this.interval);
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
        <ToastContainer position="bottom-right" limit={1} />
      </div>
    );
  }
}

export default Live;
