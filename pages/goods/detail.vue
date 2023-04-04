<!-- 中文 -->
<template>
	<view class="detail">
		<Swiper :data="goods_images" :height="screenWidth*2" :showImageCount="true" />
		<goodsInfo :data="data" />
		<goodsSku :data="data" :clickAddcart="clickAddcart" :clickAddorder="clickAddorder"
			@getCartTotal="getCartTotal" />
		<Service :goodsId="goodsId" />
		<view class="goodsDes">
			<Title content="<p>商品描述</p>" :style="style" />
		</view>
		<view class="goodsDesContent" v-if="data.content">
			<u-parse :content="data.content" @navigate="navigate"></u-parse>
		</view>
		<view class="goodsNav">
			<view class="goods-carts">
				<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
					@buttonClick="buttonClick" />
			</view>
		</view>
	</view>
</template>

<script>
	import Swiper from '@/components/common/Swiper.vue'
	import goodsInfo from '@/components/goodsInfo/goodsInfo.vue'
	import Service from '@/components/goodsInfo/Service.vue'
	import Title from '@/components/common/Title.vue'
	import indexImage from '@/components/common/indexImage.vue'
	import goodsSku from '@/components/goodsInfo/goodsSku.vue'
	import {
		reqCartTotal
	} from '@/api/cart.js'
	export default {
		data() {
			return {
				goodsId: 0,
				data: {},
				goods_images: [],
				style: {
					paddingLeft: 30
				},
				screenWidth: 0,
				clickAddcart: 0,
				clickAddorder: 0,
				options: [{
					icon: 'home',
					text: '首页',
					infoBackgroundColor: '#5c5d5e',
				}, {
					icon: 'cart',
					text: '购物车',
					infoBackgroundColor: '#ff0000',
					info: null,
				}],
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#ffa200',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ff0000',
						color: '#fff'
					}
				]
			}
		},
		components: {
			Swiper,
			goodsInfo,
			Service,
			Title,
			indexImage,
			goodsSku
		},
		methods: {
			async getGoodsDetail() {
				let {
					goodsId
				} = this
				try {
					const result = await this.$myrequest({
						params: {
							s: '/api/goods/detail',
							goodsId
						}
					})
					this.data = result.data.detail
					this.data.goods_images.forEach(item => {
						this.goods_images.push({
							imgUrl: item.external_url
						})
					})
					this.getSystemWidth()
				} catch (e) {
					this.$errorToast(e.message)
				}
			},
			async getCartTotal() {
				try {
					const result = await reqCartTotal()
					this.options.forEach(item => {
						if (item.text === '购物车') {
							item.info = result.data.cartTotal
						}
					})
				} catch (e) {
					this.$Toast(e.message)
				}
			},
			getSystemWidth() {
				const that = this
				uni.getSystemInfo({
					success({
						screenWidth
					}) {
						that.screenWidth = screenWidth
					}
				})
			},
			navigate(e) {
				uni.redirectTo({
					url: '/' + e
				})
			},
			onClick({
				content
			}) {
				content.text === "首页" ? uni.switchTab({
					url: '/pages/index/index'
				}) : uni.switchTab({
					url: '/pages/cart/index'
				})
			},
			buttonClick({
				content
			}) {
				content.text === "加入购物车" ? this.clickAddcart++ : this.clickAddorder++
			}
		},
		onLoad(option) {
			this.goodsId = option.goodsId
		},
		mounted() {
			this.getGoodsDetail()
			this.getCartTotal()
		}
	}
</script>

<style scoped>
	.goodsDes {
		height: 90rpx;
		line-height: 90rpx;
	}

	.goodsDesContent {
		background-color: #ffffff
	}

	.goodsDesContent>>>.img {
		vertical-align: bottom;
	}


	.goodsNav {
		height: 100rpx;
		width: 100%;
	}

	.goods-carts {
		/* #ifndef APP-NVUE */
		display: flex;

		/* #endif */
		flex-direction: column;
		position: fixed;
		left: 0;
		right: 0;
		/* #ifdef H5 */
		left: var(--window-left);
		right: var(--window-right);
		/* #endif */
		bottom: 0;
	}
</style>
