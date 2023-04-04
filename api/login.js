import myrequest from "@/util/request/request.js"
export const loginMpWeixin = (form = {}) => {
	return myrequest({
		methods: 'post',
		params: {
			s: '/api/passport/loginMpWx',
		},
		data: form
	})
}
export const graphAuth = () => {
	return myrequest({
		methods: 'get',
		params: {
			s: '/api/captcha/image',
		}
	})
}
export const phoneAuth = (form = {}) => {
	return myrequest({
		methods: 'post',
		params: {
			s: '/api/captcha/sendSmsCaptcha',
		},
		data: form
	})
}
export const phoneBindAuth = (form = {}) => {
	return myrequest({
		methods: 'post',
		params: {
			s: '/api/passport/loginMpWxMobile',
		},
		data: form
	})
}

export const Login = (form = {}) => {
	return myrequest({
		methods: 'post',
		params: {
			s: '/api/passport/login',
		},
		data: form
	})
}
