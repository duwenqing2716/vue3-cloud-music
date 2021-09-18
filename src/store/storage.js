export function getItem(songName){
	const data = window.localStorage.getItem(songName)
	try{
		return JSON.parse(data)
	}catch(e){
		console.log(e,'错误信息:获取本地存储失败！')
		return data
	}
}

export function setItem(songName, value){
	// 判断类型转为JSON格式存储于本地
	if(typeof value ==='object'){
		value = JSON.stringify(value)
	}
	
	window.localStorage.setItem(songName, value)
}

export const removeItem = songName => {
    window.localStorage.removeItem(songName)
    
}