// Function to handle the music upload and play
function uploadFile() {
  let fileInput = document.getElementById('fileInput');
  let file = fileInput.files[0];
  let formData = new FormData();
  formData.append('file', file);

  fetch('/upload', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      if (data.bpm) {
        const mode = document.getElementById('visualizationMode').value
        playMusicAndSyncVisuals(file, data.bpm, mode);
      } else {
        alert('Error processing file');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function reloadPage() {
  window.location.reload();
}

// Function to toggle fullscreen for the canvas
function toggleFullscreen() {
  let canvas = document.getElementById('visualizerCanvas');
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch(err => {
      alert(`Error attempting to enable full-screen mode: ${err.message}`);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// Function to play music and synchronize visuals
function playMusicAndSyncVisuals(file, bpm, mode) {
  let url = URL.createObjectURL(file);
  let audio = new Audio(url);
  audio.play();

  let canvas = document.getElementById('visualizerCanvas');
  let ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = 1100;

  let lastBeatTime = Date.now();
  let beatInterval = 60000 / bpm; // Convert BPM to interval in milliseconds

  function draw() {
    requestAnimationFrame(draw);
    let currentTime = Date.now();

    if (currentTime - lastBeatTime >= beatInterval) {
      lastBeatTime = currentTime;
      switch (mode) {
        case 'colorfulBars':
          drawColorfulBars(ctx, canvas.width, canvas.height, bpm);
          break;
        case 'expandingCirles':
          drawExpandingCircles(ctx, canvas.width, canvas.height, bpm, 1000);
          break;
        case 'randomSquares':
          drawRandomSquares(ctx, canvas.width, canvas.height, 50);
          break;
        case 'colorfulStrobe':
          fillCanvasWithRandomColor(ctx, canvas.width, canvas.height);
          break;
      }
    }
  }
  draw();
}

function fillCanvasWithRandomColor(ctx, width, height) {
  ctx.fillStyle = 'rgb(' +
    Math.floor(Math.random() * 256) + ',' +
    Math.floor(Math.random() * 256) + ',' +
    Math.floor(Math.random() * 256) + ')';
  ctx.fillRect(0, 0, width, height);
}

// Function to draw colorful bars
function drawColorfulBars(ctx, width, height, beat) {
  ctx.clearRect(0, 0, width, height);
  let barWidth = (width / beat);
  for (let i = 0; i < beat; i++) {
    let barHeight = Math.random() * height;
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight);
  }
}

// Function to draw expanding circles
function drawExpandingCircles(ctx, width, height, beat, maxSize) {
  ctx.clearRect(0, 0, width, height);
  let radius = (maxSize / beat);
  for (let i = 0; i < beat; i++) {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, radius * (i + 1), 0, 2 * Math.PI);
    ctx.strokeStyle = `rgb(${r},${g},${b})`;
    ctx.stroke();
  }
}

// Function to draw random squares
function drawRandomSquares(ctx, width, height, count) {
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < count; i++) {
    let x = Math.random() * width;
    let y = Math.random() * height;
    let size = Math.random() * 50;
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, y, size, size);
  }
}
