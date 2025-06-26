<template>
	<view class="modal">
		<uni-popup ref="modal" type="center">
			<view class="modal_wrap">
				<view class="modal_title">{{option.title}}</view>
				<view class="modal_content">{{option.content}}</view>
				<view class="modal_btns">
					<view class="modal_btn modal_cancel" v-if="option.showCancel" @click="cancel">{{option.cancelText}}
					</view>
					<view class="modal_btn modal_confirm" :class="option.showCancel?'':'widther'" @click="confirm">
						{{option.confirmText}}
					</view>
				</view>
			</view>

		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: "myModal",
		data() {
			return {
				option: {
					title: "",
					content: "",
					cancelText: "取消",
					confirmText: "确定",
					showCancel: true,
					success: () => {}
				}
			};
		},
		methods: {
			showMyModal(obj) {
				let _this = this
				setTimeout(function() {
					_this.$refs.modal.open()
				}, 500)
				this.option.title = obj.title ? obj.title : "提示"
				this.option.content = obj.content ? obj.content : "确认执行此操作吗？"
				this.option.cancelText = obj.cancelText ? obj.cancelText : "取消"
				this.option.confirmText = obj.confirmText ? obj.confirmText : "确定"
				console.log(String(obj.showCancel))
				this.option.showCancel = String(obj.showCancel) != "undefined" ? obj.showCancel : true
				this.option.success = (type) => {
					if (typeof obj.success == "function") {
						obj.success(type)
					}

				}
			},
			hideModal() {
				this.$refs.modal.close()
			},
			cancel() {
				this.option.success("cancel")
				this.hideModal()
			},
			confirm() {
				this.option.success("confirm")
				this.hideModal()
			}
		}
	}
</script>

<style lang="scss">
	.modal {
		width: 100%;
	}



	.modal_wrap {
		background: linear-gradient(225deg, #A6D0FB 0%, rgba(230, 242, 254, 0.6) 23%, #FFFFFF 65%, #EDF4FF 86%, #C4D9F7 100%);
		border-radius: 44rpx;
		width: 100%;
		padding: 57rpx 30rpx 76rpx 30rpx;
		box-sizing: border-box;

		.modal_title {
			text-align: center;
			font-weight: 600;
			font-size: 44rpx;
			margin-bottom: 57rpx;
			line-height: 69rpx;
			color: #333333;
		}

		.modal_content {
			font-weight: 600;
			font-size: 30rpx;
			color: #333333;
			text-align: center;
			line-height: 50rpx;
		}

		.modal_btns {
			margin-top: 76rpx;
			text-align: center;

			.modal_btn {
				display: inline-block;
				width: 200rpx;
				height: 85rpx;
				line-height: 85rpx;
				text-align: center;
				font-weight: 600;
				font-size: 29rpx;
				border-radius: 15rpx;
				box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0, 0, 0, 0.15);
				border: 2rpx solid #216FF9;

				&.widther {
					width: 54.5%;
				}

				&.modal_cancel {
					background: #FFFFFF;
					color: #216FF9;
					margin-right: 40rpx;
				}

				&.modal_confirm {
					background: #216FF9;
					color: #fff;

				}
			}
		}
	}
</style>