const tempCtx = document.getElementById('temperatureChart').getContext('2d');
const tempChart = new Chart(tempCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature (°C)',
            data: [],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { title: { display: true, text: 'Time' } },
            y: { 
                title: { display: true, text: 'Temperature (°C)' },
                ticks: { stepSize: 1 } 
            }
        }
    }
});

const humCtx = document.getElementById('humidityChart').getContext('2d');
const humChart = new Chart(humCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Humidity (%)',
            data: [],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { title: { display: true, text: 'Time' } },
            y: { title: { display: true, text: 'Humidity (%)' } }
        }
    }
});

const mqCtx = document.getElementById('mq135Chart').getContext('2d');
const mqChart = new Chart(mqCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Air Quality (CO2 Levels)',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { title: { display: true, text: 'Time' } },
            y: { title: { display: true, text: 'CO2 Levels (ppm)' } }
        }
    }
});

const dustCtx = document.getElementById('dustSensorChart').getContext('2d');
const dustChart = new Chart(dustCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Dust Concentration (μg/m³)',
            data: [],
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { title: { display: true, text: 'Time' } },
            y: { title: { display: true, text: 'Dust Concentration (μg/m³)' } }
        }
    }
});

// Function to update the charts with real-time data
function updateCharts() {
    fetch('http://192.168.1.6/data')  
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const now = new Date().toLocaleTimeString();

            // Update Temperature Chart
            tempChart.data.labels.push(now);
            tempChart.data.datasets[0].data.push(data.temperature);
            tempChart.update();

            // Update Humidity Chart
            humChart.data.labels.push(now);
            humChart.data.datasets[0].data.push(data.humidity);
            humChart.update();

            // Update Air Quality Chart
            mqChart.data.labels.push(now);
            mqChart.data.datasets[0].data.push(data.mq135);
            mqChart.update();

            // Update Dust Sensor Chart
            dustChart.data.labels.push(now);
            dustChart.data.datasets[0].data.push(data.dust);
            dustChart.update();

            // Update Stats
            document.getElementById('avg-temp').textContent = `${data.temperature ? data.temperature.toFixed(1) : 'N/A'} °C`;
            document.getElementById('avg-hum').textContent = `${data.humidity ? data.humidity.toFixed(1) : 'N/A'} %`;
            document.getElementById('avg-air').textContent = `${data.mq135 ? data.mq135 : 'N/A'} ppm`;
            document.getElementById('avg-dust').textContent = `${data.dust ? data.dust.toFixed(1) : 'N/A'} μg/m³`;

            // Display warning if thresholds are exceeded
            const warningElement = document.getElementById('warning');
            if (data.temperature > 30 || data.humidity > 70 || data.mq135 > 300 || data.dust > 150) {
                warningElement.style.display = 'block';
                warningElement.textContent = 'Warning: Threshold exceeded!';
            } else {
                warningElement.style.display = 'none';
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Set interval to update every 2 seconds
setInterval(updateCharts, 2000);
