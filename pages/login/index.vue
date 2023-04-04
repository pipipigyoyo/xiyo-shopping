<template>
	<view>
		<mpWeixin v-if="isMpWeixinAuth" @onPhoneAuth="noPhoneAuth" />
		<mpWeixinMobile v-else :partyData="partyData" />
	</view>
</template>

<script>
	import mpWeixin from '@/pages/login/components/mp-weixin.vue'
	import mpWeixinMobile from '@/pages/login/components/mp-weixin-mobile.vue'
	export default {
		data() {
			return {
				isMpWeixinAuth: true,
				partyData: {}
			}
		},
		methods: {
			noPhoneAuth(data) {
				this.partyData = data.partyData
				this.isMpWeixinAuth = !data.isBindMobile
			}
		},
		components: {
			mpWeixin,
			mpWeixinMobile
		}

	}
</script>

<style scoped>

</style>
