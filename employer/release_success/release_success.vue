<template>
	<view class="content">
		<!-- 自定义导航 -->
		<u-navbar title="发布成功" @rightClick="rightClick" :autoBack="true" bgColor="rgba(247, 188, 5, 1)"
			titleStyle="color:#fff;font-size: 31rpx;">
			<view class="u-nav-slot" slot="left"
				style="width:57rpx;height:57rpx;text-align: center;line-height: 57rpx;border:1px solid #fff;border-radius: 50%;">

				<u-icon name="arrow-left" size="19" color="#fff"
					custom-style="display: inline-block;line-height: 57rpx;margin:0 auto;left:-2rpx;"></u-icon>
			</view>
		</u-navbar>
		<view class="cont" :style="{top:marginTop+tabMargin+'px'}">
			<view class="top">
				<image :src="imgUrl+'/broker/v2/ic_rele_success.png'" mode="widthFix"></image>
				<view class="text">需求发布成功</view>
				<view class="text">我们已接收到您的需求</view>
				<view class="btns flex flex_btween">
					<view class="btn" @click="backIndex">回到首页</view>
					<view class="btn" @click="toDetail">查看需求单</view>
				</view>
			</view>
			<view class="middle">
				<view class="img_wrap">
					<image :src="imgUrl+'/broker/v2/ic_kefu.png'" mode="widthFix"></image>
				</view>
				<view class="text">添加一对一灵动优聘专属顾问</view>
				<view class="text">优先处理您的定制需求</view>
				<view class="btn btn_y flex flex_around" @click="openKefu">
					<view class="flex flex_start">
						<image :src="imgUrl+'/broker/v2/ic_wechat_g.png'" mode="widthFix"></image>
						<view class="text">一键召唤专属顾问</view>
					</view>
				</view>
				<view class="btn btn_lite_y flex flex_around" @click="call">
					<view class="flex flex_start">
						<image :src="imgUrl+'/broker/v2/ic_phone_y.png'" style="width:36rpx;" mode="widthFix"></image>
						<view class="text">电话联系专属顾问</view>
					</view>
				</view>
			</view>

		</view>

	</view>
</template>

<script>
	import commonData from "@/common/commonData.js"
	const app = getApp()
	export default {
		data() {
			return {

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
				id: ""
			}
		},
		components: {},
		async onLoad(param) {
			let _this = this
			this.id = param.id
			uni.hideShareMenu()
		},
		methods: {
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
			},
			backIndex() {
				uni.switchTab({
					url: "/pages/employer_index/employer_index"
				})
			},
			toDetail() {
				uni.redirectTo({
					url: "/employer/project_detail/project_detail?id=" + this.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.period {
		font-weight: 400;
		font-size: 23rpx;
		color: #A8A8A8;
	}

	.btn {
		height: 85rpx;
		line-height: 85rpx;
		margin-top: 38rpx;

		image {
			width: 50rpx;
			margin-right: 14rpx;
		}
	}

	.content {
		height: 100vh;
		background: #fff;

		.cont {
			position: fixed;
			width: calc(100% - 56rpx);
			left: 28rpx;
			padding: 0 28rpx;
			box-sizing: border-box;
			z-index: 99;

			.top {
				margin-top: 90rpx;
				margin-bottom: 140rpx;
				text-align: center;

				image {
					width: 326rpx;
					margin-bottom: 20rpx;
				}

				.text {
					font-weight: 400;
					font-size: 29rpx;
					color: #333333;
					line-height: 40rpx;
				}

				.btns {
					width: 70%;
					margin: 0 auto;

					.btn {
						width: 192rpx;
						text-align: center;
						height: 58rpx;
						line-height: 58rpx;
						background: #F3F7FF;
						border-radius: 29rpx;
						font-weight: 400;
						font-size: 27rpx;
						color: #333333;
					}
				}
			}

			.middle {
				text-align: center;

				.img_wrap {
					width: 123rpx;
					height: 123rpx;
					margin: 0 auto 10rpx auto;
					padding: 17rpx;
					box-sizing: border-box;
					background: #F3F7FF;
					border-radius: 10rpx;


					image {
						width: 100%;
					}
				}

				&>.text {
					font-weight: 400;
					font-size: 23rpx;
					color: #333333;
					line-height: 33rpx;
				}
			}

		}
	}
</style>