import urlSetting from "@/url_setting.js"
export default {
	// 生成分享记录
	// 分享给好友
	onShareAppMessage(res) {

		let shareParams = uni.getStorageSync("shareParams") ? JSON.parse(uni.getStorageSync("shareParams")) : {
			"way_wechat_friend": "",
			"way_wechat_moment": "",
			"way_qrcode": ""
		}
		return {
			title: "快乐求职好伙伴，品质工作新选择",
			path: "/pages/role_confirm_page/role_confirm_page?share_id=" + shareParams.way_wechat_friend,
			imageUrl: urlSetting.urls.imageUrl + "/worker/mini_share_2.jpg?time=" + (new Date()).getTime()
		}
	},
	// 分享到朋友圈
	onShareTimeline(res) {
		let shareParams = uni.getStorageSync("shareParams") ? JSON.parse(uni.getStorageSync("shareParams")) : {
			"way_wechat_friend": "",
			"way_wechat_moment": "",
			"way_qrcode": ""
		}
		return {
			title: "快乐求职好伙伴，品质工作新选择",
			// path: "/pages/index/index",
			query: "share_id=" + shareParams.way_wechat_moment, //点击分享链接之后进入的页面路径
			imageUrl: urlSetting.urls.imageUrl + "/worker/mini_share_2.jpg?time=" + (new Date()).getTime() //分享发送的链接图片地址
		}
	}
}