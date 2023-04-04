import config from "@/util/request/config.js"
import qs from "qs"
import store from "@/store/index.js"
import {
	urlUpload,
	mergeConfig
} from "@/util/request/upload/utils.js"

const request = (options) => {
	options.url = options.url || ''
	const params = qs.stringify(options.params)
	if (params !== '') {
		options.url = options.url + '?' + params
	}
	return new Promise((resolve, reject) => {
		uni.request({
			url: config.host + options.url,
			method: options.methods || 'get',
			data: options.data || {},
			header: {
				storeId: 10001,
				platform: 'MP-WEIXIN',
				'Access-Token': store.getters.accessToken
			},
			success: (res) => {
				if (res.data.status === 200) {
					resolve(res.data)
				}
				if (res.data.status === 401) {
					store.dispatch('outLogin')
					reject(res.data)
				}
				if (res.data.status === 500)
					reject(res.data)
			},
			fail: (err) => {
				uni.showToast({
					title: err.errMsg,
					icon: "none",
					duration: 3500
				})
			}
		})
	})
}

/* request.urlFileUpload = async () => {
	let requestInfo = {
		method: "FILE"
	};
	if (arguments[0]) {
		if (typeof(arguments[0]) == "string") {
			requestInfo.url = arguments[0];
		} else if (typeof(arguments[0]) == "object") {
			requestInfo = Object.assign(requestInfo, arguments[0]);
		}
	}
	if (arguments[1] && typeof(arguments[1]) == "object") {
		requestInfo = Object.assign(requestInfo, arguments[1]);
	}
	if (!requestInfo.url && this.defaultUploadUrl) {
		requestInfo.url = this.defaultUploadUrl;
	}
	// 请求数据
	// 是否运行过请求开始钩子
	let runRequestStart = false;
	try {
		if (!requestInfo.url) {
			throw {
				errMsg: "【request】文件上传缺失数据url",
				statusCode: 0,
				data: requestInfo.data,
				method: requestInfo.method,
				header: requestInfo.header,
				url: requestInfo.url,
			}
		}
		// 数据合并
		requestInfo = mergeConfig(this, requestInfo);
		// 代表之前运行到这里
		runRequestStart = true;
		//请求前回调
		if (this.requestStart) {
			let requestStart = this.requestStart(requestInfo);
			if (typeof requestStart == "object") {
				let changekeys = ["data", "header", "isPrompt", "load", "isFactory", "files"];
				changekeys.forEach(key => {
					requestInfo[key] = requestStart[key];
				});
			} else {
				throw {
					errMsg: "【request】请求开始拦截器未通过",
					statusCode: 0,
					data: requestInfo.data,
					method: requestInfo.method,
					header: requestInfo.header,
					url: requestInfo.url,
				}
			}
		}
		let requestResult = await urlUpload(requestInfo, this.dataFactory);
		return Promise.resolve(requestResult);
	} catch (err) {
		this.requestError && this.requestError(err);
		return Promise.reject(err);
	} finally {
		if (runRequestStart) {
			this.requestEnd && this.requestEnd(requestInfo);
		}
	}
} */



export default request
