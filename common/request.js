import urlSetting from "../url_setting";
const BASE_URL = urlSetting.urls.apiUrl
const request = (url = '', date = {}, type = 'GET', header = {
	"Content-Type": "application/json",
	"Authorization": "bearer " + uni.getStorageSync("token"),
	"accept": "application/json",
	"app-id": urlSetting.urls.appid,
	"open-id": !uni.getStorageSync("openid") ? "" : uni.getStorageSync("openid")
}) => {
	// if (url == "/homepage") {
	// 	uni.showLoading({
	// 		title: "加载中"
	// 	})
	// }
	return new Promise((resolve, reject) => {
		uni.showLoading({
			mask: true
		})
		uni.request({
			method: type,
			url: BASE_URL + url,
			data: date,
			header: header,
			dataType: 'json',
			timeout: url == "/homepage" ? 5000 : 60000
		}).then((response) => {
			uni.hideLoading()
			let [error, res] = response;
			if (res) {
				if (res.statusCode.toString()[0] == "5") {
					console.log("系统内部发生错误")
					if (url == "/homepage") {
						uni.redirectTo({
							url: "/pages/error_sever/error_sever"
						})
						return
					}
				}
				if (res.data.code == -1 && url.indexOf(
						"/guest/role") == -1) {
					uni.removeStorageSync("token")
					uni.removeStorageSync("currentRole")
					if (uni.getStorageSync("workerInfo")) {
						uni.removeStorageSync("workerInfo")
					}

					if (uni.getStorageSync("employerInfo")) {
						uni.removeStorageSync("employerInfo")
					}

					uni.removeStorageSync("loginStatus")
					uni.redirectTo({
						url: "/pages/role_confirm_page/role_confirm_page",
						success() {

						},
						fail() {
							uni.showModal({
								title: "非常抱歉，现在重新加载小程序。",
								showCancel: false,
								success(res) {
									if (res.confirm) {
										uni.reLaunch({
											url: "/pages/role_confirm_page/role_confirm_page",
											fail() {
												uni.showModal({
													title: "请点击右上角...，重新进入小程序。",
													showCancel: false
												})
											}
										})
									}
								}
							})
						}
					})
				}
				if (res.data.code != 0 && (url.indexOf("intentionReport") == -1) && url.indexOf(
						"/guest/role") == -1) {
					console.log("出错啦")
					uni.showModal({
						title: res.data.msg,
						showCancel: false
					})
				}
				resolve(res.data);
			} else {
				console.log("error1：", error)
				reject(error)
			}

			// wx.hideLoading({
			// 	noConflict: true
			// });

		}).catch(error => {
			wx.hideLoading({
				noConflict: true
			});
			console.log("error：", error)
			let [err, res] = error;
			reject(err)
		})
	});
}
export default request