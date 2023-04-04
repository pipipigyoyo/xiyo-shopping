<template>
	<view class="mpWeixinMobile">
		<view class="mpWeixinMobile-header">
			<view class="header-title">
				<text>绑定手机号</text>
			</view>
			<view class="header-info">
				<text>为了给您带来更优质的服务，请绑定手机号</text>
			</view>
		</view>
		<view class="form">
			<u--form labelPosition="left" ref="form" labelWidth="100" :model="userinfo" :rules="rules" errorType="none">
				<u-form-item prop="phone" borderBottom ref="item1">
					<u--input placeholder="请输入手机号码" v-model="userinfo.phone" border="none"></u--input>
				</u-form-item>
				<u-form-item prop="graphCode" borderBottom ref="item2">
					<u--input placeholder="请输入图形验证码" v-model="userinfo.graphCode" border="none"></u--input>
					<view class="Code" slot="right" @click="changeGraphCode">
						<u-loading-icon mode="circle" :show="!imgBase64"></u-loading-icon>
						<image :src="imgBase64" mode="heightFix" class="imageGraphCode" v-if="imgBase64"></image>
					</view>
				</u-form-item>
				<u-form-item prop="messageCode" borderBottom ref="item3">
					<u--input placeholder="请输入短信验证码" v-model="userinfo.messageCode" border="none"></u--input>
					<view class="phoneCode" slot="right">
						<u-code :seconds="seconds" ref="uCode" @change="codeChange"></u-code>
						<u--text @tap="getCode" :text="tips" color="#fa2209"></u--text>
					</view>
				</u-form-item>
			</u--form>
		</view>
		<view class="login-btn">
			<u-button color="linear-gradient(to right, rgb(250, 35, 10), rgb(255, 99, 53) )" shape="circle" text="登录"
				@click="onSubmit">
			</u-button>
		</view>
	</view>
</template>

<script>
	import * as loginApi from '@/api/login.js'
	export default {
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		data() {
			return {
				userinfo: {
					phone: '',
					graphCode: '',
					messageCode: ''
				},
				imgBase64: '',
				graphKey: '',
				seconds: 60,
				tips: '',
				rules: {
					phone: [{
						required: true,
						message: '请输入手机号',
						trigger: ['change', 'blur'],
					}, {
						validator: (rule, value, callback) => {
							return uni.$u.test.mobile(value);
						},
						message: '手机号码不正确',
						trigger: ['change', 'blur'],
					}],
					graphCode: {
						type: 'string',
						required: true,
						len: 4,
						message: '请填写右侧验证码',
						trigger: ['blur']
					},
					messageCode: {
						type: 'string',
						required: true,
						message: '请填写手机验证码',
						trigger: ['blur']
					},
				}
			}
		},
		props: {
			partyData: {
				type: Object,
				default: () => {}
			}
		},

		methods: {
			async getGraphCoad() {
				this.imgBase64 = ''
				try {
					const result = await loginApi.graphAuth()
					this.imgBase64 = result.data.base64
					this.graphKey = result.data.key
				} catch (e) {
					this.$errorToast(e.message)
				}

			},
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if (this.$refs.uCode.canGetCode) {
					this.$loadingToast('正在获取验证码')
					const form = {
						captchaCode: this.userinfo.graphCode,
						captchaKey: this.graphKey,
						mobile: this.userinfo.phone
					}
					try {
						loginApi.phoneAuth({
							form
						}).then(res => {
							uni.hideLoading()
							this.$Toast(res.message)
							this.$refs.uCode.start()
						})
					} catch (e) {
						uni.hideLoading()
						this.$Toast(e.message)
						this.getGraphCoad()
					}
				} else {
					this.$Toast('倒计时结束后再发送')
				}
			},
			onSubmit() {
				const that = this
				this.$refs.form.validate().then(res => {
					that.$store.dispatch('Login', {
						form: {
							mobile: that.userinfo.phone,
							smsCode: that.userinfo.messageCode,
							isParty: true,
							refereeId: 10001,
							partyData: that.partyData
						}
					}).then(res => {
						this.$Toast(res.message)
					})
				}).catch(errors => {
					if (errors[0]) {
						this.$Toast(errors[0].message)
					} else {
						this.$Toast(errors.message)
					}
				})
			},
			changeGraphCode() {
				this.getGraphCoad()
			}
		},
		mounted() {
			this.getGraphCoad()
		}
	}
</script>

<style scoped lang="scss">
	.mpWeixinMobile {
		padding: 100rpx 60rpx
	}

	.mpWeixinMobile-header {
		height: 250rpx;
	}

	.header-title {
		font-size: 54rpx;
		font-weight: 700;
		margin-bottom: 30rpx;
	}

	.header-info {
		font-size: 28rpx;
		color: #b3b3b3;
	}

	.Code {
		height: 48rpx;
	}

	.imageGraphCode {
		height: 100%;
	}

	.login-btn {
		margin-top: 100rpx;
	}
</style>
