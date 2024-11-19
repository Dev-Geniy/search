// 1. Выбор поисковой системы
let currentSearchEngine = 'Bing'; // Default search engine set to Bing

function setSearchEngine(engine, button) {
    currentSearchEngine = engine;
    document.getElementById('searchButton').textContent = `Search on ${engine}`;
    
    const buttons = document.querySelectorAll('.dropdown button');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    if (engine === 'Bing') {
        animateBackground("https://img.freepik.com/free-photo/soft-gradient-background_23-2150525049.jpg");
        document.getElementById('pageTitle').textContent = 'SEARCH';
    } else if (engine === 'DuckDuckGo') {
        animateBackground("https://st2.depositphotos.com/33704592/48552/i/450/depositphotos_485524106-stock-photo-abstract-polygonal-space-low-poly.jpg");
        document.getElementById('pageTitle').textContent = 'DEEPWEB SEARCH';
    } else if (engine === 'Ahmia') {
        animateBackground("https://overclockers.ru/st/legacy/blog/422417/398390_O.jpg");
        document.getElementById('pageTitle').textContent = 'Darknet Search';
    }

    closeDropdown();
}

function closeDropdown() {
    document.getElementById('dropdown').style.display = 'none';
}

// Анимация изменения фона
function animateBackground(newImage) {
    document.body.style.transition = "background-image 1s ease-in-out";
    document.body.style.backgroundImage = `url(${newImage})`;
}

// Функция для анимации названия
function setPageTitle(title) {
    const pageTitleElement = document.getElementById('pageTitle');
    pageTitleElement.textContent = title;
    
    // Убираем старую анимацию и добавляем новую
    pageTitleElement.style.animation = 'none';
    setTimeout(() => {
        pageTitleElement.style.animation = 'typing 3s steps(30) 1s 1 normal both';
    }, 100); // Даем немного времени, чтобы анимация сбросилась
}

function search() {
    const query = document.getElementById('searchQuery').value;
    if (!query) return;

    let url = '';
    if (currentSearchEngine === 'Bing') {
        url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
    } else if (currentSearchEngine === 'DuckDuckGo') {
        url = `https://duckduckgo.com/?q=${encodeURIComponent(query)} site:*.onion`;
    } else if (currentSearchEngine === 'Ahmia') {
        url = `https://ahmia.fi/search/?q=${encodeURIComponent(query)}`;
    }
    window.open(url, '_blank');
}

// Открытие выпадающего меню
let holdTimer;
let searchTimer;

function openDropdown() {
    holdTimer = setTimeout(function() {
        document.getElementById('dropdown').style.display = 'block';
    }, 1000);
}

function executeSearch() {
    search();  // Выполняем поиск
}

// Обработчики событий для кнопки поиска
document.getElementById('searchButton').addEventListener('mousedown', function() {
    // Сбрасываем таймер поиска, если был предыдущий
    if (searchTimer) {
        clearTimeout(searchTimer);
    }
    // Запускаем таймер для открытия меню
    openDropdown();
});

document.getElementById('searchButton').addEventListener('mouseup', function() {
    clearTimeout(holdTimer);  // Останавливаем таймер меню
    searchTimer = setTimeout(function() {
        executeSearch();  // Если кнопка была нажата меньше чем 1 секунду, выполняем поиск
    }, 200);  // 200 мс задержки для выполнения поиска
});

document.getElementById('searchButton').addEventListener('mouseleave', function() {
    clearTimeout(holdTimer);
    clearTimeout(searchTimer);
});

document.getElementById('searchButton').addEventListener('touchstart', function(event) {
    event.preventDefault(); // Останавливаем стандартное поведение (например, выделение текста)
    if (searchTimer) {
        clearTimeout(searchTimer);
    }
    openDropdown();
});

document.getElementById('searchButton').addEventListener('touchend', function() {
    clearTimeout(holdTimer);  // Останавливаем таймер меню
    searchTimer = setTimeout(function() {
        executeSearch();  // Если кнопка была нажата менее чем 1 секунду, выполняем поиск
    }, 200);  // 200 мс задержки для выполнения поиска
});

// Закрытие меню при клике вне
window.addEventListener('click', function(event) {
    if (!event.target.matches('.search-button') && !event.target.matches('.dropdown button')) {
        closeDropdown();
    }
});

// 2. IP-адрес и скорость
function fetchIpInfo() {
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            const ip = data.ip || 'Unknown';
            const country = data.country_name || 'Unknown';
            document.getElementById('ip-info').textContent = `IP: ${ip} | Country: ${country}`;
        })
        .catch(() => {
            document.getElementById('ip-info').textContent = 'IP: Unknown | Country: Unknown';
        });
}

function fetchConnectionSpeed() {
    setInterval(() => {
        const randomSpeed = Math.floor(Math.random() * 100) + 50;
        document.getElementById('connection-speed').textContent = `Connection Speed: ${randomSpeed} Mbps`;
    }, 30000);
}

fetchIpInfo();
fetchConnectionSpeed();

// Спящий режим
// Обновление времени
function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Включение спящего режима
function enterSleepMode() {
    const sleepModeElement = document.getElementById('sleepMode');
    sleepModeElement.classList.remove('hidden');
    document.body.style.filter = 'brightness(100%)'; // Избегаем лишнего снижения яркости
    updateClock(); // Обновляем часы сразу
    startClockUpdate(); // Запускаем таймер для обновления времени
}

// Выход из спящего режима
function exitSleepMode() {
    const sleepModeElement = document.getElementById('sleepMode');
    sleepModeElement.classList.add('hidden');
    document.body.style.filter = 'none'; // Возвращаем яркость
    stopClockUpdate(); // Останавливаем обновление часов
    resetSleepTimer(); // Перезапуск таймеров
}

// Обновление времени на часах каждую секунду
let clockInterval;

function startClockUpdate() {
    clockInterval = setInterval(updateClock, 1000);
}

function stopClockUpdate() {
    clearInterval(clockInterval);
}

// Объявляем переменные таймеров
let sleepTimeout;
let brightnessTimeout;

// Перезапуск таймера на спящий режим
function resetSleepTimer() {
    clearTimeout(sleepTimeout);
    clearTimeout(brightnessTimeout);

    // Через 3 минуты — спящий режим
    sleepTimeout = setTimeout(() => {
        enterSleepMode();
        // Через 1 минуту после спящего режима — снижение яркости
        brightnessTimeout = setTimeout(() => {
            document.body.style.filter = 'brightness(50%)';
        }, 30000); // 1 минута
    }, 30000); // 3 минуты
}

// Сброс спящего режима при активности пользователя
function resetOnActivity() {
    // Если сайт уже в спящем режиме, выйти из него
    const sleepModeElement = document.getElementById('sleepMode');
    if (!sleepModeElement.classList.contains('hidden')) {
        exitSleepMode();
    }
    resetSleepTimer(); // Перезапуск таймеров
}

// Инициализация событий
function initializeSleepMode() {
    // События активности
    document.addEventListener('mousemove', resetOnActivity);
    document.addEventListener('keydown', resetOnActivity);
    document.addEventListener('click', resetOnActivity);
    document.addEventListener('touchstart', resetOnActivity); // Для мобильных устройств

    // Перезапуск таймера после загрузки страницы
    resetSleepTimer();
}

// Запуск скрипта после загрузки страницы
document.addEventListener('DOMContentLoaded', initializeSleepMode);

// Батарея
// Функция для обновления индикатора батареи
function updateBatteryIndicator(battery) {
    const batteryLevel = document.getElementById('battery-level');
    const level = battery.level * 100; // Получаем уровень заряда в процентах
    batteryLevel.style.width = level + '%';

    // Если уровень заряда ниже 20%, показываем предупреждение
    if (level < 20) {
        batteryLevel.style.backgroundColor = 'red'; // Красный цвет для низкого заряда
    } else {
        batteryLevel.style.backgroundColor = 'green'; // Зеленый цвет для нормального заряда
    }
}

// Получаем информацию о батарее устройства
navigator.getBattery().then(function(battery) {
    updateBatteryIndicator(battery);

    // Обновляем индикатор, когда уровень заряда изменяется
    battery.addEventListener('levelchange', function() {
        updateBatteryIndicator(battery);
    });
});
