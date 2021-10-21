<template>
	<div class="songsDetail">
		<div class="songs-nav">
			<div class="songs-left">
				<img :src="songsDetails.coverImgUrl" alt="">
			</div>
			<div class="songs-right">
				<div class="songs-name">
					<span>歌单</span>
					<span>{{songsDetails.name}}</span>
				</div>
				<div class="creator">
					<img :src="image" alt="" id="image" @click="reSongDetail">
					<span @click="reSongDetail">
						{{nickname}}
					</span>
					<span>{{createTime}}创建</span>
				</div>
				<div class="iconInfo">
					<span>
						<div>
							<i class="iconfont icon-bofang"></i>
							播放全部
						</div>
						<div>
							<i class="iconfont icon-tianjia"></i>
						</div>
					</span>
					<span class='other-icon' @click="onCollect">
						<i class="iconfont icon-shoucang" v-if="!subscribed"></i>
						<i class="iconfont icon-yishoucang" v-else></i>
						{{subscribed?'已收藏':'收藏'}}({{songsDetails.subscribedCount>9999?Math.floor(songsDetails.subscribedCount/10000)+'万':songsDetails.subscribedCount}})
					</span>
					<span class='other-icon'>
						<i class="iconfont icon-bangding"></i>分享({{songsDetails.shareCount>9999?Math.floor(songsDetails.shareCount/10000)+'万':songsDetails.shareCount}})
					</span>
					<span class='other-icon'>
						<i class="iconfont icon-download"></i>下载全部
					</span>
				</div>
				<div class="tag">
					<p class="tag-nav" v-if="tags!=''">标签: <span>{{tags}}</span></p>
					<p class="tag-song">
						<span>歌曲: {{songsDetails.trackCount}}</span>
						<span>播放: {{songsDetails.playCount>9999?Math.floor(songsDetails.playCount/10000)+'万':songsDetails.playCount}}</span>
					</p>
					<p class="tag-bottom" v-if="songsDetails.description">
						<span :class="spread?'spread':''">简介: {{songsDetails.description}}</span>
						<i class="iconfont icon-sanjiao_xia" :class="spread?'':'unfold'" @click="onTransform"></i>
					</p>
				</div>
			</div>
		</div>
		<div class="songs-list">
			<div class="list-nav">
				<div class="nav-left">
					<span :class="currentIndex==1?'active':''" @click='onActive(1)'>歌曲列表</span>
					<span :class="currentIndex==2?'active':''" @click='onActive(2)'>评论({{commentCount}})</span>
					<span :class="currentIndex==3?'active':''" @click='onActive(3)'>收藏者</span>
				</div>
				<div class="nav-right" v-show="currentIndex==1">
					<input type="text" placeholder="搜索歌单音乐" v-model="search">
					<i class="iconfont icon-sousuo" v-if="search==''"></i>
					<i class="iconfont icon-guanbi" style="font-size: 14px;display: block;line-height: 20px;" v-else @click="onCancel"></i>
				</div>
			</div>
		</div>
		<div class="row-songs-list" v-show="currentIndex==1" v-if="listSongs.length!=0">
			<van-row class="row-songs-list-nav">
				<van-col span="4"></van-col>
				<van-col span="8" class='row-songs-list-content'>音乐标题</van-col>
				<van-col span="4" class='row-songs-list-content'>歌手</van-col>
				<van-col span="6" class='row-songs-list-content'>专辑</van-col>
				<van-col span="2" class='row-songs-list-content'>时长</van-col>
			</van-row>
			<van-row class="row-songs-list-details" :class="index%2?'':'differ'" v-for="(item,index) in listSongs" :key='item.id'
			 v-if="search === ''">
				<van-col class="row-songs-list-num" span="4">
					<span>{{index+1<10?'0'+(index+1):index+1}}</span>
					<i class="iconfont icon-xihuan2" style="color: #EC4141;" v-if="isCompare[item.id]" @click='onLike(item.id,true,index,0)'></i>
					<i class="iconfont icon-xihuan1" v-else @click='onLike(item.id,false,index,0)'></i>
					<i class="iconfont icon-download"></i>
				</van-col>
				<van-col span="8" class="row-songs-list-name" style="color: black;">
					<span class="list-row">{{item.name}}</span>
					<span class="SQorMv">SQ</span>
					<span class="SQorMv">MV</span>
				</van-col>
				<van-col span="4" class="row-songs-list-name">{{item.ar[0].name===''?'未知歌手':item.ar[0].name}}</van-col>
				<van-col span="6" class="row-songs-list-name">{{item.al.name===''?'未知专辑':item.al.name}}</van-col>
				<van-col span="2" class="row-songs-list-name">{{'0'+new Date(item.dt).getMinutes()+':'+(new Date(item.dt).getSeconds()<10?'0'+new Date(item.dt).getSeconds():new Date(item.dt).getSeconds())}}</van-col>
			</van-row>
			<van-row class="row-songs-list-details" :class="index%2?'':'differ'" v-for="(item,index) in searchLists" :key='item.id'
			 v-else-if="searchLists.length!=0">
				<van-col class="row-songs-list-num" span="4">
					<span>{{index+1<10?'0'+(index+1):index+1}}</span>
					<i class="iconfont icon-xihuan2" style="color: #EC4141;" v-if="isCompare[item.id]" @click='onLike(item.id,true,index,1)'></i>
					<i class="iconfont icon-xihuan1" v-else @click='onLike(item.id,false,index,1)'></i>
					<i class="iconfont icon-download"></i>
				</van-col>
				<van-col span="8" class="row-songs-list-name" style="color: black;">
					<span class="list-row" v-html="highlight(item.name)"></span>
					<span class="SQorMv">SQ</span>
					<span class="SQorMv">MV</span>
				</van-col>
				<van-col span="4" class="row-songs-list-name" v-html="item.ar[0].name===''?'未知歌手':highlight(item.ar[0].name)"></van-col>
				<van-col span="6" class="row-songs-list-name" v-html="item.al.name===''?'未知专辑':highlight(item.al.name)"></van-col>
				<van-col span="2" class="row-songs-list-name">{{'0'+new Date(item.dt).getMinutes()+':'+(new Date(item.dt).getSeconds()<10?'0'+new Date(item.dt).getSeconds():new Date(item.dt).getSeconds())}}</van-col>
			</van-row>
			<div v-else-if="search !='' && searchLists.length === 0">
				<span style="margin-top: 40px;display: block;" v-show="text!=''">未能找到与‘{{text}}’相关的任何音乐</span>
			</div>
		</div>
		<div style="margin-top: 100px;color: lightgray;" v-else>暂无音乐</div>
		<div class="comment-list" v-if="currentIndex==2" style='width: 90%;margin-left: 25px;margin-top: 40px;'>
			<comment-lists :listId='id' @changeNum='changeNum'></comment-lists>
		</div>
		<div class="subscribed-list" v-if="currentIndex==3">
			<subscribers :allSubscribers='allSubscribers' :listId='id'></subscribers>
		</div>
	</div>
</template>

<script>
	//接口引入
	import {
		dynamicInfo,
		detailInfo,
		detailSongs,
		likeSongs,
		likeSongsList,
		userSubscribe,
		allSubscribe
	} from '../../network/songs.js'
	import {
		getUserPlaylist
	} from '../../network/profile.js'
	//路由功能引入
	import {
		useRouter,useRoute
	} from 'vue-router'
	//vuex功能引入
	import {
		useStore
	} from 'vuex'
	//vue功能引入
	import {
		onMounted,
		ref,
		onUpdated,
		nextTick,
		watch,
		reactive,
		computed
	} from 'vue'
	// 组件库引入
	import {
		Toast,
		Dialog
	} from 'vant'
	//组件引入
	import commentLists from './commentLists.vue'
	import subscribers from './subscribers.vue'
	export default {
		name: 'songDetail',
		props: {
			id: {
				type: String,
				required: true,
				default () {
					return ''
				}
			}
		},
		components: {
			commentLists,
			subscribers
		},
		//缺失功能歌曲排序,功能交错复杂,以后有时间在做
		setup(props, context) {
			const store = useStore();
			const router = useRouter(); //实例化路由
			const route = useRoute(); //实例化路由

			const createTime = ref(null);
			const tags = ref('');
			const nickname = ref(null);
			const image = ref('');
			const listSongs = ref([]);
			const songsDetails = ref({});
			const trackId = ref({});
			const spread = ref(true);
			const search = ref('');
			const searchLists = ref([]);
			const text = ref('');
			const uid = ref(null);
			const likes = ref([]);
			const subscribed = ref(false);
			const currentIndex = ref(1);
			const isCompare = ref({});
			const commentCount = ref(0);
			const allSubscribers = ref([]);
			//保存时间进行防抖操作 好像能用同一个
			const time = ref(null);
			const state = reactive({
				timer: null
			})
			//简介展开功能
			const onTransform = () => {
				spread.value = !spread.value
			}
			//取消收藏与收藏功能 无需防抖
			const onCollect = async () => {
				//是收藏状态
				// 判断登录状态
				if (store.state.isLogin) {
					if(songsDetails.value.userId == store.state.uid) return Toast('不能收藏自己的歌单')
					if (subscribed.value) {
						Dialog.confirm({
								message: '确定删除取消收藏吗?',
							})
							.then(async () => {
								const res = await userSubscribe(2, props.id, Date.now())
								if (res.code == 200) {
									subscribed.value = !subscribed.value
									songsDetails.value.subscribedCount--
									Toast('取消收藏成功')
								}
								//前页面watch监听登录状态 在此通过局部刷新方式进行aside页面数据更新 相比emit发送事件以及事件总线等等方式进行aside页面通知更新更加简洁方便
								store.state.isLogin = ''
								nextTick(() => {
									store.state.isLogin = true
								})
							})
							.catch(() => {});
					} else {
						//非收藏状态
						const res = await userSubscribe(1, props.id, Date.now())
						songsDetails.value.subscribedCount++
						subscribed.value = !subscribed.value
						Toast('收藏成功')
						//前页面watch监听登录状态 在此通过局部刷新方式进行aside页面数据更新 相比emit发送事件以及事件总线等等方式进行aside页面通知更新更加简洁方便
						store.state.isLogin = ''
						nextTick(() => {
							store.state.isLogin = true
						})
					}
				} else {
					Toast({
						message: '请登录后再操作(未做保存本地功能)'
					})
				}
			}
			//切换歌曲列表 评论 收藏者页面
			const onActive = (val) => {
				currentIndex.value = val
			}
			//跳转个人详情页面
			const reSongDetail = () => {
				router.push({
					path: '/home/userDetail',
					query: {
						id: songsDetails.value.userId
					}
				})
			}
			//搜索歌曲取消功能 清空所有数据 初始化
			const onCancel = () => {
				search.value = ''
				text.value = ''
				searchLists.value = []
			}
      //接收评论页面传输的数据
			const changeNum = (num) => {
				// if(num <= 0) num=0
				commentCount.value = num
			}
			//更新页面数据,将喜欢的音乐与点赞信息真正存于后端
			const getReCompare = async (id, like, timerstamp) => {
				const res = await likeSongs({
					id: id,
					like: !like,
					timerstamp: timerstamp
				})
				if (res.code == 200) {
					//判断是否为自己 将不喜欢的从列表删除歌曲数变化
					if(res.playlistId == props.id){
							// 未搜索时
							listSongs.value.some((item,index) => {
								if(item.id == id){
									listSongs.value.splice(index,1)
									//总音乐数更新
									songsDetails.value.trackCount--
								}
							})
							// 搜索时
							searchLists.value.some((item,index) => {
								if(item.id == id){
									searchLists.value.splice(index,1)
								}
							})
					}
					//更新用户喜欢的音乐数据
					likeSongsList(uid.value, Date.now()).then(res => {
						if (res.code == 200) {
							likes.value = res.ids
							Toast.clear()
						}
					})
				}
			}
			//点击添加或者取消喜欢音乐
			const onLike = async (id, like, index, status) => {
				// 判断登录状态
				if (store.state.isLogin) {
					// 获取用户uid
					uid.value = store.getters.getUserId
					//判断歌单是否为用户本身 不喜欢时进行删除操作
					if(songsDetails.value.userId == store.state.uid){
						//是否确认操作
						Dialog.confirm({
							message: '确定将选中的歌曲从我喜欢的音乐中删除吗?',
						}).then(() => {
							//确认后直接删除无需防抖
							isCompare.value[id] = false
							Toast('取消喜欢成功')
							getReCompare(id, like, Date.now())
						}).catch(() => {
							//取消确认
						});
					}else{
					//不是用户本身歌单 进行操作防抖
					let message = ''
					if (like) {
						message = '取消喜欢成功'
						//判断是否为搜索时渲染 操作多余了直接取反就行
						isCompare.value[id] = false
					} else {
						message = '已添加到我喜欢的音乐'
						//判断是否为搜索时渲染  操作多余了直接取反就行
						isCompare.value[id] = true
					}
					Toast({
						message: message
					})
					//当用户快速点击时将未能及时快速响应 (已修复)几乎不会出现高频点击报错，但是6次后依然出现问题 后端设置问题(前端无力)
					if (time.value != null) {
						clearTimeout(time.value)
					}
					//防抖设置
					time.value = setTimeout(() => {
						getReCompare(id, like, Date.now())
					}, 500)
					}
				} else {
					Toast({
						message: '请登录后再操作(未做保存本地功能)'
					})
				}
			}
			//将搜索关键字高亮
			const highlight = (str) => {
				const reg = new RegExp(search.value, 'gim')
				return str.replaceAll(reg, `<span style='color:var(--mainColor)'>${search.value}</span>`)
			}
			//歌单搜索功能实现
			const searchInfo = (newValue) => {
				text.value = ''
				searchLists.value = []
				//对比关键词 优化:关键词不分大小写 str.toUpperCase() str转化成大写 str.toLowerCase() str转成小写 
				//将所有都转化为同一个写法 太麻烦了不做
				listSongs.value.forEach((item, index) => {
					if (item.name.indexOf(newValue) != -1 || item.al.name.indexOf(newValue) != -1 || item.ar[0].name.indexOf(
							newValue) != -1) {
						searchLists.value.push(listSongs.value[index])
					}
				})
				text.value = newValue
			}
			//监听搜索输入框并进行输入防抖(立即执行)
			watch(search, (newValue, oldValue) => {
				if (state.timer) {
					clearTimeout(state.timer)
				}
				state.timer = setTimeout(() => {
					searchInfo(newValue)
				}, 500)
			}, {
				immediate: true
			})
			//判断登录状态 获取用户喜欢的歌曲列表(立即执行) 用户喜欢的歌单在多个页面经常使用 此处建议放于vuex中管理
			watch(() => store.state.isLogin, (newValue, oldValue) => {
				if (store.state.isLogin) {
					//登录状态获取喜欢的音乐列表 此处建议获取到vuex中多处能使用
					uid.value = store.getters.getUserId
					likeSongsList(uid.value, Date.now()).then(res => {
						likes.value = res.ids
					})
				}
			}, {
				immediate: true
			})
			//监听路由变化页面不刷新bug 直接监听路由进行挂载 无需onMounted再执行
			watch(()=>props.id,async (newValue,oldValue)=>{
				//数据初始化以防页面不更新
				currentIndex.value = 1
				Toast.loading({
					duration: 0, // 持续时间，0表示持续展示不停止
					forbidClick: true, // 是否禁止背景点击
					message: '加载中...' // 提示消息
				})
				//async不加await 将出现promise类型 获取歌单页面详细数据
				const res = await detailInfo(props.id, Date.now())
				songsDetails.value = res.playlist
				commentCount.value = res.playlist.commentCount
				subscribed.value = res.playlist.subscribed
				let date = new Date(res.playlist.createTime)
				createTime.value = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
				nickname.value = res.playlist.creator.nickname
				image.value = res.playlist.creator.avatarUrl
				tags.value = res.playlist.tags.join('/')
				//获取完整歌单Id
				trackId.value = res.playlist.trackIds
				// 判断登录状态
				if (!store.state.isLogin) {
					//未登录 获取少量歌曲
					listSongs.value = res.playlist.tracks
					Toast('登录获取更多音乐！')
				} else {
					//登录 获取完整歌单Id
					// 如果歌单无歌曲
					if (trackId.value.length == 0) return Toast.clear()
					//有歌曲则继续操作
					let list = [];
					trackId.value.forEach(item => list.push(item.id))
					detailSongs(list.join(',')).then(res => {
						//歌曲数据
						listSongs.value = res.songs
						//喜欢音乐对比
						listSongs.value.forEach(item => {
							isCompare.value[item.id] = likes.value.some(items => items == item.id)
						})
						Toast.clear()
					})
				}
				//收藏页数据预先请求
				const data = await allSubscribe(props.id, 60, 0)
				allSubscribers.value = data
			},{immediate:true})
			return {
				songsDetails,
				createTime,
				tags,
				nickname,
				image,
				listSongs,
				trackId,
				spread,
				onTransform,
				search,
				onCancel,
				searchLists,
				state,
				text,
				likes,
				onLike,
				onCollect,
				subscribed,
				onActive,
				currentIndex,
				isCompare,
				time,
				getReCompare,
				highlight,
				changeNum,
				commentCount,
				allSubscribers,
				reSongDetail
			}
		}
	}
</script>

<style scoped lang="less">
	.songsDetail {
		width: 80%;
		margin-left: calc(21%);
		position: absolute;
		margin-top: 60px;

		.songs-nav {
			display: flex;
			margin-top: 40px;
			margin-left: 40px;

			.songs-left {
				img {
					width: 240px;
					height: 240px;
					border-radius: 8px;
				}
			}

			.songs-right {
				margin-left: 40px;
				font-size: 24px;
				text-align: left;

				.songs-name {
					span:nth-child(1) {
						font-size: 14px;
						text-align: center;
						display: inline-block;
						width: 35px;
						height: 20px;
						color: var(--mainColor);
						border: 2px solid var(--mainColor);
						border-radius: 4px;
					}

					span:nth-child(2) {
						margin-left: 20px;
						font-weight: bold;
					}
				}

				.creator {
					margin: 15px 0;
					font-size: 16px;
					display: flex;
					align-items: center;

					img {
						width: 45px;
						height: 45px;
						border-radius: 50%;
						cursor: pointer;
					}

					span:nth-child(2) {
						color: darkblue;
						margin: 0 20px;
						cursor: pointer;
						opacity: 0.7;

						&:hover {
							opacity: 1;
						}
					}
				}

				.iconInfo {
					font-size: 16px;
					text-align: center;

					div {
						display: inline-block;

						&:nth-child(1) {
							width: 73%;
							height: 100%;
							position: relative;

							&:before {
								position: absolute;
								display: block;
								top: 0;
								right: 0;
								bottom: 0;
								left: 0;
								z-index: 1;
								border-radius: 25px 0 0 25px;
								background: rgba(0, 0, 0, .1);
							}

							&:hover:before {
								content: "";
							}
						}

						&:nth-child(2) {
							width: 25%;
							height: 100%;
							position: relative;
							border-radius: 0 25px 25px 0;
							border-left: 2px solid rgba(255, 255, 255, 0.4);

							&:before {
								position: absolute;
								display: block;
								top: 0;
								right: 0;
								bottom: 0;
								left: 0;
								z-index: 1;
								border-radius: 0 25px 25px 0;
								background: rgba(0, 0, 0, .1);
							}

							&:hover:before {
								content: "";
							}
						}
					}

					span {
						width: 150px;
						height: 40px;
						line-height: 40px;
						color: white;
						border-radius: 25px;
						display: inline-block;
						background-color: var(--mainColor);
						margin-right: 40px;
						cursor: pointer;
						position: relative;

						.icon-bangding,
						.icon-download,
							{
							margin-right: 10px;
							font-size: 24px;
							font-weight: bold;
							vertical-align: middle;
						}

						.icon-shoucang {
							margin-right: 10px;
							font-size: 22px;
							font-weight: bold;
							vertical-align: middle;
						}

						.icon-yishoucang {
							font-size: 20px;
							vertical-align: middle;
						}
					}

					.other-icon {
						&:before {
							position: absolute;
							display: block;
							top: 0;
							right: 0;
							bottom: 0;
							left: 0;
							z-index: 1;
							border-radius: 25px;
							background: rgba(0, 0, 0, .1);
						}

						&:hover:before {
							content: "";
						}
					}
				}

				.tag {
					font-size: 16px;

					.tag-nav {
						cursor: pointer;
						display: inline-block;
						margin-bottom: 0;

						span {
							color: darkblue;
							opacity: 0.7;

							&:hover {
								opacity: 1;
							}
						}
					}

					.tag-song {
						span:nth-child(2) {
							margin-left: 40px;
						}
					}

					.tag-bottom {
						position: relative;

						span {
							display: inline-block;
							width: 400px;
							line-height: 25px;
						}

						.spread {
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}

						.unfold {
							transform: rotate(180deg);
						}

						i {
							position: absolute;
							right: 30px;
							font-size: 18px;
							cursor: pointer;
						}
					}
				}
			}
		}

		.songs-list {
			.list-nav {
				display: flex;
				margin-left: 40px;
				width: 80%;
				justify-content: space-between;
				margin-top: 40px;

				.nav-left {
					.active {
						padding-bottom: 8px;
						border-bottom: 3px solid var(--mainColor);
						;
					}

					span {
						cursor: pointer;

						&:nth-child(2) {
							margin: 0 20px;
						}
					}
				}

				.nav-right {
					position: relative;

					input {
						width: 200px;
						font-size: 13px;
						height: 25px;
						border-radius: 20px;
						border: none;
						background-color: rgba(125, 125, 125, 0.1);
						padding-left: 15px;
					}

					i {
						position: absolute;
						right: 15px;
						top: 4px;
						cursor: pointer;
					}
				}
			}
		}

		.row-songs-list {
			margin-top: 20px;

			.row-songs-list-nav {
				text-align: left;
				height: 35px;
				line-height: 35px;

				.row-songs-list-content {
					cursor: pointer;
					padding-left: 8px;
					color: darkgray;

					&:hover {
						background-color: rgba(125, 125, 125, 0.1);
					}
				}
			}

			.differ {
				background-color: #F9F9F9;
			}

			.row-songs-list-details {
				text-align: left;
				height: 35px;
				line-height: 35px;
				color: darkgray;
				cursor: pointer;

				&:hover {
					background-color: rgba(125, 125, 125, 0.15);
				}

				.row-songs-list-num {
					text-align: center;

					i {
						font-size: 18px;
						font-weight: bold;
					}
					.icon-xihuan1,.icon-download{
						opacity: 0.4;
						color: black;
						cursor: pointer;
						&:hover{
							opacity: 0.8;
						}
					}
					
					.icon-xihuan1,
					.icon-xihuan2 {
						margin: 0 10px 0 55px;
					}
				}

				.row-songs-list-name {
					width: 90%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					padding-left: 8px;

					.SQorMv {
						display: inline-block;
						width: 25px;
						height: 14px;
						font-size: 13px;
						border: 2px solid var(--mainColor);
						border-radius: 4px;
						text-align: center;
						color: var(--mainColor);
						line-height: 15px;
						margin-right: 8px;
					}

					.list-row {
						display: inline-block;
						max-width: 80%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						vertical-align: middle;
						margin-right: 10px;
					}
				}
			}
		}
	}
</style>
