const foodData = [
    {
        "name": "Sushi",
        "emoji": "🍣",
        "country": "Japonya"
    },
    {
        "name": "Pizza",
        "emoji": "🍕",
        "country": "İtalya"
    },
    {
        "name": "Taco",
        "emoji": "🌮",
        "country": "Meksika"
    },
    {
        "name": "Kruvasan",
        "emoji": "🥐",
        "country": "Fransa"
    },
    {
        "name": "Döner Kebab",
        "emoji": "🥙",
        "country": "Türkiye"
    },
    {
        "name": "Hamburger",
        "emoji": "🍔",
        "country": "ABD"
    },
    {
        "name": "Paella",
        "emoji": "🥘",
        "country": "İspanya"
    },
    {
        "name": "Soslu Köri",
        "emoji": "🍛",
        "country": "Hindistan"
    },
    {
        "name": "Bento",
        "emoji": "🍱",
        "country": "Japonya"
    },
    {
        "name": "Simit",
        "emoji": "🥨",
        "country": "Türkiye"
    },
    {
        "name": "Spagetti",
        "emoji": "🍝",
        "country": "İtalya"
    },
    {
        "name": "Ramen",
        "emoji": "🍜",
        "country": "Japonya"
    },
    {
        "name": "Mantı",
        "emoji": "🥟",
        "country": "Türkiye"
    },
    {
        "name": "Baget Ekmek",
        "emoji": "🥖",
        "country": "Fransa"
    },
    {
        "name": "Waffle",
        "emoji": "🧇",
        "country": "Belçika"
    },
    {
        "name": "Peynir Fondu",
        "emoji": "🫕",
        "country": "İsviçre"
    },
    {
        "name": "Borscht Çorbası",
        "emoji": "🍲",
        "country": "Rusya"
    },
    {
        "name": "Burrito",
        "emoji": "🌯",
        "country": "Meksika"
    },
    {
        "name": "Pekin Ördeği",
        "emoji": "🦆",
        "country": "Çin"
    },
    {
        "name": "Fish and Chips",
        "emoji": "🐠",
        "country": "İngiltere"
    },
    {
        "name": "İrlanda Usulü Ev Yapımı Burger",
        "emoji": "🍔",
        "country": "İrlanda"
    },
    {
        "name": "Güney Kore Usulü Yöresel Noodle",
        "emoji": "🍜",
        "country": "Güney Kore"
    },
    {
        "name": "Arjantin Usulü Lüks Peynir",
        "emoji": "🧀",
        "country": "Arjantin"
    },
    {
        "name": "Ekşi Rusya Çorba",
        "emoji": "🥣",
        "country": "Rusya"
    },
    {
        "name": "Portekiz Usulü Kızarmış Kruvasan",
        "emoji": "🥐",
        "country": "Portekiz"
    },
    {
        "name": "Kremalı Yeni Zelanda Kruvasan",
        "emoji": "🥐",
        "country": "Yeni Zelanda"
    },
    {
        "name": "Hindistan Usulü Özel Pay",
        "emoji": "🥧",
        "country": "Hindistan"
    },
    {
        "name": "Meksika Usulü Baharatlı Taco",
        "emoji": "🌮",
        "country": "Meksika"
    },
    {
        "name": "Japonya Usulü Özel Krep",
        "emoji": "🥞",
        "country": "Japonya"
    },
    {
        "name": "Çin Usulü Kremalı Gözleme",
        "emoji": "🫓",
        "country": "Çin"
    },
    {
        "name": "Lübnan Usulü Taze Çorba",
        "emoji": "🥣",
        "country": "Lübnan"
    },
    {
        "name": "Şefin Hindistan Karides",
        "emoji": "🍤",
        "country": "Hindistan"
    },
    {
        "name": "Yunanistan Usulü Sokak Kalamar",
        "emoji": "🦑",
        "country": "Yunanistan"
    },
    {
        "name": "Geleneksel Güney Kore Donut",
        "emoji": "🍩",
        "country": "Güney Kore"
    },
    {
        "name": "Ateşli Hindistan Çorba",
        "emoji": "🥣",
        "country": "Hindistan"
    },
    {
        "name": "Arjantin Usulü Izgara Pizza",
        "emoji": "🍕",
        "country": "Arjantin"
    },
    {
        "name": "Çıtır Çin Dondurma",
        "emoji": "🍦",
        "country": "Çin"
    },
    {
        "name": "Izgara Güney Kore Salata",
        "emoji": "🥗",
        "country": "Güney Kore"
    },
    {
        "name": "Şefin Avustralya Çoban Salatası",
        "emoji": "🥗",
        "country": "Avustralya"
    },
    {
        "name": "İngiltere Usulü Karışık Pilav",
        "emoji": "🍚",
        "country": "İngiltere"
    },
    {
        "name": "Malezya Usulü Taze Falafel",
        "emoji": "🧆",
        "country": "Malezya"
    },
    {
        "name": "Izgara Türkiye Kebap",
        "emoji": "🍢",
        "country": "Türkiye"
    },
    {
        "name": "Portekiz Usulü Yöresel Taco",
        "emoji": "🌮",
        "country": "Portekiz"
    },
    {
        "name": "Karışık İran Peynir",
        "emoji": "🧀",
        "country": "İran"
    },
    {
        "name": "Kızarmış Fas Kruvasan",
        "emoji": "🥐",
        "country": "Fas"
    },
    {
        "name": "Hindistan Usulü Tuzlu Krep",
        "emoji": "🥞",
        "country": "Hindistan"
    },
    {
        "name": "Ev Yapımı Kanada Waffle",
        "emoji": "🧇",
        "country": "Kanada"
    },
    {
        "name": "Baharatlı Vietnam Patates Kızartması",
        "emoji": "🍟",
        "country": "Vietnam"
    },
    {
        "name": "Ateşli Güney Afrika Sandviç",
        "emoji": "🥪",
        "country": "Güney Afrika"
    },
    {
        "name": "Özel Güney Afrika Börek",
        "emoji": "🥟",
        "country": "Güney Afrika"
    },
    {
        "name": "Peynirli Macaristan Pizza",
        "emoji": "🍕",
        "country": "Macaristan"
    },
    {
        "name": "ABD Usulü Klasik Donut",
        "emoji": "🍩",
        "country": "ABD"
    },
    {
        "name": "Taze İngiltere Biftek",
        "emoji": "🥩",
        "country": "İngiltere"
    },
    {
        "name": "Klasik Rusya Et Izgara",
        "emoji": "🥩",
        "country": "Rusya"
    },
    {
        "name": "Arjantin Usulü Deniz Ürünlü Burrito",
        "emoji": "🌯",
        "country": "Arjantin"
    },
    {
        "name": "Türkiye Usulü Taze Salata",
        "emoji": "🥗",
        "country": "Türkiye"
    },
    {
        "name": "Fırınlanmış İspanya Tost",
        "emoji": "🥪",
        "country": "İspanya"
    },
    {
        "name": "Soslu Almanya Tatlı",
        "emoji": "🍰",
        "country": "Almanya"
    },
    {
        "name": "Klasik Tayland Gözleme",
        "emoji": "🫓",
        "country": "Tayland"
    },
    {
        "name": "ABD Usulü Izgara Ekmek",
        "emoji": "🍞",
        "country": "ABD"
    },
    {
        "name": "ABD Usulü Kremalı Soslu Köri",
        "emoji": "🍛",
        "country": "ABD"
    },
    {
        "name": "Güney Kore Usulü Sokak Tost",
        "emoji": "🥪",
        "country": "Güney Kore"
    },
    {
        "name": "Klasik Brezilya Burrito",
        "emoji": "🌯",
        "country": "Brezilya"
    },
    {
        "name": "Portekiz Usulü Çıtır Pilav",
        "emoji": "🍚",
        "country": "Portekiz"
    },
    {
        "name": "Tatlı Brezilya Kavurma",
        "emoji": "🥩",
        "country": "Brezilya"
    },
    {
        "name": "Çin Usulü Ateşli Biftek",
        "emoji": "🥩",
        "country": "Çin"
    },
    {
        "name": "Belçika Usulü Karışık Patates Kızartması",
        "emoji": "🍟",
        "country": "Belçika"
    },
    {
        "name": "Ev Yapımı Brezilya Salata",
        "emoji": "🥗",
        "country": "Brezilya"
    },
    {
        "name": "Almanya Usulü Baharatlı Kurabiye",
        "emoji": "🍪",
        "country": "Almanya"
    },
    {
        "name": "Almanya Usulü Izgara Kurabiye",
        "emoji": "🍪",
        "country": "Almanya"
    },
    {
        "name": "Fırınlanmış Avustralya Tost",
        "emoji": "🥪",
        "country": "Avustralya"
    },
    {
        "name": "Kremalı Brezilya Falafel",
        "emoji": "🧆",
        "country": "Brezilya"
    },
    {
        "name": "ABD Usulü Peynirli Kavurma",
        "emoji": "🥩",
        "country": "ABD"
    },
    {
        "name": "İspanya Usulü Izgara Mantı",
        "emoji": "🥟",
        "country": "İspanya"
    },
    {
        "name": "Meksika Usulü Çıtır Donut",
        "emoji": "🍩",
        "country": "Meksika"
    },
    {
        "name": "Haşlanmış Fransa Burger",
        "emoji": "🍔",
        "country": "Fransa"
    },
    {
        "name": "Kızarmış Endonezya Mantı",
        "emoji": "🥟",
        "country": "Endonezya"
    },
    {
        "name": "Deniz Ürünlü İran Et Izgara",
        "emoji": "🥩",
        "country": "İran"
    },
    {
        "name": "Şili Usulü Haşlanmış Kalamar",
        "emoji": "🦑",
        "country": "Şili"
    },
    {
        "name": "Baharatlı Türkiye Pilav",
        "emoji": "🍚",
        "country": "Türkiye"
    },
    {
        "name": "Tuzlu Kolombiya Donut",
        "emoji": "🍩",
        "country": "Kolombiya"
    },
    {
        "name": "Ekşi Avusturya Kalamar",
        "emoji": "🦑",
        "country": "Avusturya"
    },
    {
        "name": "Meksika Usulü Peynirli Pay",
        "emoji": "🥧",
        "country": "Meksika"
    },
    {
        "name": "Közlenmiş Güney Afrika Tatlı",
        "emoji": "🍰",
        "country": "Güney Afrika"
    },
    {
        "name": "Ekşi Japonya Ekmek",
        "emoji": "🍞",
        "country": "Japonya"
    },
    {
        "name": "İngiltere Usulü Karışık Kek",
        "emoji": "🧁",
        "country": "İngiltere"
    },
    {
        "name": "Avusturya Usulü Kızarmış Krep",
        "emoji": "🥞",
        "country": "Avusturya"
    },
    {
        "name": "Sarımsaklı Çin Kurabiye",
        "emoji": "🍪",
        "country": "Çin"
    },
    {
        "name": "Endonezya Usulü Sokak Sandviç",
        "emoji": "🥪",
        "country": "Endonezya"
    },
    {
        "name": "Avusturya Usulü Ateşli Biftek",
        "emoji": "🥩",
        "country": "Avusturya"
    },
    {
        "name": "Kolombiya Usulü Deniz Ürünlü Tatlı",
        "emoji": "🍰",
        "country": "Kolombiya"
    },
    {
        "name": "Şefin Fransa Pilav",
        "emoji": "🍚",
        "country": "Fransa"
    },
    {
        "name": "Tayland Usulü Kızarmış Patates Kızartması",
        "emoji": "🍟",
        "country": "Tayland"
    },
    {
        "name": "Yöresel İsviçre Burrito",
        "emoji": "🌯",
        "country": "İsviçre"
    },
    {
        "name": "Hindistan Usulü Deniz Ürünlü Ekmek",
        "emoji": "🍞",
        "country": "Hindistan"
    },
    {
        "name": "Şili Usulü Taze Börek",
        "emoji": "🥟",
        "country": "Şili"
    },
    {
        "name": "İspanya Usulü Ev Yapımı Balık",
        "emoji": "🐟",
        "country": "İspanya"
    },
    {
        "name": "Haşlanmış Şili Soslu Köri",
        "emoji": "🍛",
        "country": "Şili"
    },
    {
        "name": "Fırınlanmış Küba Biftek",
        "emoji": "🥩",
        "country": "Küba"
    },
    {
        "name": "Yöresel Brezilya Burger",
        "emoji": "🍔",
        "country": "Brezilya"
    },
    {
        "name": "Çin Usulü Soslu Tavuk Izgara",
        "emoji": "🍗",
        "country": "Çin"
    },
    {
        "name": "Kanada Usulü Baharatlı Tost",
        "emoji": "🥪",
        "country": "Kanada"
    },
    {
        "name": "Soslu Türkiye Kavurma",
        "emoji": "🥩",
        "country": "Türkiye"
    },
    {
        "name": "Kremalı Japonya Burger",
        "emoji": "🍔",
        "country": "Japonya"
    },
    {
        "name": "Fas Usulü Geleneksel Kebap",
        "emoji": "🍢",
        "country": "Fas"
    },
    {
        "name": "Yöresel Rusya Tost",
        "emoji": "🥪",
        "country": "Rusya"
    },
    {
        "name": "Malezya Usulü Kremalı Pay",
        "emoji": "🥧",
        "country": "Malezya"
    },
    {
        "name": "Peru Usulü Deniz Ürünlü Kruvasan",
        "emoji": "🥐",
        "country": "Peru"
    },
    {
        "name": "Karışık İrlanda Mantı",
        "emoji": "🥟",
        "country": "İrlanda"
    },
    {
        "name": "Rusya Usulü Sarımsaklı Sandviç",
        "emoji": "🥪",
        "country": "Rusya"
    },
    {
        "name": "Fransa Usulü Haşlanmış Kavurma",
        "emoji": "🥩",
        "country": "Fransa"
    },
    {
        "name": "İsveç Usulü Ekşi Kek",
        "emoji": "🧁",
        "country": "İsveç"
    },
    {
        "name": "Brezilya Usulü Ekşi Pilav",
        "emoji": "🍚",
        "country": "Brezilya"
    },
    {
        "name": "Ev Yapımı Tayland Gözleme",
        "emoji": "🫓",
        "country": "Tayland"
    },
    {
        "name": "Avusturya Usulü Acı Soslu Köri",
        "emoji": "🍛",
        "country": "Avusturya"
    },
    {
        "name": "Peynirli Brezilya Falafel",
        "emoji": "🧆",
        "country": "Brezilya"
    },
    {
        "name": "Peru Usulü Tuzlu Peynir",
        "emoji": "🧀",
        "country": "Peru"
    },
    {
        "name": "Sarımsaklı Türkiye Mantı",
        "emoji": "🥟",
        "country": "Türkiye"
    },
    {
        "name": "Mısır Usulü Tatlı Kek",
        "emoji": "🧁",
        "country": "Mısır"
    },
    {
        "name": "Yeni Zelanda Usulü Zeytinyağlı Soslu Köri",
        "emoji": "🍛",
        "country": "Yeni Zelanda"
    },
    {
        "name": "Şefin Küba Noodle",
        "emoji": "🍜",
        "country": "Küba"
    },
    {
        "name": "Portekiz Usulü Yöresel Kalamar",
        "emoji": "🦑",
        "country": "Portekiz"
    },
    {
        "name": "Fırınlanmış İsveç Ekmek",
        "emoji": "🍞",
        "country": "İsveç"
    },
    {
        "name": "Taze İsveç Biftek",
        "emoji": "🥩",
        "country": "İsveç"
    },
    {
        "name": "Malezya Usulü Ateşli Tatlı",
        "emoji": "🍰",
        "country": "Malezya"
    },
    {
        "name": "Közlenmiş Şili Et Izgara",
        "emoji": "🥩",
        "country": "Şili"
    },
    {
        "name": "Tayland Usulü Taze Krep",
        "emoji": "🥞",
        "country": "Tayland"
    },
    {
        "name": "Arjantin Usulü Klasik Biftek",
        "emoji": "🥩",
        "country": "Arjantin"
    },
    {
        "name": "Ateşli Japonya Taco",
        "emoji": "🌮",
        "country": "Japonya"
    },
    {
        "name": "Yöresel Peru Çoban Salatası",
        "emoji": "🥗",
        "country": "Peru"
    },
    {
        "name": "Kremalı Tayland Donut",
        "emoji": "🍩",
        "country": "Tayland"
    },
    {
        "name": "Almanya Usulü Teriyaki Soslu Kek",
        "emoji": "🧁",
        "country": "Almanya"
    },
    {
        "name": "Şefin Macaristan Peynir",
        "emoji": "🧀",
        "country": "Macaristan"
    },
    {
        "name": "Malezya Usulü Ekşi Kruvasan",
        "emoji": "🥐",
        "country": "Malezya"
    },
    {
        "name": "ABD Usulü Tuzlu Patates Kızartması",
        "emoji": "🍟",
        "country": "ABD"
    },
    {
        "name": "Yunanistan Usulü Peynirli Burger",
        "emoji": "🍔",
        "country": "Yunanistan"
    },
    {
        "name": "Tayland Usulü Çıtır Waffle",
        "emoji": "🧇",
        "country": "Tayland"
    },
    {
        "name": "Fransa Usulü Soslu Biftek",
        "emoji": "🥩",
        "country": "Fransa"
    },
    {
        "name": "İngiltere Usulü Haşlanmış Kurabiye",
        "emoji": "🍪",
        "country": "İngiltere"
    },
    {
        "name": "Malezya Usulü Ekşi Kalamar",
        "emoji": "🦑",
        "country": "Malezya"
    },
    {
        "name": "İran Usulü Geleneksel Pay",
        "emoji": "🥧",
        "country": "İran"
    },
    {
        "name": "Ekşi Çin Noodle",
        "emoji": "🍜",
        "country": "Çin"
    },
    {
        "name": "Polonya Usulü Klasik Tatlı",
        "emoji": "🍰",
        "country": "Polonya"
    },
    {
        "name": "Macaristan Usulü Şefin Çoban Salatası",
        "emoji": "🥗",
        "country": "Macaristan"
    },
    {
        "name": "Fas Usulü Haşlanmış Kruvasan",
        "emoji": "🥐",
        "country": "Fas"
    },
    {
        "name": "Ateşli İspanya Burger",
        "emoji": "🍔",
        "country": "İspanya"
    },
    {
        "name": "Brezilya Usulü Közlenmiş Kavurma",
        "emoji": "🥩",
        "country": "Brezilya"
    },
    {
        "name": "Türkiye Usulü Taze Burrito",
        "emoji": "🌯",
        "country": "Türkiye"
    },
    {
        "name": "Tatlı ABD Sosisli",
        "emoji": "🌭",
        "country": "ABD"
    },
    {
        "name": "Taze İspanya Pilav",
        "emoji": "🍚",
        "country": "İspanya"
    },
    {
        "name": "Tatlı Brezilya Çoban Salatası",
        "emoji": "🥗",
        "country": "Brezilya"
    },
    {
        "name": "Avustralya Usulü Ateşli Burger",
        "emoji": "🍔",
        "country": "Avustralya"
    },
    {
        "name": "Fırınlanmış Vietnam Pizza",
        "emoji": "🍕",
        "country": "Vietnam"
    },
    {
        "name": "Baharatlı Fransa Biftek",
        "emoji": "🥩",
        "country": "Fransa"
    },
    {
        "name": "Türkiye Usulü Soslu Burrito",
        "emoji": "🌯",
        "country": "Türkiye"
    },
    {
        "name": "Klasik İran Tost",
        "emoji": "🥪",
        "country": "İran"
    },
    {
        "name": "Kanada Usulü Tuzlu Taco",
        "emoji": "🌮",
        "country": "Kanada"
    },
    {
        "name": "Fransa Usulü Geleneksel Makarna",
        "emoji": "🍝",
        "country": "Fransa"
    },
    {
        "name": "Izgara ABD Karides",
        "emoji": "🍤",
        "country": "ABD"
    },
    {
        "name": "Peru Usulü Közlenmiş Kruvasan",
        "emoji": "🥐",
        "country": "Peru"
    },
    {
        "name": "Fırınlanmış Polonya Biftek",
        "emoji": "🥩",
        "country": "Polonya"
    },
    {
        "name": "Kolombiya Usulü Peynirli Falafel",
        "emoji": "🧆",
        "country": "Kolombiya"
    },
    {
        "name": "Klasik İsveç Karides",
        "emoji": "🍤",
        "country": "İsveç"
    },
    {
        "name": "Geleneksel Yunanistan Kek",
        "emoji": "🧁",
        "country": "Yunanistan"
    },
    {
        "name": "Küba Usulü Peynirli Tavuk Izgara",
        "emoji": "🍗",
        "country": "Küba"
    },
    {
        "name": "Kremalı Yunanistan Noodle",
        "emoji": "🍜",
        "country": "Yunanistan"
    },
    {
        "name": "Macaristan Usulü Teriyaki Soslu Pizza",
        "emoji": "🍕",
        "country": "Macaristan"
    },
    {
        "name": "Sarımsaklı Belçika Balık",
        "emoji": "🐟",
        "country": "Belçika"
    },
    {
        "name": "Yunanistan Usulü Taze Waffle",
        "emoji": "🧇",
        "country": "Yunanistan"
    },
    {
        "name": "Klasik Küba Et Izgara",
        "emoji": "🥩",
        "country": "Küba"
    },
    {
        "name": "Güney Afrika Usulü Kızarmış Peynir",
        "emoji": "🧀",
        "country": "Güney Afrika"
    },
    {
        "name": "Klasik Polonya Börek",
        "emoji": "🥟",
        "country": "Polonya"
    },
    {
        "name": "İsviçre Usulü Deniz Ürünlü Tatlı",
        "emoji": "🍰",
        "country": "İsviçre"
    },
    {
        "name": "Almanya Usulü Kızarmış Tatlı",
        "emoji": "🍰",
        "country": "Almanya"
    },
    {
        "name": "Haşlanmış Portekiz Çorba",
        "emoji": "🥣",
        "country": "Portekiz"
    },
    {
        "name": "Çin Usulü Zeytinyağlı Tavuk Izgara",
        "emoji": "🍗",
        "country": "Çin"
    },
    {
        "name": "Kanada Usulü Peynirli Karides",
        "emoji": "🍤",
        "country": "Kanada"
    },
    {
        "name": "Soslu Kanada Kurabiye",
        "emoji": "🍪",
        "country": "Kanada"
    },
    {
        "name": "Peru Usulü Deniz Ürünlü Makarna",
        "emoji": "🍝",
        "country": "Peru"
    },
    {
        "name": "Klasik Almanya Çorba",
        "emoji": "🥣",
        "country": "Almanya"
    },
    {
        "name": "Brezilya Usulü Ev Yapımı Et Izgara",
        "emoji": "🥩",
        "country": "Brezilya"
    },
    {
        "name": "Karışık Endonezya Burrito",
        "emoji": "🌯",
        "country": "Endonezya"
    },
    {
        "name": "Yöresel Portekiz Mantı",
        "emoji": "🥟",
        "country": "Portekiz"
    },
    {
        "name": "Şefin Polonya Krep",
        "emoji": "🥞",
        "country": "Polonya"
    },
    {
        "name": "Zeytinyağlı İspanya Krep",
        "emoji": "🥞",
        "country": "İspanya"
    },
    {
        "name": "Közlenmiş Kanada Noodle",
        "emoji": "🍜",
        "country": "Kanada"
    },
    {
        "name": "İran Usulü Tuzlu Kruvasan",
        "emoji": "🥐",
        "country": "İran"
    },
    {
        "name": "Avustralya Usulü Lüks Ekmek",
        "emoji": "🍞",
        "country": "Avustralya"
    },
    {
        "name": "İtalya Usulü Ekşi Sushi",
        "emoji": "🍣",
        "country": "İtalya"
    },
    {
        "name": "Lübnan Usulü Ateşli Balık",
        "emoji": "🐟",
        "country": "Lübnan"
    },
    {
        "name": "ABD Usulü Teriyaki Soslu Sosisli",
        "emoji": "🌭",
        "country": "ABD"
    },
    {
        "name": "Karışık Yunanistan Pay",
        "emoji": "🥧",
        "country": "Yunanistan"
    },
    {
        "name": "Kızarmış Japonya Sushi",
        "emoji": "🍣",
        "country": "Japonya"
    },
    {
        "name": "Klasik İran Et Izgara",
        "emoji": "🥩",
        "country": "İran"
    },
    {
        "name": "Çıtır İngiltere Noodle",
        "emoji": "🍜",
        "country": "İngiltere"
    },
    {
        "name": "Yeni Zelanda Usulü Acı Taco",
        "emoji": "🌮",
        "country": "Yeni Zelanda"
    },
    {
        "name": "Ekşi İrlanda Çoban Salatası",
        "emoji": "🥗",
        "country": "İrlanda"
    },
    {
        "name": "Kızarmış Yeni Zelanda Waffle",
        "emoji": "🧇",
        "country": "Yeni Zelanda"
    },
    {
        "name": "Tuzlu İsveç Makarna",
        "emoji": "🍝",
        "country": "İsveç"
    },
    {
        "name": "Mısır Usulü Lüks Noodle",
        "emoji": "🍜",
        "country": "Mısır"
    },
    {
        "name": "Tatlı Arjantin Ekmek",
        "emoji": "🍞",
        "country": "Arjantin"
    },
    {
        "name": "Teriyaki Soslu Şili Börek",
        "emoji": "🥟",
        "country": "Şili"
    },
    {
        "name": "Japonya Usulü Sarımsaklı Ekmek",
        "emoji": "🍞",
        "country": "Japonya"
    },
    {
        "name": "Peru Usulü Fırınlanmış Börek",
        "emoji": "🥟",
        "country": "Peru"
    },
    {
        "name": "Tatlı İspanya Kalamar",
        "emoji": "🦑",
        "country": "İspanya"
    },
    {
        "name": "Hindistan Usulü Lüks Kurabiye",
        "emoji": "🍪",
        "country": "Hindistan"
    },
    {
        "name": "Hindistan Usulü Klasik Krep",
        "emoji": "🥞",
        "country": "Hindistan"
    },
    {
        "name": "Kolombiya Usulü Yöresel Gözleme",
        "emoji": "🫓",
        "country": "Kolombiya"
    },
    {
        "name": "Şefin Fas Soslu Köri",
        "emoji": "🍛",
        "country": "Fas"
    },
    {
        "name": "Rusya Usulü Lüks Burger",
        "emoji": "🍔",
        "country": "Rusya"
    },
    {
        "name": "İngiltere Usulü Haşlanmış Gözleme",
        "emoji": "🫓",
        "country": "İngiltere"
    },
    {
        "name": "Arjantin Usulü Kremalı Börek",
        "emoji": "🥟",
        "country": "Arjantin"
    },
    {
        "name": "Avusturya Usulü Sokak Burrito",
        "emoji": "🌯",
        "country": "Avusturya"
    },
    {
        "name": "Meksika Usulü Yöresel Donut",
        "emoji": "🍩",
        "country": "Meksika"
    },
    {
        "name": "Polonya Usulü Kremalı Burger",
        "emoji": "🍔",
        "country": "Polonya"
    },
    {
        "name": "Zeytinyağlı Polonya Donut",
        "emoji": "🍩",
        "country": "Polonya"
    },
    {
        "name": "ABD Usulü Taze Tavuk Izgara",
        "emoji": "🍗",
        "country": "ABD"
    },
    {
        "name": "Yöresel Meksika Ekmek",
        "emoji": "🍞",
        "country": "Meksika"
    },
    {
        "name": "Özel Belçika Çorba",
        "emoji": "🥣",
        "country": "Belçika"
    },
    {
        "name": "Arjantin Usulü Sokak Pay",
        "emoji": "🥧",
        "country": "Arjantin"
    },
    {
        "name": "Soslu Fas Mantı",
        "emoji": "🥟",
        "country": "Fas"
    },
    {
        "name": "Fransa Usulü Ev Yapımı Kavurma",
        "emoji": "🥩",
        "country": "Fransa"
    },
    {
        "name": "Baharatlı İrlanda Pay",
        "emoji": "🥧",
        "country": "İrlanda"
    },
    {
        "name": "Kızarmış Avusturya Peynir",
        "emoji": "🧀",
        "country": "Avusturya"
    },
    {
        "name": "Yöresel Çin Çorba",
        "emoji": "🥣",
        "country": "Çin"
    },
    {
        "name": "Güney Kore Usulü Haşlanmış Burger",
        "emoji": "🍔",
        "country": "Güney Kore"
    },
    {
        "name": "İsveç Usulü Fırınlanmış Salata",
        "emoji": "🥗",
        "country": "İsveç"
    },
    {
        "name": "Macaristan Usulü Teriyaki Soslu Tavuk Izgara",
        "emoji": "🍗",
        "country": "Macaristan"
    },
    {
        "name": "Közlenmiş Peru Börek",
        "emoji": "🥟",
        "country": "Peru"
    },
    {
        "name": "Kanada Usulü Tatlı Soslu Köri",
        "emoji": "🍛",
        "country": "Kanada"
    },
    {
        "name": "Güney Kore Usulü Karışık Kalamar",
        "emoji": "🦑",
        "country": "Güney Kore"
    },
    {
        "name": "İsveç Usulü Ekşi Çorba",
        "emoji": "🥣",
        "country": "İsveç"
    },
    {
        "name": "Çıtır Hindistan Donut",
        "emoji": "🍩",
        "country": "Hindistan"
    },
    {
        "name": "Portekiz Usulü Acı Kurabiye",
        "emoji": "🍪",
        "country": "Portekiz"
    },
    {
        "name": "İsviçre Usulü Karışık Kurabiye",
        "emoji": "🍪",
        "country": "İsviçre"
    },
    {
        "name": "Haşlanmış Fas Noodle",
        "emoji": "🍜",
        "country": "Fas"
    },
    {
        "name": "Kolombiya Usulü Izgara Burrito",
        "emoji": "🌯",
        "country": "Kolombiya"
    },
    {
        "name": "Güney Afrika Usulü Ekşi Çoban Salatası",
        "emoji": "🥗",
        "country": "Güney Afrika"
    },
    {
        "name": "Acı İran Börek",
        "emoji": "🥟",
        "country": "İran"
    },
    {
        "name": "Almanya Usulü Peynirli Kek",
        "emoji": "🧁",
        "country": "Almanya"
    },
    {
        "name": "Özel Rusya Börek",
        "emoji": "🥟",
        "country": "Rusya"
    },
    {
        "name": "Avusturya Usulü Haşlanmış Karides",
        "emoji": "🍤",
        "country": "Avusturya"
    },
    {
        "name": "Ateşli Portekiz Sosisli",
        "emoji": "🌭",
        "country": "Portekiz"
    },
    {
        "name": "Sarımsaklı Şili Pay",
        "emoji": "🥧",
        "country": "Şili"
    },
    {
        "name": "İtalya Usulü Haşlanmış Kalamar",
        "emoji": "🦑",
        "country": "İtalya"
    },
    {
        "name": "Deniz Ürünlü Çin Tatlı",
        "emoji": "🍰",
        "country": "Çin"
    },
    {
        "name": "Çıtır Almanya Dondurma",
        "emoji": "🍦",
        "country": "Almanya"
    },
    {
        "name": "Şefin Arjantin Donut",
        "emoji": "🍩",
        "country": "Arjantin"
    },
    {
        "name": "Közlenmiş Rusya Sosisli",
        "emoji": "🌭",
        "country": "Rusya"
    },
    {
        "name": "Klasik Hindistan Burger",
        "emoji": "🍔",
        "country": "Hindistan"
    },
    {
        "name": "Özel Türkiye Pizza",
        "emoji": "🍕",
        "country": "Türkiye"
    },
    {
        "name": "Teriyaki Soslu Güney Afrika Pilav",
        "emoji": "🍚",
        "country": "Güney Afrika"
    },
    {
        "name": "Yeni Zelanda Usulü Peynirli Kavurma",
        "emoji": "🥩",
        "country": "Yeni Zelanda"
    },
    {
        "name": "İrlanda Usulü Klasik Kek",
        "emoji": "🧁",
        "country": "İrlanda"
    },
    {
        "name": "Portekiz Usulü Kızarmış Balık",
        "emoji": "🐟",
        "country": "Portekiz"
    },
    {
        "name": "Deniz Ürünlü Avustralya Peynir",
        "emoji": "🧀",
        "country": "Avustralya"
    },
    {
        "name": "İsviçre Usulü Yöresel Makarna",
        "emoji": "🍝",
        "country": "İsviçre"
    },
    {
        "name": "Fransa Usulü Teriyaki Soslu Burger",
        "emoji": "🍔",
        "country": "Fransa"
    },
    {
        "name": "Yunanistan Usulü Zeytinyağlı Çorba",
        "emoji": "🥣",
        "country": "Yunanistan"
    },
    {
        "name": "Ev Yapımı Fransa Patates Kızartması",
        "emoji": "🍟",
        "country": "Fransa"
    },
    {
        "name": "Lüks Tayland Kebap",
        "emoji": "🍢",
        "country": "Tayland"
    },
    {
        "name": "Acı Güney Afrika Sosisli",
        "emoji": "🌭",
        "country": "Güney Afrika"
    },
    {
        "name": "Deniz Ürünlü Türkiye Patates Kızartması",
        "emoji": "🍟",
        "country": "Türkiye"
    },
    {
        "name": "Acı İsveç Börek",
        "emoji": "🥟",
        "country": "İsveç"
    },
    {
        "name": "İsviçre Usulü Baharatlı Pizza",
        "emoji": "🍕",
        "country": "İsviçre"
    },
    {
        "name": "İngiltere Usulü Özel Waffle",
        "emoji": "🧇",
        "country": "İngiltere"
    },
    {
        "name": "Güney Afrika Usulü Soslu Çoban Salatası",
        "emoji": "🥗",
        "country": "Güney Afrika"
    },
    {
        "name": "Arjantin Usulü Özel Karides",
        "emoji": "🍤",
        "country": "Arjantin"
    },
    {
        "name": "Haşlanmış Fas Pizza",
        "emoji": "🍕",
        "country": "Fas"
    },
    {
        "name": "Küba Usulü Acı Kek",
        "emoji": "🧁",
        "country": "Küba"
    },
    {
        "name": "ABD Usulü Kremalı Balık",
        "emoji": "🐟",
        "country": "ABD"
    },
    {
        "name": "Avustralya Usulü Geleneksel Krep",
        "emoji": "🥞",
        "country": "Avustralya"
    },
    {
        "name": "Teriyaki Soslu İrlanda Tost",
        "emoji": "🥪",
        "country": "İrlanda"
    },
    {
        "name": "Zeytinyağlı Fas Tavuk Izgara",
        "emoji": "🍗",
        "country": "Fas"
    },
    {
        "name": "Acı Şili Sosisli",
        "emoji": "🌭",
        "country": "Şili"
    },
    {
        "name": "Mısır Usulü Ekşi Falafel",
        "emoji": "🧆",
        "country": "Mısır"
    },
    {
        "name": "Yunanistan Usulü Taze Pay",
        "emoji": "🥧",
        "country": "Yunanistan"
    },
    {
        "name": "Brezilya Usulü Sarımsaklı Burrito",
        "emoji": "🌯",
        "country": "Brezilya"
    },
    {
        "name": "Sokak İsveç Çorba",
        "emoji": "🥣",
        "country": "İsveç"
    },
    {
        "name": "Vietnam Usulü Taze Et Izgara",
        "emoji": "🥩",
        "country": "Vietnam"
    },
    {
        "name": "Güney Kore Usulü Kremalı Burger",
        "emoji": "🍔",
        "country": "Güney Kore"
    },
    {
        "name": "Ev Yapımı Kanada Burrito",
        "emoji": "🌯",
        "country": "Kanada"
    },
    {
        "name": "Avusturya Usulü Kızarmış Karides",
        "emoji": "🍤",
        "country": "Avusturya"
    },
    {
        "name": "Japonya Usulü Tuzlu Salata",
        "emoji": "🥗",
        "country": "Japonya"
    },
    {
        "name": "İsveç Usulü Fırınlanmış Ekmek",
        "emoji": "🍞",
        "country": "İsveç"
    },
    {
        "name": "Rusya Usulü Kızarmış Balık",
        "emoji": "🐟",
        "country": "Rusya"
    },
    {
        "name": "İsviçre Usulü Kremalı Noodle",
        "emoji": "🍜",
        "country": "İsviçre"
    },
    {
        "name": "Lüks Avustralya Kek",
        "emoji": "🧁",
        "country": "Avustralya"
    },
    {
        "name": "Közlenmiş Fransa Salata",
        "emoji": "🥗",
        "country": "Fransa"
    },
    {
        "name": "Haşlanmış Şili Sushi",
        "emoji": "🍣",
        "country": "Şili"
    },
    {
        "name": "Arjantin Usulü Ateşli Peynir",
        "emoji": "🧀",
        "country": "Arjantin"
    },
    {
        "name": "Geleneksel ABD Tatlı",
        "emoji": "🍰",
        "country": "ABD"
    },
    {
        "name": "Ateşli Belçika Dondurma",
        "emoji": "🍦",
        "country": "Belçika"
    },
    {
        "name": "Deniz Ürünlü Brezilya Makarna",
        "emoji": "🍝",
        "country": "Brezilya"
    },
    {
        "name": "Almanya Usulü Yöresel Salata",
        "emoji": "🥗",
        "country": "Almanya"
    },
    {
        "name": "Endonezya Usulü Teriyaki Soslu Karides",
        "emoji": "🍤",
        "country": "Endonezya"
    },
    {
        "name": "İrlanda Usulü Karışık Çoban Salatası",
        "emoji": "🥗",
        "country": "İrlanda"
    },
    {
        "name": "Acı İspanya Falafel",
        "emoji": "🧆",
        "country": "İspanya"
    },
    {
        "name": "Teriyaki Soslu Mısır Burrito",
        "emoji": "🌯",
        "country": "Mısır"
    },
    {
        "name": "Brezilya Usulü Tuzlu Biftek",
        "emoji": "🥩",
        "country": "Brezilya"
    },
    {
        "name": "Közlenmiş Tayland Kek",
        "emoji": "🧁",
        "country": "Tayland"
    },
    {
        "name": "Haşlanmış Vietnam Çorba",
        "emoji": "🥣",
        "country": "Vietnam"
    },
    {
        "name": "Belçika Usulü Kızarmış Çorba",
        "emoji": "🥣",
        "country": "Belçika"
    },
    {
        "name": "İran Usulü Tatlı Soslu Köri",
        "emoji": "🍛",
        "country": "İran"
    },
    {
        "name": "Yöresel Güney Afrika Patates Kızartması",
        "emoji": "🍟",
        "country": "Güney Afrika"
    },
    {
        "name": "Rusya Usulü Karışık Peynir",
        "emoji": "🧀",
        "country": "Rusya"
    },
    {
        "name": "Polonya Usulü Klasik Dondurma",
        "emoji": "🍦",
        "country": "Polonya"
    },
    {
        "name": "İspanya Usulü Karışık Noodle",
        "emoji": "🍜",
        "country": "İspanya"
    },
    {
        "name": "Özel Türkiye Balık",
        "emoji": "🐟",
        "country": "Türkiye"
    },
    {
        "name": "Kanada Usulü Ev Yapımı Noodle",
        "emoji": "🍜",
        "country": "Kanada"
    },
    {
        "name": "Sarımsaklı Güney Kore Tavuk Izgara",
        "emoji": "🍗",
        "country": "Güney Kore"
    },
    {
        "name": "Fırınlanmış Vietnam Kalamar",
        "emoji": "🦑",
        "country": "Vietnam"
    },
    {
        "name": "Şefin Yeni Zelanda Mantı",
        "emoji": "🥟",
        "country": "Yeni Zelanda"
    },
    {
        "name": "Polonya Usulü Tatlı Tost",
        "emoji": "🥪",
        "country": "Polonya"
    },
    {
        "name": "Türkiye Usulü Sarımsaklı Biftek",
        "emoji": "🥩",
        "country": "Türkiye"
    },
    {
        "name": "Baharatlı Tayland Kavurma",
        "emoji": "🥩",
        "country": "Tayland"
    },
    {
        "name": "Geleneksel Fas Ekmek",
        "emoji": "🍞",
        "country": "Fas"
    },
    {
        "name": "Ev Yapımı Meksika Falafel",
        "emoji": "🧆",
        "country": "Meksika"
    },
    {
        "name": "Şefin Peru Mantı",
        "emoji": "🥟",
        "country": "Peru"
    },
    {
        "name": "Meksika Usulü Izgara Burger",
        "emoji": "🍔",
        "country": "Meksika"
    },
    {
        "name": "Ev Yapımı Güney Afrika Mantı",
        "emoji": "🥟",
        "country": "Güney Afrika"
    },
    {
        "name": "Izgara Şili Tost",
        "emoji": "🥪",
        "country": "Şili"
    },
    {
        "name": "Çıtır Güney Afrika Krep",
        "emoji": "🥞",
        "country": "Güney Afrika"
    },
    {
        "name": "Yöresel İrlanda Burrito",
        "emoji": "🌯",
        "country": "İrlanda"
    },
    {
        "name": "Rusya Usulü Kremalı Tost",
        "emoji": "🥪",
        "country": "Rusya"
    },
    {
        "name": "Rusya Usulü Özel Sushi",
        "emoji": "🍣",
        "country": "Rusya"
    },
    {
        "name": "Tatlı Şili Mantı",
        "emoji": "🥟",
        "country": "Şili"
    },
    {
        "name": "Hindistan Usulü Sokak Kavurma",
        "emoji": "🥩",
        "country": "Hindistan"
    },
    {
        "name": "Arjantin Usulü Karışık Patates Kızartması",
        "emoji": "🍟",
        "country": "Arjantin"
    },
    {
        "name": "Küba Usulü Baharatlı Krep",
        "emoji": "🥞",
        "country": "Küba"
    },
    {
        "name": "Belçika Usulü Yöresel Burger",
        "emoji": "🍔",
        "country": "Belçika"
    },
    {
        "name": "Izgara İspanya Makarna",
        "emoji": "🍝",
        "country": "İspanya"
    },
    {
        "name": "Acı Almanya Et Izgara",
        "emoji": "🥩",
        "country": "Almanya"
    },
    {
        "name": "Polonya Usulü Ateşli Noodle",
        "emoji": "🍜",
        "country": "Polonya"
    },
    {
        "name": "Kremalı ABD Ekmek",
        "emoji": "🍞",
        "country": "ABD"
    },
    {
        "name": "Ev Yapımı Rusya Pizza",
        "emoji": "🍕",
        "country": "Rusya"
    },
    {
        "name": "Küba Usulü Sokak Makarna",
        "emoji": "🍝",
        "country": "Küba"
    },
    {
        "name": "Meksika Usulü Çıtır Kek",
        "emoji": "🧁",
        "country": "Meksika"
    },
    {
        "name": "Şili Usulü Çıtır Ekmek",
        "emoji": "🍞",
        "country": "Şili"
    },
    {
        "name": "Soslu Malezya Balık",
        "emoji": "🐟",
        "country": "Malezya"
    },
    {
        "name": "Kızarmış İrlanda Balık",
        "emoji": "🐟",
        "country": "İrlanda"
    },
    {
        "name": "Lüks Meksika Karides",
        "emoji": "🍤",
        "country": "Meksika"
    },
    {
        "name": "İran Usulü Ekşi Taco",
        "emoji": "🌮",
        "country": "İran"
    },
    {
        "name": "İsveç Usulü Çıtır Donut",
        "emoji": "🍩",
        "country": "İsveç"
    },
    {
        "name": "Hindistan Usulü Klasik Gözleme",
        "emoji": "🫓",
        "country": "Hindistan"
    },
    {
        "name": "Klasik Kolombiya Noodle",
        "emoji": "🍜",
        "country": "Kolombiya"
    },
    {
        "name": "Avustralya Usulü Tuzlu Karides",
        "emoji": "🍤",
        "country": "Avustralya"
    },
    {
        "name": "Sarımsaklı Türkiye Kavurma",
        "emoji": "🥩",
        "country": "Türkiye"
    },
    {
        "name": "Mısır Usulü Izgara Noodle",
        "emoji": "🍜",
        "country": "Mısır"
    },
    {
        "name": "Ekşi Fransa Krep",
        "emoji": "🥞",
        "country": "Fransa"
    },
    {
        "name": "Hindistan Usulü Taze Taco",
        "emoji": "🌮",
        "country": "Hindistan"
    },
    {
        "name": "İspanya Usulü Közlenmiş Tavuk Izgara",
        "emoji": "🍗",
        "country": "İspanya"
    },
    {
        "name": "Karışık Malezya Soslu Köri",
        "emoji": "🍛",
        "country": "Malezya"
    },
    {
        "name": "Tuzlu İsviçre Biftek",
        "emoji": "🥩",
        "country": "İsviçre"
    },
    {
        "name": "Belçika Usulü Karışık Burrito",
        "emoji": "🌯",
        "country": "Belçika"
    },
    {
        "name": "Malezya Usulü Geleneksel Et Izgara",
        "emoji": "🥩",
        "country": "Malezya"
    },
    {
        "name": "Fırınlanmış Kolombiya Kavurma",
        "emoji": "🥩",
        "country": "Kolombiya"
    },
    {
        "name": "Güney Afrika Usulü Lüks Peynir",
        "emoji": "🧀",
        "country": "Güney Afrika"
    },
    {
        "name": "Geleneksel Belçika Soslu Köri",
        "emoji": "🍛",
        "country": "Belçika"
    },
    {
        "name": "Şefin Yeni Zelanda Balık",
        "emoji": "🐟",
        "country": "Yeni Zelanda"
    },
    {
        "name": "İsveç Usulü Ateşli Patates Kızartması",
        "emoji": "🍟",
        "country": "İsveç"
    },
    {
        "name": "Meksika Usulü Deniz Ürünlü Kalamar",
        "emoji": "🦑",
        "country": "Meksika"
    },
    {
        "name": "Portekiz Usulü Ekşi Gözleme",
        "emoji": "🫓",
        "country": "Portekiz"
    },
    {
        "name": "Meksika Usulü Şefin Çorba",
        "emoji": "🥣",
        "country": "Meksika"
    },
    {
        "name": "Avustralya Usulü Şefin Kavurma",
        "emoji": "🥩",
        "country": "Avustralya"
    },
    {
        "name": "Küba Usulü Baharatlı Et Izgara",
        "emoji": "🥩",
        "country": "Küba"
    },
    {
        "name": "Karışık Brezilya Peynir",
        "emoji": "🧀",
        "country": "Brezilya"
    },
    {
        "name": "Tatlı Kolombiya Burger",
        "emoji": "🍔",
        "country": "Kolombiya"
    },
    {
        "name": "Yunanistan Usulü Teriyaki Soslu Gözleme",
        "emoji": "🫓",
        "country": "Yunanistan"
    },
    {
        "name": "Geleneksel İtalya Kek",
        "emoji": "🧁",
        "country": "İtalya"
    },
    {
        "name": "Japonya Usulü Peynirli Peynir",
        "emoji": "🧀",
        "country": "Japonya"
    },
    {
        "name": "Peynirli Yunanistan Peynir",
        "emoji": "🧀",
        "country": "Yunanistan"
    },
    {
        "name": "Arjantin Usulü Çıtır Patates Kızartması",
        "emoji": "🍟",
        "country": "Arjantin"
    },
    {
        "name": "Güney Kore Usulü Ev Yapımı Burrito",
        "emoji": "🌯",
        "country": "Güney Kore"
    },
    {
        "name": "Mısır Usulü Kızarmış Noodle",
        "emoji": "🍜",
        "country": "Mısır"
    },
    {
        "name": "Tayland Usulü Özel Burrito",
        "emoji": "🌯",
        "country": "Tayland"
    },
    {
        "name": "Baharatlı ABD Dondurma",
        "emoji": "🍦",
        "country": "ABD"
    },
    {
        "name": "Ateşli Arjantin Kurabiye",
        "emoji": "🍪",
        "country": "Arjantin"
    },
    {
        "name": "Tayland Usulü Yöresel Sandviç",
        "emoji": "🥪",
        "country": "Tayland"
    },
    {
        "name": "Güney Kore Usulü Tatlı Et Izgara",
        "emoji": "🥩",
        "country": "Güney Kore"
    },
    {
        "name": "İngiltere Usulü Klasik Peynir",
        "emoji": "🧀",
        "country": "İngiltere"
    },
    {
        "name": "Tatlı İsveç Pizza",
        "emoji": "🍕",
        "country": "İsveç"
    },
    {
        "name": "Almanya Usulü Geleneksel Donut",
        "emoji": "🍩",
        "country": "Almanya"
    },
    {
        "name": "Lüks Çin Burger",
        "emoji": "🍔",
        "country": "Çin"
    },
    {
        "name": "Malezya Usulü Fırınlanmış Burrito",
        "emoji": "🌯",
        "country": "Malezya"
    },
    {
        "name": "Malezya Usulü Karışık Sosisli",
        "emoji": "🌭",
        "country": "Malezya"
    },
    {
        "name": "Geleneksel İtalya Sosisli",
        "emoji": "🌭",
        "country": "İtalya"
    },
    {
        "name": "Peynirli Japonya Makarna",
        "emoji": "🍝",
        "country": "Japonya"
    },
    {
        "name": "Zeytinyağlı Yeni Zelanda Noodle",
        "emoji": "🍜",
        "country": "Yeni Zelanda"
    },
    {
        "name": "Macaristan Usulü Sarımsaklı Tost",
        "emoji": "🥪",
        "country": "Macaristan"
    },
    {
        "name": "Ateşli Mısır Kurabiye",
        "emoji": "🍪",
        "country": "Mısır"
    },
    {
        "name": "Sokak Yunanistan Burrito",
        "emoji": "🌯",
        "country": "Yunanistan"
    },
    {
        "name": "Yöresel Polonya Tavuk Izgara",
        "emoji": "🍗",
        "country": "Polonya"
    },
    {
        "name": "Avusturya Usulü Közlenmiş Et Izgara",
        "emoji": "🥩",
        "country": "Avusturya"
    },
    {
        "name": "Güney Kore Usulü Lüks Makarna",
        "emoji": "🍝",
        "country": "Güney Kore"
    },
    {
        "name": "Şili Usulü Lüks Dondurma",
        "emoji": "🍦",
        "country": "Şili"
    },
    {
        "name": "Güney Kore Usulü Yöresel Falafel",
        "emoji": "🧆",
        "country": "Güney Kore"
    },
    {
        "name": "Belçika Usulü Karışık Çoban Salatası",
        "emoji": "🥗",
        "country": "Belçika"
    },
    {
        "name": "İran Usulü Ateşli Çorba",
        "emoji": "🥣",
        "country": "İran"
    },
    {
        "name": "Tuzlu Küba Sushi",
        "emoji": "🍣",
        "country": "Küba"
    },
    {
        "name": "Rusya Usulü Şefin Makarna",
        "emoji": "🍝",
        "country": "Rusya"
    },
    {
        "name": "Mısır Usulü Ev Yapımı Kruvasan",
        "emoji": "🥐",
        "country": "Mısır"
    },
    {
        "name": "Közlenmiş Küba Tatlı",
        "emoji": "🍰",
        "country": "Küba"
    },
    {
        "name": "Hindistan Usulü Ev Yapımı Burrito",
        "emoji": "🌯",
        "country": "Hindistan"
    },
    {
        "name": "İrlanda Usulü Teriyaki Soslu Sushi",
        "emoji": "🍣",
        "country": "İrlanda"
    },
    {
        "name": "Tatlı Yunanistan Çoban Salatası",
        "emoji": "🥗",
        "country": "Yunanistan"
    },
    {
        "name": "İngiltere Usulü Zeytinyağlı Kebap",
        "emoji": "🍢",
        "country": "İngiltere"
    },
    {
        "name": "Soslu Rusya Börek",
        "emoji": "🥟",
        "country": "Rusya"
    },
    {
        "name": "Klasik Rusya Kek",
        "emoji": "🧁",
        "country": "Rusya"
    },
    {
        "name": "Güney Kore Usulü Karışık Soslu Köri",
        "emoji": "🍛",
        "country": "Güney Kore"
    },
    {
        "name": "Tatlı Polonya Noodle",
        "emoji": "🍜",
        "country": "Polonya"
    },
    {
        "name": "Şefin Mısır Çorba",
        "emoji": "🥣",
        "country": "Mısır"
    },
    {
        "name": "Hindistan Usulü Peynirli Kavurma",
        "emoji": "🥩",
        "country": "Hindistan"
    },
    {
        "name": "Kremalı Portekiz Pilav",
        "emoji": "🍚",
        "country": "Portekiz"
    },
    {
        "name": "Lübnan Usulü Deniz Ürünlü Pay",
        "emoji": "🥧",
        "country": "Lübnan"
    },
    {
        "name": "Şefin Küba Tatlı",
        "emoji": "🍰",
        "country": "Küba"
    },
    {
        "name": "Arjantin Usulü Geleneksel Dondurma",
        "emoji": "🍦",
        "country": "Arjantin"
    },
    {
        "name": "Soslu Çin Sushi",
        "emoji": "🍣",
        "country": "Çin"
    },
    {
        "name": "Mısır Usulü Baharatlı Tost",
        "emoji": "🥪",
        "country": "Mısır"
    },
    {
        "name": "Belçika Usulü Haşlanmış Dondurma",
        "emoji": "🍦",
        "country": "Belçika"
    },
    {
        "name": "Avusturya Usulü Deniz Ürünlü Burrito",
        "emoji": "🌯",
        "country": "Avusturya"
    },
    {
        "name": "Çin Usulü Haşlanmış Balık",
        "emoji": "🐟",
        "country": "Çin"
    },
    {
        "name": "İrlanda Usulü Izgara Börek",
        "emoji": "🥟",
        "country": "İrlanda"
    },
    {
        "name": "Hindistan Usulü Sarımsaklı Pay",
        "emoji": "🥧",
        "country": "Hindistan"
    },
    {
        "name": "Sarımsaklı İrlanda Pay",
        "emoji": "🥧",
        "country": "İrlanda"
    },
    {
        "name": "Kızarmış Kanada Tost",
        "emoji": "🥪",
        "country": "Kanada"
    },
    {
        "name": "Mısır Usulü Fırınlanmış Noodle",
        "emoji": "🍜",
        "country": "Mısır"
    },
    {
        "name": "Sokak ABD Ekmek",
        "emoji": "🍞",
        "country": "ABD"
    },
    {
        "name": "Vietnam Usulü Haşlanmış Kavurma",
        "emoji": "🥩",
        "country": "Vietnam"
    },
    {
        "name": "İran Usulü Soslu Falafel",
        "emoji": "🧆",
        "country": "İran"
    },
    {
        "name": "Zeytinyağlı Kolombiya Peynir",
        "emoji": "🧀",
        "country": "Kolombiya"
    },
    {
        "name": "Japonya Usulü Fırınlanmış Kavurma",
        "emoji": "🥩",
        "country": "Japonya"
    },
    {
        "name": "Küba Usulü Kızarmış Kavurma",
        "emoji": "🥩",
        "country": "Küba"
    },
    {
        "name": "ABD Usulü Baharatlı Falafel",
        "emoji": "🧆",
        "country": "ABD"
    },
    {
        "name": "Lübnan Usulü Karışık Balık",
        "emoji": "🐟",
        "country": "Lübnan"
    },
    {
        "name": "Macaristan Usulü Yöresel Kebap",
        "emoji": "🍢",
        "country": "Macaristan"
    },
    {
        "name": "İtalya Usulü Sarımsaklı Biftek",
        "emoji": "🥩",
        "country": "İtalya"
    },
    {
        "name": "Klasik Japonya Soslu Köri",
        "emoji": "🍛",
        "country": "Japonya"
    },
    {
        "name": "Teriyaki Soslu Şili Patates Kızartması",
        "emoji": "🍟",
        "country": "Şili"
    },
    {
        "name": "Arjantin Usulü Taze Sandviç",
        "emoji": "🥪",
        "country": "Arjantin"
    },
    {
        "name": "Haşlanmış Peru Kalamar",
        "emoji": "🦑",
        "country": "Peru"
    },
    {
        "name": "Deniz Ürünlü İtalya Börek",
        "emoji": "🥟",
        "country": "İtalya"
    },
    {
        "name": "Lüks Endonezya Patates Kızartması",
        "emoji": "🍟",
        "country": "Endonezya"
    },
    {
        "name": "Tayland Usulü Teriyaki Soslu Patates Kızartması",
        "emoji": "🍟",
        "country": "Tayland"
    },
    {
        "name": "Baharatlı Güney Kore Mantı",
        "emoji": "🥟",
        "country": "Güney Kore"
    },
    {
        "name": "Vietnam Usulü Ev Yapımı Dondurma",
        "emoji": "🍦",
        "country": "Vietnam"
    },
    {
        "name": "Sarımsaklı Arjantin Burger",
        "emoji": "🍔",
        "country": "Arjantin"
    },
    {
        "name": "Vietnam Usulü Şefin Kek",
        "emoji": "🧁",
        "country": "Vietnam"
    },
    {
        "name": "Çin Usulü Geleneksel Pilav",
        "emoji": "🍚",
        "country": "Çin"
    },
    {
        "name": "Çıtır İsviçre Çorba",
        "emoji": "🥣",
        "country": "İsviçre"
    },
    {
        "name": "Geleneksel Avusturya Kruvasan",
        "emoji": "🥐",
        "country": "Avusturya"
    },
    {
        "name": "Rusya Usulü Haşlanmış Dondurma",
        "emoji": "🍦",
        "country": "Rusya"
    },
    {
        "name": "Ateşli Malezya Makarna",
        "emoji": "🍝",
        "country": "Malezya"
    },
    {
        "name": "Kızarmış İsveç Kavurma",
        "emoji": "🥩",
        "country": "İsveç"
    },
    {
        "name": "Kremalı Malezya Pay",
        "emoji": "🥧",
        "country": "Malezya"
    },
    {
        "name": "Klasik Macaristan Burger",
        "emoji": "🍔",
        "country": "Macaristan"
    },
    {
        "name": "Fırınlanmış İsveç Kavurma",
        "emoji": "🥩",
        "country": "İsveç"
    },
    {
        "name": "Tatlı Vietnam Pizza",
        "emoji": "🍕",
        "country": "Vietnam"
    },
    {
        "name": "Yunanistan Usulü Taze Kurabiye",
        "emoji": "🍪",
        "country": "Yunanistan"
    },
    {
        "name": "Şefin Meksika Dondurma",
        "emoji": "🍦",
        "country": "Meksika"
    },
    {
        "name": "Güney Kore Usulü Ev Yapımı Kruvasan",
        "emoji": "🥐",
        "country": "Güney Kore"
    },
    {
        "name": "ABD Usulü Sokak Karides",
        "emoji": "🍤",
        "country": "ABD"
    },
    {
        "name": "Közlenmiş Küba Kurabiye",
        "emoji": "🍪",
        "country": "Küba"
    },
    {
        "name": "İrlanda Usulü Geleneksel Kek",
        "emoji": "🧁",
        "country": "İrlanda"
    },
    {
        "name": "Fırınlanmış Rusya Soslu Köri",
        "emoji": "🍛",
        "country": "Rusya"
    },
    {
        "name": "Arjantin Usulü Kremalı Kek",
        "emoji": "🧁",
        "country": "Arjantin"
    },
    {
        "name": "Meksika Usulü Soslu Biftek",
        "emoji": "🥩",
        "country": "Meksika"
    },
    {
        "name": "Haşlanmış Avustralya Taco",
        "emoji": "🌮",
        "country": "Avustralya"
    },
    {
        "name": "Lübnan Usulü Baharatlı Kavurma",
        "emoji": "🥩",
        "country": "Lübnan"
    },
    {
        "name": "Baharatlı Vietnam Kurabiye",
        "emoji": "🍪",
        "country": "Vietnam"
    },
    {
        "name": "Zeytinyağlı İsveç Mantı",
        "emoji": "🥟",
        "country": "İsveç"
    },
    {
        "name": "Özel Brezilya Balık",
        "emoji": "🐟",
        "country": "Brezilya"
    },
    {
        "name": "Sokak Polonya Biftek",
        "emoji": "🥩",
        "country": "Polonya"
    },
    {
        "name": "Hindistan Usulü Şefin Kavurma",
        "emoji": "🥩",
        "country": "Hindistan"
    },
    {
        "name": "Avusturya Usulü Klasik Salata",
        "emoji": "🥗",
        "country": "Avusturya"
    },
    {
        "name": "Ekşi Küba Pizza",
        "emoji": "🍕",
        "country": "Küba"
    },
    {
        "name": "Tayland Usulü Tuzlu Burger",
        "emoji": "🍔",
        "country": "Tayland"
    },
    {
        "name": "Portekiz Usulü Lüks Pay",
        "emoji": "🥧",
        "country": "Portekiz"
    },
    {
        "name": "İsveç Usulü Kremalı Taco",
        "emoji": "🌮",
        "country": "İsveç"
    },
    {
        "name": "Soslu Polonya Kebap",
        "emoji": "🍢",
        "country": "Polonya"
    },
    {
        "name": "Peynirli İrlanda Sushi",
        "emoji": "🍣",
        "country": "İrlanda"
    },
    {
        "name": "Türkiye Usulü Klasik Gözleme",
        "emoji": "🫓",
        "country": "Türkiye"
    },
    {
        "name": "Hindistan Usulü Kızarmış Pay",
        "emoji": "🥧",
        "country": "Hindistan"
    },
    {
        "name": "Yöresel Fas Salata",
        "emoji": "🥗",
        "country": "Fas"
    },
    {
        "name": "Izgara İrlanda Tost",
        "emoji": "🥪",
        "country": "İrlanda"
    },
    {
        "name": "Baharatlı Küba Salata",
        "emoji": "🥗",
        "country": "Küba"
    },
    {
        "name": "Fırınlanmış Güney Afrika Waffle",
        "emoji": "🧇",
        "country": "Güney Afrika"
    },
    {
        "name": "Deniz Ürünlü Endonezya Kalamar",
        "emoji": "🦑",
        "country": "Endonezya"
    },
    {
        "name": "Meksika Usulü Geleneksel Burger",
        "emoji": "🍔",
        "country": "Meksika"
    },
    {
        "name": "Almanya Usulü Lüks Sosisli",
        "emoji": "🌭",
        "country": "Almanya"
    },
    {
        "name": "Deniz Ürünlü Yeni Zelanda Karides",
        "emoji": "🍤",
        "country": "Yeni Zelanda"
    },
    {
        "name": "Endonezya Usulü Yöresel Kebap",
        "emoji": "🍢",
        "country": "Endonezya"
    },
    {
        "name": "Taze Portekiz Tatlı",
        "emoji": "🍰",
        "country": "Portekiz"
    },
    {
        "name": "Sokak Rusya Makarna",
        "emoji": "🍝",
        "country": "Rusya"
    },
    {
        "name": "Tuzlu Hindistan Burrito",
        "emoji": "🌯",
        "country": "Hindistan"
    },
    {
        "name": "İran Usulü Tatlı Çorba",
        "emoji": "🥣",
        "country": "İran"
    },
    {
        "name": "Izgara İspanya Donut",
        "emoji": "🍩",
        "country": "İspanya"
    },
    {
        "name": "Türkiye Usulü Baharatlı Kavurma",
        "emoji": "🥩",
        "country": "Türkiye"
    },
    {
        "name": "Geleneksel Küba Pay",
        "emoji": "🥧",
        "country": "Küba"
    },
    {
        "name": "Özel Avustralya Pay",
        "emoji": "🥧",
        "country": "Avustralya"
    }
];
