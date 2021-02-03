import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

import { subscribeIPC } from './native-support/message-queue'
import LoginDialog from './components/login/login'

// 整体使用 react + redux
// UI 跟 逻辑 拆分

// 启动IPC监听
subscribeIPC()

// 记载App 模板，到 index.html 的root 节点下 
ReactDOM.render(<App />, document.getElementById('root'))
// 先隐藏主界面
const root = document.getElementById('root');
if (root){
    root.style.display="none";
}
ReactDOM.render(<LoginDialog />, document.getElementById('login'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// 启动服务
serviceWorker.register()
