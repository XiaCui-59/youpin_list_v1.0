<template>
	<view class="single_page" v-if="ifSingle">
		<image :src="imgUrl+'/worker/single_page.png'" mode="widthFix" style="width: 100%;"></image>
	</view>
	<view class="content" v-else>
		<!-- 自定义导航栏 -->
		<u-navbar title="职位详情" @leftClick="leftClick" bgColor="#F5F6FA" titleStyle="color:#010101;font-size: 31rpx;">
			<view class="u-nav-slot" slot="left"
				style="width:57rpx;height:57rpx;text-align: center;line-height: 57rpx;border:1px solid #C5C6CB;border-radius: 50%;">

				<u-icon name="arrow-left" size="19" color="#4E4E52"
					custom-style="display: inline-block;line-height: 57rpx;margin:0 auto;left:-2rpx;"></u-icon>
			</view>
		</u-navbar>
		<view class="cont" :style="{marginTop:marginTop+tabMargin/2+'px',minHeight:contMinHeight+'px'}">
			<view class="box">
				<view class="title">{{workInfo.name}}</view>
				<!-- <view class="salary">
					{{(item.min_salary== item.max_salary?item.max_salary:(item.min_salary+"-"+item.max_salary))+"元"+period.filter(el=>{return el.value==item.salary_type})[0].text}}
				</view> -->
				<view class="salary">
					{{workInfo.min_salary==workInfo.max_salary?workInfo.max_salary:(workInfo.min_salary+"-"+workInfo.max_salary)}}元{{period.filter(el=>{return el.value == workInfo.worker_salary_type})[0].text}}
				</view>
				<view class="location flex">
					<u-icon name="map-fill" color="#BEBEBE" size="14"></u-icon>
					<view class="text">{{workInfo.city+workInfo.district}}</view>
				</view>
				<view class="labels flex" v-if="workInfo.highlight && workInfo.highlight.length != 0">
					<view class="label flex" v-for="(label,labIndex) in workInfo.highlight" :key="labIndex">
						{{label}}
					</view>
				</view>
			</view>
			<view class="box qun_box flex flex_btween" @click="addQun">
				<view class="left flex">
					<image :src="imgUrl+'/worker/v_list/qun_img.png'" mode="widthFix" style="width:86rpx;">
					</image>
					<view class="info">
						<view class="text">免费加入本地求职群</view>
						<view class="text">附近求职信息推荐</view>
					</view>
					<view class="circle">99</view>
				</view>
				<view class="flex flex_end">
					<view class="btn">加入群聊</view>
					<image :src="imgUrl+'/worker/v_list/arrow_right_blue.png'" mode="widthFix"
						style="width:12rpx;margin-left: 17rpx;">
					</image>
				</view>
			</view>
			<view class="box detail_info">
				<view class="sub_title title">职位详情</view>
				<text>{{workInfo.description}}</text>
			</view>
			<view class="box">
				<view class="detail_tit flex flex_btween" :style="{marginBottom:workInfo.latitude?'28rpx':'0'}">
					<view class="text">{{workInfo.address}}</view>
					<u-icon name="arrow-right" color="#0F2A4F" size="16"></u-icon>
				</view>
				<map name="myMap" v-if="workInfo.latitude" :longitude="workInfo.longitude" :latitude="workInfo.latitude"
					:markers="markers" @tap="handleMapClick"
					style="width:100%;height:269rpx;border-radius: 14rpx;overflow: hidden;"></map>
			</view>
			<view class="box">
				<view class="detail_tit" style="font-size: 0;">
					<image :src="imgUrl+'/worker/v_list/text_logo.png'" mode="widthFix" style="width:188rpx;">
					</image>
				</view>
				<view class="tips">
					灵动优聘严禁用人单位和招聘者用户做出任何损害求职者合法权益的违法违规行为，包括但不限于扣押求职者证件、收取求职者财物、向求职者集资、让求职者入股、诱导求职者异地入职、异地参加培训、违法违规使用求职者简历等。一旦您发现此类行为，请立即向灵动优聘投诉举报
					<view style="color: #216FF9;display: inline-block;margin-left: 10rpx;" @click="openKefu">立即投诉</view>
				</view>
			</view>
		</view>
		<view class="fixed_area flex flex_btween">
			<button open-type="share" class="share_btn">
				<image :src="imgUrl+'/worker/v_list/ic_wechat.png'" mode="widthFix" style="width:58rpx;">
				</image>
				<view class="text">分享</view>
			</button>
			<image :src="imgUrl+'/worker/v_list/ic_ai.png'" mode="widthFix" style="width:90rpx;" @click="toChat">
			</image>
			<view class="btn flex flex_around" @click="makePhoneCall">
				<view class="flex">
					<image :src="imgUrl+'/worker/v_list/ic_call.png'" mode="widthFix" style="width:34rpx;">
					</image>
					<view class="text">电话联系</view>
				</view>
			</view>
			<view class="btn flex flex_around" @click="openForm">
				<view class="flex">
					<image :src="imgUrl+'/worker/v_list/ic_person.png'" mode="widthFix" style="width:34rpx;">
					</image>
					<view class="text">立即报名</view>
				</view>
			</view>
		</view>
		<!-- <uni-popup ref="pubModal" type="center">
			<view class="modal_wrap">
				<view class="modal_title">关注公众号</view>
				<view class="modal_content">
					<image :src="qrcode" mode="widthFix" :show-menu-by-longpress="true"></image>
					<view class="text">长按上方二维码，关注灵动优聘公众号，工作进度会通过公众号告知您。</view>
				</view>
				<view class="modal_btns flex flex_around">
					<view class="modal_btn modal_confirm" @click="confirm">好的</view>
				</view>
			</view>
		</uni-popup> -->
		<u-popup ref="formModal" round="35rpx" :show="showFormModal" mode="bottom">
			<view class="form_modal">
				<view class="title">立即报名</view>
				<view class="form">
					<view class="line flex">
						<view class="tit">您的姓名</view>
						<input type="text" v-model="name" placeholder="请输入您的真实姓名" placeholder-class="place_style" />
					</view>
					<view class="line flex">
						<view class="tit">性别</view>
						<view class="text_wrap flex flex_around">
							<view class="radio_item flex" v-for="(item,index) in genderList" :key="index"
								@click="changeGender(item)">
								<image
									:src="gender==item.value?(imgUrl+'/worker/v_list/ic_radio_active.png'):(imgUrl+'/worker/v_list/ic_radio_normal.png')"
									mode="widthFix" style="width:38rpx;">
								</image>
								<view class="label">{{item.text}}</view>
							</view>
						</view>
					</view>
					<view class="line flex">
						<view class="tit">年龄</view>
						<u-input v-model="age" type="number" placeholder="请输入您的年龄" border="none"
							placeholderClass="place_style" inputAlign="center" fontSize="27rpx" color="#333333"
							customStyle="font-weight:600;">
							<template slot="suffix">
								<view class="place_style">岁</view>
							</template>
						</u-input>
						<!-- <input type="text" v-model="age" placeholder="请输入您的年龄" placeholder-style="font-weight:400;" /> -->
					</view>
					<view class="line flex">
						<view class="tit">民族</view>
						<input type="text" v-model="nation" placeholder="请输入您的民族" placeholder-class="place_style" />
					</view>
					<view class="line flex">
						<view class="tit">手机号码</view>
						<input type="text" disabled v-model="workerInfo.mobile" />
						<button v-if="!workerInfo.mobile" class="share_btn get_number" open-type="getPhoneNumber"
							@getphonenumber="getPhoneNumber">
							<view class="text">点击获取电话号码</view>
						</button>
					</view>
				</view>
				<view class="btns flex flex_btween">
					<view class="btn cancel" @click="cancelForm">取消</view>
					<view class="btn confirm" @click="confirmForm">确认</view>
				</view>
			</view>
		</u-popup>
		<login :showLogin="showLogin" @cancel="closeLogin" @closeLogin="closeLogin" @getInfo="getProfile">
		</login>
	</view>
</template>

<script>
	import login from "@/components/login.vue"
	import commonData from "@/common/commonData"
	import {
		mapState,
		mapMutations
	} from "vuex"
	const app = getApp()
	export default {
		data() {
			return {
				showLogin: false,
				mobile: "",
				age: "",
				nation: "",
				name: "",
				gender: "",
				genderList: [{
						value: "male",
						text: "男"
					},
					{
						value: "female",
						text: "女"
					}
				],
				showFormModal: false,
				item: {
					highlight: ["包吃住", "包吃住", "包吃住", "包吃住", "包吃住", "包吃住", "包吃住", "包吃住", "包吃住"]
				},
				period: commonData.periodList,
				ifSingle: app.globalData.scene == 1154 ? true : false,
				imgUrl: app.globalData.baseImageUrl,
				marginTop: app.globalData.marginTop,
				tabMargin: app.globalData.tabMargin,
				systemHeight: app.globalData.systemHeight,
				id: "",
				workInfo: {
					"id": "",
					"name": "",
					"gender": "",
					"min_age": 0,
					"max_age": 0,
					"min_salary": 0,
					"max_salary": 0,
					"worker_salary_type": "",
					"province": "",
					"city": "",
					"district": "",
					"address": "",
					"latitude": 0,
					"longitude": 0,
					"payroll_cycle": "",
					"payroll_detail": {
						"monthly": {
							"day": 3
						}
					},
					"description": "   ",
					"videos": [],
					"images": [],
					"no_interview": false
				},
				markers: [{
					id: 1,
					latitude: 30.6555, // 纬度
					longitude: 104.07721, // 经度
					iconPath: "https://static.test.swiftwd.com/worker/v_list/location.png",
					width: "25rpx",
					height: "34rpx"
				}],
				contMinHeight: 0,
				qrcode: "",
				getPhoneData: {},
				applied: false
			}
		},
		components: {
			login,
		},
		computed: {
			...mapState(["workerInfo", "loginStatus"])
		},
		onShareAppMessage() {
			return {
				title: "快乐求职好伙伴，品质工作新选择",
				path: "/worker/work_detail/work_detail?id=" + this.id,
				imageUrl: app.globalData.baseImageUrl + "/worker/mini_share_2.jpg?time=" + (new Date()).getTime()
			}
		},
		onLoad(param) {
			this.id = param.id
			this.getInfo()
			this.contMinHeight = app.globalData.systemHeight - this.marginTop - this.tabMargin
			if (this.workerInfo) {
				this.name = this.workerInfo.name ? this.workerInfo.name : ""
				this.age = this.workerInfo.age ? this.workerInfo.age : ""
				this.nation = this.workerInfo.nation ? this.workerInfo.nation : ""
				this.gender = this.workerInfo.gender ? this.workerInfo.gender : ""
			}

			if (!this.isLogin()) {
				this.showLogin = true
			} else {
				this.getSignStatus()
			}
		},
		onShow() {
			console.log("ifSingle", this.ifSingle)
			if (this.ifSingle) {
				return
			} else {
				if (this.isLogin()) {
					// this.getList()
				}
			}

		},
		methods: {
			...mapMutations(["updateLoginStatus", "updateOpenid", "setToken"]),
			getProfile() {
				this.toChat()
			},
			getSignStatus() {
				let url = "/worker/jobs/" + this.id + "/applied"
				this.$request(url).then(res => {
					if (res.code == 0) {
						this.applied = res.data.applied
					}
				})
			},
			leftClick() {
				let pages = getCurrentPages()
				if (pages.length > 1) {
					uni.navigateBack()
				} else {
					uni.switchTab({
						url: "/pages/worker_index/worker_index"
					})
				}

			},
			closeLogin() {
				this.showLogin = false
			},
			addQun() {
				uni.navigateTo({
					url: "/worker/webview/webview"
				})
			},
			toChat() {
				if (this.isLogin()) {
					uni.navigateTo({
						url: "/worker/worker_chat/worker_chat?id=" + this.id
					})
				} else {
					this.showLogin = true
				}

			},
			getInfo() {
				let url = "/jobs/" + this.id
				this.$request(url).then(res => {
					if (res.code == 0) {
						this.workInfo = res.data
						this.markers.longitude = res.data.longitude
						this.markers.latitude = res.data.latitude
					}
				})
			},
			changeGender(item) {
				this.gender = item.value
			},
			openForm() {
				this.showFormModal = true
			},
			makePhoneCall() {
				this.$store.dispatch('makePhoneCall')
			},
			handleMapClick() {
				uni.openLocation({
					latitude: this.workInfo.latitude, // 纬度
					longitude: this.workInfo.longitude, // 经度
					address: this.workInfo.address,
					success: function() {
						console.log('success');
					}
				});
			},
			cancelForm() {
				this.showFormModal = false
			},
			confirmForm() {
				if (!this.name) {
					uni.showToast({
						title: "请填写姓名",
						icon: "error"
					})
					return
				}
				if (!this.gender) {
					uni.showToast({
						title: "请选择性别",
						icon: "error"
					})
					return
				}
				if (!this.age) {
					uni.showToast({
						title: "请填写年龄",
						icon: "error"
					})
					return
				}
				if (!this.nation) {
					uni.showToast({
						title: "请填写民族",
						icon: "error"
					})
					return
				}
				if (!this.workerInfo.mobile) {
					uni.showToast({
						title: "请获取手机号",
						icon: "error"
					})
					return
				}
				let data = {
					"gender": this.gender,
					"name": this.name,
					"ethnicity": this.nation,
					"age": Number(this.age),
					"job_id": this.id
				}
				this.$request("/worker/enrollment", data, "POST").then(res => {
					if (res.code == 0) {
						uni.showToast({
							title: "报名成功",
							icon: "none"
						})
					}
				})

			},
			openKefu() {
				wx.openCustomerServiceChat({
					extInfo: {
						url: "https://work.weixin.qq.com/kfid/kfc01b1c6e379607409"
					},
					corpId: 'wwe3ced2e65390ad79',
					success(res) {},
					fail(err) {
						console.log(err)
						uni.showToast({
							title: "请稍后重试",
							icon: "none"
						})
					}
				})
			},
			getCode() {
				this.$request("/employer/wechat/official-account/subscribe-qrcode").then(res => {
					if (res.code == 0) {
						this.qrcode = res.data.qrcode
						this.open()
					}
				})
			},
			// open() {
			// 	this.$refs.pubModal.open()
			// 	// this.getCode()
			// },
			confirm() {
				this.$refs.pubModal.close()
			},
			getOpenid() {
				let _this = this
				return new Promise(resolve => {
					uni.login({
						success: (res) => {
							if (res.errMsg == 'login:ok') {
								let url = "/auth/ai-wechat/mini/openid"
								let data = {
									code: res.code,
									share_id: ""
								}
								_this.$request(url, data, "POST").then(resp => {
									if (resp.code == 0) {
										console.log("open_id:", resp.data.open_id)
										uni.setStorageSync("openid", resp.data.open_id)
										_this.updateOpenid(resp.data.open_id)
										resolve(resp.data.open_id)
									}
								})
							}
						},
						fail(err) {
							console.log(err)
						}
					});
				})
			},
			async getPhoneNumber(e) {
				let url = ""
				let _this = this
				console.log(e, "getPhoneNumber")
				uni.showLoading()
				this.closeLogin()
				// #ifdef MP-WEIXIN
				if (uni.getStorageSync("openid")) {
					this.getPhoneData.open_id = uni.getStorageSync("openid");
				} else {
					this.getPhoneData.open_id = await this.getOpenid();
				}
				// this.getPhoneData.share_id = this.shareId;
				// #endif
				if (e.detail.errMsg == 'getPhoneNumber:ok') {
					console.log(e.detail, "e.detail")
					this.getPhoneData.encrypted_data = e.detail.encryptedData;
					this.getPhoneData.iv = e.detail.iv;
					// #ifdef MP-WEIXIN
					this.getPhoneData.code = e.detail.code;
					// this.getPhoneData.ad_tracking_id = this.ad_tracking_id
					url = "/auth/ai-wechat/worker/login"
					// #endif
					_this.$request(url, this.getPhoneData, "POST").then(resp => {
						if (resp.code == 0) {
							_this.setToken(resp.data.token)
							uni.setStorageSync("token", resp.data.token)
							uni.setStorageSync("loginStatus", "in")
							_this.updateLoginStatus()
							_this.$store.dispatch('getWorkerInfo');

						}
						uni.hideLoading()
					})
				} else {
					uni.hideLoading()
					// uni.setStorageSync("loginStatus", "in")
					// uni.setStorageSync("token", _this.token)
					// let header = {
					// 	"Authorization": "bearer " + _this.token,
					// 	"accept": "application/json",
					// 	"open-id": !uni.getStorageSync("openid") ? "" : uni.getStorageSync(
					// 		"openid")
					// }
					// _this.getShareParams(header)
					// _this.$emit("getInfo", "login")

				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep {
		.u-navbar--fixed {
			background: linear-gradient(180deg, #9EC2FF 0%, #FFFFFF 100%);
		}

		.u-tabs__wrapper__nav__item {
			padding: 0 !important;
		}

		.place_style {
			font-weight: 400;
			font-size: 27rpx;
			color: #686868 !important;
			text-align: center;
		}
	}

	.qun_box {
		.left {
			position: relative;

			.circle {
				position: absolute;
				width: 34rpx;
				height: 34rpx;
				border-radius: 50%;
				background: #D30000;
				font-size: 23rpx;
				color: #FFFFFF;
				text-align: center;
				line-height: 34rpx;
				top: -17rpx;
				left: 69rpx;
			}
		}

		.btn {
			font-weight: 600;
			font-size: 27rpx;
			color: #216FF9;
			border-bottom: 2rpx dotted #216FF9;
			padding-bottom: 3rpx;
		}

		.info {
			margin-left: 20rpx;
		}

		.text {
			font-weight: 400;
			font-size: 27rpx;
			color: #333333;
			line-height: 38rpx;
		}
	}

	.detail_info {
		text {
			font-weight: 400;
			font-size: 27rpx;
			color: #333333;
			line-height: 42rpx;
		}
	}

	.form_modal {
		padding: 23rpx 38rpx 77rpx 38rpx;
		border-radius: 35rpx 35rpx 0rpx 0rpx;
		background: linear-gradient(180deg, #CEDFFF 0%, #FFFFFF 20%);

		.btns {
			.btn {
				width: 308rpx;
				height: 81rpx;
				text-align: center;
				line-height: 81rpx;
				background: #F7F7F7;
				border-radius: 15rpx;
				font-weight: 400;
				font-size: 29rpx;
				color: #1F1F1F;

				&.confirm {
					background: #216FF9;
					color: #FFFFFF;
				}
			}
		}

		.title {
			font-weight: 600;
			font-size: 35rpx;
			color: #161616;
		}

		.form {
			margin: 25rpx 0 58rpx 0;

			.line {
				height: 96rpx;
				border-radius: 15rpx;
				border: 2rpx solid #DCE7FF;
				margin-bottom: 19rpx;
				padding: 0 20rpx;
				box-sizing: border-box;
				position: relative;

				.tit {
					line-height: 96rpx;
					font-weight: 400;
					font-size: 27rpx;
					color: #686868;
					width: 120rpx;
					flex-shrink: 0;
				}

				input,
				.text_wrap {
					width: calc(100% - 120rpx);
					text-align: center;
					font-weight: 600;
					font-size: 27rpx;
					color: #333333;
				}

				.radio_item {
					image {
						margin-right: 8rpx;
					}
				}

				&:last-child {
					margin-bottom: 0;
				}
			}
		}
	}

	.modal_wrap {
		background: linear-gradient(225deg, #A6D0FB 0%, rgba(230, 242, 254, 0.6) 23%, #FFFFFF 65%, #EDF4FF 86%, #C4D9F7 100%);
		border-radius: 44rpx;
		width: 100%;
		padding: 57rpx 60rpx 76rpx 60rpx;
		box-sizing: border-box;

		.modal_title {
			text-align: center;
			font-weight: 600;
			font-size: 44rpx;
			margin-bottom: 10rpx;
			line-height: 69rpx;
			color: #333333;
		}

		.modal_content {
			font-weight: 600;
			font-size: 29rpx;
			color: #333333;
			text-align: center;
			line-height: 44rpx;

			image {
				width: 55%;
			}
		}

		.modal_btns {
			margin-top: 20rpx;
			text-align: center;

			.modal_btn {
				display: inline-block;
				width: 192rpx;
				height: 85rpx;
				line-height: 85rpx;
				text-align: center;
				font-weight: 600;
				font-size: 29rpx;
				border-radius: 15rpx;
				box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0, 0, 0, 0.15);
				border: 2rpx solid #216FF9;

				&.modal_cancel {
					background: #FFFFFF;
					color: #216FF9;
				}

				&.modal_confirm {
					background: #216FF9;
					color: #fff;
					margin-left: 40rpx;
				}
			}
		}
	}

	.share_btn {
		line-height: 1;
		background: transparent;
		margin-left: 0;
		margin-right: 0;

		&.get_number {
			padding: 12rpx 23rpx;
			background: #F3F3F3;
			border-radius: 40rpx;
			position: absolute;
			top: 50%;
			right: 20rpx;
			transform: translateY(-50%);
			z-index: 99;

			.text {
				color: #7D7D7D;
			}
		}

		&::after {
			display: none;
		}

		.text {
			font-weight: 400;
			font-size: 27rpx;
			color: #333333;
		}
	}

	.fixed_area {
		z-index: 99;
		width: 100%;
		padding: 20rpx 28rpx;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 0;
		background: #FFFFFF;



		.btn {
			width: 192rpx;
			height: 71rpx;
			line-height: 71rpx;
			text-align: center;
			background: #216FF9;
			box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0, 0, 0, 0.15);
			border-radius: 15rpx;
			font-weight: 600;
			font-size: 29rpx;
			color: #FFFFFF;
			margin-left: 28rpx;
			flex-shrink: 0;

			image {
				margin-right: 8rpx;
			}
		}
	}

	.cont {
		background: #F5F6FA;
		padding: 28rpx 28rpx 160rpx 28rpx;
		box-sizing: border-box;

		.box {
			background: #FFFFFF;
			border-radius: 15rpx;
			margin-bottom: 28rpx;
			padding: 28rpx 23rpx;

			.title {
				font-weight: 600;
				font-size: 42rpx;
				color: #131313;
				margin-bottom: 16rpx;
				display: -webkit-box;
				display: box;
				/* 兼容其他浏览器 */
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				/* 限制文本显示为两行 */
				overflow: hidden;

				&.sub_title {
					font-size: 30rpx;
				}
			}

			.tips {
				padding: 12rpx 22rpx;
				background: #F6F6F6;
				border-radius: 6rpx;
				box-sizing: border-box;
				font-weight: 400;
				font-size: 23rpx;
				color: #5E5E5E;
				line-height: 42rpx;
			}

			.detail_tit {
				margin-bottom: 28rpx;



				.text {
					font-weight: 400;
					font-size: 27rpx;
					color: #333333;
					display: -webkit-box;
					display: box;
					/* 兼容其他浏览器 */
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					/* 限制文本显示为两行 */
					overflow: hidden;
				}
			}

			.salary {
				font-weight: 600;
				font-size: 38rpx;
				color: #EA9900;
				line-height: 54rpx;
				margin-bottom: 8rpx;
			}

			.location {
				.text {
					font-weight: 400;
					font-size: 27rpx;
					color: #333333;
					margin-left: 6rpx;
				}
			}

			.labels {
				flex-wrap: wrap;

				.label {
					height: 48rpx;
					line-height: 48rpx;
					padding: 0 12rpx;
					background: #F6F6F6;
					border-radius: 6rpx;
					font-size: 24rpx;
					color: #5E5E5E;
					margin-right: 16rpx;
					white-space: nowrap;
					margin-top: 16rpx;

					&.active {
						background: #E5EEFF;
						color: #216FF9;
					}
				}
			}
		}
	}
</style>