<template>
	<view class="mask">
		<view class="inner">
			<view class="close" @click="closeMask">
				<image :src="imgUrl+'/broker/ic_close_circle.png'" mode="widthFix"></image>
			</view>
			<view class="bg_ic">
				<image :src="imgUrl+'/broker/v2/ic_rele_pay_01.png'" mode="widthFix"></image>
			</view>
			<view class="title">姓名补充</view>
			<view class="box">
				<view class="line flex flex_btween">
					<u-icon name="account-fill" color="#F7BC05" size="24"></u-icon>
					<view class="line_text flex flex_btween">
						<input type="text" v-model="name" placeholder="请输入您的真实姓名" />
					</view>
				</view>

				<view class="btn btn_y" @click="handleConfirm">保存</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	import {
		mapState,
		mapMutations
	} from "vuex"
	export default {
		name: "add_name",
		data() {
			return {
				imgUrl: app.globalData.baseImageUrl,
				name: ""
			};
		},
		methods: {
			...mapMutations(["setNameShow"]),
			closeMask() {
				this.setNameShow()
			},
			handleConfirm() {
				this.$request("/employer/name", {
					name: this.name
				}, "POST").then(res => {
					if (res.code == 0) {
						uni.showToast({
							title: "保存成功"
						})
						this.closeMask()
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.inner {
		width: calc(100% - 92rpx) !important;
		color: #333;
		padding: 30rpx 38rpx 76rpx 38rpx !important;
		background: linear-gradient(180deg, #FCD1A8 0%, #FFF9F0 20%) !important;
		border-radius: 37rpx;

		.bg_ic {
			font-size: 0;
			position: absolute;
			top: 0;
			right: 0;
			z-index: 99;

			image {
				width: 250rpx;
			}
		}

		.title {
			position: relative;
			z-index: 1000;
			font-weight: 600;
			font-size: 38rpx;
			color: #282319;
			line-height: 54rpx;
			margin-bottom: 55rpx;
			padding-left: 38rpx;
		}

		.box {
			position: relative;
			z-index: 1000;

			.line {
				height: 85rpx;
				line-height: 85rpx;
				margin: 20rpx 0;
				font-size: 29rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 2rpx 6rpx 0rpx rgba(0, 0, 0, 0.1);
				border-radius: 8rpx;
				padding: 0 38rpx 0 23rpx;

				.line_text {
					width: calc(100% - 50rpx);
					color: #666;

					input {
						width: 100%;
						height: 85rpx;
					}
				}
			}

			.tips {
				font-size: 24rpx;

				.tips_item {
					margin-top: 10rpx;
					align-items: flex-start;

					.tips_tit {
						white-space: nowrap;
					}

					.tips_text {
						font-size: 23rpx;
						color: #DD0000;
					}
				}
			}

			.btn_y {
				position: relative;
				top: 0;
				bottom: 0;
				left: 0;
				margin-top: 38rpx;
				height: 76rpx;
				line-height: 76rpx;
				width: 100%;

				text {
					font-weight: 400;
					font-size: 23rpx;
				}
			}
		}
	}
</style>