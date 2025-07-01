<template>
	<view class="kefu">
		<!-- 自定义导航栏 -->
		<u-navbar @leftClick="leftClick" bgColor="transparent" titleStyle="color:#010101;font-size: 31rpx;">
			<view class="u-nav-slot" slot="left"
				style="width:57rpx;height:57rpx;text-align: center;line-height: 57rpx;border:1px solid #C5C6CB;border-radius: 50%;">

				<u-icon name="arrow-left" size="19" color="#4E4E52"
					custom-style="display: inline-block;line-height: 57rpx;margin:0 auto;left:-2rpx;"></u-icon>
			</view>
		</u-navbar>
		<image :src="imgUrl+'/worker/v_list/page_kefu.png'" mode="widthFix" :show-menu-by-longpress="true"></image>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				imgUrl: app.globalData.baseImageUrl,
			}
		},
		onLoad() {
			uni.hideShareMenu()
		},
		methods: {
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
		}
	}
</script>

<style lang="scss">
	.kefu {
		font-size: 0;

		image {
			width: 100%;
		}
	}
</style>