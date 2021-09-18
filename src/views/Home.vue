<template>
	<div class="home">
		<van-row>
			<van-col span="4">
				<div class="icon">
					<img src="../assets/img/logo.47591c5c.png" alt="" @click="backHome">
				</div>
			</van-col>
			<van-col span="9" offset="2">
			  <search></search>
			</van-col>
			<van-col span="6" offset="3">
			  <nav-right></nav-right>
			</van-col>
		</van-row>
	</div>
</template>

<script>
	// @ is an alias to /src

	import Search from './Header/Search/Search.vue'
	import NavRight from './Header/navRight/NavRight.vue'

	export default {
		name: 'Home',
		components: {
			Search,
			NavRight
		},
		setup() {

			//声明变量类
			//声明方法类	
			const backHome = () => {
				router.replace({
					path: '/home'
				})
			}

			return {
				backHome
			};
		}
	}
</script>

<style lang="less" scoped="scoped">
	.home {
		height: 58px;
		background-color: #EC4141;
		line-height: 58px;
		color: white;
		font-size: 18px;
		.van-row,
		.van-col {
			height: 58px;
		}
		.icon {
			height: 100%;
			img {
				margin-top: 5px;
				margin-left: 20px;
				width: 70%;
				cursor: pointer;
			}
		}
	}
</style>
