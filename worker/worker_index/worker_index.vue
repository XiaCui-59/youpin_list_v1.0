<template>
	<view class="single_page" v-if="ifSingle">
		<image :src="imgUrl+'/worker/single_page.png'" mode="widthFix" style="width: 100%;"></image>
	</view>
	<view class="content" v-else>
		<!-- 自定义导航栏 -->
		<u-navbar :safeAreaInsetTop="true" bgColor="transparent">
			<view class="u-nav-slot flex flex-start" slot="left">
				<view class="ic_menu">
					<image :src="imgUrl+'/worker/v_list/text_logo.png'" mode="heightFix" style="height:33px;"></image>
				</view>
			</view>
		</u-navbar>
		<view class="cont" :style="{marginTop:marginTop+tabMargin+'px'}">
			<u-swiper :list="swiperList" :height="1.2*bannerHeight+'px'" @click="click"></u-swiper>
			<u-sticky :offset-top="marginTop+tabMargin/2+'px'">
				<view class="labels_wrap">
					<!-- 菜单栏 -->
					<u-tabs :list="selectedWorkType" keyName="label" :current="currentIndex" lineWidth="0"
						lineHeight="0" :activeStyle="{
						height:'57rpx',
						lineHeight:'57rpx',
						padding: '0 20rpx',
						borderRadius:'10rpx',
						fontSize: '27rpx',
						color: '#216FF9',
						background: '#F0F5FF',
						border:' 1rpx solid #216FF9'
					    }" :inactiveStyle="{
							height:'57rpx',
							lineHeight:'57rpx',
					        padding: '0 20rpx',
					        background:'#F0F5FF',
					        border: '1rpx solid #F0F5FF',
					        borderRadius:'10rpx',
					        fontSize: '27rpx',
					        color: '#333333'
					    }" itemStyle="margin-right:23rpx;margin-left:0;" @click="handleTabClick">
						<view slot="right" style="margin-left: 57rpx;" @tap="showSelect">
							<view class="btn_wrap flex">
								<view class="btn_text">{{selectedWorkType.length>1?"筛选":"工作筛选"}}</view>
								<image :src="imgUrl+'/worker/v_list/ic_trangle.png'" mode="widthFix"
									style="width:21rpx;">
								</image>
							</view>
						</view>
					</u-tabs>
				</view>
				<view class="flex flex_btween" style="background:#F3F3F5 ;">
					<view class="tab_2 flex">
						<view class="tab_2_item" v-for="(item,index) in tab_2_list"
							:class="currentIndex2 == index?'active':''" :key="index">{{item.label}}</view>
					</view>
					<view v-if="jobList.length == 0" class="tips"
						style="font-size: 23rpx;color: #5E5E5E;padding-right: 28rpx;">当前分类暂无职位，看看其他职位吧
					</view>
				</view>

			</u-sticky>
			<view class="box" :style="{paddingBottom:tabbarHeight+'px'}">
				<view class="item" v-if="jobList.length" v-for="(item,index) in jobList" :key="index"
					@click="toDetail(item)">
					<view class="item_top flex flex_btween">
						<view class="title">{{item.name}}
						</view>
						<view class="salary">
							{{(item.min_salary== item.max_salary?item.max_salary:(item.min_salary+"-"+item.max_salary))+"元"+period.filter(el=>{return el.value==item.salary_type})[0].text}}
						</view>
					</view>
					<view class="labels flex" v-if="item.highlight && item.highlight.length != 0">
						<view class="label flex" v-for="(label,labIndex) in item.highlight"
							:class="(labIndex==0 || labIndex==1)?'active':''" :key="labIndex">
							{{label}}
						</view>
					</view>
					<view class="bottom flex" :class="item.address?'flex_btween':'flex_end'">
						<view class="location" v-if="item.address">
							{{item.address}}
						</view>
						<view class="sign_btn flex flex_end" @click.stop="makePhoneCall">
							<image :src="imgUrl+'/worker/new/ic_telephone.png'" mode="widthFix"></image>
							<view class="">免费咨询</view>
						</view>
					</view>
				</view>
				<view class="item" v-if="!jobList.length" v-for="(item,index) in allList" :key="index"
					@click="toChat(item)">
					<view class="item_top flex flex_btween">
						<view class="title">{{item.name}}
						</view>
						<view class="salary">
							{{(item.min_salary== item.max_salary?item.max_salary:(item.min_salary+"-"+item.max_salary))+"元"+period.filter(el=>{return el.value==item.salary_type})[0].text}}
						</view>
					</view>
					<view class="labels flex" v-if="item.highlight && item.highlight.length != 0">
						<view class="label flex" v-for="(label,labIndex) in item.highlight"
							:class="(labIndex==0 || labIndex==1)?'active':''" :key="labIndex">
							{{label}}
						</view>
					</view>
					<view class="bottom flex" :class="item.address?'flex_btween':'flex_end'">
						<view class="location" v-if="item.address">
							{{item.address}}
						</view>
						<view class="sign_btn flex flex_end" @click.stop="makePhoneCall">
							<image :src="imgUrl+'/worker/new/ic_telephone.png'" mode="widthFix"></image>
							<view class="">免费咨询</view>
						</view>
					</view>
				</view>
				<!-- <scroll-view scroll-y="true" class="scroll-Y"
					:style="{height:scrollHeight+'px',paddingBottom:1.5*tabMargin+'px',boxSizing:'border-box'}"
					@scrolltolower="lower">
					
				</scroll-view> -->

			</view>
		</view>
		<customCascade title="请选择期望职位" :data="workType" :show="showCascade" :selected="selectedWorkType"
			@cancel="cancelCascade" @confirm="handleConfirm">
		</customCascade>
		<login :showLogin="showLogin" @cancel="closeLogin" @closeLogin="closeLogin" @getInfo="getList">
		</login>
		<tabbar current="0" @getTabbarHeight="getTabbarHeight" :todo="todo"></tabbar>
	</view>
</template>

<script>
	import login from "@/components/login.vue"
	import tabbar from "@/components/worker_tabbar.vue"
	import commonData from "@/common/commonData"
	import customCascade from "@/components/custom_cascade.vue"
	import {
		mapState,
		mapMutations
	} from "vuex"
	const app = getApp()
	export default {
		data() {
			return {
				showCascade: false,
				period: commonData.periodList,
				currentIndex2: 0,
				tab_2_list: [{
					value: "recomm",
					label: "推荐"
				}, {
					value: "near",
					label: "附近"
				}],
				currentIndex: 0,
				selectedWorkType: [{
					value: "",
					label: "全部"
				}],
				allList: [],
				jobList: [{
					name: "眉山职业学院大学辅导员",
					min_salary: 3000,
					max_salary: 5000,
					salary_type: "monthly",
					highlight: ["保洁", "服务员", "包吃住", "工作环境好"],
					address: "四川省",
					province: "四川省",
					city: "成都市",
					district: "锦江区",
					street: "一环路二段三益公商厦"
				}, {
					name: "眉山职业学院大学辅导员",
					min_salary: 3000,
					max_salary: 5000,
					salary_type: "monthly",
					highlight: ["保洁", "服务员", "包吃住", "工作环境好"],
					address: "四川省",
					province: "四川省",
					city: "成都市",
					district: "锦江区",
					street: "一环路二段三益公商厦"
				}, {
					name: "眉山职业学院大学辅导员",
					min_salary: 3000,
					max_salary: 5000,
					salary_type: "monthly",
					highlight: ["保洁", "服务员", "包吃住", "工作环境好"],
					address: "四川省",
					province: "四川省",
					city: "成都市",
					district: "锦江区",
					street: "一环路二段三益公商厦"
				}, {
					name: "眉山职业学院大学辅导员",
					min_salary: 3000,
					max_salary: 5000,
					salary_type: "monthly",
					highlight: ["保洁", "服务员", "包吃住", "工作环境好"],
					address: "四川省",
					province: "四川省",
					city: "成都市",
					district: "锦江区",
					street: "一环路二段三益公商厦"
				}, {
					name: "眉山职业学院大学辅导员",
					min_salary: 3000,
					max_salary: 5000,
					salary_type: "monthly",
					highlight: ["保洁", "服务员", "包吃住", "工作环境好"],
					address: "四川省",
					province: "四川省",
					city: "成都市",
					district: "锦江区",
					street: "一环路二段三益公商厦"
				}, {
					name: "眉山职业学院大学辅导员",
					min_salary: 3000,
					max_salary: 5000,
					salary_type: "monthly",
					highlight: ["保洁", "服务员", "包吃住", "工作环境好"],
					address: "四川省",
					province: "四川省",
					city: "成都市",
					district: "锦江区",
					street: "一环路二段三益公商厦"
				}],
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
					value: "",
					text: "全部"
				},
				list: [],
				scrollHeight: 0,
				boxTop: 0,
				headerHeight: app.globalData.highTopHeight,
				currentPage: 1,
				allCurrentPage: 1,
				pagination: {},
				allPagination: {},
				tabbarHeight: 0,
				periodList: commonData.periodList,
				orderInfo: {
					"available_amount": "",
					"need_pay": ""
				},
				swiperList: ["https://static.test.swiftwd.com/worker/v_list/index_banner01.png"],
				currentRecord: {},
				systemHeight: app.globalData.systemHeight
			}
		},
		components: {
			tabbar,
			login,
			customCascade
		},
		computed: {
			...mapState(["employerInfo", "nameShow", "loginStatus", "workType"])
		},
		onLoad() {
			this.boxTop = this.marginTop + this.bannerHeight + 3 * this.tabMargin + this.subTabHeight
			this.scrollHeight = app.globalData.systemHeight - this.marginTop - this.subTabHeight - 3 * this.tabMargin -
				this.tabbarHeight - this.bannerHeight
			this.selectedWorkType = uni.getStorageSync("workTypes") ? uni.getStorageSync("workTypes") : [{
					value: "",
					label: "全部"
				}],
				this.getList()
			this.getSelectWorkTypes()
		},
		onReachBottom() {
			if (this.jobList.length == 0) {
				this.getAllMore()
			} else {
				this.getMore()
			}
		},
		onShow() {
			console.log("ifSingle", this.ifSingle)
			if (this.ifSingle) {
				return
			} else {
				if (this.isLogin()) {
					// this.getList()
				}
			}

		},
		methods: {
			showSelect() {
				this.showCascade = true
			},
			getSelectWorkTypes() {
				this.$request("/worker/expected-job-types").then(res => {
					if (res.code == 0) {
						let arr = [{
							value: "",
							label: "全部"
						}]
						this.selectedWorkType = arr.concat(res.data)
					}
				})
			},
			cancelCascade() {
				this.showCascade = false
			},
			handleTabClick(e) {
				this.currentTab = e
				this.currentPage = 1
				this.getList()
			},
			handleConfirm(e) {
				console.log(e)
				let data = {
					job_types: [...e]
				}
				this.$request("/worker/expected-job-types", data, "PUT").then(res => {
					if (res.code == 0) {
						this.getSelectWorkTypes()
						this.showCascade = false
					}
				})

			},
			makePhoneCall() {
				this.$store.dispatch('makePhoneCall')
			},
			getList() {
				let _this = this
				let url = "/guest/recommend-jobs?page=1&keyword=" + "&crowd_sourcing_job_type_code=" + this
					.currentTab.value
				this.$request(url).then(res => {
					if (res.code == 0) {
						this.jobList = res.data.list
						this.pagination = res.data.pagination
						if (this.jobList.length == 0) {
							this.getAll()
						}
					}
				})
			},
			getAll() {
				let _this = this
				let url = "/guest/recommend-jobs?page=1&keyword=" + "&crowd_sourcing_job_type_code="
				this.$request(url).then(res => {
					if (res.code == 0) {
						this.allList = res.data.list
						this.allPagination = res.data.pagination
					}
				})
			},
			getAllMore() {
				if (this.allCurrentPage < this.allPagination.page_count) {
					this.allCurrentPage++
					let url = "/guest/recommend-jobs?page=" + this.allCurrentPage +
						"&keyword=&crowd_sourcing_job_type_code="
					this.$request(url).then(res => {
						if (res.code == 0) {
							this.allList = this.allList.concat(res.data.list)
							this.allPagination = res.data.pagination
						}
					})
				} else {
					uni.showToast({
						title: "已加载全部",
						icon: "none"
					})
				}
			},
			closeLogin() {
				this.showLogin = false
			},
			getTabbarHeight(e) {
				this.tabbarHeight = e
			},
			toDetail(item) {
				uni.navigateTo({
					url: "/worker/work_detail/work_detail?id=" + item.id
				})

			},
			getMore() {
				if (this.currentPage < this.pagination.page_count) {
					this.currentPage++
					let url = "/guest/recommend-jobs?page=" + this.currentPage +
						"&keyword=&crowd_sourcing_job_type_code=" +
						this.currentTab.value
					this.$request(url).then(res => {
						if (res.code == 0) {
							this.jobList = this.jobList.concat(res.data.list)
							this.pagination = res.data.pagination
						}
					})
				} else {
					uni.showToast({
						title: "已加载全部",
						icon: "none"
					})
				}

			},
			closeMask() {
				this.showMask = false
			},
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep {
		.u-navbar--fixed {
			background: linear-gradient(180deg, #9EC2FF 0%, #FFFFFF 100%);
		}

		.u-tabs__wrapper__nav__item {
			padding: 0 !important;
		}
	}

	.labels_wrap {
		width: 100%;
		background: #FFFFFF;
		padding: 28rpx;
		box-sizing: border-box;

		.btn_wrap {
			align-items: flex-end;
			flex-shrink: 0;

			.btn_text {
				font-size: 29rpx;
				color: #333333;
			}
		}


	}

	.tab_2 {
		padding: 28rpx 28rpx 20rpx 28rpx;
		background: #F3F3F5;

		.tab_2_item {
			position: relative;
			font-weight: 600;
			font-size: 29rpx;
			color: #929292;
			margin-right: 38rpx;

			&.active {
				color: #333333;
			}

			&.active::after {
				position: absolute;
				content: "";
				width: 38rpx;
				height: 6rpx;
				background: #216FF9;
				border-radius: 4rpx;
				bottom: -10rpx;
				left: 50%;
				transform: translateX(-50%);
			}
		}
	}

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
		min-height: 100vh;
		background: #F3F3F5;
	}

	.empty {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translateX(-50%);
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
		padding: 0 28rpx;
		// position: fixed;
		// width: calc(100% - 96rpx);
		// left: 48rpx;
		// z-index: 3;
		// border-top-left-radius: 16rpx;
		// border-top-right-radius: 16rpx;
		// overflow: hidden;
		background: #F3F3F5;

		.item {
			padding: 28rpx 28rpx 0 28rpx;
			border-radius: 16rpx;
			background: #fff;
			margin-bottom: 28rpx;
			position: relative;

			.status {
				position: absolute;
				top: 0;
				right: 0;
				font-size: 0;

				image {
					width: 96rpx;
				}
			}

			.item_top {
				flex-wrap: wrap;
			}

			.title {
				width: calc(60% - 16rpx);
				flex-shrink: 0;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				box-sizing: border-box;
				position: relative;
				font-weight: 600;
				font-size: 33rpx;
				color: #333333;

				.text {

					width: calc(100% - 170rpx);
				}
			}

			.salary {
				width: 40%;
				font-weight: 600;
				font-size: 31rpx;
				color: #EA9900;
				white-space: nowrap;
				text-align: right;
			}

			.count {
				color: #3780FF;
				text-align: right;
			}

			// .period {
			// 	font-size: 23rpx;
			// 	color: #A8A8A8;
			// 	display: inline-block;
			// 	font-style: normal;
			// 	margin-left: 10rpx;
			// 	font-weight: 400;
			// }

			.labels {
				padding: 23rpx 0rpx 0 0;
				flex-wrap: wrap;

				.label {
					height: 48rpx;
					line-height: 48rpx;
					padding: 0 12rpx;
					background: #F6F6F6;
					border-radius: 6rpx;
					font-size: 24rpx;
					color: #5E5E5E;
					margin-right: 16rpx;
					white-space: nowrap;
					margin-bottom: 16rpx;

					&.active {
						background: #E5EEFF;
						color: #216FF9;
					}
				}
			}

			.bottom {
				font-weight: 400;

				.location {
					padding: 10rpx 0 28rpx 0rpx;
					font-size: 29rpx;
					color: #686868;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.sign_btn {
					padding: 10rpx 0 28rpx 28rpx;
					flex-shrink: 0;

					image {
						width: 37rpx;
						margin-right: 6rpx;
					}

					font-size: 29rpx;
					color: #216FF9;
				}
			}
		}
	}
</style>