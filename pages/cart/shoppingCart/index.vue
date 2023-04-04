<template>
	<view class="cart">
		<view class="header">
			<view class="goods-total">
				共<text class="num">{{cartTotal}}</text>件商品
			</view>
			<view class="editor" @click="onEditor">
				<view class="editMode" v-if="!editor">
					<uni-icons custom-prefix="iconfont" type="icon-bianji" size="28rpx" color="#303133"></uni-icons>
					<text class="editorFont">编辑</text>
				</view>
				<view class="editMode" v-else>
					<text class="editorFont" style="color: #fa2209;">完成</text>
				</view>
			</view>
		</view>
		<view class="cartList">
			<view class="cartItem" v-for="(item,index) in cartList" :key="item.id">
				<view class="checkbox">
					<u-checkbox-group :value="checkboxValue1" shape="circle" @change="checkboxChange(item.id)">
						<u-checkbox :name="item.id">
						</u-checkbox>
					</u-checkbox-group>
				</view>
				<view class="goodsImages">
					<u--image :src="item.goods.goods_image||''" width="200rpx" height="200rpx" :fade="false"></u--image>
				</view>
				<view class="goodsInfo">
					<view class="goods-title">
						<text>{{item.goods.goods_name}}</text>
					</view>
					<view class="skuList">
						<view class="skuItem" v-for="skuItem in item.goods.skuInfo.goods_props"
							:key="item.goods.skuInfo.goods_sku_id">
							{{skuItem.value.name}}
						</view>
					</view>
					<view class="price">
						<view class="goods-prices">
							<uni-icons custom-prefix="iconfont" type="icon-qianqian-" size="30rpx" color="#fa2209">
							</uni-icons><text class="goods-price">{{item.goods.skuInfo.goods_price}}</text>
						</view>
						<view class="goods-count">
							<u-number-box v-model="item.goods_num" :max="item.goods.stock_total"
								@change="valChange($event, item)">
							</u-number-box>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="blank">
			<view class="bottom">
				<view class="allCheckbox">
					<u-radio-group :value="groupValue" @change="groupChange">
						<u-radio label="全选" :name="true">
						</u-radio>
					</u-radio-group>
				</view>
				<view class="allAotal">
					<view class="allAotalfont">
						合计：
					</view>
					<view class="goods-prices">
						<uni-icons custom-prefix="iconfont" type="icon-qianqian-" size="30rpx" color="#fa2209">
						</uni-icons><text class="goods-price">{{allAotal}}</text>
					</view>
				</view>
				<view class="settlement-btn">
					<u-button :text="editor?'删除':'去结算'" shape="circle" @click="toAettlementOrClear"
						:disabled="checkboxValue1[0]?false:true"
						color="linear-gradient(to right, rgb(250, 35, 10), rgb(255, 99, 53))">
					</u-button>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		reqAddGoodsNum,
		reqClearGoodsNum
	} from '@/api/cart.js'
	import {
		debounce
	} from '@/util/util.js'
	export default {
		data() {
			return {
				checkboxValue1: [],
				groupValue: '',
				num: 0,
				requestStatus: false,
				allAotal: '0.00',
				editor: false,
				mode: 'cart'
			}
		},
		computed: {
			allCheckboxValue() {
				const newArr = this.cartList.filter(item => !this.checkboxValue1.some(item2 => item.id === item2))
				if (newArr.length) {
					return false
				} else {
					return true
				}
			}
		},
		props: {
			cartList: {
				type: Array,
				default: () => []
			},
			cartTotal: {
				type: Number,
				default: 0
			}
		},
		methods: {
			checkboxChange(n) {
				this.checkboxValue1.indexOf(n) === -1 ? this.checkboxValue1.push(n) : this
					.checkboxValue1 = this
					.checkboxValue1.filter(item =>
						item !== n
					)
				if (this.allCheckboxValue && this.num === 0) {
					this.groupValue = this.allCheckboxValue
					this.num++
				} else {
					this.groupValue = ''
					this.num = 0
				}
				this.onCalcTotalPrice()
			},
			groupChange(n) {
				if (!this.groupValue && this.num === 0) {
					this.checkboxValue1 = this.cartList.map(item => item.id)
					this.groupValue = this.allCheckboxValue
					this.num++
				} else {
					this.groupValue = ''
					this.num = 0
					this.checkboxValue1 = this.$options.data().checkboxValue1
				}
				this.onCalcTotalPrice()
			},
			valChange({
				value
			}, item) {
				if (item.goods_num == value) return
				// 记录一个节流函数句柄
				if (!item.debounceHandle) {
					item.oldValue = item.goods_num
					item.debounceHandle = debounce(this.onUpdateCartNum, 500)
				}
				// 更新商品数量
				item.goods_num = value
				// 提交更新购物车数量 (节流)
				item.debounceHandle(item, item.oldValue, value)
			},
			async onUpdateCartNum(item, oldValue, newValue) {
				this.$loadingToast('加载中')
				try {
					const result = await reqAddGoodsNum(item.goods_id, newValue, item.goods_sku_id)
					this.$emit("update:cartTotal", result.data.cartTotal);
					this.onCalcTotalPrice()
					item.debounceHandle = null
					uni.hideLoading();
				} catch (e) {
					item.goods_num = oldValue
					setTimeout(() => {
						uni.hideLoading()
						this.$Toast(e.message)
					}, 200)

				}
			},
			onCalcTotalPrice() {
				let total = 0
				this.cartList.forEach(item => {
					if (this.checkboxValue1.some(item2 => item2 === item.id)) {
						total += (item.goods.skuInfo.goods_price * 100) * item.goods_num
					}
				})
				this.allAotal = (total / 100).toFixed(2)
			},
			onEditor() {
				this.editor = !this.editor
			},
			async toAettlementOrClear() {
				if (this.editor && this.checkboxValue1.length) {
					this.$loadingToast('加载中', () => {
						const result = reqClearGoodsNum(this.checkboxValue1).then(res => {
							this.$emit('refreshPage')
							this.checkboxValue1 = this.$options.data().checkboxValue1
							this.allAotal = this.$options.data().allAotal
							this.editor = false
						}).catch(e => {
							this.$Toast(e.message)
						}).finally(() => {
							uni.hideToast();
						})

					})
				} else if (!this.editor && this.checkboxValue1.length) {
					const that = this
					let cartIds = this.checkboxValue1.toString()
					uni.navigateTo({
						url: `/pages/checkout/index?mode=${that.mode}&cartIds=${cartIds}`
					});
				}
			}
		}
	}
</script>

<style scoped>
	/* .cart {
		padding: 0 16rpx
	} */

	.cartList {
		box-sizing: border-box;
		width: 100%;
		padding: 0 16rpx
	}

	.cartItem {
		box-sizing: border-box;
		display: flex;
		padding: 30rpx 16rpx;
		border-radius: 12rpx;
		/* align-items: center; */
		width: 100%;
		height: 260rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
	}

	.checkbox {
		display: flex;
		margin-right: 10rpx;
		align-items: center;
	}

	.goodsInfo {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		flex: 1;
		padding-left: 24rpx;
	}

	.goods-title {
		height: 65rpx;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		padding: 6rpx;
		color: #484848;
		font-size: 26rpx;
	}

	.skuList {
		display: flex;
	}

	.skuItem {
		padding: 4rpx 16rpx;
		border-radius: 12rpx;
		background-color: #f5f5f5;
		color: #ababab;
		font-size: 24rpx;
		margin-right: 14rpx;
	}

	.goods-prices {
		display: flex;
		align-items: center;

	}

	.goods-price {
		color: #fa2209;
		font-size: 30rpx;
	}

	.price {
		display: flex;
		justify-content: space-between;
	}

	.header {
		display: flex;
		box-sizing: border-box;
		align-items: center;
		padding: 20rpx 16rpx;
		justify-content: space-between;
	}

	.goods-total {
		font-size: 28rpx;
		color: #333;
	}

	.num {
		color: #fa2209;
	}

	.editMode {
		font-size: 28rpx;
		color: #333;
	}

	.editorFont {
		margin-left: 10rpx;
	}

	.blank {
		position: relative;
		bottom: 0;
		height: 100rpx;
		width: 100%;
	}

	.bottom {
		display: flex;
		position: fixed;
		align-items: center;
		box-sizing: border-box;
		bottom: 0;
		height: 100rpx;
		width: 100%;
		background-color: #fff;
		padding: 0 30rpx;
		justify-content: space-between;
		z-index: 999;
	}

	.allAotal {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex: 1;
		margin-right: 20rpx;
	}

	.settlement-btn {
		height: 72rpx;
		width: 200rpx;
		color: #fff;
		border-radius: 25px;
		font-size: 28rpx;
	}

	.allAotalfont {
		color: #303133;
		font-size: 28rpx;
	}
</style>
