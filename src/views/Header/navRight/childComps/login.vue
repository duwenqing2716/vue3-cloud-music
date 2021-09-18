<template>
	<div class="login" is-link @click="showPopup">
		<img src="../../../../assets/img/test.b66d0610.jpg" alt="" id="login">
		<div style="display: inline-block">
			<span>未登录</span>
			<i class="iconfont icon-sanjiao_xia"></i>
		</div>
	</div>
	<van-popup 
	v-model:show="show" 
	closeable 
	:close-on-click-overlay='false' 
	style="width: 380px;height: 600px;" 
	@close='onClose'>
		<div class="scan" v-if="state.isQRcode">
			<p style="color: black;font-size: 24px;margin-top: 60px;">扫码登录</p>
			<div class="qrcode">
				<div class="wrap" v-show="isRefresh">
					<span>二维码已经失效</span>
					<p @click="onRefresh">点击刷新</p>
				</div>
				<canvas id="canvas"></canvas>
				<p>使用<span>网易云音乐APP</span>扫码登录</p>
				<span class="other-modes" @click="state.isQRcode=!state.isQRcode">选择其他登录模式 ></span>
			</div>
		</div>
		
		<div class="other-scan" v-else-if='currentStep === 0'>
			<keep-alive>
			  <other-login @onChangeModes='onChangeModes' @onSuccessLogin='onSuccessLogin' @currentStep='addStep'></other-login>
			</keep-alive>
		</div>
		<div class="regist" v-show='currentStep === 1'>
			<regist @currentStep='addStep' @reLogin='subtractStep'></regist >
		</div>
		<div class="verify" v-show='currentStep === 2'>
			<verify @backLogin='subtractStep' @onVerify='addStep' @onSuccess='onSuccessLogin'></verify>
		</div>
		<div class="initProfile" v-show='currentStep === 3'>
			<init-profile @backLogin='subtractStep' @onSuccess='onSuccessLogin'></init-profile>
		</div>
	</van-popup>
</template>

<script>
	// 组件库
	import {
		Popup,
		Toast
	} from 'vant';
  
	//第三方组件库:二维码渲染
	import QRcode from 'qrcode';
  
	//组件引入
  import otherLogin from './otherLogin.vue'
	import regist from './regist.vue'
	import verify from './verify.vue'
	import initProfile from './initProfile.vue'
  
	//vue功能
	import {
		ref,
		onMounted,
		reactive,
		watch,
		onUpdated,
		nextTick,
		getCurrentInstance
	} from 'vue';
  
	//接口引入
	import {
		getQRCode,
		getQRImage,
		checkImage,
		refreshLogin
	} from '../../../../network/login.js'
	
	export default {
		name: 'login',
		components: {
      otherLogin,
			regist,
			verify,
			initProfile
		},
		setup(props, context) {
			const show = ref(false);
			const currentStep = ref(0);
			const isRefresh = ref(false);
			const timerstamp = ref(null)
			
			const state = reactive({
				isQRcode: true,
				unikey: null,
				timer: null,
				userData: {}
			})
     
		  //展示弹出并发送请求获取key
			const showPopup = () => {
				show.value = true;
				// Toast.loading('加载中...')
				getQRCode(timerstamp.value || Date.now()).then(res => {
					// console.log(res.data.unikey,'key')
					state.unikey = res.data.unikey
				})
			}
			
			//上一步 功能待优化
			const addStep = () =>{
				currentStep.value++
				console.log('++',currentStep.value)
			}
			
			//下一步 功能待优化
			const subtractStep = () =>{	
				currentStep.value--
				console.log('--',currentStep.value)
			}
      
			//长轮询监听二维码是否失效 缺少功能:不同报错时的处理
			const longPoll = () => {
				if (state.timer) {
					clearTimeout(state.timer)
				}
				// console.log('长轮询开始')
				checkImage(state.unikey, Date.now()).then(res => {
					// console.log(res)
					if (res.code === 801) {
						// console.log(res.message)
					}
					if (res.code === 802) {
						// console.log(res.message)
					}
					if (res.code === 803) {
						// console.log(res)
						return state.userData = res.cookie
					}
					if (res.code === 800) {
						isRefresh.value = true;
						// console.log(res.message)
						return
					}
					state.timer = setTimeout(() => {
						longPoll()
					}, 2000)
				})
			}
      
			//二维码失效刷新 功能未完善
			const onRefresh = () => {
				refreshLogin(Date.now()).then(res => {
					console.log('登录刷新', res)
				})
			}
			
			//关闭并清空长轮询timer定时器
			const onClose = () => {
				clearTimeout(state.timer)
				state.timer = null
			}
			
			//关闭弹出层返回原页面
			const onSuccessLogin = () => {
				// console.log('登录成功并关闭')
				show.value = false;
			}
			
			//切换二维码与登录页
			const onChangeModes = () => {
				state.isQRcode=!state.isQRcode
			}
			
			//监听key值更新请求二维码并实时渲染在canvas中
			watch(() => state.unikey, (newValue, oldValue) => {
				// console.log(newValue)
				getQRImage(state.unikey, Date.now()).then(res => {
					let canvas = document.getElementById('canvas')
					// console.log(res.data.qrurl)
					QRcode.toCanvas(canvas, res.data.qrurl, err => {
						if (err) {
							console.log('渲染图片失败')
							return err
						}
					})
				})
				longPoll()
			})
			
			//切换二维码与登录页时，关闭并清空长轮询timer定时器
			watch(() => state.isQRcode, (newValue, oldValue) => {
				if (state.isQRcode) {
					showPopup()
				} else {
					clearTimeout(state.timer)
					state.timer = null
				}

			})

			return {
				currentStep,
				isRefresh,
				state,
				show,
				showPopup,
				onRefresh,
				onClose,
				onChangeModes,
				onSuccessLogin,
				addStep,
				subtractStep
			};
		}
	}
</script>

<style lang="less" scoped="scoped">
	.login {
		height: 100%;
		margin-right: 30px;
		cursor: pointer;

		&:hover {
			font-weight: bold;
		}

		img {
			vertical-align: middle;
			width: 35px;
			margin-right: 10px;
			border-radius: 50%;
		}
	}

	.scan {
		color: black;
		height: 400px;

		span {
			font-size: 14px;
		}

		.qrcode {
			font-size: 14px;

			.wrap {
				width: 180px;
				height: 180px;
				background-color: rgba(0, 0, 0, 0.7);
				color: aliceblue;
				position: absolute;
				left: 25%;
				font-weight: bold;

				span {
					display: block;
					color: aliceblue;
					margin-top: 10px;
				}

				p {
					width: 75px;
					height: 16px;
					font-size: 13px;
					line-height: 16px;
					cursor: pointer;
					border-radius: 15px;
					background-color: royalblue;
					padding: 8px;
					margin-left: 25%;
					margin-top: 25px;
				}
			}

			span {
				color: royalblue;
				cursor: pointer;
			}
		}

		.other-modes {
			font-size: 12px;
			cursor: pointer;
		}
	}
</style>
