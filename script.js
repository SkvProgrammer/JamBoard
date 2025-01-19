// Canvas Setup
const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

// Set initial canvas size
resizeCanvas();

// Listen for window resize events to adjust canvas size
window.addEventListener('resize', resizeCanvas);

// Function to resize the canvas
function resizeCanvas() {
  // Save current content
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Update canvas size to match the container
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = canvas.parentElement.offsetHeight;

  // Restore the content after resizing
  ctx.putImageData(imageData, 0, 0);
}

// Tool Variables
let isDrawing = false;
let currentTool = "pointer";
let penSize = 10;
let eraserSize = 10;
let brushColor = "#000000";
let startX = 0, startY = 0;

// Utility: Get the current brush size based on the tool
function getBrushSize() {
  return currentTool === "eraser" ? eraserSize : penSize;
}

// Utility: Get event coordinates (mouse or touch)
function getEventCoordinates(e) {
  if (e.touches) {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  }
  return { x: e.offsetX, y: e.offsetY };
}

// Set Active Tool
function setTool(tool) {
  currentTool = tool;

  // Highlight active tool
  document.querySelectorAll("#side-menu button").forEach((btn) => {
    btn.classList.toggle("active", btn.id === `${tool}-tool`);
  });

  // Show tool options dynamically
  document.querySelectorAll(".tool-options").forEach((options) => {
    options.classList.toggle("active", options.id === `${tool}-options`);
  });
}

// Start Drawing
function startDrawing(e) {
  if (currentTool === "pointer") return;

  isDrawing = true;
  const coords = getEventCoordinates(e);
  startX = coords.x;
  startY = coords.y;

  if (currentTool === "pen" || currentTool === "eraser") {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
  }

  e.preventDefault(); // Prevent scrolling on touch devices
}

// Draw on Canvas
function draw(e) {
  if (!isDrawing) return;

  const coords = getEventCoordinates(e);

  ctx.lineWidth = getBrushSize();
  if (currentTool === "pen") {
    ctx.strokeStyle = brushColor;
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  } else if (currentTool === "eraser") {
    ctx.strokeStyle = "#ffffff";
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  }

  e.preventDefault(); // Prevent scrolling on touch devices
}

// Stop Drawing
function stopDrawing(e) {
  if (!isDrawing) return;
  isDrawing = false;

  const coords = getEventCoordinates(e);

  if (currentTool === "line") {
    ctx.beginPath();
    ctx.lineWidth = getBrushSize();
    ctx.strokeStyle = brushColor;
    ctx.moveTo(startX, startY);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  } else if (currentTool === "rectangle") {
    const rectWidth = coords.x - startX;
    const rectHeight = coords.y - startY;
    ctx.lineWidth = getBrushSize();
    ctx.strokeStyle = brushColor;
    ctx.strokeRect(startX, startY, rectWidth, rectHeight);
  } else if (currentTool === "circle") {
    const radius = Math.sqrt((coords.x - startX) ** 2 + (coords.y - startY) ** 2);
    ctx.beginPath();
    ctx.lineWidth = getBrushSize();
    ctx.strokeStyle = brushColor;
    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    ctx.stroke();
  } else if (currentTool === "text") {
    const text = prompt("Enter text:");
    if (text) {
      const fontSize = document.getElementById("font-size").value;
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = brushColor;
      ctx.fillText(text, startX, startY);
    }
  }

  e.preventDefault(); // Prevent scrolling on touch devices
}

// Attach Mouse and Touch Events
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);

canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopDrawing);

// Tool Options
document.getElementById("pen-color").addEventListener("input", (e) => {
  brushColor = e.target.value;
});
document.getElementById("pen-size").addEventListener("input", (e) => {
  penSize = e.target.value;
});
document.getElementById("eraser-size").addEventListener("input", (e) => {
  eraserSize = e.target.value;
});

// Save Work
function saveWork() {
  const link = document.createElement("a");
  link.download = "whiteboard.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// Upload Image
function uploadImage() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.onchange = (e) => {
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
  };
  fileInput.click();
}

// Fullscreen toggle
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

// Call resizeCanvas when fullscreen changes
document.addEventListener('fullscreenchange', resizeCanvas);
document.addEventListener('webkitfullscreenchange', resizeCanvas); // For Safari
document.addEventListener('mozfullscreenchange', resizeCanvas); // For Firefox
document.addEventListener('msfullscreenchange', resizeCanvas); // For IE/Edge

// Initial Tool Setup
setTool("pointer");
