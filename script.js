// ===========================================
// BEST FRIEND PHOTOBOOTH
// Part 1 of 4
// ===========================================

// Pages
const welcome = document.getElementById("welcome");
const cameraPage = document.getElementById("cameraPage");
const previewPage = document.getElementById("previewPage");
const resultPage = document.getElementById("resultPage");

// Buttons
const startBtn = document.getElementById("startBtn");
const retakeBtn = document.getElementById("retakeBtn");
const continueBtn = document.getElementById("continueBtn");
const againBtn = document.getElementById("againBtn");
const downloadBtn = document.getElementById("downloadBtn");

// Camera
const video = document.getElementById("video");
const captureCanvas = document.getElementById("captureCanvas");
const captureCtx = captureCanvas.getContext("2d");

const photoCanvas = document.getElementById("photoCanvas");
const photoCtx = photoCanvas.getContext("2d");

// UI
const flash = document.getElementById("flash");
const countdown = document.getElementById("countdown");

const previewImages = [
    document.getElementById("img1"),
    document.getElementById("img2"),
    document.getElementById("img3")
];

// Variables
let stream = null;
let photos = [];

const TOTAL_PHOTOS = 3;

// ===========================================
// Helper Functions
// ===========================================

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showPage(page) {

    [welcome, cameraPage, previewPage, resultPage]
        .forEach(p => p.classList.remove("active"));

    page.classList.add("active");
}

// ===========================================
// Camera
// ===========================================

async function startCamera() {

    try {

        stream = await navigator.mediaDevices.getUserMedia({

            video: {
                facingMode: "user",
                width: 1080,
                height: 1920
            },

            audio: false

        });

        video.srcObject = stream;

        await video.play();

        photos = [];

        showPage(cameraPage);

        await wait(1000);

        startBooth();

    }

    catch (error) {

        alert("Camera permission is required.");

        console.error(error);

    }

}

function stopCamera() {

    if (!stream) return;

    stream.getTracks().forEach(track => {

        track.stop();

    });

}

// ===========================================
// Countdown
// ===========================================

async function countdownAnimation() {

    countdown.style.display = "flex";

    for (let i = 3; i >= 1; i--) {

        countdown.innerText = i;

        countdown.classList.remove("animate");

        void countdown.offsetWidth;

        countdown.classList.add("animate");

        await wait(1000);

    }

    countdown.style.display = "none";

}

// ===========================================
// Flash
// ===========================================

async function flashAnimation() {

    flash.style.opacity = "1";

    await wait(150);

    flash.style.opacity = "0";

}

// ===========================================
// Capture
// ===========================================

function capturePhoto() {

    captureCanvas.width = video.videoWidth;

    captureCanvas.height = video.videoHeight;

    captureCtx.drawImage(

        video,

        0,

        0,

        captureCanvas.width,

        captureCanvas.height

    );

    const img = captureCanvas.toDataURL("image/png");

    photos.push(img);

}

// ===========================================
// Start Booth
// ===========================================

async function startBooth() {

    for (let i = 0; i < TOTAL_PHOTOS; i++) {

        await countdownAnimation();

        await flashAnimation();

        capturePhoto();

        await wait(700);

    }

    stopCamera();

    showPreview();

}