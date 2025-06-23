<template>
	<view class="card_signup">
		<view class="top flex flex_btween">
			<view class="top_left">
				<view class="tit">恭喜你！报名成功了！</view>
				<view class="text flex">
					<image :src="imgUrl+'/worker/new/card_ic_zan.png'" mode="widthFix"
						style="margin-left: 0;margin-right: 0;"></image>
					<text>{{job_name?job_name:sureJobName}}</text>
				</view>
			</view>
			<view class="view_btn" @click="toReport">评估报告</view>
		</view>
		<view class="bot_wrap">
			<view class="bot" @click="toZhida">
				<view class="sure_btn flex flex_around">
					<view class="flex">
						<view>去灵动职达</view>
						<image :src="imgUrl+'/worker/v2/ic_card_signup_arrow.png'" mode="widthFix"></image>
					</view>
				</view>
				<view class="flex flex_btween">
					<view class="bot_item flex">
						<image :src="imgUrl+'/worker/v2/ic_card_signup_01.png'" mode="widthFix"></image>
						<view>查看工作进度</view>
					</view>
					<view class="bot_item">
						<image :src="imgUrl+'/worker/v2/ic_card_signup_03.png'" mode="widthFix"></image>
					</view>
					<view class="bot_item flex">
						<image :src="imgUrl+'/worker/v2/ic_card_signup_02.png'" mode="widthFix"></image>
						<view>查看工资记录</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex"
	const app = getApp();
	export default {
		name: "chat_card_signup",
		props: ["job_name", "job_id"],
		data() {
			return {
				imgUrl: app.globalData.baseImageUrl,
				creditSeries: [],
				jobNeedCredit: 0,
				currentPage: 1,
				// job_name: "【成都鸡毛店-春熙路直营店】-服务员"
			};
		},
		computed: {
			...mapState(["sureJobName", "sureJobId"])
		},
		created() {
			// this.getCreditSeries()
			// this.getCredit()
		},
		methods: {
			toReport() {
				let id = this.job_id ? this.job_id : this.sureJobId
				uni.navigateTo({
					url: "/subpkg/report/report?id=" + id
				})
			},
			toZhida() {
				console.log(app.globalData.navigateAppid)
				uni.navigateToMiniProgram({
					appId: app.globalData.navigateAppid,
					path: 'pages/index/index',
					success(res) {
						// 打开成功
					},
					fail(err) {
						console.log(err)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	image {
		margin-left: 0 !important;
		margin-right: 0 !important;
	}

	.card_signup {
		margin-top: 30rpx;
		background: url($back-ground-url+"/worker/v2/chat_card_signup_bg.png") no-repeat;
		background-size: cover;
		background-position: top right;
		border-radius: 16rpx;

		.top {
			padding: 30rpx 20rpx 0 30rpx;

			.top_left {
				width: calc(100% - 150rpx);

				.tit {
					font-size: 38rpx;
					color: #FFFFFF;
					text-shadow: 0px 1px 2px rgba(32, 32, 32, 0.8);
					margin-bottom: 6rpx;
					font-family: "也字工厂";
				}

				.text {
					font-weight: 600;
					font-size: 27rpx;
					color: #333333;

					image {
						width: 50rpx;
					}

					text {
						display: inline-block;
						width: calc(100% - 50rpx);
						flex-shrink: 0;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					}
				}
			}

			.view_btn {
				width: 146rpx;
				height: 58rpx;
				line-height: 58rpx;
				text-align: center;
				background: #FFF2C9;
				box-shadow: 0rpx 2rpx 4rpx 0rpx #755900;
				border-radius: 29rpx;
				font-weight: 600;
				font-size: 27rpx;
				color: #7B5D00;
				flex-shrink: 0;
			}
		}

		.bot_wrap {
			padding: 0 30rpx 30rpx 30rpx;
			margin-top: 20rpx;
		}

		.bot {
			background: #FFFFFF;
			border-radius: 15rpx;
			padding: 38rpx 25rpx 23rpx 25rpx;

			.bot_item {
				font-weight: 400;
				font-size: 31rpx;
				color: #020202;

				image {
					width: 46rpx;
					margin-right: 6rpx !important;
				}

				&:nth-child(2) {
					image {
						width: 2rpx;
					}
				}
			}

			.sure_btn {
				height: 81rpx;
				background: $base-color;
				border-radius: 15rpx;
				font-weight: 600;
				font-size: 29rpx;
				color: #fff;
				line-height: 81rpx;
				text-align: center;
				margin-bottom: 30rpx;

				image {
					width: 46rpx;
					margin-left: 6rpx !important;
				}
			}
		}
	}
</style>