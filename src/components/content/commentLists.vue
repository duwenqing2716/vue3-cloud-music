<template>
	<div class="commentList">
    <van-cell-group inset class="input">
      <van-field
        v-model="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="140"
        :placeholder="replay"
        show-word-limit
				ref='input'
      />
    </van-cell-group>
		<button class="comment-btn" @click="sendComt">评论</button>
		<div class="comment-content">
			<span class="comment-content-title">精彩评论</span>
			<div class="content-list" v-for="(item,index) in commentList">
				<div>
					<img :src="item.user.avatarUrl" alt="">
				</div>
				<div>
					<van-cell class="comment-details">
						<template #title>
							<p>
								<span>{{item.user.nickname}}: </span>
							  {{item.content}}
							</p>
							<p v-if="item.parentCommentId" style="width: 100%;height: 40px;background-color: rgba(125,125,125,0.1);border-radius: 8px;line-height: 40px;padding-left: 10px;"><span>@{{othersName[item.commentId]}}: </span>{{othersContent[item.commentId]}}</p>
						</template>
						<template #label>
							<span>{{compare(item.time)}}</span>
						</template>
					</van-cell>
				</div>
				<div>
					<span class="report">举报</span>
					<i class="iconfont icon-dianzan" id="zan" @click="onLike(item.commentId,1,index,0)" v-show="!item.liked">({{item.likedCount}})</i>
					<i class="iconfont icon-dianzan_kuai" id="zan" @click="onLike(item.commentId,0,index,0)" v-show="item.liked" style='color:#EC4141'>({{item.likedCount}})</i>
					<i class="iconfont icon-zhuanfa" @click="Toast('功能未开发')"></i>
					<i class="iconfont icon-pinglun" @click="onComment(item)"></i>
				</div>
			</div>
		</div>
		<div class="comment-content" style="margin-top: 40px;">
			<span class="comment-content-title">最新评论({{totalNums}})</span>
			<div class="content-list" v-for="(item,index) in newList">
				<div>
					<img :src="item.user.avatarUrl" alt="">
				</div>
				<div>
					<van-cell class="comment-details">
						<template #title>
							<p>
								<span>{{item.user.nickname}}: </span>
							  {{item.content}}
							</p>
							<p v-if="item.parentCommentId" style="width: 100%;background-color: rgba(125,125,125,0.1);border-radius: 8px;line-height: 40px;padding-left: 10px;"><span>@{{othersName[item.commentId]}}: </span>{{othersContent[item.commentId]}}</p>
						</template>
						<template #label>
							<span>{{compare(item.time)}}</span>
						</template>
					</van-cell>
				</div>
				<div>
					<span class="report">举报</span>
					<i class="iconfont icon-dianzan" @click="onLike(item.commentId,1,index,1)" v-show="!item.liked">({{item.likedCount}})</i>
					<i class="iconfont icon-dianzan_kuai" @click="onLike(item.commentId,0,index,1)" v-show="item.liked" style='color:#EC4141'>({{item.likedCount}})</i>
					<i class="iconfont icon-zhuanfa" @click="Toast('功能未开发')"></i>
					<i class="iconfont icon-pinglun" @click="onComment(item)"></i>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { ref,onMounted } from 'vue';
	import { hotComment,likeComment,parentComment,playlistComment,sendComment } from '../../network/songs.js'
	//vuex功能引入
	import{ useStore } from 'vuex'
	import { debounce } from '../../common/debounce.js'
	import { Toast } from 'vant'
	export default {
		name:'commentLists',
		props:{
			listId:{
				type:String,
				required:true,
				default(){
					return null
				}
			}
		},
		setup(props,context){
			const store = useStore();
			
			const message = ref('');
			const commentList = ref([]);
			const cursor = ref(null);
			const totalNums = ref(null);
			const newList = ref([]);
			const time = ref(null);
			const statusOnce = ref(true);
			const statusFirst = ref(null);
			const preCommentId = ref(null);
			const othersContent = ref({});
			const othersName = ref({});
			const replay = ref('请输入您的评论内容!');
			const input = ref(null);
			const commentId = ref(null);
			//日期格式化
			const compare = (val) => {
				const date =new Date(val)
				return date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日 '+date.getHours()+':'+date.getMinutes()
			}
			//发送点赞功能请求
			const getLikeComment = async(id,val,status,num,time) => {
				const res = await likeComment(id,val,status,num,time)
			}
			// 1 为点赞 ,0 为取消点赞
			const onLike = async(val,status,index,type) => {
				// 判断登录状态
				if(store.state.isLogin){
					// if(statusOnce.value){
					// 	statusFirst.value = !status
					// 	statusOnce.value = false
					// }
					// console.log(preCommentId.value,val)
					if (time.value && preCommentId.value == val) {
						clearTimeout(time.value)
					}
					preCommentId.value = val
					//进一步优化方法:是否与第一次status相同，相同则不发请求 逻辑容易交错 不做
					time.value = setTimeout(() => {
						// if(preCommentId.value == val&&status == statusFirst.value) return
						getLikeComment(props.listId,val,status,2,Date.now())
						// if(preCommentId.value == val) statusFirst.value = status
					}, 500)
					
				if(type){
					if(status==1){
						newList.value[index].liked = true
						newList.value[index].likedCount++
					}else{
						newList.value[index].liked = false
						newList.value[index].likedCount--
					}
				}else{
					if(status==1){
						commentList.value[index].liked = true
						commentList.value[index].likedCount++
					}else{
						commentList.value[index].liked = false
						commentList.value[index].likedCount--
					}
				}
				}else{
					Toast({
						message:'请登录后再操作！'
					})
				}
			}
			//发送评论 
			const sendComt = async() => {
				if(commentId.value){
					t=2
				}else{
					t=1
				}
				// const res = await sendComment(t,2,props.listId,message.value,commentId.value,Date.now())
				console.log(res)
			}
			//点击评论按钮
			const onComment = (val) => {
				commentId.value = ''
				replay.value = '回复 '+val.user.nickname+' :'
				input.value.focus()
				commentId.value = val.commentId
			}
			//获取回复楼层数据
			const getParentCommentId = async(val,item) => {
				const { data } = await parentComment(val,props.listId,2,1,Date.now())
				othersContent.value[item.commentId] = data.ownerComment.content
				othersName.value[item.commentId] = data.ownerComment.user.nickname
			}
      //挂载时
			onMounted(async()=>{
				input.value.focus()
				//热评数据
				const res = await hotComment(props.listId,2,10,1,Date.now())
				commentList.value = res.hotComments
				commentList.value.filter(item=>{
					if(item.parentCommentId) getParentCommentId(item.parentCommentId,item)
				})
				//新评数据
				const resData = await playlistComment(props.listId,30,1,Date.now())
				newList.value = resData.comments
				newList.value.filter(item=>{
					if(item.parentCommentId) getParentCommentId(item.parentCommentId,item)
				})
				totalNums.value = resData.total
			})
			return{
				message,
				commentList,
				compare,
				newList,
				cursor,
				totalNums,
				onLike,
				getLikeComment,
				statusOnce,
				statusFirst,
				preCommentId,
				getParentCommentId,
				othersContent,
				othersName,
				onComment,
				replay,
				input,
				sendComt
			}
		}
	}
</script>

<style scoped lang="less">
  .commentList{
		position: relative;
		.input{
			border: 1px solid darkgray
		}
		.comment-btn{
			width: 80px;
			height: 40px;
			background-color: transparent;
			border: 1px solid lightgray;
			border-radius: 20px;
			font-size: 17px;
			position: absolute;
			right: 15px;
			margin-top: 20px;
			cursor: pointer;
			&:hover{
				background-color: rgba(125,125,125,0.1);
			}
		}
		.comment-content{
			margin-top: 80px;
			width: 100%;
			margin-left: 15px;
			text-align: left;
			.comment-content-title{
				font-size: 22px;
				font-weight: bold;
			}
			.content-list{
				display: flex;
				align-items: center;
				border-bottom: 1px solid darkgray;
				position: relative;
				&:hover .report{
					opacity: 0.8;
				}
				.report{
					margin-right: 10px;
					cursor: pointer;
					font-size: 14px;
					opacity: 0;
					&:hover{
						opacity: 1;
					}
				}
				div{
					img{
						width: 50px;
						height: 50px;
						border-radius: 50%;
						display: block;
						cursor: pointer;
					}
					&:nth-child(2){
						flex: 1;
						.comment-details{
							p{
								max-width: 800px;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 3;
								-webkit-box-orient: vertical;
								font-size: 15px;
								span{
									color: darkblue;
									cursor: pointer;
									opacity: 0.7;
									&:hover{
										opacity: 1;
									}
								}
							}
							span{
								font-size: 14px;
							}
						}
					}
					&:nth-child(3){
						// margin-right: 30px;
						position: absolute;
						right: 10px;
						bottom: 10px;
						i{
							font-size: 20px;
							cursor: pointer;
						}
						.icon-zhuanfa{
							margin: 0 20px;
						}
					}
				}
			}
		}
	}
</style>
