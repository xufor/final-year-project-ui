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
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

Chart.register(LineController, CategoryScale, LineElement, PointElement, LinearScale, Title);

class Live extends Component {
  constructor(props) {
    super(props);
    this.liveChart = null;
    this.stompClient = null;
  }

  componentDidMount() {
    this.initializeChart();
    var socket = new SockJS('http://20.193.232.92:8080/stomp-endpoint');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame) => {
      this.stompClient.subscribe('/topic/readings', (reading) =>
        this.updateChart(JSON.parse(reading.body))
      );
      toast.success('Connected to live feed successfully!');
    });
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

  updateChart = (messageData) => {
    if (this.liveChart.data.labels.length === 25) {
      this.liveChart.data.labels.shift();
      this.liveChart.data.datasets[0].data.shift();
    }
    this.liveChart.data.labels
      .push(new Date(Number.parseInt(messageData.timestamp)).toTimeString().substring(0, 8));
    this.liveChart.data.datasets[0].data
      .push(Number.parseFloat(messageData.reading));
    this.liveChart.update();
}

componentWillUnmount() {
  this.stompClient.disconnect(() => {
    toast.info("Disconnected from live feed successfully!");
  });
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
