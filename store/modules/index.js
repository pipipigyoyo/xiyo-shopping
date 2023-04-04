export default {
	state: {
		orderArr: []
	},
	getters: {

	},
	mutations: {
		ADDORDERARR(state, value) {
			state.orderArr.push(value)
		}
	},
	actions: {
		addOrderArr({
			commit
		}, value) {
			console.log(111);
			commit('ADDORDERARR', value)
		}
	}
}
