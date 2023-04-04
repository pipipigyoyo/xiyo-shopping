import myrequest from "@/util/request/request.js"

export const reqCartList = () => {
	return myrequest({
		methods: 'get',
		params: {
			s: '/api/cart/list'
		}
	})
}

export const reqAddGoodsNum = (goodsId, goodsNum, goodsSkuId) => {
	return myrequest({
		methods: 'post',
		params: {
			s: '/api/cart/update',
			goodsId,
			goodsNum,
			goodsSkuId
		}
	})
}

export const reqClearGoodsNum = (cartIds) => {
	return myrequest({
		methods: 'post',
		params: {
			s: '/api/cart/clear',
			cartIds
		}
	})
}

export const reqAddCart = (goodsId, goodsNum, goodsSkuId) => {
	return myrequest({
		methods: 'post',
		params: {
			s: '/api/cart/add',
			goodsId,
			goodsNum,
			goodsSkuId
		}
	})
}

export const reqCartTotal = () => {
	return myrequest({
		methods: 'get',
		params: {
			s: '/api/cart/total'
		}
	})
}
