import store from '@/store/index.js'
export const successToast = (msg, callback = () => {}) => {
	uni.showToast({
		title: msg,
		icon: 'success',
		mask: true,
		success() {
			setTimeout(() => {
				callback()
			}, 2000)

		}
	})
}
export const Toast = (msg) => {
	uni.showToast({
		title: msg,
		icon: 'none',
		mask: true
	})
}
export const errorToast = (msg, callback = () => {}) => {
	uni.showToast({
		title: msg,
		icon: 'error',
		mask: true,
		success() {
			callback()
		}
	})
}

export const loadingToast = (msg, callback = () => {}) => {
	uni.showLoading({
		title: msg,
		mask: true,
		success() {
			callback()
		}
	})
}

export const checkLogin = () => {
	return !!store.getters.userId
}

export const wxPayment = (option) => {
	const options = {
		timeStamp: '',
		nonceStr: '',
		prepay_id: '',
		paySign: '',
		...option
	}
	return new Promise((resolve, reject) => {
		uni.requestPayment({
			provider: 'wxpay',
			timeStamp: options.timeStamp,
			nonceStr: options.nonceStr,
			'package': `prepay_id=${options.prepay_id}`,
			signType: 'MD5',
			paySign: options.paySign,
			success: res => {
				console.log(res);
				resolve(res)
			},
			fail: res => {
				console.log(res);
				reject(res)
			}
		})
	})
}
