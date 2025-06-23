<template>
	<view class="role_choose" v-else>
		<view class="cont" :style="{top:marginTop+'px',height:contHeight+'px'}">
			<view class="top">
				<view class="title">请选择您的身份</view>
				<view class="tip">方便我们为您提供精准服务</view>
			</view>
			<view class="middle">
				<view class="mid_item flex flex_btween">
					<image :src="imgUrl+'/worker/v2/choose_icon_1.png'" mode="widthFix"></image>
					<view class="btn_wrap" @click="handle('employer')">
						<view class="label">海量人才</view>
						<view class="btn">我要招人才</view>
					</view>

				</view>
				<view class="mid_item flex flex_btween">
					<image :src="imgUrl+'/worker/v2/choose_icon_2.png'" mode="widthFix"></image>
					<view class="btn blue" @click="handle('worker')">我要找工作</view>
				</view>
			</view>
			<view class="bottom">
				<view>AI助力，智能推荐，快速入职好工作</view>
				<view>真实高效，可信任可依赖的工作服务平台</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex"
	const app = getApp()
	export default {
		data() {
			return {
				ifSingle: app.globalData.scene == 1154 ? true : false,
				imgUrl: app.globalData.baseImageUrl,
				marginTop: app.globalData.marginTop,
				tabMargin: app.globalData.tabMargin,
				contHeight: 0,
			}
		},
		computed: {
			...mapState(["openid", "token"]),
		},
		onLoad() {
			uni.setNavigationBarColor({
				frontColor: '#000000',
				backgroundColor: 'transparent'
			})
			uni.hideShareMenu()
			this.contHeight = app.globalData.systemHeight - this.marginTop - this.tabMargin
		},
		onShareTimeline(res) {
			return {
				title: "快乐求职好伙伴，品质工作新选择",
				// path: "/pages/index/index",
				// query: "share_id=" + shareParams.way_wechat_moment, //点击分享链接之后进入的页面路径
				imageUrl: urlSetting.urls.imageUrl + "/worker/mini_share_2.jpg?time=" + (new Date())
					.getTime() //分享发送的链接图片地址
			}
		},
		methods: {
			...mapMutations(["setToken"]),
			handle(type) {
				let url = "/auth/ai-wechat/" + type + "/token"
				let data = {
					open_id: this.openid
				}
				this.$request(url, data, "POST").then(res => {
					if (res.code == 0) {
						this.setToken(res.data.token)
						uni.setStorageSync("token", res.data.token)
						if (type == "worker") {
							uni.redirectTo({
								url: "/worker/worker_index/worker_index",
								success(resp) {
									console.log("跳转成功", resp)
								},
								fail(err) {
									console.log("跳转失败", err)
								}
							})
						} else {
							uni.switchTab({
								url: "/pages/employer_index/employer_index",
								success(resp) {
									console.log("跳转成功", resp)
								},
								fail(err) {
									console.log("跳转失败", err)
								}
							})
						}
					} else {
						uni.showModal({
							title: res.msg
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	::v-deep {}

	.role_choose {
		height: 100vh;
		background: url($back-ground-url+"/worker/new/welcome_bg.png") no-repeat;
		background-size: cover;
		color: $base-fontcolor;

		.cont {
			position: fixed;
			left: 0;
			width: 100%;
			overflow-y: scroll;

			.bottom {
				position: fixed;
				bottom: 88rpx;
				width: 70%;
				left: 50%;
				transform: translateX(-50%);
				font-weight: 400;
				font-size: 23rpx;
				color: #333333;
				line-height: 44rpx;
				text-align: center;
			}

			.middle {
				margin-top: 50%;
				position: relative;
				transform: translateY(-50%);
				padding: 0 42rpx;

				.mid_item {
					background: linear-gradient(90deg, #FFFFFF 0%, #EAF7FF 100%);
					box-shadow: 0rpx 4rpx 6rpx 0rpx rgba(107, 107, 107, 0.13);
					border-radius: 31rpx;
					padding: 34rpx 38rpx;

					.btn_wrap {
						position: relative;

						.label {
							position: absolute;
							top: -30rpx;
							left: 0;
							padding: 0 20rpx;
							height: 38rpx;
							line-height: 38rpx;
							background: #FF2C00;
							box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0, 0, 0, 0.26);
							border-radius: 19rpx 19rpx 0rpx 19rpx;
							font-weight: 400;
							font-size: 23rpx;
							color: #FFFFFF;
						}
					}

					&:first-child {
						margin-bottom: 57rpx;
					}

					image {
						width: 257rpx;
					}

					.btn {
						width: 258rpx;
						height: 85rpx;
						text-align: center;
						line-height: 85rpx;
						background: $em-base-color;
						box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0, 0, 0, 0.15);
						border-radius: 42rpx;
						font-weight: 600;
						font-size: 35rpx;
						color: #FFFFFF;

						&.blue {
							background: $base-color;
						}
					}
				}
			}

			.top {
				padding-left: 23rpx;
				padding-top: 90rpx;

				.title {
					font-weight: 600;
					font-size: 54rpx;
					color: #333333;
					line-height: 77rpx;
					margin-bottom: 12rpx;
				}

				.tip {
					font-weight: 400;
					font-size: 29rpx;
					color: #333333;
					line-height: 40rpx;
				}
			}

			.btns {}

		}
	}
</style>