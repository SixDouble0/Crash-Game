// Aggregator stub: original monolith replaced by modules (constants.js, effects.js, logic.js, ui.js).
// No duplicate declarations here; we rely on already-loaded globals.
console.log('[Crash] Aggregator loaded (Crash.js)');
if (typeof initUiAndState === 'function') initUiAndState();

// The remaining code below is legacy that should have been moved. Keeping for backward compatibility.

async function startNewGame(przycisk) {
    if (OFFLINE_MODE) {
        if (betamount > balance) {
            alert("Insufficient balance");
            return;
        }
        balance -= betamount;
        updateBalanceDisplay();
        przycisk.classList.remove('przycisk-gray');
        przycisk.classList.add('przycisk-green');
        przycisk.textContent = `Cashout $${(number * betamount).toFixed(2)}`;
        gamecolor = "lightgreen";
        number = 1;
        x = 1;
        speed = 2.5;
        gameState = "running";
        updateCanvasGlow();
        if (!ctx) {
            console.error('[Crash] Canvas context missing');
        } else {
            animate();
        }
        updateNumber();
        return;
    }
    try {
        const response = await fetch('/api/crash/bet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(betamount)
        });
        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.message || "Bet failed");
            return;
        }
        const data = await response.json();
        if (data.success) {
            balance = data.balance;
            updateBalanceDisplay();
            przycisk.classList.remove('przycisk-gray');
            przycisk.classList.add('przycisk-green');
            przycisk.textContent = `Cashout $${(number * betamount).toFixed(2)}`;
            gamecolor = "lightgreen";
            number = 1;
            x = 1;
            speed = 2.5;
            gameState = "running";
            updateCanvasGlow();
            animate();
            updateNumber();
        } else {
            alert(data.message || "Failed to place bet");
        }
    } catch (error) {
        console.error("Error placing bet:", error);
        alert("An error occurred while placing your bet. Please try again.");
    }
}

function updateNumber() {
    const random_num = Math.floor(Math.random() * 1000 + 1);

    // Crashing
    if (random_num > 995) {
        clearTimeout(intervalID);
        intervalID = null;

        const liczbaDisplay = document.getElementById("liczbaDisplay");
        liczbaDisplay.style.color = "red";
        liczbaDisplay.textContent = iks + number;

        if (gameState === "observing") {
            gameState = "crashed";
            updateCanvasGlow();
            return;
        }

        const przycisk = document.getElementById('przycisk-gray');
        przycisk.classList.remove('przycisk-green');
        przycisk.classList.add('przycisk-red');
        przycisk.textContent = "You lost";

    // Call backend to register loss
        registerLoss();

        gameState = "crashed";
        updateCanvasGlow();
        resetSekNumbers();
        return;
    }

    number = parseFloat((number + 0.01).toFixed(2));
    updateDisplay();

    if (gameState === "running" || gameState === "observing") {
        intervalID = setTimeout(updateNumber, MsLowering(number));
    }
}

async function registerLoss() {
    if (OFFLINE_MODE) {
        // In offline mode, balance was already deducted at the start; nothing else to do
        return;
    }
    try {
        const response = await fetch('/api/crash/loss', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(betamount)
        });
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                balance = data.balance;
                updateBalanceDisplay();
            }
        }
    } catch (error) {
        console.error("Error registering loss:", error);
    }
}

function updateDisplay() {
    const liczbaDisplay = document.getElementById("liczbaDisplay");
    liczbaDisplay.style.color = "green";
    liczbaDisplay.textContent = iks + number;

    if (gameState === "running") {
        const przycisk = document.getElementById('przycisk-gray');
        const potentialCashout = (betamount * number).toFixed(2);
        przycisk.textContent = `Cashout $${potentialCashout}`;
    }
    SekNumbers();
    MulitplyNumbers();
}

function MsLowering(number) {
    return number > 2 ? Math.max(200 / number, 10) : 100;
}

function dodaj(amount) {
    if (gameState === "ready" || gameState === "crashed") {
        const input = document.getElementById('typeNumber');
        const currentValue = parseFloat(input.value) || 0;
        input.value = (currentValue + amount).toFixed(2);
        betamount = parseFloat(input.value);
    }
}

function usun(amount) {
    if (gameState === "ready" || gameState === "crashed") {
        const input = document.getElementById('typeNumber');
        const currentValue = parseFloat(input.value) || 0;
        input.value = (currentValue * amount).toFixed(2);
        betamount = parseFloat(input.value);
    }
}

function animate() {
    if (gameState === "running" || gameState === "observing") {
        drawFrame();

        speed = Math.max(speed * 0.9985, 0.001);
        x += speed;

        if (x <= canvas.width) {
            requestAnimationFrame(animate);
        }
    } else if (gameState === "crashed") {
        gamecolor = "darkred";
        glowingcolor = "rgba(139, 0, 0, 1)";
    drawFrame(); // Draw the last frame
    }
    glowingcolor = "rgba(0, 255, 0, 0.8)";
}

function drawFrame() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.shadowColor = glowingcolor;
    ctx.shadowBlur = Pulsacja();
    let krok = 0.25;
    let scaleY = 1;
    let prevX = 0,
        prevY = canvas.height;
    let curX = 0,
        curY = canvas.height;

    for (let i = 0; i <= x; i += krok) {
        let yVal = (i * i) / 3000;
        let cx = i;
        let cy = canvas.height - yVal * scaleY;
        if (cy < 0) break;

        ctx.lineTo(cx, cy);

        prevX = curX;
        prevY = curY;
        curX = cx;
        curY = cy;
    }

    ctx.lineWidth = 30;
    ctx.strokeStyle = gamecolor;
    ctx.stroke();

    const dx = curX - prevX;
    const dy = curY - prevY;
    const angle = Math.atan2(dy, dx);

    drawTriangle(curX, curY, angle);
}

function drawTriangle(x, y, angle) {
    const s = 150;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.moveTo(s / 2, 0);
    ctx.lineTo(-s / 2, -s / 4);
    ctx.lineTo(-s / 2, s / 4);
    ctx.closePath();

    ctx.fillStyle = gamecolor;
    ctx.fill();

    ctx.restore();
}

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

function updateCanvasGlow() {
    const canvas = document.getElementById("mysecondCanvas");

    if (gameState === "running") {
        canvas.classList.remove("red-glow");
        canvas.classList.add("green-glow");
    } else if (gameState === "crashed") {
        canvas.classList.remove("green-glow");
        canvas.classList.add("red-glow");
    } else {
        canvas.classList.remove("green-glow", "red-glow");
    }
}
