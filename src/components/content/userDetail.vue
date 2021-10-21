<template>
	<div class="userDetail">
		<div class="user-nav">
			<img :src="userInfo.avatarUrl" alt="">
			<div class="user-nav-right">
				<div class="user-nav-top">
					<div class="user-nickname-left">
						<span>{{userInfo.nickname}}</span>
						<div>
							<span v-show="userInfo.vipType == 11">svip</span>
							<span>Lv.{{level}}</span>
							<span>
								<i class="iconfont icon-nanxing" v-if="userInfo.gender == 1"></i>
								<i class="iconfont icon-nvxing" style="background-color:#FFCDE8;color: #EF77AA;" v-else-if='userInfo.gender == 2'></i>
							</span>
						</div>
					</div>
					<div class="user-nickname-right">
						<div v-if="$store.state.uid != id">
							<button>
								<i class="iconfont icon-youjian"></i>
								<span>发私信</span>
							</button>
							<button @click="onFollowed(userInfo.followed)">
								<i class="iconfont icon-tianjia" v-if="!userInfo.followed"></i>
								<i class="iconfont icon-zhengque1" v-else style="font-weight: bolder;font-size: 20px;"></i>
								<span>{{userInfo.followed?'已关注':'关注'}}</span>
							</button>
							<button>
								...
							</button>
						</div>
						<div v-else>
							<router-link to='/home/profile'>
								<button style='width: 180px;color: black;'>
									<i class="iconfont icon-bianji"></i>
									编辑个人信息
								</button>
							</router-link>
						</div>
					</div>
				</div>
				<div class="user-nav-bottom">
					<div class="signIn-nav">
						<div>
							<p>{{userInfo.eventCount}}</p>
							<span>动态</span>
						</div>
						<div>
							<p>{{userInfo.follows}}</p>
							<span>关注</span>
						</div>
						<div>
							<p>{{userInfo.followeds}}</p>
							<span>粉丝</span>
						</div>
					</div>
					<p v-show="city">用户所在地区: {{city}}</p>
					<p>社交网络: {{bindings?'已绑定'+bindings.length+'个账号':'未绑定'}}</p>
					<p style="width: 600px;">个人介绍: {{userInfo.signature?userInfo.signature:'暂无个人介绍'}}</p>
				</div>
			</div>
		</div>
		<div class="user-subscribers-list">
			<div class="user-subscribers-list-title">
				<span>歌单({{selfCreateList.length}})</span>
				<div>
					<i class="iconfont icon-datumoshi" :class='modes==0?"active":""' @click='changeModes(0)' title="大图模式"></i>
					<i class="iconfont icon-31liebiao" :class='modes==1?"active":""' @click='changeModes(1)' title="列表模式"></i>
					<i class="iconfont icon-liebiao" :class='modes==2?"active":""' @click='changeModes(2)' title="图列模式"></i>
				</div>
			</div>
			<div class="user-subscribers-list-content" v-show="modes==0">
				<div v-if="peopleCanSee">
					<div style="position: relative;">
						<i class="iconfont icon-bofang"></i>
						<img src="../../assets/img/排行.png" alt="" @click="recentListen">
					</div>
					<div>
						<span>听歌排行</span>
						<p>累计听歌{{listenSongs}}首</p>
					</div>
				</div>
				<div v-for="(item,index) in selfCreateList">
					<div style="position: relative;">
						<i class="iconfont icon-bofang"></i>
						<img :src="item.coverImgUrl" alt="" @click="reSongDetail(item.id)">
						<div>
							<i class="iconfont icon-bofang1"></i>
							<span>{{item.playCount}}</span>
						</div>
					</div>
					<div>
						<span class="introduce">{{item.name}}</span>
						<p>{{item.trackCount}}首</p>
					</div>
				</div>
			</div>
			<div class="user-subscribers-list-second" v-show="modes==1">
				<div class="user-subscribers-list-main" v-if="peopleCanSee">
					<div>
						<div>
							<i class="iconfont icon-bofang"></i>
							<img src="../../assets/img/排行.png" alt="">
						</div>
						<span>听歌排行</span>
					</div>
					<div>
						<span style='width: 200px;'>累计听歌{{listenSongs}}首</span>
					</div>
				</div>
				<div class="user-subscribers-list-main" v-for="(item,index) in selfCreateList" :class="index%2?'':'differ'">
					<div>
						<div @click="reSongDetail(item.id)">
							<i class="iconfont icon-bofang"></i>
							<img :src="item.coverImgUrl" alt="">
						</div>
						<span @click="reSongDetail(item.id)">{{item.name}}</span>
					</div>
					<div>
						<span>歌曲: {{item.trackCount}}曲</span>
						<span>by {{userInfo.nickname}}</span>
						<span @click="$store.state.uid == id || item.subscribed?'':onCollect(item)">
							<i class="iconfont icon-wenjianshoucang" style="font-size: 20px;font-weight: bold;"></i>
							{{item.subscribedCount>9999?Math.floor(item.subscribedCount/10000)+'万':item.subscribedCount}}
						</span>
						<span>
							<i class="iconfont icon-bofang3" style="font-size: 18px;font-weight: bold;"></i>
							{{item.playCount>9999?Math.floor(item.playCount/10000)+'万':item.playCount}}
						</span>
					</div>
				</div>
			</div>
			<div class="user-subscribers-list-third" v-if="modes==2">
				<div class="user-subscribers-most" v-if="peopleCanSee">
					<div class="user-subscribers-left">
						<img src="../../assets/img/排行.png" alt="">
					</div>
					<div class="user-subscribers-right">
						<div class="user-subscribers-top">
							<span>听歌排行</span>
						</div>
						<div class="user-subscribers-bottom">
							<div class="user-subscribers-bottom-list" v-for="(item,index) in recentSongs" :class="index%2?'':'differ'">
								<span>{{index+1<10?'0'+(index+1):index+1}}</span>
								<i class="iconfont icon-xihuan2" style="color: #EC4141;" v-if="isCompareShow[item.song.id]" @click='onLike(item.song)'></i>
								<i class="iconfont icon-xihuan1" v-else @click='onLike(item.song)'></i>
								<i class="iconfont icon-download"></i>
								<span style='color: black;font-size: 15px;'>{{item.song.name}}</span>
								<span class="SQorMv">SQ</span>
								<span class="SQorMv">MV</span>
							</div>
							<div style="width: 890px;height: 30px;background-color: #F9F9F9;text-align: right;font-size: 14px;line-height: 30px;color: darkgray;border-radius: 4px;display: inline-block;cursor: pointer;"
							 v-if="recentSongs.nums>10">
								<span style='margin-right: 48px;'>查看全部{{recentSongs.nums}}首歌 ></span>
							</div>
						</div>
					</div>
				</div>
				<div class="user-subscribers-most" v-for="(item,index) in selfCreateList">
					<div class="user-subscribers-left" @click="reSongDetail(item.id)">
						<img :src="item.coverImgUrl" alt="">
					</div>
					<div class="user-subscribers-right">
						<div class="user-subscribers-top">
							<span @click="reSongDetail(item.id)">{{item.name}}</span>
							<i class="iconfont icon-bofang3"></i>
							<i class="iconfont icon-wenjianshoucang" @click="onCollect(item)" v-if="!item.subscribed && $store.state.uid != id"></i>
						</div>
						<div class="user-subscribers-bottom" v-if="selfSongs[item.id]!=undefined">
							<div class="user-subscribers-bottom-list" v-for="(item,index) in selfSongs[item.id]" :class="index%2?'':'differ'">
								<span>{{index+1<10?'0'+(index+1):index+1}}</span>
								<i class="iconfont icon-xihuan2" style="color: #EC4141;" v-if="isCompareShow[item.id]" @click='onLike(item)'></i>
								<i class="iconfont icon-xihuan1" v-else @click='onLike(item)'></i>
								<i class="iconfont icon-download"></i>
								<span style='color: black;display: inline-block;max-width: 560px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;line-height: 30px;'>{{item.name}}</span>
								<span class="SQorMv">SQ</span>
								<span class="SQorMv">MV</span>
								<span class='time'>{{'0'+new Date(item.dt).getMinutes()+':'+(new Date(item.dt).getSeconds()<10?'0'+new Date(item.dt).getSeconds():new Date(item.dt).getSeconds())}}</span>
							</div>
							<div style="width: 890px;height: 30px;background-color: #F9F9F9;text-align: right;font-size: 14px;line-height: 30px;color: darkgray;border-radius: 4px;display: inline-block;cursor: pointer;"
							 v-if="selfSongs[item.id].nums>10" @click="reSongDetail(item.id)">
								<span style='margin-right: 48px;'>查看全部{{selfSongs[item.id].nums}}首歌 ></span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="user-subscribers-list" v-if="playlist.length!=0">
			<div class="user-subscribers-list-title">
				<span>收藏({{playlist.length}})</span>
				<div>
					<i class="iconfont icon-datumoshi" title="大图模式"></i>
					<i class="iconfont icon-31liebiao" title="列表模式"></i>
					<i class="iconfont icon-liebiao" title="图列模式"></i>
				</div>
			</div>
			<div class="user-subscribers-list-content">
				<div v-for="(item,index) in subscriber">
					<div>
						<i class="iconfont icon-bofang"></i>
						<img :src="item.coverImgUrl" alt="" @click="reSongDetail(item.id)">
						<div>
							<i class="iconfont icon-bofang1"></i>
							<span>{{item.playCount>9999?Math.floor(item.playCount/10000)+'万':item.playCount}}</span>
						</div>
					</div>
					<div>
						<span class="introduce">{{item.name}}</span>
						<p>{{item.trackCount}}首</p>
					</div>
				</div>
			</div>
		</div>
		<div style='width: 55%;margin: 150px auto 200px;' v-if="playlist.length!=0">
			<van-pagination v-model="currentPage" :page-count='totalItems' :show-page-size="totalItems>8?8:totalItems"
			 force-ellipses @change='changePage' />
		</div>
	</div>
</template>

<script>
	//由于setup中不存在this,因此在setup中使用路由必须先声明
	import {
		useRouter,
		useRoute
	} from 'vue-router';
	//vue功能引入
	import {
		ref,
		onMounted,
		nextTick,
		watch
	} from 'vue'
	//vuex功能引入
	import {
		useStore
	} from 'vuex'
	//接口引入
	import {
		getUserDetail,
		userFollowed,
		userPlayList,
		getRecord
	} from '../../network/useDetail.js'
	import {
		likeSongsList,
		detailInfo,
		userSubscribe,
		likeSongs
	} from '../../network/songs.js'
	//地区数据引入
	import {
		areaList
	} from '@vant/area-data';
	//组件库引入
	import {
		Toast
	} from 'vant'
	//本地存储引入
	import { setItem,getItem } from '../../store/storage.js'
	export default {
		name: 'userDetail',
		props: {
			id: {
				type: String,
				required: true,
				default () {
					return ''
				}
			}
		},
		setup(props, context) {
			const store = useStore();
			const router = useRouter();

			const bindings = ref([]);
			const userInfo = ref({});
			const level = ref(null);
			const listenSongs = ref(0);
			const city = ref('');
			const likelists = ref([]);
			const playlist = ref([]);
			const selfCreateList = ref([]);
			const currentPage = ref(1);
			const subscriber = ref([]);
			const totalItems = ref(null);
			const modes = ref(getItem('songListMode')?getItem('songListMode'):0);
			const recentSongs = ref([]);
			const selfSongs = ref({});
			const peopleCanSee = ref(false);
			const likes = ref([]);
			const isCompareShow = ref({});
			const timer = ref(null);
			//关注与取消相关功能
			const onFollowed = async (val) => {
				let t = 0
				let message = ''
				if (val) {
					t = 0
					message = '取消关注成功！'
					//页面数据变化
					userInfo.value.followeds--
				} else {
					t = 1
					message = '关注成功！'
					//页面数据变化
					userInfo.value.followeds++
				}
				const res = await userFollowed(props.id, t, Date.now())
				if (res.code == 200) {
					userInfo.value.followed = !userInfo.value.followed
					Toast({
						message: message
					})
				}
			}
			//歌单详情页面跳转
			const reSongDetail = (id) => {
				router.push({
					path: '/home/songDetail',
					query: {
						id
					}
				})
			}
			//跳转最近用户听的歌曲页面
			const recentListen = () => {
				Toast('功能还未开发')
			}
			//用户歌单请求操作
			const getSelfList = async (val) => {
				const data = await detailInfo(val, Date.now())
				let lists = data.playlist.tracks.filter((item, index) => index < 10)
				lists.nums = data.playlist.trackIds.length
				selfSongs.value[val] = lists
				//对比搜索时的喜欢音乐
				selfSongs.value[val].forEach(item => {
					isCompareShow.value[item.id] = likes.value.some(items => items == item.id)
				})
				Toast.clear()
			}
			//改变图列模式
			const changeModes = async (value) => {
				modes.value = value
				// 将图例模式存储于本地
				setItem('songListMode',value)
				//判断模式类型是否为图列模式
				if (value == 2) {
					Toast.loading({
						duration: 0, // 持续时间，0表示持续展示不停止
						forbidClick: true, // 是否禁止背景点击
						message: '加载中...' // 提示消息
					})
					//判断用户是否开放访问权限
					if (peopleCanSee.value) {
						const res = await getRecord(props.id, 1)
						recentSongs.value = res.weekData.filter((item, index) => index < 10)
						recentSongs.value.nums = res.weekData.length
						recentSongs.value.forEach(item => {
							isCompareShow.value[item.song.id] = likes.value.some(items => items == item.song.id)
						})
					}
					//用户歌单请求
					selfCreateList.value.filter(item => getSelfList(item.id))
				}
			}
			//
			const onLike = async(val) => {
				// 判断登录状态
				if (store.state.isLogin) {
					Toast.loading({
						duration: 0, // 持续时间，0表示持续展示不停止
						forbidClick: true, // 是否禁止背景点击
						message: '加载中...' // 提示消息
					})
					const res = await likeSongs({id: val.id,like: !isCompareShow.value[val.id],timerstamp: Date.now()})
					if(res.code == 200){
						//判断是否为自己 将不喜欢的从列表删除歌曲数变化
						if(props.id == store.state.uid){
							let loveIt = selfSongs.value[res.playlistId].some((item,index)=>{
								if(item.id == val.id){
									 selfSongs.value[res.playlistId].splice(index,1)
									 return true
								}
							})
							if(!loveIt){
								selfSongs.value[res.playlistId].unshift(val)
								if(selfSongs.value[res.playlistId].length>10){
									selfSongs.value[res.playlistId].splice(10,1)
								}
							}
							
							if(selfSongs.value[res.playlistId] && isCompareShow.value[val.id]){
								selfSongs.value[res.playlistId].nums--
							}else{
								selfSongs.value[res.playlistId].nums++
							}
						}
						isCompareShow.value[val.id] = !isCompareShow.value[val.id]
						if(isCompareShow.value[val.id]){
							Toast('已添加到我喜欢的音乐')
						}else{
							Toast('取消喜欢成功')
						}
					}
				}else{
					Toast({
						message: '请登录后再操作(未做保存本地功能)'
					})
				}
			}
			//取消收藏与收藏功能 无需防抖
			const onCollect = async (item) => {
				// 判断登录状态
				if (store.state.isLogin) {
					const res = await userSubscribe(1, item.id, Date.now())
					Toast({
						message: '收藏成功'
					})
					//页面数据变化
					item.subscribedCount++
					item.subscribed = !item.subscribed
					//aside数据变化
					store.state.isLogin = ''
					nextTick(() => {
						store.state.isLogin = true
					})
				} else {
					Toast({
						message: '请登录后再操作(未做保存本地功能)'
					})
				}
			}
			//分页功能
			const changePage = () => {
				subscriber.value = []
				playlist.value.filter((item, index) => {
					if (index < 20 * currentPage.value && index >= 20 * (currentPage.value - 1)) {
						subscriber.value.push(item)
					}
				})
			}
			//挂载时
			onMounted(async () => {
				Toast.loading({
					duration: 0, // 持续时间，0表示持续展示不停止
					forbidClick: true, // 是否禁止背景点击
					message: '加载中...' // 提示消息
				})

				const res = await getUserDetail(props.id, Date.now())
				peopleCanSee.value = res.peopleCanSeeMyPlayRecord
				level.value = res.level
				userInfo.value = res.profile
				bindings.value = res.bindings
				listenSongs.value = res.listenSongs
				//省份数据操作,一些省份数据不对等,暂不考虑该情况
				for (let i in areaList.province_list) {
					if (i == userInfo.value.province) {
						city.value += areaList.province_list[i] + ' '
					}
				}
				for (let j in areaList.city_list) {
					if (j == userInfo.value.city) {
						city.value += areaList.city_list[j]
					}
				}
				//判断登录状态 获取用户喜欢的歌曲列表(立即执行)
				watch(() => store.state.isLogin, (newValue, oldValue) => {
					if (store.state.isLogin) {
						//登录状态获取喜欢的音乐列表 此处建议获取到vuex中多处能使用
						likeSongsList(store.state.uid, Date.now()).then(res => {
							likes.value = res.ids
						})
					}
				}, {
					immediate: true
				})
				//获取用户喜欢的歌曲列表
				const data = await likeSongsList(props.id, Date.now())
				likelists.value = data.ids
				//获取用户歌单将限制调整到5000,以一次性获取全部歌单
				const resData = await userPlayList(props.id, 5000, 0, Date.now())
				//筛选歌单是否为用户自己创建,分开处理
				// console.log(resData)
				resData.playlist.filter(item => {
					if (item.creator.userId == props.id) {
						selfCreateList.value.push(item)
					} else {
						playlist.value.push(item)
					}
				})
				//总页数
				totalItems.value = Math.ceil(playlist.value.length / 20)
				//分页功能实现第一页 可封装为方法多次使用
				playlist.value.filter((item, index) => {
					if (index < 20 * currentPage.value && index >= 20 * (currentPage.value - 1)) {
						subscriber.value.push(item)
					}
				})

				changeModes(getItem('songListMode'))

				Toast.clear()
			})

			return {
				bindings,
				userInfo,
				level,
				listenSongs,
				city,
				likelists,
				playlist,
				selfCreateList,
				onFollowed,
				reSongDetail,
				recentListen,
				currentPage,
				changePage,
				subscriber,
				totalItems,
				changeModes,
				modes,
				recentSongs,
				selfSongs,
				onCollect,
				peopleCanSee,
				likes,
				isCompareShow,
				onLike,
				timer
			}
		}
	}
</script>

<style scoped lang="less">
	.userDetail {
		width: 80%;
		margin-left: calc(21%);
		position: absolute;
		margin-top: 60px;

		.icon-bofang {
			z-index: 1;
			color: var(--mainColor);
			width: 35px;
			height: 35px;
			border-radius: 50%;
			background-color: rgba(255, 255, 255, 0.9);
			line-height: 35px;
			text-align: center;
			opacity: 0;
			transition: all 0.3s ease-in;
			position: absolute;
		}

		.user-nav {
			display: flex;
			margin-left: 20px;
			margin-top: 30px;

			img {
				width: 200px;
				height: 200px;
				border-radius: 50%;
			}

			.user-nav-right {
				margin-left: 40px;
				width: 74%;

				.user-nav-top {
					display: flex;
					justify-content: space-between;
					width: 100%;
					height: 65px;
					border-bottom: 1px solid lightgray;

					.user-nickname-left {
						text-align: left;

						span {
							font-size: 24px;
							font-weight: bold;
						}

						div {
							span {
								width: 40px;
								height: 18px;
								display: inline-block;
								border-radius: 8px;
								text-align: center;
								font-size: 14px;
								margin-top: 5px;
								margin-right: 15px;

								&:nth-child(1) {
									background-color: black;
									color: bisque;
									font-size: 14px;
								}

								&:nth-child(2) {
									background-color: rgba(125, 125, 125, 0.1);
									color: dimgray;
								}

								&:nth-child(3) {
									margin-left: -15px;

									i {
										background-color: #C0F3FF;
										color: #57B1DB;
										display: inline-block;
										width: 20px;
										height: 20px;
										border-radius: 50%;
										font-size: 12px;
										line-height: 20px;
										text-align: center;
										vertical-align: middle;
									}
								}
							}
						}
					}

					.user-nickname-right {
						button {
							width: 100px;
							height: 40px;
							border-radius: 20px;
							border: 1px solid lightgray;
							background-color: transparent;
							cursor: pointer;

							&:hover {
								background-color: rgba(125, 125, 125, 0.1);
							}

							i {
								margin-right: 5px;
								font-size: 22px;
								vertical-align: middle;
							}

							&:nth-of-type(2) {
								margin: 0 8px;

								i {
									margin-right: 5px;
									font-size: 16px;
									vertical-align: middle;
									color: #EC4141;
								}
							}

							&:nth-of-type(3) {
								width: 40px;
								height: 40px;
								border-radius: 50%;
							}
						}
					}
				}

				.user-nav-bottom {
					margin-top: 20px;

					.signIn-nav {
						display: flex;

						div {
							opacity: 0.8;
							cursor: pointer;

							&:hover {
								opacity: 1;
							}

							&:nth-child(2) {
								margin: 0 40px;
								padding: 0 40px;
								border-left: 1px solid lightgray;
								border-right: 1px solid lightgray;
							}

							p {
								text-align: center;
								font-size: 24px;
								margin-bottom: 2px;
								margin-top: 2px
							}

							span {
								font-size: 14px;
							}
						}
					}

					p {
						text-align: left;
						margin-top: 4px;
						margin-bottom: 5px;
						font-size: 14px;
					}
				}
			}
		}

		.user-subscribers-list {
			margin-left: 20px;
			margin-top: 40px;

			.user-subscribers-list-title {
				display: flex;
				width: 94%;
				justify-content: space-between;

				.active {
					background-color: rgba(125, 125, 125, 0.3);
				}

				span {
					font-size: 18px;
					font-weight: bold;
				}

				div {
					i {
						width: 25px;
						height: 25px;
						border-radius: 2px;
						background-color: rgba(125, 125, 125, 0.1);
						display: inline-block;
						line-height: 25px;
						color: darkgray;
						cursor: pointer;

						&:nth-child(2) {
							margin: 0 2px;
						}

						&:hover {
							background-color: rgba(125, 125, 125, 0.2);
						}
					}
				}
			}

			.user-subscribers-list-content {
				display: flex;
				flex-wrap: wrap;
				text-align: left;
				margin-top: 20px;

				div {
					width: 15%;
					margin-right: 11px;

					&:nth-of-type(1):hover .icon-bofang {
						opacity: 1;
						transition: all 0.3s ease-in;
					}

					img {
						width: 175px;
						height: 175px;
						border-radius: 6px;
						display: block;
						position: relative;
						cursor: pointer;
					}

					.icon-bofang {
						bottom: 10px;
						right: 10px;
					}

					div {
						position: relative;

						div {
							position: absolute;
							top: 8px;
							color: white;
							right: 0px;
							font-weight: bold;
							text-align: right;

							i {
								color: white;
								font-weight: bold;
							}
						}
					}

					div {
						width: 175px;
						font-size: 14px;
						text-align: left;

						.introduce {
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							cursor: pointer;
						}

						span {
							margin-top: 5px;
							opacity: 0.8;
							cursor: pointer;

							&:hover {
								opacity: 1;
							}
						}

						p {
							font-size: 13px;
							color: darkgray;
							margin-top: 2px;
						}
					}
				}
			}

			.user-subscribers-list-second {
				margin-top: 20px;

				.user-subscribers-list-main {
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 100%;
					height: 90px;
					margin-left: -25px;
					flex: 1;
					cursor: pointer;

					&:hover {
						background-color: rgba(125, 125, 125, 0.1);
					}

					div {
						display: flex;
						align-items: center;

						div {
							position: relative;

							&:hover .icon-bofang {
								opacity: 1;
								transition: all 0.3s ease-in;
							}

							i {
								position: absolute;
								left: calc(50% - 5px);
								top: 18px;
							}

							img {
								width: 70px;
								height: 70px;
								border-radius: 4px;
								margin-left: 25px;
								cursor: pointer;
								vertical-align: middle;
							}
						}

						span {
							margin-left: 30px;
							opacity: 0.8;

							&:hover {
								color: black;
							}
						}

						&:nth-of-type(2) {
							color: darkgray;
							display: flex;
							justify-content: space-between;
							width: 50%;
							margin-right: 60px;
							text-align: left;
							font-size: 14px;

							span {
								width: 160px;

								&:nth-of-type(1),
								&:nth-of-type(3),
								&:nth-of-type(4) {
									width: 100px;
								}
							}
						}
					}
				}

				.differ {
					background-color: #F9F9F9;
				}
			}

			.user-subscribers-list-third {
				margin-top: 20px;

				.user-subscribers-most {
					display: flex;
					margin-bottom: 40px;

					.user-subscribers-left {
						img {
							width: 180px;
							height: 180px;
							border-radius: 8px;
							cursor: pointer;
						}
					}

					.user-subscribers-right {
						text-align: left;
						margin-left: 60px;

						.user-subscribers-top {
							span {
								font-size: 20px;
								font-weight: bold;
								cursor: pointer;
								opacity: 0.9;

								&:hover {
									opacity: 1;
								}
							}

							i {
								font-size: 22px;
								font-weight: bold;
								cursor: pointer;
								opacity: 0.8;

								&:nth-of-type(1) {
									margin: 0 20px;
								}

								&:hover {
									opacity: 1;
								}
							}
						}

						.differ {
							background-color: #F9F9F9;
						}

						.user-subscribers-bottom {
							margin-top: 10px;

							.user-subscribers-bottom-list {
								width: 890px;
								align-items: center;
								display: flex;
								height: 30px;
								color: darkgray;
								border-radius: 4px;
								cursor: pointer;

								span,
								i {
									margin-left: 15px;
								}

								.icon-xihuan1 {
									color: black;
									font-size: 17px;
									opacity: 0.4;
									cursor: pointer;

									&:hover {
										opacity: 0.8;
									}
								}

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
									margin-left: 6px;
									cursor: pointer;
								}

								.time {
									position: absolute;
									right: 160px;
								}

								&:hover {
									background-color: rgba(125, 125, 125, 0.2);
								}
							}
						}
					}
				}
			}
		}
	}
</style>
