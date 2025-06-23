<template>
	<view class="single_page" v-if="ifSingle">
		<image :src="imgUrl+'/worker/single_page.png'" mode="widthFix" style="width: 100%;"></image>
	</view>
	<view class="content" v-else>
		<customHeader :title="pageName" :showBack="true" bgUrl="/broker/bg_2.png" :headHeight="headerHeight">
		</customHeader>
		<view class="cont" :style="{marginTop:marginTop+'px'}">
			<!-- <view class="top_area" :style="{top:marginTop+'px'}">
				<image :src="imgUrl+'/broker/ic_message_title.png'" mode="widthFix"></image>
				<view class="top flex flex_btween">
					<view class="title flex flex-start">
						<view class="label">公司简介</view>
					</view>
				</view>
			</view> -->
			<view class="box" :style="{top:marginTop+tabMargin+'px'}">
				<image :src="imgUrl+'/broker/ic_message_bg2.png'" mode="widthFix"></image>
				<scroll-view scroll-y="true" class="scroll-Y"
					:style="{height:scrollHeight+'px',paddingTop:2*tabMargin+'px',paddingLeft:2*tabMargin+'px',paddingRight:2*tabMargin+'px',paddingBottom:2*tabMargin+'px',boxSizing:'border-box'}">
					<view class="message_title">关于灵动优聘</view>
					<view class="text">
						灵动优聘是成都灵动世界科技有限公司（北京灵动赛博科技有限公司全资子公司）旗下专业提供人力资源招聘服务的技术型互联网平台。公司致力于以互联网和人工智能技术实现蓝领用工市场的供需匹配，坚持信用、专业、高效的核心价值观，倾力打造可依赖可信任的高技术招聘服务平台。
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import tabbar from "@/components/tabbar.vue"
	import customHeader from "@/components/custom_header.vue"
	const app = getApp()
	export default {
		data() {
			return {
				ifSingle: app.globalData.scene == 1154 ? true : false,
				imgUrl: app.globalData.baseImageUrl,
				pageName: "关于我们",
				marginTop: app.globalData.marginTop,
				tabMargin: app.globalData.tabMargin,
				btnBottom: app.globalData.btnBottom,
				scrollHeight: 0,
				headerHeight: app.globalData.topHeight
			}
		},
		components: {
			tabbar,
			customHeader
		},
		onLoad() {
			let _this = this
			this.scrollHeight = app.globalData.systemHeight - this.marginTop - this.tabMargin - this.btnBottom
		},
		methods: {}
	}
</script>

<style lang="scss" scoped>
	.content {
		height: 100vh;
		background: #f3f3f5;
	}

	.box {
		position: fixed;
		width: calc(100% - 96rpx);
		left: 48rpx;
		z-index: 99;
		border-radius: 16rpx;
		// border-top-right-radius: 16rpx;
		overflow: hidden;
		background: #fff;
		box-sizing: border-box;
		box-shadow: 0 2rpx 6rpx 0 rgba(0, 0, 0, 0.15);

		&>image {
			position: absolute;
			width: 100%;
			left: 0;
			top: 10%;
		}

		.message_title {
			font-size: 34rpx;
			font-weight: bold;
		}

		.text {
			text-indent: 2em;
			font-size: 28rpx;
			color: #5A5A5A;
			line-height: 56rpx;
			margin-top: 30rpx;
		}
	}
</style>