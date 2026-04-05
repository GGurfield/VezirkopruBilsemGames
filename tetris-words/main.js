document.addEventListener('DOMContentLoaded', () => {
  const wordDisplay = document.getElementById('current-word-display');
  const timerBar = document.getElementById('timer-bar');
  const submitBtn = document.getElementById('submit-btn');
  const deleteBtn = document.getElementById('backspace-btn');
  const wordHistoryList = document.getElementById('word-history-list');
  const restartBtn = document.getElementById('restart-btn');
  const mainMenu = document.getElementById('main-menu');
  const backMenuBtn = document.getElementById('back-menu-btn');

  let currentWord = "";
  let timerLeft = 30;
  let isSubmitting = false;
  let globalMode = 'EN_EN';
  const submittedWords = new Set();
  
  const tetris = new window.TetrisGame('tetris-canvas', 'next-piece-canvas');

  function startGame(mode) {
    globalMode = mode;
    mainMenu.style.display = 'none';
    tetris.reset();
    currentWord = "";
    updateWordDisplay();
    wordHistoryList.innerHTML = "";
    submittedWords.clear();
    window.initKeyboard(globalMode, handleKeyPress);
    if (window.resetDisabledLetters) window.resetDisabledLetters();
    resetTimer();
    lastTime = performance.now();
  }

  document.getElementById('btn-en-en').onclick = () => startGame('EN_EN');
  document.getElementById('btn-en-tr').onclick = () => startGame('EN_TR');
  document.getElementById('btn-tr-tr').onclick = () => startGame('TR_TR');
  document.getElementById('btn-tr-en').onclick = () => startGame('TR_EN');

  backMenuBtn.onclick = () => {
    mainMenu.style.display = 'flex';
    tetris.isGameOver = true; 
    tetris.reset();
  };

  
  function updateWordDisplay() {
    wordDisplay.textContent = currentWord;
  }

  function handleKeyPress(key) {
    if(tetris.isGameOver) return;
    if (window.disabledLetters && window.disabledLetters.has(key)) return;
    window.audio.startBgMusic(); 
    if (currentWord.length < 15) {
      currentWord += key;
      updateWordDisplay();
    }
  }

  function handleBackspace() {
    if(tetris.isGameOver) return;
    if (currentWord.length > 0) {
      currentWord = currentWord.slice(0, -1);
      updateWordDisplay();
    }
  }

  async function handleSubmit() {
    if(tetris.isGameOver || isSubmitting) return;
    if (currentWord.length < 2) return;

    window.audio.startBgMusic(); 

    const wordToSubmit = currentWord;
    currentWord = "";
    updateWordDisplay();
    
    if (submittedWords.has(wordToSubmit.toUpperCase())) {
      window.audio.error();
      const wrapper = wordDisplay.parentElement;
      wordDisplay.innerHTML = `<span style="font-size:1.5rem; color:var(--neon-pink);">ALREADY USED</span>`;
      setTimeout(() => { if(currentWord === "") updateWordDisplay(); }, 1000);
      
      wrapper.classList.remove('shake');
      void wrapper.offsetWidth; 
      wrapper.classList.add('shake');
      return;
    }

    isSubmitting = true;
    submitBtn.textContent = '...';
    
    const res = await window.validateWord(wordToSubmit, globalMode);
    
    isSubmitting = false;
    submitBtn.textContent = 'SUBMIT';
    
    if (res) {
      window.audio.success();
      
      submittedWords.add(res.word.toUpperCase());
      if (window.randomizeDisabledLetters) {
        window.randomizeDisabledLetters();
      }

      const msg = document.createElement('div');
      msg.className = 'history-item';
      msg.innerHTML = `<div class="history-word">${res.word}</div><div class="history-def">${res.meaning}</div>`;
      wordHistoryList.prepend(msg);
      
      tetris.updateScore(res.word.length * 100);
      tetris.addShapeToQueue(res.word.length);
      resetTimer();
    } else {
      window.audio.error();
      const wrapper = wordDisplay.parentElement;
      wrapper.classList.remove('shake');
      void wrapper.offsetWidth; // trigger reflow
      wrapper.classList.add('shake');
    }
  }

  // Timer logic
  function resetTimer() {
    timerLeft = 30;
    updateTimerUI();
  }

  function updateTimerUI() {
    const percentage = (timerLeft / 30) * 100;
    timerBar.style.width = `${percentage}%`;
    if (timerLeft <= 5) {
      timerBar.classList.add('timer-danger');
    } else {
      timerBar.classList.remove('timer-danger');
    }
  }

  function tickTimer() {
    if(tetris.isGameOver || mainMenu.style.display !== 'none') return;
    timerLeft--;
    if (timerLeft <= 0) {
      // Timeout Penalty
      tetris.addPenaltyRow();
      window.audio.error();
      resetTimer();
      if (window.randomizeDisabledLetters) {
        window.randomizeDisabledLetters();
      }
    }
    updateTimerUI();
  }

  // Game Loop
  let lastTime = performance.now();
  let dropCounter = 0;
  const dropInterval = 1000;

  function gameLoop(time) {
    if (!tetris.isGameOver && mainMenu.style.display === 'none') {
      const deltaTime = time - lastTime;
      lastTime = time;
      dropCounter += deltaTime;
      if (dropCounter > dropInterval) {
         tetris.moveDown();
         dropCounter = 0;
      }
    }
    requestAnimationFrame(gameLoop);
  }

  // Bind controls
  document.getElementById('btn-left').onclick = () => tetris.moveLeft();
  document.getElementById('btn-right').onclick = () => tetris.moveRight();
  document.getElementById('btn-down').onclick = () => tetris.moveDown();
  document.getElementById('btn-rotate').onclick = () => tetris.rotate();
  
  submitBtn.onclick = handleSubmit;
  deleteBtn.onclick = handleBackspace;

  restartBtn.onclick = () => {
    tetris.reset();
    currentWord = "";
    updateWordDisplay();
    wordHistoryList.innerHTML = "";
    resetTimer();
    submittedWords.clear();
    if (window.resetDisabledLetters) window.resetDisabledLetters();
    lastTime = performance.now();
  };

  // Physical Keyboard wrapper
  document.addEventListener('keydown', (e) => {
    if(tetris.isGameOver || mainMenu.style.display !== 'none') return;
    window.audio.startBgMusic();
    
    const rawKey = e.key;

    if (rawKey === 'Backspace') {
      handleBackspace();
    } else if (rawKey === 'Enter') {
      handleSubmit();
    } else if (rawKey === 'ArrowLeft') {
      tetris.moveLeft();
    } else if (rawKey === 'ArrowRight') {
      tetris.moveRight();
    } else if (rawKey === 'ArrowDown') {
      tetris.moveDown();
    } else if (rawKey === 'ArrowUp') {
      tetris.rotate();
    } else {
      const isTr = globalMode.startsWith('TR');
      const keyStr = isTr ? rawKey.toLocaleUpperCase('tr-TR') : rawKey.toUpperCase();
      if (keyStr.length === 1 && keyStr.toUpperCase() !== keyStr.toLowerCase()) {
        handleKeyPress(keyStr);
      }
    }
  });

  tetris.draw();
  setInterval(tickTimer, 1000);
  requestAnimationFrame(gameLoop);
});
