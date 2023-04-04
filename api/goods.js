import myrequest from "@/util/request/request.js"

export const reqGoodsList = (data = {}) => {
	let {
		categoryId,
		goodsName,
		goodsNo,
		sortType,
		sortPrice
	} = data
	return myrequest({
		methods: 'get',
		params: {
			s: '/api/goods/list',
			categoryId,
			goodsName,
			goodsNo,
			sortType,
			sortPrice
		}
	})
}
