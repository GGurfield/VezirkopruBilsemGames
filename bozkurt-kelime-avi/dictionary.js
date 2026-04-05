/**
 * Turkish Word Dictionary Logic for Bozkurt Kelime Avı
 */

// Basic word list for fallback
const FALLBACK_WORDS = new Set([
    "BOZKURT", "ASENA", "TÜRK", "BOZKIR", "OBA", "KOTUZ", "TÜREYİŞ", "OĞUZ", "GÖKTÜRK", "KÜRŞAD",
    "TÖRE", "HAKAN", "KAĞAN", "SULTAN", "OTAY", "KUT", "İL", "YURT", "BALBAL", "ERGENEKON",
    "MANAS", "ALPAY", "ALP", "BATUR", "BAHADIR", "YİĞİT", "BİLGİ", "AKIL", "ERDEM", "GÜÇ",
    "SEVGİ", "SAYGI", "BARIŞ", "ÖZGÜRLÜK", "VATAN", "BAYRAK", "MİLLET", "DEVLET", "HALK", "ULUS"
]);

/**
 * Fetch word meaning and validation from TDK API (sozluk.gov.tr)
 * @param {string} word 
 * @returns {Promise<{isValid: boolean, meaning?: string}>}
 */
async function validateAndGetMeaning(word) {
    if (!word || word.length < 3) return { isValid: false };

    // TDK uses lowercase for searches, but the Turkish 'İ'/'i' and 'I'/'ı' distinction is critical.
    const searchWord = word.toLocaleLowerCase('tr-TR');

    try {
        // Note: sozluk.gov.tr API usually doesn't have strict CORS for GET requests, 
        // but it might fail in some environments.
        const response = await fetch(`https://sozluk.gov.tr/gts?ara=${encodeURIComponent(searchWord)}`);
        const data = await response.json();

        // TDK returns an array; if it contains an object with 'error', it's invalid.
        if (data && data.length > 0 && !data.error) {
            // Get the first meaning from the first entry
            let meaning = "Anlam bulunamadı.";
            if (data[0].anlamlarListe && data[0].anlamlarListe.length > 0) {
                meaning = data[0].anlamlarListe[0].anlam;
            }
            return { isValid: true, meaning };
        }
    } catch (error) {
        console.warn("TDK API connection failed, falling back to local list:", error);
    }

    // Fallback to local list if API fails or word not found in TDK
    const upperWord = word.toLocaleUpperCase('tr-TR');
    if (FALLBACK_WORDS.has(upperWord)) {
        return { isValid: true, meaning: "Bozkırın kadim kelimelerinden biri." };
    }

    return { isValid: false };
}

// Letter frequency weights for generation
const TURKISH_LETTER_FREQUENCIES = {
    'A': 11.92, 'E': 9.53, 'İ': 8.24, 'N': 7.04, 'L': 6.51, 'R': 6.02,
    'D': 4.88, 'K': 4.86, 'U': 3.51, 'M': 3.49, 'T': 3.31, 'S': 3.20,
    'O': 2.76, 'Y': 2.58, 'I': 2.57, 'Z': 2.44, 'Ü': 2.15, 'B': 1.83,
    'H': 1.48, 'Ç': 1.25, 'Ş': 1.14, 'G': 1.05, 'V': 0.95, 'Ö': 0.81,
    'C': 0.46, 'P': 0.38, 'F': 0.35, 'J': 0.03, 'Ğ': 0.01
};

const TURKISH_LETTER_SCORES = {
    'A': 1, 'E': 1, 'İ': 1, 'N': 1, 'L': 1, 'R': 1,
    'D': 2, 'K': 2, 'U': 2, 'M': 2, 'T': 2, 'S': 2,
    'O': 3, 'Y': 3, 'I': 3, 'Z': 3, 'Ü': 3,
    'B': 4, 'H': 4, 'Ç': 5, 'Ş': 5, 'G': 5,
    'V': 7, 'Ö': 7, 'C': 8, 'P': 9, 'F': 10,
    'J': 15, 'Ğ': 20
};

// export { validateAndGetMeaning, TURKISH_LETTER_FREQUENCIES, TURKISH_LETTER_SCORES };
