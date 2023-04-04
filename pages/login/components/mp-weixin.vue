<template>
	<view class="login">
		<view class="login-header">
			<view class="login-head">
				<image src="@/static/default-avatar.png" class="login-head-content"></image>
			</view>
		</view>
		<view class="login-info">
			<text class="login-info-title">申请获取以下权限</text>
			<text class="login-info-content">获得你的公开信息（昵称、头像等）</text>
		</view>
		<view class="login-btn">
			<button type="primary" class="btn" @click="confirmLogin">授权登录</button>
			<button type="primary" class="cancelBtn btn">暂不登录</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				partyData: {}
			}
		},
		methods: {
			confirmLogin() {
				const that = this
				this.$loadingToast('加载中')
				uni.getUserProfile({
					desc: '用户登录',
					success(res) {
						that.onSuccessLogin(res.userInfo)
					},
					fail(err) {
						that.$Toast(err.message)
					}
				})
			},
			async onSuccessLogin(userInfo) {
				const that = this
				const partyData = {
					oauth: 'MP-WEIXIN',
					userInfo,
					code: await that.getCode()
				}
				this.$store.dispatch('loginMpWeixin', partyData).then(res => {
					uni.hideLoading();
					that.$successToast(res.message, () => {
						uni.navigateBack()
					})

				}).catch(res => {
					uni.hideLoading();
					that.$Toast(res.message)
					if (res.data.isBindMobile) {
						that.phoneAuth(res.data.isBindMobile, userInfo)
					}

				})
			},
			getCode() {
				return new Promise((resolve, reject) => {
					uni.login({
						provider: 'weixin',
						success(res) {
							resolve(res.code)
						},
						fail: reject
					})
				})
			},
			async phoneAuth(isBindMobile, userInfo) {
				const partyData = {
					oauth: 'MP-WEIXIN',
					userInfo,
					code: await this.getCode()
				}
				this.$emit('onPhoneAuth', {
					isBindMobile,
					partyData
				})
			}
		}
	}
</script>

<style scoped>
	.login-header {
		display: flex;
		height: 300rpx;
		margin: 0 30rpx;
		border-bottom: 1rpx solid #ccc;
	}

	.login-head {
		display: flex;
		height: 200rpx;
		width: 200rpx;
		margin: auto;
		background-color: #fff;
		border-radius: 50%;
		border: 2rpx solid #ccc;
	}

	.login-head-content {
		height: 95%;
		width: 95%;
		border-radius: 50%;
		margin: auto;
	}

	.login-info {
		display: flex;
		height: 200rpx;
		flex-direction: column;
		padding: 100rpx 30rpx;
	}

	.login-info-title {
		font-size: 34rpx;
		margin-bottom: 50rpx;
	}

	.login-info-content {
		font-size: 28rpx;
		color: #ccc;
	}

	.btn {
		width: 500rpx;
		border-radius: 250rpx;
		margin-bottom: 20rpx;
	}

	.cancelBtn {
		background-color: #ccc;
		color: #fff;
	}
</style>
