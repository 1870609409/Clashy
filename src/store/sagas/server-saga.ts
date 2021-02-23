import { take, put, call } from 'redux-saga/effects'
import { AccountAction, TAccountAction, loginResult, gotErrorAccount } from '../actions'
import { requestLogin } from '../../apis'
import { callIPC } from '../../native-support/message-queue'
import { BRG_MSG_GET_CLASHY_CONFIG, BRG_MSG_SET_PORT } from '../../native-support/message-constants'

// PC 上边的登录，因为是浏览器，会自动存储cookie; 所以登录一次之后。 在登陆，会携带cookie过去，会返回主界面的html 代码了
// 监听来自 login.tsx 界面点击登录的事件
export function *watchLogin() {
    while (true) {
        // 阻塞等待登录事件，以及携带数据
        const action: TAccountAction = yield take(AccountAction.login)
        try {
            console.log("捕获到 登录 事件");
            // 发起http请求
            const resultMsg = yield call(requestLogin, action.email, action.password)

            // 在这里解析结果，还是放到界面上解析？？？
            console.log("请求结果:", resultMsg);
            const jsonMsg = JSON.parse(resultMsg);
            console.log("code:", jsonMsg.ret);
            console.log("msg:", jsonMsg.msg);

            /////////////// 1还是0 是登录成功？？、
            if (jsonMsg.ret == 0) {
                // 登录成功
                // 抛出结果 loginResult 到 server-reducer.ts ， 修改变量内容，从而触发绑定的 login.tsx ，从而显示界面内容
                yield put(loginResult(resultMsg))
            } else {
                // 登录失败
                throw new Error(jsonMsg.msg)
            }
        } catch (e) {
            // yield put(gotErrorAccount(e))
            yield put(gotErrorAccount("aaaa"))
        }

    }
}
/*
export function *watchSaveConfigs() {
    while (true) {
        // take 阻塞等待 GeneralActions.saveConfigs  保存clash订阅;
        const action: TGeneralAction = yield take(GeneralActions.saveConfigs)
        // 触发之后，开始进行 clash订阅 的流程
        try {
            // put 推送消息数据给 reducers ,来改变界面状态
            // 正在保存中，loading 
            yield put(toggleSaving(true))
            // call(函数名，参数)
            yield call(requestSaveClashConfigs, action.configs)
            if (action.configs) {
                const httpPort = action.configs.port
                const socksPort = action.configs["socks-port"]
                if (httpPort || socksPort) {
                    // 发送 IPC 消息，给主进程，来进行操作
                    yield call(callIPC, BRG_MSG_SET_PORT, { httpPort, socksPort })
                }
            }
            yield put({ type: GeneralActions.fetchConfigs })
            // 推送loading 结束
            yield put(toggleSaving(false))
        } catch (e) {
            yield put(toggleSaving(false))
            yield put(gotErrorGeneral(e))
        }
    }
}
*/

