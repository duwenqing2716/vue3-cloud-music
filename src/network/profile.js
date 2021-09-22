import { request } from './request.js'
//退出登录
export const userLogout = () => {
	return request({
		url:'/logout'
	})
}
//获取用户粉丝列表
export const getUserFolloweds = params => {
	return request({
		url:'/user/followeds',
		params
	})
}
//获取用户动态
export const getUserEvents = params => {
	return request({
		url:'/user/event',
		params
	})
}
//获取用户关注列表
export const getUserFollows = params => {
	return request({
		url:'/user/follows',
		params
	})
}