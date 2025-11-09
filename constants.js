// Global constants and shared state (extracted from Crash.js)
// Crash game logic is offline-capable
let number = 1;
let intervalID = null;
let iks = 'x';
let balance = 0; // local simulated balance in offline mode
let betamount = 0;
let gameState = "ready"; // States: "ready", "running", "crashed", "observing"
const OFFLINE_MODE = true; // Set true to disable backend calls
let gamecolor = "lightgreen";
let glowingcolor = "rgba(0, 255, 0, 0.8)";
const canvas = document.getElementById("myCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
let x = 0;
let speed = 1000;
let displayNumber = 1;
