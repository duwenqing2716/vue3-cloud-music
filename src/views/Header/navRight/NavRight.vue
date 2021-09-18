<template>
	<div class="nav-right">
			<login></login>
			<div class="vip">
				<span>开通VIP</span>
			</div>
			<div class="icons">
				<i class="iconfont icon-yifu"></i>
				<i class="iconfont icon-shezhi"></i>
				<i class="iconfont icon-youjian"></i>
			</div>
	</div>
</template>

<script>
  import login from './childComps/login.vue'
	export default {
		name: 'navRight',
		components: {
      login,
		},
		setup() {
			 return {
			 };
		}
	}
</script>

<style lang="less" scoped="scoped">
	.nav-right{
		height: 100%;
		// width: 600px;
		display: flex;
		font-size: 14px;
		
		.icons{
			margin-left: 20px;
		  i{
			  font-size: 28px;
			  margin: 0 8px;
		  }
		}
	}
	
</style>
