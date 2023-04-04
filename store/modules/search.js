import storage from '@/util/storage'


const storageSearch = (commit, data) => {
	let ddl = 30 * 86400
	storage.set('historySearch', data, ddl)
	commit('SETHISTORYSEARCH', data)
}

export default {
	state: {
		historySearch: []
	},
	getters: {
		historySearch: state => state.historySearch
	},
	mutations: {
		SETHISTORYSEARCH(state, data) {
			state.historySearch = data
		}
	},
	actions: {
		setHistorySearch({
			commit
		}, data) {
			storageSearch(commit, data)
		},
		clearHistorySearch({
			commit
		}, data) {
			if (this.getters.historySearch.length) {
				storage.remove('historySearch')
				commit('SETHISTORYSEARCH', [])
			}
		}
	}
}
