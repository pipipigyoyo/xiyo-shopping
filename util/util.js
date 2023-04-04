// 节流函数
// 思路： 第一次先设定一个变量true，
// 第二次执行这个函数时，会判断变量是否true，
// 是则返回。当第一次的定时器执行完函数最后会设定变量为flase。
// 那么下次判断变量时则为flase，函数会依次运行。
export function throttle(fn, delay = 100) {
	// 首先设定一个变量，在没有执行我们的定时器时为null
	var timer = null
	return function() {
		// 当我们发现这个定时器存在时，则表示定时器已经在运行中，需要返回
		if (timer) return
		timer = setTimeout(() => {
			fn.apply(this, arguments)
			timer = null
		}, delay)
	}
}

export function debounce(fn, delay = 100) {
	let timer
	return function() {
		const that = this
		const _args = arguments // 存一下传入的参数
		if (timer) {
			clearTimeout(timer)
		}
		timer = setTimeout(function() {
			fn.apply(that, _args)
		}, delay)
	}
}
