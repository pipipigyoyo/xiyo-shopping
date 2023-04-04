<template>
	<view class="notice">
		<uni-notice-bar :show-icon="data.showIcon" :scrollable="data.scrollable" :text="data.text||''" />
	</view>
</template>

<script>
	export default {
		options: {
			styleIsolation: 'shared'
		},
		props: {
			data: {
				type: Object,
				default: () => {}
			}
		},


	}
</script>

<style scoped>
	.notice>>>.uni-noticebar {
		padding: 5px 12px;
		margin-bottom: 0;
	}
</style>
