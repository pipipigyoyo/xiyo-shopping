<template>
	<view class="goods">
		<view class="goods-item" style="width:100%;height:280rpx;display:flex;align-items:center;"
			v-for="(item,index) in data" :key="item.goods_id" @click="getGoodsInfo(item)" v-if="column===1">
			<view class="goods-images-column1">
				<img :src="item.goods_image" alt="" class="goods-image-column1">
			</view>
			<view class="goods-info">
				<view class="goods-title">
					<text>{{item.goods_name}}</text>
				</view>
				<view class="goods-prices" style="flex-direction:column;align-items:start;margin-top:20rpx;">
					<view class="goods-sales">
						<text>已售{{item.goods_sales}}件</text>
					</view>
					<view class="goods-price">
						<uni-icons custom-prefix="iconfont" type="icon-qianqian-" size="30rpx" color="#fa2209">
						</uni-icons>
						<text>{{item.goods_price_min}}</text>
					</view>
				</view>
			</view>
		</view>


		<view class="goods-item" v-for="(item,index) in data" :key="item.goods_id" @click="getGoodsInfo(item)"
			v-if="column===2">
			<view class="goods-images">
				<img :src="item.goods_image" alt="" class="goods-image">
			</view>
			<view class="goods-title">
				<text>{{item.goods_name}}</text>
			</view>
			<view class="goods-prices">
				<uni-icons custom-prefix="iconfont" type="icon-qianqian-" size="30rpx" color="#fa2209">
				</uni-icons><text class="goods-price">{{item.goods_price_min}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			data: {
				type: Array,
				default: () => []
			},
			column: {
				type: Number,
				default: 2
			}
		},
		methods: {
			getGoodsInfo(item) {
				if (item.goods_id) {
					let path = `/pages/goods/detail?goodsId=${item.goods_id}`
					uni.navigateTo({
						url: path
					})
				}
			}
		}
	}
</script>

<style scoped>
	.goods {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		padding: 3rpx;
	}

	.goods-item {
		width: 360rpx;
		height: 500rpx;
		margin: 6rpx;
		background-color: #ffffff
	}

	.goods-images {
		position: relative;
		width: 100%;
		height: 0;
		padding-top: 100%;
	}

	.goods-images-column1 {
		width: 240rpx;
		height: 240rpx;
		margin-right: 40rpx;
	}

	.goods-image {
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		position: absolute;
	}

	.goods-image-column1 {
		width: 100%;
		height: 100%;
	}

	.goods-info {
		flex: 1;
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
		font-size: 26rpx;
	}

	.goods-prices {
		display: flex;
		align-items: center;
		margin-top: 4rpx;
	}

	.goods-price {
		color: #fa2209;
		font-size: 30rpx;
	}

	.goods-sales {
		margin-bottom: 10rpx;
		font-size: 24rpx;
		color: #999999;
	}
</style>
