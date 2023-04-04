import Vue from 'vue'
import Vuex from 'vuex'

import index from '@/store/modules/index.js'
import user from '@/store/modules/user.js'
import search from '@/store/modules/search.js'


Vue.use(Vuex)
export default new Vuex.Store({
	modules: {
		index,
		user,
		search
	}
})
