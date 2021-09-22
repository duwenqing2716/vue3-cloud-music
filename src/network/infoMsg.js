import { request } from './request.js'

export const privateInfo = params => {
	return request({
		url:'/user/detail',
		params
	})
}