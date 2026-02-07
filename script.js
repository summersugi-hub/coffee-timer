let timeLeft = 180;
let timerId = null;
let audioCtx = null;

const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

// 音を鳴らす関数
function playSound(frequency, volume, duration) {
    // ★ Chrome対策: ボタンを押した時に初めてコンテキストを作成または再開する
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // コンテキストが停止していたら再開させる
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    // 音の終わりを滑らかにする
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

// タイマー開始
startBtn.addEventListener('click', () => {
    if (timerId !== null) return;

    // ★ 最初に一瞬だけ無音に近い音を鳴らして、ブラウザの音再生許可を得る
    playSound(440, 0.05, 0.1); 

    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        // 動作中のクリック音
        playSound(150, 0.02, 0.05);

        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            // アラーム音
            [660, 660, 660].forEach((f, i) => {
                setTimeout(() => playSound(f, 0.1, 0.2), i * 300);
            });
            alert("コーヒーが完成しました！");
        }
    }, 1000);
});

// リセットは以前と同じ
resetBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    timeLeft = 180;
    updateDisplay();
});

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
