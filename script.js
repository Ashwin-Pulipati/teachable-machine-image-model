const URL = "https://teachablemachine.withgoogle.com/models/hKbq0TDif/";

let model, webcam, labelContainer, maxPredictions;

async function init() {
  const btn = document.getElementById("button");
  const loading = document.getElementById("loading");
  const content = document.getElementById("wrap-content");

  btn.disabled = true;
  loading.style.display = "block";

  if (webcam && webcam.stream) {
    webcam.stop();
    webcam.canvas.remove();
  }

  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  const flip = true;
  webcam = new tmImage.Webcam(450, 450, flip);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  document.getElementById("webcam-container").innerHTML = "";
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  labelContainer.innerHTML = ""; 

  const labelStyles = [
    {
      fontSize: "20px",
      backgroundImage: "linear-gradient(220.55deg, #ffdc99 0%, #ff62c0 100%)",
      padding: "15px",
      borderRadius: "10px",
      margin: "10px",
      fontWeight: "bold",
      border: "2px solid red",
    },
    {
      fontSize: "20px",
      backgroundImage: "linear-gradient(45deg, #92fe9d 0%, #00c9ff 100%)",
      padding: "15px",
      borderRadius: "10px",
      margin: "10px",
      fontWeight: "bold",
      border: "2px solid #0f68a9",
    },
    {
      fontSize: "20px",
      backgroundImage: "linear-gradient(220.55deg, #9bf8f4 0%, #6f7bf7 100%)",
      padding: "15px",
      borderRadius: "10px",
      margin: "10px",
      fontWeight: "bold",
      border: "2px solid blue",
    },
    {
      fontSize: "20px",
      backgroundImage: "linear-gradient(220.55deg, #F76D72 0%, #f7f779 100%)",
      padding: "15px",
      borderRadius: "10px",
      margin: "10px",
      fontWeight: "bold",
      border: "2px solid #e60b09",
    },
    {
      fontSize: "20px",
      backgroundImage: "linear-gradient(220.55deg, #B8B8F8 0%, #DF66F5 100%)",
      padding: "15px",
      borderRadius: "10px",
      margin: "10px",
      fontWeight: "bold",
      border: "2px solid #8711c1",
    },
  ];

  for (let i = 0; i < maxPredictions; i++) {
    const newDiv = document.createElement("div");
    Object.assign(newDiv.style, labelStyles[i % labelStyles.length]);
    labelContainer.appendChild(newDiv);
  }

  loading.style.display = "none";
  content.style.display = "flex";
  btn.style.opacity = "0.6";
  btn.style.cursor = "not-allowed";
}


async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  const toggle = document.getElementById("dark-mode-toggle");
  toggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}

document.getElementById("year").textContent = new Date().getFullYear();

function restart() {
  if (webcam && webcam.stream) {
    webcam.stop();
    webcam.canvas.remove();
  }

  if (labelContainer) {
    labelContainer.innerHTML = "";
  }

  const btn = document.getElementById("button");
  btn.disabled = false;
  btn.style.opacity = "1";
  btn.style.cursor = "pointer";

  document.getElementById("wrap-content").style.display = "none";
}
