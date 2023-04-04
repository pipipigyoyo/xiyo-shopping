<template>
	<view class="title"
		:style="{paddingLeft:style.paddingLeft+'rpx',paddingRight:style.paddingLeft+'rpx',paddingTop:style.paddingTop+'rpx',paddingBottom:style.paddingTop+'rpx',backgroundColor:style.background}">
		<view class="content">
			<rich-text :nodes="content"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			content: String,
			style: {
				type: Object,
				default: () => {}
			}
		}
	}
</script>

<style scoped>
	.title {
		background-color: #fff;
	}

	.content {
		font-size: 28rpx;
	}
</style>
