<template>
	<view>
		<Search searchFlag="true" />
		<view class="search-head">
			<view class="search-title">
				<text>最近搜索</text>
			</view>
			<view class="search-clear" @click="show = true;">
				<uni-icons custom-prefix="iconfont" type="icon-shanchu" size="28rpx" color="#777"></uni-icons>
			</view>
		</view>
		<view class="keyList">
			<view class="keyItem" v-for="(item,index) in historySearch" :key="index">
				<view class="keyInfo" @click="onKeyword(item)">
					<text>{{item}}</text>
				</view>
			</view>
		</view>
		<u-modal :show="show" content="是否清除所有搜索记录!" :zoom="false" showCancelButton @confirm="clearSearch"
			:asyncClose="true" @cancel="show=false">
		</u-modal>
	</view>
</template>

<script>
	import Search from '@/components/common/Search.vue'
	import storage from '@/util/storage'
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				show: false
			}
		},
		computed: {
			...mapGetters([
				'historySearch'
			])
		},
		methods: {
			onKeyword(keyword) {
				let newSearch = []
				let {
					historySearch
				} = this
				newSearch = this.findKeyWord(keyword)
				this.$store.dispatch('setHistorySearch', newSearch)
				this.goGoodsList(keyword)
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
			clearSearch() {
				this.$store.dispatch('clearHistorySearch')
				this.$Toast('清除成功！')
				this.show = false
			}
		},
		components: {
			Search
		},
		onShow() {
			this.$store.commit('SETHISTORYSEARCH', storage.get('historySearch') ? storage.get('historySearch') : [])
		},

	}
</script>

<style scoped>
	.search-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		margin: 40rpx 0 30rpx 0;
	}

	.search-title {
		font-size: 28rpx;
		color: #777;
	}

	.keyList {
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		padding: 0 20rpx;

	}

	.keyItem {
		box-sizing: border-box;
		width: 33.3%;
		padding: 14rpx;
	}

	.keyInfo {
		box-sizing: border-box;
		background-color: #fff;
		padding: 14rpx;
		text-align: center;
		font-size: 26rpx;
		color: #303133;
		border-radius: 100rpx;
		white-space: nowrap;
		overflow: hidden;
		border: 1rpx solid #efefef;
		text-overflow: ellipsis;
	}
</style>
