<template>
	<view class="single_page" v-if="ifSingle">
		<image :src="imgUrl+'/worker/single_page.png'" mode="widthFix" style="width: 100%;"></image>
	</view>
	<view class="content" v-else>
		<customHeader :title="pageName" :showBack="false" :headHeight="headerHeight" bgUrl="/broker/bg.png"
			:showScan="true"></customHeader>
		<view class="cont" :style="{marginTop:marginTop+'px'}">
			<view class="top_area" :style="{top:marginTop+tabMargin+'px'}">
				<view class="banner" :style="{height:bannerHeight+'px'}" @click="toadd">
					<view class="banner_info">
						<view class="tit">招贤纳士</view>
						<view class="tips">快来发布你的需求，寻找能人</view>
						<view class="banner_btn">发布需求</view>
					</view>
				</view>
				<view class="subtabs flex flex-start"
					:style="{height:subTabHeight+'px',marginTop:tabMargin+'px',marginBottom:tabMargin+'px'}">
					<view class="subtab flex flex_around" v-for="(item,index) in tabs" :key="index"
						:class="currentTab.value==item.value?'active':''" @click="changeTab(item)">{{item.text}}</view>
				</view>
			</view>
			<view class="box" :style="{top:boxTop+'px',background:list.length==0?'#fff':'#F3F3F5'}">
				<scroll-view scroll-y="true" class="scroll-Y"
					:style="{height:scrollHeight+'px',paddingBottom:1.5*tabMargin+'px',boxSizing:'border-box'}"
					@scrolltolower="lower">
					<view class="item" :class="item.status" v-for="(item,index) in list" :key="item.id"
						@click="toDetail(item.id)" v-if="list.length != 0">
						<view class="status">
							<image
								:src="item.status != 'requirement_finished'?(imgUrl+'/broker/v2/em_running_work.png'):(imgUrl+'/broker/v2/em_end_work.png')"
								mode="widthFix"></image>
						</view>
						<view class="title">{{item.description}}</view>
						<view class="middle flex flex_btween">
							<view class="mid_in_item">
								<view class="tit">工资</view>
								<view class="salary flex flex-start">
									{{item.employer_settlement_price}}
									<text
										class="period">{{"元"+periodList.filter(el=>{return el.value==item.employer_settlement_unit})[0].text}}</text>
								</view>
							</view>
							<view class="mid_in_item">
								<view class="tit">招聘进度</view>
								<view class="count flex flex_end"> {{item.hired_count}}<text
										class="blue">{{"/"+item.hiring_count}}</text><text class="period">人</text>
								</view>
							</view>
						</view>
						<view class="opera flex flex_start">
							<view class="ope_item set flex flex-start"
								v-if="item.status != 'requirement_finished' && item.pay_status == 'unpaid'"
								@click.stop="openCheck(item)">
								<image :src="imgUrl+'/broker/v2/ic_pay.png'" mode="widthFix"></image>
								<text>支付费用</text>
							</view>
							<view class="ope_item set flex flex-start" v-if="item.status != 'requirement_finished'"
								@click.stop="toClose(item)">
								<image :src="imgUrl+'/broker/v2/ic_dele_1.png'" mode="widthFix"></image>
								<text>关闭需求</text>
							</view>
							<view class="ope_item sub flex flex-start" v-if="item.status == 'requirement_finished'"
								@click.stop="reOpen(item)">
								<image :src="imgUrl+'/broker/v2/ic_rele_1.png'" mode="widthFix"></image>
								<text>重新发布</text>
							</view>
						</view>
					</view>
					<view class="empty" v-if="list.length == 0">
						<image :src="imgUrl+'/broker/empty.png'" mode="widthFix"></image>
					</view>
				</scroll-view>

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
		<login :showLogin="showLogin" @cancel="closeLogin" @closeLogin="closeLogin" @getInfo="getList">
		</login>
		<addName v-if="(!employerInfo.name) && (!nameShow) && (loginStatus == 'in')"></addName>
		<tabbar current="0" @getTabbarHeight="getTabbarHeight" :todo="todo"></tabbar>
	</view>
</template>

<script>
	import login from "@/components/employer_login.vue"
	import tabbar from "@/components/tabbar.vue"
	import customHeader from "@/components/custom_header.vue"
	import commonData from "@/common/commonData"
	import addName from "@/components/addName.vue"
	import {
		mapState,
		mapMutations
	} from "vuex"
	const app = getApp()
	export default {
		data() {
			return {
				ifSingle: app.globalData.scene == 1154 ? true : false,
				btnStatus2: true,
				showMask: false,
				showLogin: false,
				avatar: app.globalData.baseImageUrl + "/broker/com_default.png",
				imgUrl: app.globalData.baseImageUrl,
				pageName: "灵动优聘",
				marginTop: app.globalData.marginTop,
				mainTabHeight: app.globalData.mainTabHeight,
				subTabHeight: app.globalData.subTabHeight,
				tabMargin: app.globalData.tabMargin,
				bannerHeight: app.globalData.bannerHeight,
				tabs: commonData.requireStatus,
				currentTab: {
					value: "all",
					text: "全部"
				},
				list: [],
				scrollHeight: 0,
				boxTop: 0,
				headerHeight: app.globalData.highTopHeight,
				currentPage: 1,
				pagination: {},
				tabbarHeight: 0,
				periodList: commonData.periodList,
				orderInfo: {
					"available_amount": "",
					"need_pay": ""
				},
				currentRecord: {}
			}
		},
		components: {
			tabbar,
			customHeader,
			login,
			addName
		},
		computed: {
			...mapState(["employerInfo", "nameShow", "loginStatus"])
		},
		onLoad() {
			this.boxTop = this.marginTop + this.bannerHeight + 3 * this.tabMargin + this.subTabHeight
			this.scrollHeight = app.globalData.systemHeight - this.marginTop - this.subTabHeight - 3 * this.tabMargin -
				this.tabbarHeight - this.bannerHeight
		},
		onShow() {
			console.log("ifSingle", this.ifSingle)
			if (this.ifSingle) {
				return
			} else {
				if (this.isLogin()) {
					this.getList()
				}
			}

		},
		methods: {
			closeLogin() {
				this.showLogin = false
			},
			toadd() {
				if (this.isLogin()) {
					uni.navigateTo({
						url: "/employer/release/release"
					})
				} else {
					this.showLogin = true
				}

			},
			toClose(item) {
				let _this = this
				uni.showModal({
					title: "提示",
					content: "是否确认关闭需求：" + item.description.slice(0, 10) + "？",
					confirmText: "确认关闭",
					success(resp) {
						if (resp.confirm) {
							let url = "/employer/jobRequirement/" + item.id + "/finish"
							_this.$request(url, {}, "PATCH").then(res => {
								if (res.code == 0) {
									uni.showToast({
										title: "需求关闭成功",
										icon: "none",
										duration: 3000
									})
									_this.getList()
								}
							})
						}

					}
				})
			},
			reOpen(item) {
				uni.navigateTo({
					url: "/employer/release/release?id=" + item.id
				})
			},
			getTabbarHeight(e) {
				this.tabbarHeight = e
			},
			changeTab(item) {
				console.log("isLogin：", this.isLogin())
				if (this.isLogin()) {
					this.currentTab = item
					this.currentPage = 1
					this.getList()
				} else {
					this.showLogin = true
				}

			},
			toDetail(id) {
				uni.navigateTo({
					url: "/employer/project_detail/project_detail?id=" + id
				})
			},
			getMore() {
				let url = "/employer/jobRequirements?page=" + this.currentPage + "&status=" + this.currentTab.value
				this.$request(url).then(res => {
					if (res.code == 0) {
						this.list = this.list.concat(res.data.list)
						this.pagination = res.data.pagination
					}
				})
			},
			getList() {
				let url = "/employer/jobRequirements?page=1" + "&status=" + this.currentTab.value
				this.$request(url).then(res => {
					if (res.code == 0) {
						this.list = res.data.list
						this.pagination = res.data.pagination
					}
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
				let url = "/employer/jobRequirement/" + this.currentRecord.id + "/pay"
				this.$request(url, {}, "POST").then(res => {
					if (res.code == 0) {
						this.showMask = false
						this.btnStatus2 = true
						uni.navigateTo({
							url: "/employer/release_success/release_success?id=" + this.currentRecord.id
						})
					}
				})
			},
			openCheck(item) {
				this.currentRecord = {
					...item
				}
				this.checkBalance(item)
			},
			checkBalance(item) {
				let id = item ? item.id : this.currentRecord.id
				let url = "/employer/preCheckBanlance/" + id
				this.$request(url).then(res => {
					if (res.code == 0) {
						this.showMask = true
						this.orderInfo = res.data
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
			},
		}
	}
</script>

<style lang="scss" scoped>
	.pub_ic {
		position: fixed;
		right: 20rpx;
		font-size: 0;
		z-index: 200;

		image {
			width: 60rpx;
			height: 60rpx;

		}
	}

	.cont {
		height: 100vh;
		background: #F3F3F5;
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

	.top_area {
		width: calc(100% - 92rpx);
		left: 46rpx;
		position: fixed;
		z-index: 90;

		.banner {
			position: relative;
			width: 100%;
			background: url($back-ground-url+'/broker/index_banner.png') no-repeat;
			background-size: cover;

			.banner_info {
				position: absolute;
				top: 50%;
				right: 58rpx;
				transform: translateY(-50%);
				text-align: right;

				.tit {
					font-weight: 600;
					font-size: 27rpx;
					color: #333333;
					line-height: 38rpx;
				}

				.tips {
					font-weight: 400;
					font-size: 19rpx;
					color: #ABABAB;
					line-height: 27rpx;
				}

				.banner_btn {
					margin-top: 15rpx;
					width: 212rpx;
					height: 62rpx;
					line-height: 62rpx;
					text-align: center;
					background: #3780FF;
					border-radius: 35rpx;
					font-weight: 600;
					font-size: 29rpx;
					color: #FFFFFF;
					float: right;
				}
			}
		}

		.tabs {

			// margin-top:30rpx;
			.tab {
				width: 332rpx;
				padding: 12rpx 24rpx;
				background: url($back-ground-url+"/broker/rect_normal.png") no-repeat;
				background-size: 100% 100%;
				box-sizing: border-box;
				border-radius: 20rpx;
				overflow: hidden;

				&.active {
					background: url($back-ground-url+"/broker/rect_sele.png") no-repeat;
					background-size: 100% 100%;
				}

				.icon {
					font-size: 0;

					image {
						will-change: transform;
						height: 100rpx;
					}
				}

				.info {
					text-align: center;

					.tit {
						font-size: 30rpx;
						// line-height: 42rpx;
					}

					.count {
						font-size: 34rpx;
						color: #fff;
						font-weight: bold;
						// line-height: 56rpx;
					}
				}
			}
		}

	}

	.box {
		position: fixed;
		width: calc(100% - 96rpx);
		left: 48rpx;
		z-index: 3;
		border-top-left-radius: 16rpx;
		border-top-right-radius: 16rpx;
		overflow: hidden;
		// background: #F3F3F5;

		.item {
			padding: 40rpx 40rpx 23rpx 40rpx;
			border-radius: 16rpx;
			background: #fff;
			box-shadow: 0 2rpx 6rpx 0 rgba(0, 0, 0, 0.15);
			margin-bottom: 20rpx;
			position: relative;

			.status {
				position: absolute;
				top: 0;
				right: 0;
				font-size: 0;

				image {
					width: 73rpx;
				}
			}

			.title {
				font-size: 34rpx;
				padding-left: 22rpx;
				box-sizing: border-box;
				position: relative;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				box-sizing: border-box;

				// image {
				// 	width: 50rpx;
				// 	height: 50rpx;
				// 	height: auto;
				// 	position: absolute;
				// 	top: 50%;
				// 	right: 0rpx;
				// 	transform: translateY(-50%);
				// }

				&:before {
					content: "";
					width: 8rpx;
					height: 36rpx;
					background: $em-base-color;
					position: absolute;
					top: 50%;
					left: 0;
					transform: translateY(-50%);
				}
			}

			&.requirement_finished {
				.title::before {
					background: #9B9B9B;
				}

				.middle {
					.mid_in_item {
						.salary {
							color: #9B9B9B;
						}
					}

				}

				.opera {
					.ope_item {
						text {
							color: $base-color;
						}

					}
				}
			}

			.middle {
				font-size: 30rpx;
				margin: 34rpx 0;
				padding: 17rpx 20rpx;
				box-sizing: border-box;
				background: #F6F6F6;
				border-radius: 8rpx;

				.mid_in_item {
					.tit {
						font-size: 25rpx;
						color: #5A5A5A;
						line-height: 46rpx;
					}

					view {

						font-weight: 600;
						font-size: 35rpx;
					}

					.salary {
						color: #EA9900;
					}

					.count {
						color: #333;
						text-align: right;
					}

					.period {
						font-size: 23rpx;
						color: #A8A8A8;
						display: inline-block;
						margin-left: 10rpx;
					}
				}

			}

			.bottom {
				font-size: 23rpx;
				color: #686868;
				height: 60rpx;
				line-height: 60rpx;
			}

			.opera {
				margin-top: 20rpx;

				.ope_item {
					margin-right: 10%;

					image {
						width: 42rpx;
					}

					text {
						font-weight: 400;
						font-size: 27rpx;
						color: #333333;
					}
				}
			}
		}
	}
</style>