import {request} from "./request";

export function _hotSearchDetail(){
    return request({
        url:'/search/hot/detail'
    })
}

export function _searchSuggest(keyword){
	return request({
		url:'/search/suggest',
		params:{
		    keywords:keyword
		}
	})
}