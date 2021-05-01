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
    this.last_ts = null;
  }

  componentDidMount() {
    var ctx = document.getElementById('live-chart').getContext('2d');
    var liveChart = new Chart(ctx, {
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
    this.last_ts = (new Date().getTime())/1000;
    this.interval = setInterval(() => {
      axios.get(URL + `/fetch/${this.last_ts}`)
        .then((response) => {
          if(response.data === "nnda") {
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
            if(liveChart.data.labels.length === 15) {
              liveChart.data.labels.shift();
              liveChart.data.datasets[0].data.shift(); 
            }
            liveChart.data.labels.push(s);
            liveChart.data.datasets[0].data.push(Math.random() * (50 - 20) + 20); 
            liveChart.update();
            this.last_ts = receivedTimestamp;
          }
        })
        .catch((error) => {
          clearInterval(this.interval);
          console.log("Error in making get request.")
          console.log(error);
        })
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <canvas id="live-chart"></canvas>
      </div>
    );
  }
}

export default Live;
