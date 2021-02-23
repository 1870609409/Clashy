import { combineReducers } from 'redux'
import { app, AppState } from './app-reducer'
import { configs, ConfigsState } from './general-reducers'
import { proxies, ProxiesState } from './proxies-reducer'
import { profiles, ProfilesState } from './profiles-reducers'
import { account, AccountState } from './server-reducer'

export interface RootState {
    app: AppState,
    configs: ConfigsState,
    proxies: ProxiesState,
    profiles: ProfilesState
    account: AccountState
}

const rootReducer = combineReducers({
    app,
    configs: configs,
    proxies,
    profiles,
    account
})

export default rootReducer
