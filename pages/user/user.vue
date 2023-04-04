<template>
	<view class="user">
		<view class="user-header" v-if="!isLogin">
			<view class="user-head" @click="toLogin">
				<image src="@/static/default-avatar.png"></image>
			</view>
			<view class="user-info">
				<text class="userName">未登录</text>
				<text class="userPhone">点击登录账号</text>
			</view>
		</view>
		<view class="user-header" v-else>
			<view class="user-head">
				<image :src="userInfo.avatar_url"></image>
			</view>
			<view class="user-info">
				<text class="userName">{{userInfo.nick_name}}</text>
				<text class="userPhone">{{userInfo.mobile}}</text>
			</view>
		</view>
		<view class="my-asset">
			<view class="asset-item">
				<text class="oneline-hide">{{isLogin?assets.balance:'--'}}</text>
				<text class="item-name">账户余额</text>
			</view>
			<view class="asset-item">
				<text class="oneline-hide">{{isLogin?assets.points:'--'}}</text>
				<text class="item-name">积分</text>
			</view>
			<view class="asset-item">
				<text class="oneline-hide">{{isLogin?assets.coupon:'--'}}</text>
				<text class="item-name">优惠券</text>
			</view>
			<view class="asset-item wallet">
				<uni-icons class="oneline-hide" custom-prefix="iconfont" type="icon-qianbao" size="44rpx"
					color="#545454"></uni-icons>
				<text class="item-name">我的钱包</text>
			</view>
		</view>
		<view class="order-navbar">
			<u-grid :border="false" col="4">
				<u-grid-item v-for="(item,index) in orderNavbar" :key="item.id">
					<view class="orderItem">
						<u-badge numberType="ellipsis" max="99" :value="item.count" absolute="true" :offset="[0, 0]"
							:show="item.count!==undefined">
						</u-badge>
						<uni-icons class="oneline-hide" custom-prefix="iconfont" :type="'icon'+'-'+item.icon"
							size="50rpx" color="#545454">
						</uni-icons>
						<text class="item-name">{{item.name}}</text>
					</view>
				</u-grid-item>

			</u-grid>
		</view>
		<view class="my-service">
			<view class="service-title">
				我的服务
			</view>
			<view class="service-content">
				<u-grid :border="false" :col="4">
					<u-grid-item v-for="(item,index) in service" :key="item.id" :customStyle="{marginBottom:30+'rpx'}">
						<view class="serviceItem">
							<u-badge numberType="ellipsis" max="99" :value="item.count" absolute="true" :offset="[0, 0]"
								:show="item.count!==undefined">
							</u-badge>
							<uni-icons class="oneline-hide" custom-prefix="iconfont" :type="'icon'+'-'+item.icon"
								size="50rpx" color="#fb2209">
							</uni-icons>
							<text class="item-name">{{item.name}}</text>
						</view>
					</u-grid-item>
				</u-grid>
			</view>
		</view>
		<view class="outLogin-btn" v-if="isLogin">
			<u-button shape="circle" plain="true" text="退出登录" @click="show=true"></u-button>
			<u-modal :show="show" @confirm="outLogin" @cancel="show=false" :asyncClose="true" showCancelButton="true"
				:content="content">
			</u-modal>
		</view>
	</view>
</template>

<script>
	import {
		checkLogin
	} from '@/core/app.js'
	import * as userApi from '@/api/user.js'
	import * as orderApi from '@/api/order.js'
	export default {
		data() {
			return {
				isLogin: false,
				userInfo: {},
				show: false,
				content: '是否确认退出登录？',
				todoCounts: {
					payment: 0,
					deliver: 0,
					received: 0,
					refund: 0
				},
				assets: {},
				service: [{
						id: 'address',
						name: '收货地址',
						icon: 'weibiaoti2fuzhi08',
						type: 'link',
						url: 'pages/address/index'
					},
					{
						id: 'coupon',
						name: '领券中心',
						icon: 'liwuhuodong',
						type: 'link',
						url: 'pages/coupon/index'
					},
					{
						id: 'myCoupon',
						name: '优惠券',
						icon: 'youhuiquan',
						type: 'link',
						url: 'pages/my-coupon/index'
					},
					{
						id: 'help',
						name: '我的帮助',
						icon: 'bangzhu',
						type: 'link',
						url: 'pages/help/index'
					},
					{
						id: 'contact',
						name: '在线客服',
						icon: 'kefu',
						type: 'button',
						openType: 'contact'
					},
					{
						id: 'points',
						name: '我的积分',
						icon: 'huiyuanjifen',
						type: 'link',
						url: 'pages/points/log'
					},
					{
						id: 'refund',
						name: '退换/售后',
						icon: 'shouhou',
						type: 'link',
						url: 'pages/refund/index',
						count: 0
					}
				],
				orderNavbar: [{
						id: 'all',
						name: '全部订单',
						icon: 'dingdandingdanmingxishouzhimingxi-xianxing'
					},
					{
						id: 'payment',
						name: '待支付',
						icon: 'qianbao1',
						count: 0
					},
					{
						id: 'delivery',
						name: '待发货',
						icon: 'yifahuodefuben',
						count: 0
					},
					{
						id: 'received',
						name: '待收货',
						icon: 'yishouhuo',
						count: 0
					}
				]
			}
		},
		onShow() {
			this.refreshPage()
		},
		methods: {
			toLogin() {
				uni.navigateTo({
					url: '/pages/login/index'
				})
			},
			outLogin() {
				this.$store.dispatch('outLogin')
				this.isLogin = false
				this.show = false
			},
			getPageData() {
				const that = this
				Promise.all([that.getUserInfo(), that.getUserAssets(), that.getTodoCounts()]).then(res => {
					that.getServiceCounts()
					that.getOrderCounts()
				}).catch(errors => {
					console.log('errors', errors);
				})
			},
			refreshPage() {
				this.isLogin = checkLogin()
				this.getPageData()
			},
			getUserInfo() {
				const that = this
				return new Promise((resolve, reject) => {
					!that.isLogin ? resolve(null) : userApi.info().then(res => {
						that.userInfo = res.data.userInfo
						resolve(res)
					}).catch(e => {
						if (e.status === 401) {
							that.isLogin = false
							resolve(null)
						} else {
							reject(e)
						}
					})
				})
			},
			getUserAssets() {
				const that = this
				return new Promise((resolve, reject) => {
					!that.isLogin ? resolve(null) : userApi.assets().then(res => {
						that.assets = res.data.assets
						resolve(res)
					}).catch(errors => {
						if (errors.status === 401) {
							that.isLogin = false
							resolve(null)
						} else {
							reject(errors)
						}
					})

				})
			},
			getTodoCounts() {
				const that = this
				return new Promise((resolve, reject) => {
					!that.isLogin ? resolve(null) : orderApi.getTodoCounts().then(res => {
						that.todoCounts = res.data.counts
						resolve(res)
					}).catch(errors => {
						if (errors.status === 401) {
							that.isLogin = false
							resolve(null)
						} else {
							reject(errors)
						}
					})
				})
			},
			getServiceCounts() {
				const that = this
				const newService = []
				this.service.forEach(item => {
					if (item.count !== undefined) {
						item.count = that.todoCounts[item.id]
					}
					newService.push(item)
				})
				this.service = newService
			},
			getOrderCounts() {
				const that = this
				const newOrder = []
				this.orderNavbar.forEach(item => {
					if (item.count !== undefined) {
						item.count = that.todoCounts[item.id]
					}
					newOrder.push(item)
				})
				this.orderNavbar = newOrder

			}
		}

	}
</script>

<style scoped>
	.user-header {
		box-sizing: border-box;
		height: 260rpx;
		background-color: #fbf7ef;
		padding-left: 30rpx;
		padding-top: 60rpx;
		display: flex;
		align-items: center;
	}

	.user-head {
		height: 120rpx;
		width: 120rpx;
	}

	.user-head image {
		height: 100%;
		width: 100%;
		border-radius: 50%;
	}

	.user-info {
		display: flex;
		flex-direction: column;
		margin-left: 30rpx;
		color: #c59a46;
	}

	.userName {
		font-size: 34rpx;
		font-weight: 700;
	}

	.userPhone {
		margin-top: 12rpx;
		font-size: 30rpx;
	}

	.my-asset {
		box-sizing: border-box;
		display: flex;
		height: 176rpx;
		padding: 0 30rpx;
		align-items: center;
		background-color: #fff;

	}

	.asset-item {
		display: flex;
		flex-direction: column;
		flex: 1;
		box-sizing: border-box;
		text-align: center;

	}

	.oneline-hide {
		margin-bottom: 5rpx;
		color: #fa2209;
		font-size: 34rpx;
	}

	.item-name {
		font-size: 28rpx;
		color: #666666;
	}

	.wallet {
		border-left: 2rpx solid #f3f3f3;
	}

	.order-navbar {
		display: flex;
		height: 160rpx;
		box-sizing: border-box;
		margin: 30rpx;
		align-items: center;
		background-color: #fff;
	}

	.my-service {
		margin: 0 30rpx;
		padding-bottom: 30rpx;
		background-color: #fff;
	}

	.service-title {
		padding: 30rpx;
		color: #303133;
	}

	.outLogin-btn {
		padding: 0 30rpx;
		margin: 30rpx 0;
	}

	.orderItem,
	.serviceItem {
		position: relative;
		display: flex;
		flex-direction: column;
		text-align: center;
	}
</style>
