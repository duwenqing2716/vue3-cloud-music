import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '../views/CloudMuisc.vue'
import Article from '../views/Article/Article.vue'
import userBinding from '../components/content/userBinding.vue'
import recommendPage from '../views/Article/childComps/recommendPage.vue'
import songDetail from '../components/content/songDetail.vue'

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
					component: recommendPage
				},
				{
					path: '/home/profile',
					component: Article
				},
				{
					path: '/home/binding',
					component: userBinding
				},
				{
					path: '/home/songDetail',
					component: songDetail,
					props: route => ({
            id: route.query.id
          })
				}
	  ]
	}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
