// UI wiring extracted from original Crash.js
function wireBetButtons() {
    console.log('[Crash] wireBetButtons()');
    const add5 = document.getElementById('add5');
    const add10 = document.getElementById('add10');
    const add20 = document.getElementById('add20');
    const add50 = document.getElementById('add50');
    const half = document.getElementById('half');
    const quarter = document.getElementById('quarter');
    const clearBtn = document.getElementById('clear');
    const startBtn = document.getElementById('przycisk-gray');

    if (add5) add5.addEventListener('click', () => dodaj(5));
    if (add10) add10.addEventListener('click', () => dodaj(10));
    if (add20) add20.addEventListener('click', () => dodaj(20));
    if (add50) add50.addEventListener('click', () => dodaj(50));
    if (half) half.addEventListener('click', () => usun(0.5));
    if (quarter) quarter.addEventListener('click', () => usun(0.25));
    if (clearBtn) clearBtn.addEventListener('click', () => {
        if (gameState === 'ready' || gameState === 'crashed') {
            const input = document.getElementById('typeNumber');
            input.value = '0';
            betamount = 0;
        }
    });

    if (startBtn) {
        startBtn.addEventListener('click', () => { console.log('[Crash] Start clicked'); StartFunc(); });
    } else {
        console.warn('[Crash] start button not found');
    }

    const typeNumber = document.getElementById('typeNumber');
    if (typeNumber) {
        betamount = parseFloat(typeNumber.value) || 0;
        typeNumber.addEventListener('input', () => {
            if (gameState === 'ready' || gameState === 'crashed') {
                betamount = parseFloat(typeNumber.value) || 0;
                console.log('[Crash] betamount changed:', betamount);
            }
        });
    }
}

function initUiAndState() {
    if (initUiAndState._done) return;
    initUiAndState._done = true;
    console.log('[Crash] initUiAndState()');
    if (OFFLINE_MODE) {
    balance = 1000; // initial starting balance for offline mode
        updateBalanceDisplay();
    }
    wireBetButtons();
}

document.addEventListener('DOMContentLoaded', () => {
    initUiAndState();
});

if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initUiAndState();
}
