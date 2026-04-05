const EN_QWERTY = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M']
];
const EN_VOWELS = ['A', 'E', 'I', 'O', 'U'];
const EN_CONSONANTS = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];

const TR_QWERTY = [
  ['Q','W','E','R','T','Y','U','I','O','P','Ğ','Ü'],
  ['A','S','D','F','G','H','J','K','L','Ş','İ'],
  ['Z','X','C','V','B','N','M','Ö','Ç']
];
const TR_VOWELS = ['A','E','I','İ','O','Ö','U','Ü'];
const TR_CONSONANTS = ['B','C','Ç','D','F','G','Ğ','H','J','K','L','M','N','P','R','S','Ş','T','V','Y','Z'];

window.disabledLetters = new Set();
let currentKeyboardMode = 'EN';

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function randomizeDisabledLetters() {
  const isTr = currentKeyboardMode.startsWith('TR');
  const vowels = isTr ? TR_VOWELS : EN_VOWELS;
  const consonants = isTr ? TR_CONSONANTS : EN_CONSONANTS;
  const vCount = isTr ? 4 : 2;
  const cCount = 10;

  const disabledVowels = shuffle(vowels).slice(0, vCount);
  const disabledConsonants = shuffle(consonants).slice(0, cCount);
  window.disabledLetters = new Set([...disabledVowels, ...disabledConsonants]);

  const keys = document.querySelectorAll('.key-btn');
  keys.forEach(btn => {
    if (window.disabledLetters.has(btn.textContent)) {
      btn.classList.add('disabled-key');
    } else {
      btn.classList.remove('disabled-key');
    }
  });
}

function resetDisabledLetters() {
  window.disabledLetters = new Set();
  const keys = document.querySelectorAll('.key-btn');
  keys.forEach(btn => {
    btn.classList.remove('disabled-key');
  });
}

window.randomizeDisabledLetters = randomizeDisabledLetters;
window.resetDisabledLetters = resetDisabledLetters;

function initKeyboard(mode, onKeyPress) {
  currentKeyboardMode = mode;
  const container = document.getElementById('keyboard');
  container.innerHTML = '';
  const layout = mode.startsWith('TR') ? TR_QWERTY : EN_QWERTY;
  
  layout.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'keyboard-row';
    row.forEach(key => {
      const btn = document.createElement('button');
      btn.className = 'key-btn glass-btn';
      btn.textContent = key;
      // Add visual feedback class on click
      btn.onmousedown = () => {
        btn.style.transform = "translateY(2px)";
        onKeyPress(key);
      };
      btn.onmouseup = () => btn.style.transform = "none";
      btn.onmouseleave = () => btn.style.transform = "none";
      rowDiv.appendChild(btn);
    });
    container.appendChild(rowDiv);
  });
}

window.initKeyboard = initKeyboard;
