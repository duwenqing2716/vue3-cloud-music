import { createStore } from 'vuex'
import { getItem,setItem,removeItem } from './storage.js'

const SEARCH_KEY = 'search-songs'

export default createStore({
  state: {
		user:getItem(SEARCH_KEY),
  },
  mutations: {
		setSongs(state,data){
			state.user = data
			setItem(USER_KEY,state.user)
		}
  },
  actions: {
  },
  modules: {
  }
})
