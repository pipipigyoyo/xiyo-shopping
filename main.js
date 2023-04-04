import App from './App'
import myrequest from "@/util/request/request.js"
import store from "@/store/index.js"
import Initializer from '@/core/bootstrap.js'

// #ifndef VUE3
import Vue from 'vue'
import uView from '@/uni_modules/uview-ui'
import {
	successToast,
	Toast,
	errorToast,
	loadingToast
} from '@/core/app.js'
Vue.prototype.$myrequest = myrequest
Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$successToast = successToast
Vue.prototype.$Toast = Toast
Vue.prototype.$errorToast = errorToast
Vue.prototype.$loadingToast = loadingToast
App.mpType = 'app'
Vue.use(uView)
const app = new Vue({
	store,
	...App,
	created: Initializer
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
