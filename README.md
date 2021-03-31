# Welcome to @ifake/easy-polling 👋
![Version](https://img.shields.io/npm/v/@ifake/easy-polling)
![Npm Bundle Size](https://img.shields.io/bundlephobia/min/@ifake/easy-polling)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

> The Class used to compute the next step of data.

The scaffolding for this project is from [pkg](https://github.com/ifakejs/pkg)

### 🏠 [Homepage](https://github.com/ifakejs/easy-polling)

### Usage
```sh
import { EasyPolling } from "@ifake/easy-polling";

const instance = new EasyPolling({
  source: [param1, param2, param3...],
  intervalTime: 2000 // 毫秒
  type: 'single' || 'double'
  returnCount: 2 // 每次返回的数据大小
})
instance.observe((data) => {
  // 根据间隔时长，返回对应的内容
})
instance.start()
// stop
instance.stop()

// update intervalTime
instance.updateIntervalTime(5000)
```

## Author

👤 **BiYuqi**
## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/ifakejs/easy-polling/issues). 

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

This project is [MIT](https://github.com/ifakejs/easy-loop/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
