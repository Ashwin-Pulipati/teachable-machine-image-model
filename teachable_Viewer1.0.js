// Ashwin Pulipati
// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/hKbq0TDif/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
  // show loading state
  const btn = document.getElementById("button");
  const loading = document.getElementById("loading");
  const content = document.getElementById("wrap-content");

  btn.disabled = true;
  loading.style.display = "block";

  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const flip = true; // whether to flip the webcam
  webcam = new tmImage.Webcam(450, 450, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // Apply border radius to the webcam container
  webcam.canvas.style.borderRadius = "20px";

  // Apply border color to the webcam container
  webcam.canvas.style.border = "3px solid #8c1105";

  // append elements to the DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");

  // Define an array of styles
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
    // Apply the corresponding style from the array
    Object.assign(newDiv.style, labelStyles[i % labelStyles.length]);
    labelContainer.appendChild(newDiv);
  }

  // done loading: hide loader, show real UI
  loading.style.display = "none";
  content.style.display = "flex";
  // keep the Start button disabled so user can't re-click
  btn.disabled = true;
  btn.style.opacity = "0.6"; // optional: dim it to show it's disabled
  btn.style.cursor = "not-allowed"; // optional: change cursor
}

async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }
}
