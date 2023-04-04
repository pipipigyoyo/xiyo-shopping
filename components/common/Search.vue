<template>
	<view class="search" @click="toSearch">
		<u-search v-model="searchValue" bgColor="#ffffff" :shape="shape" :placeholder="placeholder" :clearabled="true"
			:inputAlign="inputAlign" :disabled="!flag" :showAction="false"></u-search>
		<button type="warn" class="search-btn" v-if="flag" @click="goSearch">搜索</button>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		reqGoodsList
	} from '@/api/goods.js'
	export default {
		data() {
			return {
				searchValue: "",
				flag: false
			}
		},
		computed: {
			...mapGetters([
				'historySearch'
			])
		},
		/* options: {
			styleIsolation: 'shared'
		}, */
		props: {
			searchFlag: {
				type: Boolean,
				default: () => false
			},
			placeholder: {
				type: String,
				default: () => '搜索商品'
			},
			shape: {
				type: String,
				default: () => 'square'
			},
			inputAlign: {
				type: String,
				default: () => 'left'
			}
		},
		methods: {
			toSearch() {
				if (this.flag) return
				uni.navigateTo({
					url: '/pages/search/search'
				})
			},
			goSearch() {
				let newSearch = []
				let {
					searchValue,
					historySearch
				} = this
				if (!searchValue) {
					this.$Toast('内容不能为空')
					return
				}
				searchValue = searchValue.trim()
				if (historySearch.length) {
					if (historySearch.indexOf(searchValue) !== -1) {
						newSearch = this.findKeyWord(searchValue)
					} else {
						historySearch.unshift(searchValue)
						newSearch = historySearch
					}
				} else {
					newSearch.push(searchValue)
				}
				this.$store.dispatch('setHistorySearch', newSearch)
				this.goGoodsList(searchValue)
			},
			goGoodsList(keyword) {
				uni.navigateTo({
					url: `/pages/goodsList/index?goodsName=${keyword}`
				})
			},
			findKeyWord(keyword) {
				let {
					historySearch
				} = this
				historySearch.map((item, index) => {
					if (item === keyword) {
						historySearch.unshift(historySearch.splice(index, 1)[0]);
					}
				})
				return historySearch
			},
		},
		mounted() {
			this.flag = this.searchFlag
		}

	}
</script>

<style scoped>
	.search {
		height: 100rpx;
		display: flex;
		padding: 0 20rpx;
		align-items: center;
	}

	.search-btn {
		height: 60rpx;
		width: 140rpx;
		line-height: 60rpx;
		margin: 0;
		font-size: 28rpx;
		border-radius: 0 10rpx 10rpx 0
	}
</style>
