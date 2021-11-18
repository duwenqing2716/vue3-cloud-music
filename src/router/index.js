import { createRouter, createWebHashHistory } from 'vue-router'

import Home from 'views/CloudMuisc.vue'
// import Article from 'views/Article/Article.vue'
// import userBinding from 'components/content/bind/userBinding.vue'
// import recommendPage from 'views/Article/childComps/recommendPage.vue'
// import songDetail from 'components/content/songDetail/songDetail.vue'
// import userDetail from 'components/content/profile/userDetail.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
	{
		path:'/home',
		name: 'home',
		component:Home,
		redirect:'/home/recommend',
		children: [
			  {
					path: '/home/recommend',
					component:() => import(/* webpackChunkName:'recommendPage'*/'views/Article/childComps/recommendPage.vue')
				},
				{
					path: '/home/recommendList',
					component:() => import(/* webpackChunkName:'recommendList'*/'components/content/songDetail/childComps/recommendList.vue')
				},
				{
					path: '/home/rank',
					component:() => import(/* webpackChunkName:'recentList'*/'components/content/songDetail/childComps/recentList.vue'),
				  props: route => ({
            id: route.query.id
          })
				},
				{
					path: '/home/profile',
					component:() => import(/* webpackChunkName:'Article'*/'views/Article/Article.vue')
				},
				{
					path: '/home/binding',
					component:() => import(/* webpackChunkName:'userBinding'*/'components/content/bind/userBinding.vue')	
				},
				{
					path: '/home/songDetail',
					component:() => import(/* webpackChunkName:'songDetail'*/'components/content/songDetail/songDetail.vue'),
					props: route => ({
            id: route.query.id
          })
				},
				{
					path: '/home/userDetail',
					component:() => import(/* webpackChunkName:'userDetail'*/'components/content/profile/userDetail.vue'),
					props: route => ({
				    id: route.query.id
				  })
				}
	  ]
	},
	{
		path:'/video',
		name: 'video',
		component:() => import(/* webpackChunkName:'video'*/'components/content/video/video.vue'),
		props: route => ({
		  id: route.query.id
		})
	}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
