
// 所有跟后台交互的动作全都放在一起
export enum AccountAction {
    gotError = 'ACCOUNT_ERROR',
    login = 'ACCOUNT_LOGIN',
    register = 'ACCOUNT_REGISTER'
}

export interface TAccountAction {
    type: AccountAction
    email?: string
    password?: string
    inviteCode?: string
    loginSuccess?: boolean 
    error?: any
}

export function login(email: string, password: string): TAccountAction {
    return {
        type: AccountAction.login,
        email,
        password
    }
}

export function loginResult(loginSuccess: boolean): TAccountAction {
    return {
        type: AccountAction.login,
        loginSuccess 
    }
}

export function gotErrorAccount(error: any): TAccountAction {
    return {
        type: AccountAction.gotError,
        error
    }
}
