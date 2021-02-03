// 访问广告后台的 API
import { request, requestChunk, ChunkCallback } from './base'
const CONFIG_URL = '/configs'
const PROXIES_URL = '/proxies'

const BaseURL = 'https://aipp.pao1.site'

// API请求数组
var advertApiArr = ["/getAdvertList", "/watchAdvert", "/getVersion", "/uploadErrMsg", "/getDownApkUrl"]
// API请求索引
const GetAdvert = 100
const WatchAdvert = 101
const GetVersion = 102
const UploadCrash = 103
const GetDownApkUrl = 104
 
//////// 这里改变数组是否有效？？？？

function getFullUrl(apiIndex: number) {
    const fullUrl = `${BaseURL}/${advertApiArr[apiIndex]}`
    return fullUrl
}

// 请求后台版本信息
export async function requestGetVersion() {
    return request(getFullUrl(GetVersion))
}


