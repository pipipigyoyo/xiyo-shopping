<template>
	<view>
		<Empty mode="car" v-if="!isLogin||!cartList.length" />
		<shoppingCar v-else :cartList='cartList' :cartTotal.sync='cartTotal' @refreshPage="refreshPage" />
	</view>
</template>

<script>
	import Empty from '@/components/common/Empty.vue'
	import shoppingCar from '@/pages/cart/shoppingCart/index.vue'
	import {
		checkLogin
	} from '@/core/app.js'
	import {
		reqCartList
	} from '@/api/cart.js'
	export default {
		data() {
			return {
				cartList: [],
				cartTotal: 0,
				isLogin: false
			}
		},
		components: {
			Empty,
			shoppingCar
		},
		methods: {
			refreshPage() {
				this.$loadingToast('加载中', () => {
					this.isLogin = checkLogin()
					this.getPageData()

				})
			},
			getCartList() {
				const that = this
				return new Promise((reject, resolve) => {
					!that.isLogin ? resolve(null) : reqCartList().then(res => {
						that.cartList = res.data.list
						that.cartTotal = res.data.cartTotal
						reject(res)
					}).catch(e => {
						resolve(e)
					})
				})
			},
			getPageData() {
				Promise.all([this.getCartList()]).catch(e => {
					console.log(e.methods);
				}).finally(() => {
					uni.hideLoading()
				})
			}
		},
		onShow() {
			this.refreshPage()
		}

	}
</script>

<style>

</style>
