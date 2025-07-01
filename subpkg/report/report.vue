<template>
	<view class="single_page" v-if="ifSingle">
		<image :src="imgUrl+'/worker/single_page.png'" mode="widthFix" style="width: 100%;"></image>
	</view>
	<view class="report" v-else>
		<!-- 自定义导航 -->
		<u-navbar title="工作意向匹配报告" @rightClick="rightClick" :autoBack="true" bgColor="rgba(255, 255, 255, 0.2)"
			titleStyle="color:#010101;font-size: 31rpx;">
			<view class="u-nav-slot" slot="left"
				style="width:57rpx;height:57rpx;text-align: center;line-height: 57rpx;border:1px solid #fff;border-radius: 50%;">

				<u-icon name="arrow-left" size="19" color="#fff"
					custom-style="display: inline-block;line-height: 57rpx;margin:0 auto;left:-2rpx;"></u-icon>
			</view>
		</u-navbar>
		<view class="cont"
			:style="{top:marginTop+tabMargin+'px',height:contHeight+'px',background:info.worker_name?'transparent':'#fff'}">
			<view class="base_info flex" v-if="info.worker_name">
				<u-avatar :text="info.worker_name.slice(0,1)" color="#1677FF" font-size="42rpx" size="46"
					bg-color="#FFFFFF"></u-avatar>
				<view class="info">
					<view class="name">{{info.worker_name}}</view>
					<view class="text">报告生成时间：{{info.create_time}}</view>
				</view>
			</view>
			<view class="more" v-if="info.worker_name">
				<view class="more_base">
					<view class=" flex flex_btween">
						<view class="name flex">
							<u-icon name="play-right-fill" color="#2979ff" size="14"></u-icon>
							<view>{{info.job_name}}</view>
						</view>
						<view class="status flex">
							<u-icon name="checkmark-circle-fill" color="#FAAD14" size="20"></u-icon>
							<view>报名成功</view>
						</view>
					</view>
					<view class="flex flex_btween" style="margin-top: 30rpx;margin-bottom: 26rpx;">
						<view class="summary">{{info.intention_report.overview.summary}}</view>
						<view class="charts-box">
							<qiun-data-charts type="arcbar" :opts="opts" :chartData="chartData" canvas-id="column"
								:canvas2d="true" />
						</view>
					</view>
					<view class="labels flex">
						<view class="label" v-for="(item,index) in info.intention_report.dimensions"
							:class="item.score < 70?'warning':''">{{item.summary}}
						</view>
					</view>
					<view class="next"><text>下一步：</text>您的求职事向已记录在系统中,请保持手机畅通,静候招聘方的面试邀约。通常情况企业会在1-3个工作日内联系合适的候选人。
					</view>
					<view class="btns flex flex_btween">
						<view class="btn" @click="toChat">查看类似职位</view>
						<view class="btn" @click="toZhida">查看工作进度</view>
					</view>
				</view>
				<view class="box">
					<view class="title">多维度匹配分析</view>
					<view class="box_cont">
						<view class="item" v-for="(item,index) in info.intention_report.dimensions">
							<view class="top flex flex_btween">
								<view class="subtit">{{item.name}}</view>
								<view class="right flex flex_end">
									<u-line-progress :percentage="item.score"
										:activeColor="item.score < 70?'#FAAD14':'#1677FF'"
										:showText="false"></u-line-progress>
									<view class="percent" :style="{color:item.score < 70?'#FAAD14':'#1677FF'}">
										{{item.score}}%
									</view>
								</view>
							</view>
							<view class="bot">{{item.analysis}}</view>
						</view>
					</view>
				</view>
				<view class="box">
					<view class="title">实际工作条件评估</view>
					<view class="box_cont">
						<view class="item item2 flex" v-for="(item,index) in info.intention_report.work_conditions">
							<view class="left">{{index+1}}</view>
							<view class="right">
								<view class="subtit">{{item.name}}</view>
								<view class="text">{{item.description}}</view>
							</view>

						</view>
					</view>
				</view>
			</view>
			<view class="nodata" v-if="!info.worker_name">
				<view class="text">报告生成中</view>
				<view class="img">
					<image :src="imgUrl+'/worker/v2/report_loading.png'" mode="widthFix"></image>
				</view>
				<view class="text">点击按钮刷新工作报告</view>
				<view class="btn" @click="getInfo">刷新</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				ifSingle: app.globalData.scene == 1154 ? true : false,
				imgUrl: app.globalData.baseImageUrl,
				marginTop: app.globalData.marginTop,
				tabMargin: app.globalData.tabMargin,
				contHeight: 0,
				periodList: [{
						value: "month",
						text: "/月"
					},
					{
						value: "day",
						text: "/天"
					},
					{
						value: "hour",
						text: "/时"
					}
				],
				info: {
					create_time: "",
					intention_report: {
						overview: {
							total_score: 0,
							summary: ""
						},
						work_conditions: [],
						dimensions: []
					},
					job_name: "",
					worker_name: ""
				},
				id: "",
				list: [],
				currentPage: 1,
				pagination: {},
				chartData: {},
				opts: {
					color: ["#1677FF", "#1677FF", "#FAC858", "#EE6666", "#73C0DE", "#1677FF", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: undefined,
					title: {
						name: "",
						fontSize: "15",
						color: "#1677FF"
					},
					subtitle: {
						name: "匹配度",
						fontSize: "11",
						color: "#333333"
					},
					extra: {
						arcbar: {
							type: "circle",
							width: 4,
							backgroundColor: "#E9E9E9",
							startAngle: 1.5,
							endAngle: 0.25,
							gap: 2,
							lineCap: "butt"
						}
					}
				},
			}
		},
		onLoad(param) {
			this.id = param.id
			uni.setNavigationBarColor({
				frontColor: '#000000',
				backgroundColor: 'transparent'
			})
			this.contHeight = app.globalData.systemHeight - this.marginTop - this.tabMargin
			if (this.isLogin() && this.id) {
				this.getInfo()
			} else {
				uni.redirectTo({
					url: "/pages/worker_index/worker_index"
				})
			}
		},
		methods: {
			getInfo() {
				uni.showLoading()
				let url = "/worker/" + this.id + "/intentionReport"
				this.$request(url).then(res => {
					if (res.code == 0) {
						this.info = res.data
						let chartData = {
							series: [{
								name: "匹配度",
								color: "#1677FF",
								data: res.data.intention_report.overview.total_score / 100
							}]
						};
						this.opts.title.name = res.data.intention_report.overview.total_score + "%"
						this.chartData = JSON.parse(JSON.stringify(chartData));
						uni.hideLoading()
					} else {
						uni.hideLoading()
					}
				})
			},
			toZhida() {
				uni.navigateToMiniProgram({
					appId: 'wx3237f09d180aeedf',
					path: 'pages/index/index',
					success(res) {
						// 打开成功
					}
				})
			},
			toChat() {
				let _this = this
				// 获取页面栈
				let pages = getCurrentPages();
				// 上一个页面实例
				let prevPage = pages[pages.length - 2];
				// 调用上一个页面的方法
				uni.navigateBack()
				if (prevPage && prevPage.$vm && typeof prevPage.$vm.changeTab === 'function') {
					prevPage.$vm.changeTab(1);
				}
				setTimeout(function() {
					if (prevPage && prevPage.$vm && typeof prevPage.$vm.sendBtnMsg === 'function') {
						let obj = {
							type: "",
							msg: "我想了解一下和" + _this.info.job_name + "这个工作类似的其他职位。"
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

	.report {
		height: 100vh;
		background: linear-gradient(180deg, #4290FF 0%, #91BAFF 9%, #F0F5FE 60%);
		color: $base-fontcolor;

		.cont {
			position: fixed;
			left: 0;
			width: 100%;
			overflow-y: scroll;

			.nodata {
				position: absolute;
				top: 40%;
				left: 50%;
				transform: translate(-50%, -50%);
				text-align: center;

				.img {
					image {
						width: 236rpx;
					}

				}

				.text {
					font-weight: 400;
					font-size: 29rpx;
					color: #333333;
					line-height: 40rpx;
				}

				.btn {
					margin: 17rpx auto 0 auto;
					width: 212rpx;
					height: 77rpx;
					line-height: 77rpx;
					background: #216FF9;
					box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0, 0, 0, 0.15);
					border-radius: 15rpx;
					font-weight: 400;
					font-size: 29rpx;
					color: #FFFFFF;
				}
			}

			.base_info {
				background: #1677FF;
				padding: 21rpx 0rpx 21rpx 28rpx;

				.info {
					margin-left: 19rpx;

					.name {
						font-weight: 600;
						font-size: 35rpx;
						color: #FFFFFF;
						line-height: 48rpx;
					}

					.text {
						font-weight: 400;
						font-size: 23rpx;
						color: #D8D8D8;
						line-height: 40rpx;
					}
				}
			}

			.more {
				padding: 38rpx 28rpx;
				background: #FFFFFF;

				.box {
					margin-top: 50rpx;

					.title {
						font-weight: 400;
						font-size: 27rpx;
						color: #333333;
						position: relative;
						padding: 19rpx 0 19rpx 19rpx;
						border-bottom: 2rpx dotted #C3D9FF;

						&::before {
							position: absolute;
							top: 50%;
							left: 0;
							transform: translateY(-50%);
							content: "";
							width: 8rpx;
							height: 27rpx;
							background: #1677FF;
							border-radius: 4rpx;
						}
					}

					.box_cont {
						.item {
							margin: 19rpx 0;
							background: #F3F5FF;
							border-radius: 6rpx;
							padding: 28rpx 19rpx 19rpx 19rpx;

							&.item2 {
								padding: 28rpx 19rpx 19rpx 23rpx;
							}

							.left {
								width: 67rpx;
								height: 67rpx;
								border-radius: 50%;
								background: #D5E4FE;
								color: #1677FF;
								font-weight: 600;
								font-size: 34rpx;
								text-align: center;
								line-height: 67rpx;
								margin-right: 17rpx;
								flex-shrink: 0;
							}

							.right {
								.subtit {
									font-weight: 600;
									font-size: 27rpx;
									color: #333333;
									line-height: 38rpx;
									margin-bottom: 8rpx;
								}

								.text {
									font-weight: 400;
									font-size: 23rpx;
									color: #333333;
									line-height: 33rpx;
								}
							}

							.top {
								margin-bottom: 15rpx;

								.subtit {
									font-weight: 600;
									font-size: 27rpx;
									color: #333333;
									flex-shrink: 0;
									margin-right: 38rpx;
								}

								.right {
									width: 100%;

									.percent {
										font-weight: 600;
										font-size: 27rpx;
										color: #1677FF;
										margin-left: 10rpx;
									}
								}
							}

							.bot {
								font-weight: 400;
								font-size: 23rpx;
								color: #6B6B6B;
								line-height: 33rpx;
							}
						}
					}
				}

				.more_base {
					.name {
						font-weight: 600;
						font-size: 35rpx;
						color: #333333;
					}

					.status {
						font-weight: 600;
						font-size: 31rpx;
						color: #FAAD14;
					}

					.summary {
						width: calc(100% - 200rpx);
						flex-shrink: 0;
						font-weight: 400;
						font-size: 27rpx;
						color: #333333;
						line-height: 42rpx;
					}

					.charts-box {
						width: 150rpx;
						height: 150rpx;
					}

					.labels {
						flex-wrap: wrap;

						.label {
							padding: 10rpx 17rpx;
							background: #F3F5FF;
							border-radius: 25rpx;
							font-weight: 400;
							font-size: 23rpx;
							color: #1677FF;
							margin-right: 15rpx;
							margin-bottom: 8rpx;

							&.warning {
								background: #FEF3C6;
								color: #D68629;
							}
						}
					}

					.next {
						font-weight: 400;
						font-size: 27rpx;
						color: #333;
						line-height: 46rpx;
						background: #F3F5FF;
						border-radius: 8rpx;
						padding: 11rpx 19rpx;
						margin-top: 10rpx;
						margin-bottom: 19rpx;

						text {
							color: #0045A6;
						}
					}

					.btns {
						.btn {
							width: 212rpx;
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

							&:nth-child(2) {
								background: #216FF9;
								color: #FFFFFF;
							}
						}
					}
				}
			}
		}
	}
</style>