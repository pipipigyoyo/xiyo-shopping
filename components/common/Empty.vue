<template>
	<view>
		<u-empty :mode="mode" icon="/static/images/empty.png" marginTop="30%">
			<view class="button" v-if="mode==='car'">
				<u-button color="linear-gradient(to right, rgb(250, 35, 10), rgb(255, 99, 53) )" text="去逛逛"
					shape="circle" @click="toShopping"></u-button>
			</view>
		</u-empty>
	</view>
</template>

<script>
	export default {
		props: {
			mode: {
				type: String,
				default: 'data'
			}
		},
		methods: {
			toShopping() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		}


	}
</script>

<style scoped>
	.button {
		width: 250rpx;
		height: 70rpx;
		margin-top: 20rpx;
		font-size: 32rpx;
	}
</style>
