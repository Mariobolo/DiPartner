// 零跑C11车机天气脚本 - 修复版
// 适配DiPartner桌面 + Android 9 WebView
const WEATHER_API_BASE = 'https://api.open-meteo.com/v1/forecast';
const REQUEST_TIMEOUT = 15000; // 车机网络较慢，延长超时到15秒
const UPDATE_INTERVAL = 3600000; // 每小时更新一次天气

// 全局变量
let lastUpdateTime = 0;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('脚本初始化完成');
    updateWeatherInfo();
    
    // 定时更新
    setInterval(updateWeatherInfo, UPDATE_INTERVAL);
});

// 更新天气信息（默认使用北京坐标，可修改为你所在城市）
function updateWeatherInfo() {
    const now = Date.now();
    // 防止频繁请求
    if (now - lastUpdateTime < 300000) {
        console.log('距离上次更新不足5分钟，跳过');
        return;
    }
    
    lastUpdateTime = now;
    console.log('开始更新天气');
    
    // 替换为你所在城市的经纬度
    // 商丘：34.44, 115.65
    // 北京：39.9042, 116.4074
    fetchWeatherData('34.44', '115.65');
}

// 获取天气数据
function fetchWeatherData(lat, lon) {
    const url = `${WEATHER_API_BASE}?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
    console.log('请求地址:', url);

    // 车机WebView可能不支持fetch，优先用XHR
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.timeout = REQUEST_TIMEOUT;

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const data = JSON.parse(xhr.responseText);
                console.log('获取数据成功:', data);
                updateWeatherDisplay(data);
            } catch (e) {
                console.error('JSON解析失败:', e);
                showDefaultWeather();
            }
        } else {
            console.error('请求失败，状态码:', xhr.status);
            showDefaultWeather();
        }
    };

    xhr.ontimeout = function () {
        console.error('请求超时');
        showDefaultWeather();
    };

    xhr.onerror = function () {
        console.error('网络错误');
        showDefaultWeather();
    };

    xhr.send();
}

// 更新天气显示
function updateWeatherDisplay(weatherData) {
    // 检查DOM元素是否存在（最常见的问题）
    const temperatureEl = document.querySelector('.temperature');
    const conditionEl = document.querySelector('.condition');
    const iconEl = document.querySelector('.weather-icon');

    if (!temperatureEl && !conditionEl && !iconEl) {
        console.error('错误：页面上没有找到天气显示元素');
        console.error('请检查HTML中是否有class为temperature、condition、weather-icon的元素');
        return;
    }

    if (!weatherData || !weatherData.current_weather) {
        console.warn('无效的天气数据，使用默认值');
        showDefaultWeather();
        return;
    }

    const { temperature, weathercode, is_day } = weatherData.current_weather;
    
    // 更新温度
    if (temperatureEl) {
        temperatureEl.textContent = `${Math.round(temperature)}°`;
        console.log('更新温度:', Math.round(temperature) + '°C');
    }

    // 更新天气描述
    if (conditionEl) {
        const desc = getWeatherDescription(weathercode);
        conditionEl.textContent = desc;
        console.log('更新天气:', desc);
    }

    // 更新天气图标
    if (iconEl) {
        const iconName = getWeatherIcon(weathercode, is_day);
        const iconPath = `images/${iconName}`;
        iconEl.style.backgroundImage = `url('${iconPath}')`;
        console.log('更新图标:', iconPath);
        
        // 检测图标是否存在
        const img = new Image();
        img.onerror = function() {
            console.error('图标文件不存在:', iconPath);
            // 图标不存在时使用默认图标
            iconEl.style.backgroundImage = "url('images/nav_weather.png')";
        };
        img.src = iconPath;
    }
}

// 显示默认天气
function showDefaultWeather() {
    const temperatureEl = document.querySelector('.temperature');
    const conditionEl = document.querySelector('.condition');
    const iconEl = document.querySelector('.weather-icon');

    if (temperatureEl) temperatureEl.textContent = '25°';
    if (conditionEl) conditionEl.textContent = '晴转多云';
    if (iconEl) iconEl.style.backgroundImage = "url('images/nav_weather.png')";
}

// 天气代码转描述（匹配open-meteo官方WMO标准）
function getWeatherDescription(weatherCode) {
    const descMap = {
        0: '晴天',
        1: '少云',
        2: '多云',
        3: '阴天',
        45: '雾',
        48: '霜雾',
        51: '小雨',
        53: '中雨',
        55: '大雨',
        56: '冻雨',
        57: '冻雨',
        61: '小雨',
        63: '中雨',
        65: '大雨',
        66: '冻雨',
        67: '冻雨',
        71: '小雪',
        73: '中雪',
        75: '大雪',
        77: '雪粒',
        80: '阵雨',
        81: '中雨',
        82: '暴雨',
        85: '阵雪',
        86: '暴雪',
        95: '雷雨',
        96: '雷雨伴冰雹',
        99: '雷雨伴冰雹'
    };
    return descMap[weatherCode] || '未知';
}

// 抽离为独立配置（可放在单独的config.js）
const WEATHER_ICON_CONFIG = {
    sunny: { codes: [0], dayIcon: 'nav_weather_sunny.png', nightIcon: 'nav_weather.png' },
    cloudy: { codes: [1,2,3], icon: 'nav_weather_cloudy.png' },
    foggy: { codes: [45,48], icon: 'nav_weather_foggy.png' },
    rainy: { codes: [51,53,55,56,57,61,63,65,66,67,80,81,82], icon: 'nav_weather_rainy.png' },
    snowy: { codes: [71,73,75,77,85,86], icon: 'nav_weather_snowy.png' },
    thunderstorm: { codes: [95,96,99], icon: 'nav_weather_thunderstorm.png' }
};

// 简化后的图标获取逻辑
function getWeatherIcon(weatherCode, isDay) {
    const isNight = isDay === 0;
    // 匹配配置
    for (const type in WEATHER_ICON_CONFIG) {
        const config = WEATHER_ICON_CONFIG[type];
        if (config.codes.includes(weatherCode)) {
            // 区分日夜的逻辑只针对晴天
            return config.dayIcon 
                ? (isNight ? config.nightIcon : config.dayIcon) 
                : config.icon;
        }
    }
    return 'nav_weather.png';
}