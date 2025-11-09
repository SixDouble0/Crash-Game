// Core game logic split from original monolithic Crash.js
function updateBalanceDisplay() {
    const balanceDisplay = document.getElementById("balanceDisplay");
    balanceDisplay.textContent = `$${balance.toFixed(2)}`;
}

function StartFunc() {
    console.log('[Crash] StartFunc()', { betamount, gameState });
    const przycisk = document.getElementById('przycisk-gray');
    // Sync betamount with input in case listeners didn't fire
    const input = document.getElementById('typeNumber');
    if (input && (gameState === 'ready' || gameState === 'crashed')) {
        const v = parseFloat(input.value);
        if (!isNaN(v)) betamount = v;
    }

    if (betamount === 0) {
        alert("You cannot enter the crash if your bet amount is equal to 0");
        return;
    }

    if (gameState === "running") {
        handleCashout(przycisk);
        return;
    }

    if (gameState === "crashed") {
        resetGame(przycisk);
        return;
    }

    startNewGame(przycisk);
}

async function handleCashout(przycisk) {
    const wygrana = betamount * number; // total potential win
    if (OFFLINE_MODE) {
        balance += wygrana;
        updateBalanceDisplay();
        przycisk.classList.remove('przycisk-green');
        przycisk.classList.add('przycisk-gray');
        przycisk.textContent = `You cashed out: $${wygrana.toFixed(2)}`;
        gameState = "observing";
        return;
    }
    try {
        const response = await fetch('/api/crash/cashout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(wygrana)
        });
        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.message || "Cashout failed");
            return;
        }
        const data = await response.json();
        if (data.success) {
            balance = data.balance;
            updateBalanceDisplay();
            przycisk.classList.remove('przycisk-green');
            przycisk.classList.add('przycisk-gray');
            przycisk.textContent = `You cashed out: $${wygrana.toFixed(2)}`;
            gameState = "observing";
        } else {
            alert(data.message || "Cashout failed");
        }
    } catch (error) {
        console.error("Error during cashout:", error);
        alert("An error occurred during cashout. Please try again.");
    }
}

function resetGame(przycisk) {
    przycisk.classList.remove('przycisk-red');
    przycisk.classList.add('przycisk-gray');
    przycisk.textContent = "Start";
    gamecolor = "lightgreen";
    number = 1;
    gameState = "ready";
    updateCanvasGlow();
}

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
        drawFrame();
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
    let prevX = 0, prevY = canvas.height;
    let curX = 0, curY = canvas.height;
    for (let i = 0; i <= x; i += krok) {
        let yVal = (i * i) / 3000;
        let cx = i;
        let cy = canvas.height - yVal * scaleY;
        if (cy < 0) break;
        ctx.lineTo(cx, cy);
        prevX = curX; prevY = curY; curX = cx; curY = cy;
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

function updateCanvasGlow() {
    const canvas2 = document.getElementById("mysecondCanvas");
    if (!canvas2) return;
    if (gameState === "running") {
        canvas2.classList.remove("red-glow");
        canvas2.classList.add("green-glow");
    } else if (gameState === "crashed") {
        canvas2.classList.remove("green-glow");
        canvas2.classList.add("red-glow");
    } else {
        canvas2.classList.remove("green-glow", "red-glow");
    }
}
