// Load face-api.js models
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo).catch(err => console.error("Error loading models:", err));

// Function to start the laptop camera
function startVideo() {
    const video1 = document.getElementById('video1');
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video1.srcObject = stream;
            video1.onloadedmetadata = () => {
                video1.play();
                startFaceDetection(video1);
            };
        })
        .catch(err => {
            console.error("Error accessing the laptop webcam:", err);
            alert("Could not access the webcam. Please check your browser settings.");
        });
}

// Function to start face detection on the laptop camera
function startFaceDetection(video) {
    video.addEventListener('play', () => {
        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);
        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);

        setInterval(async() => {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions();
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }, 100);
    });
}

// Function to refresh the IP camera image every second
function refreshIpCam() {
    const ipCam = document.getElementById('ipcam');
    ipCam.src = `http://192.168.118.90:8080/video?${new Date().getTime()}`; // Append a timestamp to avoid caching
}

setInterval(refreshIpCam, 1000); // Refresh every second
