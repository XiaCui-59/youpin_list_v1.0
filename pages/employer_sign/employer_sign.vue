<template>
	<view class="single_page" v-if="ifSingle">
		<image :src="imgUrl+'/worker/single_page.png'" mode="widthFix" style="width: 100%;"></image>
	</view>
	<view class="content" v-else>
		<customHeader :title="pageName" :showBack="false" bgUrl="/broker/bg_2.png" :headHeight="headerHeight"
			:showScan="true"></customHeader>
		<view class="cont" :style="{marginTop:marginTop+'px'}">
			<view class="top_area" :style="{top:marginTop+2*tabMargin+'px'}">
				<u-picker ref="uPicker" :show="showPicker" :immediateChange="true" :columns="projects" title="选择需求"
					keyName="description" confirmColor="#F7BC05" :closeOnClickOverlay="true" @close="closePicker"
					@cancel="closePicker" @confirm="confirmProject"></u-picker>
				<view class="subtabs flex flex-start" :style="{height:subTabHeight+'px',marginBottom:tabMargin+'px'}">
					<view class="subtab flex flex_around" v-for="(item,index) in tabs" :key="index"
						:class="currentTab.value==item.value?'active':''" @click="changeTab(item)">{{item.text}}</view>
				</view>
				<view class="pro_sele flex" :class="proValue.name != '全部'?'':'nodata'"
					:style="{height:releTopHead+'px',marginTop:tabMargin+'px',paddingLeft:tabMargin+'px',paddingRight:tabMargin+'px'}"
					@click="openPicker">
					<view class="pro_sele_inner" :style="{height:subTabHeight+'px',lineHeight:subTabHeight+'px'}">
						{{proValue.description != "全部"?proValue.description:"点击这里可筛选需求"}}
						<view class="pro_ic">
							<u-icon name="arrow-down-fill" color="#F7BC05" size="18"></u-icon>
						</view>
					</view>

				</view>
			</view>
			<view class="box" :style="{top:boxTop+'px',background:list.length==0?'#fff':'#F3F3F5'}">
				<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y"
					:style="{height:scrollHeight+'px'}" refresher-enabled="true" :refresher-triggered="triggered"
					:refresher-threshold="100" refresher-background="#f5f5f5" @refresherpulling="onPulling"
					@refresherrefresh="onRefresh" @refresherrestore="onRestore" @refresherabort="onAbort"
					@scrolltolower="lower">
					<view class="item" v-for="(item,index) in list" :key="index">
						<view class="item_top flex flex_btween">
							<view class="status_icon">
								<image
									:src="imgUrl+ workerStatus.filter(el => {return el.value == item.application_status})[0].icon"
									mode="widthFix"></image>
							</view>
							<view class="left flex flex-start">
								<image :src="item.worker_avatar.url" mode="widthFix"></image>
								<view class="base">
									<view class="name">{{item.worker_name}}</view>
									<view class="job_name">{{item.job_name}}</view>
									<view class="idcard">{{item.create_time}}</view>
								</view>
							</view>
						</view>
						<view class="item_middle flex flex_around">
							<view class="mid_item">{{item.worker_gender=="male"?"男":"女"}}</view>
							<view class="mid_item">{{item.worker_nation}}</view>
							<view class="mid_item">{{item.worker_age}}<text class="period">岁</text>
							</view>
							<view class="mid_item" style="font-size: 0;display: flex;justify-content: space-around;">
								<image :src="imgUrl+'/broker/phone_icon.png'" mode=""
									@click="makePhoneCall(item.worker_mobile)"></image>
							</view>
						</view>
						<view class="item_bot" v-if="item.application_status == 'hired'">
							<view class="line flex flex_btween">
								<view class="opra refuse" @click="depart(item)">离职</view>
							</view>
						</view>

					</view>
					<view class="empty" v-if="list.length == 0">
						<image :src="imgUrl+'/broker/empty.png'" mode="widthFix"></image>
					</view>
				</scroll-view>

			</view>
		</view>
		<login :showLogin="showLogin" @cancel="cancelLogin" @closeLogin="closeLogin" @getInfo="getList">
		</login>
		<addName v-if="(!employerInfo.name) && (!nameShow) && (loginStatus == 'in')"></addName>
		<tabbar current="1" @getTabbarHeight="getTabbarHeight" :todo="todo"></tabbar>
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
				isPulling: false,
				triggered: false,
				proValue: {
					id: "",
					description: "全部"
				},
				showPicker: false,
				projects: [],
				showLogin: false,
				avatar: app.globalData.baseImageUrl + "/broker/com_default.png",
				imgUrl: app.globalData.baseImageUrl,
				pageName: "工人",
				marginTop: app.globalData.marginTop,
				mainTabHeight: app.globalData.mainTabHeight,
				subTabHeight: app.globalData.subTabHeight,
				releTopHead: app.globalData.releTopHead,
				tabMargin: app.globalData.tabMargin,
				bannerHeight: app.globalData.bannerHeight,
				tabs: [{
					value: "all",
					text: "全部"
				}, {
					value: "hired",
					text: "已入职"
				}, {
					value: "resigned",
					text: "已离职"
				}],
				currentTab: {
					value: "all",
					text: "全部"
				},
				workerStatus: commonData.workerStatus,
				list: [],
				scrollHeight: 0,
				boxTop: 0,
				headerHeight: app.globalData.topHeight,
				currentPage: 1,
				pagination: {},
				tabbarHeight: 0,
			}
		},
		components: {
			tabbar,
			customHeader,
			login,
			addName
		},
		onLoad() {
			this.boxTop = this.marginTop + this.releTopHead + 4.5 * this.tabMargin + this.subTabHeight
			this.scrollHeight = app.globalData.systemHeight - this.tabbarHeight - this.boxTop
		},
		computed: {
			...mapState(["employerInfo", "nameShow", "loginStatus"])
		},
		async onShow() {
			if (!this.isLogin()) {
				this.showLogin = true
			} else {
				this.getRequireList()
				this.getList()
			}
		},
		methods: {
			makePhoneCall(mobile) {
				uni.makePhoneCall({
					phoneNumber: mobile
				})
			},
			// 自定义下拉刷新控件被下拉
			onPulling(e) {
				console.log("onpulling", e);
				if (e.detail.deltaY < 0) return // 防止上滑页面也触发下拉
				this.triggered = true;
			},
			// 自定义下拉刷新被触发
			onRefresh() {
				if (this.isPulling) return;
				this.isPulling = true;
				setTimeout(() => {
					this.triggered = false;
					this.isPulling = false;
					this.getList();
				}, 500);
			},
			// 自定义下拉刷新被复位
			onRestore() {
				this.triggered = 'restore'; // 需要重置
			},
			// 自定义下拉刷新被中止
			onAbort() {
				console.error("onAbort");
			},
			depart(item) {
				let _this = this
				uni.showModal({
					title: "提示",
					content: "是否确认对员工：" + item.worker_name + "进行离职操作？",
					confirmText: "确认离职",
					success(resp) {
						if (resp.confirm) {
							let url = "/employer/jobRequirementApplication/" + item.job_application_id + "/resign"
							_this.$request(url, {}, "PATCH").then(res => {
								if (res.code == 0) {
									uni.showToast({
										title: "办理离职成功",
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
			closePicker() {
				this.showPicker = false
			},
			confirmProject(e) {
				console.log(e)
				this.proValue = e.value[0]
				this.currentPage = 1
				this.getList()
				this.closePicker()
			},
			openPicker() {
				this.showPicker = true
			},
			cancelLogin() {
				this.closeLogin()
				uni.switchTab({
					url: "/pages/employer_index/employer_index"
				})
			},
			closeLogin() {
				this.showLogin = false
			},
			getRequireList() {
				let url = "/employer/jobRequirements?page=1" + "&status=" + this.currentTab.value
				this.$request(url).then(res => {
					if (res.code == 0) {
						let arr = [{
							id: "",
							description: "全部"
						}]
						this.projects[0] = arr.concat(res.data.list)
						// this.pagination = res.data.pagination
					}
				})
			},
			getTabbarHeight(e) {
				this.tabbarHeight = e
			},
			changeTab(item) {
				this.currentTab = item
				this.currentPage = 1
				this.getList()
			},
			getMore() {
				let keyword = this.proValue.description == "全部" ? "" : this.proValue.description
				let url = "/employer/jobRequirementApplications?page=" + this.currentPage + "&application_status=" + this
					.currentTab.value +
					"&keyword=" + keyword + "&requirement_status=all"
				this.$request(url).then(res => {
					if (res.code == 0) {
						this.list = this.list.concat(res.data.list)
						this.pagination = res.data.pagination
					}
				})
			},
			getList() {
				let keyword = this.proValue.description == "全部" ? "" : this.proValue.description
				let url = "/employer/jobRequirementApplications?page=1" + "&application_status=" + this.currentTab.value +
					"&keyword=" + keyword + "&requirement_status=all"
				this.$request(url).then(res => {
					if (res.code == 0) {
						this.list = res.data.list
						this.pagination = res.data.pagination
					}
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

	.opra {
		width: 154rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border-radius: 8rpx;
		font-size: 27rpx;

		&.refuse {
			color: #FF5353;
			border: 1px solid #FF5353;
		}
	}

	.top_area {
		width: calc(100% - 92rpx);
		left: 46rpx;
		position: fixed;
		z-index: 90;

		.pro_sele {
			background: #fff;
			border-radius: 15rpx;
			color: #333;
			font-size: 29rpx;

			.pro_sele_inner {
				width: 100%;
				background: #F9F9F9;
				border-radius: 8rpx;
				padding: 0 21rpx;
				position: relative;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;

				.pro_ic {
					position: absolute;
					top: 50%;
					right: 20rpx;
					transform: translateY(-50%);
				}
			}

			&.nodata {
				font-weight: 400;
				font-size: 27rpx;
				color: #9E9E9E;
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
			padding: 19rpx 40rpx 28rpx 40rpx;
			border-radius: 16rpx;
			background: #fff;
			box-shadow: 0 2rpx 6rpx 0 rgba(0, 0, 0, 0.15);
			margin-bottom: 20rpx;
			position: relative;


			.item_top {
				align-items: start;
				position: relative;
				background: #F6F6F6;
				border-radius: 8rpx;
				padding: 19rpx;

				.status_icon {
					position: absolute;
					font-size: 0;
					top: 0;
					right: 0;

					image {
						width: 74rpx;
						height: 74rpx;
					}
				}

				.left {
					width: 100%;

					image {
						width: 88rpx;
						height: 88rpx;
						border-radius: 50%;
						margin-right: 19rpx;
						background: #ccc;
						flex-shrink: 0;
					}

					.base {
						flex-shrink: 0;
						width: calc(100% - 108rpx);
						color: #333333;

						.name {
							font-size: 33rpx;
							margin-bottom: 10rpx;
						}

						.job_name {
							font-weight: 600;
							font-size: 27rpx;
							margin-bottom: 5rpx;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
						}

						.idcard {
							font-size: 24rpx;
							color: rgba(51, 51, 51, 0.4);
						}
					}
				}

				.status {
					width: 100rpx;
					height: 46rpx;
					background: #216FF9;
					border-radius: 4rpx;
					font-size: 24rpx;
					color: #FFFFFF;
					line-height: 46rpx;
					text-align: center;

					&.entry {
						background: #EA9900;
					}

					&.wait_check_in {
						background: #2ED775;
					}

					&.check_in {
						background: #FFDE9F;
						color: #EA9900;
					}

					&.depart {
						background: #FF5353;
					}
				}
			}

			.item_middle {
				height: 76rpx;
				line-height: 76rpx;

				.mid_item {
					width: 33%;
					text-align: center;
					font-size: 27rpx;
					color: #000000;
					position: relative;

					.period {
						font-weight: 400;
						font-size: 23rpx;
						color: #686868;
						display: inline-block;
						margin-left: 6rpx;
					}

					&::after {
						content: "";
						width: 2rpx;
						height: 35rpx;
						background: #E9E9E9;
						position: absolute;
						top: 50%;
						right: 0;
						transform: translateY(-50%);
					}

					&:last-child::after {
						display: none;
					}

					image {
						width: 50rpx;
						height: 50rpx;
					}
				}
			}

			.item_bot {
				padding-top: 30rpx;
				border-top: 2rpx solid #E9E9E9;
			}
		}
	}
</style>