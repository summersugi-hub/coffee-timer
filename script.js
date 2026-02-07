let timeLeft = 180;
let timerId = null;
let audioCtx = null;

const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const steams = document.querySelectorAll('.steam');

// 音波を合成する関数
function playNote(freq, volume, duration, type = 'sine') {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

// J-pop/Jazz風の和音を自動生成
function playGenerativeMusic(tick) {
    const chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [349.23, 440.00, 523.25, 659.25]  // Fmaj7
    ];
    
    const currentChord = chords[Math.floor(tick / 4) % chords.length];
    const freq = currentChord[Math.floor(Math.random() * currentChord.length)];
    
    playNote(freq, 0.06, 2.0);
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

startBtn.addEventListener('click', () => {
    if (timerId !== null) return;

    // 湯気を表示
    steams.forEach(s => s.style.opacity = "1");

    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        playGenerativeMusic(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            steams.forEach(s => s.style.opacity = "0");
            
            // 終了アラーム
            [523, 659, 783, 1046].forEach((f, i) => {
                setTimeout(() => playNote(f, 0.1, 1.5, 'triangle'), i * 200);
            });
            alert("コーヒーが完成しました！");
        }
    }, 1000);
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    timeLeft = 180;
    updateDisplay();
    steams.forEach(s => s.style.opacity = "0");
});
