import { request } from './request.js'
//取歌单详情动态部分,如评论数,是否收藏,播放数
export const dynamicInfo = id => {
	return request({
		url:'/playlist/detail/dynamic',
		params:{
			id
		}
	})
}
//获取歌单详情
export const detailInfo = id => {
	return request({
		url:'/playlist/detail',
		params:{
			id
		}
	})
}
//获取歌曲详情
export const detailSongs = ids => {
	return request({
		url:'/song/detail',
		params:{
			ids
		}
	})
}
//传入音乐 id, 可喜欢该音乐
export const likeSongs = params => {
	return request({
		url:'/like',
		params
	})
}
//传入用户 uid, 可获取已喜欢音乐id列表(id数组)
export const likeSongsList = (uid,timerstap) => {
	return request({
		url:'/likelist',
		params:{
			uid,
			timerstap
		}
	})
}