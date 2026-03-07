export const BIOMES = {
    FOREST: {
        name: "Forest",
        emoji: "🌲",
        weakTo: "FIRE",
        color: "#2ecc71",
        background: "linear-gradient(135deg, #1e392a, #2ecc71)"
    },
    FIRE: {
        name: "Fire",
        emoji: "🔥",
        weakTo: "OCEAN",
        color: "#e74c3c",
        background: "linear-gradient(135deg, #4d1c1c, #e74c3c)"
    },
    OCEAN: {
        name: "Ocean",
        emoji: "🌊",
        weakTo: "ICE",
        color: "#3498db",
        background: "linear-gradient(135deg, #1c3d5a, #3498db)"
    },
    ICE: {
        name: "Ice",
        emoji: "❄️",
        weakTo: "SAVANNAH",
        color: "#ecf0f1",
        background: "linear-gradient(135deg, #2c3e50, #ecf0f1)"
    },
    SAVANNAH: {
        name: "Savannah",
        emoji: "🌾",
        weakTo: "FOREST",
        color: "#f1c40f",
        background: "linear-gradient(135deg, #3d3b1c, #f1c40f)"
    },
    MOUNTAIN: {
        name: "Mountain",
        emoji: "🏔️",
        weakTo: "OCEAN",
        color: "#95a5a6",
        background: "linear-gradient(135deg, #2c3e50, #95a5a6)"
    },
    DESERT: {
        name: "Desert",
        emoji: "🌵",
        weakTo: "ICE",
        color: "#e67e22",
        background: "linear-gradient(135deg, #a04000, #e67e22)"
    },
    SWAMP: {
        name: "Swamp",
        emoji: "🐊",
        weakTo: "FIRE",
        color: "#16a085",
        background: "linear-gradient(135deg, #0b5345, #16a085)"
    },
    SKY: {
        name: "Sky",
        emoji: "☁️",
        weakTo: "MOUNTAIN",
        color: "#8e44ad",
        background: "linear-gradient(135deg, #4b0082, #8e44ad)"
    }
};

export const ANIMALS = [
    // FOREST
    { id: "bee", name: "Bee", emoji: "🐝", biome: "FOREST", hp: 60, atk: 45, def: 20, spd: 90 },
    { id: "owl", name: "Owl", emoji: "🦉", biome: "FOREST", hp: 80, atk: 55, def: 35, spd: 70 },
    { id: "deer", name: "Deer", emoji: "🦌", biome: "FOREST", hp: 100, atk: 40, def: 45, spd: 65 },
    { id: "fox", name: "Fox", emoji: "🦊", biome: "FOREST", hp: 85, atk: 60, def: 30, spd: 80 },

    // FIRE
    { id: "dragon", name: "Dragon", emoji: "🐉", biome: "FIRE", hp: 120, atk: 85, def: 60, spd: 40 },
    { id: "phoenix", name: "Phoenix", emoji: "🐦‍🔥", biome: "FIRE", hp: 90, atk: 75, def: 40, spd: 85 },
    { id: "fire-lion", name: "Magma Lion", emoji: "🦁", biome: "FIRE", hp: 110, atk: 70, def: 55, spd: 50 },
    { id: "salamander", name: "Salamander", emoji: "🦎", biome: "FIRE", hp: 75, atk: 65, def: 35, spd: 75 },

    // OCEAN
    { id: "shark", name: "Shark", emoji: "🦈", biome: "OCEAN", hp: 115, atk: 80, def: 50, spd: 60 },
    { id: "octopus", name: "Octopus", emoji: "🐙", biome: "OCEAN", hp: 95, atk: 65, def: 45, spd: 55 },
    { id: "dolphin", name: "Dolphin", emoji: "🐬", biome: "OCEAN", hp: 90, atk: 55, def: 40, spd: 95 },
    { id: "whale", name: "Whale", emoji: "🐳", biome: "OCEAN", hp: 150, atk: 50, def: 80, spd: 30 },

    // ICE
    { id: "penguin", name: "Penguin", emoji: "🐧", biome: "ICE", hp: 85, atk: 45, def: 55, spd: 65 },
    { id: "polar-bear", name: "Polar Bear", emoji: "🐻‍❄️", biome: "ICE", hp: 130, atk: 70, def: 70, spd: 45 },
    { id: "snow-wolf", name: "Snow Wolf", emoji: "🐺", biome: "ICE", hp: 95, atk: 65, def: 40, spd: 85 },
    { id: "ice-cube", name: "Ice Golem", emoji: "🧊", biome: "ICE", hp: 140, atk: 40, def: 90, spd: 20 },

    // SAVANNAH
    { id: "lion", name: "Lion", emoji: "🦁", biome: "SAVANNAH", hp: 110, atk: 75, def: 55, spd: 60 },
    { id: "elephant", name: "Elephant", emoji: "🐘", biome: "SAVANNAH", hp: 160, atk: 60, def: 85, spd: 25 },
    { id: "zebra", name: "Zebra", emoji: "🦓", biome: "SAVANNAH", hp: 95, atk: 45, def: 40, spd: 80 },
    { id: "giraffe", name: "Giraffe", emoji: "🦒", biome: "SAVANNAH", hp: 105, atk: 50, def: 50, spd: 55 },

    // MOUNTAIN
    { id: "eagle", name: "Eagle", emoji: "🦅", biome: "MOUNTAIN", hp: 85, atk: 70, def: 35, spd: 90 },
    { id: "goat", name: "Goat", emoji: "🐐", biome: "MOUNTAIN", hp: 100, atk: 55, def: 50, spd: 65 },
    { id: "yeti", name: "Yeti", emoji: "👹", biome: "MOUNTAIN", hp: 140, atk: 75, def: 65, spd: 35 },
    { id: "condor", name: "Condor", emoji: "🦅", biome: "MOUNTAIN", hp: 90, atk: 60, def: 40, spd: 80 },

    // DESERT
    { id: "scorpion", name: "Scorpion", emoji: "🦂", biome: "DESERT", hp: 70, atk: 65, def: 45, spd: 75 },
    { id: "camel", name: "Camel", emoji: "🐪", biome: "DESERT", hp: 120, atk: 50, def: 60, spd: 40 },
    { id: "snake", name: "Cobra", emoji: "🐍", biome: "DESERT", hp: 80, atk: 75, def: 30, spd: 85 },
    { id: "fennec", name: "Fennec Fox", emoji: "🦊", biome: "DESERT", hp: 65, atk: 55, def: 25, spd: 95 },

    // SWAMP
    { id: "crocodile", name: "Crocodile", emoji: "🐊", biome: "SWAMP", hp: 130, atk: 80, def: 70, spd: 30 },
    { id: "frog", name: "Poison Frog", emoji: "🐸", biome: "SWAMP", hp: 60, atk: 70, def: 20, spd: 90 },
    { id: "hippo", name: "Hippo", emoji: "🦛", biome: "SWAMP", hp: 150, atk: 65, def: 75, spd: 25 },
    { id: "mosquito", name: "Mosquito", emoji: "🦟", biome: "SWAMP", hp: 30, atk: 90, def: 10, spd: 120 },

    // SKY
    { id: "hawk", name: "Hawk", emoji: "🦅", biome: "SKY", hp: 80, atk: 75, def: 30, spd: 100 },
    { id: "pegasus", name: "Pegasus", emoji: "🦄", biome: "SKY", hp: 100, atk: 65, def: 45, spd: 90 },
    { id: "cloud-spirit", name: "Cloud Spirit", emoji: "☁️", biome: "SKY", hp: 70, atk: 80, def: 20, spd: 110 },
    { id: "thunder-bird", name: "Thunder Bird", emoji: "⚡", biome: "SKY", hp: 90, atk: 85, def: 40, spd: 85 }
];
