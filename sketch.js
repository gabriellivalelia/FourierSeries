let time = 0;
let resultWave = [];
let partialWaves = [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0]];
let waveTypeIndex = 0;

const waveConfig = [
  [
    "200 / (n * PI)", //Square wave coefficients
    "(100 * 2) / (pow(-1, (n)) * n * PI)", //Sawtooth wave coefficients
    "-200*((pow(-1,n + 1))/(PI*n) +(+6*pow(-1,n))/(pow(PI,3)*pow(n,3)))", //Limited t³ wave coefficients
  ],
  [
    "2*i + 1", //Defines that the sum must start at 1 and only assumes odd values
    "i + 1", //Defines that the sum must start at 1
    "i + 1",
  ],
  ["Square Wave", "Sawtooth Wave", "f(t) = t³, [-1, 1], f(t + 2) = f(t)"],
];

let colors = [
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#00FFFF", // Cyan
  "#FF00FF", // Magenta
  "#FFA500", // Orange
  "#FFC0CB", // Pink
  "#800080", // Purple
];

let lightColors = [
  "#FF6666", // Light Red
  "#66FF66", // Light Green
  "#6666FF", // Light Blue
  "#FFFF99", // Light Yellow
  "#99FFFF", // Light Cyan
  "#FF99FF", // Light Magenta
  "#FFD699", // Light Orange
  "#FFEBEB", // Light Pink
  "#CC99CC", // Light Purple
];

let button;
let slider;
let titleDiv;

function changeWaveIndex() {
  //Changes the type wave
  waveTypeIndex = waveTypeIndex == 2 ? 0 : (waveTypeIndex += 1);

  //Changes the title dynamically
  titleDiv.html(
    "<h1> Fourier Series: " + waveConfig[2][waveTypeIndex] + "</h1>"
  );
}

//Builds the page elements
function setup() {
  createCanvas(1800, 680);

  slider = createSlider(1, 100, 1);

  button = createButton("Change Wave");
  button.position(700, 45);
  button.mousePressed(changeWaveIndex);
  button.style("background-color", "#4CAF50");
  button.style("color", "white");
  button.style("padding", "10px");
  button.style("border-radius", "5px");

  titleDiv = createDiv(
    "<h1> Fourier Series: " + waveConfig[2][waveTypeIndex] + "</h1>"
  );
  titleDiv.style("color", "white");
  titleDiv.position(100, 20);
}

//Draws the waves and circles
function draw() {
  background(0);
  translate(100, 150);

  const coordinatesPartialWavesCircle = [
    [0, 0, 0, 0, 0, 0],
    [0, 100, 200, 300, 400, 500],
  ];

  //Defines the number of partial circles will be drawing
  let limit = slider.value() <= 6 ? slider.value() : 10;

  //Draw the partial circle
  for (let i = 0; i < limit; i++) {
    let prevx = coordinatesPartialWavesCircle[0][i];
    let prevy = coordinatesPartialWavesCircle[1][i];

    let n = eval(waveConfig[1][waveTypeIndex]);
    let radius = eval(waveConfig[0][waveTypeIndex]);

    coordinatesPartialWavesCircle[0][i] += radius * cos(2 * PI * n * time);
    coordinatesPartialWavesCircle[1][i] += radius * sin(2 * PI * n * time);

    stroke(lightColors[i % 9]);
    noFill();
    ellipse(0, 0 + 100 * i, radius * 2);

    stroke(colors[i % 9]);
    line(
      prevx,
      prevy,
      coordinatesPartialWavesCircle[0][i],
      coordinatesPartialWavesCircle[1][i]
    );
  }

  for (let i = 0; i < limit; i++) {
    partialWaves[i].unshift(coordinatesPartialWavesCircle[1][i]);
  }

  translate(200, 0);
  noFill();

  //Draws the partial waves
  for (let i = 0; i < limit; i++) {
    stroke(colors[i % 9]);
    line(
      coordinatesPartialWavesCircle[0][i] - 200,
      coordinatesPartialWavesCircle[1][i],
      0,
      partialWaves[i][0]
    );
    beginShape();
    for (let j = 0; j < partialWaves[i].length; j++) {
      vertex(j, partialWaves[i][j]);
    }
    endShape();
  }

  translate(600, 240);

  let coordinateResultWave = [0, 0];

  //Drawns the complete circle
  for (let i = 0; i < slider.value(); i++) {
    let prevx = coordinateResultWave[0];
    let prevy = coordinateResultWave[1];

    let n = eval(waveConfig[1][waveTypeIndex]);
    let radius = eval(waveConfig[0][waveTypeIndex]);

    coordinateResultWave[0] += radius * cos(n * 2 * PI * time);
    coordinateResultWave[1] += radius * sin(n * 2 * PI * time);

    stroke(lightColors[i % 9]);
    noFill();
    ellipse(prevx, prevy, radius * 2);

    stroke(colors[i % 9]);
    line(prevx, prevy, coordinateResultWave[0], coordinateResultWave[1]);
  }

  resultWave.unshift(coordinateResultWave[1]);

  stroke(255);
  translate(200, 0);
  line(
    coordinateResultWave[0] - 200,
    coordinateResultWave[1],
    0,
    resultWave[0]
  );
  //Draws the complete wave
  beginShape();
  noFill();
  for (let i = 0; i < resultWave.length; i++) {
    vertex(i, resultWave[i]);
  }
  endShape();

  //Clears the vectors
  if (resultWave.length > 600) {
    resultWave.pop();
  }

  for (let i = 0; i < 6; i++) {
    if (partialWaves[i].length > 400) {
      partialWaves[i].pop();
    }
  }

  //Makes the phasor move
  time -= 0.005;
}
