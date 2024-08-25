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
                startFaceDetection(video1, "canvas1");
            };
        })
        .catch(err => {
            console.error("Error accessing the laptop webcam:", err);
            alert("Could not access the webcam. Please check your browser settings.");
        });

    refreshIpCam(); // Start the IP camera stream
}

// Function to start face detection on a video source
function startFaceDetection(video, canvasId) {
    video.addEventListener('play', () => {
        const canvas = faceapi.createCanvasFromMedia(video);
        canvas.id = canvasId;
        document.body.append(canvas);

        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);

        setInterval(async () => {
            if (video.videoWidth !== 0 && video.videoHeight !== 0) { // Ensure dimensions are valid
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceExpressions();
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                faceapi.draw.drawDetections(canvas, resizedDetections);
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
                faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
            }
        }, 100);
    });
}

// Function to refresh the IP camera image every second and apply face detection
function refreshIpCam() {
    const ipCam = document.getElementById('ipcam');
    ipCam.src = `http://192.168.118.90:8080/video?${new Date().getTime()}`; // Append a timestamp to avoid caching

    ipCam.onload = () => {
        if (ipCam.naturalWidth !== 0 && ipCam.naturalHeight !== 0) {
            startFaceDetection(ipCam, "canvas2"); // Start face detection on the IP camera feed
        }
    };

    setInterval(() => {
        ipCam.src = `http://192.168.118.90:8080/video?${new Date().getTime()}`;
    }, 1000); // Refresh every second
}
