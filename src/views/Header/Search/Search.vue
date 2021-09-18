<template>
	<div class="search">
		<van-col id="center">
			<van-col span="4">
				<i class="iconfont icon-xiangzuo1" @click="goBack"></i>
				<i class="iconfont icon-xiangzuo2" @click="goOn"></i>
			</van-col>
			<van-col span="14">
				<van-popover v-model:show="state.showPopover" trigger="manual">
					<search-result v-if="state.value" :search-text='state.value'></search-result>
					<!-- <search-suggestion v-else-if="state.value" :search-text='value' @search="onSearch"></search-suggestion> -->
					<div v-else>
					<search-histories 
					:searchList='state.searchHistories' 
					@onDeleteAll='onDeleteAll' 
					@removeSongs='removeSongs'>
				  </search-histories>
				  <hot-search 
					:songList='state.list'>
					</hot-search>
					</div>
				  <template #reference>
						<!-- vue中标签栏绑定布尔值应在属性前加上语法糖: = @bind绑定 -->
					  <van-search v-model="state.value" 
						:clearable="false" 
						shape="round" 
						ref='mysearch'
						background="transparent" 
						placeholder="搜索"
						@search="onSearch" 
						@focus='onFocus'
						@blur='onBlur' />
				  </template>
		    </van-popover>
		  </van-col>
		  <van-col span="2">
				<i class="iconfont icon-tinggeshiqu"></i>
		  </van-col>
	  </van-col>
	</div>
</template>

<script>
	//vue功能引入
	import {
		ref,
		onMounted,
		reactive
	} from 'vue';
	//组件库引入
	import {
		Toast
	} from 'vant';
	//组件引入
	import searchHistories from './childComps/searchHistory.vue'
	import hotSearch from './childComps/hotSearch.vue'
	import searchResult from './childComps/searchResult.vue'
  //本地存储与获取
	import {
		getItem,
		setItem,
		removeItem
	} from '../../../store/storage.js'
	//接口引入
	import {
		_hotSearchDetail,
		_searchSuggest
	} from '../../../network/search.js'
 //由于setup中不存在this,因此在setup中使用路由必须先声明
	import {
		useRouter
	} from 'vue-router'
	
	export default {
		name: 'Search',
		components: {
      searchHistories,
			hotSearch,
			searchResult,
		},
		setup() {
			const mysearch = ref(null)
			const router = useRouter() //实例化路由

			const state = reactive({
				isResultShow: ref(false),
				list: [],
				value: '',
				searchHistories: getItem('search-songs') ? getItem('search-songs') : [],
				showPopover: ref(false)
			})
			//后退
			const goBack = () => {
				router.go(-1)
			}
			//前进
			const goOn = () => {
				router.go(1)
			}
			//焦点聚焦搜索  展示弹出
			const onFocus = () => {
				state.showPopover = true
			}
			//搜索失去焦点  关闭弹出
			const onBlur = () => {
				state.showPopover = false
			}
			//删除所有搜索历史 功能未完善
			const onDeleteAll = () => {
				state.searchHistories=[]
				setItem('search-songs', state.searchHistories)
			}
			//删除单个搜索历史
			const removeSongs =index => {
				state.searchHistories.splice(index, 1)
				setItem('search-songs', state.searchHistories)
			}
			// 钩子函数
			onMounted(() => {
				init()
			})
      //请求热搜榜
			const init = () => {
				_hotSearchDetail().then(res => {
					state.list = res.data
					console.log(state.list)
				})
			}
			//搜索时触发
			const onSearch = val => {
				state.isResultShow = true
				state.showPopover = false
				
				const index = state.searchHistories.indexOf(val)
				// console.log(index)
				// 判断关键字是否重复 并存储于本地
				if (index !== -1) {
					return
				}
				state.searchHistories.unshift(val)
				setItem('search-songs', state.searchHistories)
			};
			
			return {
				mysearch,
				state,
				onSearch,
				onFocus,
				onBlur,
				goBack,
				goOn,
				onDeleteAll,
				removeSongs
			};
		}
	}
</script>

<style lang="less" scoped="scoped">
		#center {
			display: flex;
			flex: 1;
			.van-search {
				width: 300px;
			}
			i {
				font-size: 25px;
				cursor: pointer;
			}
			
		}
	
</style>
