import { Record, Map } from 'immutable'
import { AccountAction, TAccountAction } from '../actions'

// 跟服务器交互的内容全都放在这里
interface _AccountState {
    error?: any
    email?: string
    password?: string
    inviteCode?: string
    loginSuccess?: boolean 
}

export type AccountState = Record<_AccountState>

const initialStateFactory = Record<_AccountState>({
    error: null,
    email: '',
    password: '',
    inviteCode: '',
    loginSuccess: false 
})

const initialState = initialStateFactory()

export function account(state: AccountState = initialState, action: TAccountAction): AccountState {
    if (action == null || action.type == null) {
        return state
    }
    switch (action.type) {
        case AccountAction.login:
            return state.set('loginSuccess', action.loginSuccess)
        case AccountAction.register:
            return state.set('loginSuccess', action.loginSuccess)
        case AccountAction.gotError:
            return state.set('error', action.error)
        default:
            break
    }
    return state
}
