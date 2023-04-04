<template>
	<view class="cate">
		<Search shape="round" inputAlign="center" />
		<view class="cateList">
			<Cate />
		</view>
	</view>
</template>

<script>
	import Search from '@/components/common/Search.vue'
	import Cate from '@/components/cate/cate.vue'
	export default {
		data() {
			return {

			}
		},
		methods: {},
		components: {
			Search,
			Cate
		}
	}
</script>

<style scoped>
	.cate {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.cateList {
		flex: 1;
		overflow: hidden;
	}
</style>
