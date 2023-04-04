<template>
	<view class="wrap">
		<uni-grid :column="4" @change="change" :showBorder="false">
			<uni-grid-item v-for="(item, index) in data" :index="index" :key="index">
				<view class="grid-item-box" style="background-color: #fff;">
					<img :src="item.imgUrl" alt="" class="wrap-img">
					<text class="text">{{item.text}}</text>
				</view>
			</uni-grid-item>
		</uni-grid>
	</view>
</template>

<script>
	export default {
		options: {
			styleIsolation: 'shared'
		},
		methods: {
			change() {}
		},
		props: {
			data: {
				type: Array,
				default: () => []
			}
		},

	}
</script>

<style scoped>
	.grid-item-box {
		flex: 1;
		// position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15px 0;
	}

	.text {
		font-size: 13px;
		margin-top: 5px;
		color: #666666;
	}

	.wrap-img {
		width: 88rpx;
		height: 88rpx;
	}
</style>
