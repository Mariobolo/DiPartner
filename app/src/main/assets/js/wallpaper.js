/**
 * 壁纸管理模块 - 简化版本
 * 支持三种模式：本地壁纸 / 在线壁纸 / 3D壁纸
 */

const WallpaperManager = {
    currentMode: 'local',
    localWallpaperPath: 'dipartner/wallpaper',
    switchInterval: 15000,
    isCarouselEnabled: false,
    carouselTimer: null,
    
    backgroundElement: null,
    containerElement: null,
    
    /**
     * 初始化
     */
    init() {
        this.backgroundElement = document.querySelector('.background-image');
        this.containerElement = document.querySelector('.background-container');
        
        if (!this.backgroundElement) {
            console.warn('壁纸元素未找到');
            return;
        }
        
        this.loadSettings();
        this.bindEvents();
        this.startWallpaper();
        
        console.log('壁纸管理器已初始化，当前模式:', this.currentMode);
    },
    
    /**
     * 加载设置
     */
    loadSettings() {
        if (typeof Android !== 'undefined' && Android.getWallpaperSettingsAsync) {
            const callbackId = AsyncCallbackManager.register((settingsJson) => {
                try {
                    const settings = JSON.parse(settingsJson);
                    this.applySettings(settings);
                } catch (e) {
                    console.error('加载壁纸设置失败:', e);
                }
            });
            Android.getWallpaperSettingsAsync(callbackId);
        }
    },
    
    /**
     * 应用设置
     */
    applySettings(settings) {
        this.isCarouselEnabled = settings.wallpaper_carousel || false;
        this.currentMode = settings.wallpaper_mode || 'local';
        this.localWallpaperPath = settings.local_wallpaper_path || 'dipartner/wallpaper';
        this.switchInterval = settings.switch_interval || 15000;
        
        // 更新UI
        const modeRadios = document.querySelectorAll('input[name="wallpaperMode"]');
        modeRadios.forEach(radio => {
            radio.checked = radio.value === this.currentMode;
        });
        
        const pathInput = document.getElementById('localWallpaperPath');
        if (pathInput) pathInput.value = this.localWallpaperPath;
        
        const intervalInput = document.getElementById('switchIntervalInput');
        if (intervalInput) intervalInput.value = this.switchInterval / 1000;
        
        const carouselCheckbox = document.getElementById('wallpaperCarouselCheckbox');
        if (carouselCheckbox) carouselCheckbox.checked = this.isCarouselEnabled;
        
        this.startWallpaper();
    },
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 壁纸模式切换
        const modeRadios = document.querySelectorAll('input[name="wallpaperMode"]');
        modeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.setMode(e.target.value);
            });
        });
        
        // 本地目录输入
        const pathInput = document.getElementById('localWallpaperPath');
        if (pathInput) {
            pathInput.addEventListener('change', (e) => {
                this.localWallpaperPath = e.target.value;
                this.saveSettings();
            });
        }
        
        // 浏览按钮
        const browseBtn = document.getElementById('browseWallpaperDir');
        if (browseBtn) {
            browseBtn.addEventListener('click', () => {
                this.browseDirectory();
            });
        }
        
        // 轮播间隔
        const intervalInput = document.getElementById('switchIntervalInput');
        if (intervalInput) {
            intervalInput.addEventListener('change', (e) => {
                this.switchInterval = parseInt(e.target.value) * 1000;
                this.saveSettings();
                this.restartCarousel();
            });
        }
        
        // 轮播开关
        const carouselCheckbox = document.getElementById('wallpaperCarouselCheckbox');
        if (carouselCheckbox) {
            carouselCheckbox.addEventListener('change', (e) => {
                this.isCarouselEnabled = e.target.checked;
                this.saveSettings();
                this.toggleCarousel(e.target.checked);
            });
        }
        
        // 控制按钮
        const prevBtn = document.getElementById('prevWallpaperBtn');
        const nextBtn = document.getElementById('nextWallpaperBtn');
        const refreshBtn = document.getElementById('refreshWallpaperBtn');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousWallpaper());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextWallpaper());
        if (refreshBtn) refreshBtn.addEventListener('click', () => this.refreshWallpaper());
        
        // 双击切换壁纸（仅在非3D模式下）
        if (this.containerElement) {
            let lastTap = 0;
            this.containerElement.addEventListener('click', (e) => {
                const now = Date.now();
                if (now - lastTap < 300) {
                    // 双击
                    e.preventDefault();
                    if (this.currentMode !== '3d') {
                        this.nextWallpaper();
                    }
                }
                lastTap = now;
            });
        }
    },
    
    /**
     * 设置壁纸模式
     */
    setMode(mode) {
        this.currentMode = mode;
        this.saveSettings();
        this.stopCarousel();
        this.startWallpaper();
    },
    
    /**
     * 开始壁纸
     */
    startWallpaper() {
        switch (this.currentMode) {
            case '3d':
                this.load3dWallpaper();
                break;
            case 'online':
                this.loadOnlineWallpaper();
                break;
            case 'local':
            default:
                this.loadLocalWallpaper();
                break;
        }
        
        if (this.isCarouselEnabled && this.currentMode !== '3d') {
            this.startCarousel();
        }
    },
    
    /**
     * 加载3D壁纸
     */
    load3dWallpaper() {
        if (typeof Android !== 'undefined' && Android.load3dWallpaper) {
            Android.load3dWallpaper();
        } else {
            // 前端模拟：加载3D壁纸页面到iframe
            this.backgroundElement.style.display = 'none';
            let iframe = document.getElementById('wallpaper-3d-iframe');
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.id = 'wallpaper-3d-iframe';
                iframe.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: none;
                    z-index: -1;
                `;
                document.body.appendChild(iframe);
            }
            iframe.src = 'leapmotor3d/index.html';
            iframe.style.display = 'block';
        }
    },
    
    /**
     * 加载在线壁纸
     */
    loadOnlineWallpaper() {
        // 隐藏3D iframe
        this.hide3dWallpaper();
        this.backgroundElement.style.display = 'block';
        
        if (typeof Android !== 'undefined' && Android.getRandomOnlineWallpaper) {
            const wallpaperUrl = Android.getRandomOnlineWallpaper();
            if (wallpaperUrl && wallpaperUrl !== '') {
                this.setBackgroundImage(`url('${wallpaperUrl}')`);
            } else {
                this.setDefaultWallpaper();
            }
        } else {
            this.setDefaultWallpaper();
        }
    },
    
    /**
     * 加载本地壁纸
     */
    loadLocalWallpaper() {
        this.hide3dWallpaper();
        this.backgroundElement.style.display = 'block';
        
        if (typeof Android !== 'undefined' && Android.getRandomLocalWallpaper) {
            const wallpaperUrl = Android.getRandomLocalWallpaper(this.localWallpaperPath);
            if (wallpaperUrl && wallpaperUrl !== '') {
                this.setBackgroundImage(`url('${wallpaperUrl}')`);
            } else {
                this.setDefaultWallpaper();
            }
        } else {
            this.setDefaultWallpaper();
        }
    },
    
    /**
     * 隐藏3D壁纸
     */
    hide3dWallpaper() {
        const iframe = document.getElementById('wallpaper-3d-iframe');
        if (iframe) {
            iframe.style.display = 'none';
        }
        this.backgroundElement.style.display = 'block';
    },
    
    /**
     * 设置背景图片
     */
    setBackgroundImage(imageUrl) {
        this.backgroundElement.style.transition = 'opacity 0.4s ease-in-out';
        this.backgroundElement.style.opacity = '0';
        
        setTimeout(() => {
            this.backgroundElement.style.backgroundImage = imageUrl;
            this.backgroundElement.style.opacity = '1';
        }, 200);
    },
    
    /**
     * 设置默认壁纸
     */
    setDefaultWallpaper() {
        this.backgroundElement.style.backgroundImage = "url('images/default_bg_1.jpg')";
        this.backgroundElement.style.opacity = '1';
    },
    
    /**
     * 下一张壁纸
     */
    nextWallpaper() {
        if (this.currentMode === '3d') return;
        
        switch (this.currentMode) {
            case 'online':
                this.loadOnlineWallpaper();
                break;
            case 'local':
            default:
                this.loadLocalWallpaper();
                break;
        }
        
        if (typeof showToast === 'function') {
            showToast('已切换壁纸');
        }
    },
    
    /**
     * 上一张壁纸（简化为重新加载）
     */
    previousWallpaper() {
        this.nextWallpaper();
    },
    
    /**
     * 刷新壁纸
     */
    refreshWallpaper() {
        this.startWallpaper();
        if (typeof showToast === 'function') {
            showToast('壁纸已刷新');
        }
    },
    
    /**
     * 开始轮播
     */
    startCarousel() {
        if (this.currentMode === '3d') return;
        
        this.stopCarousel();
        this.carouselTimer = setInterval(() => {
            this.nextWallpaper();
        }, this.switchInterval);
    },
    
    /**
     * 停止轮播
     */
    stopCarousel() {
        if (this.carouselTimer) {
            clearInterval(this.carouselTimer);
            this.carouselTimer = null;
        }
    },
    
    /**
     * 切换轮播
     */
    toggleCarousel(enabled) {
        if (enabled) {
            this.startCarousel();
            if (typeof showToast === 'function') {
                showToast('壁纸轮播已开启');
            }
        } else {
            this.stopCarousel();
            if (typeof showToast === 'function') {
                showToast('壁纸轮播已关闭');
            }
        }
    },
    
    /**
     * 重启轮播
     */
    restartCarousel() {
        if (this.isCarouselEnabled) {
            this.stopCarousel();
            this.startCarousel();
        }
    },
    
    /**
     * 浏览目录
     */
    browseDirectory() {
        if (typeof Android !== 'undefined' && Android.browseDirectory) {
            const callbackId = AsyncCallbackManager.register((path) => {
                if (path && path !== '') {
                    this.localWallpaperPath = path;
                    const pathInput = document.getElementById('localWallpaperPath');
                    if (pathInput) pathInput.value = path;
                    this.saveSettings();
                    this.loadLocalWallpaper();
                    if (typeof showToast === 'function') {
                        showToast('目录已更新');
                    }
                }
            });
            Android.browseDirectory(callbackId);
        }
    },
    
    /**
     * 保存设置
     */
    saveSettings() {
        if (typeof Android !== 'undefined' && Android.saveWallpaperSettingsAsync) {
            const settings = {
                wallpaper_carousel: this.isCarouselEnabled,
                wallpaper_mode: this.currentMode,
                local_wallpaper_path: this.localWallpaperPath,
                switch_interval: this.switchInterval
            };
            const callbackId = AsyncCallbackManager.register((success) => {
                if (success === 'true' && typeof showToast === 'function') {
                    showToast('设置已保存');
                }
            });
            Android.saveWallpaperSettingsAsync(JSON.stringify(settings), callbackId);
        }
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    WallpaperManager.init();
});

// 导出
window.WallpaperManager = WallpaperManager;
