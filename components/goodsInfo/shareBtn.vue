<template>
	<view class="shareBtn" @click="toShareOrClose">
		<uni-icons custom-prefix="iconfont" type="icon-fenxiang" size="20"></uni-icons>
		<text class="text">分享</text>
		<uni-popup ref="popup" type="bottom" background-color="#fff" is-mask-click="true">
			<view class="share-content">
				<uni-grid :column="1" @change="change" :showBorder="false">
					<uni-grid-item v-for="(item, index) in 1" :index="index" :key="index">
						<view class="grid-item-box" style="background-color: #fff;">
							<view class="btnIcon">
								<uni-icons class="icon" custom-prefix="iconfont" type="icon-lianjie" size="20"
									color="#fff">
								</uni-icons>
							</view>
							<text class="icontext">复制链接</text>
						</view>
					</uni-grid-item>
				</uni-grid>
				<view class="closebtn" data-close="close">
					<text data-close="close">关闭</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		methods: {
			toShareOrClose(e) {
				if (!e.target.dataset.ref) {
					this.$refs.popup.open()
				}
				if (e.target.dataset.close) {
					this.$refs.popup.close()
				}
			},
			change() {
				const pages = getCurrentPages() // 获取栈实例
				let domain = 'http://8.134.80.179:3002' //项目的域名
				/* let currentRoute = pages[pages.length - 1].route; // 获取当前页面路由 */
				let currentPage = domain + pages[pages.length - 1]['$page']['fullPath']
				uni.setClipboardData({
					data: currentPage,
					success: () => {
						setTimeout(() => {
							uni.showToast({
								title: '已复制链接，快去分享给小伙伴吧~',
								icon: 'none'
							});
							this.$refs.popup.close()
						})
					}
				});
				uni.hideToast();
			}
		}
	}
</script>

<style scoped>
	.shareBtn {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.iconfont {
		font-size: 40rpx;
		margin-bottom: 4rpx;
	}

	.text {
		font-size: 24rpx
	}

	.share-content {
		box-sizing: border-box;
		padding: 50px 30px 30rpx 30px;

	}

	.grid-item-box {
		flex: 1;
		// position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.btnIcon {
		display: flex;
		height: 100rpx;
		width: 100rpx;
		border-radius: 50%;
		margin-bottom: 10rpx;
		background-color: #38beec;
	}

	.icon {
		margin: auto;
	}

	.icontext {
		font-size: 26rpx;
	}

	.closebtn {
		text-align: center;
		margin-top: 40rpx;
	}
</style>
