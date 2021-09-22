<template>
	<div>
		<div class="signIn">
			<div class="signIn-nav">
				<div>
					<p>{{state.events || 0}}</p>
					<span>动态</span>
				</div>
				<div>
					<p>{{state.follow.length || 0}}</p>
					<span>关注</span>
				</div>
				<div>
					<p>{{state.fans.length || 0}}</p>
					<span>粉丝</span>
				</div>
			</div>
			<div class="signIn-bottom">
				<button><i class="iconfont"></i>签到</button>
			</div>
		</div>
		<van-cell value="未订购" is-link>
		  <template #title>
				<i class="iconfont icon-huiyuan"></i>
		    <view class="van-cell-text">会员中心</view>
		  </template>
		</van-cell>
		<van-cell value="Lv.7" is-link>
		  <template #title>
				<i class="iconfont icon-dengji"></i>
		    <view class="van-cell-text">等级</view>
		  </template>
		</van-cell>
		<van-cell value="" is-link>
		  <template #title>
				<i class="iconfont icon-shangcheng"></i>
		    <view class="van-cell-text">商场</view>
		    <div class='dot' style="position: absolute;left: 75px;top: 15px;width: 10px;height: 10px;background-color: red;z-index: 1;border-radius: 50%;"></div>
		  </template>
		</van-cell>
		<van-cell value="" is-link>
		  <template #title>
				<i class="iconfont icon-geren"></i>
		    <view class="van-cell-text">个人信息设置</view>
		  </template>
		</van-cell>
		<van-cell value="" is-link>
		  <template #title>
				<i class="iconfont icon-bangding"></i>
		    <view class="van-cell-text">绑定社交账号</view>
		  </template>
		</van-cell>
		<van-cell value="" is-link>
		  <template #title>
				<i class="iconfont icon-kefu"></i>
		    <view class="van-cell-text">我的客服</view>
		  </template>
		</van-cell>
		<van-cell value="" is-link @click='logout'>
		  <template #title>
				<i class="iconfont icon-secede"></i>
		    <view class="van-cell-text">退出登录</view>
		  </template>
		</van-cell>
	</div>
</template>

<script>
	//vuex功能引入
	import{ useStore } from 'vuex'
	//组件库引入
	import { Toast } from 'vant'
	//vue相关功能引入
	import { ref,reactive,inject,onMounted,computed } from 'vue'
	
	import { getUserEvents,getUserFollows,getUserFolloweds,userLogout } from '../../../../network/profile.js'
	
	import { removeItem } from '../../../../store/storage.js'
	export default{
		name:'userSettings',
		props:{
			
		},
		components:{
			
		},
		setup(props,context){
			const store = useStore()
			const uid = ref(null)
			const state = reactive({
				follow:{},
				events:null,
				fans:{}
			})
			
			const logout = async() => {
				// console.log('1123')
				const res = await userLogout()
				// console.log(store.state.isLogin)
				console.log(res)
				if(res.code!=200){
					Toast.fail('退出登录失败')
				}else{
					
					context.emit('onCloseProfile')
				}
			}
			
			onMounted(async()=>{
				uid.value = store.getters.getUserId
				const res = await getUserEvents({uid:uid.value})
				state.events = res.size
				const data = await getUserFollows({uid:uid.value}) 
				state.follow = data.follow
				const val = await getUserFolloweds({uid:uid.value}) 
				state.fans = val.followeds
			})
			
			return{
				state,
				logout
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	.signIn{
		.signIn-nav{
			display: flex;
			div{
				flex: 1;
				text-align: center;
				cursor: pointer;
				&:hover{
					color:rgba(125,125,125,0.9);
				}
				p{
					font-size: 24px;
					font-weight: bold;
				}
				span{
					display: block;
					margin-top: -15px;
					font-size: 15px;
				}
			}
		}
		.signIn-bottom{
			
			button{
				width: 110px;
				height: 38px;
				background-color: white;
				border-radius: 8px;
				border: 1px solid #999999;
				margin-top: 10px;
				margin-left: calc(50% - 55px);
				cursor: pointer;
				&:hover{
					background-color:rgba(125,125,125,0.1);
				}
			}
			
		}
	}
	.van-cell__title{
		i{
			margin-right: 5px;
		}
	}
</style>
