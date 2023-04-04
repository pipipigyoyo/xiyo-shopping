<template>
	<view class="show">
		<view class="header">
			<view class="search">
				<Search shape="round" inputAlign="center" />
			</view>
			<view class="list-icon" @click="showChage">
				<uni-icons custom-prefix="iconfont" type="icon-liebiao" size="36rpx" v-if="column===2"></uni-icons>
				<uni-icons custom-prefix="iconfont" type="icon-liebiao1" size="36rpx" v-else></uni-icons>
			</view>
		</view>
		<view class="nav">
			<u-row>
				<u-col span="4" textAlign="center" @click="sortChage('all')">
					<text :class="sortType==='all'?'curNar':''">综合</text>
				</u-col>
				<u-col span="4" textAlign="center" @click="sortChage('sales')">
					<text :class="sortType==='sales'?'curNar':''">销量</text>
				</u-col>
				<u-col span="4" textAlign="center" @click="sortChage('price')">
					<view :class="sortType==='price'?'curNar':''">
						<text class="nav-price">价格</text>
						<uni-icons custom-prefix="iconfont" type="icon-shangxia" size="24rpx"
							:color="sortType==='price'?'#e49a3d':'#000'"></uni-icons>
					</view>
				</u-col>
			</u-row>
		</view>
		<Goods :data="goodsList" :column="column" />
	</view>
</template>

<script>
	import {
		reqGoodsList
	} from '@/api/goods.js'
	import Search from '@/components/common/Search.vue'
	import Goods from '@/components/index/Goods.vue'
	export default {
		data() {
			return {
				categoryId: null,
				goodsList: [],
				column: 2,
				sortType: 'all',
				sortPrice: 1,
				goodsName: null
			}
		},
		components: {
			Search,
			Goods
		},
		methods: {
			async getGoodsList() {
				try {
					let {
						categoryId,
						sortType,
						sortPrice,
						goodsName
					} = this
					const result = await reqGoodsList({
						categoryId,
						sortType,
						sortPrice,
						goodsName
					})
					this.goodsList = result.data.list.data
				} catch (e) {
					this.$errorToast(e.message)
				}

			},
			showChage() {
				this.column === 2 ? this.column = 1 : this.column = 2
			},
			async sortChage(data) {
				if (this.sortType === data && this.sortType !== 'price') return
				this.sortType = data
				await this.getGoodsList()
				if (data !== 'price') {
					this.sortPrice = 1
					return
				}
				this.sortPrice === 0 ? this.sortPrice = 1 : this.sortPrice = 0
			}
		},
		onLoad(option) {
			option.categoryId ? this.categoryId = option.categoryId : this.categoryId = null
			option.goodsName ? this.goodsName = option.goodsName : this.goodsName = null
		},
		mounted() {
			this.getGoodsList()
		}

	}
</script>

<style scoped>
	.header {
		display: flex;
		align-items: center;
		padding-right: 20rpx;
	}

	.search {
		flex: 1;
	}

	.nav {
		padding: 10rpx;
		font-size: 28rpx
	}

	.nav-price {
		margin-right: 10rpx;
	}

	.curNar {
		color: #e49a3d;
	}
</style>
