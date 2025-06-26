<template>
	<view class="worker_mine">
		<!-- 自定义导航栏 -->
		<u-navbar :safeAreaInsetTop="true" bgColor="transparent">
			<view class="u-nav-slot flex flex-start" slot="left">
				<view class="ic_menu">
					<image :src="imgUrl+'/worker/v_list/text_logo.png'" mode="heightFix" style="height:33px;"></image>
				</view>
			</view>
		</u-navbar>
		<view class="cont" :style="{marginTop:marginTop+'px'}">
			<view class="top_area" :style="{top:marginTop+'px'}">
				<view class="top flex flex-start" :style="{marginTop:tabMargin+'px',marginBottom:tabMargin+'px'}">
					<button class="logo" open-type="chooseAvatar" @chooseavatar="getAvatar"
						:style="{width:avatarHeight + 'px',height:avatarHeight + 'px'}">
						<image :src="workerInfo.avatar?workerInfo.avatar:imgUrl+'/worker/worker_default.png'"
							style="border-radius: 50%;background: #fff;"
							:style="{width:avatarHeight + 'px',height:avatarHeight + 'px'}"></image>
					</button>
					<view class="info flex flex_btween">
						<view class="name">
							<text>{{workerInfo.name?workerInfo.name:"微信用户"}}</text>
							<view class="tel">{{workerInfo.mobile}}</view>
						</view>
						<view class="status flex flex-end" v-if="workerInfo.id_card_number">
							<image :src="imgUrl+'/worker/ic_veri.png'" mode="" v-if="workerInfo.fadada_authorized">
							</image>
							<view class="sta_text">{{workerInfo.fadada_authorized?"已实名":"待授权"}}</view>
							<view class="btn" v-if="!workerInfo.fadada_authorized" @click="toAuth">去授权</view>
						</view>
						<view class="status flex flex-end" v-if="!workerInfo.id_card_number">
							<view class="btn" @click="navigate('/subpkg/authentication/authentication')">完善信息</view>
						</view>
					</view>
				</view>
			</view>
			<view class="box" :style="{top:mineTop+'px',height:scrollHeight+'px',paddingTop:0}">
				<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" :style="{height:scrollHeight+'px',boxSizing:'border-box',position:'fixed',top:innerBoxTop+'px',left:'50%',
					transform:'translateX(-50%)',background:'#fff',borderRadius:'16rpx',padding:'30rpx',width:'90%'}">
					<view class="line flex flex_btween">
						<view class="item" @click="navigate('/subpkg/my_contracts/my_contracts')">
							<view class="item_top flex flex-start">
								<image :src="imgUrl+'/broker/ic_mine_rele.png'" mode="widthFix"></image>
								<view class="text">我的合同</view>
							</view>
							<view class="item_middle">权益保障，上班无忧</view>
							<view class="item_bot">
								<image :src="imgUrl+'/broker/ic_mine_rele_bg.png'" mode="widthFix"></image>
							</view>
						</view>
						<view class="item" @click="navigate('/subpkg/salary_list/salary_list')">
							<view class="item_top flex flex-start">
								<image :src="imgUrl+'/worker/zhida/ic_mine_yen.png'" mode="widthFix"></image>
								<view class="text">工资记录</view>
							</view>
							<view class="item_middle">小金库又充实啦</view>
							<view class="item_bot">
								<image :src="imgUrl+'/worker/zhida/ic_mine_salary_bg.png'" mode="widthFix"></image>
							</view>
						</view>
						<!-- <view class="item" @click="navigate('/subpkg/my_info/my_info')">
							<view class="item_top flex flex-start">
								<image :src="imgUrl+'/broker/ic_mine_info.png'" mode="widthFix"></image>
								<view class="text">我的名片</view>
							</view>
							<view class="item_middle">实名认证，多重保障</view>
							<view class="item_bot">
								<image :src="imgUrl+'/broker/ic_mine_info_bg.png'" mode="widthFix"></image>
							</view>
						</view> -->
					</view>
					<view class="line flex flex_btween">
						<view class="item" @click="navigate('/subpkg/bank_card/bank_card')">
							<view class="item_top flex flex-start">
								<image :src="imgUrl+'/broker/ic_mine_two_card.png'" mode="widthFix"></image>
								<view class="text">银行卡</view>
							</view>
							<view class="item_middle">信息全面，安全随行</view>
							<view class="item_bot">
								<image :src="imgUrl+'/broker/ic_mine_two_bg.png'" mode="widthFix"></image>
							</view>
						</view>
						<view class="item" @click="navigate('/subpkg/my_info/my_info')">
							<view class="item_top flex flex-start">
								<image :src="imgUrl+'/broker/ic_mine_info.png'" mode="widthFix"></image>
								<view class="text">我的名片</view>
							</view>
							<view class="item_middle">实名认证，多重保障</view>
							<view class="item_bot">
								<image :src="imgUrl+'/broker/ic_mine_info_bg.png'" mode="widthFix"></image>
							</view>
						</view>
						<!-- <view class="item" @click="navigate('/subpkg/setting/setting')">
							<view class="item_top flex flex-start">
								<image :src="imgUrl+'/broker/ic_mine_setting.png'" mode="widthFix"></image>
								<view class="text">系统设置</view>
							</view>
							<view class="item_middle">更多功能，敬请期待</view>
							<view class="item_bot">
								<image :src="imgUrl+'/broker/ic_mine_setting_bg.png'" mode="widthFix"></image>
							</view>
						</view> -->
					</view>
					<view class="line flex flex_btween">
						<view class="item" @click="navigate('/subpkg/about_us/about_us')">
							<view class="item_top flex flex-start">
								<image :src="imgUrl+'/worker/zhida/ic_mine_about.png'" mode="widthFix"></image>
								<view class="text">关于我们</view>
							</view>
							<view class="item_middle">更多信息，一键查看</view>
							<view class="item_bot">
								<image :src="imgUrl+'/worker/zhida/ic_mine_about_bg.png'" mode="widthFix"></image>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<myModal ref="myModal"></myModal>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex"
	import customHeader from "@/components/custom_header.vue"
	const app = getApp()
	export default {
		data() {
			return {
				showLogin: false,
				imgUrl: app.globalData.baseImageUrl,
				pageName: "我的",
				marginTop: app.globalData.marginTop,
				tabMargin: app.globalData.tabMargin,
				avatarHeight: app.globalData.avatarHeight,
				mineCardHeight: app.globalData.mineCardHeight,
				mineTop: app.globalData.mineTop,
				scrollHeight: 0,
				boxTop: 0,
				headerHeight: app.globalData.highTopHeight,
				maskInnerTop: 0,
				showMask: false,
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
					"avatar": "",
					"gender": "male",
					"id_card_back_image": "",
					"id_card_front_image": "",
					"id_card_number": "",
					"name": "",
					"verified": false
				},
				dataHeight: 0,
				tabbarHeight: 0,
				topAreaHeight: 0,
				innerBoxTop: 0
			}
		},
		components: {
			customHeader
		},
		computed: {
			...mapState(["workerInfo"])
		},
		async created() {
			let topArea = await this.getElementInfo(".top_area")
			console.log("topArea", topArea)
			if (topArea) {
				this.topAreaHeight = topArea.height
			}
			this.innerBoxTop = this.marginTop + this.topAreaHeight + this.tabMargin
			this.scrollHeight = app.globalData.systemHeight - this.marginTop - this.topAreaHeight - 3 * this
				.tabMargin - this
				.tabbarHeight
			this.$store.dispatch("getWorkerInfo")
		},
		methods: {
			getTabbarHeight(e) {
				this.tabbarHeight = e
			},
			getElementInfo(className) {
				return new Promise((resolve) => {
					let info = uni.createSelectorQuery().select(className);
					info.boundingClientRect(function(data) { //data - 各种参数
						resolve(data)
					}).exec()
				})
			},
			navigate(url) {
				if (url.indexOf("my_info") != -1 || url.indexOf("bank_card") != -1) {
					if (!this.info.id_card_number) {
						this.$refs.myModal.showMyModal({
							title: "提示",
							content: "您还未实名认证，请先进行实名认证。",
							confirmText: "去实名",
							success(res) {
								if (res == "confirm") {
									uni.navigateTo({
										url: "/subpkg/authentication/authentication"
									})
								}
							}
						})
						return
					}
				}
				uni.navigateTo({
					url: url
				})
			},
			toAuth() {
				let _this = this
				let authUrl = "/worker/identity-auth?job_application_id="
				_this.$request(authUrl, {}, "POST").then(respo => {
					if (respo.code == 0) {
						let url = encodeURIComponent(respo.data.auth_url)
						uni.navigateTo({
							url: "/pagesFace/pages/webview/webview?url=" +
								url,
							success(respon) {
								console.log(respon)
							},
							fail(err) {
								console.log(err)
							}
						});
					} else {
						_this.$refs.myModal.showMyModal({
							title: "提示",
							content: respo.msg,
							showCancel: false
						})
					}
				})
			},
			openMask(type) {
				this.showMask = true
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
				var _this = this;
				let header = {
					"Authorization": "bearer " + uni.getStorageSync("token"),
					"accept": "application/json",
					"content-type": "multipart/form-data"
				}
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: app.globalData.baseUrl + "/worker/upload/image?type=" + type,
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
										_this.$store.dispatch("getWorkerInfo")
									} else {
										_this.$refs.myModal.showMyModal({
											title: "提示",
											content: res.msg,
											showCancel: false
										})
									}
								})
							} else {
								_this.$refs.myModal.showMyModal({
									title: "上传失败",
									content: response.msg,
									showCancel: false
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
				this.loadimg("avatar", e.detail.avatarUrl)
			},
			closeLogin() {
				this.showLogin = false
			},
			cancelLogin() {
				this.closeLogin()
				uni.switchTab({
					url: "/pages/index/index"
				})
			},
			handleLogin() {
				// 登录成功后执行报名操作
				this.getInfo()
			},
		}
	}
</script>

<style lang="scss" scoped>
	.top_area {
		width: calc(100% - 120rpx);
		position: fixed;
		left: 60rpx;

		&>image {
			width: 100%;
			will-change: transform;
		}

		.top {
			width: 100%;

			&>image {
				width: 168rpx;
				position: absolute;
				top: 50%;
				left: 84%;
				will-change: transform;
			}

			.logo {
				width: 112rpx;
				height: 112rpx;
				border-radius: 50%;
				overflow: hidden;
				margin-right: 20rpx;
				padding-left: 0;
				padding-right: 0;
				margin-left: 0;
			}

			.info {
				width: calc(100% - 132rpx);
				position: relative;

				.name {
					font-weight: 600;
					font-size: 32rpx;
					color: #FFFFFF;
					text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2);
					white-space: nowrap;

					.tel {
						font-weight: 500;
						font-size: 28rpx;
						margin-top: 10rpx;
					}
				}

				.status {
					image {
						width: 38rpx;
						height: 38rpx;
						margin-right: 8rpx;
					}

					.sta_text {
						font-size: 24rpx;
						color: #FFFFFF;
						line-height: 48rpx;
						text-shadow: 0px 1px 2px rgba(52, 35, 0, 0.76);
					}

					.btn {
						width: 160rpx;
						height: 56rpx;
						line-height: 56rpx;
						background: #F7BC05;
						// box-shadow: 0px 1px 2px 0px rgba(146,110,2,0.5);
						border-radius: 44rpx;
						border: 1px solid #F7BC05;
						color: #fff;
						font-size: 28rpx;
						text-align: center;
						margin-left: 10rpx;
						// text-align: right;
					}
				}
			}
		}

		.data {
			margin-top: 20rpx;
			position: relative;

			&>image {
				width: 100%;
				will-change: transform;
			}

			.line {
				width: 100%;
				position: absolute;
				top: 17%;
				left: 0;
				transform: translateY(-50%);
				color: #fff;

				&::after {
					content: "";
					width: 2rpx;
					height: 30rpx;
					background: #fff;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}

				.in_line {
					width: 50%;
					text-align: center;
					font-size: 28rpx;

					.num {
						font-size: 40rpx;
						font-weight: bold;
					}
				}
			}
		}
	}

	.box {
		position: fixed;
		width: 100%;
		left: 0rpx;
		z-index: 3;
		background: url($back-ground-url+"/broker/ic_mine_bg.png") no-repeat;
		background-size: 100% 100%;
		overflow: hidden;
		padding: 70rpx 40rpx 0 40rpx;
		box-sizing: border-box;

		.inner_box {
			position: fixed;
			padding: 30rpx;
			box-sizing: border-box;
			width: 90%;
			left: 50%;
			transform: translateX(-50%);
			background: #fff;
			border-radius: 30rpx;
		}


		.line {
			margin-bottom: 15rpx;

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
</style>