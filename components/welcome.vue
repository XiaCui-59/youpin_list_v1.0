<template>
	<view class="content_body body_bg" :style="{paddingTop:top+'px',paddingBottom:bottom+'px'}">
		<view class="top">
			<view class="title">工种分类</view>
			<!-- 菜单栏 -->
			<u-scroll-list :indicator="false">
				<view class="menu_item" v-for="(item, index) in workType.slice(1)" :key="index"
					@click.stop="toList(item)">
					<image :src="item.icon" mode="heightFix"></image>
					<view class="menu_item_inner">
						<view class="menu_item_title">{{item.label}}</view>
						<image :src="imgUrl+'/worker/v2/arrow_circle.png'" mode="widthFix"></image>
						<!-- <view class="menu_item_text">{{item.text}}</view> -->
					</view>

				</view>
			</u-scroll-list>
			<!-- 热招职位 -->
			<view class="title">热招职位</view>
			<view class="hot_wrap">
				<view class="job_list">
					<view class="item" v-for="(item,index) in jobList" :key="index" @click="toChat('',item)">
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
			</view>
			<view class="tips" @click="toPro">
				<view>点此查看更多工作</view>
				<image :src="imgUrl+'/worker/v2/more_blue.png'" mode="widthFix"></image>
			</view>
		</view>
		<view class="iwant_wrap" :style="{bottom:bottom+10+'px'}">
			<view class="img flex flex_btween" v-if="systemHeight > 750">
				<image :src="imgUrl+'/worker/new/iwant_slogan.png'" mode="widthFix"></image>
				<image :src="imgUrl+'/worker/new/ic_telephone.png'" mode="widthFix" style="width: 77rpx;"
					v-if="audioSwitch" @click="toCall('')"></image>
			</view>
			<view class="iwant_list flex flex_btween">
				<button open-type="share" class="iwant_item">
					<view class="iwant_tips">
						<view class="tit" style="text-align: center;">分享</view>
						<view class="tips_list">
							<view class="tips" style="text-align: center;">邀请好友，快速上岗</view>
						</view>
					</view>
				</button>
				<view class="iwant_item flex flex_btween" @click="toChat('findjob')">
					<view class="iwant_tips">
						<view class="tit">我要找工作</view>
						<view class="tips_list">
							<view class="tips">优质高效</view>
							<view class="tips">我最懂你</view>
						</view>
					</view>
					<view class="icon">
						<image :src="imgUrl+'/worker/new/iwant02.png'" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>
		<myModal ref="myModal">
		</myModal>
	</view>
</template>

<script>
	import commonData from "@/common/commonData.js"
	import {
		mapState,
		mapMutations
	} from "vuex"
	const app = getApp();
	export default {
		name: "welcome",
		props: ["top", "bottom", "canPlay", "showUserStep"],
		data() {
			return {
				menuList: [{
						title: "酒店连锁",
						text: "酒店连锁"
					},
					{
						title: "餐饮服务",
						text: "酒店连锁"
					},
					{
						title: "物流行业",
						text: "酒店连锁"
					},
					{
						title: "工厂用工",
						text: "酒店连锁"
					},
					{
						title: "兼职",
						text: "酒店连锁"
					}
				],
				jobList: [{
						project_name: "酒店保洁",
						worker_salary_min: 3000,
						worker_salary_max: 5000,
						worker_salary_type: "month",
						highlight: ["包吃住", "长白班", "有社保"],
						worker_address: {
							address: "四川成都"
						}
					},
					{
						project_name: "酒店保洁",
						worker_salary_min: 3000,
						worker_salary_max: 5000,
						worker_salary_type: "month",
						highlight: ["包吃住", "长白班", "有社保"],
						worker_address: {
							address: "四川成都"
						}
					}
				],
				showSureJob: false,
				scrollTop: 0,
				period: commonData.periodList,
				current: 0, // 当前激活的swiper-item索引
				dots: 2, // 指示点的数量，可以根据swiper-item的数量动态计算
				imgUrl: app.globalData.baseImageUrl,
				recommendList: [],
				currentPlay: {
					"project_id": "",
					"content": "",
					"may_ask": [],
					"project_name": "",
					"voice": "",
					"worker_salary_max": "",
					"worker_salary_min": "",
					"worker_salary_type": ""
				},
				currentPlayIndex: 0,
				muted: false, //是否静音
				systemHeight: app.globalData.systemHeight,
				// Audio: app.globalData.Audio,
				animationActive: true,
				animationTimer: null,
				welcomeVoiceList: [app.globalData.baseImageUrl + "/worker/wel01.mp3", app.globalData.baseImageUrl +
					"/worker/wel02.mp3", app.globalData.baseImageUrl + "/worker/wel03.mp3"
				],
				lastClickTime: 0, // 记录上次点击的时间
				requestTimer: null,
				reConnectCount: 0, //记录网络异常重连次数,
				mayAskCount: 0, //记录mayAsk异常重连次数,
				bannerImageInfo: null,
				bannerHeight: 0,
				// showUserStep: false,
				currentStep: 1,
				firstEnd: false,
				isWelcome: true,
				clickProject: {
					"project_id": "",
					"content": "",
					"may_ask": [],
					"project_name": "",
					"voice": "",
					"worker_salary_max": "",
					"worker_salary_min": "",
					"worker_salary_type": ""
				},
				bodyStartPoint: null,
				moveUp: false
			};
		},
		computed: {
			...mapState(["city", "aiReady", "workType", "audioSwitch"])
		},
		created() {
			// this.$store.dispatch('getWorkType');
			this.getHotProjects()
			// let _this = this
			// app.globalData.Audio.onPlay(e => {
			// 	if (!this.isWelcome) {
			// 		this.textAnimation()
			// 	}

			// });

			// app.globalData.Audio.onStop(e => {});
			// app.globalData.Audio.onEnded(e => {
			// 	if (this.canPlay) {
			// 		if (this.firstEnd) {
			// 			this.playNext()
			// 		} else {
			// 			this.playFirst()
			// 		}

			// 	}
			// });
		},
		watch: {
			// animationActive(newVal) {
			// 	if (newVal) {
			// 		// this.textAnimation()
			// 	} else {
			// 		this.stopInterval()
			// 	}
			// },
			// canPlay(newVal) {
			// 	if (!newVal) {
			// 		app.globalData.Audio.pause()
			// 		this.muted = true
			// 	} else {
			// 		this.stopInterval()
			// 	}
			// },
			// city(newVal) {
			// 	console.log("newCity:", newVal)
			// 	this.getRecommend()
			// },
			// currentPlayIndex(newVal) {
			// 	// 根据不同的职位请求最新的may_ask
			// 	this.getMayAsk()
			// }
		},
		methods: {
			getHotProjects() {
				this.$request("/guest/recommend-jobs").then(res => {
					if (res.code == 0) {
						this.jobList = res.data.list.slice(0, 2)
					}
				})
			},
			toInvite() {
				// uni.navigateTo({
				// 	url: "/pages/invite/invite"
				// })
			},
			toChat(type, item) {
				let obj = {
					msg: "",
					type: ""
				}
				if (type) {
					obj = {
						msg: "我正在找工作，能帮我推荐一些合适的职位吗？",
						type: ""
					}
				} else {
					obj = {
						type: "",
						msg: "我想继续了解一下" + item.name + "(ID:" + item.id + ")这个工作。"
					}
				}
				this.$emit("sendMsg", obj)
			},
			toCall(type) {
				let obj = {
					type: type,
					job_id: type == "surejob" ? this.currentPlay.project_id : ""
				}
				this.$emit("tocall", obj)
			},
			nextStep() {
				if (this.currentStep < 6) {
					this.currentStep++
				} else {
					// 存储已阅读新手指引状态
					uni.setStorageSync("readsteps", 1)
					if (this.canPlay) {
						this.playWelcome()
					}
					this.$emit("closeStep")
				}
			},
			changeNext() {
				let len = this.recommendList.length
				if (this.currentPlayIndex == len - 1) {
					let obj = {
						msg: "我正在找工作，能帮我推荐一些合适的职位吗？",
						type: "",
						job_id: ""
					}
					this.$emit("sendMsg", obj)
				} else {
					app.globalData.Audio.stop()
					this.playNext()
				}

			},
			playFirst() {
				this.firstEnd = true
				this.isWelcome = false
				// app.globalData.Audio.stop()
				if (this.canPlay && !this.muted) {
					this.playAudio()
				}
			},
			// 播放下一个工作
			playNext() {
				let _this = this
				let len = this.recommendList.length
				if (this.currentPlayIndex < len - 1) {
					this.currentPlayIndex++
					this.currentPlay = this.recommendList[this.currentPlayIndex]
				} else {
					this.currentPlayIndex = 0
					this.currentPlay = this.recommendList[this.currentPlayIndex]
					this.currentPlayIndex++
				}
				// this.playAudio()
				setTimeout(function() {
					if (_this.canPlay && !_this.muted) {
						_this.playAudio()
					}

				}, 50)

			},
			stopInterval() {
				if (this.animationTimer) {
					clearInterval(this.animationTimer);
					this.animationTimer = null;
					this.scrollTop = 0
				}
			},
			//控制播放还是暂停音频文件
			handleAudio() {
				this.$emit("openCanPlay")
				app.globalData.Audio.paused ? this.playAudio() : this.pauseAudio();
			},
			//播放工作音频
			playAudio() {
				if (this.canPlay) {
					app.globalData.Audio.src = this.currentPlay.voice;
					app.globalData.Audio.play();
					this.muted = false
				}

			},
			toPro() {
				uni.navigateTo({
					url: "/subpkg/project_list/project_list"
				})
			},
			//播放工作音频
			playWelcome() {
				let i = Math.floor(Math.random() * this.welcomeVoiceList.length)
				app.globalData.Audio.src = this.welcomeVoiceList[i];
				app.globalData.Audio.play();
				this.muted = false
			},
			//停止音频
			stopAudio() {
				app.globalData.Audio.src = '';
				app.globalData.Audio.stop();
			},
			// 暂停音频
			pauseAudio() {
				app.globalData.Audio.pause()
				this.muted = true
			},
			toList(item) {
				uni.navigateTo({
					url: "/subpkg/project_list/project_list?type=" + JSON.stringify(item)
				})
			},
			async getMayAsk() {
				let url = "/homepage/may_ask/" + this.currentPlay.project_id
				try {
					let res = await this.$request(url)
					this.currentPlay.may_ask = res.data.list.may_ask
				} catch (error) {
					if (this.mayAskCount < 5) {
						this.getMayAsk()
						this.mayAskCount++
					} else {
						this.mayAskCount = 0
					}
				}

				// this.$request(url).then(res => {
				// 	if (res.code == 0) {
				// 		this.currentPlay.may_ask = res.data.list.may_ask
				// 	}
				// })
			},
			async getRecommend() {
				let _this = this
				let data = {
					city: this.city
					// city: "眉山"
				}
				try {
					let res = await this.$request("/homepage", data, "POST")
					this.$emit("setGreetStatus")
					if (res.data.list.length > 0) {
						this.currentPlay = res.data.list[0]
						this.recommendList = res.data.list
						this.showSureJob = true
						this.getMayAsk()
						if (!this.showUserStep && this.canPlay) {
							this.playWelcome()
						}

					} else {
						this.$refs.myModal.showModal({
							title: "暂无推荐职位信息",
							showCancel: false
						})
					}

				} catch (error) {
					console.error('An error occurred:', error);
					// 处理错误
					if (_this.reConnectCount < 10) {
						_this.reConnectCount++
						_this.getRecommend()
					} else {
						uni.showModal({
							title: "网络超时，请重新进入小程序。",
							showCancel: false,
							success(resp) {
								if (resp.confirm) {
									_this.reConnectCount = 0
									uni.reLaunch({
										url: '/subpkg/index/index'
									})
								}
							}
						})
					}

				}
			},
			sendMsg(msg, type) {
				this.clickProject = {
					...this.currentPlay
				}
				let obj = {
					msg: this.clickProject.project_name + "（职位id：" + this.clickProject.project_id + "）" + msg,
					type: type,
					job_id: this.clickProject.project_id,
					name: this.clickProject.project_name
				}
				this.$emit("sendMsg", obj)
			},
			textAnimation() {
				let _this = this
				_this.scrollTop = 0
				if (!this.animationTimer) {
					this.animationTimer = setInterval(function() {
						_this.scrollTop += 2
					}, 300)
				}

			},
			touchStart() {
				this.animationActive = false
			},
			// getPosition() {
			// 	return new Promise((resolve, reject) => {
			// 		let url = "https://apis.map.qq.com/ws/location/v1/ip?key=" + app.globalData.qqMapKey
			// 		uni.request({
			// 			url: url,
			// 			method: "GET",
			// 			success(res) {
			// 				resolve(res.data.result.ad_info.city)
			// 			},
			// 			fail(err) {
			// 				console.log(err)
			// 				reject(err)
			// 			}
			// 		})
			// 	})

			// },
			scrollLower() {
				if (this.animationActive) {
					this.scrollTop = 0
				}

			}
		}
	}
</script>

<style lang="scss">
	.top {
		padding-top: 30rpx;

		.tips {
			font-weight: 400;
			font-size: 23rpx;
			color: #5B5B5B;
			text-align: center;

			image {
				width: 18rpx;
				margin-top: 10rpx;
			}
		}

		.menu_item {
			width: 192rpx;
			height: 123rpx;
			background: linear-gradient(180deg, #E9F3FE 0%, #FFFFFF 100%);
			border-radius: 8rpx;
			margin-right: 19rpx;
			font-size: 32rpx;
			flex-shrink: 0;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			position: relative;

			&>image {
				position: absolute;
				bottom: 0;
				right: 0;
				height: 90%;
				z-index: 0;
			}

			.menu_item_inner {
				padding-top: 19rpx;
				padding-left: 19rpx;
				box-sizing: border-box;
				position: relative;
				z-index: 90;

				image {
					width: 26rpx;
					height: 26rpx;
				}
			}

			.menu_item_title {
				font-family: "zihun";
				font-size: 31rpx;
				color: #333333;
				letter-spacing: 1px;
				z-index: 90;
				position: relative;
				margin-bottom: 10rpx;
				// line-height: 37rpx;
				// margin-bottom: 10rpx;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}


			.menu_item_text {
				font-weight: 400;
				font-size: 23rpx;
				line-height: 33rpx;
				color: #5E5E5E;
			}
		}

		&>.title {
			font-weight: 600;
			font-size: 27rpx;
			color: #213B56;
			line-height: 38rpx;
			margin-bottom: 10rpx;

			&:nth-child(3) {
				margin-top: 38rpx;
			}
		}

		.hot_wrap {

			.job_list {
				.item {
					padding: 23rpx 48rpx 23rpx 40rpx;
					border-radius: 16rpx;
					background: #FFFFFF;
					// background: #fff url($back-ground-url+'/worker/v2/welcome_list_bg.png') no-repeat;
					// background-size: 100% auto;
					background-position: bottom right;
					box-shadow: 0 2rpx 6rpx 0 rgba(0, 0, 0, 0.15);
					margin-bottom: 24rpx;
					position: relative;

					.item_top {
						flex-wrap: wrap;

						.title {
							width: calc(60% - 16rpx);
							flex-shrink: 0;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
							// padding-left: 22rpx;
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

							// &.grey:before {
							// 	background: #CBCBCB;
							// }



							// &:before {
							// 	content: "";
							// 	width: 8rpx;
							// 	height: 31rpx;
							// 	background: $base-color;
							// 	border-radius: 2rpx;
							// 	position: absolute;
							// 	top: 50%;
							// 	left: 0;
							// 	transform: translateY(-50%);
							// }
						}

						.salary {
							width: 40%;
							margin-left: 16rpx;
							font-size: 42rpx;
							color: #EA9900;
							font-family: Arial;
							font-style: italic;
							font-weight: 600;
							flex-shrink: 0;
							white-space: nowrap;

							&.full_width {
								width: 100%;
							}

							&.grey {
								color: #686868;
							}
						}
					}

					.status {
						position: absolute;
						top: 0;
						right: 0;
						font-size: 0;

						image {
							width: 96rpx;
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
						margin-top: 10rpx;
						background: #F0F5FE;
						border-radius: 8rpx;
						padding: 14rpx 20rpx;

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
						margin-top: 16rpx;
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
							width: 173rpx;
							height: 50rpx;
							line-height: 50rpx;
							text-align: center;
							background: #216FF9;
							border-radius: 40rpx;
							color: #fff;
							font-weight: 600;
							font-size: 27rpx;
						}
					}
				}
			}
		}
	}

	.top_wrap {
		margin-top: 42rpx;

		.tips_wrap {
			margin-top: 20rpx;
			align-items: flex-start;
			position: relative;

			.change {
				margin-top: 10rpx;
				margin-right: 28rpx;
				// width: 108rpx;
				// text-align: right;
				font-weight: 400;
				font-size: 27rpx;
				flex-shrink: 0;
				color: #213B56;
				border-bottom: 2rpx dotted #213B56;
			}

			.tip_list {
				max-width: calc(100% - 115rpx);

				.item {
					display: flex;
					margin-bottom: 16rpx;

					&:last-child {
						margin-bottom: 28rpx;
					}

					.text {
						height: 58rpx;
						line-height: 58rpx;
						background: rgba(255, 255, 255, 0.6);
						border-radius: 63rpx;
						border: 1rpx solid #D7D9EE;
						padding: 0 40rpx 0 20rpx;
						box-sizing: border-box;
						font-weight: 400;
						font-size: 28rpx;
						color: #213B56;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					}
				}
			}
		}

		.banner {
			box-sizing: border-box;
			position: relative;
			background: url($back-ground-url+'/worker/v2/banner_bg2.png') no-repeat;
			background-size: 100% auto;
			background-position: center top;
			border-bottom-left-radius: 40rpx;
			border-bottom-right-radius: 40rpx;
			padding: 28rpx;
			box-sizing: border-box;

			&>image {
				width: 216rpx;
				position: absolute;
				bottom: 20rpx;
				right: -20rpx;
				z-index: 10;
			}

			.ban_top {
				width: 60%;
				padding-bottom: 15rpx;
				border-bottom: 2rpx dotted rgba(255, 255, 255, 0.7);

				.tit {
					font-weight: 600;
					font-size: 31rpx;
					color: #223756;
					width: 80%;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}

				.salary {
					font-weight: 900;
					font-size: 38rpx;
					color: #223756;
					font-family: Arial, Arial;

					.period {
						font-weight: 400;
						font-size: 23rpx;
						color: #223756;
					}
				}
			}

			.ban_bot {
				width: 54%;
				padding-top: 10rpx;
				font-weight: 400;
				font-size: 29rpx;
				color: #FFFFFF;
				line-height: 46rpx;
			}

			.voice_control {
				position: absolute;
				bottom: 20rpx;
				left: 20rpx;
				box-sizing: border-box;
				z-index: 100;
				font-size: 0;

				image {
					height: 50rpx;
				}
			}

			.surein {
				position: absolute;
				bottom: 20rpx;
				right: 20rpx;
				width: 163rpx;
				height: 58rpx;
				line-height: 58rpx;
				text-align: center;
				background: rgba(255, 255, 255, 0.9);
				border-radius: 29rpx;
				z-index: 100;

				image {
					width: 30rpx;
					vertical-align: middle;
				}

				text {
					font-weight: 400;
					font-size: 27rpx;
					color: #213B56;
				}
			}
		}
	}

	.iwant_wrap {
		width: calc(100% - 56rpx);
		position: fixed;
		left: 28rpx;

		.img {
			font-size: 0;
			align-items: flex-end;

			image {
				width: 290rpx;
			}
		}

		.iwant_list {
			margin-top: 34rpx;

			.iwant_item {
				height: 146rpx;
				// margin-right: 2%;
				padding: 20rpx 9rpx 20rpx 19rpx;
				box-sizing: border-box;
				border-radius: 10rpx;
				margin-top: 10rpx;
				// align-items: flex-start;

				&:nth-child(1) {
					width: 33%;
					flex-shrink: 0;
					margin-right: 3%;
					background: url($back-ground-url+"/worker/new/index_invite_bg.png") no-repeat;
					background-size: 100% 100%;
					padding-left: 0;
					padding-right: 0;
					line-height: 40rpx;
				}

				&:nth-child(1)::after {
					display: none;
				}

				&:nth-child(2) {
					padding: 20rpx 30rpx 20rpx 30rpx;
					border: 2rpx solid #FFFFFF;
					width: 64%;
					background: linear-gradient(164deg, #E7F9EC 0%, #FFFFFF 45%, #FFFFFF 100%);
				}

				&:last-child {
					background: linear-gradient(164deg, #E7E7FA 0%, #FFFFFF 45%, #FFFFFF 100%);
					margin-right: 0;
				}



				.iwant_tips {


					.tit {
						font-weight: 600;
						font-size: 29rpx;
						color: #253E60;
						margin-bottom: 16rpx;
					}

					.tips_list {
						line-height: 34rpx;

						.tips {
							font-weight: 400;
							font-size: 22rpx;
							color: #5B5B5B;
						}

					}
				}

				.icon {
					font-size: 0;

					image {
						width: 160rpx;
					}

				}
			}
		}
	}

	.content_body,
	.new_user_steps {
		background: linear-gradient(180deg, #4290FF 0%, #91BAFF 9%, #F0F5FE 60%);
		padding: 0 28rpx;
		box-sizing: border-box;

		.step_hand {
			font-size: 0;
			position: absolute;
			z-index: 200;

			image {
				width: 120rpx;
			}
		}

		&.new_user_steps {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 1000;
			background: rgba(0, 0, 0, 0.60);

			.step_tips {
				position: absolute;
				bottom: 100%;
				left: 0;

				.step_top {
					background: linear-gradient(131deg, #DDB2DA 0%, #3C95ED 51%, #B3E7FC 100%);
					padding: 40rpx 18rpx 40rpx 18rpx;
					box-sizing: border-box;
					border-radius: 14rpx;

					.step_tit {
						font-weight: 600;
						font-size: 31rpx;
						color: #FFFFFF;
						line-height: 42rpx;
						white-space: nowrap;
					}

					.step_text {
						margin-top: 20rpx;

						.text {
							font-weight: 400;
							font-size: 23rpx;
							color: rgba(255, 255, 255, 0.6);
							line-height: 33rpx;
						}

						.step_btn {
							width: 154rpx;
							height: 46rpx;
							background: #FFFFFF;
							border-radius: 23rpx;
							font-weight: 400;
							font-size: 23rpx;
							color: #216FF9;
							line-height: 46rpx;
							text-align: center;
						}

						.list {
							.text {
								margin-top: 10rpx;


								view {
									padding: 0 25rpx;
									box-sizing: border-box;
									height: 46rpx;
									line-height: 46rpx;
									background: rgba(255, 255, 255, 0.3);
									border-radius: 23rpx;
									border: 1rpx solid rgba(255, 255, 255, 0.6);
									font-size: 23rpx;
									color: #FFFFFF;

								}

							}
						}
					}
				}

				.step_line {
					padding-left: 100rpx;
					font-size: 0;

					image {
						width: 30rpx;
					}
				}

				.ai_avatar {
					font-size: 0;
					position: absolute;
					top: -60rpx;
					left: 0;
					bottom: auto;
					z-index: 200;

					image {
						width: 120rpx;
					}

				}
			}

			.banner {
				.step_tips {
					bottom: auto;
					top: 100%;
					left: auto;
					right: 0;

					.ai_avatar {
						font-size: 0;
						position: absolute;
						top: auto;
						bottom: -60rpx;
						left: 0;

						image {
							width: 120rpx;
						}

					}
				}
			}

			.iwant_wrap {
				.iwant_list {
					.iwant_item {
						position: relative;
					}
				}
			}
		}


		.greeting {
			margin-top: 42rpx;

			.avatar {
				text-align: center;
				width: 280rpx;
				height: 280rpx;
				margin: 0 auto 46rpx auto;
				border-radius: 50%;
				// overflow: hidden;
				position: relative;

				&>image {
					width: 280rpx;
				}

				.play_box {
					position: absolute;
					width: 86rpx;
					height: 54rpx;
					background: #FFFFFF;
					box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0, 0, 0, 0.5);
					border-radius: 21rpx;
					bottom: 0;
					right: 0;
					text-align: center;

					image {
						height: 54rpx;
					}
				}
			}

			.tips {
				// height: 424rpx;
				overflow: hidden;
				background: #F1F8FF;
				border-radius: 4rpx 44rpx 44rpx 44rpx;
				padding: 0rpx 30rpx 23rpx 30rpx;
				box-sizing: border-box;
				position: relative;

				.title {
					padding: 23rpx 0;
					background: #F1F8FF;
					border-bottom: 2rpx dashed rgba(34, 55, 86, 0.2);
					position: relative;
					z-index: 100;

					.name {
						font-weight: 600;
						font-size: 38rpx;
						color: #223756;
						max-width: calc(100% - 380rpx);
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					}

					.sala_box {
						max-width: 360rpx;

						.count {
							font-weight: 600;
							font-size: 42rpx;
							color: #223756;
							white-space: nowrap;
						}

						.period {
							font-weight: 400;
							font-size: 24rpx;
							color: #223756;
							margin-left: 8rpx;
						}
					}
				}

				.cont {
					font-weight: 400;
					font-size: 31rpx;
					color: #223756;
					line-height: 50rpx;
					position: relative;
					padding-top: 20rpx;
					padding-bottom: 0rpx;

					box-sizing: border-box;

					.animation_box {
						padding-bottom: 100rpx;
					}
				}

				.voice_control {
					width: 100%;
					text-align: right;
					position: absolute;
					bottom: 0rpx;
					right: 0rpx;
					padding: 0 28rpx 18rpx 0;
					box-sizing: border-box;
					z-index: 100;

					image {
						height: 50rpx;
					}
				}


			}
		}

		// .tips_wrap {
		// 	position: fixed;
		// 	left: 28rpx;

		// 	// margin-top: 40rpx;
		// 	// align-items: flex-start;
		// 	.tip_list {
		// 		// max-width: calc(100% - 85rpx);

		// 		.item {
		// 			display: flex;
		// 			margin-bottom: 16rpx;

		// 			&:last-child {
		// 				margin-bottom: 28rpx;
		// 			}

		// 			.text {
		// 				height: 58rpx;
		// 				line-height: 58rpx;
		// 				background: rgba(255, 255, 255, 0.6);
		// 				border-radius: 63rpx;
		// 				border: 1rpx solid #D7D9EE;
		// 				padding: 0 40rpx 0 20rpx;
		// 				box-sizing: border-box;
		// 				font-weight: 400;
		// 				font-size: 28rpx;
		// 				color: #213B56;
		// 				white-space: nowrap;
		// 				text-overflow: ellipsis;
		// 				overflow: hidden;
		// 			}
		// 		}
		// 	}
		// }


	}
</style>