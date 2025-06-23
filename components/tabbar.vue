<template>
	<view class="tabbar">
		<view class="tabbar-item" v-for="(item,index) in list" :key="index" @click="changeTab(index)"
			:style="{height:height+'px',paddingTop:paddingTop+'px',paddingBottom:paddingTop+'px'}">
			<image class="img active" :src="item.selectedIconPath" v-if="current == index"
				:style="{height:seleIcHeight+'px',top:seleTop+'px',width:'auto'}" mode="heightFix"></image>
			<image class="img" :src="item.iconPath" v-else
				:style="{height:icHeight+'px',top:paddingTop+'px',width:'auto'}" mode="heightFix"></image>
			<view class="text active" v-if="current == index"
				:style="{marginTop:marginTop+'px',height:textHeight+'px'}">{{item.text}}</view>
			<view class="text" v-else :style="{marginTop:marginTop+'px',height:textHeight+'px'}">{{item.text}}</view>
			<!-- 消息角标 -->
			<view class="badge" v-if="(index == 1) && (todo > 0)" :class="current == index?'active':''">{{todo}}</view>
		</view>
		<view class="pub" :style="{bottom:height+icHeight+'px'}"
			v-if="(!employerInfo.wechat_official_account_subscribed) && (loginStatus == 'in')" @click="showPub">
			<view class="img_wrap">
				<image :src="imgUrl+'/broker/v2/ic_wechat_y.png'" mode="widthFix"></image>
			</view>

			<text>公众号</text>
		</view>
		<booking ref="book"></booking>
		<!-- <customModal :title="modalTitle" :content="modalContent" :bgUrl="modalBg" :iconUrl="modalIcon"
			:imageUrl="imageUrl" :iconPosition="iconPosition" v-if="showModal" :showCancel="showCancel"
			:showConfirm="showConfirm" @confirm="handleConfirm" @cancel="handleCancel" @closeModal="closeModal">
		</customModal> -->
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex"
	import booking from "./showBooking.vue"
	const app = getApp()
	export default {
		name: "tabbar",
		props: {
			current: Number,
			todo: Number
		},
		data() {
			return {
				modalTitle: "提示",
				modalContent: "",
				iconPosition: "right",
				modalBg: "/broker/modal_bg.png",
				modalIcon: "/broker/modal_icon.png",
				iconPosition: "right",
				showCancel: true,
				showConfirm: true,
				imageUrl: "",
				imgUrl: app.globalData.baseImageUrl,
				height: 0,
				seleIcHeight: 0,
				icHeight: 0,
				paddingTop: 0,
				marginTop: 0,
				seleTop: 0,
				textHeight: 0,
				timer: null,
				showModal: false,
				showPubTabbar: false,
				timer: null,
				list: [{
						"pagePath": "pages/employer_index/employer_index",
						"text": "需求",
						"iconPath": app.globalData.baseImageUrl + "/broker/icon_pro.png",
						"selectedIconPath": app.globalData.baseImageUrl + "/broker/icon_pro_sele.png"
					},
					{
						"pagePath": "pages/employer_sign/employer_sign",
						"text": "报名",
						"iconPath": app.globalData.baseImageUrl + "/broker/icon_message.png",
						"selectedIconPath": app.globalData.baseImageUrl + "/broker/icon_message_sele.png"
					},
					{
						"pagePath": "pages/employer_mine/employer_mine",
						"text": "我的",
						"iconPath": app.globalData.baseImageUrl + "/broker/icon_mine.png",
						"selectedIconPath": app.globalData.baseImageUrl + "/broker/icon_mine_sele.png"
					}
				]
			}
		},
		// beforeCreate(){
		// 	this.$request("/broker/mini/info").then(res => {
		// 		if (res.code == 0) {
		// 			console.log(123)
		// 		}
		// 	})
		// },
		created() {
			console.log("tabbar islogin", this.isLogin())
			if (this.isLogin()) {
				this.$store.dispatch('getEmployerInfo');
			}
			let _this = this
			uni.hideTabBar()
			// 系统信息
			let systemInfo = uni.getSystemInfoSync()
			// 设计稿tabbar占比
			let percent = 66 / 844
			// 选中icon占tabbar的比例
			let icPercent = 40 / 66
			// 未选中icon占tabbar的比例
			let icPer = 22 / 66
			// 上边距占tabar的比例
			let paddingPer = 8 / 66
			this.height = Math.floor(percent * systemInfo.screenHeight)
			this.seleIcHeight = Math.floor(this.height * icPercent)
			this.icHeight = Math.floor(this.height * icPer)
			this.paddingTop = Math.floor(this.height * paddingPer)
			this.marginTop = this.icHeight + this.paddingTop
			this.seleTop = this.marginTop - this.seleIcHeight
			this.$emit("getTabbarHeight", this.height)
			console.log(this.height, this.seleIcHeight, this.icHeight)
		},
		components: {
			booking
		},
		computed: {
			...mapState(["employerInfo", "loginStatus"])
		},
		methods: {
			hasChange(count) {
				console.log(count, '改变了')
			},
			changeTab(e) {
				uni.switchTab({
					url: '/' + this.list[e].pagePath,
				})
			},
			closeModal() {
				this.showModal = false
			},
			showPub() {
				this.$refs.book.getCode()
				// this.$request("/broker/mini/wechat/official-account/subscribe-qrcode").then(res => {
				// 	if (res.code == 0) {
				// 		this.showModal = true
				// 		this.modalBg = "/broker/modal_bg_2.png"
				// 		this.modalIcon = "/broker/modal_icon_2.png"
				// 		this.iconPosition = "left"
				// 		this.showCancel = false
				// 		this.showConfirm = false
				// 		this.modalTitle = "长按关注公众号"
				// 		this.imageUrl = res.data.qrcode
				// 	}
				// })
			},
		}
	}
</script>

<style scoped>
	image {
		will-change: transform
	}

	.pub {
		position: fixed;
		text-align: center;
		font-weight: 400;
		font-size: 23rpx;
		color: #333333;
		z-index: 9;
		right: 0rpx;
		transform: translateX(-50%);
	}

	.pub .img_wrap {
		width: 96rpx;
		height: 96rpx;
		border-radius: 50%;
		background: rgba(255, 238, 186, 0.8);
		box-shadow: 0rpx 2rpx 6rpx 0rpx rgba(0, 0, 0, 0.2);
		font-size: 0;
		position: relative;
	}

	.pub .img_wrap image {
		width: 57rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.tabbar {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 90;
		width: 100%;
		/* height: 92upx; */
		display: flex;
		align-items: center;
		background: #fff;
		justify-content: space-around;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		/* padding: 20rpx 0; */
		box-shadow: 0px -8rpx 12rpx 0px rgba(0, 0, 0, 0.1);
		border-top-left-radius: 28rpx;
		border-top-right-radius: 28rpx;
		box-sizing: border-box;

	}

	,
	.tabbar-item {
		width: 33%;
		padding: 0 40rpx;
		position: relative;
		text-align: center;
		box-sizing: border-box;
	}

	.tabbar-item .badge {
		position: absolute;
		top: 3rpx;
		right: 30rpx;
		z-index: 100;
		background: #ff2c11;
		width: 30rpx;
		height: 30rpx;
		line-height: 30rpx;
		text-align: center;
		border-radius: 50%;
		color: #fff;
		font-size: 24rpx;
	}

	.tabbar-item .badge.active {
		top: -24rpx;
		right: 37rpx;
	}

	.img {
		/* height: 40upx;
    width: 40upx; */
		position: absolute;
		/* bottom:30rpx; */
		left: 50%;
		transform: translateX(-50%);
		will-change: transform;
	}

	/*  .img.active{
	  width:90rpx;
	  height:90rpx;
  } */
	.text {
		font-size: 28upx;
		font-family: PingFang SC-Regular, PingFang SC;
		font-weight: 400;
		color: #333;
		line-height: 27upx;
		/* margin-top:40rpx; */
	}

	.text.active {
		color: #333;
	}
</style>