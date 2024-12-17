let production = 0;
let batteryLevel = 50;
let totalProduction = 0;
let productionInterval;
let mode = "day"; // "day" or "night"

// Sukuriamas grafikas su dviem ašimis
const ctx = document.getElementById('productionChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Elektros gamyba (kW)',
                borderColor: 'blue',
                data: [],
                fill: false,
                yAxisID: 'y'
            },
            {
                label: 'Bendra gamyba (kW)',
                borderColor: 'red',
                data: [],
                fill: false,
                yAxisID: 'y'
            },
            {
                label: 'Akumuliatoriaus lygis (%)',
                borderColor: 'green',
                data: [],
                fill: false,
                yAxisID: 'y1'
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Laikas'
                }
            },
            y: {
                position: 'left',
                title: {
                    display: true,
                    text: 'Gamyba (kW)'
                },
                beginAtZero: true
            },
            y1: {
                position: 'right',
                title: {
                    display: true,
                    text: 'Akumuliatoriaus lygis (%)'
                },
                beginAtZero: true,
                suggestedMax: 500 // Padidinta akumuliatoriaus talpa
            }
        }
    }
});

function updateChart() {
    const currentTime = new Date().toLocaleTimeString();

    // Pridedami duomenys
    chart.data.labels.push(currentTime);
    chart.data.datasets[0].data.push(production);
    chart.data.datasets[1].data.push(totalProduction);
    chart.data.datasets[2].data.push(batteryLevel);

    // Laikome grafike ne daugiau kaip 50 reikšmių
    const maxDataPoints = 50;

    if (chart.data.labels.length > maxDataPoints) {
        chart.data.labels = chart.data.labels.slice(-maxDataPoints);
        chart.data.datasets.forEach(dataset => {
            dataset.data = dataset.data.slice(-maxDataPoints);
        });
    }

    chart.update();
}

// Funkcija pradėti elektros gamybą
function startProduction() {
    if (!productionInterval) {
        productionInterval = setInterval(() => {
            const productionIncrease = Math.random() * (mode === "day" ? 10 : 5);
            production += productionIncrease;
            batteryLevel = Math.min(500, batteryLevel + Math.random() * (mode === "day" ? 10 : 5)); // Nauja talpa
            totalProduction += productionIncrease;

            updateStatus();
            updateChart();
        }, 100); // Dažnesnis atnaujinimas
        displayMessage("Gamyba pradėta.");
    }
}

// Funkcija sustabdyti elektros gamybą
function stopProduction() {
    clearInterval(productionInterval);
    productionInterval = null;
    displayMessage("Gamyba sustabdyta.");
}

// Funkcija simuliuoti debesis
function simulateClouds() {
    production = Math.max(0, production - Math.random() * 20);
    batteryLevel = Math.max(0, batteryLevel - Math.random() * 10);
    updateStatus();
    updateChart();
    displayMessage("Simuliuoti debesys sumažino gamybą.");
}

// Funkcija perjungti režimą
function toggleMode() {
    mode = mode === "day" ? "night" : "day";
    displayMessage(`Režimas perjungtas į ${mode === "day" ? "dienos" : "nakties"} režimą.`);
}

// Funkcija optimizuoti akumuliatorių
function optimizeBattery() {
    if (batteryLevel < 50) {
        batteryLevel = Math.min(100, batteryLevel + 20);
        displayMessage("Akumuliatorius optimizuotas.");
    } else {
        displayMessage("Akumuliatorius yra pakankamai įkrautas.");
    }
    updateStatus();
    updateChart();
}

// Funkcija rankiniam duomenų įvedimui
function manualInput() {
    const userProduction = parseFloat(prompt("Įveskite gamybos lygį (kW):"));
    const userBattery = parseFloat(prompt("Įveskite akumuliatoriaus lygį (%):"));

    if (!isNaN(userProduction) && userProduction >= 0) {
        production = userProduction;
    }

    if (!isNaN(userBattery) && userBattery >= 0 && userBattery <= 100) {
        batteryLevel = userBattery;
    }

    updateStatus();
    updateChart();
    displayMessage("Duomenys atnaujinti rankiniu būdu.");
}

// Funkcija atnaujinti statuso rodinius
function updateStatus() {
    document.getElementById('production').textContent = production.toFixed(2) + ' kW';
    document.getElementById('battery').textContent = batteryLevel.toFixed(0) + '%';
}

// Funkcija išvesti pranešimą vartotojui
function displayMessage(message) {
    const output = document.getElementById('output');
    output.textContent = message;
}