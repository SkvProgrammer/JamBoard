// Variables for canvas
const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

// Canvas setup
function resizeCanvas() {
  // Save the current canvas content
  const savedContent = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Resize the canvas
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = canvas.parentElement.offsetHeight;

  // Restore the saved content
  ctx.putImageData(savedContent, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Variables for drawing
let isDrawing = false;
let brushColor = "#000000";
let brushSize = 10;
let currentTool = "pen"; // Tracks the active tool (pen, eraser, shapes)

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

// Side menu tools
document.getElementById("pen-tool").addEventListener("click", () => {
  currentTool = "pen";
});

document.getElementById("eraser-tool").addEventListener("click", () => {
  currentTool = "eraser";
});

document.getElementById("select-tool").addEventListener("click", () => {
  currentTool = "select";
});

document.getElementById("draw-line").addEventListener("click", () => {
  currentTool = "line";
});

document.getElementById("draw-rect").addEventListener("click", () => {
  currentTool = "rectangle";
});

document.getElementById("draw-circle").addEventListener("click", () => {
  currentTool = "circle";
});

document.getElementById("text-tool").addEventListener("click", () => {
  currentTool = "text";
});

// Drawing functions
let startX, startY;

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  startX = e.offsetX;
  startY = e.offsetY;

  if (currentTool === "pen" || currentTool === "eraser") {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;

  if (currentTool === "pen") {
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = brushColor;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (currentTool === "eraser") {
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#ffffff"; // Eraser color
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (!isDrawing) return;
  isDrawing = false;

  if (currentTool === "line") {
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (currentTool === "rectangle") {
    const rectWidth = e.offsetX - startX;
    const rectHeight = e.offsetY - startY;
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;
    ctx.strokeRect(startX, startY, rectWidth, rectHeight);
  } else if (currentTool === "circle") {
    const radius = Math.sqrt(
      Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2)
    );
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;
    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    ctx.stroke();
  } else if (currentTool === "text") {
    const text = prompt("Enter the text:");
    if (text) {
      ctx.fillStyle = brushColor;
      ctx.font = `${brushSize * 2}px Arial`;
      ctx.fillText(text, startX, startY);
    }
  }
});

// Utility functions
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveImage() {
  const link = document.createElement("a");
  link.download = "whiteboard.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

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
