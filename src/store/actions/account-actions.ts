import { Proxies } from '../../apis'

export enum AccountAction {
    login = 'ACCOUNT_LOGIN',
    register = 'ACCOUNT_REGISTER'
}

export interface TAccountAction {
    type: AccountAction
    error?: any
    email?: string
    password?: string
    inviteCode?: string
}

export interface TProxyDelay {
    delay: number
}

export function login(email: string, password: string): TAccountAction {
    return {
        type: AccountAction.login,
        email,
        password
    }
}
