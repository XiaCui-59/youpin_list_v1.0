<template>
	<view class="single_page" v-if="ifSingle">
		<image :src="imgUrl+'/worker/single_page.png'" mode="widthFix" style="width: 100%;"></image>
	</view>
	<view class="content" v-else>
		<employerMine v-if="currentRole=='employer'"></employerMine>
		<workerMine ref="worker" v-if="currentRole=='worker'" :tabbarHeight="tabbarHeight"></workerMine>
		<login v-if="currentRole=='employer'" :showLogin="showLogin" @cancel="cancelLogin" @closeLogin="closeLogin"
			@getInfo="getInfo">
		</login>
		<workerLogin v-if="currentRole=='worker'" :showLogin="showLogin" @cancel="closeWorkerLogin"
			@closeLogin="closeLogin" @getInfo="getInfo"></workerLogin>
		<tabbar v-if="currentRole=='employer'" current="2" @getTabbarHeight="getTabbarHeight" :todo="todo"></tabbar>
		<workerTabbar v-if="currentRole=='worker'" current="2" @getTabbarHeight="getTabbarHeight"></workerTabbar>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex"
	import workerMine from "@/components/worker_mine.vue"
	import employerMine from "@/components/employer_mine.vue"
	import login from "@/components/employer_login.vue"
	import workerLogin from "@/components/login.vue"
	import tabbar from "@/components/tabbar.vue"
	import workerTabbar from "@/components/worker_tabbar.vue"
	import customHeader from "@/components/custom_header.vue"
	import addName from "@/components/addName.vue"

	const app = getApp()
	export default {
		data() {
			return {
				ifSingle: app.globalData.scene == 1154 ? true : false,
				imgUrl: app.globalData.baseImageUrl,
				pageName: "我的",
				marginTop: app.globalData.marginTop,
				tabMargin: app.globalData.tabMargin,
				mineCardHeight: app.globalData.mineCardHeight,
				scrollHeight: 0,
				boxTop: 0,
				headerHeight: app.globalData.highTopHeight,
				maskInnerTop: 0,
				avatar: app.globalData.baseImageUrl + "/broker/com_default.png",
				baseStatus: [{
						value: "pending",
						text: "审核中",
						btnText: ""
					},
					{
						value: "approved",
						text: "已认证",
						btnText: ""
					},
					{
						value: "rejected",
						text: "认证失败",
						btnText: "重新认证"
					}
				],
				twoStatus: [{
						value: "not_uploaded",
						text: "未上传"
					},
					{
						value: "pending",
						text: "待审"
					},
					{
						value: "approved",
						text: "审核通过"
					},
					{
						value: "rejected",
						text: "审核拒绝"
					}
				],
				info: {
					"company_name": "",
					"basic_verify_status": ""
				},
				tabbarHeight: 0,
				mineTop: app.globalData.mineTop,
				todo: 0,
				showLogin: false,
			}
		},
		components: {
			tabbar,
			customHeader,
			login,
			addName,
			employerMine,
			workerLogin,
			workerTabbar,
			workerMine
		},
		watch: {
			// currentRole(newVal) {
			// 	console.log("question newVal：", newVal)
			// 	if (!newVal) {
			// 		this.showSend = false
			// 	} else {
			// 		this.showSend = true
			// 	}
			// },
		},
		async onLoad() {
			this.boxTop = this.marginTop + (0.56 * this.mineCardHeight) + this.tabMargin
			this.scrollHeight = app.globalData.systemHeight - this.boxTop - this
				.tabbarHeight - 4 * this.tabMargin
		},
		computed: {
			...mapState(["employerInfo", "nameShow", "loginStatus", "workerInfo", "currentRole"])
		},
		async onShow() {
			if (this.isLogin()) {
				// this.currentRole = uni.getStorageSync("currentRole")
				// console.log("currentRole", this.currentRole)
				if (this.currentRole == "employer") {
					this.$store.dispatch("getEmployerInfo")
				} else {
					this.$store.dispatch("getWorkerInfo")
					this.$refs.worker.getSignList()
					this.$refs.worker.getViewList()
				}
			} else {
				this.showLogin = true
			}
		},
		methods: {
			...mapMutations(["setToken"]),
			getTabbarHeight(e) {
				this.tabbarHeight = e
			},
			openKefu() {
				wx.openCustomerServiceChat({
					extInfo: {
						url: "https://work.weixin.qq.com/kfid/kfc01b1c6e379607409"
					},
					corpId: 'wwe3ced2e65390ad79',
					success(res) {},
					fail(err) {
						console.log(err)
						uni.showToast({
							title: "请稍后重试",
							icon: "none"
						})
					}
				})
			},
			navigate(url) {

				uni.navigateTo({
					url: url
				})
			},
			getInfo() {
				if (this.currentRole == "employer") {
					this.$store.dispatch("getEmployerInfo")
				} else {
					this.$store.dispatch("getWorkerInfo")
					this.$refs.worker.getSignList()
					this.$refs.worker.getViewList()
				}
			},
			closeLogin() {
				this.showLogin = false
			},
			closeWorkerLogin() {
				this.showLogin = false
				uni.switchTab({
					url: "/pages/worker_index/worker_index"
				})
			},
			cancelLogin() {
				this.closeLogin()
				uni.switchTab({
					url: "/pages/employer_index/employer_index"
				})
			},
			close() {
				this.showMask = false
			},
			copyLink() {
				let _this = this
				uni.setClipboardData({
					data: "https://swiftwd.com",
					success() {
						_this.close()
					}
				})
			},
			async loadimg(type, filePath) {
				console.log(filePath, "file")
				var _this = this;
				let header = {
					"Authorization": "bearer " + uni.getStorageSync("token"),
					"accept": "application/json",
					"content-type": "multipart/form-data"
				}
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: app.globalData.baseUrl + "/employer/upload/image?type=avatar",
						filePath: filePath,
						name: "file",
						header: header,
						success(resp) {
							var response = JSON.parse(resp.data);
							if (response.code == 0) {
								uni.showToast({
									title: "图片上传成功"
								})
								let data = {
									avatar: response.data.key
								}
								_this.$request("/employer/avatar", data, "POST").then(res => {
									if (res.code == 0) {
										uni.showToast({
											title: "头像更新成功",
											duration: 2000
										})
										_this.getInfo()
									}
								})
							} else {
								uni.showModal({
									title: "上传失败",
									content: response.msg
								})
							}
						},
						complete() {
							uni.hideLoading();
						}
					})
					resolve(_this.reponsefiles)
				})
			},
			// 获取头像
			getAvatar(e) {
				console.log(e)
				this.loadimg("avatar", e.detail.avatarUrl)
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep {
		.u-navbar--fixed {
			// background: linear-gradient(180deg, #9EC2FF 0%, #FFFFFF 100%);
		}

		.u-tabs__wrapper__nav__item {
			padding: 0 !important;
		}

		.u-navbar__content__left {
			display: none !important;
		}
	}

	.top_area {
		width: calc(100% - 96rpx);
		position: fixed;
		left: 48rpx;
		z-index: 87;

		&>image {
			width: 100%;
			will-change: transform;
		}

		.top {
			position: absolute;
			top: 3%;
			left: 50%;
			transform: translateX(-50%);
			width: calc(100% - 80rpx);
			padding: 20rpx 0;

			&>image {
				width: 168rpx;
				position: absolute;
				top: 50%;
				left: 84%;
				will-change: transform;
			}

			.logo {
				border-radius: 50%;
				overflow: hidden;
				margin-right: 20rpx;
				padding-left: 0;
				padding-right: 0;
				margin-left: 0;
			}

			.info {
				width: calc(100% - 220rpx);
				position: relative;

				.name {
					font-weight: 600;
					font-size: 34rpx;
					color: #333333;
					line-height: 48rpx;
					text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2);
					margin-bottom: 16rpx;
					white-space: nowrap;
				}

				.status {
					.sta_text {
						font-weight: 600;
						font-size: 34rpx;
						color: #FFFFFF;
						line-height: 48rpx;
						text-shadow: 0px 1px 2px rgba(52, 35, 0, 0.76);
					}

					.btn {
						width: 160rpx;
						height: 56rpx;
						line-height: 56rpx;
						background: #F7BB05;
						box-shadow: 0px 1px 2px 0px rgba(146, 110, 2, 0.5);
						border-radius: 44rpx;
						border: 1px solid #F7BB05;
						color: #333;
						font-size: 28rpx;
						text-align: center;
						margin-top: 0;
						margin-bottom: 0;
					}
				}
			}
		}
	}

	.box {
		position: fixed;
		width: 100%;
		left: 0rpx;
		z-index: 89;
		background: url($back-ground-url+"/broker/ic_mine_bg.png") no-repeat;
		background-size: 100% 100%;
		overflow: scroll;
		padding: 0 48rpx 0 48rpx;
		box-sizing: border-box;


		.line {
			margin-bottom: 30rpx;

			.item {
				width: 48%;
				padding: 20rpx;
				box-sizing: border-box;
				background: #fff;
				border-radius: 20rpx;

				.item_top {
					image {
						width: 50rpx;
						height: 50rpx;
						margin-right: 8rpx;
					}

					.text {
						color: #333;
						font-size: 28rpx;
					}
				}

				.item_middle {
					font-size: 24rpx;
					color: #9E9E9E;
					margin-top: 10rpx;
					margin-bottom: 20rpx;
				}

				.item_bot {
					font-size: 0;

					image {
						width: 100%;
						will-change: transform;
					}
				}
			}
		}
	}

	.mask {
		.inner {
			width: 71%;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			text-align: center;

			.bg {
				width: 100%;
				position: relative;
				top: 0;
				left: 0;
			}

			image {
				width: 175rpx;
				height: 175rpx;
				position: absolute;
				top: 4%;
				left: 62rpx;
			}

			.info {
				position: absolute;
				top: 44%;
				left: 62rpx;

				.tit {
					font-size: 36rpx;
					color: #FFB103;
					font-weight: bold;
				}

				.text {
					margin: 20rpx 0 56rpx 0;
					font-size: 28rpx;
					color: #333333;
				}

				.btn {
					height: 88rpx;
					line-height: 88rpx;
					background: #F7BC05;
					box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.15);
					border-radius: 16rpx;
					color: #fff;
				}
			}

		}
	}
</style>