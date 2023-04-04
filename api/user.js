import myrequest from "@/util/request/request.js"
export const info = () => {
	return myrequest({
		methods: 'get',
		params: {
			s: '/api/user/info',
		}
	})
}

export const assets = () => {
	return myrequest({
		methods: 'get',
		params: {
			s: '/api/user/assets',
		}
	})
}
