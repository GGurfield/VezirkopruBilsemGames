const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration, vol=0.1) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

window.audio = {
  drop: () => playTone(150, 'square', 0.1, 0.2),
  move: () => playTone(300, 'sine', 0.05, 0.05),
  rotate: () => playTone(400, 'triangle', 0.05, 0.05),
  clear: () => { 
    playTone(600, 'square', 0.1, 0.2); 
    setTimeout(() => playTone(800, 'square', 0.2, 0.2), 100); 
  },
  error: () => playTone(100, 'sawtooth', 0.3, 0.3),
  success: () => {
    playTone(500, 'sine', 0.1, 0.1);
    setTimeout(() => playTone(700, 'sine', 0.2, 0.1), 100);
  },
  // A simple repeating Arpeggio to simulate a background track, started on first input
  startBgMusic: () => {
    if(window.bgMusicPlaying) return;
    window.bgMusicPlaying = true;
    const notes = [220, 261.63, 329.63, 261.63];
    let noteIdx = 0;
    setInterval(() => {
      playTone(notes[noteIdx], 'triangle', 0.2, 0.02);
      noteIdx = (noteIdx + 1) % notes.length;
    }, 500);
  }
};
