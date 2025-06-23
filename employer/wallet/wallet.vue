<template>
	<view class="single_page" v-if="ifSingle">
		<image :src="imgUrl+'/worker/single_page.png'" mode="widthFix" style="width: 100%;"></image>
	</view>
	<view class="content" v-else>
		<customHeader :title="pageName" :showBack="true" bgUrl="/broker/bg_2.png" :headHeight="headerHeight">
		</customHeader>
		<view class="cont" :style="{marginTop:marginTop+'px'}">
			<view class="top_area" :style="{top:marginTop+'px'}">
				<!-- 顶部账户信息 -->
				<view class="account" :style="{height:commiCardHeight+'px'}" @click="toRecharge">
					<image :src="imgUrl+'/broker/account_bg.png'" :style="{height:commiCardHeight+'px',width:'100%'}">
					</image>
					<view class="top_line">
						<view class="flex ">
							<image :src="imgUrl+'/broker/ic_finance.png'" mode="widthFix"></image>
							<text>账户余额</text>
						</view>
						<view class="count flex flex_btween">
							<view class="left flex">
								<text class="bold">{{info.available_amount}}</text>
								<text>元</text>
							</view>
							<view class="right">充值</view>
						</view>
					</view>

				</view>
				<view class="middle_wrap"
					:style="{height:middleHeight+'px',marginTop:tabMargin+'px',marginBottom:tabMargin+'px'}">
					<view class="middle_tit" :style="{height:subTabHeight+'px',lineHeight:subTabHeight+'px'}">收入支出
					</view>
					<view class="middle_text flex" :style="{height:middleHeight - subTabHeight+'px'}">
						<view class="mid_text_item flex flex_around">
							<view class="mid_text_item_tit">充值金额</view>
							<view class="mid_text_item_text flex">
								<view class="mid_text_item_count">{{statistic.income_amount}}</view>
								<view class="period">元</view>
							</view>
						</view>
						<view class="mid_text_item flex flex_around">
							<view class="mid_text_item_tit">支出金额</view>
							<view class="mid_text_item_text flex">
								<view class="mid_text_item_count">{{statistic.expense_amount}}</view>
								<view class="period">元</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="box" :style="{top:boxTop+'px'}">
				<view class="box_top flex flex_btween">
					<view class="box_title" :style="{height:subTabHeight+'px',lineHeight:subTabHeight+'px'}">收支明细</view>
					<view class="box_time flex flex_end"
						:style="{height:subTabHeight+'px',lineHeight:subTabHeight+'px'}">
						<view class="line" :style="{color:start_time?'#333':'#888'}" @click="openTime('start_time')">
							{{start_time?start_time:"开始时间"}}
						</view>
						<view class="line mark">~</view>
						<view class="line" :style="{color:end_time?'#333':'#888'}" @click="openTime('end_time')">
							{{end_time?end_time:"结束时间"}}
						</view>
						<view class="icon" @click="clearTime">
							<u-icon :name="start_time&&end_time?'close-circle':'play-right-fill'" color="#F7BC05"
								size="18"></u-icon>
						</view>

						<u-calendar :show="show" :title="timeTitle" mode="single" :minDate="minDate" :maxDate="maxDate"
							:defaultDate="maxDate" :monthNum="13" color="#F7BC05" :closeOnClickOverlay="true"
							@confirm="confirmTime" @close="closeTime"></u-calendar>
					</view>
				</view>
				<scroll-view scroll-y="true" class="scroll-Y" :style="{height:scrollHeight+'px'}"
					@scrolltolower="lower">
					<view class="item flex flex_btween" v-for="(item,index) in list" :key="index">
						<view class="left">
							<view class="remark">【{{item.description}}】</view>
							<view class="time">{{item.create_time}}</view>
						</view>
						<view class="right" :class="item.direction == 'income'?'green':'red'">
							{{item.direction == 'income'?("+" + item.change_amount):("-" + item.change_amount)}}
						</view>
					</view>
					<view class="empty" v-if="list.length == 0">
						<image :src="imgUrl+'/broker/empty.png'" mode="widthFix"></image>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="btn_y" :style="{height:subTabHeight+'px',lineHeight:subTabHeight+'px',bottom:btnBottom+'px'}"
			@click="toRecharge">充值
		</view>
		<myModal ref="myModal"></myModal>
	</view>
</template>

<script>
	import commonData from "../../common/commonData"
	import customHeader from "@/components/custom_header.vue"
	const app = getApp()

	function getLastYear() {
		// 获取当前日期
		let currentDate = new Date();

		// 获取当前年份
		let currentYear = currentDate.getFullYear();

		// 计算前一年的年份
		let previousYear = currentYear - 1;
		let month = fomateNumber(currentDate.getMonth() + 1)
		let day = fomateNumber(currentDate.getDate())

		// 创建一个表示前一年的日期的Date对象
		// 注意：这里我们保持月份和日期不变，只改变年份
		console.log(previousYear + '-' + month + "-" + day)
		return previousYear + '-' + month + "-" + day
	}

	function getToday() {
		// 获取当前日期
		let currentDate = new Date();
		let year = currentDate.getFullYear()
		let month = fomateNumber(currentDate.getMonth() + 1)
		let day = fomateNumber(currentDate.getDate())
		console.log(year + '-' + month + "-" + day)
		return year + '-' + month + "-" + day
	}

	function fomateNumber(num) {
		if (num < 10) {
			num = "0" + num
		}
		return num
	}
	export default {
		data() {
			return {
				ifSingle: app.globalData.scene == 1154 ? true : false,
				currentTimeType: "",
				timeTitle: "选择时间",
				minDate: getLastYear(),
				maxDate: getToday(),
				start_time: "",
				end_time: "",
				imgUrl: app.globalData.baseImageUrl,
				show: false,
				pageName: "我的钱包",
				marginTop: app.globalData.marginTop,
				tabMargin: app.globalData.tabMargin,
				middleHeight: app.globalData.systemHeight * (124 / 844),
				commiCardHeight: app.globalData.commiCardHeight,
				subTabHeight: app.globalData.subTabHeight,
				btnBottom: app.globalData.btnBottom,
				scrollHeight: 0,
				boxTop: 0,
				headerHeight: app.globalData.topHeight,
				currentPage: 1,
				info: {
					available_amount: 0
				},
				statistic: {
					"expense_amount": "",
					"income_amount": ""
				},
				list: [],
				pagination: {},
				tabbarHeight: 0
			}
		},
		components: {
			customHeader,
		},
		onLoad() {
			this.boxTop = this.marginTop + this.commiCardHeight + this.middleHeight + 2 * this.tabMargin
			this.scrollHeight = app.globalData.systemHeight - this.boxTop - 2 * this.subTabHeight - this.btnBottom - this
				.tabMargin
		},
		onShow() {
			if (!this.isLogin()) {
				uni.switchTab({
					url: "/pages/employer_index/employer_index"
				})
				return
			}
			this.getInfo()
			this.getStatic()
			this.getList()
		},
		methods: {
			openTime(type) {
				this.currentTimeType = type
				if (type == "start_time") {
					this.timeTitle = "开始时间"
				} else {
					this.timeTitle = "结束时间"
				}
				this.show = true
			},
			clearTime() {
				if (this.start_time && this.end_time) {
					this.start_time = ""
					this.end_time = ""
					this.getList()
				}
			},
			closeTime() {
				this.show = false
			},
			confirmTime(e) {
				console.log(e)
				this.show = false
				if (this.currentTimeType == "end_time") {
					this.end_time = e[0]
				} else {
					this.start_time = e[0]
				}
				if (this.start_time && this.end_time) {
					this.getList()
				}
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
			getInfo() {
				this.$request("/employer/info").then(res => {
					if (res.code == 0) {
						this.info = res.data
					}
				})
			},
			getStatic() {
				this.$request("/employer/balance-change-stats").then(res => {
					if (res.code == 0) {
						this.statistic = res.data
					}
				})
			},
			getList() {
				let url = "/employer/balance-changes?page=1" + "&create_time_start=" + this.start_time +
					"&create_time_end=" + this.end_time;
				this.$request(url).then(res => {
					if (res.code == 0) {
						this.list = res.data.list
						this.pagination = res.data.pagination
					}
				})
			},
			getMore() {
				let url = "/employer/balance-changes?page=" + this.currentPage + "&create_time_start=" + this.start_time +
					"&create_time_end=" + this.end_time;
				this.$request(url).then(res => {
					if (res.code == 0) {
						this.list = this.list.concat(res.data.list)
						this.pagination = res.data.pagination
					}
				})
			},
			toRecharge() {
				uni.navigateTo({
					url: "/employer/recharge/recharge"
				})
			},
			lower() {
				if (this.list.length < this.pagination.total_count) {
					this.currentPage++
					this.getMore()
				} else {
					if (this.list.length >= this.pagination.total_count) {
						uni.showToast({
							title: "已经到底啦~",
							icon: "none",
							duration: 2000
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep {
		.u-calendar-month__days__day__select__buttom-info {
			bottom: -10px !important;
		}
	}

	.btn_y {
		position: fixed;
		width: calc(100% - 96rpx);
		left: 48rpx;
	}

	.content {
		height: 100vh;
		background: #F3F3F5;
	}

	.period {
		font-weight: 400;
		font-size: 23rpx;
		color: #9E9E9E;
	}

	.middle_wrap {
		padding-left: 20rpx;
		background: #FFFFFF;
		border-radius: 19rpx;

		.middle_tit {
			font-weight: 600;
			font-size: 29rpx;
			color: #333333;
			border-bottom: 2rpx dotted #F3F3F5;
		}

		.middle_text {
			.mid_text_item {
				width: 50%;
				height: 100%;
				box-sizing: border-box;
				padding: 20rpx 0;
				text-align: center;
				flex-direction: column;
				font-weight: 400;
				position: relative;

				&:nth-child(1)::after {
					content: "";
					height: 80rpx;
					border: 2rpx dotted #F3F3F5;
					position: absolute;
					top: 50%;
					right: -2rpx;
					transform: translateY(-50%);
				}

				.mid_text_item_tit {
					font-size: 29rpx;
					color: #333333;
				}

				.mid_text_item_text {
					.mid_text_item_count {
						font-weight: 900;
						font-size: 42rpx;
						margin-right: 10rpx;
					}
				}

				&:nth-child(1) {
					.mid_text_item_text {
						.mid_text_item_count {
							color: $em-base-color;
						}
					}
				}

				&:nth-child(2) {
					.mid_text_item_text {
						.mid_text_item_count {
							color: #34A752;
						}
					}
				}
			}
		}
	}

	.top_area {
		width: calc(100% - 96rpx);
		position: fixed;
		left: 48rpx;
		z-index: 99;

		.account {
			position: relative;

			image {
				width: 100%;
				will-change: transform;
			}

			.top_line {
				width: 75%;
				position: absolute;
				top: 27%;
				left: 50%;
				transform: translateX(-50%);

				image {
					width: 32rpx;
					height: 32rpx;
					margin-right: 10rpx;
				}

				text {
					font-size: 32rpx;
					color: #333;
					font-weight: bold;
				}

				.left {
					padding-left: 42rpx;
					line-height: 80rpx;

					text {
						font-weight: 400;
						font-size: 23rpx;
						color: #FFFFFF;
					}

					.bold {
						font-family: Arial, Arial;
						font-weight: 900;
						font-size: 50rpx;
						color: #FFFFFF;
						text-shadow: 0px 2px 4px #000000;
						margin-right: 8rpx;
					}

				}

				.right {
					width: 173rpx;
					height: 58rpx;
					line-height: 58rpx;
					text-align: center;
					background: #FFFFFF;
					box-shadow: 0rpx 2rpx 4rpx 0rpx #714A00;
					border-radius: 33rpx;
					font-weight: 600;
					font-size: 27rpx;
					color: $em-base-color;
				}


				.text {
					font-size: 24rpx;
					font-family: PingFangSC, PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
				}
			}

			.bot_line {
				position: absolute;
				width: 97%;
				bottom: 5%;
				left: 50%;
				transform: translateX(-50%);

				.bot_box {
					width: 50%;
					text-align: center;
					position: relative;

					&:first-child::after {
						content: "";
						width: 2rpx;
						height: 29rpx;
						background: #DFDFDF;
						position: absolute;
						top: 50%;
						right: -1rpx;
						transform: translateY(-50%)
					}
				}

				.text {
					color: #A8A8A8;
					font-size: 24rpx;
					text-align: center;
				}

				.tit {
					font-size: 28rpx;
					color: #333;
					text-align: center;
				}

				.yellow {
					font-weight: 900;
					font-size: 36rpx;
					color: #F3A005;
					text-align: center;
					font-style: normal;
					margin-right: 8rpx;
				}
			}
		}

		.sele_box {

			// margin:0 20rpx 20rpx 0;
			.text {
				font-size: 28rpx;
				color: #333;
			}

			image {
				width: 26rpx;
				height: 26rpx;
				margin-left: 8rpx;
			}
		}
	}


	.box {
		position: fixed;
		width: calc(100% - 96rpx);
		left: 48rpx;
		z-index: 99;
		border-radius: 16rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		background: #fff;

		.box_top {

			font-size: 29rpx;
			color: #333333;

			.box_title {
				font-weight: 600;
			}

			.box_time {
				font-weight: 400;

				.icon {
					height: 100%;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					padding: 0 20rpx;
				}
			}
		}

		.item {
			padding: 28rpx 0;
			border-top: 2rpx dotted #E9E9E9;

			.left {
				.remark {
					font-size: 29rpx;
					color: #4284F4;
					line-height: 40rpx;
					margin-bottom: 14rpx;
				}

				.time {
					font-size: 27rpx;
					color: #5A5A5A;
					line-height: 38rpx;
					padding-left: 6rpx;
				}
			}

			.right {
				font-weight: 600;
				font-size: 35rpx;

				&.green {
					color: #34A752;
				}

				&.red {
					color: #FF5353;
				}
			}
		}
	}
</style>