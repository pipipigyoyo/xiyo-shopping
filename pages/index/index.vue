<template>
	<view class="index">
		<view class="index-item" v-for="(item,index) in list" :key="index">
			<Search v-if="item.type==='search'" :placeholder="item.params.placeholder" />
			<Notice v-if="item.type==='notice'" :data="item.params" />
			<Swiper v-if="item.type==='banner'" :data="item.data" />
			<Wrap v-if="item.type==='navBar'" :data="item.data" />
			<Title v-if="item.type==='richText'" :content="item.params.content" :style="item.style" />
			<indexImage v-if="item.type==='image'" :data="item.data" />
			<Goods v-if="item.type==='goods'" :data="item.data" :column="item.style.column" />
			<Window v-if="item.type==='window'" :data="item.data" />
		</view>
	</view>
</template>

<script>
	import Search from '@/components/common/Search.vue'
	import Notice from '@/components/index/Notice.vue'
	import Swiper from '@/components/common/Swiper.vue'
	import Wrap from '@/components/index/Wrap.vue'
	import Title from '@/components/common/Title.vue'
	import indexImage from '@/components/common/indexImage.vue'
	import Goods from '@/components/index/Goods.vue'
	import Window from '@/components/index/Window.vue'


	export default {
		data() {
			return {
				list: []
			}
		},

		methods: {
			async getIndex() {
				try {
					const result = await this.$myrequest({
						params: {
							s: '/api/page/detail'
						},
						methods: 'get'
					})
					this.list = result.data.pageData.items
				} catch (e) {
					this.$errorToast(e.message)
				}
			}

		},

		components: {
			Search,
			Notice,
			Swiper,
			Wrap,
			Title,
			indexImage,
			Goods,
			Window
		},
		mounted() {
			this.getIndex()
		},
	}
</script>

<style scoped>

</style>
