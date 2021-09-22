<template>
	<div>
		<Header @onThemeChange='onThemeChange'></Header>
		<Aside :theme='state.theme'></Aside>
		<Article></Article>
	</div>
</template>

<script>
	import Header from './Header/Header.vue'
	import Aside from './Aside/Aside.vue'
	import Article from './Article/Article.vue'
	
	//vue功能引入
	import { ref,reactive } from 'vue'
	export default{
		name:'CloudMuisc',
		props:{
			
		},
		components:{
			Header,
			Aside,
			Article
		},
		setup(){
			const state = reactive({
				theme:''
			})
			const onThemeChange = (color) => {
				state.theme = color
				// console.log(state.theme,typeof state.theme,color)
			}
			return {
				state,
				onThemeChange
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	
</style>
