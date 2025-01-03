// Variables for canvas
const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

// Set canvas to fill available space dynamically
function resizeCanvas() {
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = canvas.parentElement.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Variables for drawing
let isDrawing = false;
let brushColor = "#000000";
let brushSize = 10;

// Event listeners for drawing
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

// Event listeners for controls
document.getElementById("color").addEventListener("input", (e) => {
  brushColor = e.target.value;
});

document.getElementById("size").addEventListener("input", (e) => {
  const value = parseInt(e.target.value, 10);
  if (value >= 2 && value <= 50) {
    brushSize = value;
  }
});

document.getElementById("clear").addEventListener("click", clearCanvas);

document.getElementById("save").addEventListener("click", saveImage);

document.getElementById("upload").addEventListener("change", uploadImage);

document.getElementById("fullscreen").addEventListener("click", () => {
  document.documentElement.requestFullscreen();
});

// Drawing functions
function startDrawing(e) {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function draw(e) {
  if (!isDrawing) return;

  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.strokeStyle = brushColor;

  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
}

function stopDrawing() {
  isDrawing = false;
  ctx.closePath();
}

// Clear the canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Save the canvas as an image
function saveImage() {
  const link = document.createElement("a");
  link.download = "whiteboard.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// Upload an image to the canvas
function uploadImage(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}
