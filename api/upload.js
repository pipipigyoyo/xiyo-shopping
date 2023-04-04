import request from "@/util/request/request.js"

export const image = (files) => {
	const maxSize = 1024 * 1024 * 2
	return new Promise((resolve, reject) => {
		request.urlFileUpload({
				files,
				maxSize
			})
			.then(result => resolve(result.map(item => item.data.fileInfo.file_id), result))
			.catch(reject)
	})
}
