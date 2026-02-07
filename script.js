let timeLeft = 180;
let timerId = null;
let audioCtx = null; // 音源を管理するコンテキスト

const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

// 音を鳴らす関数（周波数、音量、長さを指定）
function playSound(frequency, volume, duration) {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine'; // 柔らかな波形
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

// タイマー終了時のアラーム音
function playAlarm() {
    const notes = [660, 660, 660]; // 「ピ、ピ、ピ」という高音
    notes.forEach((freq, i) => {
        setTimeout(() => playSound(freq, 0.1, 0.2), i * 300);
    });
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

startBtn.addEventListener('click', () => {
    if (timerId !== null) return;

    // 最初に一度だけ小さな音を鳴らす（ブラウザの音再生制限を解除するため）
    playSound(440, 0, 0.1); 

    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();

        // 毎秒、ごく小さな「カッ」という音を鳴らす（秒針のイメージ）
        playSound(150, 0.02, 0.05);

        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            playAlarm(); // アラームを鳴らす
            alert("コーヒーが完成しました！");
        }
    }, 1000);
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    timeLeft = 180;
    updateDisplay();
});
