<template>
	<view class="single_page" v-if="ifSingle">
		<image :src="imgUrl+'/worker/single_page.png'" mode="widthFix" style="width: 100%;"></image>
	</view>
	<view class="content" v-else style="background: #F6F5FA;">
		<!-- 自定义导航栏 -->
		<u-navbar title="灵动优聘" :safeAreaInsetTop="true" :titleStyle="{lineHeight:'44px'}" bgColor="transparent">
			<!-- <view class="u-nav-slot flex flex-start" slot="left">
				<view class="ic_menu">
					<image :src="imgUrl+'/worker/v_list/text_logo.png'" mode="heightFix" style="height:33px;"></image>
				</view>
			</view> -->
		</u-navbar>
		<view class="cont" :style="{marginTop:marginTop+tabMargin+'px'}">
			<chat ref="chatRef" :top="statusBarHeight+44" :bottom="botSafe" :historyList="historyList" :qaList="qaList"
				:scrollHeight="scrollHeight" :answering="answering" :answerContinue="answerContinue"
				:scrollStr="scrollStr" @sendMsg="sendBtnMsg" @moreHis="getMoreHistory" @tocall="toCall"
				@setScrollHeight="setScrollHeight">
			</chat>
		</view>
		<view class="input_btn_wrap"
			:style="{bottom:inputHeight?inputHeight+10+'px':tabbarHeight+1.5*tabMargin+'px',background:inputing?(cancelRecord?'#fe697f':'#216ff9'):'#fff'}"
			:class="inputHeight?'upper':''">
			<view>
				<!-- 风铃icon -->
				<view class="fl_icon" @click.stop="clickFengling">
					<image :src="imgUrl+'/worker/new/ic_fengling.png'"></image>
				</view>
				<view>
					<!-- 语音按钮区 -->
					<view class="voice_btn_wrap" v-show="showVoice && voicePermisson" @touchstart.stop="startRecord"
						@touchend.stop="stopRecord" @touchmove.stop="handleTouchMove" @touchcancel.stop="cancelVoice">
						<view v-show="!inputing">{{canSend?"按住 说话":"正在努力思考，请稍后"}}</view>
						<view class="voice_inputing" v-show="inputing">
							<image :src="imgUrl+'/worker/new/inputing_wave2.gif'" mode="heightFix"></image>
						</view>
					</view>
					<view class="input_box" v-show="!showVoice">
						<input type="text" confirm-type="发送" :value="question"
							:placeholder="canSend?'更多工作就问我':'正在努力思考，请稍后'" @focus="inputBindFocus" @confirm="doSend"
							:disabled="!canSend" @input="onInput" :adjust-position="false"
							style="padding-left: 20rpx;" />
					</view>
				</view>

				<!-- 右侧输入按钮切换区 -->
				<view class="func_icon" v-show="showSend" @click.stop="doSend">
					<image :src="imgUrl+'/worker/ic_send.png'" style="border:1px solid #D8E6FF;border-radius: 50%;">
					</image>
				</view>
				<view class="func_icon" @click.stop="changeChatMethod" v-show="!showSend">
					<image :src="showVoice?imgUrl+'/worker/ic_keyboard_blue.png':imgUrl+'/worker/ic_voice_blue.png'"
						style="border-radius: 50%;background:#fff;">
					</image>
				</view>
			</view>
			<!-- <view class="voice_inputing" v-show="inputing">
				<image :src="imgUrl+'/worker/new/inputing_wave2.gif'" mode="heightFix"></image>
			</view> -->
			<!-- 电话按钮 -->
			<!-- 	<view v-show="currentTabIndex == 1 && !inputHeight && audioSwitch" class="phone_icon"
				:style="{bottom:inputHeight?inputHeight+60+'px':'128rpx'}" @click="toCall">
				<image :src="imgUrl+'/worker/new/ic_telephone.png'" mode="widthFix"></image>
			</view> -->
		</view>
		<login :showLogin="showLogin" @cancel="cancelLogin" @closeLogin="closeLogin" @getInfo="handleLogin">
		</login>
		<tabbar current="1" @getTabbarHeight="getTabbarHeight"></tabbar>
		<myModal ref="myModal"></myModal>
	</view>
</template>

<script>
	import login from "@/components/login.vue"
	import tabbar from "@/components/worker_tabbar.vue"
	import commonData from "@/common/commonData"
	import chat from "@/components/chat.vue"
	import commonMethods from "@/common/commMethods.js"
	import urlSetting from "@/url_setting";
	import {
		mapState,
		mapMutations
	} from "vuex"
	const app = getApp()
	export default {
		data() {
			return {
				period: commonData.periodList,
				ifSingle: app.globalData.scene == 1154 ? true : false,
				showLogin: false,
				imgUrl: app.globalData.baseImageUrl,
				marginTop: app.globalData.marginTop,
				tabMargin: app.globalData.tabMargin,
				list: [],
				scrollHeight: 0,
				currentPage: 1,
				pagination: {},
				tabbarHeight: 0,
				systemHeight: app.globalData.systemHeight,
				inputHeight: 0,
				inputing: false,
				cancelRecord: false,
				showVoice: false,
				voicePermisson: false,
				showSend: false,
				question: "",
				historyList: [],
				qaList: [],
				jobId: "",
				action: "",
				noMayAsk: false,
				historyId: "",
				newUser: "",
				loadAllHistory: false,
				statusBarHeight: app.globalData.statusBarHeight,
				abnormalClose: false,
				abnormalErr: false,
				header: null,
				timer: null,
				responseStr: "",
				responCount: 0, //用于第一次接收到信息时，开启打字效果
				prinTimer: null,
				currentQalength: 0,
				curRespone: {
					content: "",
					origin: "ai",
					msg_type: "text",
					card: null
				},
				currentProjectDetail: {
					id: "",
					name: "",
					worker_salary_min: "",
					worker_salary_max: "",
					worker_salary_type: ""
				},
				manager: app.globalData.manager,
				touchStartTime: "",
				touchEndTime: "",
			}
		},
		components: {
			tabbar,
			login,
			chat
		},
		computed: {
			...mapState(["answering", "connected", "connecting", "canSend", "inChannel", "answerContinue", "channelQaLen",
				"channelId", "channelQaList", "location", "token", "inCall", "responEnd", "aiReady", "ad_tracking_id",
				"callBackCount", "audioSwitch"
			])
		},
		async onLoad() {
			if (this.isLogin()) {
				this.creatConnect()
				// 录音初始化
				this.initRecord()
			}

		},
		async onReady() {
			this.btnInfo = await commonMethods.getElementInfo(".input_btn_wrap")
			if (this.btnInfo) {
				this.botSafe = app.globalData.systemHeight - this.btnInfo.top
				this.scrollHeight = this.btnInfo.top - this.statusBarHeight - 44
			}
			console.log("scrollHeight：", this.scrollHeight)
		},
		onReachBottom() {},
		async onShow() {
			let _this = this
			if (this.ifSingle) {
				return
			} else {
				if (this.isLogin()) {
					this.historyId = 0
					this.historyList = await this.getHistory()
					this.$nextTick(() => {
						_this.$refs.chatRef.toScroll()
					})
					uni.onKeyboardHeightChange(this.listenKeyBoard)
				} else {
					this.showLogin = true
				}
			}
		},
		onHide() {
			app.globalData.Audio.stop()
			app.globalData.Audio.offPlay()
			app.globalData.Audio.offPause()
			app.globalData.Audio.offStop()
			app.globalData.Audio.offEnded()
			uni.offKeyboardHeightChange(this.listenKeyBoard)
		},
		onUnload() {
			// this.close()
		},
		watch: {
			question(newVal) {
				if (!newVal) {
					this.showSend = false
				} else {
					this.showSend = true
				}
			}
		},
		methods: {
			...mapMutations(["openAnswering", "closeAnswering", "setConnected", "unConnected", "setConnecting",
				"unConnecting", "openCansend", "closeCansend", "notChannel", "isChannel", "addChannelQaList",
				"openAnswerContinue", "closeAnswerContinue", "updateChannelQaList", "setChannelId", "setLocation",
				"setToken", "clearChannelQaList", "notInCall", "setCallContent", "setRespEnd", "notRespEnd",
				"setInterviewCard", "setIncallEnroll", "setIncallJobId", "resetIncallEnroll", "closeInterviewCard",
				"setAiReady", "resetAiReady", "resetCity", "setChannelInterviewCard", "closeChannelInterviewCard",
				"setJobName", "resetJobName", "setJobId", "resetJobId", "setHangUpFirst", "setQunCode",
				"setAdTrackingId", "setCallBackCount", "resetCallBackCount"
			]),
			inputBindFocus(e) {
				if (!this.isLogin()) {
					this.showLogin = true
					return
				}
				if (e.detail.height) {
					this.inputHeight = e.detail.height //这个高度就是软键盘的高度
				}
			},
			onInput(e) {
				this.question = e.target.value
			},
			doSend(e, text) {
				if (e.ctrlKey && e.keyCode === 13) {
					//用户点击了ctrl+enter触发
					this.question += '\n';
				} else {
					//用户点击了enter触发    执行一些逻辑方法
					if (e !== undefined) {
						//发送消息的方法
						this.sendQuestion();
						// 阻止浏览器默认的敲击回车换行的方法
						e.preventDefault();
					}
				}
			},
			sendQuestion() {
				var _this = this;
				if (!this.question) {
					return
				} else {
					this.inputHeight = 0
					var showData = {
						content: this.question,
						origin: "customer",
						msg_type: "text"
					}

					this.send(this.question, showData, "")
				}
			},
			send(data, param, type) {
				let _this = this
				if (!this.aiReady) {
					uni.showToast({
						title: "连接中，请稍后",
						icon: "error",
						duration: 2000
					})
					return
				}
				// 回答完成后才能发下一条信息
				console.log("answering：", this.answering, "answerContinue：", this.answerContinue)
				if (this.answering || this.answerContinue) {
					this.$refs.myModal.showMyModal({
						title: "目前有正在回复的对话，请稍后重试",
						showCancel: false,
						confirmText: "好的"
					})
					return
				}
				if (!this.canSend) {
					return
				} else {
					// 如果无历史记录显示加载中
					if (this.historyList.length == 0) {
						uni.showLoading()
					}
					this.question = ""
					// 设置非频道
					this.notChannel()
					// 设置非通话页
					this.notInCall()
					app.globalData.socketTask.send({
						data: type == "voice" ? data : JSON.stringify({
							"content": data,
							"job_channel_id": "",
							"job_id": _this.jobId,
							"action_type": _this.action
						}),
						success(res) {
							_this.jobId = ""
							_this.action = ""
							_this.noMayAsk = false
							_this.closeInterviewCard()
							_this.closeChannelInterviewCard()
							_this.$set(_this, "question", "")
							uni.hideLoading()
							if (data != "ping") {
								if (!_this.cancelRecord) {
									_this.openAnswering()
									param.printStr = ""
									_this.$set(_this.qaList, _this.qaList.length, param)
									_this.num++
									_this.hold = "h" + _this.num
									_this.closeCansend()
									// _this.placeHolder = "正在努力思考，请稍后..."
								}

							}

						},
						fail(err) {
							_this.jobId = ""
						}
					})
				}

			},
			getHistory() {
				let _this = this
				console.log("获取历史记录")
				return new Promise(resolve => {
					let url = "/api/chat/histories?last_message_id=" + _this.historyId + "&job_channel_id="
					_this.$aiRequest(url, "", "GET").then(res => {
						if (res.code == 0) {
							if (res.data.length == 0) {
								// 新用户
								_this.newUser = true
							} else {
								_this.newUser = false
							}
							let newArr = res.data.reverse()
							let len = res.data.length
							if (len > 0) {
								_this.historyId = res.data[0].id
							}
							newArr = _this.handleList(newArr)
							resolve(newArr)
						}
					})
				})

			},
			getMoreHistory() {
				let _this = this
				if (!this.loadAllHistory) {
					if (!this.historyId) {
						if (this.answerContinue || this.answering) {
							this.$refs.chatRef.refreshRestore()
							return
						} else {
							this.qaList = []
						}
					}
					uni.showLoading()
					let url = "/api/chat/histories?last_message_id=" + this.historyId + "&job_channel_id="
					this.$aiRequest(url).then(res => {
						if (res.code == 0) {
							let len = res.data.length
							uni.hideLoading()
							this.$refs.chatRef.scrollToPre()
							this.$refs.chatRef.refreshRestore()
							if (len > 0) {
								let resArr = res.data.reverse()
								let newArr = this.handleList(resArr)
								this.historyList = newArr.concat(this.historyList)
								this.scrollStr = "his" + res.data[len - 1].id
								this.historyId = res.data[0].id
							} else {
								this.loadAllHistory = true
							}
						} else {
							this.$refs.chatRef.refreshRestore()
						}
					})
				} else {
					uni.showToast({
						title: "已加载全部",
						icon: "none",
						duration: 2000
					})
					setTimeout(function() {
						_this.$refs.chatRef.refreshRestore()
					}, 500)

				}

			},
			// 给聊天记录添加字段
			handleList(arr) {
				let len = arr.length
				for (let i = 0; i < len; i++) {
					if (arr[i].msg_type == "voice") {
						// 语音记录，添加是否播放状态,默认为false
						arr[i].voice.anmitionPlay = false
						arr[i].showTranlate = false
						arr[i].showTranIcon = false
					}
				}
				return arr
			},

			makePhoneCall() {
				this.$store.dispatch('makePhoneCall')
			},
			closeLogin() {
				this.showLogin = false
			},
			cancelLogin() {
				this.closeLogin()
				uni.switchTab({
					url: "/pages/worker_index/worker_index"
				})
			},
			async handleLogin() {
				let _this = this
				this.historyId = 0
				this.historyList = await this.getHistory()
				this.$nextTick(() => {
					_this.$refs.chatRef.toScroll()
				})
				this.creatConnect()
			},
			getTabbarHeight(e) {
				this.tabbarHeight = e
			},
			async creatConnect() {
				var _this = this;
				this.header = {
					'content-type': 'application/json',
					"app-id": urlSetting.urls.appid,
					"open-id": uni.getStorageSync("openid") ? uni.getStorageSync("openid") : "",
					"Authorization": "bearer " + uni.getStorageSync("token"),
				}
				this.abnormalClose = false
				this.abnormalErr = false
				uni.showLoading({
					title: "正在链接客服"
				})
				if (app.globalData.socketTask) {
					// 关闭之前的链接
					// uni.showToast({
					// 	title: "关闭之前的socketTask"
					// })
					await this.close()
					return false
				}
				console.log("connected：", this.connected)
				if (this.connected || this.connecting) {
					// uni.showToast({
					// 	title: "已连接或连接中"
					// })
					return false
				}
				// 两个链接状态都为false才开始创建链接
				this.setConnecting()
				let res = await this.connectWebsocket(this.header)
				if (res.errMsg == "connectSocket:ok") {
					this.initWebsocket()
				}
			},
			connectWebsocket(header) {
				// uni.showToast({
				// 	title: "创建socketTask链接"
				// })
				let _this = this
				return new Promise((resolve) => {
					app.globalData.socketTask = uni.connectSocket({
						url: app.globalData.wssUrl,
						header: header,
						method: 'GET',
						success(res) {
							// uni.showToast({
							// 	title: "socketTask创建成功"
							// })
							resolve(res)
						},
						fail(err) {
							console.log("err:", err)
							uni.showModal({
								title: err.errMsg,
								showCancel: false
							})
						}
					})
				})
			},
			// 间隔一定时间判断用户是否没有输入
			noInput() {
				let _this = this
				this.timer = setInterval(function() {
					let data = "[PING]"
					_this.send(data, "", "")
				}, 10000)
			},
			resetData() {
				this.cancelRecord = false
				this.curRespone = {
					content: "",
					origin: "ai",
					msg_type: "text",
					card: null
				}
				this.responCount = 0
				this.responseStr = ""
				this.notRespEnd()
			},
			initWebsocket() {
				let _this = this
				app.globalData.socketTask.onOpen((res) => {
					this.abnormalClose = false
					this.abnormalErr = false
					this.unConnecting()
					this.setConnected()
					this.closeAnswering()
					this.closeAnswerContinue()
					this.openCansend()
					this.setAiReady()
					uni.hideLoading()
					if (_this.currentProjectDetail.id && !_this.answerContinue) {
						_this.showProPop = true
					}
					console.log('已成功建立链接onOpen', res);
				})
				app.globalData.socketTask.onError((err) => {
					this.abnormalErr = true
					app.globalData.socketTask = null
					clearInterval(_this.timer)
					this.closeAnswering()
					this.closeAnswerContinue()
					this.unConnected()
					this.unConnecting()
					this.resetAiReady()
					// if (this.answering || this.answerContinue) {
					// 	this.handleConnectErr()
					// }
					if (!this.abnormalClose) {
						setTimeout(function() {
							_this.creatConnect()
						}, 2000)
					}

				})
				app.globalData.socketTask.onMessage((res) => {
					this.closeAnswering()
					// this.closeAnswerContinue()
					_this.openAnswerContinue()
					// _this.closeAnswering()
					let respData = JSON.parse(res.data)
					console.log("websocket返回：", respData)
					if (_this.inCall) {
						// 对话页
						if (respData.type == "audio_call_start_interview") {
							// console.log("返回的job_id：", respData.job_id)
							_this.setIncallJobId(respData.job_id ? respData.job_id : "")
							// 用户报名了
							_this.setIncallEnroll()

						} else {
							_this.resetIncallEnroll()
						}
						// if (respData.type == "audio_call_end") {
						// 	_this.setHangUpFirst()

						// }
						if (respData.type == "applied") {
							_this.setHangUpFirst()

						}
						if (respData.message != "[DONE]") {
							_this.setCallContent(respData.message)
						} else {
							_this.setRespEnd()
							_this.openCansend()
							_this.resetData()
							_this.closeAnswerContinue()
						}

					} else {
						if (respData.type == "QCODE") {
							// 推送客服微信
							let card = {
								type: "QCODE"
							}
							_this.curRespone.card = JSON.parse(JSON.stringify(card))
						}
						if (respData.type == "score_not_enough") {
							// 推送充值积分卡片
							let card = {
								type: "score_not_enough"
							}
							_this.setJobName(respData.job_name)
							_this.curRespone.card = JSON.parse(JSON.stringify(card))
						}
						if (respData.type == "applied") {
							// 推送充值积分卡片
							let card = {
								type: "applied"
							}
							_this.setJobName(respData.job_name)
							_this.setJobId(respData.job_id)
							_this.curRespone.card = JSON.parse(JSON.stringify(card))
						}
						if (respData.message != "[DONE]") {
							_this.responCount++
							_this.responseStr += respData.message
							if (_this.responCount == 1) {
								_this.currentQalength = _this.qaList.length
								_this.printResponse()
								if (respData.type == "QCODE") {
									_this.getQrcode(respData.job_id)
								}
							}
						} else {
							_this.setRespEnd()
							console.log("RespEnd：", _this.responEnd)
							if (respData.need_mayask) {
								_this.getMayAsk()
							}
						}
					}
				})
				app.globalData.socketTask.onClose((res) => {
					this.abnormalClose = true
					// uni.hideLoading()
					console.log('onClose', res)
					app.globalData.socketTask = null
					this.unConnected()
					this.unConnecting()
					this.resetAiReady()
					// if (this.answering || this.answerContinue) {
					// 	this.handleConnectErr()
					// }
					clearInterval(this.timer)
					if (!this.abnormalErr) {
						setTimeout(function() {
							_this.creatConnect()
						}, 2000)
					}

				})
			},
			handleConnectErr() {
				// 当链接断开或者出错时提示用户重新发送
				let len = this.qaList.length
				if ((len > 0) && (this.qaList[len - 1].origin == "customer")) {
					this.closeAnswering()
					this.openCansend()
					this.closeAnswerContinue()
					this.resetData()
					clearInterval(this.prinTimer)
					// 上一条是用户发送的数据时
					let data = {
						content: "抱歉！刚才打了个盹儿，没理解到您的意思，请重新发送一下您的问题。",
						printStr: "",
						msg_type: "text",
						origin: "ai",
						jobs: [],
						may_ask: []
					}
					this.qaList.push(data)
				}

			},
			getQrcode(id) {
				if (!id) {
					return
				}
				let url = "/worker/project/" + id + "/wework/external/group/qrcode"
				this.$request(url).then(res => {
					if (res.code == 0) {
						this.setQunCode(res.data.qrcode_url)
					}
				})
			},
			async sendBtnMsg(obj) {
				console.log("sendBtnMsg被调用：", obj)
				let _this = this
				if (obj.job_id) {
					this.currentProjectDetail.id = obj.job_id
					this.currentProjectDetail.name = obj.name
				}
				if (!this.isLogin()) {
					this.showLogin = true
					return
				}
				if (!this.aiReady) {
					uni.showToast({
						title: "连接中，请稍后",
						icon: "error",
						duration: 2000
					})
					return
				}
				// 如果正在回答问题
				if (this.answerContinue) {
					uni.showToast({
						title: "回答中，请稍后",
						icon: "error",
						duration: 2000
					})
					return
				}
				// this.closeProPop()
				this.jobId = obj.job_id
				this.action = obj.action
				if (obj.type == "job") {
					// 词语润色
					let strArr = []
					strArr.push("请介绍一下" + obj.msg)
					strArr.push("我对" + obj.msg + "感兴趣，可以介绍一下吗？")
					strArr.push(obj.msg + "的工作内容是什么呢？福利待遇怎么样？")
					strArr.push(obj.msg + "这个工作看着还不错，请为我介绍下吧")
					strArr.push(obj.msg + "这个工作的详细信息可以说一下吗？")
					let random = Math.floor(Math.random() * strArr.length)
					this.question = strArr[random]
				} else {
					this.question = obj.msg
				}
				this.sendQuestion()

			},
			close() {
				return new Promise((resolve) => {
					if (app.globalData.socketTask) {
						app.globalData.socketTask.close()
					}
				})
			},
			printResponse() {
				let _this = this
				let index = 0
				console.log("开始打印")
				this.prinTimer = setInterval(function() {
					let len = _this.responseStr.length
					if (index < len) {
						console.log("正在打印")
						_this.curRespone.content += _this.responseStr[index]
						if (_this.inChannel) {
							_this.updateChannelQaList(_this.curRespone)
						} else {
							// 不在通话页
							if (!_this.inCall) {
								_this.$set(_this.qaList, _this.currentQalength, _this.curRespone)
							}
						}
						index++
					} else {
						console.log("打印结束")
						console.log(_this.responEnd)
						if (_this.responEnd) {
							console.log("返回结束")
							if (_this.curRespone.card) {
								_this.curRespone.card.showCard = true
							}
							clearInterval(_this.prinTimer)
							_this.openCansend()
							_this.resetData()
							_this.closeAnswerContinue()
						}
					}
				}, 30)

			},
			getMayAsk() {

				let data = {
					"job_channel_id": this.channelId
				}
				let index = 0
				let obj = {}
				console.log("执行了mayask")
				this.$aiRequest("/api/chat/suggested-questions", data, "POST").then(res => {
					if (this.channelId) {
						// 频道内
						index = this.channelQaList.length - 1
						obj = this.channelQaList[index]
						obj.may_ask = res.questions
						this.updateChannelQaList(obj)
					} else {
						index = this.qaList.length - 1
						obj = this.qaList[index]
						obj.may_ask = res.questions
						this.$set(this.qaList, index, obj)
					}

				})
			},
			listenKeyBoard(res) {
				if (res.height == 0) {
					this.inputHeight = 0
					this.scrollHeight = this.btnInfo.top - this.statusBarHeight - 44
				} else {
					this.scrollHeight = app.globalData.systemHeight - this.statusBarHeight - 44 - res
						.height -
						this.btnInfo.height - 10
				}
			},
			initRecord() {
				//录音开始事件
				this.manager.onStart(e => {
					this.inputing = true
				});
				//录音结束事件
				this.manager.onStop(res => {
					let _this = this
					this.inputing = false
					if ((this.touchEndTime - this.touchStartTime) > 1000) {
						this.handleRecorder(res);
					} else {
						uni.showToast({
							title: "长按时间过短",
							icon: "error"
						})
					}

				});
				this.manager.onError(res => {
					let _this = this
					this.inputing = false
				})
			},
			// 处理录音数据
			handleRecorder({
				tempFilePath,
				duration
			}) {
				this.inputing = false;
				let _this = this
				if (duration < 600) {
					uni.showToast({
						title: "说话时间过短",
						icon: "error",
						duration: 2000
					})
					return;
				}

				if (!this.cancelRecord) {
					wx.getFileSystemManager().readFile({
						filePath: tempFilePath,
						success: function(res) {
							// res.data是录音文件的二进制数据
							const binaryData = res.data;
							let midata = new Uint8Array(binaryData)
							let time = new Date().getTime()
							let id = uni.getStorageSync("openid") + time
							// let encoder = new TextEncoder();
							// let binaryId = encoder.encode(id + "@@@")
							let binaryId = _this.stringToUint8Array(id + "@@@@@@" + _this.jobId + "@@@@@@")
							// 输出拼接后的 Uint8Array
							// 计算总长度
							const totalLength = binaryId.length + midata.length;
							// 创建一个新的 Uint8Array，长度为所有数组的总和
							let mergedArray = new Uint8Array(totalLength);
							// 使用 set 方法将每个 Uint8Array 的数据填充到新的 Uint8Array 中
							let offset = 0;
							mergedArray.set(binaryId, offset);
							offset += binaryId.length;

							mergedArray.set(midata, offset);
							// offset += data.length;
							let showData = {
								id: id,
								content: "",
								origin: "customer",
								msg_type: "voice",
								voice: {
									media: {
										key: "",
										url: tempFilePath
									},
									second: duration / 1000,
									anmitionPlay: false
								},
								showTranIcon: false,
								showTranlate: false,
								showTransing: false
							}
							_this.send(mergedArray.buffer, showData, "voice")
							// 接下来你可以对binaryData进行需要的操作
						},
						fail: function(error) {
							console.error('读取文件失败：', error);
						}
					});
				} else {
					this.cancelRecord = false
				}


				// this.canSend && this.sendMsg(params);
			},
			stringToUint8Array(str) {
				const utf8 = unescape(encodeURIComponent(str)); // 将字符串编码为 UTF-8
				const len = utf8.length;
				const arr = new Uint8Array(len);
				for (let i = 0; i < len; i++) {
					arr[i] = utf8.charCodeAt(i);
				}
				return arr;
			},
			startRecord(e) {
				let _this = this
				if (!this.isLogin()) {
					this.showLogin = true
					return
				}
				if (!this.aiReady) {
					uni.showToast({
						title: "连接中，请稍后",
						icon: "error",
						duration: 2000
					})
					return
				}
				if (!this.canSend) {
					uni.showToast({
						title: "正在回答请稍后",
						icon: "error",
						duration: 2000
					})
					return
				}
				// 先判断是否是可发送状态
				if (!this.canSend) {
					return
				}
				_this.touchStartTime = e.timeStamp
				_this.$refs.chatRef.stopCurAudio()
				uni.vibrateShort({
					success: function() {}
				});
				_this.cancelRecord = false
				_this.manager.start({
					duration: 60000,
					lang: "zh_CN"
				});
			},
			getSetting() {
				let _this = this
				uni.getSetting({
					success(res) {
						if (!res.authSetting['scope.record']) {
							_this.voicePermisson = false
							// 可以在这里引导用户去设置中开启权限
						} else {
							_this.voicePermisson = true
							// 用户已授权，可以继续进行后续操作
						}
					},
					fail(err) {}
				});
			},
			stopRecord(e) {
				let _this = this
				this.inputing = false
				this.touchEndTime = e.timeStamp
				if ((this.touchEndTime - this.touchStartTime) > 1000) {
					this.manager.stop()
				} else {
					setTimeout(function() {
						_this.manager.stop()
					}, 1000)
				}
			},
			//录音被打断
			cancelVoice(e) {
				this.inputing = false
				// this.canSend = false;
				this.manager.stop();
			},
			openSetting() {
				let _this = this
				let ifAuth = uni.getStorageSync("voiceAuth")
				if (ifAuth) {
					uni.openSetting({
						success(res) {
							if (res.authSetting['scope.record']) {
								_this.voicePermisson = true
								_this.showVoice = true
							}
						},
						fail(openErr) {
							_this.voicePermisson = false
						}
					});
				} else {
					uni.authorize({
						scope: 'scope.record',
						success(res) {
							_this.voicePermisson = true
							_this.showVoice = true
						},
						fail(err) {
							// 弹出麦克风授权
							_this.voicePermisson = false
						},
						complete() {
							uni.setStorageSync("voiceAuth", true)
						}
					})
				}
			},
			changeChatMethod() {
				if (!this.showVoice) {
					// 当前是文字输入，要切换到语音输入
					// 首先获取设置，看是否有语音授权
					if (!this.voicePermisson) {
						this.openSetting()
					} else {
						this.showVoice = true
					}
				} else {
					this.showVoice = false
				}
			},
			handleTouchMove(e) {
				if (!this.canSend) {
					return
				}
				let exp = e.touches[e.touches.length - 1].clientY < this.btnInfo.top
				if (exp) {
					this.cancelRecord = true
				} else {
					this.cancelRecord = false
				}
			},
			setScrollHeight() {
				this.scrollHeight = this.btnInfo.top - this.statusBarHeight - 44
			},

		}
	}
</script>

<style lang="scss" scoped>
	::v-deep {
		.u-navbar--fixed {
			background: linear-gradient(180deg, #9EC2FF 0%, #FFFFFF 100%);
		}

		.u-navbar__content__left {
			display: none !important;
		}

		.u-tabs__wrapper__nav__item {
			padding: 0 !important;
		}
	}

	.content {
		width: 100%;
		left: 0;
		top: 0;
		position: fixed;
		height: 100vh;
		background: #F3F3F5;
	}

	.fenge {
		margin-top: 20rpx;

		.fgline {
			width: calc(50% - 110rpx);
			border-top: 2rpx solid #C2D3E5;
		}

		.text {
			width: 200rpx;
			font-weight: 400;
			font-size: 26rpx;
			color: #93A4B7;
			text-align: center;
		}
	}



	.input_btn_wrap {
		width: calc(100% - 56rpx);
		position: fixed;
		left: 28rpx;
		bottom: 24rpx;
		height: 100rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		box-shadow: 0rpx 0rpx 4rpx 0rpx rgba(0, 0, 0, 0.1);
		border-radius: 63rpx;
		z-index: 10;

		.phone_icon {
			position: absolute;
			right: 0;
			font-size: 0;

			image {
				width: 77rpx;
			}
		}

		.voice_inputing {
			text-align: center;

			image {
				height: 100rpx;
			}
		}

		.btns_wrap {
			position: absolute;
			bottom: calc(100% + 10px);
			left: 0;

			.btn_item {
				width: 180rpx;
				text-align: center;
				height: 30px;
				line-height: 30px;
				background: #F7F8FA;
				border-radius: 63rpx;
				font-size: 27rpx;
				color: #7D8488;
				margin-right: 15rpx;
				justify-content: center;

				image {
					width: 28rpx;
					margin-right: 6rpx;
				}
			}
		}

		&.upper {
			// position: fixed;
			// width: calc(100% - 80rpx);
			// left: 40rpx;
			// z-index: 105;
			// background: #fff;
			// border: 1rpx solid #216FF9;

			// .btns_wrap {
			// 	.btn_item {
			// 		background: #F7F8FA;
			// 		color: #7D8488;
			// 		// border: 1rpx solid #216FF9;
			// 	}
			// }
		}

		.voice_btn_wrap {
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
		}

		.input_box {
			input {
				height: 100rpx;
				line-height: 100rpx;
				font-size: 30rpx;
				color: #0F2A4F;
				position: relative;
			}


			padding: 0 75rpx 0 100rpx;
			box-sizing: border-box;
		}

		.fl_icon {
			position: absolute;
			top: 8rpx;
			left: 11rpx;

			image {
				width: 86rpx;
				height: 86rpx;
			}
		}

		.func_icon {
			position: absolute;
			padding: 0 15rpx 0 30rpx;
			height: 100rpx;
			top: 0rpx;
			right: 0rpx;
			z-index: 100;

			image {
				width: 60rpx;
				height: 60rpx;
				margin-top: 20rpx;
			}
		}
	}
</style>