<template>
	<view class="single_page" v-if="ifSingle">
		<image :src="imgUrl+'/worker/single_page.png'" mode="widthFix" style="width: 100%;"></image>
	</view>
	<view class="view_record" v-else>
		<!-- 自定义导航 -->
		<u-navbar title="热招职位" @leftClick="leftClick" bgColor="rgba(255, 255, 255, 0.25)"
			titleStyle="color:#010101;font-size: 31rpx;">
			<view class="u-nav-slot" slot="left"
				style="width:57rpx;height:57rpx;text-align: center;line-height: 57rpx;border:1px solid #0F2A4F;border-radius: 50%;">

				<u-icon name="arrow-left" size="19" color="#0F2A4F"
					custom-style="display: inline-block;line-height: 57rpx;margin:0 auto;left:-2rpx;"></u-icon>
			</view>
		</u-navbar>
		<view class="cont" :style="{marginTop:marginTop+tabMargin+'px'}">
			<view class="fixed_area" :style="{top:marginTop+2*tabMargin+'px'}">
				<!-- 搜索框 -->
				<view class="search_wrap flex flex_btween"
					:style="{height:searchBoxHeight+'px',marginBottom:tabMargin+'px'}">
					<input type="text" v-model="keyword" placeholder="请输入关键词" placeholder-class="placeholder"
						confirm-type="search" @confirm="getList" />
					<view class="search_icon" @click="getList">
						<u-icon name="search" color="#1677FF" size="24"></u-icon>
					</view>
				</view>
				<!-- 菜单栏 -->
				<u-tabs :list="workType" keyName="label" :current="currentIndex" lineWidth="0" lineHeight="0"
					:activeStyle="{
					height:workTypeHeight+'px',
					lineHeight:workTypeHeight+'px',
					padding: '0 20rpx',
					borderRadius:'10rpx',
					fontSize: '27rpx',
					color: '#333333',
					background: '#FFFFFF',
					border:' 1rpx solid #216FF9'
				    }" :inactiveStyle="{
						height:workTypeHeight+'px',
						lineHeight:workTypeHeight+'px',
				        padding: '0 20rpx',
				        background:'#DAE8FF',
				        border: '1rpx solid #DAE8FF',
				        borderRadius:'10rpx',
				        fontSize: '27rpx',
				        color: '#333333'
				    }" :itemStyle="{height:workTypeHeight+2+'px'}" @click="handleTabClick">
				</u-tabs>
				<!-- <u-scroll-list :indicator="false">
					<view class="menu_item flex flex_around" v-for="(item, index) in workType"
						:style="{height:workTypeHeight+'px',lineHeight:workTypeHeight+'px'}"
						:class="currentWorkType.value == item.value?'active':''" :key="index" @click="chooseType(item)">
						<view class="menu_item_inner flex">
							<image :src="item.icon_mini" mode="widthFix"></image>
							<view class="menu_item_title">{{item.label}}</view>
						</view>
					</view>
				</u-scroll-list> -->
			</view>
			<scroll-view scroll-y="true" :style="{height:scrollHeight+'px',marginTop:scrollTop+'px'}"
				@scrolltolower="getMore">
				<view class="list">
					<view class="item" v-for="(item,index) in jobList" :key="index" @click="toChat(item)">
						<view class="item_top flex flex_btween">
							<view class="title" :class="systemHeight > 750?'full_width':''">{{item.name}}
							</view>
							<view class="salary flex flex_end" :class="systemHeight > 750?'full_width':''">
								{{(item.min_salary== item.max_salary?item.max_salary:(item.min_salary+"-"+item.max_salary))}}
								<text
									class="period">{{"元"+period.filter(el=>{return el.value==item.salary_type})[0].text}}</text>
							</view>
						</view>
						<view class="labels flex" :class="item.highlight.length >2?'flex_btween':'flex-start'"
							v-if="item.highlight && item.highlight.length != 0">
							<view class="label flex" :class="item.highlight.length >2?'':'min_width'"
								v-for="(label,labIndex) in item.highlight.slice(0,3)" :key="labIndex">
								<text></text>{{label}}
							</view>
						</view>
						<view class="bottom flex" :class="item.address?'flex_btween':'flex_end'">
							<view class="location flex" v-if="item.address">
								<image :src="imgUrl+'/worker/v2/ic_location.png'" mode="widthFix"></image>
								{{item.province+item.city}}
							</view>
							<view class="sign_btn">立即报名</view>
						</view>
					</view>
				</view>
				<view class="empty" v-if="jobList.length == 0">
					<image :src="imgUrl+'/worker/v2/empty_blur.png'" mode="widthFix"></image>
					<view class="text">暂无相关职位</view>
					<view class="btn" @click="toChat('')">AI陪你找工作，聊聊吧</view>
				</view>
			</scroll-view>


		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex"
	import commonData from "@/common/commonData.js"
	const app = getApp()
	export default {
		data() {
			return {
				ifSingle: app.globalData.scene == 1154 ? true : false,
				systemHeight: app.globalData.systemHeight,
				currentIndex: 0,
				keyword: "",
				imgUrl: app.globalData.baseImageUrl,
				marginTop: app.globalData.marginTop,
				tabMargin: app.globalData.tabMargin,
				workTypeHeight: app.globalData.workTypeHeight,
				searchBoxHeight: app.globalData.searchBoxHeight,
				scrollHeight: 0,
				scrollTop: 0,
				contHeight: 0,
				period: commonData.periodList,
				jobList: [],
				currentPage: 1,
				pagination: {},
				currentWorkType: {
					value: "",
					label: "",
					icon_mini: "https://lingdongzhida.oss-cn-chengdu.aliyuncs.com/job_type_icon_mini/CS9900.png"
				}
			}
		},
		computed: {
			...mapState(["workType"])
		},
		async onReady() {
			uni.setNavigationBarColor({
				frontColor: '#000000',
				backgroundColor: 'transparent'
			})
			this.contHeight = app.globalData.systemHeight - this.marginTop - this.tabMargin
			this.scrollHeight = app.globalData.systemHeight - this.marginTop - 4 * this.tabMargin - this
				.searchBoxHeight - this.workTypeHeight
			this.scrollTop = 2 * this.tabMargin + this.searchBoxHeight + this.workTypeHeight + 2
		},
		onLoad(param) {
			if (param.type) {
				this.currentWorkType = JSON.parse(param.type)
				this.getList()
			} else {
				this.getList()
			}
		},
		methods: {
			leftClick() {
				// 判断有无上一页。有则返回，无则返回首页
				let pages = getCurrentPages()
				let prev = pages[pages.length - 2]
				if (prev) {
					uni.navigateBack()
				} else {
					uni.redirectTo({
						url: "/subpkg/index/index"
					})
				}
			},
			// chooseType(item) {
			// 	this.currentWorkType = {
			// 		...item
			// 	}
			// 	this.keyword = ""
			// 	this.getList()
			// },
			handleTabClick(index) {
				this.currentWorkType = {
					...index
				}
				this.keyword = ""
				this.getList()
			},
			getList() {
				let _this = this
				let url = "/guest/recommend-jobs?page=1&keyword=" + this.keyword + "&crowd_sourcing_job_type_code=" + this
					.currentWorkType.value
				this.$request(url).then(res => {
					if (res.code == 0) {
						this.jobList = res.data.list
						this.pagination = res.data.pagination
					}
				})
			},
			getMore() {
				if (this.currentPage < this.pagination.page_count) {
					this.currentPage++
					let url = "/guest/recommend-jobs?page=" + this.currentPage + "&keyword=" + this.keyword +
						"&crowd_sourcing_job_type_code=" + this.currentWorkType.value
					this.$request(url).then(res => {
						if (res.code == 0) {
							this.jobList = this.jobList.concat(res.data.list)
							this.pagination = res.data.pagination
						}
					})
				} else {
					uni.showToast({
						title: "已经到底啦~",
						icon: "none"
					})
				}

			},
			toChat(item) {
				console.log(item)
				let _this = this
				// 获取页面栈
				let pages = getCurrentPages();
				// 上一个页面实例
				let prevPage = pages[pages.length - 2];
				// 调用上一个页面的方法
				uni.navigateBack()
				if (prevPage && prevPage.$vm && typeof prevPage.$vm.changeTab === 'function') {
					prevPage.$vm.changeTab(1);
					prevPage.$vm.closeMenu()
				}
				let obj = {
					type: "",
					msg: ""
				}
				setTimeout(function() {
					if (prevPage && prevPage.$vm && typeof prevPage.$vm.sendBtnMsg === 'function') {
						if (item) {
							obj = {
								type: "",
								msg: "我想继续了解一下" + item.name + "(ID:" + item.id + ")这个工作。"
							}
						} else {
							obj = {
								type: "",
								msg: "还有哪些工作推荐呢？"
							}
						}

						prevPage.$vm.sendBtnMsg(obj);
					}
				}, 1000)


			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep {
		.u-icon--right {
			justify-content: flex-end;
		}

		.u-tabs__wrapper__nav__item {
			padding: 0 !important;
			margin-right: 25rpx;
		}
	}

	.empty {
		top: 40%;

		.text {
			font-size: 24rpx;
			color: #216FF9;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translateX(-50%);
			opacity: 0.7;
		}

		.btn {
			height: 77rpx;
			background: rgba(33, 111, 249, 0.19);
			box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0, 0, 0, 0.15);
			border-radius: 15rpx;
			border: 2rpx solid #216FF9;
			font-weight: 400;
			font-size: 29rpx;
			color: #1677FF;
			line-height: 77rpx;
			text-align: center;
		}
	}

	.view_record {
		width: 100%;
		height: 100vh;
		background: linear-gradient(180deg, #4290FF 0%, #91BAFF 9%, #F0F5FE 60%);
		color: $base-fontcolor;
		overflow: hidden;

		.cont {
			// background: #F7F8FA;
			padding: 20rpx 26rpx;
			box-sizing: border-box;


			.fixed_area {
				position: fixed;
				width: calc(100% - 52rpx);
				left: 26rpx;
				z-index: 999;
			}

			.search_wrap {
				background: #FFFFFF;
				border-radius: 19rpx;

				input {
					width: calc(100% - 100px);
					height: 100%;
					padding-left: 20rpx;
					box-sizing: border-box;
				}

				.search_icon {
					width: 100rpx;
					height: 100%;
					display: flex;
					padding-right: 20rpx;
					flex-direction: column;
					justify-content: space-around;
					box-sizing: border-box;
				}
			}

			.menu_item {
				padding: 0 20rpx;
				background: #DAE8FF;
				border: 1rpx solid #DAE8FF;
				border-radius: 10rpx;
				margin-right: 25rpx;
				flex-shrink: 0;
				font-size: 27rpx;
				color: #333333;

				&.active {
					background: #FFFFFF;
					border: 1rpx solid #216FF9;
				}

				.menu_item_inner {
					image {
						width: 25rpx;
						height: 25rpx;
						margin-right: 10rpx;
					}
				}
			}

			.list {
				padding-bottom: 20rpx;

				.item {
					padding: 38rpx 38rpx 30rpx 38rpx;
					border-radius: 16rpx;
					background: #fff;
					box-shadow: 0 2rpx 6rpx 0 rgba(0, 0, 0, 0.15);
					margin-bottom: 24rpx;
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
						padding-left: 22rpx;
						box-sizing: border-box;
						position: relative;
						font-weight: 600;
						font-size: 33rpx;
						color: #333333;

						&.full_width {
							width: 100%;
						}

						&.grey {
							color: #686868;

							.time {
								color: #CBCBCB;
							}
						}

						&.grey:before {
							background: #CBCBCB;
						}

						.text {

							width: calc(100% - 170rpx);
						}



						&:before {
							content: "";
							width: 8rpx;
							height: 31rpx;
							background: $em-base-color;
							border-radius: 2rpx;
							position: absolute;
							top: 50%;
							left: 0;
							transform: translateY(-50%);
						}
					}

					.salary {
						width: 40%;
						font-size: 42rpx;
						color: #333333;
						font-family: Arial;
						font-style: italic;
						font-weight: 600;
						white-space: nowrap;

						&.full_width {
							width: 100%;
						}


						&.grey {
							color: #686868;
						}
					}

					.count {
						color: #3780FF;
						text-align: right;
					}

					.period {
						font-size: 23rpx;
						color: #A8A8A8;
						display: inline-block;
						font-style: normal;
						margin-left: 10rpx;
						font-weight: 400;
					}

					.labels {
						margin-top: 20rpx;
						background: #F6F6F6;
						border-radius: 8rpx;
						padding: 24rpx 20rpx;

						.label {
							font-size: 27rpx;
							color: #686868;

							&.min_width {
								min-width: 33%;
							}

							text {
								display: inline-block;
								width: 12rpx;
								height: 12rpx;
								border-radius: 50%;
								background: #52C41A;
								margin-right: 8rpx;
							}
						}
					}

					.bottom {
						margin-top: 26rpx;
						font-weight: 400;
						font-size: 23rpx;
						color: #5A5A5A;
						// padding-left: 22rpx;
						box-sizing: border-box;

						.location {
							line-height: 13px;

							image {
								width: 26rpx;
								margin-right: 10rpx;
							}
						}

						.sign_btn {
							line-height: 46rpx;
							font-weight: 600;
							font-size: 27rpx;
							color: #216FF9;
							border-bottom: 1px dotted #216FF9;
						}
					}
				}
			}

		}
	}
</style>