import { Indexed } from '../utils'

const BASE_URL = 'http://localhost:2390'

const getHeader = () => {
    return {
        'Content-Type': 'application/json; charset=utf-8'
    }
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH'

interface RequestParam {
    method: Method,
    headers: Headers,
    mode: 'cors' | 'same-origin',
    body?: string
}

// 跟机场后台交互，body 使用&拼接的表单格式，不使用json格式
export async function myRequest(url: string, method: Method = 'GET',body?: string, header?: Indexed, cors = true) {
    //////////// 这里直接制定了 header！！！！
    header = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    const mergedHeaders = Object.assign(getHeader(), header)
    const params: RequestParam = {
        method: method,
        headers: new Headers(mergedHeaders),
        mode: cors ? 'cors' : 'same-origin'
    }
    console.log(`HTTP-> method:${method}`);
    console.log(`url:${url}`);
    console.log(`header:${header}`);
    console.log(`body:${body}`);
    if (body !== undefined) {
        // params.body = `email=1&passwd=2&code=&remember_me=on`; 
        params.body = body; 
    }

    return new Promise((resolve, reject) => {
        fetch(url, {
            ...params
        }).then(resp => {
            return resp.text()
        }).then(text => {
            // 登录一次之后就被缓存起来了，之后再发登录消息，直接就跳转到个人信息界面了
            console.log(`返回text:${text}`);
            if (text == null || text.length === 0) {
                resolve(null)
            } else {
                // 返回完整数据，由上层去做解析
                resolve(text)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

export async function request(url: string, method: Method = 'GET', header?: Indexed, body?: Indexed, cors = true) {
    const mergedHeaders = Object.assign(getHeader(), header)
    const params: RequestParam = {
        method: method,
        headers: new Headers(mergedHeaders),
        mode: cors ? 'cors' : 'same-origin'
    }
    if (body !== undefined) {
        params.body = JSON.stringify(body)
    }
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + url, {
            ...params
        }).then(resp => {
            return resp.text()
        }).then(text => {
            if (text == null || text.length === 0) {
                resolve(null)
            } else {
                resolve(JSON.parse(text))
            }
        }).catch(err => {
            reject(err)
        })
    })
}

export type ChunkCallback = (chunk: string) => void

export async function requestChunk(url: string, method: Method = 'GET', onReceive: ChunkCallback, header?: Indexed, body?: Indexed, cors = true) {
    const mergedHeaders = Object.assign(getHeader(), header)
    const params: RequestParam = {
        method: method,
        headers: new Headers(mergedHeaders),
        mode: cors ? 'cors' : 'same-origin'
    }
    if (body !== undefined) {
        params.body = JSON.stringify(body)
    }
    const resp = await fetch(BASE_URL + url, { ...params })
    if (resp.body == null) {
        return Promise.reject()
    }
    const reader = resp.body.getReader()
    let done = false
    while (!done) {
        const result = await reader.read()
        done = result.done
        const value = result.value || []
        let str = ''
        for (let i = 0; i < value.length; i++) {
            str += String.fromCharCode(value[i])
        }
        onReceive(str)
    }
}
