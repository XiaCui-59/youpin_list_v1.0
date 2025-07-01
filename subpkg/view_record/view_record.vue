<template>
	<view class="single_page" v-if="ifSingle">
		<image :src="imgUrl+'/worker/single_page.png'" mode="widthFix" style="width: 100%;"></image>
	</view>
	<view class="view_record" v-else>
		<!-- 自定义导航 -->
		<u-navbar title="工作浏览记录" @leftClick="leftClick" bgColor="#fff" titleStyle="color:#010101;font-size: 31rpx;">
			<view class="u-nav-slot" slot="left"
				style="width:57rpx;height:57rpx;text-align: center;line-height: 57rpx;border:1px solid #C5C6CB;border-radius: 50%;">

				<u-icon name="arrow-left" size="19" color="#4E4E52"
					custom-style="display: inline-block;line-height: 57rpx;margin:0 auto;left:-2rpx;"></u-icon>
			</view>
		</u-navbar>
		<view class="cont" :style="{marginTop:marginTop+tabMargin+'px',minHeight:contHeight+'px'}">
			<view class="item" v-for="(item,index) in list" :key="index" @click="makePhoneCall" v-if="list.length != 0">
				<view class="title flex flex_btween" :class="item.status=='published'?'':'grey'">{{item.name}}
				</view>
				<view class="middle flex flex_btween">
					<view class="mid_in_item">
						<!-- <view class="tit">工资</view> -->
						<view class="salary flex flex-start" :class="item.status=='published'?'':'grey'">
							{{(item.min_salary == item.max_salary?item.min_salary:(item.min_salary+"-"+item.max_salary))}}
							<text
								class="period">{{"元"+periodList.filter(el=>{return el.value==item.salary_type})[0].text}}</text>
						</view>
					</view>
					<view class="mid_in_item" v-if="item.status == 'published'">电话联系</view>
				</view>
				<view class="bottom flex" :class="item.address?'flex_btween':'flex_end'">
					<view class="location flex" v-if="item.address">
						<image :src="imgUrl+'/worker/v2/ic_location.png'" mode="widthFix"></image>
						<view>{{item.address}}</view>
					</view>
					<view class="time">{{item.create_time.slice(0,16)}}</view>
				</view>
				<view class="status">
					<image
						:src="item.status == 'published'?imgUrl+'/worker/new/ic_hot_lable.png':imgUrl+'/worker/new/ic_end_label.png'"
						mode="widthFix"></image>
				</view>
			</view>
			<view class="empty" v-if="list.length == 0">
				<image :src="imgUrl+'/worker/no_data.png'" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import commonData from '../../common/commonData'
	const app = getApp()
	export default {
		data() {
			return {
				ifSingle: app.globalData.scene == 1154 ? true : false,
				imgUrl: app.globalData.baseImageUrl,
				marginTop: app.globalData.marginTop,
				tabMargin: app.globalData.tabMargin,
				contHeight: 0,
				periodList: commonData.periodList,
				list: [],
				currentPage: 1,
				pagination: {}
			}
		},
		onReachBottom() {
			if (this.currentPage < this.pagination.pageCount) {
				this.currentPage++
				this.getList()
			} else {
				uni.showToast({
					title: "已加载全部",
					icon: "none",
					duration: 2000
				})
			}
		},
		onLoad() {
			uni.setNavigationBarColor({
				frontColor: '#000000',
				backgroundColor: 'transparent'
			})
			this.contHeight = app.globalData.systemHeight - this.marginTop - this.tabMargin
			if (this.isLogin()) {
				this.getList()
			} else {
				uni.switchTab({
					url: "/pages/worker_index/worker_index"
				})
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
					uni.switchTab({
						url: "/pages/worker_index/worker_index"
					})
				}
			},
			getList() {
				let url = "/worker/job-browse-records?page=" + this.currentPage
				this.$request(url).then(res => {
					if (res.code == 0) {
						this.list = this.list.concat(res.data.list)
						this.pagination = res.data.pagination
					}
				})
			},
			toDetail(item) {
				uni.navigateTo({
					url: "/worker/work_detail/work_detail?id=" + item.job_id
				})

			},
			makePhoneCall() {
				this.$store.dispatch('makePhoneCall')
			},
			toChat(item) {
				console.log(item)
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
				setTimeout(function() {
					if (prevPage && prevPage.$vm && typeof prevPage.$vm.sendBtnMsg === 'function') {
						let obj = {
							type: "",
							msg: "我想继续了解一下" + item.name + "(ID:" + item.id + ")这个工作。"
						}
						prevPage.$vm.sendBtnMsg(obj);
					}
				}, 1000)


			}
		}
	}
</script>

<style lang="scss">
	::v-deep {}

	.view_record {
		height: 100vh;
		background: #fff;
		color: $base-fontcolor;
		overflow: scroll;

		.cont {
			background: #F7F8FA;
			padding: 38rpx 26rpx;
			box-sizing: border-box;

			.item {
				padding: 40rpx 48rpx 23rpx 40rpx;
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

				.title {
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					padding-left: 22rpx;
					box-sizing: border-box;
					position: relative;
					font-weight: 600;
					font-size: 33rpx;
					color: #333333;

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
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						box-sizing: border-box;
						width: calc(100% - 170rpx);
					}

					.time {
						width: 160rpx;
						font-weight: 400;
						font-size: 27rpx;
						color: #5A5A5A;
						text-align: right;
					}

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

				.middle {
					font-size: 30rpx;
					margin: 20rpx 0 0 0;
					padding: 17rpx 20rpx;
					box-sizing: border-box;
					background: #F6F6F6;
					border-radius: 8rpx;

					.mid_in_item {
						&:last-child {
							padding-bottom: 6rpx;
							font-weight: 600;
							font-size: 27rpx;
							color: #2675F5;
							border-bottom: 2rpx dashed #2675F5;
						}

						.tit {
							font-size: 25rpx;
							color: #5A5A5A;
							line-height: 46rpx;
							font-weight: 400;
						}

						view {

							font-weight: 600;
							font-size: 35rpx;
						}

						.salary {
							color: #EA9900;

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
							margin-left: 10rpx;
							font-weight: 400;
						}
					}

				}

				.bottom {
					margin-top: 16rpx;
					font-weight: 400;
					font-size: 23rpx;
					color: #5A5A5A;
					box-sizing: border-box;

					.location {
						width: 60%;

						image {
							width: 26rpx;
							margin-right: 10rpx;
						}

						view {
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
						}
					}

					.time {
						margin-left: 20rpx;
						flex-shrink: 0;
						white-space: nowrap;
					}
				}
			}
		}
	}
</style>