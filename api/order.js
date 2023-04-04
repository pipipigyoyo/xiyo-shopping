import myrequest from "@/util/request/request.js"

export const getTodoCounts = () => {
	return myrequest({
		methods: 'get',
		params: {
			s: '/api/order/todoCounts'
		}
	})
}


export const reqCheckoutInfo = (mode, data) => {
	console.log(data.cartIds);
	return myrequest({
		methods: 'get',
		params: {
			s: '/api/checkout/order',
			mode,
			...data
			/* delivery,
			shopId,
			couponId,
			isUsePoints,
			cartIds,
			goodsId: goodsInfo.goodsId || 0,
			goodsNum: goodsInfo.goodsNum || 0,
			goodsSkuId: goodsInfo.goodsSkuId || 0 */
		}
	})
}

export const reqSubmitOrder = (mode, data) => {
	console.log(data.cartIds);
	return myrequest({
		methods: 'post',
		params: {
			s: '/api/checkout/submit',
			mode,
			...data
		}
	})
}
