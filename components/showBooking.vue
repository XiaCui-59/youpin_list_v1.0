<template>
	<view class="modal">
		<uni-popup ref="pubModal" type="center">
			<view class="modal_wrap" :class="currentRole=='employer'?'':'blue'">
				<view class="modal_title">关注公众号</view>
				<view class="modal_content">
					<image :src="imgUrl" mode="widthFix" :show-menu-by-longpress="true"></image>
					<view class="text">长按上方二维码，关注灵动优聘公众号，工作进度会通过公众号告知您。</view>
				</view>
				<view class="modal_btns flex flex_around" :class="currentRole=='employer'?'':'blue'">
					<view class="modal_btn modal_confirm" @click="confirm">好的
					</view>
				</view>
			</view>

		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex"
	export default {
		name: "myModal",
		data() {
			return {
				imgUrl: ""
			};
		},
		computed: {
			...mapState(["currentRole"])
		},
		methods: {
			getCode() {
				if (this.currentRole == "employer") {
					this.$request("/employer/wechat/official-account/subscribe-qrcode").then(res => {
						if (res.code == 0) {
							this.imgUrl = res.data.qrcode
							this.open()
						}
					})
				} else {
					this.$request("/worker/wechat/official-account/subscribe-qrcode").then(res => {
						if (res.code == 0) {
							this.imgUrl = res.data.qrcode
							this.open()
						}
					})
				}

			},
			open() {
				this.$refs.pubModal.open()
				// this.getCode()
			},
			confirm() {
				this.$refs.pubModal.close()
				if (this.currentRole == "employer") {
					this.$store.dispatch('getEmployerInfo');
				} else {
					this.$store.dispatch('getWorkerInfo');
				}

			}
		}
	}
</script>

<style lang="scss">
	.modal {
		width: 100%;
	}


	.modal_wrap {
		background: #fff linear-gradient(225deg, #fbcc1f 0%, rgba(249, 254, 234, 0.6) 23%, #FFFFFF 65%, #EDF4FF 86%, #fbcc1f 100%);
		border-radius: 44rpx;
		width: 100%;
		padding: 57rpx 60rpx 76rpx 60rpx;
		box-sizing: border-box;

		&.blue {
			background: linear-gradient(225deg, #A6D0FB 0%, rgba(230, 242, 254, 0.6) 23%, #FFFFFF 65%, #EDF4FF 86%, #C4D9F7 100%);
		}

		.modal_title {
			text-align: center;
			font-weight: 600;
			font-size: 44rpx;
			margin-bottom: 10rpx;
			line-height: 69rpx;
			color: #333333;
		}

		.modal_content {
			font-weight: 600;
			font-size: 29rpx;
			color: #333333;
			text-align: center;
			line-height: 44rpx;

			image {
				width: 55%;
			}
		}

		.modal_btns {
			margin-top: 20rpx;
			text-align: center;

			&.blue {
				.modal_btn {
					border: 2rpx solid #216FF9;

					&.modal_cancel {
						color: #216FF9;
					}

					&.modal_confirm {
						background: #216FF9;
					}
				}
			}

			.modal_btn {
				display: inline-block;
				width: 192rpx;
				height: 85rpx;
				line-height: 85rpx;
				text-align: center;
				font-weight: 600;
				font-size: 29rpx;
				border-radius: 15rpx;
				box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0, 0, 0, 0.15);
				border: 2rpx solid #F7BC05;

				&.modal_cancel {
					background: #FFFFFF;
					color: #F7BC05;
				}

				&.modal_confirm {
					background: #F7BC05;
					color: #fff;
					margin-left: 40rpx;
				}
			}
		}
	}
</style>