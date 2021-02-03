import { request, requestChunk, ChunkCallback } from './base'

const BaseURL = 'https://xixi.ph'

// API请求的数组
var serverApiArr = ["/auth/login", "/auth/register", "/getuserinfo", "/getuserinviteinfo",
    "/getnodelist", "/getusershops", "/getallresourse", "/postshop", "/payment/status", "/user/payment/purchase",
    "/getChargeLog", "/user/ticket", "/ticket_view", "/check_left", "/confirm_left", "/getCaptcha"]

// API请求索引
// 登录
const AuthLogin = 0
// 注册
const AuthRegister = 1
// 个人信息
const GetUserInfo = 2
// 邀请信息
const GetUserInviteInfo = 3
// 节点列表
const GetNodeList = 4
// 商店信息
const GetUserShop = 5
// 余额以及剩余流量信息
const GetAllResourse = 6
// 获取购买二维码
const ShopBuy = 7
// 查询订单
const CheckPayStatus = 8
// 充值
const Recharge = 9
// 充值记录
const RechargeRecord = 10
// 提交工单
const TicketAdd = 11
// 工单列表
const TicketList = 12
// 获取用户当前套餐剩余价值
const GetLeftMoney = 13
// 确认将套餐转为账户余额
const ConfirmConvertMoney = 14
// 获取geetest信息
const GeeTest = 15


function getFullUrl(apiIndex: number) {
    const fullUrl = `${BaseURL}/${serverApiArr[apiIndex]}`
    return fullUrl
}

export async function requestLogin(email:string, password: string) {
    const fullUrl = `${getFullUrl(AuthLogin)}?email=${email}&passwd=${password}&code=&remember_me=on`; 
    return request(fullUrl)
}
