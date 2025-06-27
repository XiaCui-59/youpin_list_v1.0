<template>
	<view class="employer_mine">
		<u-navbar title="我的" :safeAreaInsetTop="true" :titleStyle="{lineHeight:'44px',color:'#fff'}"
			bgColor="transparent">
		</u-navbar>
		<view class="main_body">
			<view class="head" :style="{paddingTop:marginTop+tabMargin+'px'}">
				<view class="base_info flex flex_btween">
					<view class="base flex">
						<button class="logo" open-type="chooseAvatar" @chooseavatar="getAvatar">
							<image :src="workerInfo.avatar.url?workerInfo.avatar.url:avatar" mode="widthFix"></image>
						</button>
						<view class="info">
							<view class="name">{{workerInfo.name}}</view>
							<view class="labels flex">
								<view class="label">
									{{gender.filter(el=>{return el.value == workerInfo.gender})[0]?gender.filter(el=>{return el.value == workerInfo.gender})[0].text:""}}
								</view>
								<view class="label" v-if="workerInfo.age">{{workerInfo.age}}</view>
								<view class="label" v-if="workerInfo.nation">{{workerInfo.nation}}</view>
							</view>
						</view>
					</view>
					<view class="btn_right flex flex_end" @click="navigate('/subpkg/edit_info/edit_info')">
						<view class="text">个人信息</view>
						<u-icon name="arrow-right" color="#FFFFFF" size="14"></u-icon>
					</view>
				</view>
				<view class="datas flex">
					<view class="data" @click="navigate('/subpkg/view_record/view_record')">
						<view class="text">沟通过</view>
						<view class="count">{{viewCount}}</view>
					</view>
					<view class="data" @click="navigate('/subpkg/sign_record/sign_record')">
						<view class="text">已报名</view>
						<view class="count">{{signCount}}</view>
					</view>
				</view>
			</view>
			<view class="box" @click="toRelease">
				<view class="box_inner text">
					<view class="tit flex"><text style="margin-right: 10rpx;display: inline-block;">我要招人</text><u-icon
							name="play-right-fill" color="#9baff0" size="12"></u-icon></view>
					<view class="tips">身份一键切换，海量人才等你来选</view>
					<image :src="imgUrl+'/worker/v_list/ic_zhao.png'" mode="widthFix" style="width:115rpx;"></image>
				</view>
			</view>
			<view class="box">
				<view class="box_inner menu_box">
					<u-grid :border="false" col="4">
						<u-grid-item v-for="(listItem,listIndex) in menus" :key="listIndex" @click="handleMenuClick">
							<image :src="listItem.iconUrl" mode="widthFix" style="width:76rpx;"></image>
							<text class="grid-text">{{listItem.text}}</text>
						</u-grid-item>
					</u-grid>
				</view>
			</view>

		</view>
		<view class="fixed_btn" :style="{bottom:tabbarHeight+19+'px'}" @click="logout">退出登录</view>
		<myModal ref="myModal">
		</myModal>
		<showBooking ref="book"></showBooking>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex"
	import showBooking from "@/components/showBooking.vue"
	const app = getApp()
	export default {
		props: ["tabbarHeight"],
		data() {
			return {
				gender: [{
					value: "male",
					text: "男"
				}, {
					value: "female",
					text: "女"
				}, {
					value: "unknown",
					text: "未知"
				}],
				signCount: 0,
				viewCount: 0,
				imgUrl: app.globalData.baseImageUrl,
				pageName: "我的",
				marginTop: app.globalData.marginTop,
				tabMargin: app.globalData.tabMargin,
				avatar: app.globalData.baseImageUrl + "/broker/com_default.png",
				menus: [{
						text: "进群找活",
						iconUrl: app.globalData.baseImageUrl + "/worker/v_list/ic_mine_menu01.png",
						clickType: "navigate",
						url: "/worker/webview/webview"
					},
					{
						text: "关注公众号",
						iconUrl: app.globalData.baseImageUrl + "/worker/v_list/ic_mine_menu02.png",
						clickType: "public",
						url: ""
					}, {
						text: "联系客服",
						iconUrl: app.globalData.baseImageUrl + "/worker/v_list/ic_mine_menu03.png",
						clickType: "kefu",
						url: ""
					}, {
						text: "关于我们",
						iconUrl: app.globalData.baseImageUrl + "/worker/v_list/ic_mine_menu04.png",
						clickType: "navigate",
						url: "/subpkg/about/about"
					}
				]
			}
		},
		components: {
			showBooking
		},
		created() {
			this.headerHeight = app.globalData.systemHeight * (214 / 844)
		},
		computed: {
			...mapState(["workerInfo"])
		},
		methods: {
			...mapMutations(["setToken", "setRole", "unConnected", "unConnecting", "closeAnswering", "openCansend",
				"closeAnswerContinue"
			]),
			getSignList() {
				let url = "/worker/job-applications?page=1&status=all"
				this.$request(url).then(res => {
					if (res.code == 0) {
						this.signCount = res.data.pagination.total_count
					}
				})
			},
			getViewList() {
				let url = "/worker/job-browse-records?page=1"
				this.$request(url).then(res => {
					if (res.code == 0) {
						this.viewCount = res.data.pagination.total_count
					}
				})
			},
			handleMenuClick(e) {
				switch (this.menus[e].clickType) {
					case "navigate":
						this.navigate(this.menus[e].url)
						break;
					case "public":
						this.$refs.book.getCode()
						break;
					case "kefu":
						this.openKefu()
						break;
					default:
						break;
				}
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
			closeLogin() {
				this.showLogin = false
			},
			cancelLogin() {
				console.log("执行了cancel")
				this.closeLogin()
				uni.switchTab({
					url: "/pages/employer_index/employer_index"
				})
			},
			toRelease() {
				let _this = this
				this.$refs.myModal.showMyModal({
					title: "是否确认切换到招人状态？",
					success(res) {
						if (res == "confirm") {
							uni.showLoading({
								title: "切换中"
							})
							// 移除本地token
							uni.removeStorageSync("token")
							uni.removeStorageSync("workerInfo")
							let openid = uni.getStorageSync("openid")
							_this.unConnected()
							_this.unConnecting()
							_this.closeAnswerContinue()
							_this.closeAnswering()
							_this.openCansend()
							// 重新获取发布客户端的token
							let url = "/auth/ai-wechat/employer/token"
							let data = {
								open_id: openid
							}
							_this.$request(url, data, "POST").then(resp => {
								if (resp.code == 0) {
									_this.setToken(resp.data.token)
									_this.setRole("employer")
									uni.setStorageSync("token", resp.data.token)
									_this.$store.dispatch("getEmployerInfo")
									uni.reLaunch({
										url: "/pages/employer_index/employer_index",
										success(respo) {
											console.log("跳转成功", respo)
										},
										fail(err) {
											console.log("跳转失败", err)
										},
										complete() {
											uni.hideLoading()
										}
									})
								} else {
									_this.$refs.myModal.showMyModal({
										title: resp.msg
									})
								}
							})
						}
					}
				})
			},
			logout() {
				let _this = this
				this.$refs.myModal.showMyModal({
					title: "确认退出登录？",
					success(res) {
						if (res == "confirm") {
							uni.setStorageSync("loginStatus", "out")
							uni.switchTab({
								url: "/pages/worker_index/worker_index"
							})
							uni.showToast({
								title: "已退出登录",
								icon: "none",
								duration: 2000
							})
						}
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
						url: app.globalData.baseUrl + "/worker/upload/image?type=avatar",
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
								_this.$request("/worker/avatar", data, "POST").then(res => {
									if (res.code == 0) {
										uni.showToast({
											title: "头像更新成功",
											duration: 2000
										})
										_this.$store.dispatch('getWorkerInfo');
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
	.fixed_btn {
		width: calc(100% - 56rpx);
		left: 28rpx;
		position: fixed;
		z-index: 99;
		height: 81rpx;
		line-height: 81rpx;
		border-radius: 15rpx;
		border: 2rpx solid #DCDCDC;
		text-align: center;
		font-size: 29rpx;
		color: #A0A0A0;
	}

	.main_body {
		min-height: 100vh;
		background: #f3f3f5;

		.box {
			padding: 0 28rpx;

			.box_inner {
				margin-top: 30rpx;
				background: #FFFFFF;
				border-radius: 19rpx;
			}

			.text {
				padding: 18rpx 0 18rpx 32rpx;
				background: url($back-ground-url+"/worker/v_list/mine_zhao_bg.png") no-repeat;
				background-size: 100% 100%;
				color: #3B487D;
				position: relative;

				&>image {
					position: absolute;
					top: 50%;
					right: 59rpx;
					transform: translateY(-50%);
				}

				.tit {
					font-weight: 600;
					font-size: 35rpx;
				}

				.tips {
					margin-top: 6rpx;
					font-size: 23rpx;
					color: #3B487D;
				}

			}

			.menu_box {
				padding: 30rpx 44rpx;

				.grid-text {
					font-size: 27rpx;
					color: #333333;
					line-height: 54rpx;
				}
			}
		}



		.head {
			padding-bottom: 22rpx;
			background: url($back-ground-url+"/worker/v_list/mine_head_bg.png") no-repeat;
			background-size: cover;
			color: #fff;

			.datas {
				position: relative;

				&:before {
					content: "";
					width: 2rpx;
					height: 29rpx;
					background: #E7E7E8;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}

				.data {
					width: 50%;
					text-align: center;

					.text {
						font-size: 27rpx;
						margin-bottom: 10rpx;
					}

					.count {
						font-family: Arial;
						font-weight: 900;
						font-size: 38rpx;
						color: #FFFFFF;
						text-shadow: 0px 3px 4px #000000;
						letter-spacing: 3rpx;
					}
				}
			}

			.base_info {
				padding: 0 38rpx 0 51rpx;
				margin-bottom: 40rpx;

				.name {
					font-weight: 600;
					font-size: 32rpx;
					margin-bottom: 10rpx;
				}

				.label {
					font-size: 27rpx;
					color: #D4D4D4;
					margin-right: 27rpx;
				}

				.btn_right {
					font-weight: 600;
					font-size: 27rpx;

					.text {
						margin-right: 11rpx;
					}
				}
			}
		}

		.logo {
			width: 100rpx;
			height: 100rpx;
			border: 6rpx solid #fff;
			flex-shrink: 0;
			border-radius: 50%;
			overflow: hidden;
			margin-right: 20rpx;
			padding-left: 0;
			padding-right: 0;
			margin-left: 0;

			image {
				width: 100%;
			}
		}
	}
</style>