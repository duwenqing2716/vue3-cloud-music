import { request } from './request.js'

export const getQRCode = (p) => {
	return request({
		url:'/login/qr/key',
		params:{
		    timerstamp:p
		}
	})
}

export const getQRImage = (key,timerstamp,qrimg) => {
	return request({
		url:'/login/qr/create',
		params:{
			  key:key,
		    timerstamp:timerstamp
		}
	})
}

export const checkImage = (key,timerstamp) => {
	return request({
		url:'/login/qr/check',
		params:{
			key,
			timerstamp
		}
	})
}

export const refreshLogin = (timerstamp) => {
	return request({
		url:'/login/refresh',
		params:{
		    timerstamp:timerstamp
		}
	})
}

export const registPhone = (phone) => {
	return request({
		url:'/cellphone/existence/check',
		params:{
		    phone
		}
	})
}


export const cellphoneLogin = (phone,password) => {
	return request({
		url:'/login/cellphone',
		params:{
			phone,
			password
		}
	})
}

export const changePwd = (phone,password,captcha) =>{
	return request({
		url:'/login/cellphone',
		params:{
			phone,
			password,
			captcha
		}
	})
}

export const sendSms = (phone) => {
	return request({
		url:'/captcha/sent',
		params:{
			phone
		}
	})
}

export const checkSms = (phone,captcha) =>{
	return request({
		url:'/captcha/verify',
		params:{
			phone,
			captcha
		}
	})
}
//当注册时传入nickname,当修改密码时无需传入nickname，因为会报错nickname已存在
export const register = params =>{
	return request({
		url:'/register/cellphone',
		params
	})
}

export const initProfile = (nickname) => {
	return request({
		url:'/activate/init/profile',
		params:nickname
	})
}