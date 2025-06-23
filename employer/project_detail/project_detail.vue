<template>
	<view class="single_page" v-if="ifSingle">
		<image :src="imgUrl+'/worker/single_page.png'" mode="widthFix" style="width: 100%;"></image>
	</view>
	<view class="content" v-else>
		<customHeader :title="pageName" :showBack="true" bgUrl="/broker/bg_2.png" :headHeight="headerHeight">
		</customHeader>
		<view class="cont" :style="{top:marginTop+tabMargin+'px'}">
			<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" :style="{height:scrollHeight+'px'}"
				style="padding:28rpx 28rpx 0 28rpx;box-sizing: border-box;">
				<view class="line kefu flex flex_btween">
					<view class="left flex">
						<image :src="imgUrl+'/broker/v2/ic_kefu_avatar.png'" mode="widthFix"></image>
						<view class="text">灵动优聘专属顾问-李老师</view>
					</view>
					<view class="icons flex flex_end">
						<image :src="imgUrl+'/broker/v2/ic_wechat_g.png'" mode="widthFix" @click="openKefu"></image>
						<image :src="imgUrl+'/broker/phone_icon.png'" mode="widthFix" @click="call"></image>
					</view>
				</view>
				<view class="line flex address">
					<view class="tit">工作地址：</view>
					<view class="text">{{info.address}}</view>
				</view>
				<view class="line flex">
					<view class="tit">用工人数：</view>
					<view class="text flex flex_btween">
						<view class="count">{{info.hiring_count}}</view>
						<view class="period">人</view>
					</view>
				</view>
				<view class="line flex">
					<view class="tit">用工单价：</view>
					<view class="text flex flex_btween">
						<view class="count">{{info.employer_settlement_price}}</view>
						<view class="period">
							{{"元"+periodList.filter(el=>{return el.value == info.employer_settlement_unit})[0].text}}
						</view>
					</view>
				</view>
				<view class="line flex address">
					<view class="tit">工作周期：</view>
					<view class="text">{{info.hiring_start_date+"—"+info.hiring_end_date}}</view>
				</view>
				<view class="line flex">
					<view class="tit">工作时长：</view>
					<view class="text flex flex_btween">
						<view class="count">{{info.daily_work_hours}}</view>
						<view class="period">时/天</view>
					</view>
				</view>
				<view class="line"
					style="height:40rpx;line-height:40rpx;font-size: 29rpx;color: #F7BB05;border-bottom: none;margin-top: 12rpx;">
					需求详情</view>
				<view class="textarea">
					<text>{{info.description}}</text>
					<!-- <rich-text :nodes="info.content" :style="{display:displayType}"></rich-text> -->
				</view>
			</scroll-view>
		</view>
		<view class="out_btns flex flex_btween" :style="{bottom:btnBottom+'px'}">
			<view class="btn" :class="info.pay_status == 'unpaid'?'btn_w':'btn_y'"
				v-if="info.status != 'requirement_finished'" @click="toClose"
				:style="{height:subTabHeight+'px',lineHeight:subTabHeight+'px'}">关闭需求
			</view>
			<view class="btn btn_y" v-if="info.status != 'requirement_finished' && info.pay_status == 'unpaid'"
				@click="checkBalance" :style="{height:subTabHeight+'px',lineHeight:subTabHeight+'px'}">支付费用
			</view>
		</view>

		<view class="mask" v-if="showMask">
			<view class="inner">
				<view class="close" @click="closeMask">
					<image :src="imgUrl+'/broker/ic_close_circle.png'" mode="widthFix"></image>
				</view>
				<view class="bg_ic">
					<image :src="imgUrl+'/broker/v2/ic_rele_pay_01.png'" mode="widthFix"></image>
				</view>
				<view class="title">费用信息</view>
				<view class="inner_box">
					<view class="line flex">
						<view class="line_tit flex">
							<image :src="imgUrl+'/broker/v2/ic_rele_pay_02.png'" mode="widthFix"></image>
							<text>账户余额</text>
						</view>
						<view class="line_text flex flex_btween">
							<view class="">{{orderInfo.available_amount}}</view>
							<view class="period">元</view>
						</view>
					</view>
					<view class="line flex">
						<view class="line_tit flex">
							<image :src="imgUrl+'/broker/v2/ic_rele_pay_03.png'" mode="widthFix"></image>
							<text>预计费用</text>
						</view>
						<view class="line_text flex flex_btween">
							<view class="">{{orderInfo.need_pay}}</view>
							<view class="period">元</view>
						</view>
					</view>
					<view class="btns">
						<view class="btn btn_y flex" @click="toRecharge"
							v-if="Number(orderInfo.available_amount) - Number(orderInfo.need_pay) < 0">
							<view class="flex">
								<view class="tit">去充值</view>
								<view class="tips">您当前余额不足，请先充值</view>
							</view>
						</view>
						<view class="btn btn_y flex" :class="btnStatus2?'':'grey'" @click="toPay"
							v-if="Number(orderInfo.available_amount) - Number(orderInfo.need_pay) >= 0">
							<view class="flex">
								<view class="tit">立即支付（自动扣费）</view>
								<view class="tips">费用将在发布时自动从您的余额中扣除</view>
							</view>

						</view>
					</view>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import customHeader from "@/components/custom_header.vue"
	import commonData from "@/common/commonData.js"
	const app = getApp()
	export default {
		data() {
			return {
				ifSingle: app.globalData.scene == 1154 ? true : false,
				btnStatus2: true,
				showMask: false,
				imgUrl: app.globalData.baseImageUrl,
				info: {
					"address": "文三路478号华星时代广场A座文三路478号华星时代广场A座",
					"city": "杭州市",
					"daily_work_hours": 8,
					"description": "需要5名建筑工人进行为期30天的建筑施工工作，要求有3年以上工作经验，能吃苦耐劳，工作认真负责。提供工作餐和住宿。",
					"district": "西湖区",
					"employer_settlement_price": "200",
					"employer_settlement_unit": "daily",
					"hiring_count": 1,
					"hiring_end_date": "2025-04-21",
					"hiring_start_date": "2025-04-20",
					"id": "72625765060972897",
					"job_type_code": "CS100002",
					"job_type_name": "前厅服务",
					"job_type_parent_name": "餐饮",
					"province": "浙江省",
					"status": "requirement_finished"
				},
				pageName: "需求详情",
				marginTop: app.globalData.marginTop,
				subTabHeight: app.globalData.subTabHeight,
				tabMargin: app.globalData.tabMargin,
				periodList: commonData.periodList,
				displayType: "-webkit-box",
				showAll: true,
				scrollHeight: 0,
				headerHeight: app.globalData.topHeight,
				btnBottom: app.globalData.btnBottom,
				id: "",
				orderInfo: {
					"available_amount": "",
					"need_pay": ""
				},
			}
		},
		// async onShareAppMessage(e) {
		// 	let shareobj;
		// 	let param = "pb_id=" + this.info.project_broker_id
		// 	// this.viewShareHaibao()
		// 	const imageUrl = await this.shareSave();
		// 	console.log(imageUrl, "imageUrl")
		// 	if (this.curShareType == "tob") {
		// 		shareobj = {
		// 			title: this.info.name, //分享的标题
		// 			path: '/subpkg/work_detail/work_detail?scene=' + encodeURIComponent(param) +
		// 				"&open_type=tob", //好友点击分享之后跳转的页面
		// 			imageUrl: imageUrl, //分享的图片  支持PNG及JPG。显示图片长宽比是 5:4。
		// 		}
		// 	} else {
		// 		shareobj = {
		// 			title: this.info.name, //分享的标题
		// 			path: '/subpkg/work_detail/work_detail?scene=' + encodeURIComponent(param) +
		// 				"&open_type=toc", //好友点击分享之后跳转的页面
		// 			imageUrl: imageUrl, //分享的图片  支持PNG及JPG。显示图片长宽比是 5:4。
		// 		}
		// 	}
		// 	this.close()
		// 	return shareobj //一定要返回对象
		// },
		components: {
			customHeader
		},
		async onLoad(param) {
			let _this = this
			this.id = param.id
		},
		async onShow() {
			if (!this.isLogin()) {
				uni.switchTab({
					url: "/pages/employer_index/employer_index"
				})
				return
			}
			this.info = await this.getInfo()
			if (this.info.status == "requirement_finished") {
				this.scrollHeight = app.globalData.systemHeight - this.marginTop - this
					.tabMargin - this.btnBottom
			} else {
				this.scrollHeight = app.globalData.systemHeight - this.marginTop - this
					.tabMargin - 2 * this.btnBottom - this.subTabHeight
			}
		},
		methods: {
			getInfo() {
				let _this = this
				return new Promise(resolve => {
					let url = "/employer/jobRequirement/" + _this.id + "/detail"
					this.$request(url).then(res => {
						if (res.code == 0) {
							resolve(res.data)
						}
					})
				})

			},
			toRecharge() {
				uni.navigateTo({
					url: "/employer/recharge/recharge"
				})
			},
			closeMask() {
				this.showMask = false
			},
			toPay() {
				// 支付需求
				if (!this.btnStatus2) {
					uni.showToast({
						title: "请勿重复点击",
						icon: "error"
					})
					return
				}
				this.btnStatus2 = false
				let url = "/employer/jobRequirement/" + this.id + "/pay"
				this.$request(url, {}, "POST").then(res => {
					if (res.code == 0) {
						this.showMask = false
						this.btnStatus2 = true
						uni.navigateTo({
							url: "/employer/release_success/release_success?id=" + this.id
						})
					}
				})
			},
			checkBalance() {
				let url = "/employer/preCheckBanlance/" + this.id
				this.$request(url).then(res => {
					if (res.code == 0) {
						this.showMask = true
						this.orderInfo = res.data
					}
				})
			},
			showTotal() {
				this.displayType = "block";
				this.showAll = false;
			},
			toClose() {
				let _this = this
				uni.showModal({
					title: "提示",
					content: "是否确认关闭需求？",
					confirmText: "确认关闭",
					success(resp) {
						if (resp.confirm) {
							let url = "/employer/jobRequirement/" + _this.id + "/finish"
							_this.$request(url, {}, "PATCH").then(res => {
								if (res.code == 0) {
									uni.showModal({
										title: "关闭需求成功",
										showCancel: false,
										async success(respon) {
											if (respon.confirm) {
												_this.info = await _this.getInfo()
											}
										}
									})

								}
							})
						}

					}
				})
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
			call() {
				uni.makePhoneCall({
					phoneNumber: "18508218283"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.out_btns {
		position: fixed;
		width: calc(100% - 56rpx);
		left: 28rpx;

		.btn {
			width: 48%;
		}

		.btn:nth-child(1) {
			&.btn_y {
				width: 100%;
			}
		}
	}

	.period {
		font-weight: 400;
		font-size: 23rpx;
		color: #A8A8A8;
	}

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

		.inner_box {
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

				.line_tit {
					width: 50%;

					image {
						width: 38rpx;
						margin-right: 13rpx;
					}

					text {
						font-weight: 400;
						font-size: 27rpx;
						color: #5A5A5A;
					}
				}

				.line_text {
					width: 50%;
					color: #666;

					view:nth-child(1) {
						font-weight: 600;
						font-size: 27rpx;
						color: #333333;
					}

					view:nth-child(2) {
						font-weight: 400;
						font-size: 23rpx;
						color: #A8A8A8;
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

			.btn {
				position: relative;
				top: 0;
				bottom: 0;
				left: 0;
				margin-top: 38rpx;
				height: 94rpx;
				// line-height: 76rpx;
				width: 100%;
				flex-direction: column;
				justify-content: space-around;

				&>view {
					flex-direction: column;
				}

				.tips {
					font-weight: 400;
					font-size: 23rpx;
				}
			}
		}
	}

	.content {
		height: 100vh;
		background: #F3F3F5;

		.cont {
			position: fixed;
			width: calc(100% - 56rpx);
			left: 28rpx;
			padding: 0 28rpx;
			box-sizing: border-box;
			background: #fff;
			border-radius: 16rpx;
			z-index: 99;

			.line {
				padding: 24rpx 0;
				font-weight: 400;
				font-size: 27rpx;
				line-height: 40rpx;
				align-items: flex-start;
				border-bottom: 2rpx dotted #DFDFDF;

				&.kefu {
					padding: 12rpx 0 40rpx 0;

					image {
						width: 50rpx;
						margin-right: 10rpx;
					}

					.left {
						font-weight: 600;
						font-size: 28rpx;
						color: #333333;
					}

					.icons {
						image:last-child {
							margin-right: 0;
							margin-left: 30rpx;
						}
					}
				}

				.tit {
					color: #5A5A5A;
					white-space: nowrap;
					flex-shrink: 0;
				}

				.text {
					width: 100%;
					color: #333333;

				}
			}

			.textarea {
				padding: 20rpx;
				background: #F6F6F6;
				border-radius: 15rpx;
				font-weight: 400;
				font-size: 27rpx;
				color: #5A5A5A;
				line-height: 46rpx;
			}
		}
	}
</style>