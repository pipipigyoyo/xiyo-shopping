import * as loginApi from '@/api/login.js'
import storage from '@/util/storage'

const storageLogin = (commit, {
	data
}) => {
	let ddl = 30 * 86400
	storage.set('AccessToken', data.token, ddl)
	storage.set('userId', data.userId, ddl)
	commit('SETTOKEN', data.token)
	commit('SETUSERID', data.userId)

}
export default {
	state: {
		token: '',
		userId: null
	},
	getters: {
		accessToken: state => state.token,
		userId: state => state.userId,
	},
	mutations: {
		SETTOKEN(state, data) {
			state.token = data
		},
		SETUSERID(state, data) {
			state.userId = data
		}
	},
	actions: {
		loginMpWeixin({
			commit
		}, partyData) {
			return new Promise((resolve, reject) => {
				loginApi.loginMpWeixin({
					form: {
						partyData
					}
				}).then(res => {
					storageLogin(commit, res)
					resolve(res)
				}).catch(e => {
					reject(e)
				})
			})
		},
		Login({
			commit
		}, data) {
			return new Promise((resolve, reject) => {
				loginApi.Login(data).then(res => {
					storageLogin(commit, res)
					resolve(res)
				}).catch(e => {
					reject(e)
				})
			})
		},
		outLogin({
			commit
		}, data) {
			return new Promise((resolve, reject) => {
				if (this.getters.userId) {
					storage.remove('AccessToken')
					storage.remove('userId')
					commit('SETTOKEN', '')
					commit('SETUSERID', null)
				}
			})

		}
	}
}
