// Game State
let state = {
    money: 0,
    animals: {
        chicken: 0,
        sheep: 0,
        cow: 0,
        goat: 0,
        buffalo: 0,
        bull: 0,
        rooster: 0,
        horse: 0,
        donkey: 0
    },
    products: {
        egg: 0,
        wool: 0,
        milk: 0,
        goat_milk: 0,
        buffalo_milk: 0,
        leather: 0,
        feather: 0,
        horse_hair: 0,
        donkey_milk: 0
    },
    shelters: {
        chicken: false,
        sheep: false,
        cow: false,
        goat: false,
        buffalo: false,
        bull: false,
        rooster: false,
        horse: false,
        donkey: false
    },
    feeds: {
        chicken: 0,
        sheep: 0,
        cow: 0,
        goat: 0,
        buffalo: 0,
        bull: 0,
        rooster: 0,
        horse: 0,
        donkey: 0
    },
    currentCosts: {
        chicken: 25,
        sheep: 40,
        cow: 48,
        goat: 60,
        buffalo: 120,
        bull: 200,
        rooster: 35,
        horse: 300,
        donkey: 100,
        feed_chicken: 5,
        feed_rooster: 5,
        feed_sheep: 10,
        feed_cow: 20,
        feed_goat: 15,
        feed_buffalo: 40,
        feed_bull: 50,
        feed_horse: 80,
        feed_donkey: 30
    }
};

// Costs and Prices
const COSTS = {
    chicken: 25,
    sheep: 40,
    cow: 48,
    goat: 60,
    buffalo: 120,
    bull: 200,
    rooster: 35,
    horse: 300,
    donkey: 100,
    shelter_chicken: 100,
    shelter_sheep: 150,
    shelter_cow: 200,
    shelter_goat: 250,
    shelter_buffalo: 400,
    shelter_bull: 600,
    shelter_rooster: 120,
    shelter_horse: 800,
    shelter_donkey: 300,
    feed_chicken: 5,
    feed_rooster: 5,
    feed_sheep: 10,
    feed_cow: 20,
    feed_goat: 15,
    feed_buffalo: 40,
    feed_bull: 50,
    feed_horse: 80,
    feed_donkey: 30
};

const SELL_PRICES = {
    egg: 3,
    wool: 5,
    milk: 8,
    goat_milk: 12,
    buffalo_milk: 25,
    leather: 45,
    feather: 6,
    horse_hair: 60,
    donkey_milk: 150
};

// Timers for production base (in seconds)
const PRODUCTION_TIMES = {
    chicken: 5,
    sheep: 6,
    cow: 8,
    goat: 7,
    buffalo: 12,
    bull: 18,
    rooster: 4,
    horse: 15,
    donkey: 10
};

// Current counters for production interval
let counters = {
    chicken: 0,
    sheep: 0,
    cow: 0,
    goat: 0,
    buffalo: 0,
    bull: 0,
    rooster: 0,
    horse: 0,
    donkey: 0
};

// DOM Elements
const els = {
    moneyDisplay: document.getElementById('money-display'),
    bellContainer: document.getElementById('bell-container'),

    // Animals
    buyChicken: document.getElementById('buy-chicken'),
    buySheep: document.getElementById('buy-sheep'),
    buyCow: document.getElementById('buy-cow'),
    buyGoat: document.getElementById('buy-goat'),
    buyBuffalo: document.getElementById('buy-buffalo'),
    buyBull: document.getElementById('buy-bull'),
    buyRooster: document.getElementById('buy-rooster'),
    buyHorse: document.getElementById('buy-horse'),
    buyDonkey: document.getElementById('buy-donkey'),

    countChicken: document.getElementById('count-chicken'),
    countSheep: document.getElementById('count-sheep'),
    countCow: document.getElementById('count-cow'),
    countGoat: document.getElementById('count-goat'),
    countBuffalo: document.getElementById('count-buffalo'),
    countBull: document.getElementById('count-bull'),
    countRooster: document.getElementById('count-rooster'),
    countHorse: document.getElementById('count-horse'),
    countDonkey: document.getElementById('count-donkey'),

    // Shelters
    buyShelterChicken: document.getElementById('buy-shelter-chicken'),
    buyShelterSheep: document.getElementById('buy-shelter-sheep'),
    buyShelterCow: document.getElementById('buy-shelter-cow'),
    buyShelterGoat: document.getElementById('buy-shelter-goat'),
    buyShelterBuffalo: document.getElementById('buy-shelter-buffalo'),
    buyShelterBull: document.getElementById('buy-shelter-bull'),
    buyShelterRooster: document.getElementById('buy-shelter-rooster'),
    buyShelterHorse: document.getElementById('buy-shelter-horse'),
    buyShelterDonkey: document.getElementById('buy-shelter-donkey'),

    hasShelterChicken: document.getElementById('has-shelter-chicken'),
    hasShelterSheep: document.getElementById('has-shelter-sheep'),
    hasShelterCow: document.getElementById('has-shelter-cow'),
    hasShelterGoat: document.getElementById('has-shelter-goat'),
    hasShelterBuffalo: document.getElementById('has-shelter-buffalo'),
    hasShelterBull: document.getElementById('has-shelter-bull'),
    hasShelterRooster: document.getElementById('has-shelter-rooster'),
    hasShelterHorse: document.getElementById('has-shelter-horse'),
    hasShelterDonkey: document.getElementById('has-shelter-donkey'),

    // Inventory
    invEgg: document.getElementById('inv-egg'),
    invWool: document.getElementById('inv-wool'),
    invMilk: document.getElementById('inv-milk'),
    invGoatMilk: document.getElementById('inv-goat-milk'),
    invBuffaloMilk: document.getElementById('inv-buffalo-milk'),
    invLeather: document.getElementById('inv-leather'),
    invFeather: document.getElementById('inv-feather'),
    invHorseHair: document.getElementById('inv-horse-hair'),
    invDonkeyMilk: document.getElementById('inv-donkey-milk'),

    sellEgg: document.getElementById('sell-egg'),
    sellWool: document.getElementById('sell-wool'),
    sellMilk: document.getElementById('sell-milk'),
    sellGoatMilk: document.getElementById('sell-goat-milk'),
    sellBuffaloMilk: document.getElementById('sell-buffalo-milk'),
    sellLeather: document.getElementById('sell-leather'),
    sellFeather: document.getElementById('sell-feather'),
    sellHorseHair: document.getElementById('sell-horse-hair'),
    sellDonkeyMilk: document.getElementById('sell-donkey-milk'),

    // Feeds
    buyFeedChicken: document.getElementById('buy-feed-chicken'),
    buyFeedRooster: document.getElementById('buy-feed-rooster'),
    buyFeedSheep: document.getElementById('buy-feed-sheep'),
    buyFeedCow: document.getElementById('buy-feed-cow'),
    buyFeedGoat: document.getElementById('buy-feed-goat'),
    buyFeedBuffalo: document.getElementById('buy-feed-buffalo'),
    buyFeedBull: document.getElementById('buy-feed-bull'),
    buyFeedHorse: document.getElementById('buy-feed-horse'),
    buyFeedDonkey: document.getElementById('buy-feed-donkey'),

    countFeedChicken: document.getElementById('count-feed-chicken'),
    countFeedRooster: document.getElementById('count-feed-rooster'),
    countFeedSheep: document.getElementById('count-feed-sheep'),
    countFeedCow: document.getElementById('count-feed-cow'),
    countFeedGoat: document.getElementById('count-feed-goat'),
    countFeedBuffalo: document.getElementById('count-feed-buffalo'),
    countFeedBull: document.getElementById('count-feed-bull'),
    countFeedHorse: document.getElementById('count-feed-horse'),
    countFeedDonkey: document.getElementById('count-feed-donkey')
};

// Initialize Game
function init() {
    updateUI();

    // Bell Click Listener
    els.bellContainer.addEventListener('mousedown', handleBellClick);

    // Buy Animal Listeners
    els.buyChicken.addEventListener('click', () => buyAnimal('chicken'));
    els.buySheep.addEventListener('click', () => buyAnimal('sheep'));
    els.buyCow.addEventListener('click', () => buyAnimal('cow'));
    els.buyGoat.addEventListener('click', () => buyAnimal('goat'));
    els.buyBuffalo.addEventListener('click', () => buyAnimal('buffalo'));
    els.buyBull.addEventListener('click', () => buyAnimal('bull'));
    els.buyRooster.addEventListener('click', () => buyAnimal('rooster'));
    els.buyHorse.addEventListener('click', () => buyAnimal('horse'));
    els.buyDonkey.addEventListener('click', () => buyAnimal('donkey'));

    // Buy Shelter Listeners
    els.buyShelterChicken.addEventListener('click', () => buyShelter('chicken'));
    els.buyShelterSheep.addEventListener('click', () => buyShelter('sheep'));
    els.buyShelterCow.addEventListener('click', () => buyShelter('cow'));
    els.buyShelterGoat.addEventListener('click', () => buyShelter('goat'));
    els.buyShelterBuffalo.addEventListener('click', () => buyShelter('buffalo'));
    els.buyShelterBull.addEventListener('click', () => buyShelter('bull'));
    els.buyShelterRooster.addEventListener('click', () => buyShelter('rooster'));
    els.buyShelterHorse.addEventListener('click', () => buyShelter('horse'));
    els.buyShelterDonkey.addEventListener('click', () => buyShelter('donkey'));

    // Sell Product Listeners
    els.sellEgg.addEventListener('click', () => sellProduct('egg'));
    els.sellWool.addEventListener('click', () => sellProduct('wool'));
    els.sellMilk.addEventListener('click', () => sellProduct('milk'));
    els.sellGoatMilk.addEventListener('click', () => sellProduct('goat_milk'));
    els.sellBuffaloMilk.addEventListener('click', () => sellProduct('buffalo_milk'));
    els.sellLeather.addEventListener('click', () => sellProduct('leather'));
    els.sellFeather.addEventListener('click', () => sellProduct('feather'));
    els.sellHorseHair.addEventListener('click', () => sellProduct('horse_hair'));
    els.sellDonkeyMilk.addEventListener('click', () => sellProduct('donkey_milk'));

    // Feeds
    els.buyFeedChicken.addEventListener('click', () => buyFeed('chicken'));
    els.buyFeedRooster.addEventListener('click', () => buyFeed('rooster'));
    els.buyFeedSheep.addEventListener('click', () => buyFeed('sheep'));
    els.buyFeedCow.addEventListener('click', () => buyFeed('cow'));
    els.buyFeedGoat.addEventListener('click', () => buyFeed('goat'));
    els.buyFeedBuffalo.addEventListener('click', () => buyFeed('buffalo'));
    els.buyFeedBull.addEventListener('click', () => buyFeed('bull'));
    els.buyFeedHorse.addEventListener('click', () => buyFeed('horse'));
    els.buyFeedDonkey.addEventListener('click', () => buyFeed('donkey'));

    // Game Loop
    setInterval(gameLoop, 1000);
}

// Logic Functions
let audioCtx;
function playBellSound() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime); // C6 notası

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
}

function handleBellClick(e) {
    playBellSound();
    state.money += 1;

    // Spawn Floating Text
    createFloatingText('+1 TL', e);

    updateUI();
}

function buyAnimal(type) {
    if (state.money >= state.currentCosts[type]) {
        state.money -= state.currentCosts[type];
        state.animals[type]++;
        state.currentCosts[type] = Math.ceil(state.currentCosts[type] * 1.15); // Fiyatı %15 artır

        // Add animation
        const btn = els['buy' + type.charAt(0).toUpperCase() + type.slice(1)];
        if (btn) {
            btn.classList.add('anim-buy');
            setTimeout(() => btn.classList.remove('anim-buy'), 300);
        }

        updateUI();
    }
}

function buyShelter(type) {
    let costType = 'shelter_' + type;
    if (state.money >= COSTS[costType] && !state.shelters[type]) {
        state.money -= COSTS[costType];
        state.shelters[type] = true;

        // Add animation
        const btn = els['buyShelter' + type.charAt(0).toUpperCase() + type.slice(1)];
        if (btn) {
            btn.classList.add('anim-buy');
            setTimeout(() => btn.classList.remove('anim-buy'), 300);
        }

        updateUI();
    }
}

function buyFeed(type) {
    let costType = 'feed_' + type;
    if (state.money >= state.currentCosts[costType]) {
        state.money -= state.currentCosts[costType];
        state.feeds[type] += 10; // 10 adet yem
        state.currentCosts[costType] = Math.ceil(state.currentCosts[costType] * 1.15); // Fiyatı %15 artır

        // Add animation
        const btn = els['buyFeed' + type.charAt(0).toUpperCase() + type.slice(1)];
        if (btn) {
            btn.classList.add('anim-buy');
            setTimeout(() => btn.classList.remove('anim-buy'), 300);
        }

        updateUI();
    }
}

function sellProduct(type) {
    if (state.products[type] > 0) {
        state.money += state.products[type] * SELL_PRICES[type];
        state.products[type] = 0;
        updateUI();
    }
}

function gameLoop() {
    // Process each animal type
    produce('chicken', 'egg');
    produce('sheep', 'wool');
    produce('cow', 'milk');
    produce('goat', 'goat_milk');
    produce('buffalo', 'buffalo_milk');
    produce('bull', 'leather');
    produce('rooster', 'feather');
    produce('horse', 'horse_hair');
    produce('donkey', 'donkey_milk');

    updateUI();
}

function produce(animalType, productType) {
    if (state.animals[animalType] > 0) {
        counters[animalType]++;

        let targetTime = PRODUCTION_TIMES[animalType];
        if (state.shelters[animalType]) {
            targetTime = targetTime / 2; // Shelter halves production time
        }

        if (counters[animalType] >= targetTime) {
            // Yeterli yem varsa üret (Her 1 hayvan 1 yem yer)
            if (state.feeds[animalType] >= state.animals[animalType]) {
                state.feeds[animalType] -= state.animals[animalType];
                state.products[productType] += state.animals[animalType];
                counters[animalType] = 0; // Reset counter
            }
            // Yem yoksa üretim zamanı dolduğu halde beklemede kalır
        }
    }
}

// Visual updates
function updateUI() {
    // Update Money
    els.moneyDisplay.textContent = state.money;

    // Update Animal Counts
    els.countChicken.textContent = state.animals.chicken;
    els.countSheep.textContent = state.animals.sheep;
    els.countCow.textContent = state.animals.cow;
    els.countGoat.textContent = state.animals.goat;
    els.countBuffalo.textContent = state.animals.buffalo;
    els.countBull.textContent = state.animals.bull;
    els.countRooster.textContent = state.animals.rooster;
    els.countHorse.textContent = state.animals.horse;
    els.countDonkey.textContent = state.animals.donkey;

    // Update Feed Counts
    els.countFeedChicken.textContent = state.feeds.chicken;
    els.countFeedRooster.textContent = state.feeds.rooster;
    els.countFeedSheep.textContent = state.feeds.sheep;
    els.countFeedCow.textContent = state.feeds.cow;
    els.countFeedGoat.textContent = state.feeds.goat;
    els.countFeedBuffalo.textContent = state.feeds.buffalo;
    els.countFeedBull.textContent = state.feeds.bull;
    els.countFeedHorse.textContent = state.feeds.horse;
    els.countFeedDonkey.textContent = state.feeds.donkey;

    // Update Shelter Status
    els.hasShelterChicken.textContent = state.shelters.chicken ? 'Var (x2)' : 'Yok';
    els.hasShelterSheep.textContent = state.shelters.sheep ? 'Var (x2)' : 'Yok';
    els.hasShelterCow.textContent = state.shelters.cow ? 'Var (x2)' : 'Yok';
    els.hasShelterGoat.textContent = state.shelters.goat ? 'Var (x2)' : 'Yok';
    els.hasShelterBuffalo.textContent = state.shelters.buffalo ? 'Var (x2)' : 'Yok';
    els.hasShelterBull.textContent = state.shelters.bull ? 'Var (x2)' : 'Yok';
    els.hasShelterRooster.textContent = state.shelters.rooster ? 'Var (x2)' : 'Yok';
    els.hasShelterHorse.textContent = state.shelters.horse ? 'Var (x2)' : 'Yok';
    els.hasShelterDonkey.textContent = state.shelters.donkey ? 'Var (x2)' : 'Yok';

    // Update Inventory
    els.invEgg.textContent = state.products.egg;
    els.invWool.textContent = state.products.wool;
    els.invMilk.textContent = state.products.milk;
    els.invGoatMilk.textContent = state.products.goat_milk;
    els.invBuffaloMilk.textContent = state.products.buffalo_milk;
    els.invLeather.textContent = state.products.leather;
    els.invFeather.textContent = state.products.feather;
    els.invHorseHair.textContent = state.products.horse_hair;
    els.invDonkeyMilk.textContent = state.products.donkey_milk;

    // Button Disable States & Dynamic Costs Update
    const animalTypes = ['chicken', 'sheep', 'cow', 'goat', 'buffalo', 'bull', 'rooster', 'horse', 'donkey'];
    animalTypes.forEach(type => {
        let capType = type.charAt(0).toUpperCase() + type.slice(1);

        let btnAnimal = els['buy' + capType];
        if (btnAnimal) {
            btnAnimal.disabled = state.money < state.currentCosts[type];
            let costSpan = btnAnimal.querySelector('.btn-cost');
            if (costSpan) costSpan.textContent = state.currentCosts[type] + ' TL';
        }

        let btnFeed = els['buyFeed' + capType];
        let feedCostType = 'feed_' + type;
        if (btnFeed) {
            btnFeed.disabled = state.money < state.currentCosts[feedCostType];
            let feedCostSpan = btnFeed.querySelector('.btn-cost');
            if (feedCostSpan) feedCostSpan.textContent = state.currentCosts[feedCostType] + ' TL';
        }
    });

    // Shelter Buttons
    updateShelterButton('chicken');
    updateShelterButton('sheep');
    updateShelterButton('cow');
    updateShelterButton('goat');
    updateShelterButton('buffalo');
    updateShelterButton('bull');
    updateShelterButton('rooster');
    updateShelterButton('horse');
    updateShelterButton('donkey');

    // Sell Buttons
    els.sellEgg.disabled = state.products.egg === 0;
    els.sellWool.disabled = state.products.wool === 0;
    els.sellMilk.disabled = state.products.milk === 0;
    els.sellGoatMilk.disabled = state.products.goat_milk === 0;
    els.sellBuffaloMilk.disabled = state.products.buffalo_milk === 0;
    els.sellLeather.disabled = state.products.leather === 0;
    els.sellFeather.disabled = state.products.feather === 0;
    els.sellHorseHair.disabled = state.products.horse_hair === 0;
    els.sellDonkeyMilk.disabled = state.products.donkey_milk === 0;
}

function updateShelterButton(type) {
    const btn = els['buyShelter' + type.charAt(0).toUpperCase() + type.slice(1)];
    const shelterCost = 'shelter_' + type;
    btn.disabled = state.money < COSTS[shelterCost] || state.shelters[type];
    if (state.shelters[type]) {
        btn.querySelector('.btn-cost').textContent = "Alındı";
    }
}

function createFloatingText(text, event) {
    const el = document.createElement('div');
    el.className = 'floating-text';
    el.textContent = text;

    // Calculate position
    const rect = els.bellContainer.getBoundingClientRect();
    let x, y;

    if (event.clientX && event.clientY) {
        x = event.clientX;
        y = event.clientY;
    } else {
        // Fallback to center of bell container if clicked via keyboard or somehow coords are missing
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
    }

    el.style.left = (x - 20) + 'px'; // slight offset
    el.style.top = y + 'px';

    document.body.appendChild(el);

    setTimeout(() => {
        el.remove();
    }, 1000); // Remove after animation finishes
}

// Start
init();
