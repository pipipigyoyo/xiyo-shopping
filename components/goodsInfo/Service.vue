<template>
	<view class="service" @click="openOrClose">
		<view class="serviceList">
			<view class="service-item" v-for="(item,index) in serviceList" :key="item.service_id">
				<uni-icons custom-prefix="iconfont" type="icon-checkcircleyuangou" size="13" color="#fa2209"
					class="icon">
				</uni-icons>
				<text class="text">{{item.name}}</text>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" is-mask-click="true">
			<view class="service-more">
				<view class="service-title">
					<text>服务</text>
					<uni-icons class="chacha icon" custom-prefix="iconfont" type="icon-chacha" size="15" color="#909399"
						data-close="close"></uni-icons>
				</view>
				<view class="service-contentList">
					<view class="service-content-item" v-for="(item,index) in serviceList" :key="item.service_id">
						<uni-icons custom-prefix="iconfont" type="icon-checkcircleyuangou" size="14" color="#fa2209"
							class="icon"></uni-icons>
						<view class="service-contnet">
							<view class="service-name">
								<text>{{item.name}}</text>
							</view>
							<view class="service-info">
								<text>{{item.summary}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<view class="more">
			<uni-icons custom-prefix="iconfont" type="icon-gengduo" size="13" color="#303133"></uni-icons>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				serviceList: []
			}
		},
		methods: {
			async getService() {
				let {
					goodsId
				} = this
				try {
					const result = await this.$myrequest({
						params: {
							s: '/api/goods.service/list',
							goodsId
						}
					})
					this.serviceList = result.data.list
				} catch (e) {
					console.log(e);
				}
			},
			openOrClose(e) {
				if (!e.target.dataset.ref) {
					this.$refs.popup.open()
				}
				if (e.target.dataset.close) {
					this.$refs.popup.close()
				}
			}
		},
		props: {
			goodsId: Number
		},
		mounted() {
			this.getService()
		}
	}
</script>

<style scoped>
	.service {
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fafafa;
		padding: 0 30rpx;
	}

	.serviceList {
		display: flex;
	}

	.service-item {
		margin-right: 20rpx;
	}

	.text {
		font-size: 26rpx
	}

	.icon {
		margin-right: 10rpx;
	}

	.service-more {
		box-sizing: border-box;
		padding: 24rpx;
	}


	.service-title {
		text-align: center;
		font-weight: 700;
		font-size: 30rpx;
		margin-bottom: 50rpx;
	}

	.chacha {
		float: right;
	}

	.service-content-item {
		display: flex;
		margin-bottom: 50rpx;
	}

	.service-name {
		font-size: 28rpx
	}

	.service-info {
		margin-top: 20rpx;
		font-size: 26rpx;
		color: #6d6d6d;

	}
</style>
