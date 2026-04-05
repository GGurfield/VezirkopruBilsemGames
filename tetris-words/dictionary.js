const TIMEOUT_MS = 4000;

async function fetchWithTimeout(url) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(id);
        return res;
    } catch (e) {
        clearTimeout(id);
        throw e;
    }
}

async function translateWord(word, sl, tl) {
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(word)}`;
        const res = await fetchWithTimeout(url);
        if (!res.ok) return `${word} (Translation failed)`;
        const data = await res.json();
        return data[0][0][0]; // Extracts only the primary translation
    } catch(err) {
        return `${word} (Timeout/Error)`;
    }
}

async function validateWord(word, mode) {
  if (!word || word.length < 2) return null;
  try {
    if (mode.startsWith('EN')) {
        const response = await fetchWithTimeout(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        if (!response.ok) return null;
        const data = await response.json();
        const validWord = data[0].word;
        
        if (mode === 'EN_EN') {
            return {
                word: validWord,
                meaning: data[0].meanings[0].definitions[0].definition
            };
        } else if (mode === 'EN_TR') {
            const trWord = await translateWord(validWord, 'en', 'tr');
            return { word: validWord, meaning: trWord };
        }
    } else if (mode.startsWith('TR')) {
        const trLower = word.toLocaleLowerCase('tr-TR');
        const response = await fetchWithTimeout(`https://sozluk.gov.tr/gts?ara=${encodeURIComponent(trLower)}`);
        if (!response.ok) return null;
        const data = await response.json();
        if (data.error) return null; // "Sonuç bulunamadı"

        const validWord = data[0].madde || word;
        
        if (mode === 'TR_TR') {
            const meaning = data[0].anlamlarListe ? data[0].anlamlarListe[0].anlam : "Anlam bulunamadı";
            return { word: validWord.toLocaleUpperCase('tr-TR'), meaning: meaning };
        } else if (mode === 'TR_EN') {
            const enWord = await translateWord(validWord, 'tr', 'en');
            return { word: validWord.toLocaleUpperCase('tr-TR'), meaning: enWord };
        }
    }
    return null;
  } catch (err) {
    console.error("Dictionary API Error:", err);
    return null;
  }
}

window.validateWord = validateWord;
