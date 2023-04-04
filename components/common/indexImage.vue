<template>
	<view class="indexImage">
		<view class="indexImages" v-for="(item,index) in data" :key="index">
			<image :src="item.imgUrl" mode="widthFix" class="image-content"></image>
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
		},
	}
</script>

<style scoped>
	.indexImages {
		display: flex;
		flex-direction: column;
	}

	.image-content {

		width: 100%;
	}
</style>
