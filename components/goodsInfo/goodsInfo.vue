<template>
	<view class="goodsInfo">
		<view class="goodsPriceInfo">
			<view class="goodsPrice">
				<view class="goodsNewPrice price">
					<icon class="iconfont icon-qianqian-"></icon>
					<text class="newPrice">
						{{data.goods_price_min||0.00}}
					</text>
				</view>
				<view class="goodsLinePrice price">
					<icon class="iconfont icon-qianqian-"></icon>
					<text class="linePrice">
						{{data.line_price_min||0.00}}
					</text>
				</view>
			</view>
			<view class="goodsSell">
				<text>已售{{data.goods_sales||0}}件</text>
			</view>
		</view>
		<view class="goodsInfoDsc">
			<view class="InfoDsc">
				<text>{{data.goods_name}}</text>
			</view>
			<view class="separateLine">
			</view>
			<shareBtn />
		</view>
	</view>
</template>

<script>
	import shareBtn from '@/components/goodsInfo/shareBtn.vue'

	export default {
		data() {
			return {
				newPrice: 0,
				linePrice: 0,
				sales: 0,
				name: ''
			}
		},
		components: {
			shareBtn
		},
		props: {
			data: {
				type: Object,
				default: () => {}
			}
		}
	}
</script>

<style scoped>
	.price {
		align-items: baseline;
		margin-right: 14rpx;
	}

	.iconfont {
		font-size: 26rpx
	}

	.goodsInfo {
		box-sizing: border-box;
		height: 190rpx;
		background-color: #ffffff;
		margin-top: 24rpx;
		padding: 24rpx 30rpx;
	}

	.goodsPriceInfo {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 20rpx;
		color: #959595;
		font-size: 26rpx;
	}

	.goodsPrice {
		display: flex;
	}

	.goodsNewPrice {
		color: #fa2209;
		font-size: 42rpx;
	}

	.goodsLinePrice {
		text-decoration: line-through;
	}

	.goodsInfoDsc {
		display: flex;
		height: 80rpx;
		width: 100%;
		align-items: center;
	}

	.separateLine {
		width: 2rpx;
		height: 60rpx;
		border-left: 1rpx solid #f4f4f4;
		margin: 0 30rpx;
	}

	.InfoDsc {
		flex: 1;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 30rpx;
		color: #303133;
	}
</style>
