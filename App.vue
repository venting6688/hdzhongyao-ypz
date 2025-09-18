<script>
	export default {
		onLaunch: function() {
			let loginData = uni.getStorageSync("loginData");
			
			if (JSON.stringify(loginData) != '{}' && loginData.defaultArchives) {
				setTimeout(() => {
					uni.reLaunch({ url: '/pages/more/index' });
				}, 100);
			} 
			if (loginData.phoneNum != undefined && !loginData.defaultArchives) {
				setTimeout(() => {
					uni.reLaunch({ url: '/sub_packages/family/familyManage' });
				}, 100);
			}
		},
		onShow: function() {
			console.log('App Show')
			  wx.hideTabBar();
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>


<style>
	@import "@/colorui/main.css";
	@import "@/colorui/animation.css";
	@import "@/colorui/icon.css";
	@import "@/static/css/index-app.css";
	page{ height: 100%}
</style>



