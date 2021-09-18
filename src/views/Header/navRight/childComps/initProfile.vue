<template>
	<div>
		<div class="login-nav">
			<span class="change-modes" style="">
				<span @click="backLogin"> &lt 返回登录</span>
			</span>
			<img src="../../../../assets/img/111.jpg" alt="">
		</div>
		<span class="notice">取一个昵称,让大家记住你</span>
		<van-cell-group inset>
		  <van-field v-model="name" class="nicheng" left-icon="contact" label="昵称" placeholder="昵称不少于4个英文或2个汉字" />
		</van-cell-group>
		<div style="margin: 16px;">
		    <van-button block class="next" @click='onStart'>
		      开启云音乐
		    </van-button>
		</div>
	</div>
</template>

<script>
	//vue功能引入
	import { ref,getCurrentInstance } from 'vue';
	//组件库引入
	import{ Toast } from 'vant'
	//接口引入
	import { register } from '../../../../network/login.js'
	export default {
		name:'initProfile',
		setup(props,context){
			const internalInstance = getCurrentInstance();
			const $bus = internalInstance.appContext.config.globalProperties.$bus
			
			const name = ref('');
			const cellphone = ref('')
			const password = ref('')
			const verifyCode = ref('')
			//接收事件总线发送的信息
			$bus.on('onInit', val=> {
		    cellphone.value = val.cellphone,
			  password.value = val.password,
			  verifyCode.value = val.verifyCode
			})
			//注册成功操作
			const onStart = () =>{
				//注册接口
				register({
					phone:cellphone.value,
				  password:password.value,
				  captcha:verifyCode.value,
				  nickname:name.value}).then( res => {
					console.log(res)
					if(res.code === 505){
						Toast.fail({
							message:'该昵称被占用,注册失败',
							position:'top'
						})
						console.log('该昵称被占用,注册失败')
					}else if(res.code === 200){
						console.log('注册成功',res)
						context.emit('onSuccess')
					}else{
						console.log('未知原因,注册失败')
					}
				})
			}
			
			//发射事件返回登录页 功能未完善
			const backLogin = () =>{
				context.emit('backLogin')
			}
			
			return { 
				 name,
				 cellphone,
				 password,
				 verifyCode,
				 onStart,
				 backLogin
			};
		}
	}
</script>

<style lang="less" scoped>
	.login-nav{
		height: 215.3px;
		.change-modes{
			display: block;
			width: 200px;
			height: 60px;
			color: black;
			font-weight: bol;
			background-color:#FFFFFF;
			position: absolute;
			span{
				// display: block;
				position: absolute;
				left:20px;
				cursor: pointer;
			}
		}
		img{
			width: 380px;
		}
	}
	.van-cell-group{
		border: 1px solid black;
		margin-top: 20px;
	}
	
	.notice{
		color:darkgray;
	}
	.next{
		width: 78%;
		margin-top: 50px;
		margin-left: 40px;
		background-color:#EC4141;
		color: white;
		&:hover{
			background-color:#C72E2E;
		}
	}
</style>
