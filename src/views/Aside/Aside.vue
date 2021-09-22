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
					<i class="iconfont icon-download"></i>
					<span>本地与下载</span>
				</template>
			</van-sidebar-item>
			<van-sidebar-item>
				<template #title>
					<i class="iconfont icon-zuijinbofang"></i>
					<span>最近播放</span>
				</template>
			</van-sidebar-item>
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
				  <i class="iconfont icon-xihuan1"></i>
					<span>我喜欢的音乐</span>
					<button>
						<i class="iconfont icon-xihuan"></i>
					</button>
			  </template>
			</van-sidebar-item>
			</div>
		</van-sidebar>
	</div>
</template>

<script>
	import { ref,onMounted,watch } from 'vue';
	import { getItem } from '../../store/storage.js'
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
		components:{
			
		},
		setup(props,context){
			const active = ref(0);
			const theme = ref(null);
			const isShowIcon = ref(true);
			
			const onCreateList = () => {
				isShowIcon.value = !isShowIcon.value
			}
			
			//挂载时更改内容,
			onMounted(()=>{
				//判断本地是否有换肤值
				if(getItem('theme')){
					theme.value = getItem('theme').theme
					document.body.style.setProperty('--van-sidebar-selected-border-color',theme.value)
				}
			})
			
			//监听是否换肤,并更改less中的变量
			watch(()=>props.theme,(newValue,oldValue)=>{
				document.body.style.setProperty('--van-sidebar-selected-border-color',newValue)
			})
			
			return { 
				active,
				onCreateList,
				isShowIcon
			};
		}
	}
</script>

<style lang="less" scoped="scoped">
	.cloud-aside{
		width: 300px;
		height: 600px;
		position:fixed;
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
				font-size: 18px;
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
	}
	
</style>
