<template>
	<view class="single_page" v-if="ifSingle">
		<image :src="imgUrl+'/worker/single_page.png'" mode="widthFix" style="width: 100%;"></image>
	</view>
	<view class="content" v-else>
		<customHeader :title="pageName" :showBack="false" bgUrl="/broker/bg_2.png" :headHeight="headerHeight">
		</customHeader>
		<view class="cont" :style="{marginTop:marginTop+tabMargin+'px'}">
			<view class="top_area" :style="{top:marginTop+tabMargin+'px',height:mineCardHeight+'px'}">
				<image :src="imgUrl+'/broker/ic_mine_top_bg.png'" :style="{height:mineCardHeight+'px',width:'100%'}">
				</image>
				<view class="top flex flex-start">
					<button class="logo" open-type="chooseAvatar" @chooseavatar="getAvatar"
						:style="{height:mineCardHeight*0.45+'px',width:mineCardHeight*0.45+'px'}">
						<image :src="info.avatar.url?info.avatar.url:avatar"
							style="border-radius: 50%;background: #fff;"
							:style="{height:mineCardHeight*0.45+'px',width:mineCardHeight*0.45+'px'}"></image>
					</button>
					<image :src="imgUrl+'/broker/ic_mine_veri.png'" mode="widthFix"></image>
					<view class="info">
						<view class="name">{{info.name}}</view>
						<view class="status">{{info.mobile}}</view>
						<!-- <view class="status flex flex_btween" v-if="info.id">
							<view class="sta_text">
								{{baseStatus.filter(el=>{return el.value == info.basic_verify_status})[0].text}}
							</view>
							<view class="btn"
								v-if="baseStatus.filter(el=>{return el.value == info.basic_verify_status})[0].btnText"
								@click="navigate('/subpkg/authentication/authentication')">
								{{baseStatus.filter(el=>{return el.value == info.basic_verify_status})[0].btnText}}
							</view>
						</view>
						<view class="status flex flex_btween" v-if="!info.id">
							<view class="sta_text">未认证</view>
							<view class="btn" @click="navigate('/subpkg/authentication/authentication')">去认证</view>
						</view> -->
					</view>
				</view>
			</view>
			<view class="box" :style="{top:boxTop+'px',paddingTop:4*tabMargin+'px'}">
				<scroll-view scroll-y="true"
					:style="{height:scrollHeight+'px',paddingBottom:tabMargin+'px',boxSizing:'border-box'}">
					<view class="line flex flex_btween">
						<view class="item" @click="navigate('/employer/release/release')">
							<view class="item_top flex flex-start">
								<image :src="imgUrl+'/broker/ic_mine_rele.png'" mode="widthFix"></image>
								<view class="text">发布需求</view>
							</view>
							<view class="item_middle">快速发布，寻找能人</view>
							<view class="item_bot">
								<image :src="imgUrl+'/broker/ic_mine_rele_bg.png'" mode="widthFix"></image>
							</view>
						</view>

						<view class="item" @click="navigate('/employer/wallet/wallet')">
							<view class="item_top flex flex-start">
								<image :src="imgUrl+'/broker/ic_mine_account.png'" mode="widthFix"></image>
								<view class="text">我的钱包</view>
							</view>
							<view class="item_middle">资金流水，快速查询</view>
							<view class="item_bot">
								<image :src="imgUrl+'/broker/ic_mine_balance.png'" mode="widthFix"></image>
							</view>
						</view>
					</view>
					<view class="line flex flex_btween">
						<view class="item" @click="changeRole">
							<view class="item_top flex flex-start">
								<image :src="imgUrl+'/broker/ic_mine_setting_b.png'" mode="widthFix"></image>
								<view class="text">我要找工作</view>
							</view>
							<view class="item_middle">切换身份，快速匹配</view>
							<view class="item_bot">
								<image :src="imgUrl+'/broker/ic_mine_find.png'" mode="widthFix"></image>
							</view>
						</view>
						<view class="item" @click="navigate('/employer/about_us/about_us')">
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
					<view class="line flex flex_start">
						<view class="item" @click="openKefu">
							<view class="item_top flex flex-start">
								<image :src="imgUrl+'/broker/v2/ic_mine_kefu.png'" mode="widthFix"></image>
								<view class="text">联系客服</view>
							</view>
							<view class="item_middle">专业客服，快速答疑</view>
							<view class="item_bot">
								<image :src="imgUrl+'/broker/v2/mine_kefu_card.png'" mode="widthFix"></image>
							</view>
						</view>
					</view>
				</scroll-view>

			</view>
		</view>
		<login :showLogin="showLogin" @cancel="cancelLogin" @closeLogin="closeLogin" @getInfo="getInfo">
		</login>
		<addName v-if="(!employerInfo.name) && (!nameShow) && (loginStatus == 'in')"></addName>
		<tabbar current="2" @getTabbarHeight="getTabbarHeight" :todo="todo"></tabbar>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex"
	import login from "@/components/employer_login.vue"
	import tabbar from "@/components/tabbar.vue"
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
			addName
		},
		async onLoad() {
			this.boxTop = this.marginTop + (0.56 * this.mineCardHeight) + this.tabMargin
			this.scrollHeight = app.globalData.systemHeight - this.boxTop - this
				.tabbarHeight - 4 * this.tabMargin
		},
		computed: {
			...mapState(["employerInfo", "nameShow", "loginStatus"])
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
			changeRole() {
				let _this = this
				uni.showModal({
					title: "是否确认切换到找工作状态？",
					confirmText: "切换",
					confirmColor: "#F7BC05",
					success(res) {
						if (res.confirm) {
							uni.showLoading({
								title: "切换中"
							})
							// 移除本地token
							uni.removeStorageSync("token")
							uni.removeStorageSync("userInfo")
							let openid = uni.getStorageSync("openid")
							// 重新获取工人端的token
							let url = "/auth/ai-wechat/worker/token"
							let data = {
								open_id: openid
							}
							_this.$request(url, data, "POST").then(resp => {
								if (resp.code == 0) {
									_this.setToken(resp.data.token)
									uni.setStorageSync("token", resp.data.token)
									uni.reLaunch({
										url: "/subpkg/index/index",
										success(resp) {
											console.log("跳转成功", resp)
										},
										fail(err) {
											console.log("跳转失败", err)
										},
										complete() {
											uni.hideLoading()
										}
									})
								} else {
									uni.showModal({
										title: res.msg
									})
								}
							})
						}
					}
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
			getInfo() {
				this.$request("/employer/info").then(res => {
					if (res.code == 0) {
						this.info = res.data
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