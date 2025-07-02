<template>
	<view class="broadcast"
		:style="{width:visible?'100vh':'0',height:visible?'100vh':'0',bottom:visible?'0':(bottom+'px'),left:visible?'0':(left+'rpx'),borderRadius:visible?'0':'50%'}"
		@click="close">
		<view class="broadcast_inner" @click.stop="">
			<view class="close" @click="close">
				<image :src="imgUrl+'/worker/v2/close_circle_white.png'" mode="widthFix"></image>
			</view>
			<view class="top_wrap">
				<view class="banner">
					<view class="ban_top">
						<view class="tit">{{currentPlay.project_name}}</view>
						<view class="salary flex flex-start">
							<text>{{currentPlay.worker_salary_max}}</text>
							<text
								class="period">元{{period.filter(el=>{return el.value == currentPlay.worker_salary_type})[0]?period.filter(el=>{return el.value == currentPlay.worker_salary_type})[0].text:""}}
							</text>
						</view>
					</view>
					<view class="ban_bot">
						<scroll-view scroll-y="true" class="cont" style="height:260rpx;" :scroll-with-animation="true"
							:scroll-top="scrollTop" @touchstart="touchStart" @scrolltolower="scrollLower">
							{{currentPlay.content}}
						</scroll-view>
					</view>
					<image :src="imgUrl+'/worker/new/banner_ai.png'" :lazy-load="true" mode="widthFix"></image>
					<view class="voice_control" @click.stop="handleAudio">
						<image :src="imgUrl+'/worker/new/ic_index_voice_muted.png'" mode="heightFix"
							:style="{display:muted?'inline-block':'none'}"></image>
						<image :src="imgUrl+'/worker/new/ic_index_voice_play.png'" mode="heightFix"
							:style="{display:muted?'none':'inline-block'}"></image>
					</view>
				</view>
				<view class="tips_wrap flex flex_btween">
					<view class="tip_list">
						<view class="item" v-for="(item,index) in currentPlay.may_ask" :key="index"
							@click="sendMsg(item,'tip')">
							<view class="text">{{item}}</view>
						</view>
					</view>
					<view class="tip_right">
						<view class="surein" v-show="showSureJob" @click.stop="toChat('surejob')">
							<image :src="imgUrl+'/worker/new/ic_heart.png'" mode="widthFix"></image>
							<text>立即报名</text>
						</view>
						<view class="change" @click="changeNext" v-show="showNext">下一个&gt;</view>
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
	const app = getApp()
	export default {
		name: "broadcast",
		props: ["left", "bottom", "canPlay"],
		data() {
			return {
				visible: false,
				showSureJob: false,
				showNext: false,
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
				}
			};
		},
		computed: {
			...mapState(["city", "aiReady"])
		},
		created() {
			let _this = this
			setTimeout(function() {
				_this.visible = true
			}, 100)
			this.getRecommend()
			//音频停止事件
			app.globalData.Audio.onPlay(e => {
				if (!this.isWelcome) {
					this.textAnimation()
				}

			});

			//音频停止事件
			app.globalData.Audio.onStop(e => {});

			//音频播放结束事件
			app.globalData.Audio.onEnded(e => {
				if (this.canPlay) {
					if (this.firstEnd) {
						this.playNext()
					} else {
						this.playFirst()
					}

				}
			});
		},
		watch: {
			animationActive(newVal) {
				if (newVal) {
					// this.textAnimation()
				} else {
					this.stopInterval()
				}
			},
			canPlay(newVal) {
				console.log("canPlay:", newVal)
				if (!newVal) {
					app.globalData.Audio.pause()
					this.muted = true
				} else {
					this.stopInterval()
				}
			},
			// city(newVal) {
			// 	console.log("newCity:", newVal)
			// 	this.getRecommend()
			// },
			currentPlayIndex(newVal) {
				// 根据不同的职位请求最新的may_ask
				this.getMayAsk()
			}
		},
		beforeDestroy() {
			app.globalData.Audio.pause()
			this.muted = true
		},
		methods: {
			close() {
				let _this = this
				this.visible = false
				setTimeout(function() {
					_this.$emit("close")
				}, 800)
				// this.$emit("close")
			},
			toInvite() {
				uni.navigateTo({
					url: "/pages/invite/invite"
				})
			},
			toChat(type) {
				this.clickProject = {
					...this.currentPlay
				}
				let action = type == "surejob" ? "text_want_application" : (type == "findjob" ? "text_look_for_job" :
					"text_interview")
				let jobId = type == "surejob" ? this.clickProject.project_id : ""
				let msg = type == "surejob" ? ("我对" + this.clickProject.project_name + "（职位ID：" + this.clickProject
					.project_id + "）很感兴趣，能为我介绍一下吗？") : (type == "findjob" ?
					"我正在找工作，能帮我推荐一些合适的职位吗？" :
					"我可以开始面试了，什么时候安排？")
				let obj = {
					msg: msg,
					type: type,
					job_id: jobId,
					action: action,
					name: this.clickProject.project_name ? this.clickProject.project_name : ""
				}
				this.close()
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
				this.showNext = false
				let len = this.recommendList.length
				if (this.currentPlayIndex == len - 1) {
					let obj = {
						msg: "我正在找工作，能帮我推荐一些合适的职位吗？",
						type: "",
						job_id: "000"
					}
					this.close()
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
			async getMayAsk() {
				let url = "/homepage/may_ask/" + this.currentPlay.project_id
				try {
					let res = await this.$request(url)
					this.currentPlay.may_ask = res.data.list.may_ask
					this.showNext = true
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
										url: '/pages/role_confirm_page/role_confirm_page'
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
				this.close()
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

<style lang="scss" scoped>
	.broadcast {
		position: fixed;
		left: 82rpx;
		bottom: 115rpx;
		z-index: 10000;
		background: rgba(0, 0, 0, 0.6);
		width: 0;
		height: 0;
		border-radius: 50%;
		transition: all 0.5s;
		overflow: hidden;
		border-radius: 16rpx;

		.broadcast_inner {
			width: calc(100vw - 56rpx);
			position: absolute;
			top: 16%;
			left: 28rpx;

			.close {
				position: absolute;
				top: 0;
				right: 0;

				image {
					width: 46rpx;
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
				position: absolute;
				bottom: 0;
				right: 16rpx;
				font-weight: 400;
				font-size: 27rpx;
				flex-shrink: 0;
				color: #fff;
				border-bottom: 2rpx dotted #fff;
			}

			.tip_list {
				max-width: calc(100% - 115rpx);

				.item {
					display: flex;
					margin-top: 16rpx;

					.text {
						height: 58rpx;
						line-height: 58rpx;
						background: #fff;
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

			.tip_right {
				.surein {
					margin-top: 16rpx;
					margin-right: 16rpx;
					// position: absolute;
					// bottom: 20rpx;
					// right: 20rpx;
					width: 163rpx;
					height: 58rpx;
					line-height: 58rpx;
					text-align: center;
					background: rgba(255, 255, 255, 0.9);
					border-radius: 29rpx;
					// z-index: 100;

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

		.banner {
			box-sizing: border-box;
			position: relative;
			background: url($back-ground-url+'/worker/new/banner_bg.png') no-repeat;
			background-size: 100% 100%;
			// background-position: center top;
			// border-bottom-left-radius: 40rpx;
			// border-bottom-right-radius: 40rpx;
			padding: 28rpx;
			box-sizing: border-box;

			&>image {
				width: 270rpx;
				position: absolute;
				bottom: 0rpx;
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
				right: 16rpx;
				box-sizing: border-box;
				z-index: 100;
				font-size: 0;

				image {
					height: 50rpx;
				}
			}


		}
	}
</style>