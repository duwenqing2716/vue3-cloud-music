<template>
	<div class="cloud-aside">
		<van-sidebar v-model="active">
			<div class="common">
		    <van-sidebar-item title="发现音乐" />
		    <van-sidebar-item title="播客" />
		    <van-sidebar-item title="视频" />
			  <van-sidebar-item title="朋友" />
			  <van-sidebar-item title="直播" />
			  <van-sidebar-item title="私人FM" />
			  </div>
			<span class='myMusic'>我的音乐</span>
			<van-sidebar-item>
				<template #title>
					<i class="iconfont icon-download" style="font-weight: bold;"></i>
					<span>本地与下载</span>
				</template>
			</van-sidebar-item>
			<van-sidebar-item>
				<template #title>
					<i class="iconfont icon-zuijinbofang" style="font-weight: bold;font-size: 24px;"></i>
					<span>最近播放</span>
				</template>
			</van-sidebar-item>
			<div v-if="$store.getters.getLoginStatus">
				<van-sidebar-item>
					<template #title>
						<i class="iconfont icon-yun" style="font-weight: bold;font-size: 24px;"></i>
						<span>我的音乐云盘</span>
					</template>
				</van-sidebar-item>
				<van-sidebar-item>
					<template #title>
						<i class="iconfont icon-boke" style="font-size: 24px;"></i>
						<span>我的播客</span>
					</template>
				</van-sidebar-item>
				<van-sidebar-item>
					<template #title>
						<i class="iconfont icon-shoucang" style="font-weight: bold;font-size: 24px;"></i>
						<span>我的收藏</span>
					</template>
				</van-sidebar-item>
			</div>
			<div class='myMusic' >
				<div @click="onCreateList">
				<span class="myvList">我创建的歌单</span>
				<i class="iconfont icon-sanjiao_xia" v-if="isShowIcon"></i>
				<i class="iconfont icon-sanjiao_xia-copy" v-else></i>
				</div>
				<div class="myvAdd">
				<i class="iconfont icon-tianjia"></i>
				</div>
			</div>
			<div>
			<van-sidebar-item v-show="isShowIcon">
			  <template #title>
				  <i class="iconfont icon-xihuan1" style="font-weight: bold;"></i>
					<span>我喜欢的音乐</span>
					<button>
						<i class="iconfont icon-xihuan" style="font-weight: bold;"></i>
					</button>
			  </template>
			</van-sidebar-item>
			</div>
			<div class='myMusic' v-if="$store.getters.getLoginStatus">
				<div @click="onPlayList">
				<span class="myvList">我收藏的歌单</span>
				<i class="iconfont icon-sanjiao_xia" v-if="isShowPlayList"></i>
				<i class="iconfont icon-sanjiao_xia-copy" v-else></i>
				</div>
				<div class="myvAdd">
				</div>
			</div>
			<div v-show="isShowPlayList" v-if="$store.getters.getLoginStatus">
			<van-sidebar-item v-for="(item,index) in playlist">
			  <template #title>
				  <i class="iconfont icon-gedan1"></i>
					<span class="playlist">{{item.name}}</span>
			  </template>
			</van-sidebar-item>
			</div>
		</van-sidebar>
	</div>
</template>

<script>
	//vue功能引入
	import { ref,onMounted,watch,computed,nextTick } from 'vue';
	//本地存储引入
	import { getItem } from '../../store/storage.js'
	//接口引入
	import { getUserPlaylist } from '../../network/profile.js'
	//vuex功能引入
	import{ useStore } from 'vuex'
	export default {
		name:'Aside',
		props:{
			theme:{
				type:String,
				required:true,
				default(){
					return null
				}
			}
		},
		setup(props,context){
			const store = useStore()
			
			const active = ref(0);
			const theme = ref(null);
			const isShowIcon = ref(true);
			const isShowPlayList = ref(true);
			const playlist = ref({});
			const myfavorite = ref({});
			const uid = ref(null);
			//是否显示自我创建的歌单 默认显示
			const onCreateList = () => {
				isShowIcon.value = !isShowIcon.value
			}
			//是否显示我收藏的歌单 默认显示
			const onPlayList = () => {
				isShowPlayList.value = !isShowPlayList.value
			}
			//分开获取我喜欢的音乐和我收藏的歌单
			const onGetUserPlayList = () => {
				getUserPlaylist(uid.value).then(res=>{
					if(res.code === 200){
						myfavorite.value = res.playlist.filter((val,index)=>index===0)
						playlist.value = res.playlist.filter((val,index)=>index>0)
					}
				})
			}
			
			//{immediate:true}立即执行因此不需要挂载执行
			
			// onMounted(()=>{
			// 	uid.value = store.getters.getUserId
			// 	if(uid.value){
			// 		onGetUserPlayList()
			// 	}
			// })
			
			//监听登录状态,获取uid并获取自己收藏的歌单 (立即执行)
			watch(()=>store.state.isLogin,(newValue,oldValue)=>{
					if(store.getters.getUserId){
						uid.value = store.getters.getUserId
						onGetUserPlayList()
					}
			},{immediate:true})
			
			return { 
				active,
				onCreateList,
				isShowIcon,
				isShowPlayList,
				onPlayList,
				playlist,
				myfavorite,
				uid,
				onGetUserPlayList
			};
		}
	}
</script>

<style lang="less" scoped="scoped">
	.cloud-aside{
		width: 20%;
		height: 79%;
		overflow: auto;
		z-index: 99;
		position:fixed;
		margin-top: 80px;
		padding-right: 10px;
		border-right: 1px solid rgba(125,125,125,0.3);
		z-index: 2;
		:deep(.van-badge__wrapper){
			position: absolute;
			left: 25px;
			top: calc(50% - 10px);
		}
		.common{
			.van-sidebar-item--select{
				font-weight: bold;
			}
		}
		.van-sidebar-item{
			font-size: 16px;
			margin-left: 10px;
			height: 50px;
			background-color: white;
			button{
				margin-left: 70px;
				width: 50px;
				height: 30px;
				border-radius: 15px;
				border: none;
				background-color: white;
				border: 1px solid rgba(125,125,125,0.3);
				cursor: pointer;
				&:hover{
					background-color: rgba(125,125,125,0.1);
				}
				i{
					margin-right: 0px;
					font-size: 18px;
				}
			}
			i{
				margin-right: 10px;
				font-size: 20px;
			}
		}
		.van-sidebar-item--select{
			background-color: rgba(125,125,125,0.1);
		}
		.van-sidebar{
			width: 100%;
		}
		.myMusic{
			margin: 15px 0;
			margin-left: 35px;
			font-size: 14px;
			color: gray;
			display: flex;
			.myvList{
				margin-left: -30px;
			}
			.myvAdd{
				i{
					display: block;
					position: absolute;
					right: 30px;
				}
			}
			div{
				flex: 1;
				span,i{
					cursor: pointer;
				}
			}
		}
		.van-badge__wrapper{
			.icon-gedan1{
				font-size: 22px;
				position: absolute;
				top: 3px;
			}
			.playlist{
				display: inline-block;
				width: 240px;
				height: 25px;
				line-height: 25px;
				text-align: left;
				margin-left: 26px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}		
	}
	
</style>
