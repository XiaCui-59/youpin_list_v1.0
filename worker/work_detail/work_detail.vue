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
		<view class="cont" :style="{marginTop:marginTop+tabMargin/2+'px'}">
			<view class="box">
				<view class="title">眉山职业学院大学辅导员备份眉山职业学院大学辅导员备份眉山职业学院大学辅导员备份</view>
				<!-- <view class="salary">
					{{(item.min_salary== item.max_salary?item.max_salary:(item.min_salary+"-"+item.max_salary))+"元"+period.filter(el=>{return el.value==item.salary_type})[0].text}}
				</view> -->
				<view class="salary">5000-7000元/月</view>
				<view class="location flex">
					<u-icon name="map-fill" color="#BEBEBE" size="14"></u-icon>
					<view class="text">成都市武侯区</view>
				</view>
				<view class="labels flex" v-if="item.highlight && item.highlight.length != 0">
					<view class="label flex" v-for="(label,labIndex) in item.highlight" :key="labIndex">
						{{label}}
					</view>
				</view>
			</view>
			<view class="box">
				<view class="sub_title title">职位详情</view>
			</view>
		</view>
	</view>
</template>

<script>
	import commonData from "@/common/commonData"
	import {
		mapState,
		mapMutations
	} from "vuex"
	const app = getApp()
	export default {
		data() {
			return {
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

				}
			}
		},
		components: {},
		computed: {
			...mapState(["employerInfo", "nameShow", "loginStatus", "workType"])
		},
		onLoad(param) {
			this.id = param.id
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
		methods: {}
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
	}

	.cont {
		background: #F5F6FA;
		padding: 28rpx;

		.box {
			background: #FFFFFF;
			border-radius: 15rpx;
			margin-bottom: 28rpx;
			padding: 28rpx 23rpx;

			.title {
				font-weight: 600;
				font-size: 38rpx;
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