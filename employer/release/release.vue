<template>
	<view class="single_page" v-if="ifSingle">
		<image :src="imgUrl+'/worker/single_page.png'" mode="widthFix" style="width: 100%;"></image>
	</view>
	<view class="release" v-else>
		<!-- 自定义导航 -->
		<u-navbar title="发布需求" @rightClick="rightClick" :autoBack="true" bgColor="#F7BC05"
			titleStyle="color:#fff;font-size: 31rpx;">
			<view class="u-nav-slot" slot="left"
				style="width:57rpx;height:57rpx;text-align: center;line-height: 57rpx;border:1px solid #fff;border-radius: 50%;">

				<u-icon name="arrow-left" size="19" color="#fff"
					custom-style="display: inline-block;line-height: 57rpx;margin:0 auto;left:-2rpx;"></u-icon>
			</view>
		</u-navbar>
		<view class="cont" :style="{top:marginTop+tabMargin+'px',height:contHeight+'px'}">
			<view class="cont_head flex flex_around" :style="{height:releTopHead+'px',lineHeight:releTopHead+'px'}">
				<view class="flex">
					<view class="step flex" :class="currentStep==1?'active':''">
						<view class="num">01</view>
						<view class="text">需求内容</view>
					</view>
					<image :src="imgUrl+'/broker/v2/ic_step.png'" mode="widthFix"></image>
					<view class="step flex" :class="currentStep==2?'active':''">
						<view class="num">02</view>
						<view class="text">用工信息</view>
					</view>
				</view>
			</view>
			<view class="cont_mid">
				<view class="box" v-show="currentStep == 1" :style="{paddingTop:tabMargin+'px'}">
					<view class="box_in" :style="{height:boxInHeight+'px',padding:releTitHeight+'px'}">
						<view class="in_item" :style="{marginBottom:releTitHeight+'px'}">
							<view class="in_tit" :style="{height:releTitHeight+'px',marginBottom:tabMargin/2+'px'}">
								<text>*</text>工种类别
							</view>
							<view class="input_wrap" :style="{height:subTabHeight+'px'}">
								<uni-data-picker ref="typePicker" v-model="info.job_type_code" :localdata="workTypeData"
									popup-title="工种类型" @change="changeWorkType" @popupopened="handleOpen"
									@popupclosed="handleClose" :clear-icon="false"></uni-data-picker>
							</view>
						</view>
						<view class="in_item" :style="{marginBottom:releTitHeight+'px'}">
							<view class="in_tit" :style="{height:releTitHeight+'px',marginBottom:tabMargin/2+'px'}">
								<text>*</text>工作地址
							</view>
							<view class="input_wrap"
								:style="{height:subTabHeight+'px',lineHeight:subTabHeight+'px',color:address?'#333':'#888'}"
								@click="openMap">
								{{info.address?info.address:"请点此选择工作地址"}}
								<!-- <input type="text" :style="{height:subTabHeight+'px'}" :value="address"
									:placeholder="addrPlace" /> -->
							</view>
						</view>
						<view class="in_item" :style="{marginBottom:releTitHeight+'px'}">
							<view class="in_tit" :style="{height:releTitHeight+'px',marginBottom:tabMargin/2+'px'}">
								<text>*</text>需求描述
							</view>
							<view class="input_wrap" :style="{height:textareaHeight+'px',padding:0}">
								<textarea v-model="info.description" :style="{height:textareaHeight+'px'}"
									placeholder="请在这里输入您的工作内容以及招聘要求" maxlength="1000" />
							</view>
						</view>
					</view>
					<view class="btn btn_y"
						:style="{height:subTabHeight+'px',lineHeight:subTabHeight+'px',bottom:btnBottom+'px'}"
						@click="changeStep(2)">下一步
					</view>
				</view>
				<view class="box" v-show="currentStep == 2" :style="{paddingTop:tabMargin+'px'}">
					<view class="box_in" :style="{height:boxInHeight+'px',padding:releTitHeight+'px'}">
						<view class="in_item" :style="{marginBottom:releTitHeight+'px'}">
							<view class="in_tit" :style="{height:releTitHeight+'px',marginBottom:tabMargin/2+'px'}">
								<text>*</text>用工人数
							</view>
							<view class="input_wrap" :style="{height:subTabHeight+'px',lineHeight:subTabHeight+'px'}">
								<u--input placeholder="请输入您要招聘的人数" border="none" fontSize="24rpx"
									placeholderStyle="color:#888;" v-model="info.hiring_count" type="number"
									:customStyle="{height:subTabHeight+'px'}"
									@blur="veriNumber('hiring_count','用工人数',info.hiring_count)"></u--input>
								<!-- <input type="text" :style="{height:subTabHeight+'px'}" v-model="hiring_count"
									placeholder="请输入您要招聘的人数" /> -->
								<view class="clear" v-show="info.hiring_count" @click="clear('hiring_count')">
									<image :src="imgUrl+'/broker/ic_circle_ye.png'" mode="widthFix"></image>
								</view>
							</view>
						</view>
						<view class="in_item" :style="{marginBottom:releTitHeight+'px'}">
							<view class="in_tit" :style="{height:releTitHeight+'px',marginBottom:tabMargin/2+'px'}">
								<text>*</text>用工单价
							</view>
							<view class="input_wrap" :style="{height:subTabHeight+'px',lineHeight:subTabHeight+'px'}">
								<u--input placeholder="请输入每个工人的用工单价,并在下方选择单位" border="none" fontSize="24rpx"
									placeholderStyle="color:#888;" v-model="info.employer_settlement_price" type="digit"
									:customStyle="{height:subTabHeight+'px'}"
									@blur="veriNumber('employer_settlement_price','用工单价',info.employer_settlement_price)"></u--input>
								<!-- <input type="text" :style="{height:subTabHeight+'px'}"
									v-model="employer_settlement_price" placeholder="请输入每个工人的用工单价,并在下方选择单位" /> -->
								<view class="clear" v-show="info.employer_settlement_price"
									@click="clear('employer_settlement_price')">
									<image :src="imgUrl+'/broker/ic_circle_ye.png'" mode="widthFix"></image>
								</view>
							</view>
							<view class="input_wrap"
								:style="{height:subTabHeight+'px',lineHeight:subTabHeight+'px',marginTop:tabMargin+'px'}">
								<radio-group class="flex" @change="radioChange">
									<label class="flex flex_around" style="width: 50%;"
										v-for="(item, index) in priceTypeList" :key="item.value">
										<view class="flex">
											<view>
												<radio color="#F7BC05" style="transform:scale(0.8)" :value="item.value"
													:checked="item.value === info.employer_settlement_unit" />
											</view>
											<view>{{item.name}}</view>
										</view>

									</label>
								</radio-group>
								<!-- <u-radio-group v-model="employer_settlement_unit" placement="row" @change="groupChange">
									<u-radio :customStyle="{height:subTabHeight+'px',width:'50%'}" activeColor="#F7BC05"
										labelSize="12" v-for="(item, index) in priceTypeList" :key="index"
										:label="item.name" :name="item.value" @click="radioChange(item)">
									</u-radio>
								</u-radio-group> -->
							</view>
						</view>
						<view class="in_item" :style="{marginBottom:releTitHeight+'px'}">
							<view class="in_tit" :style="{height:releTitHeight+'px',marginBottom:tabMargin/2+'px'}">
								<text>*</text>用工周期
							</view>
							<view class="input_wrap flex flex_around"
								:style="{height:subTabHeight+'px',lineHeight:subTabHeight+'px',color:hiring_start_date?'#333':'#888'}">
								<view class="line" @click="openTime('hiring_start_date')">
									{{info.hiring_start_date?info.hiring_start_date:"开始日期"}}
								</view>
								<view class="line mark">至</view>
								<view class="line" @click="openTime('hiring_end_date')">
									{{info.hiring_end_date?info.hiring_end_date:"结束日期"}}
								</view>
								<u-calendar :show="show" mode="single" :title="timeTitle" :minDate="minDate"
									:monthNum="13" color="#F7BC05" :closeOnClickOverlay="true" @confirm="confirmTime"
									@close="closeTime"></u-calendar>
							</view>
							<view class="in_item_tips" v-if="info.hiring_start_date && info.hiring_end_date"
								:style="{bottom:-releTitHeight+'px'}">
								总计天数：{{getDaysBetweenDates(info.hiring_start_date,info.hiring_end_date)}}
							</view>
						</view>

						<view class="in_item" :style="{marginBottom:releTitHeight+'px'}"
							v-show="info.employer_settlement_unit == 'hourly'">
							<view class="in_tit" :style="{height:releTitHeight+'px',marginBottom:tabMargin/2+'px'}">
								<text>*</text>每日工作时长
							</view>
							<view class="input_wrap" :style="{height:subTabHeight+'px',lineHeight:subTabHeight+'px'}">
								<u--input placeholder="请输入每天工作的时长" border="none" fontSize="24rpx"
									placeholderStyle="color:#888;" v-model="info.daily_work_hours" type="digit"
									:customStyle="{height:subTabHeight+'px'}"
									@blur="veriNumber('daily_work_hours','每日工作时长',info.daily_work_hours)"></u--input>
								<!-- <input type="text" :style="{height:subTabHeight+'px'}" v-model="daily_work_hours"
									placeholder="请输入每天工作的时长" /> -->
								<view class="clear" v-show="info.daily_work_hours" @click="clear('daily_work_hours')">
									<image :src="imgUrl+'/broker/ic_circle_ye.png'" mode="widthFix"></image>
								</view>
							</view>
						</view>
					</view>
					<view class="btn flex flex_btween" :style="{bottom:btnBottom+'px'}">
						<view class="btn_w" :style="{height:subTabHeight+'px',lineHeight:subTabHeight+'px'}"
							@click="changeStep(1)">上一步
						</view>
						<view class="btn_y" :class="btnStatus?'':'grey'"
							:style="{height:subTabHeight+'px',lineHeight:subTabHeight+'px'}" @click="release">发布需求
						</view>
					</view>


				</view>
			</view>

		</view>
		<view class="kefu" v-show="!pickerOpen" :style="{bottom:subTabHeight+2*btnBottom+tabMargin+'px'}"
			@click="openKefu">
			<view class="kefu_in">
				<image :src="imgUrl+'/broker/v2/ic_kefu.png'" mode="widthFix"></image>
				<view>专属顾问</view>
			</view>
		</view>
		<view class="mask" v-if="showMask">
			<view class="inner">
				<view class="close" @click="closeMask">
					<image :src="imgUrl+'/broker/ic_close_circle.png'" mode="widthFix"></image>
				</view>
				<view class="bg_ic">
					<image :src="imgUrl+'/broker/v2/ic_rele_pay_01.png'" mode="widthFix"></image>
				</view>
				<view class="title">费用信息</view>
				<view class="box">
					<view class="line flex">
						<view class="line_tit flex">
							<image :src="imgUrl+'/broker/v2/ic_rele_pay_02.png'" mode="widthFix"></image>
							<text>账户余额</text>
						</view>
						<view class="line_text flex flex_btween">
							<view class="">{{orderInfo.available_amount}}</view>
							<view class="period">元</view>
						</view>
					</view>
					<view class="line flex">
						<view class="line_tit flex">
							<image :src="imgUrl+'/broker/v2/ic_rele_pay_03.png'" mode="widthFix"></image>
							<text>预计费用</text>
						</view>
						<view class="line_text flex flex_btween">
							<view class="">{{orderInfo.need_pay}}</view>
							<view class="period">元</view>
						</view>
					</view>
					<view class="tips">
						<view class="tips_item flex" v-if="employer_settlement_unit == 'daily'">
							<view class="tips_tit">按天计价：</view>
							<view class="tips_text">预收费用=用工人数*用工周期*平台单价</view>
						</view>
						<view class="tips_item flex" v-if="employer_settlement_unit == 'hourly'">
							<view class="tips_tit">按时计价：</view>
							<view class="tips_text">预计费用=用工人数*用工周期*每日工作时长*平台单价</view>
						</view>
					</view>
					<view class="btns">
						<view class="btn btn_y flex" :class="btnStatus2?'':'grey'"
							@click="handleConfirm('create_with_paid')"
							v-if="Number(orderInfo.available_amount) - Number(orderInfo.need_pay) < 0">
							<view class="flex">
								<view class="tit">去充值</view>
								<view class="tips">您当前余额不足，请先充值</view>
							</view>

						</view>
						<view class="btn btn_y flex" :class="btnStatus2?'':'grey'"
							@click="handleConfirm('create_with_paid')"
							v-if="Number(orderInfo.available_amount) - Number(orderInfo.need_pay) >= 0">
							<view class="flex">
								<view class="tit">立即发布（自动扣费）</view>
								<view class="tips">费用将在发布时自动从您的余额中扣除</view>
							</view>

						</view>
						<view class="btn btn_w flex" :class="btnStatus2?'':'grey'"
							@click="handleConfirm('create_first')">
							<view class="flex">
								<view class="tit">立即发布（稍后补缴）</view>
								<view class="tips">您可先发布需求，请稍后尽快补缴</view>
							</view>

						</view>

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
	const app = getApp()

	function getToday() {
		// 获取当前日期
		let currentDate = new Date();
		let year = currentDate.getFullYear()
		let month = fomateNumber(currentDate.getMonth() + 1)
		let day = fomateNumber(currentDate.getDate())
		console.log(year + '-' + month + "-" + day)
		return year + '-' + month + "-" + day
	}

	function fomateNumber(num) {
		if (num < 10) {
			num = "0" + num
		}
		return num
	}
	export default {
		data() {
			return {
				ifSingle: app.globalData.scene == 1154 ? true : false,
				pickerOpen: false,
				id: "",
				typeValue: "CS100002",
				btnStatus2: true,
				btnStatus: true,
				current: 0,
				currentTimeType: "",
				timeTitle: "日期选择",
				minDate: getToday(),
				orderInfo: {
					"available_amount": "",
					"need_pay": ""
				},
				showMask: false,
				imgUrl: app.globalData.baseImageUrl,
				marginTop: app.globalData.marginTop,
				tabMargin: app.globalData.tabMargin,
				releTitHeight: app.globalData.releTitHeight,
				subTabHeight: app.globalData.subTabHeight,
				releTopHead: app.globalData.releTopHead,
				btnBottom: app.globalData.btnBottom,
				textareaHeight: 0,
				boxInHeight: 0,
				currentStep: 1,
				contHeight: 0,
				hiring_count: "",
				employer_settlement_price: "",
				show: false,
				employer_settlement_unit: "hourly",
				daily_work_hours: "",
				priceTypeList: [{
					name: "元/时",
					value: "hourly"
				}, {
					name: "元/天",
					value: "daily"
				}],
				address: "",
				content: "",
				hiring_start_date: "",
				hiring_end_date: "",
				addrPlace: "请选择工作地址",
				workTypeData: [],
				job_type_code: "",
				info: {
					"job_type_code": "",
					"address": "",
					"description": "",
					"hiring_count": "",
					"employer_settlement_price": "",
					"employer_settlement_unit": "hourly",
					"hiring_start_date": "",
					"hiring_end_date": "",
					"daily_work_hours": ""
				},
				requireId: ""
			}
		},
		computed: {
			...mapState(["workType"])
		},
		async onLoad(param) {
			if (!this.isLogin()) {
				uni.switchTab({
					url: "/pages/employer_index/employer_index"
				})
				return
			}
			this.id = param.id ? param.id : ""
			if (this.id) {
				this.info = await this.getInfo()
			}
			// this.$store.dispatch('getWorkType');
			this.formateData()
			uni.setNavigationBarColor({
				frontColor: '#000000',
				backgroundColor: 'transparent'
			})
			this.contHeight = app.globalData.systemHeight - this.marginTop - this.tabMargin
			this.boxInHeight = this.contHeight - this.releTopHead - this.tabMargin - 2 * this.btnBottom - this
				.subTabHeight
			this.textareaHeight = this.boxInHeight - 7 * this.releTitHeight - 2 * this.subTabHeight - 1.5 * this
				.tabMargin
		},
		watch: {
			// workType(newVal) {
			// 	console.log(newVal)

			// }
		},
		methods: {
			getInfo() {
				let _this = this
				return new Promise(resolve => {
					let url = "/employer/jobRequirement/" + _this.id + "/detail"
					this.$request(url).then(res => {
						if (res.code == 0) {
							resolve(res.data)
						}
					})
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
			closeMask() {
				this.showMask = false
			},
			clearType() {
				this.$refs.typePicker.clear()
			},
			radioChange(e) {
				console.log(e)
				this.info.employer_settlement_unit = e.detail.value
				if (e.detail.value == "daily") {
					this.info.daily_work_hours = ""
				}
			},
			handleConfirm(type) {
				let _this = this
				if (type == "create_first") {
					uni.showLoading()
					this.createRequire(type)
				} else {
					if (this.btnStatus2) {
						this.btnStatus2 = false
						if (Number(this.orderInfo.available_amount) - Number(this.orderInfo.need_pay) < 0) {
							uni.navigateTo({
								url: "/employer/recharge/recharge",
								success() {
									console.log("跳转成功")
								},
								fail(err) {
									console.log("err:", err)
								},
								complete() {
									_this.btnStatus2 = true
								}
							})
						} else {
							this.closeMask()
							this.createRequire(type)
						}
					} else {
						uni.showToast({
							title: "请勿重复点击",
							icon: "error"
						})
					}
				}
			},
			createRequire(type) {
				this.info.hiring_count = Number(this.info.hiring_count)
				this.info.daily_work_hours = Number(this.info.daily_work_hours)
				this.info.create_type = type
				this.$request("/employer/createCrowdSourcingJob", this.info, "POST").then(res => {
					this.btnStatus = true
					if (res.code == 0) {
						this.requireId = res.data.id
						uni.redirectTo({
							url: "/employer/release_success/release_success?id=" + this.requireId,
							complete() {
								uni.hideLoading()
							}
						})
					}
				})
			},
			handleOpen() {
				this.pickerOpen = true
			},
			handleClose() {
				this.pickerOpen = false
			},
			veriNumber(str, type, count) {
				console.log(type, count, String(Number(count)) == "NaN")
				if (String(Number(count)) == "NaN") {
					uni.showToast({
						title: "请输入数字",
						icon: "error"
					})
					this.$set(this.info, str, "")
					// this.$data[str] = ""
				} else {
					if (Number(count) <= 0) {
						uni.showToast({
							title: "需大于0",
							icon: "error"
						})
						this.$set(this.info, str, "")
						// this.$data[str] = ""
					} else {
						console.log(type)
						if (str == 'employer_settlement_price' || str == 'daily_work_hours') {
							let countStr = String(count)
							let countStrArr = countStr.split(".")
							let afterLen = 0
							if (countStrArr.length > 1) {
								afterLen = countStrArr[1].length
							}
							if (afterLen > 1) {
								// 只能输入1位小数
								uni.showToast({
									title: "最多1位小数",
									icon: "error"
								})
								this.$set(this.info, str, Number(count).toFixed(1))
							} else {
								this.$set(this.info, str, Number(count))
							}

						}
					}
				}

			},
			formateData() {
				this.workTypeData = this.workType.map(el => {
					if (el.children && el.children.length > 0) {
						let newChildren = el.children.map(inel => {
							return {
								...inel,
								value: inel.value,
								text: inel.label, // 将name属性的值赋给新属性username
								children: inel.children,
								label: undefined
							}
						})
						// 创建一个新对象，其中包含所有属性，但将name属性重命名为username
						return {
							...el, // 展开原对象，复制所有属性
							value: el.value,
							text: el.label, // 将name属性的值赋给新属性username
							children: newChildren,
							label: undefined // 可选：如果你想在原对象上移除旧的name属性，可以将其设置为undefined
						};
					} else {
						// 创建一个新对象，其中包含所有属性，但将name属性重命名为username
						return {
							...el, // 展开原对象，复制所有属性
							value: el.value,
							text: el.label, // 将name属性的值赋给新属性username
							children: el.children,
							label: undefined // 可选：如果你想在原对象上移除旧的name属性，可以将其设置为undefined
						};
					}

				});
				this.workTypeData = this.workTypeData.slice(1)
				console.log("workTypeData：", this.workTypeData)
			},
			getDaysBetweenDates(date1, date2) {
				// 将日期字符串转换为Date对象
				var d1 = new Date(date1);
				var d2 = new Date(date2);

				// 计算两个日期的时间差（毫秒）
				var timeDiff = Math.abs(d2.getTime() - d1.getTime());

				// 计算天数
				var days = Math.ceil(timeDiff / (1000 * 3600 * 24));

				return days + 1;
			},
			veriDate(date1, date2) {
				// 将日期字符串转换为Date对象
				var d1 = new Date(date1);
				var d2 = new Date(date2);

				// 计算两个日期的时间差（毫秒）
				var timeDiff = d2.getTime() - d1.getTime();
				if (timeDiff < 0) {
					uni.showModal({
						title: "用工开始日期不能晚于结束日期"
					})
					return false
				} else {
					return true
				}
			},
			release() {
				for (let key in this.info) {
					if (!this.info[key]) {
						if (key != "daily_work_hours") {
							uni.showModal({
								title: "内容填写不完整，请仔细核对。",
								showCancel: false
							})
							return
						} else {
							if (this.info.employer_settlement_unit != "daily") {
								uni.showModal({
									title: "内容填写不完整，请仔细核对。",
									showCancel: false
								})
								return
							}
						}

					}
				}
				if (!this.veriDate(this.info.hiring_start_date, this.info.hiring_end_date)) {
					return
				}
				if (this.btnStatus) {
					this.btnStatus = false
					this.checkBalance()


				} else {
					uni.showToast({
						title: "请勿重复点击",
						icon: "error"
					})
				}

			},
			checkBalance() {
				let data = {
					"hiring_count": Number(this.info.hiring_count),
					"employer_settlement_price": this.info.employer_settlement_price,
					"employer_settlement_unit": this.info.employer_settlement_unit,
					"hiring_start_date": this.info.hiring_start_date,
					"hiring_end_date": this.info.hiring_end_date,
					"daily_work_hours": Number(this.info.daily_work_hours)
				}
				this.$request("/employer/preCheckBalance", data, "POST").then(res => {
					this.btnStatus = true
					if (res.code == 0) {
						this.showMask = true
						this.orderInfo = res.data
					}
				})
			},
			resetData() {
				this.info = {
					"job_type_code": "",
					"address": "",
					"description": "",
					"hiring_count": "",
					"employer_settlement_price": "",
					"employer_settlement_unit": "",
					"hiring_start_date": "",
					"hiring_end_date": "",
					"daily_work_hours": ""
				}
			},
			changeWorkType(e) {
				console.log(e)
				console.log("job_type_code：", this.info.job_type_code)
				// if (e.detail.value.length > 1) {
				// 	this.job_type_code = e.detail.value[1].value
				// } else {
				// 	this.job_type_code = ""
				// }

			},
			confirmTime(e) {
				this.show = false
				this.pickerOpen = false
				if (this.currentTimeType == "hiring_end_date") {
					this.info.hiring_end_date = e[0]
				} else {
					this.info.hiring_start_date = e[0]
				}
			},
			changeStep(index) {
				if (index == 2) {
					if (!this.info.job_type_code || !this.info.address || !this.info.description) {
						uni.showToast({
							title: "内容填写不完整",
							icon: "error"
						})
						return
					}
				}
				this.currentStep = index
			},
			clear(key) {
				this.$set(this.info, key, "")
				// this.$data[key] = ""
			},
			openTime(type) {
				this.show = true
				this.pickerOpen = true
				this.currentTimeType = type
				if (type == "hiring_end_date") {
					this.timeTitle = "结束日期"
				} else {
					this.timeTitle = "开始日期"
				}
			},
			closeTime() {
				this.show = false
				this.pickerOpen = false
			},
			openMap() {
				let _this = this
				uni.chooseLocation({
					success(res) {
						console.log(res)
						_this.info.address = res.address
						console.log("address：", _this.address)
						console.log('位置名称：' + res.name);
						console.log('详细地址：' + res.address);
						console.log('纬度：' + res.latitude);
						console.log('经度：' + res.longitude);
					},
					fail(err) {
						console.log(err)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.kefu {
		position: fixed;
		right: 0;
		width: 161rpx;
		height: 120rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 2rpx 6rpx 0rpx rgba(0, 0, 0, 0.2);
		border-top-left-radius: 56rpx;
		border-bottom-left-radius: 56rpx;
		z-index: 20;

		.kefu_in {
			position: absolute;
			top: 50%;
			left: 53%;
			transform: translate(-50%, -50%);
			text-align: center;

			image {
				width: 65rpx;
			}

			view {

				font-weight: 400;
				font-size: 23rpx;
				color: #333333;
				white-space: nowrap;
			}
		}
	}

	::v-deep {
		.u-calendar-month__days__day__select__buttom-info {
			bottom: -10px !important;
		}

		.input-value,
		.uni-data-tree,
		.uni-data-tree>view {
			height: 100% !important;
			padding: 0 !important;
		}

		.input-value-border {
			border: none !important;
		}

		.input-arrow {
			border-left: 1px solid $em-base-color !important;
			border-bottom: 1px solid $em-base-color !important;
		}

		.u-radio-group {
			flex: 0 !important;
		}

		.selected-item-active {
			border-bottom: 2px solid $em-base-color !important;
		}

		.check {
			border-color: $em-base-color !important;
		}
	}

	.inner {
		width: calc(100% - 92rpx) !important;
		color: #333;
		padding: 30rpx 38rpx 76rpx 38rpx !important;
		background: linear-gradient(180deg, #FCD1A8 0%, #FFF9F0 20%) !important;
		border-radius: 37rpx;

		.bg_ic {
			font-size: 0;
			position: absolute;
			top: 0;
			right: 0;
			z-index: 99;

			image {
				width: 250rpx;
			}
		}

		.title {
			position: relative;
			z-index: 1000;
			font-weight: 600;
			font-size: 38rpx;
			color: #282319;
			line-height: 54rpx;
			margin-bottom: 55rpx;
			padding-left: 38rpx;
		}

		.box {
			position: relative;
			z-index: 1000;

			.line {
				height: 85rpx;
				line-height: 85rpx;
				margin: 20rpx 0;
				font-size: 29rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 2rpx 6rpx 0rpx rgba(0, 0, 0, 0.1);
				border-radius: 8rpx;
				padding: 0 38rpx 0 23rpx;

				.line_tit {
					width: 50%;

					image {
						width: 38rpx;
						margin-right: 13rpx;
					}

					text {
						font-weight: 400;
						font-size: 27rpx;
						color: #5A5A5A;
					}
				}

				.line_text {
					width: 50%;
					color: #666;

					view:nth-child(1) {
						font-weight: 600;
						font-size: 27rpx;
						color: #333333;
					}

					view:nth-child(2) {
						font-weight: 400;
						font-size: 23rpx;
						color: #A8A8A8;
					}
				}
			}

			.tips {
				font-size: 24rpx;

				.tips_item {
					margin-top: 10rpx;
					align-items: flex-start;

					.tips_tit {
						white-space: nowrap;
					}

					.tips_text {
						font-size: 23rpx;
						color: #DD0000;
					}
				}
			}

			.btn {
				position: relative;
				top: 0;
				bottom: 0;
				left: 0;
				margin-top: 38rpx;
				height: 94rpx;
				// line-height: 76rpx;
				width: 100%;
				flex-direction: column;
				justify-content: space-around;

				&>view {
					flex-direction: column;
				}

				.tips {
					font-weight: 400;
					font-size: 23rpx;
				}
			}
		}
	}

	.release {
		height: 100vh;
		background: #F7F8FA;
		color: $base-fontcolor;

		.btn {
			position: fixed;
			width: calc(100% - 92rpx);
			left: 46rpx;

			.btn_y,
			.btn_w {
				width: 48%;
			}
		}

		.cont {
			position: fixed;
			left: 0;
			width: 100%;
			overflow-y: scroll;

			.cont_mid {
				padding: 0 46rpx;

				.box {
					.box_in {
						box-sizing: border-box;
						background: #FFFFFF;
						box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.15);
						border-radius: 15rpx;

						.in_item {
							position: relative;

							.in_item_tips {
								position: absolute;
								bottom: 0;
								right: 0;
								color: #DB0000;
								font-size: 24rpx;
							}

							.in_tit {
								font-weight: 400;
								font-size: 27rpx;
								color: #5A5A5A;

								text {
									font-weight: 600;
									color: #DB0000;
								}
							}

							.input_wrap {
								background: #F9F9F9;
								border-radius: 8rpx;
								padding: 0 38rpx 0 19rpx;
								font-size: 12px;
								position: relative;
								white-space: nowrap;
								overflow: scroll;

								.clear {
									position: absolute;
									top: 50%;
									right: 0rpx;
									transform: translateY(-50%);
									padding: 30rpx;
									z-index: 99;

									image {
										width: 38rpx;
									}
								}

								// input {
								// 	height: 100%;
								// }

								textarea {
									padding: 23rpx 26rpx 38rpx 19rpx;
									box-sizing: border-box;
									font-weight: 400;
									color: #333;
									line-height: 38rpx;
								}

								.line {
									width: 45%;
									text-align: center;

									&.mark {
										width: 10%;
										color: #777;
									}

								}
							}
						}
					}
				}
			}

			.cont_head {
				background: #FFFFFF;

				.step {
					&.active {
						.num {
							background: $em-base-color;
							color: #fff;
						}

						.text {
							font-weight: 600;
							color: $em-base-color;
						}

					}

					.num {
						width: 50rpx;
						height: 50rpx;
						line-height: 50rpx;
						text-align: center;
						background: rgba(247, 188, 5, .1);
						font-weight: 600;
						font-size: 31rpx;
						color: $em-base-color;
						border-radius: 50%;
						margin-right: 10rpx;
					}

					.text {
						font-weight: 400;
						font-size: 29rpx;
						color: #333333;
					}
				}

				image {
					width: 38rpx;
					margin: 0 67rpx;
				}
			}
		}
	}
</style>