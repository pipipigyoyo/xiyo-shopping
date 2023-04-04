import store from '@/store'
import storage from '@/util/storage'

export default function Initializer() {
	store.commit('SETTOKEN', storage.get('AccessToken'))
	store.commit('SETUSERID', storage.get('userId'))
}
