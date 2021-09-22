import { request } from './request.js'
//获取用户详情
export const getUserDetail = uid => {
	return request({
		url:'/user/detail',
		params{
			uid
		}
	})
}
//获取账号信息
export const getUserCount = () => {
	return request({
		url:'/user/account'
	})
}
//获取用户信息 , 歌单，收藏，mv, dj 数量
export const getUserSubcount = () => {
	return request({
		url:'/user/subcount'
	})
}
//获取用户等级信息
export const getUserLevel = () => {
	return request({
		url:'/user/level'
	})
}
//获取用户绑定信息
export const getUserBinding = uid => {
	return request({
		url:'/user/binding',
		params:{
			uid
		}
	})
}
//用户绑定手机
export const getUserLevel = (phone,oldcaptcha,captcha) => {
	return request({
		url:'/user/replacephone',
		params:{
			phone,
			oldcaptcha,
			captcha
		}
	})
}