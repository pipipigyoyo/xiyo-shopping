<template>
	<view class="sku">
		<view class="sku-content" v-if="data.specList.length" @click="open('cartandorder')">
			<view class="skuList">
				<view class="choose">
					<text>选择：</text>
				</view>
				<view class="skuItem" v-for="item in data.specList" :key="item.spec_id">
					<text>{{item.spec_name}}</text>
				</view>
			</view>
			<view class="more">
				<uni-icons custom-prefix="iconfont" type="icon-gengduo" size="26rpx" color="#303133"></uni-icons>
			</view>
		</view>
		<u-popup :show="show" :round="10" :duration="100" @close="close">
			<view class="skuChoose">
				<view class="header">
					<view class="specification-left">
						<u--image :src="data.goods_image||''" width="180rpx" height="180rpx" :fade="false"></u--image>
					</view>
					<view class="specification-right">
						<view class="goods-price">
							<uni-icons custom-prefix="iconfont" type="icon-qianqian-" size="30rpx" color="#fa2209">
							</uni-icons>
							<text
								v-if="!selectGoodsPrice">{{data.goods_price_min===data.goods_price_max?data.goods_price_max:data.goods_price_min+' - '+data.goods_price_max}}</text>
							<text v-else>{{selectGoodsPrice}}</text>
						</view>
						<view class="goods-inventory">
							库存：<text
								v-if="!selectGoodsStock">{{stockMax===stockMin?stockMax:stockMin+' - '+stockMax}}</text>
							<text v-else>{{selectGoodsStock}}</text>
						</view>
						<view class="goods-choose">

						</view>
					</view>
					<view class="close" @click="close">
						<uni-icons class="chacha icon" custom-prefix="iconfont" type="icon-chacha" size="15"
							color="#909399"></uni-icons>
					</view>
				</view>
				<view class="spec" v-for="item in data.specList" :key="item.spec_id">
					<view class="spec-title">
						{{item.spec_name}}
					</view>
					<view class="specList">
						<view class="specItem" :class="currentIndex[item2.groupKey].key===item2.key?'cur':''"
							v-for="(item2,index) in item.valueList" :key="item2.spec_value_id"
							@click="onChooseSku(item2.groupKey,item2.key,item2.spec_value_id)">
							{{item2.spec_value}}
						</view>
					</view>
				</view>
				<view class="footer">
					<view class="footer-left">
						数量
					</view>
					<view class="footer-right">
						<u-number-box v-model="goods_num">
						</u-number-box>
					</view>
				</view>
				<view class="btn">
					<view class="cartAndOrder" v-if="btnShow==='cartandorder'">
						<u-button :custom-style="btn_cart" text="加入购物车" color="#ffb100" @click="addCart"></u-button>
						<u-button :custom-style="btn_order" text="立即购买" color="#fa2209"></u-button>
					</view>
					<view class="other" v-else>
						<u-button shape="circle" text="加入购物车" color="#ffb100" v-if="btnShow==='cart'" @click="addCart">
						</u-button>
						<u-button shape="circle" text="立即购买" color="#fa2209" v-else></u-button>
					</view>
				</view>
			</view>
		</u-popup>

	</view>
</template>

<script>
	import {
		reqAddCart
	} from '@/api/cart.js'
	import {
		checkLogin
	} from '@/core/app.js'
	export default {
		data() {
			return {
				stockMin: null,
				stockMax: null,
				show: false,
				goods_num: 1,
				btn_cart: {
					borderRadius: '100rpx 0 0 100rpx',
					width: '50%'
				},
				btn_order: {
					borderRadius: '0 100rpx 100rpx 0',
					width: '50%'
				},
				btnShow: null,
				currentIndex: [],
				selectGoodsStock: null,
				selectGoodsPrice: null
			}
		},
		props: {
			data: {
				type: Object,
				default: () => {}
			},
			clickAddcart: {
				type: Number,
				default: 0
			},
			clickAddorder: {
				type: Number,
				default: 0
			}
		},
		watch: {
			data: {
				deep: true,
				handler(v) {
					this.searchMin(v.skuList)
					this.searchMax(v.skuList)
				}
			},
			clickAddcart() {
				this.open("cart")
			},
			clickAddorder() {
				this.open("order")
			},
			currentIndex: {
				deep: true,
				handler(v) {
					if (this.currentIndex.length === this.data.specList.length && this.currentIndex.every(item => item !==
							undefined)) {
						let {
							stock_num,
							goods_price
						} = this.getGoodsSkuInfo()
						this.selectGoodsStock = stock_num
						this.selectGoodsPrice = goods_price
					}

				}
			}

		},
		methods: {
			searchMin(arr) {
				let min = arr[0].stock_num
				for (let i = 1; i < arr.length; i++) {
					if (arr[i].stock_num < min) {
						min = arr[i].stock_num
					}
				}
				this.stockMin = min
			},
			searchMax(arr) {
				let max = arr[0].stock_num
				for (let i = 1; i < arr.length; i++) {
					if (arr[i].stock_num > max) {
						max = arr[i].stock_num
					}
				}
				this.stockMax = max
			},
			close() {
				this.show = false
			},
			open(content) {
				this.btnShow = content
				this.show = true
			},
			onChooseSku(groupKey, key, id) {
				if (this.currentIndex[groupKey] && this.currentIndex[groupKey].key === key) return
				const arr = [...this.currentIndex]
				if (!arr.length) {
					arr[groupKey] = {
						groupKey,
						key,
						id
					}
					arr.fill(undefined, 0, groupKey)
				} else {
					arr.splice(groupKey, 1, {
						groupKey,
						key,
						id
					});
				}
				this.currentIndex = arr
			},
			async addCart() {
				if (!checkLogin()) {
					this.$Toast('请先进行登录')
					return
				}
				let goods_sku_id = 0
				if (this.data.specList.length) {
					goods_sku_id = this.getGoodsSkuInfo().goods_sku_id
				}
				try {
					const result = await reqAddCart(this.data.goods_id, this.goods_num, goods_sku_id)
					this.close()
					this.$emit('getCartTotal')
					this.$Toast(result.message)
				} catch (e) {
					this.$Toast(e.message)
				}



			},
			getGoodsSkuInfo() {
				const that = this
				return this.data.skuList.find(item => item.spec_value_ids.every(item2 => that.currentIndex
					.some(itme3 => item2 == itme3.id)
				))
			}
		}
	}
</script>

<style scoped>
	.sku {
		box-sizing: border-box;

	}

	.sku-content {
		height: 90rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		margin-top: 24rpx;
		padding: 0 30rpx;
	}

	.skuList {
		display: flex;
	}

	.choose {
		font-size: 28rpx;
		color: #888;
	}

	.skuItem {
		font-size: 28rpx;
		color: #303133;
		margin-right: 10rpx;
	}

	.skuChoose {
		padding: 30rpx 24rpx;
		box-sizing: border-box;
	}

	.header {
		display: flex;
		position: relative;
		align-items: center;
		margin-bottom: 40rpx;
	}

	.specification-left {
		height: 180rpx;
		width: 180rpx;
	}

	.specification-right {
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: 0 34rpx 10rpx 28rpx;
	}

	.goods-price {
		color: #fa2209;
		font-size: 36rpx;
		margin-bottom: 10rpx;
	}

	.goods-inventory {
		font-size: 24rpx;
		color: #525252;
		margin-bottom: 14rpx;

	}

	.close {
		position: absolute;
		top: 0;
		right: 0;
	}

	.spec {
		margin-bottom: 40rpx;
	}

	.spec-title {
		margin-bottom: 20rpx;
		font-size: 28rpx;
		color: #999;
	}

	.specList {
		display: flex;
		flex-wrap: wrap;
	}

	.specItem {
		padding: 10rpx 34rpx;
		font-size: 24rpx;
		border-radius: 10rpx;
		background-color: #fff;
		color: #333;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		border: 2rpx solid #f4f4f4;
		box-sizing: border-box;
	}

	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40rpx;
	}

	.footer-left {
		color: #303133;
		font-size: 28rpx;
	}

	.cartAndOrder {
		display: flex;
	}

	.cur {
		background-color: #fee8e6;
		border: 2rpx solid #fa2209;
		color: #fa2209;
	}
</style>
