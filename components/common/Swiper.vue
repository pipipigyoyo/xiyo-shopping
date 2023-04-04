<template>
	<view class="uni-margin-wrap">
		<u-swiper :list="list||[]" keyName="imgUrl" :circular="true" @change="e => current = e.current"
			:autoplay="autoplay" :height="widHeight+'rpx'" @click="imageClick">
			<view slot="indicator" class="indicator">
				<view class="indicator__dot" v-for="(item, index) in data" :key="index"
					:class="[index === current && 'indicator__dot--active']">
				</view>
			</view>
		</u-swiper>
		<view class="imageCount" v-if="showImageCount">{{current+1}}/{{data.length}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				widHeight: 0,
				current: 0,
				list: this.data,
				widHeight: this.height
			}
		},
		props: {
			data: {
				type: Array,
				default: () => []
			},
			showImageCount: {
				type: Boolean,
				default: () => false
			},
			height: {
				type: Number,
				default: () => 320
			}
		},
		watch: {
			data: {
				deep: true,
				handler(value) {
					this.list = value;
				}
			},
			height(value) {
				this.widHeight = value
			},

		},

		methods: {
			imageClick(index) {
				if (this.data[index].link) {
					let path = '/' + this.data[index].link.param.url
					uni.navigateTo({
						url: path
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-margin-wrap {
		position: relative;
	}

	.imageCount {
		width: 80rpx;
		height: 40rpx;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 40rpx;
		line-height: 40rpx;
		color: #fff;
		text-align: center;
		font-size: 26rpx;
		position: absolute;
		right: 36rpx;
		bottom: 72rpx;
	}

	.swiper-item {
		display: block;
		width: 100%;
	}

	.indicator {
		@include flex(row);
		justify-content: center;

		&__dot {
			height: 6px;
			width: 6px;
			border-radius: 100px;
			background-color: rgba(255, 255, 255, 0.35);
			margin: 0 5px;
			transition: background-color 0.3s;

			&--active {
				background-color: #ffffff;
			}
		}
	}

	.indicator-num {
		padding: 2px 0;
		background-color: rgba(0, 0, 0, 0.35);
		border-radius: 100px;
		width: 35px;
		@include flex;
		justify-content: center;

		&__text {
			color: #FFFFFF;
			font-size: 12px;
		}
	}
</style>
