const foodData = [
    { name: "Sushi", emoji: "🍣", country: "Japonya" },
    { name: "Pizza", emoji: "🍕", country: "İtalya" },
    { name: "Taco", emoji: "🌮", country: "Meksika" },
    { name: "Kruvasan", emoji: "🥐", country: "Fransa" },
    { name: "Döner", emoji: "🥙", country: "Türkiye" },
    { name: "Hamburger", emoji: "🍔", country: "ABD" },
    { name: "Paella", emoji: "🥘", country: "İspanya" },
    { name: "Soslu Köri", emoji: "🍛", country: "Hindistan" },
    { name: "Bento", emoji: "🍱", country: "Japonya" },
    { name: "Simit", emoji: "🥨", country: "Türkiye" },
    { name: "Spagetti", emoji: "🍝", country: "İtalya" },
    { name: "Ramen", emoji: "🍜", country: "Japonya" },
    { name: "Mantı", emoji: "🥟", country: "Türkiye" },
    { name: "Baget Ekmek", emoji: "🥖", country: "Fransa" },
    { name: "Waffle", emoji: "🧇", country: "Belçika" },
    { name: "Peynir Fondu", emoji: "🫕", country: "İsviçre" },
    { name: "Borscht", emoji: "🍲", country: "Rusya" },
    { name: "Burrito", emoji: "🌯", country: "Meksika" },
    { name: "Kızarmış Ördek", emoji: "🦆", country: "Çin" },
    { name: "Balık ve Patates", emoji: "🐠", country: "İngiltere" },
    { name: "Poutine", emoji: "🍟", country: "Kanada" },
    { name: "Ceviche", emoji: "🥗", country: "Peru" },
    { name: "Musakka", emoji: "🍆", country: "Yunanistan" },
    { name: "Pad Thai", emoji: "🍜", country: "Tayland" },
    { name: "Kimchi", emoji: "🥬", country: "Güney Kore" },
    { name: "Gulaş", emoji: "🍲", country: "Macaristan" },
    { name: "Feijoada", emoji: "🍛", country: "Brezilya" },
    { name: "Pho", emoji: "🍜", country: "Vietnam" },
    { name: "Arepa", emoji: "🫓", country: "Kolombiya" },
    { name: "Pierogi", emoji: "🥟", country: "Polonya" },
    { name: "Bratwurst", emoji: "🌭", country: "Almanya" },
    { name: "Falafel", emoji: "🧆", country: "Mısır" },
    { name: "Empanada", emoji: "🥟", country: "Arjantin" },
    { name: "Köttbullar", emoji: "🧆", country: "İsveç" },
    { name: "Biltong", emoji: "🥩", country: "Güney Afrika" },
    { name: "Pastel de Nata", emoji: "🥧", country: "Portekiz" },
    { name: "Nasi Goreng", emoji: "🍚", country: "Endonezya" },
    { name: "Haggis", emoji: "🍖", country: "İskoçya" },
    { name: "Pavlova", emoji: "🍰", country: "Yeni Zelanda" },
    { name: "Rösti", emoji: "🥔", country: "İsviçre" },
    { name: "Tajine", emoji: "🍲", country: "Fas" },
    { name: "Dim Sum", emoji: "🥟", country: "Çin" },
    { name: "Pellmeni", emoji: "🥟", country: "Rusya" },
    { name: "Biryani", emoji: "🍚", country: "Hindistan" },
    { name: "Churros", emoji: "🥖", country: "İspanya" },
    { name: "Tiramisu", emoji: "🍰", country: "İtalya" },
    { name: "Mochi", emoji: "🍡", country: "Japonya" },
    { name: "Şnitzel", emoji: "🥩", country: "Avusturya" },
    { name: "Krep", emoji: "🥞", country: "Fransa" }
];

const allCountries = [...new Set(foodData.map(item => item.country))];

// Game State
let score = 0;
let streak = 0;
let globalTimeLeft = 20.0;
let globalTimerInterval;
let starSpawnInterval;
let currentQuestion = null;
let isGameActive = false;

// DOM Elements
const body = document.body;
const skyContainer = document.getElementById('sky-container');
const scoreDisplay = document.getElementById('score');
const streakDisplay = document.getElementById('streak');
const streakFire = document.getElementById('streak-fire');
const timeLimitDisplay = document.getElementById('time-limit-display');

const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');

const quizModal = document.getElementById('quiz-modal');
const foodEmoji = document.getElementById('food-emoji');
const foodName = document.getElementById('food-name');
const optionsGrid = document.getElementById('options-grid');
const toast = document.getElementById('toast');

// Event Listeners
startBtn.addEventListener('click', startGame);

function startGame() {
    startScreen.classList.add('hidden');
    isGameActive = true;
    score = 0;
    streak = 0;
    globalTimeLeft = 20.0;

    updateUI();
    createStarsBackground();
    startStarSpawner();
    startGlobalTimer();

    // İlk sorunun ekrana hemen gelmesi için
    setTimeout(openQuiz, 500);
}

function startGlobalTimer() {
    clearInterval(globalTimerInterval);
    globalTimerInterval = setInterval(() => {
        if (!isGameActive) return;

        globalTimeLeft -= 0.05; // 50ms interval
        if (globalTimeLeft <= 0) {
            globalTimeLeft = 0;
            updateUI();
            gameOver();
        } else {
            updateUI();
        }
    }, 50);
}

function gameOver() {
    isGameActive = false;
    clearInterval(globalTimerInterval);
    clearInterval(starSpawnInterval);
    quizModal.classList.add('hidden');

    showToast('Oyun Bitti! Süre Doldu.', 'toast-error');

    setTimeout(() => {
        startScreen.classList.remove('hidden');
        document.querySelector('.start-modal h1').textContent = "Süre Doldu!";
        startBtn.textContent = "Tekrar Oyna";
    }, 2000);
}

function createStarsBackground() {
    skyContainer.innerHTML = ''; // reset previous stars
    // Static stars
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.width = `${Math.random() * 3}px`;
        star.style.height = star.style.width;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.opacity = Math.random();
        skyContainer.appendChild(star);
    }
}

function startStarSpawner() {
    clearInterval(starSpawnInterval);
    starSpawnInterval = setInterval(spawnFallingStar, 1500);
}

function spawnFallingStar() {
    if (!isGameActive || !quizModal.classList.contains('hidden')) return;

    const star = document.createElement('div');
    star.classList.add('falling-star');
    star.textContent = '⭐'; // Normal star look

    // Random start position (top edge)
    star.style.top = `-50px`;
    star.style.left = `${Math.random() * 90 + 5}vw`;

    // Adjust animation duration
    const duration = 2 + Math.random() * 3;
    star.style.animationDuration = `${duration}s`;

    star.addEventListener('click', () => {
        star.remove();
        openQuiz();
    });

    skyContainer.appendChild(star);

    // Remove after animation
    setTimeout(() => {
        if (star.parentNode) {
            star.remove();
        }
    }, duration * 1000);
}

function openQuiz() {
    if (!isGameActive) return;

    // Generate distinct random choices
    const foodIndex = Math.floor(Math.random() * foodData.length);
    currentQuestion = foodData[foodIndex];

    const correctCountry = currentQuestion.country;
    let otherCountries = allCountries.filter(c => c !== correctCountry);
    // Shuffle and pick 3
    otherCountries.sort(() => 0.5 - Math.random());
    const wrongOptions = otherCountries.slice(0, 3);

    const options = [correctCountry, ...wrongOptions].sort(() => 0.5 - Math.random());

    // Update Modal DOM
    foodEmoji.textContent = currentQuestion.emoji;
    foodName.textContent = currentQuestion.name;

    optionsGrid.innerHTML = '';
    options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.textContent = opt;
        btn.dataset.country = opt;
        btn.onclick = () => handleAnswer(btn);
        optionsGrid.appendChild(btn);
    });

    quizModal.classList.remove('hidden');
}

function handleAnswer(selectedBtn) {
    // Prevent multiple clicks
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.disabled = true);

    const isCorrect = selectedBtn && selectedBtn.dataset.country === currentQuestion.country;

    if (selectedBtn) {
        if (isCorrect) {
            selectedBtn.classList.add('correct');
        } else {
            selectedBtn.classList.add('wrong');
            // Highlight correct answer
            buttons.forEach(btn => {
                if (btn.dataset.country === currentQuestion.country) {
                    btn.classList.add('correct');
                }
            });
        }
    }

    // Modal stays for 1 second so the user sees the answer
    setTimeout(() => {
        processResult(isCorrect);
        quizModal.classList.add('hidden');
    }, 1000);
}

function processResult(isCorrect) {
    if (!isGameActive) return;

    if (isCorrect) {
        let earnedPoints = 3;
        streak++;

        // Bonus points every 3rd streak
        if (streak % 3 === 0) {
            earnedPoints += 2;
            showToast('Seri Bonusu! +5 Puan ve +4 Saniye', 'toast-bonus');
        } else {
            showToast('Doğru! +3 Puan ve +4 Saniye', 'toast-success');
        }

        score += earnedPoints;

        // Doğru cevap verdikçe süre 4 saniye artar
        globalTimeLeft += 4.0;
        if (globalTimeLeft > 60) globalTimeLeft = 60; // Max 60 seconds

    } else {
        streak = 0; // Seriyi (üst üste doğru bilmeyi) sıfırla, ama puanı ve süreyi sıfırlama
        showToast('Yanlış!', 'toast-error');
    }

    updateUI();
}

function updateUI() {
    scoreDisplay.textContent = score;
    streakDisplay.textContent = streak;

    // Timer text and warning color
    timeLimitDisplay.textContent = `${globalTimeLeft.toFixed(1)}s`;
    if (globalTimeLeft <= 5.0) {
        timeLimitDisplay.style.color = '#ff416c';
    } else {
        timeLimitDisplay.style.color = '#ffd700'; // Default gold
    }

    if (streak >= 3) {
        streakFire.textContent = '🔥'.repeat(Math.floor(streak / 3));
    } else {
        streakFire.textContent = '';
    }
}

function showToast(message, typeClass) {
    toast.textContent = message;
    toast.className = `show ${typeClass}`;

    setTimeout(() => {
        toast.className = 'hidden';
    }, 2000);
}
