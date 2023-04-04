<template>
	<view class="window">
		<view class="windowImages" v-for="(item,index) in data" :key="index">
			<image :src="item.imgUrl" mode="widthFix" class="window-content"></image>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			data: {
				type: Array,
				default: () => []
			}
		}
	}
</script>

<style scoped>
	.window {
		display: flex;
		flex-wrap: wrap;

	}

	.windowImages {
		width: 50%;
	}

	.window-content {
		width: 100%;
		vertical-align: bottom;
	}
</style>
