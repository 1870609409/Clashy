import { take, put, call } from 'redux-saga/effects'
import { TGeneralAction, gotConfigs, gotErrorGeneral, GeneralActions, toggleSaving, gotClashy } from '../actions'
import { requestClashConfigs, requestSaveClashConfigs } from '../../apis'
import { callIPC } from '../../native-support/message-queue'
import { BRG_MSG_GET_CLASHY_CONFIG, BRG_MSG_SET_PORT } from '../../native-support/message-constants'

export function *watchFetchConfigs() {
    while (true) {
        yield take(GeneralActions.fetchConfigs)
        try {
            const result = yield call(requestClashConfigs)
            yield put(gotConfigs(result))
            const clashy = yield call(callIPC, BRG_MSG_GET_CLASHY_CONFIG)
            yield put(gotClashy(clashy))
        } catch (e) {
            yield put(gotErrorGeneral(e))
        }

    }
}

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
