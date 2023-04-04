import myrequest from "@/util/request/request.js"

export const getCateList = () => {
	return myrequest({
		methods: 'get',
		params: {
			s: '/api/category/list'
		}
	})
}
