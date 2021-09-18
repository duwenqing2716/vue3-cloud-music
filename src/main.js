import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//事件总线与provide二者共存多余了
import mitt from 'mitt';//引入mitt

const emitter = mitt();  

const app = createApp(App);

app.config.globalProperties.$bus = new mitt()
app.provide('emitter', emitter);  

import Vant from 'vant';
import 'vant/lib/index.css';

import './assets/css/index.less' //后者覆盖前者,因此最好将全局放在第三方后面

app.use(store).use(router).use(Vant).mount('#app')
