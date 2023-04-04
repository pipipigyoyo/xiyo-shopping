<template>
	<view class="checkout">
		<view class="tar">
			<u-tabs :list="list" itemStyle="width:50%; height: 82rpx;" :scrollable="false"
				:activeStyle="{color: '#fa2209'}" lineColor="#fa2209"></u-tabs>
		</view>
		<view class="address">
			<uni-icons custom-prefix="iconfont" type="icon-dizhi" size="36rpx" color="#303133"></uni-icons>
			<view class="info">
				<view class="recipient-info">
					<text style="margin-right: 10rpx;">{{data.order.address.name}}</text>
					<text>{{data.order.address.phone}}</text>
				</view>
				<view class="address-info">
					<text>{{data.order.address.region.province}}</text>
					<text>{{data.order.address.region.city}}</text>
					<text>{{data.order.address.region.region}}</text>
					<text>{{data.order.address.detail}}</text>
				</view>
			</view>
			<uni-icons custom-prefix="iconfont" type="icon-gengduo" size="36rpx" color="#303133"></uni-icons>
		</view>
		<view class="cartList">
			<view class="cartItem" v-for="item in data.order.goodsList" :key="item.goods_id">
				<view class="goodsImages">
					<u--image :src="item.goods_image" width="200rpx" height="200rpx" :fade="false"></u--image>
				</view>
				<view class="goodsInfo">
					<view class="goods-title">
						<text>{{item.goods_name}}</text>
					</view>
					<view class="skuList">
						<view class="skuItem" v-for="item2 in item.skuInfo.goods_props" :key="item2.group.id">
							{{item2.group.name}}:{{item2.value.name}};
						</view>
					</view>
					<view class="price">
						<view class="goods-count">
							×{{item.total_num}}
						</view>
						<view class="goods-prices">
							<uni-icons custom-prefix="iconfont" type="icon-qianqian-" size="30rpx" color="#fa2209">
							</uni-icons><text class="goods-price">{{item.total_price}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="goods-totalNum">
				共{{data.order.orderTotalNum}}件商品
			</view>
		</view>
		<view class="grid">
			<view class="grid-item">
				<view class="left">
					订单总金额：
				</view>
				<view class="right">
					<uni-icons custom-prefix="iconfont" type="icon-qianqian-" size="28rpx" color="#fa2209">
					</uni-icons><text>{{data.order.orderTotalPrice}}</text>
				</view>
			</view>
			<view class="grid-item">
				<view class="left">
					配送费用：
				</view>
				<view class="right">
					+
					<uni-icons custom-prefix="iconfont" type="icon-qianqian-" size="28rpx" color="#fa2209">
					</uni-icons><text>{{data.order.expressPrice}}</text>
				</view>
			</view>
		</view>
		<view class="message">
			<u--input border="none" maxlength="50" v-model="remark" placeholder="选填:买家留言(50字以内)"></u--input>
		</view>
		<view class="blank">
			<view class="bottom">
				<view class="shouldPay">
					<text>应该付款：</text>
					<view class="shouldPay-num">
						<uni-icons custom-prefix="iconfont" type="icon-qianqian-" size="30rpx" color="#fa2209">
						</uni-icons><text class="goods-price">{{data.order.orderPayPrice}}</text>
					</view>
				</view>
				<view class="SubmitOrders-btn">
					<u-button text="提交订单" :custom-style="orderBtn"
						color="linear-gradient(to right, rgb(250, 35, 10), rgb(255, 99, 53))" @click="submitOrders">
					</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		reqCheckoutInfo,
		reqSubmitOrder
	} from '@/api/order.js'
	import {
		checkLogin,
		wxPayment
	} from '@/core/app.js'
	export default {
		data() {
			return {
				mode: null,
				cartIds: null,
				goodsInfo: null,
				options: {},
				list: [{
						name: '快递配送',
					},
					{
						name: '上门自提',
					}
				],
				data: {},
				remark: '',
				orderBtn: {
					height: '100rpx',
					width: '200rpx',
					borderRadius: 0
				}
			}
		},
		methods: {
			refreshPage() {
				this.$loadingToast('加载中', () => {
					this.isLogin = checkLogin()
					this.getPageInfo()
				})
			},
			getPageInfo() {
				Promise.all([this.getCheckoutInfo()]).finally(() => {
					uni.hideLoading()
				})
			},
			getCheckoutInfo() {
				const that = this
				return new Promise((reject, resolve) => {
					!that.isLogin ? resolve(null) : reqCheckoutInfo(that.options.mode, that.getFormData()
						/* {
												mode: that.options.mode,
												delivery: 10,
												shopId: 0,
												couponId: 0,
												isUsePoints: 0,
												cartIds: that.cartIds,
												goodsInfo: that.goodsInfo
											} */
					).then(res => {
						that.data = res.data
						reject(res)
					}).catch(e => {
						resolve(e)
					})
				})
			},
			submitOrders() {
				const that = this
				reqSubmitOrder(that.options.mode, that.getFormData()).then(result => {
					console.log(123);
					console.log(result);
					that.onSubmitCallback(result)
				}).catch(
					err => {
						console.log(456);
						console.log(err);
						if (err.result) {
							const errData = err.result.data
							if (errData.is_created) {
								that.$errorToast('稍后再试吧！')
								return false
							}
						}
					})
			},
			onSubmitCallback(result) {
				console.log('@@@');
				const app = this
				// 发起微信支付
				wxPayment(result.data.payment)
					.then(() => app.$successToast('支付成功'))
					.catch(err => app.$errorToast('订单未支付'))
			},

			getFormData() {
				const app = this
				const {
					options
				} = app
				// 表单数据
				const form = {
					delivery: 10 /* app.curDelivery */ ,
					payType: 20,
					/* app.curPayType */
					couponId: 0 /* app.selectCouponId || 0 */ ,
					isUsePoints: 0 /* app.isUsePoints ? 1 : 0 */ ,
					remark: app.remark || '',
				}
				// 创建订单-立即购买
				if (options.mode === 'buyNow') {
					form.goodsId = options.goodsId
					form.goodsNum = options.goodsNum
					form.goodsSkuId = options.goodsSkuId
				}
				// 创建订单-购物车结算
				if (options.mode === 'cart') {
					form.cartIds = options.cartIds || null
				}
				return form
			},
		},
		onShow() {
			this.refreshPage()
		},
		onLoad(options) {

			this.options = options
			/* this.mode = option.mode || 'cart'
			this.cartIds = option.cartIds || 0
			this.goodsInfo = option.goodsInfo || {} */
		}
	}
</script>

<style scoped>
	.tar {
		width: 100%;
		height: 84rpx;
		background-color: #fff;
		border-bottom: 2rpx solid #f8f8f8;
	}

	.address {
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 34rpx 30rpx;
		background: #fff url('/static/images/checkout/border.png') 0 100% repeat-x;
		background-size: 120rpx auto;
		margin-bottom: 24rpx;
	}

	.info {
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: 0 20rpx;
	}

	.recipient-info {
		margin-bottom: 6rpx;
		font-size: 28rpx
	}

	.address-info {
		color: #777;
		font-size: 28rpx
	}

	.cartList {
		box-sizing: border-box;
		width: 100%;
		margin-bottom: 24rpx;

	}

	.cartItem {
		box-sizing: border-box;
		display: flex;
		padding: 30rpx 30rpx;
		border-bottom: 1rpx solid #f8f8f8;
		width: 100%;
		height: 260rpx;
		background-color: #fff;
	}

	.goodsInfo {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		flex: 1;
		padding-left: 24rpx;
	}

	.goods-title {
		height: 65rpx;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		padding: 6rpx;
		color: #484848;
		font-size: 28rpx;
	}

	.skuList {
		display: flex;
	}

	.skuItem {
		font-size: 24rpx;
		color: #999;
		margin-right: 14rpx;
	}

	.goods-prices {
		display: flex;
		align-items: center;

	}

	.goods-price {
		color: #fa2209;
		font-size: 30rpx;
	}

	.price {
		display: flex;
		justify-content: space-between;
	}

	.goods-count {
		font-size: 26rpx;
		color: #777;
	}

	.goodsImages {
		height: 200rpx;
		width: 200rpx;
		border: 2rpx solid #eeeeee;
	}

	.goods-totalNum {
		font-size: 28rpx;
		color: #777;
		padding: 16rpx 20rpx;
		text-align: right;
		background: #fff;
	}

	.grid {
		margin-bottom: 24rpx;
	}


	.grid-item {
		display: flex;
		justify-content: space-between;
		padding: 16rpx 20rpx;
		background: #fff;
		border-bottom: 2rpx solid #eeeeee;
	}

	/* .grid:last-child {
		border-bottom: none
	}
 */
	.left {
		font-size: 28rpx;
		color: #444;
	}

	.right {
		font-size: 28rpx;
		color: #fa2209;
	}

	.message {
		padding: 30rpx 20rpx;
		background-color: #fff
	}

	.blank {
		position: relative;
		bottom: 0;
		height: 100rpx;
		width: 100%;
	}

	.bottom {
		display: flex;
		position: fixed;
		align-items: center;
		box-sizing: border-box;
		bottom: 0;
		height: 100rpx;
		width: 100%;
		background-color: #fff;
		padding-left: 20rpx;
		justify-content: space-between;
		z-index: 999;
	}

	.shouldPay {
		display: flex;
		font-size: 28rpx;
		color: #777;
	}
</style>
