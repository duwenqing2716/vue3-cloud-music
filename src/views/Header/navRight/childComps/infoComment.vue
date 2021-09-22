<template>
	<div>	
	  	<div class="email-header">
	  		<span class="aside" style="margin-left:-30px;">消息</span>
				<span style="width: 170px;"></span>
	  		<span class="aside">一键已读</span>
	  	</div>
	  	<van-tabs v-model:active="active" type="card">
	  	  <van-tab title="私信">
					<div>
					<div class='dot' style="position: absolute;top: 62%;left:14px;width: 10px;height: 10px;background-color: red;z-index: 1;border-radius: 50%;"></div>
					<div class="infoList" style="position: absolute;left: 30px;top:45px;width: 40px;z-index: 1;">
						<img src="../../../../assets/img/logo.png" alt="" style="width: 40px;height: 40px;border-radius:50%;">
					</div>
					<van-cell style="margin-left: 60px;width: 340px;">
					  <!-- 使用 title 插槽来自定义标题 -->
					  <template #title>
					    <span class="custom-title">单元格</span>
					  </template>
						<template #label>
							<span>您有一笔云贝即将过期</span>
						</template>
						<template #value>
							<span>8月11日</span>
						</template>
					</van-cell>
					</div>
				</van-tab>
	  	  <van-tab title="评论">
				</van-tab>
	  	  <van-tab title="@我"></van-tab>
	  	  <van-tab title="通知"></van-tab>
	  	</van-tabs>
	</div>
</template>

<script>
	//vue功能引入
	import { ref,reactive,onMounted,computed } from 'vue'
	import { privateInfo } from '../../../../network/infoMsg.js'
	import { useStore,mapState } from 'vuex'
	import { getItem } from '../../../../store/storage.js'
	export default{
		name:'infoComment',
		components:{
			
		},
		props:{
			
		},
		setup(){
			const store = useStore();
			const active = ref(0);
			const uid = ref(null);
			
			// const uid = computed(() => ({
   //    ...mapState(['userData'])
   //  })).value.userData.bind({ $store: store })
		
			onMounted(async()=>{
				uid.value = store.getters.getUserId
				privateInfo({uid:uid.value,timestamp:Date.now()}).then( res => {
					console.log(res)
				})
			})
			return { 
				active
			};
		}
	}
</script>

<style lang="less" scoped="scoped">
	.email-header{
		display: flex;
		height: 40px;
		.aside{
			flex: 1;
			text-align: center;
			line-height: 40px;
			font-size: 18px;
		}
	}
</style>
