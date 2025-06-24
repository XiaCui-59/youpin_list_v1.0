<template>
	<view class="custom_cascade">
		<u-popup :show="show" :mode="mode" @close="close">
			<view class="cascade_inner" style="width: 80vw;" :style="{paddingTop:top+'px'}">
				<view class="title" style="height: 44px;line-height: 44px;">{{title}}</view>
				<view class="cascade_wrap flex" :style="{height:cascadeHeight+'px'}">
					<!-- 第一层级 -->
					<view class="one_box">
						<view class="item one_box_item" v-for="(item,index) in formatData.slice(1)"
							:class="currentOneIndex==index?'active':''" :key="item.value"
							@click.stop="chooseOne(item,index)">
							<view class="text">{{item.label}}</view>
							<view class="icon">
								<u-icon v-if="currentOneIndex==index" name="play-right-fill" color="#216FF9"
									size="12"></u-icon>
							</view>
							<view class="sele_num" v-show="item.seleNum && (currentOneIndex!=index)">{{item.seleNum}}
							</view>
						</view>
					</view>
					<view class="two_box">
						<view class="item two_box_item flex flex_btween"
							v-for="(item,index) in data.slice(1)[currentOneIndex].children" :key="item.value"
							:class="currentTwoValues.includes(item.value)?'active':''" @click.stop="chooseTwo(item)">
							<view class="text">{{item.label}}</view>
							<view class="def_icon flex flex_around"
								:class="currentTwoValues.includes(item.value)?'active':''">
								<u-icon v-if="currentTwoValues.includes(item.value)" name="checkmark" color="#ffffff"
									size="16"></u-icon>
							</view>
						</view>
					</view>
				</view>
				<view class="oprea_area">
					<view class="sele_area flex">
						<view class="sele_item" v-for="(item,index) in selectArr" :key="index">
							<view class="text">{{item.label}}</view>
							<view class="dele_icon" @click="cancelChoose(item)">
								<u-icon name="close-circle-fill" color="#EA0000" size="18"></u-icon>
							</view>
						</view>
					</view>
					<view class="btns flex flex_btween">
						<view class="btn cancel" @click="cancel">取消</view>
						<view class="btn confirm" @click="confirm">确定</view>
					</view>
					<view class="tips">（最多可选择4个期望职位）</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		props: {
			data: {
				type: Array,
				default: function() {
					return [];
				} // 级联数据源
			},
			selected: {
				type: Array,
				default: function() {
					return [];
				} // 已选择数据
			},
			show: {
				type: Boolean,
				default: false // 控制弹出层弹出或隐藏
			},
			mode: {
				type: String,
				default: 'right' // 弹出层弹出方向：right(从右边弹出)
			},
			title: {
				type: String,
				default: '请选择' // 弹出层弹出方向：right(从右边弹出)
			},
			max: {
				type: Number,
				default: 3 // 最多选择数量
			}
		},
		name: "custom_cascade",
		data() {
			return {
				marginTop: app.globalData.marginTop,
				currentOneIndex: 0,
				currentTwoValues: [],
				selectedMainArr: [],
				selectArr: [],
				top: 0,
				cascadeHeight: 0,
				formatData: []
			};
		},
		created() {
			let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			this.top = menuButtonInfo.bottom
			this.cascadeHeight = app.globalData.systemHeight * 0.6 - this.top - 44

		},
		mounted() {
			this.data.map(el => {
				let obj = {
					value: el.value,
					label: el.label,
					children: el.children ? el.children : [],
					seleNum: 0
				}
				this.formatData.push(obj)
			})
			console.log("selected2：", this.selected)
			this.selectArr = [...(this.selected.slice(1))]
			let arr = []
			this.selectArr.map(el => {
				arr.push(el.value)
			})
			this.currentTwoValues = [...arr]
			this.handleMainCount()
		},
		methods: {
			chooseOne(item, index) {
				this.currentOneIndex = index
			},
			chooseTwo(item) {
				console.log(item)
				if (this.currentTwoValues.includes(item.value)) {
					// 点击选中过的，执行取消操作
					this.cancelChoose(item)
				} else {
					this.handleChoose(item)
				}
			},
			cancelChoose(param) {
				let index = this.currentTwoValues.indexOf(param.value)
				this.selectArr = this.selectArr.filter(el => {
					return el.value != param.value
				})
				this.currentTwoValues.splice(index, 1)
				this.handleMainCount()
			},
			handleChoose(param) {
				if (this.currentTwoValues.length > 3) {
					uni.showToast({
						title: "最多添加4个",
						icon: "error"
					})
					return
				}
				this.currentTwoValues.push(param.value)
				this.selectArr.push(param)
				this.handleMainCount()
			},
			handleMainCount() {
				let mainLen = this.formatData.length
				for (let i = 1; i < mainLen; i++) {
					let count = 0
					let subLen = this.formatData[i].children.length
					for (let j = 0; j < subLen; j++) {
						let seleLen = this.currentTwoValues.length
						for (let m = 0; m < seleLen; m++) {
							if (this.formatData[i].children[j].value == this.currentTwoValues[m]) {
								count++
							}
						}
					}
					this.formatData[i].seleNum = count
				}
			},
			cancel() {
				this.$emit("cancel")
			},
			confirm() {
				this.$emit("confirm", this.selectArr)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cascade_inner {
		height: 100vh;
		box-sizing: border-box;
		overflow: hidden;
		position: relative;

		.title {
			font-weight: 600;
			font-size: 29rpx;
			color: #333333;
			padding-left: 28rpx;
		}

		.oprea_area {
			width: 100%;
			padding: 0rpx 57rpx;
			box-sizing: border-box;
			position: absolute;
			bottom: 110rpx;
			left: 0;

			.tips {
				font-weight: 400;
				font-size: 24rpx;
				color: #5E5E5E;
				margin-top: 20rpx;
				text-align: center;
			}

			.btns {
				.btn {
					width: 46%;
					text-align: center;
					height: 85rpx;
					line-height: 85rpx;
					background: #FFFFFF;
					box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0, 0, 0, 0.15);
					border-radius: 15rpx;
					border: 2rpx solid #216FF9;
					font-weight: 600;
					font-size: 29rpx;
					color: #216FF9;

					&.confirm {
						background: #216FF9;
						color: #FFFFFF;
					}
				}
			}

			.sele_area {
				flex-wrap: wrap;

				.sele_item {
					width: 46%;
					height: 58rpx;
					line-height: 58rpx;
					margin-right: 4%;
					background: #F0F5FF;
					border-radius: 6rpx;
					text-align: center;
					position: relative;
					margin-bottom: 34rpx;

					.text {
						font-weight: 400;
						font-size: 29rpx;
						color: #333333;
						width: 100%;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
					}

					&:nth-child(2n) {
						margin-right: 0;
					}

					.dele_icon {
						position: absolute;
						top: -10rpx;
						right: -10rpx;
					}
				}
			}
		}

		.cascade_wrap {
			align-items: flex-start;
			overflow: hidden;

			.item {
				height: 96rpx;
				line-height: 96rpx;
				padding-left: 28rpx;
				padding-right: 24rpx;
				box-sizing: border-box;
				position: relative;

				.text {
					font-size: 27rpx;
					font-weight: 400;
				}

				.icon {
					position: absolute;
					top: 50%;
					right: 0;
					transform: translateY(-50%);
				}
			}

			.one_box {
				height: 100%;
				overflow: scroll;
				background: #F9F9F9;
				border-radius: 8rpx;
				flex-shrink: 0;
				white-space: nowrap;

				.one_box_item {
					.sele_num {
						position: absolute;
						top: 0;
						right: 0;
						text-align: center;
						width: 34rpx;
						height: 34rpx;
						line-height: 34rpx;
						border-radius: 50%;
						background: rgba(234, 0, 0, 0.2);
						font-weight: 600;
						font-size: 24rpx;
						color: #EA0000;
					}

					&.active {
						background: #fff;

						.text {
							font-weight: 600;
							font-size: 27rpx;
							color: #216FF9;
						}
					}

					&.active:before {
						content: "";
						width: 8rpx;
						height: 27rpx;
						background: #216FF9;
						border-radius: 2rpx;
						position: absolute;
						top: 50%;
						left: 0;
						transform: translateY(-50%);
					}

					&:last-child {
						.text {
							border-bottom: none;
						}
					}

					.text {
						border-bottom: 2rpx dotted #E6E6E6;
						color: #686868;
					}
				}
			}

			.two_box {
				width: 100%;
				height: 100%;
				overflow: scroll;
			}

			.two_box_item {
				padding-left: 60rpx;
				padding-right: 50rpx;

				.def_icon {
					width: 38rpx;
					height: 38rpx;
					border: 2rpx solid #216FF9;
					border-radius: 50%;

					&.active {
						background: #216FF9;
					}
				}

				.text {
					color: #333333;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
				}
			}
		}
	}
</style>