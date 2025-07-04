<template>
	<view class="role_choose">
		<view class="cont" :style="{top:marginTop+'px',height:contHeight+'px'}">
			<view class="cont_inner">
				<image :src="imgUrl+'/worker/v2/role_confirm_page_ic1.png'" mode="widthFix"></image>
				<view class="text">
					<view>灵动优聘找工作，几句话的事～</view>
					<view>职位信息透明保真</view>
					<view>可信任可依赖的高技术招聘服务平台</view>
				</view>
			</view>
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
				imgUrl: app.globalData.baseImageUrl,
				marginTop: app.globalData.marginTop,
				tabMargin: app.globalData.tabMargin,
				contHeight: 0,
			}
		},
		computed: {
			...mapState(["token", "openid", "openidStatus"]),
		},
		onLoad() {
			uni.setNavigationBarColor({
				frontColor: '#000000',
				backgroundColor: 'transparent'
			})
			uni.hideShareMenu()
			this.contHeight = app.globalData.systemHeight - this.marginTop - this.tabMargin
		},
		watch: {
			// openid(newVal) {
			// 	console.log(newVal)
			// 	if (newVal) {
			// 		this.checkRole()
			// 	}
			// }
		},
		async onShow() {
			let _this = this
			await this.$store.dispatch('getOpenid');
			uni.showLoading()
			this.checkRole()
			// let openid = uni.getStorageSync("openid") ? uni.getStorageSync("openid") : ""
			// if (this.openid) {

			// } else {
			// 	this.$store.dispatch('getOpenid');
			// }
		},
		methods: {
			...mapMutations(["setRole"]),
			checkRole() {
				let _this = this
				if (_this.token) {
					// 判断用户身份
					_this.$request("/guest/role").then(res => {
						if (res.code == 0) {
							if (res.data.role == "worker") {
								this.setRole("worker")
								uni.switchTab({
									url: "/pages/worker_index/worker_index",
									success() {
										uni.hideLoading()
									},
									fail(err) {
										console.log("err：", err)
									}
								})
							} else {
								this.setRole("employer")
								uni.switchTab({
									url: "/pages/employer_index/employer_index",
									success() {
										uni.hideLoading()
									}
								})
							}
						} else {
							uni.removeStorageSync("token")
							uni.redirectTo({
								url: "/pages/role_choose/role_choose",
								success() {
									uni.hideLoading()
								},
								fail(err) {
									console.log(err)
								}
							})
						}
					})
				} else {
					uni.redirectTo({
						url: "/pages/role_choose/role_choose",
						success() {
							uni.hideLoading()
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	::v-deep {}

	.role_choose {
		height: 100vh;
		background: url($back-ground-url+"/worker/v2/role_confirm_page_bg.png") no-repeat;
		background-size: cover;
		color: $base-fontcolor;

		.cont {
			position: fixed;
			left: 0;
			width: 100%;
			overflow-y: scroll;

			.cont_inner {
				position: absolute;
				top: 0%;
				left: 50%;
				transform: translateX(-50%);

				image {
					width: 682rpx;
				}

				.text {
					text-align: center;
					font-weight: 400;
					font-size: 31rpx;
					color: #223756;
					line-height: 50rpx;
				}
			}

		}
	}
</style>