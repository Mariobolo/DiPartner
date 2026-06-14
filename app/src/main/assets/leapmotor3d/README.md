# 零跑C16 3D试车项目

## 项目说明

这是一个基于 Babylon.js 的零跑C16 3D交互展示网页。

## ⚠️ 重要提示

**本项目必须通过HTTP服务器运行**，不能直接双击打开index.html。

**原因**：网页需要加载3D模型、HDR环境贴图、纹理等资源，浏览器安全策略禁止通过`file://`协议加载这些外部资源。

## 运行方法

### ✅ 方法一：一键启动（推荐）

**双击运行 `一键启动.bat`**

然后在浏览器中访问：`http://localhost:8000`

### ✅ 方法二：手动启动服务器

```bash
python server.py
```

然后在浏览器中访问：`http://localhost:8000`

---

## 交互API接口

在浏览器控制台（F12）中可以使用以下API：

### 长按交互

```javascript
// 触发长按交互（默认3000毫秒）
simulateLongPress()

// 自定义持续时间（毫秒）
simulateLongPress(5000)    // 5000毫秒
simulateLongPress(10000)   // 10000毫秒
```

**特性**：
- 可重复执行
- 每次执行会重置剩余时间
- 默认3000毫秒

---

### 滑动交互

```javascript
// 基本用法（默认向左，1000毫秒）
simulateSwipe()

// 指定方向
simulateSwipe('left')      // 向左旋转
simulateSwipe('right')     // 向右旋转
simulateSwipe('up')        // 向上旋转
simulateSwipe('down')      // 向下旋转

// 指定方向和时间
simulateSwipe('left', 2000)   // 向左，2000毫秒
simulateSwipe('right', 1500)  // 向右，1500毫秒
```

**特性**：
- 每次旋转角度固定（默认水平45°，垂直22.5°）
- 可连续多次调用，角度累积
- 不会出现角度异常增大的问题

---

### 组合交互

```javascript
// 执行组合交互（长按→左滑→右滑→长按）
simulateInteraction()
```

---

### 自动触发

```javascript
// 自动循环触发交互（默认15000毫秒间隔）
autoTriggerInteraction()

// 自定义间隔时间
autoTriggerInteraction(10000)  // 每10秒触发一次
autoTriggerInteraction(30000)  // 每30秒触发一次

// 停止自动触发
stopAutoTrigger()
```

---

### 相机控制

```javascript
// 重置相机到初始位置
resetCamera()

// 获取当前相机角度
const angles = getCurrentCameraAngles()
console.log('当前theta:', angles.theta)
console.log('当前phi:', angles.phi)
console.log('目标theta:', angles.targetTheta)
console.log('目标phi:', angles.targetPhi)

// 设置旋转角度增量
setDeltaTheta(Math.PI / 6)  // 设置水平旋转角度为30°
setDeltaTheta(Math.PI / 2)  // 设置水平旋转角度为90°
setDeltaPhi(Math.PI / 6)    // 设置垂直旋转角度为30°
```

---

### 状态控制

```javascript
// 获取当前状态
interactionController.getCurrentState()

// 设置状态
interactionController.setState(2)

// 获取车身颜色索引
interactionController.getColorBodyIndex()

// 设置车身颜色
interactionController.setColorBodyIndex(0)

// 获取内饰颜色索引
interactionController.getColorInteriorIndex()

// 设置内饰颜色
interactionController.setColorInteriorIndex(1)
```

---

### 测试功能

```javascript
// 运行旋转角度测试
testSwipeAngle()
```

测试用例包括：
- 单次向左
- 连续两次向左
- 连续四次向左
- 连续两次向右
- 混合方向

---

## API接口汇总表

| 函数 | 参数 | 默认值 | 说明 |
|------|------|--------|------|
| `simulateLongPress(duration)` | duration: 毫秒数 | 3000 | 触发长按交互 |
| `simulateSwipe(direction, duration)` | direction: 方向, duration: 毫秒数 | 'left', 1000 | 触发滑动交互 |
| `simulateInteraction()` | 无 | - | 组合交互 |
| `autoTriggerInteraction(interval)` | interval: 间隔毫秒数 | 15000 | 自动循环触发 |
| `stopAutoTrigger()` | 无 | - | 停止自动触发 |
| `resetCamera()` | 无 | - | 重置相机位置 |
| `getCurrentCameraAngles()` | 无 | - | 获取相机角度 |
| `setDeltaTheta(delta)` | delta: 弧度值 | π/4 | 设置水平旋转角度 |
| `setDeltaPhi(delta)` | delta: 弧度值 | π/8 | 设置垂直旋转角度 |
| `testSwipeAngle()` | 无 | - | 运行角度测试 |

---

## 角度换算参考

| 角度 | 弧度值 |
|------|--------|
| 15° | Math.PI / 12 |
| 30° | Math.PI / 6 |
| 45° | Math.PI / 4 |
| 60° | Math.PI / 3 |
| 90° | Math.PI / 2 |
| 180° | Math.PI |

---

## 项目结构

```
leapmotorC16/
├── 一键启动.bat            # 一键启动服务器
├── index.html              # 主页面（需要服务器运行）
├── server.py               # 自定义HTTP服务器
├── README.md               # 使用说明
├── assets/                  # 核心库
│   └── vendor.js           # Babylon.js核心依赖
├── css/                     # 样式文件
│   └── style.css
├── js/                      # JavaScript文件
│   ├── main.js             # 主程序逻辑
│   └── interaction.js      # 交互控制脚本
├── draco/                   # 3D模型解码器
│   ├── draco_decoder.wasm
│   └── draco_wasm_wrapper.js
└── res/                     # 资源文件
    └── release/            # 3D模型、纹理、HDR环境贴图
```

---

## 浏览器缓存问题

如果浏览器控制台仍然显示错误，请尝试：

1. **硬刷新页面**：按 `Ctrl + Shift + R`（Windows/Linux）或 `Cmd + Shift + R`（Mac）
2. **清除浏览器缓存**：按 `Ctrl + Shift + Delete`
3. **使用隐私/无痕模式**：
   - Chrome：按 `Ctrl + Shift + N`
   - Firefox：按 `Ctrl + Shift + P`
4. **禁用浏览器缓存**：打开开发者工具（F12）→ Network（网络）→ 勾选 "Disable cache"（禁用缓存）

---

## 已知问题

1. **@vite/client 404 错误**：这是浏览器的 Vite 开发工具请求，不影响功能，可以忽略。

2. **首次加载可能较慢**：因为需要加载大量3D模型和纹理。

3. **浏览器控制台警告**：如果看到 `net::ERR_ABORTED`，可能是浏览器缓存问题，尝试硬刷新或清除缓存。

---

## 许可证

本项目仅供学习交流使用。