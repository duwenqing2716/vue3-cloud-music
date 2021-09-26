import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '../views/CloudMuisc.vue'
import Article from '../views/Article/Article.vue'
import Footer from '../views/footer.vue'

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
		      component:Footer
		    },
				{
					path: '/home/profile',
					component: Article
				}
	  ]
	}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
