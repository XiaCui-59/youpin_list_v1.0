import Vue from 'vue'
import Vuex from 'vuex'
import request from 'common/request.js'

Vue.use(Vuex)
// 获取初始状态值
let currentRole = uni.getStorageSync("currentRole") ? uni.getStorageSync("currentRole") : ""
let employerInfo = uni.getStorageSync("employerInfo") ? uni.getStorageSync("employerInfo") : null
let workerInfo = uni.getStorageSync("workerInfo") ? uni.getStorageSync("workerInfo") : null
let userInfo = uni.getStorageSync("userInfo") ? JSON.parse(uni.getStorageSync("userInfo")) : null
let shareParams = uni.getStorageSync("shareParams") ? JSON.parse(uni.getStorageSync("shareParams")) : null
let nameShow = uni.getStorageSync("nameShow") ? uni.getStorageSync("nameShow") : ""
let token = uni.getStorageSync("token") ? uni.getStorageSync("token") : ""
let openid = uni.getStorageSync("openid") ? uni.getStorageSync("openid") : ""
let loginStatus = uni.getStorageSync("loginStatus") ? uni.getStorageSync("loginStatus") : ""
const store = new Vuex.Store({
	state: {
		nameShow: nameShow,
		employerInfo: employerInfo,
		userInfo: userInfo,
		loginStatus: loginStatus,
		// isLogin: token ? true : false,
		openid: openid,
		shareParams: shareParams,
		answering: false, //等待返回数据，有数据返回时关闭动效
		answerContinue: false, //有返回并且还没有返回完整，开启此开关，可显示闪烁圆点
		connected: false,
		connecting: false,
		canSend: true,
		inChannel: false,
		channelId: "",
		channelQaList: [], //频道页即时聊天记录
		channelQaLen: 0,
		location: null, //记录地址详细数据
		city: "", //记录当前城市,
		token: token, //记录token,
		inCall: false, //标记是否处于通话界面,
		callContent: "", //记录ai音频对应的文字流输出
		responEnd: false, //记录文本输出结束标志
		showInterviewCard: false, //是否在对话中展示面试入口,
		showChannelInterviewCard: false, //是否在频道页展示面试入口,
		aiSpeekingEnd: false, //记录ai说话完毕,
		incallEnroll: false, //记录是否在语音对话中报名成功
		incallJobId: "", //记录语音对话中报名的职位名称
		aiReady: false, //记录AI的链接状态,
		sureJobName: "",
		sureJobId: "",
		hangUpFirst: false, //是否主动挂断电话
		qunQrcode: "", //记录推送的群二维码
		ad_tracking_id: "", //记录参数id,
		callBackCount: 0, //记录回传调用次数，
		workType: [{
			value: "",
			label: "全部",
			icon_mini: "https://lingdongzhida.oss-cn-chengdu.aliyuncs.com/job_type_icon_mini/CS9900.png"
		}], //工种类型
		openidStatus: "none",
		audioSwitch: false,
		workerInfo: workerInfo,
		currentRole: ""
	},
	mutations: {
		setNameShow(state) {
			state.nameShow = "show"
			uni.setStorageSync("nameShow", "show")
		},
		setRole(state, role) {
			state.currentRole = role
			uni.setStorageSync("currentRole", role)
		},
		setCallBackCount(state) {
			state.callBackCount = 1
		},
		resetCallBackCount(state) {
			state.callBackCount = 0
		},
		setAdTrackingId(state, id) {
			state.ad_tracking_id = id ? id : ""
		},
		setHangUpFirst(state) {
			state.hangUpFirst = true
		},
		resetHangUpFirst(state) {
			state.hangUpFirst = false
		},
		setQunCode(state, url) {
			state.qunQrcode = url
		},
		resetQunCode(state) {
			state.qunQrcode = ""
		},
		setJobName(state, name) {
			state.sureJobName = name
		},
		resetJobName(state) {
			state.sureJobName = ""
		},
		setJobId(state, id) {
			state.sureJobId = id
		},
		resetJobId(state) {
			state.sureJobId = ""
		},
		setAiReady(state) {
			state.aiReady = true
		},
		resetAiReady(state) {
			state.aiReady = false
		},
		setIncallEnroll(state) {
			state.incallEnroll = true
		},
		resetIncallEnroll(state) {
			state.incallEnroll = false
		},
		setIncallJobId(state, id) {
			state.incallJobId = id
		},
		resetIncallJobId(state) {
			state.incallJobId = ""
		},
		// 更新个人信息
		updateLoginStatus(state) {
			state.loginStatus = "in"
		},
		// 更新个人信息
		updateEmployerInfo(state, userInfo) {
			state.employerInfo = userInfo
		},
		// 登录
		login(state, userInfo) {
			state.isLogin = true
			state.userInfo = userInfo
		},
		// 登出
		logout(state) {
			state.isLogin = false
			state.userInfo = null
			state.employerInfo = null
			uni.clearStorage()
		},
		setInterviewCard(state) {
			state.showInterviewCard = true
		},
		closeInterviewCard(state) {
			state.showInterviewCard = false
		},
		setChannelInterviewCard(state) {
			state.showChannelInterviewCard = true
		},
		closeChannelInterviewCard(state) {
			state.showChannelInterviewCard = false
		},
		setCallContent(state, str) {
			state.callContent += str
		},
		setAiSpeekingEnd(state) {
			state.aiSpeekingEnd = true
		},
		resetAiSpeekingEnd(state) {
			state.aiSpeekingEnd = false
		},
		clearCallContent(state) {
			state.callContent = ""
		},
		setRespEnd(state) {
			state.responEnd = true
		},
		notRespEnd(state) {
			state.responEnd = false
		},
		setInCall(state) {
			state.inCall = true
		},
		notInCall(state) {
			state.inCall = false
		},
		// 对话页
		notChannel(state) {
			state.inChannel = false
		},
		// 更新token
		setToken(state, token) {
			state.token = token
		},
		// 设置城市
		setLocation(state, obj) {
			if (obj && obj.ad_info) {
				state.location = obj
				state.city = obj.ad_info.city
			} else {
				state.city = "成都市"
			}
		},
		resetCity(state) {
			state.city = ""
		},
		// 设置频道id
		setChannelId(state, str) {
			state.channelId = str
		},
		// 添加聊天记录
		addChannelQaList(state, obj) {
			state.channelQaList.push(obj)
		},
		// 更新聊天记录
		updateChannelQaList(state, obj) {
			Vue.set(state.channelQaList, state.channelQaLen, obj)
		},
		// 计算频道聊天长度
		calcChannelQaLen(state) {
			state.channelQaLen = state.channelQaList.length
		},
		// 清空聊天记录
		clearChannelQaList(state) {
			state.channelQaList = []
		},
		// 频道页
		isChannel(state) {
			state.inChannel = true
		},
		// 可发送状态开关
		openCansend(state) {
			state.canSend = true
		},
		closeCansend(state) {
			state.canSend = false
		},
		// 开启回答中状态
		openAnswering(state) {
			state.answering = true
		},
		// 关闭回答中状态
		closeAnswering(state) {
			state.answering = false
		},
		// 开启闪烁开关
		openAnswerContinue(state) {
			state.answerContinue = true
		},
		// 关闭闪烁开关
		closeAnswerContinue(state) {
			state.answerContinue = false
		},
		// 设置已连接状态
		setConnected(state) {
			state.connected = true
		},
		// 设置未链接成功
		unConnected(state) {
			state.connected = false
		},
		// 设置连接中状态
		setConnecting(state) {
			state.connecting = true
		},
		// 设置不是连接中状态
		unConnecting(state) {
			state.connecting = false
		},

		// openid
		updateOpenid(state, openid) {
			state.openid = openid
		},
		updateWorkType(state, data) {
			state.workType = state.workType.concat(data)
		},
		updateOpenidStatus(state, status) {
			state.openidStatus = status
		},
		updateAudioSwitch(state, data) {
			state.audioSwitch = data
		},
		updateWorkerInfo(state, info) {
			state.workerInfo = info
		}
	},
	actions: {
		getAudioSwitch({
			commit
		}) {
			let _this = this
			request("/guest/ai-audio-call-enabled").then(resp => {
				if (resp.code == 0) {
					commit("updateAudioSwitch", resp.data)
				}
			})
		},
		getOpenid({
			commit
		}) {
			let _this = this
			uni.login({
				success: (res) => {
					if (res.errMsg == 'login:ok') {
						let url = "/auth/ai-wechat/mini/openid"
						let data = {
							code: res.code,
							share_id: ""
						}
						request(url, data, "POST").then(resp => {
							if (resp.code == 0) {
								console.log("open_id:", resp.data.open_id)
								uni.setStorageSync("openid", resp.data.open_id)
								commit("updateOpenid", resp.data.open_id)
								commit("updateOpenidStatus", "success")
							} else {
								commit("updateOpenidStatus", "error")
							}
						})
					}
				},
				fail(err) {}
			});
		},
		getWorkType({
			commit
		}) {
			let _this = this
			request("/guest/jobTypes").then(res => {
				if (res.code == 0) {
					console.log("获取工种：", res.data)
					commit("updateWorkType", res.data)
				}
			})
		},
		// 获取个人信息
		getEmployerInfo({
			commit
		}, userInfo) {
			// 这里应该是调用登录接口的代码
			request("/employer/info").then(resp => {
				if (resp.code == 0) {
					uni.setStorageSync("employerInfo", resp.data)
					commit('updateEmployerInfo', resp.data)
				}
			})

		},
		// 获取个人信息
		getWorkerInfo({
			commit
		}, userInfo) {
			// 这里应该是调用登录接口的代码
			request("/worker/ai-wechat/profile").then(resp => {
				if (resp.code == 0) {
					uni.setStorageSync("workerInfo", resp.data)
					commit('updateWorkerInfo', resp.data)
				}
			})

		},
		// 拨打客服电话
		makePhoneCall() {
			// 这里应该是调用登录接口的代码
			request("/guest/contact-phone").then(resp => {
				if (resp.code == 0) {
					uni.makePhoneCall({
						phoneNumber: resp.data
					})
				}
			})
		},
		// 登出操作
		userLogout({
			commit
		}) {
			// 这里应该是调用登出接口的代码
			commit('logout')
		}
	},
	getters: {}
})
export default store