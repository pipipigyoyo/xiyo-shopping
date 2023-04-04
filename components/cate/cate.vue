<template>
	<view class="cate">
		<view class="cateList">
			<view class="cateItem" :class="currentIndex===index?'cur':''" v-for="(item,index) in cateList"
				:key="item.category_id" @click="getCateInfo(item.children,index)">
				<text>{{item.name}}</text>
			</view>
		</view>
		<view class="subclassification">
			<view class="childrenItem" v-for="(item,index) in childrenList" :key="item.category_id"
				@click="toGoodsList(item)">
				<view class="childrenItem-image">
					<u--image :src="item.image.external_url" width="145rpx" height="145rpx"></u--image>
				</view>
				<view class="childrenItem-image-title">
					{{item.name}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getCateList
	} from '@/api/cate.js'
	export default {
		data() {
			return {
				currentIndex: -1,
				cateList: [],
				childrenList: []
			}
		},
		methods: {
			async getCateList() {
				try {
					const result = await getCateList()
					this.cateList = result.data.list
					if (this.cateList[0].children.length > 0) {
						this.getCateInfo(this.cateList[0].children, 0)
					}
				} catch (e) {
					this.$errorToast(e.message)
				}
			},
			getCateInfo(childrenList, index) {
				if (this.currentIndex === index) return
				this.childrenList = childrenList
				this.currentIndex = index
			},
			toGoodsList(item) {
				let {
					category_id
				} = item
				uni.navigateTo({
					url: `/pages/goodsList/index?categoryId=${category_id}`
				})
			}
		},
		mounted() {
			this.getCateList()
		}
	}
</script>

<style scoped>
	.cate {
		height: 100%;
		display: flex;

	}

	.cateList {
		height: 100%;
		width: 180rpx;
		display: flex;
		flex-direction: column;
		overflow: auto;
	}

	.cateItem {
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		font-size: 26rpx;
	}

	.subclassification {
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		flex: 1;
		background-color: #fff;
		overflow: auto;
		padding: 5rpx 0;
	}

	.childrenItem {
		display: flex;
		flex-direction: column;
		height: 180rpx;
		width: 180rpx;
		margin: 5rpx;
		align-items: center;
	}

	.childrenItem-image {
		height: 145rpx;
		width: 145rpx;
	}

	.childrenItem-image-title {
		color: #444444;
		font-size: 26rpx
	}

	.cur {
		background-color: #fff;
		color: #fa2209;
	}
</style>
