// SVG haritayı yükle
document.addEventListener('DOMContentLoaded', () => {
    const width = 1000;
    const height = 500;
    let isZoomed = false;
    
    const svg = d3.select('#map-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Harita için bir g elementi oluştur (transform için)
    const g = svg.append('g');
    
    const projection = d3.geoMercator()
        .scale(140)
        .translate([width / 2, height / 1.5]);
    
    const path = d3.geoPath().projection(projection);
    
    d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
        .then(data => {
            g.selectAll('path')
                .data(data.features)
                .enter()
                .append('path')
                .attr('d', path)
                .attr('class', 'country')
                .attr('id', d => d.properties.name.toLowerCase())
                .attr('data-name', d => d.properties.name.toLowerCase())
                .on('click', handleClick); // Tıklama olayını ekle

            // Debug için ülke isimlerini konsola yazdır
            console.log('Mevcut ülkeler:');
            data.features.forEach(f => {
                console.log(f.properties.name.toLowerCase());
            });
        });

    // Tıklama işleyicisi
    function handleClick(event, d) {
        event.stopPropagation();
        
        if (!isZoomed) {
            // Tıklanan konuma zoom yap
            const bounds = path.bounds(d);
            const dx = bounds[1][0] - bounds[0][0];
            const dy = bounds[1][1] - bounds[0][1];
            const x = (bounds[0][0] + bounds[1][0]) / 2;
            const y = (bounds[0][1] + bounds[1][1]) / 2;
            // Zoom seviyesini daha da azalttık (0.4 -> 0.25)
            const scale = 0.15 / Math.max(dx / width, dy / height);
            const translate = [width / 2 - scale * x, height / 2 - scale * y];

            g.transition()
                .duration(300)
                .attr('transform', `translate(${translate}) scale(${scale})`);
        } else {
            // Orijinal konuma dön
            g.transition()
                .duration(300)
                .attr('transform', 'translate(0,0) scale(1)');
        }
        
        isZoomed = !isZoomed;
    }

    // Input olayını dinle
    document.getElementById('countryInput').addEventListener('input', checkCountry);
    
    // Başlat butonuna tıklama olayını dinle
    document.getElementById('startButton').addEventListener('click', startGame);
});

let timer;
const GAME_TIME = 15 * 60; // 15 dakika (saniye cinsinden)

function startGame() {
    // Ülke listesini temizle
    document.getElementById('foundCountries').innerHTML = '';
    
    // Input'u aktif et
    const inputElement = document.getElementById('countryInput');
    inputElement.disabled = false;
    inputElement.focus();
    
    // Başlat butonunu gizle
    document.getElementById('startButton').style.display = 'none';
    
    // Zamanlayıcıyı başlat
    let timeLeft = GAME_TIME;
    updateTimerDisplay(timeLeft);
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const display = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    document.getElementById('countdown').textContent = display;
}

function endGame() {
    clearInterval(timer);
    const inputElement = document.getElementById('countryInput');
    inputElement.disabled = true;
    inputElement.value = '';
    alert('Süre doldu! Oyun bitti.');
}

// Ülke eşleştirme sözlüğünü güncelle
const countryMapping = {
    // AVRUPA ÜLKELERİ
    'albania': 'albania',
    'andorra': 'andorra',
    'austria': 'austria',
    'belarus': 'belarus',
    'belgium': 'belgium',
    'bosnia': 'bosnia and herzegovina',
    'bulgaria': 'bulgaria',
    'croatia': 'croatia',
    'czechia': 'czechia',
    'denmark': 'denmark',
    'estonia': 'estonia',
    'finland': 'finland',
    'france': 'france',
    'germany': 'germany',
    'greece': 'greece',
    'hungary': 'hungary',
    'iceland': 'iceland',
    'ireland': 'ireland',
    'italy': 'italy',
    'kosovo': 'kosovo',
    'latvia': 'latvia',
    'liechtenstein': 'liechtenstein',
    'lithuania': 'lithuania',
    'luxembourg': 'luxembourg',
    'malta': 'malta',
    'moldova': 'moldova',
    'monaco': 'monaco',
    'montenegro': 'montenegro',
    'netherlands': 'netherlands',
    'north macedonia': 'north macedonia',
    'macedonia': 'north macedonia',
    'norway': 'norway',
    'poland': 'poland',
    'portugal': 'portugal',
    'romania': 'romania',
    'russia': 'russia',
    'san marino': 'san marino',
    'serbia': 'serbia',
    'slovakia': 'slovakia',
    'slovenia': 'slovenia',
    'spain': 'spain',
    'sweden': 'sweden',
    'switzerland': 'switzerland',
    'ukraine': 'ukraine',
    'united kingdom': 'united kingdom',
    'uk': 'united kingdom',
    'england': 'united kingdom',
    'britain': 'united kingdom',
    'vatican': 'vatican city',
    'vatican city': 'vatican city',

    // KUZEY AMERİKA ÜLKELERİ
    'antigua and barbuda': 'antigua and barbuda',
    'bahamas': 'bahamas',
    'barbados': 'barbados',
    'belize': 'belize',
    'canada': 'canada',
    'costa rica': 'costa rica',
    'cuba': 'cuba',
    'dominica': 'dominica',
    'dominican republic': 'dominican republic',
    'el salvador': 'el salvador',
    'grenada': 'grenada',
    'guatemala': 'guatemala',
    'haiti': 'haiti',
    'honduras': 'honduras',
    'jamaica': 'jamaica',
    'mexico': 'mexico',
    'nicaragua': 'nicaragua',
    'panama': 'panama',
    'saint kitts and nevis': 'saint kitts and nevis',
    'saint lucia': 'saint lucia',
    'saint vincent and the grenadines': 'saint vincent and the grenadines',
    'trinidad and tobago': 'trinidad and tobago',
    'united states': 'united states',
    'usa': 'united states',
    'us': 'united states',
    'america': 'united states',

    // GÜNEY AMERİKA ÜLKELERİ
    'argentina': 'argentina',
    'bolivia': 'bolivia',
    'brazil': 'brazil',
    'chile': 'chile',
    'colombia': 'colombia',
    'ecuador': 'ecuador',
    'guyana': 'guyana',
    'paraguay': 'paraguay',
    'peru': 'peru',
    'suriname': 'suriname',
    'uruguay': 'uruguay',
    'venezuela': 'venezuela',

    // ASYA ÜLKELERİ
    'afghanistan': 'afghanistan',
    'armenia': 'armenia',
    'azerbaijan': 'azerbaijan',
    'bahrain': 'bahrain',
    'bangladesh': 'bangladesh',
    'bhutan': 'bhutan',
    'brunei': 'brunei',
    'cambodia': 'cambodia',
    'china': 'china',
    'cyprus': 'cyprus',
    'georgia': 'georgia',
    'india': 'india',
    'indonesia': 'indonesia',
    'iran': 'iran',
    'iraq': 'iraq',
    'israel': 'israel',
    'japan': 'japan',
    'jordan': 'jordan',
    'kazakhstan': 'kazakhstan',
    'kuwait': 'kuwait',
    'kyrgyzstan': 'kyrgyzstan',
    'laos': 'laos',
    'lebanon': 'lebanon',
    'malaysia': 'malaysia',
    'maldives': 'maldives',
    'mongolia': 'mongolia',
    'myanmar': 'myanmar',
    'burma': 'myanmar',
    'nepal': 'nepal',
    'north korea': 'north korea',
    'oman': 'oman',
    'pakistan': 'pakistan',
    'palestine': 'palestine',
    'philippines': 'philippines',
    'qatar': 'qatar',
    'saudi arabia': 'saudi arabia',
    'singapore': 'singapore',
    'south korea': 'south korea',
    'sri lanka': 'sri lanka',
    'syria': 'syria',
    'taiwan': 'taiwan',
    'tajikistan': 'tajikistan',
    'thailand': 'thailand',
    'timor-leste': 'east timor',
    'east timor': 'east timor',
    'turkey': 'turkey',
    'türkiye': 'turkey',
    'turkmenistan': 'turkmenistan',
    'united arab emirates': 'united arab emirates',
    'uae': 'united arab emirates',
    'uzbekistan': 'uzbekistan',
    'vietnam': 'vietnam',
    'yemen': 'yemen',

    // AFRİKA ÜLKELERİ
    'algeria': 'algeria',
    'angola': 'angola',
    'benin': 'benin',
    'botswana': 'botswana',
    'burkina faso': 'burkina faso',
    'burundi': 'burundi',
    'cameroon': 'cameroon',
    'cape verde': 'cape verde',
    'central african republic': 'central african republic',
    'chad': 'chad',
    'comoros': 'comoros',
    'congo': 'congo',
    'democratic republic of the congo': 'democratic republic of the congo',
    'djibouti': 'djibouti',
    'egypt': 'egypt',
    'equatorial guinea': 'equatorial guinea',
    'eritrea': 'eritrea',
    'eswatini': 'eswatini',
    'ethiopia': 'ethiopia',
    'gabon': 'gabon',
    'gambia': 'gambia',
    'ghana': 'ghana',
    'guinea': 'guinea',
    'guinea-bissau': 'guinea-bissau',
    'ivory coast': 'ivory coast',
    'kenya': 'kenya',
    'lesotho': 'lesotho',
    'liberia': 'liberia',
    'libya': 'libya',
    'madagascar': 'madagascar',
    'malawi': 'malawi',
    'mali': 'mali',
    'mauritania': 'mauritania',
    'mauritius': 'mauritius',
    'morocco': 'morocco',
    'mozambique': 'mozambique',
    'namibia': 'namibia',
    'niger': 'niger',
    'nigeria': 'nigeria',
    'rwanda': 'rwanda',
    'sao tome and principe': 'sao tome and principe',
    'senegal': 'senegal',
    'seychelles': 'seychelles',
    'sierra leone': 'sierra leone',
    'somalia': 'somalia',
    'south africa': 'south africa',
    'south sudan': 'south sudan',
    'sudan': 'sudan',
    'tanzania': 'tanzania',
    'togo': 'togo',
    'tunisia': 'tunisia',
    'uganda': 'uganda',
    'zambia': 'zambia',
    'zimbabwe': 'zimbabwe',

    // OKYANUSYA ÜLKELERİ
    'australia': 'australia',
    'fiji': 'fiji',
    'kiribati': 'kiribati',
    'marshall islands': 'marshall islands',
    'micronesia': 'micronesia',
    'nauru': 'nauru',
    'new zealand': 'new zealand',
    'palau': 'palau',
    'papua new guinea': 'papua new guinea',
    'samoa': 'samoa',
    'solomon islands': 'solomon islands',
    'tonga': 'tonga',
    'tuvalu': 'tuvalu',
    'vanuatu': 'vanuatu',
    'colombia': 'colombia',

    'malta': 'malta',
    'serbia': 'serbia',
    'czechia': 'czechia',
};

function checkCountry(event) {
    const input = event.target.value.toLowerCase();
    const mappedCountry = countryMapping[input];
    
    if (mappedCountry) {
        const country = document.getElementById(mappedCountry);
        if (country) {
            country.classList.add('highlighted');
            event.target.value = '';
            
            // Bulunan ülkeyi listeye ekle
            const foundCountriesDiv = document.getElementById('foundCountries');
            const countryItem = document.createElement('span');
            countryItem.className = 'country-item';
            // İlk harfi büyük yap
            const displayName = mappedCountry.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            countryItem.textContent = displayName;
            foundCountriesDiv.appendChild(countryItem);
        }
    }
}

function generatePathFromGeoJSON(geometry) {
    // GeoJSON koordinatlarını SVG path'e dönüştürme işlemi
    // Bu fonksiyon d3.js veya başka bir haritalama kütüphanesi kullanılarak 
    // daha detaylı implementte edilmelidir
} 