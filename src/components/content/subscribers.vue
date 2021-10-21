<template>
	<div class="subscribe">
		<div class="photos" v-for="(item,index) in isShowNew" :key='item.userId' @click="onUserProfile(item)">
			<div>
				<img :src="item.avatarUrl" alt="">
			</div>
			<div>
				<span>{{item.nickname}}</span>
				<i class="iconfont icon-nanxing" style="background-color:#C0F3FF;color: #57B1DB;" v-if="item.gender == 1"></i>
				<i class="iconfont icon-nvxing" style="background-color:#FFCDE8;color: #EF77AA;" v-else-if="item.gender == 2"></i>
			  <p>{{item.signature}}</p>
			</div>
		</div>
		<div class="pages">
			<van-pagination v-model="currentPage" :show-page-size="totalItem>6?6:totalItem" force-ellipses :page-count='totalItem' @change='changePage'
			/>
		</div>
	</div>
</template>

<script>
	//vue功能引入
	import { ref,onMounted } from 'vue'
	//接口引入
	import { allSubscribe } from '../../network/songs.js'
	//由于setup中不存在this,因此在setup中使用路由必须先声明
	import { useRouter } from 'vue-router'
	export default {
		name:'subscribers',
		props:{
			allSubscribers:{
				type:Object,
				required:true,
				default(){
					return {}
				}
			},
			listId:{
				type:String,
				required:true,
				default(){
					return null
				}
			}
		},
		setup(props,context){
			const router = useRouter() //实例化路由
			
			const subscribersList = ref([]);
			const isShowNew = ref([]);
			const totalItem = ref(Math.ceil(props.allSubscribers.total/60))
			const currentPage = ref(1);
      //点击其他页面时
			const changePage = async() => {
				isShowNew.value = []
				// //判断是否需要加载新评论 大幅减少请求数量
				let isSome = subscribersList.value.find(item =>item.page == currentPage.value)
				if(isSome){
					//加载缓存数据
					isShowNew.value = isSome.list
				}else{
					//发送新请求
					const res = await allSubscribe(props.listId,60,currentPage.value*60)
					console.log(res)
					getPush(res.subscribers)
				}	
			}
			//封装添加数据操作
			const getPush = (val) => {
				let listDetail = {}
				listDetail.list = val
				listDetail.page = currentPage.value
				subscribersList.value.push(listDetail) 
				isShowNew.value = val
			}
			//路由跳转个人详情页
			const onUserProfile = (item) => {
				router.push({path:'/home/userDetail',query:{id:item.userId}})
			}
			//挂载时
			onMounted(()=>{
				getPush(props.allSubscribers.subscribers)
			})
			
			return{
				subscribersList,
				currentPage,
				changePage,
				totalItem,
				isShowNew,
				onUserProfile
			}
		}
	}
</script>

<style scoped lang="less">
  .subscribe{
		margin-left: 40px;
		margin-top: 40px;
		display: flex;
		flex-wrap: wrap;
		.photos{
			display: flex;
			align-items: center;
			width: 33%;
			margin-bottom: 40px;
			div:nth-child(2){
				margin-left: 20px;
				text-align: left;
			}
			img{
				width: 80px;
				height: 80px;
				border-radius: 50%;
				cursor:pointer
			}
			span{
				font-size: 17px;
				opacity: 0.8;
				cursor:pointer;
				vertical-align: middle;
				&:hover{
					opacity: 1;
				}
			}
			i{
				display: inline-block;
				width: 20px;
				height: 20px;
				border-radius: 50%;
				font-size: 12px;
				line-height: 20px;
				margin-left:10px;
				text-align: center;
			}
			p{
				font-size: 13px;
				text-align: left;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}
		.pages{
			width: 55%;
			margin: 150px auto 200px;
		}
	}
</style>
