# 欢迎使用 @ifake/easy-polling 👋
![Version](https://img.shields.io/npm/v/@ifake/easy-polling)
![Npm Bundle Size](https://img.shields.io/bundlephobia/min/@ifake/easy-polling)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

> 针对视频多屏播放需求: 轮询策略，包括单路依次轮询和多路同时轮询..

本项目的脚手架来自 [pkg](https://github.com/ifakejs/pkg)

### 🏠 [Homepage](https://github.com/ifakejs/easy-polling)

### 安装

```sh
npm install @ifake/easy-polling

# or
yarn add @ifake/easy-polling
```

### 使用
- 浏览器端

```js
// 我们提供了一个全局变量 `EasyPolling` 以便使用CDN时直接在浏览器端使用.
const EasyPolling = window.EasyPolling
```

- ES6 Module

```js
import { EasyPolling } from "@ifake/easy-polling"
```

### DEMO

```js
import { EasyPolling } from "@ifake/easy-polling"

const instance = new EasyPolling({
  source: [param1, param2, param3...],
  intervalTime: 2000
  type: 'single' || 'double'
  returnCount: 2
})
instance.observe((data) => {
})
instance.start()
// stop
instance.stop()

// update intervalTime
instance.updateIntervalTime(5000)
```

### 本地运行

```sh
git clone https://github.com/ifakejs/easy-polling.git

cd easy-polling

yarn

yarn start

// 新打开命令行
yarn start:demo
```

### API

#### EasyPolling [Class]

- 参数
```ts
type runType = "single" | "double"

interface EasyPollingOptions {
  type: runType // polling type
  source: any[] // Data source
  intervalTime: number // ms
  returnCount: number // Data returned in one cycle
}
```

#### 方法
方法 | 类型 | 描述 | 返回值
----- | ----- | ----- | -----
start | Function | 开始轮询 | -
stop | Function | 结束轮询g | -
observe | Function | 订阅轮询数据 | data[]
updateIntervalTime | Function | 更新轮询周期 | -

## 注意事项
请在`observe`之后调用`start`方法，因为在调用轮询策略时内部我们有初始数据的逻辑
否则，将丢失初始回调数据。

`e.g`
```sh
# 正确用法
instance.observe(() => {})
instance.start()
```

### 作者

👤 **BiYuqi**
### 🤝 贡献

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/ifakejs/easy-polling/issues). 

### Show your support

Give a ⭐️ if this project helped you!

## 📝 License

This project is [MIT](https://github.com/ifakejs/easy-loop/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
