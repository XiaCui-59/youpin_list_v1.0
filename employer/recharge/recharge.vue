<template>
	<view class="single_page" v-if="ifSingle">
		<image :src="imgUrl+'/worker/single_page.png'" mode="widthFix" style="width: 100%;"></image>
	</view>
	<view class="content" v-else>
		<customHeader :title="pageName" :showBack="true" bgUrl="/broker/bg_2.png" :headHeight="headerHeight"
			:showScan="true"></customHeader>
		<view class="box" :style="{top:boxTop+'px'}">
			<view class="title">充值到钱包(元)</view>
			<u--input v-model="price" prefixIcon="rmb" prefixIconStyle="font-size: 40rpx;font-weight:700;color: #303030"
				type="digit" placeholder="请输入充值金额" border="none" fontSize="38rpx" placeholderStyle="color:#9E9E9E"
				color="#333" customStyle="height:54rpx;padding:10rpx 0;border-bottom:2rpx dotted #F3F3F5;"
				clearable></u--input>
			<view class="item_wrap flex flex_btween">
				<view class="item" :class="Number(price)==item.value?'active':''" v-for="(item,index) in priceList"
					:key="index" @click="changePrice(item)">{{item.text}}</view>
			</view>
			<view class="btn_y" :class="btnStatus?'':'grey'"
				:style="{height:subTabHeight+'px',lineHeight:subTabHeight+'px',marginTop:'50rpx',marginBottom:'30rpx'}"
				@click="sureRecharge">
				充值
			</view>
		</view>
		<customModal :title="modalTitle" :content="modalContent" :bgUrl="modalBg" :iconUrl="modalIcon"
			:imageUrl="imageUrl" :iconPosition="iconPosition" v-if="showModal" :showCancel="showCancel"
			:showConfirm="showConfirm" @confirm="handleConfirm" @cancel="handleCancel" @closeModal="closeModal">
		</customModal>

	</view>
</template>

<script>
	import login from "@/components/employer_login.vue"
	import customHeader from "@/components/custom_header.vue"
	import commonData from "@/common/commonData"
	const app = getApp()
	export default {
		data() {
			return {
				ifSingle: app.globalData.scene == 1154 ? true : false,
				btnStatus: true,
				imgUrl: app.globalData.baseImageUrl,
				pageName: "充值",
				marginTop: app.globalData.marginTop,
				subTabHeight: app.globalData.subTabHeight,
				tabMargin: app.globalData.tabMargin,
				headerHeight: app.globalData.topHeight,
				boxTop: 0,
				price: "",
				priceList: [{
					value: 100,
					text: "100元"
				}, {
					value: 200,
					text: "200元"
				}, {
					value: 300,
					text: "300元"
				}, {
					value: 500,
					text: "500元"
				}, {
					value: 1000,
					text: "1000元"
				}, {
					value: 2000,
					text: "2000元"
				}]
			}
		},
		components: {
			customHeader,
			login
		},
		onLoad() {
			if (!this.isLogin()) {
				uni.switchTab({
					url: "/pages/employer_index/employer_index"
				})
				return
			}
			this.boxTop = this.marginTop + this.tabMargin
		},
		methods: {
			changePrice(item) {
				this.price = item.value
			},
			sureRecharge() {
				if (!this.price) {
					uni.showToast({
						title: "请输入充值金额",
						icon: "error"
					})
					return
				}
				if (this.btnStatus) {
					uni.showLoading()
					this.btnStatus = false
					let data = {
						"amount": this.price,
						"payment_method": "wechat_mini_program",
					}
					this.$request("/employer/recharges", data, "POST").then(res => {
						uni.hideLoading()
						if (res.code == 0) {
							this.surePay(res.data.order_id)
						}
					})
				} else {
					uni.showToast({
						title: "请勿重复点击",
						icon: "error"
					})
				}

			},
			surePay(id) {
				let _this = this
				let url = "/employer/orders/" + id + "/pay"
				this.$request(url, {}, "POST").then(res => {
					if (res.code == 0) {
						let resData = res.data.wechat_mini_program
						uni.requestPayment({
							"appId": resData.appId,
							"timeStamp": resData.timeStamp, //时间戳
							"nonceStr": resData.nonceStr, //随机字符串
							"package": resData.package, //prepay_id
							"signType": resData.signType, //签名算法MD5
							"paySign": resData.paySign, //签名s,
							success() {
								uni.showModal({
									title: "支付成功",
									showCancel: false,
									success(resp) {
										if (resp.confirm) {
											_this.back()
										}
									}
								})
							},
							fail(err) {
								console.log(err, "err")
								uni.showToast({
									title: "支付已取消",
									icon: "error",
									duration: 2000
								})
							},
							complete() {
								_this.btnStatus = true
							}

						})
					}
				})
			},
			back() {
				uni.navigateBack()
				let pages = getCurrentPages()
				let prevPage = pages[pages.length - 2]
				console.log(prevPage)
				if (prevPage && ((prevPage.route.indexOf("release") != -1) || (prevPage.route.indexOf("project_detail") !=
						-1) || (prevPage.route.indexOf("employer_index") != -1)) && prevPage.$vm && prevPage.$vm
					.checkBalance) {
					// 回到release页面,并执行余额查询
					prevPage.$vm.checkBalance();
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		height: 100vh;
		background: #F3F3F5;
	}



	.box {
		position: fixed;
		width: calc(100% - 96rpx);
		left: 48rpx;
		z-index: 99;
		border-radius: 16rpx;
		background: #fff;
		padding: 50rpx;
		box-sizing: border-box;
		box-shadow: 0rpx 2rpx 6rpx 0rpx rgba(0, 0, 0, 0.15);

		.title {
			font-weight: 400;
			font-size: 29rpx;
			color: #333333;
			line-height: 40rpx;
			text-align: center;
			margin-bottom: 60rpx;
		}

		.item_wrap {
			margin-top: 20rpx;
			flex-wrap: wrap;

			.item {
				width: 31%;
				height: 88rpx;
				line-height: 88rpx;
				text-align: center;
				background: rgba(247, 188, 5, .1);
				border-radius: 4rpx;
				font-weight: 600;
				font-size: 35rpx;
				color: $em-base-color;
				margin-bottom: 20rpx;

				&.active {
					background: $em-base-color;
					color: #fff;
				}
			}
		}
	}
</style>