// Visual/effect helpers split from Crash.js
let pulseDirection = 1; // Pulse direction (1 = increasing, -1 = decreasing)
let shadowBlurValue = 20; // Initial blur value
function Pulsacja() {
    shadowBlurValue += pulseDirection * 0.2;

    if (shadowBlurValue >= 40 || shadowBlurValue <= 10) {
        pulseDirection *= -1;
    }

    return shadowBlurValue;
}

function MulitplyNumbers() {
    const multinum1 = document.getElementById("multinum1");
    const multinum2 = document.getElementById("multinum2");
    const multinum3 = document.getElementById("multinum3");
    const multinum4 = document.getElementById("multinum4");
    const multinum5 = document.getElementById("multinum5");
    const liczbaDisplay = document.getElementById("liczbaDisplay");

    const displayValue = parseFloat(liczbaDisplay.textContent.replace(iks, ''));

    multinum1.textContent = Math.max(displayValue, 2).toFixed(1);
    multinum2.textContent = Math.max(displayValue - 0.2, 1.8).toFixed(1);
    multinum3.textContent = Math.max(displayValue - 0.4, 1.6).toFixed(1);
    multinum4.textContent = Math.max(displayValue - 0.6, 1.4).toFixed(1);
    multinum5.textContent = Math.max(displayValue - 0.8, 1.2).toFixed(1);
}

let sekNumbersStarted = false;

let seknumIntervals = [];

function SekNumbers() {
    if (sekNumbersStarted) return;

    const liczbaDisplay = document.getElementById("liczbaDisplay");
    const liczbaValue = parseFloat(liczbaDisplay.textContent.replace('x', ''));

    if (liczbaValue > 2) {
        sekNumbersStarted = true;

        const seknums = [
            { element: document.getElementById("seknum1"), value: 1, increment: 1, interval: 3500 },
            { element: document.getElementById("seknum2"), value: 2, increment: 1, interval: 3000 },
            { element: document.getElementById("seknum3"), value: 3, increment: 1, interval: 2500 },
            { element: document.getElementById("seknum4"), value: 5, increment: 1, interval: 2000 },
            { element: document.getElementById("seknum5"), value: 8, increment: 1, interval: 1500 },
            { element: document.getElementById("seknum6"), value: 14, increment: 1, interval: 1000 },
        ];

        seknums.forEach(obj => {
            obj.element.textContent = obj.value + 's';
            const intervalID = setInterval(() => {
                obj.value += obj.increment;
                obj.element.textContent = obj.value + 's';
            }, obj.interval);

            seknumIntervals.push(intervalID);
        });
    }
}

function resetSekNumbers() {
    const seknums = [
        { element: document.getElementById("seknum1"), initialValue: 1 },
        { element: document.getElementById("seknum2"), initialValue: 2 },
        { element: document.getElementById("seknum3"), initialValue: 3 },
        { element: document.getElementById("seknum4"), initialValue: 5 },
        { element: document.getElementById("seknum5"), initialValue: 8 },
        { element: document.getElementById("seknum6"), initialValue: 14 },
    ];

    seknumIntervals.forEach(intervalID => clearInterval(intervalID));
    seknumIntervals = [];

    seknums.forEach(obj => {
        obj.element.textContent = obj.initialValue + 's';
    });

    sekNumbersStarted = false;
}
