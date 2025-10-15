// <script>
// 	export default {
// 		onLaunch: function() {
// 			let loginData = uni.getStorageSync("loginData");
			
// 			if (JSON.stringify(loginData) != '{}' && loginData.defaultArchives) {
// 				setTimeout(() => {
// 					uni.reLaunch({ url: '/pages/user/index' });
// 				}, 100);
// 			}
// 			if (loginData.phoneNum != undefined && !loginData.defaultArchives) {
// 				setTimeout(() => {
// 					uni.reLaunch({ url: '/sub_packages_healthcard/family/familyManage' });
// 				}, 100);
// 			}
// 		},
// 	}
// </script>


<style>
	@import "@/colorui/main.css";
	@import "@/colorui/animation.css";
	@import "@/colorui/icon.css";
	@import "@/static/css/index-app.css";
	@import "@/colorui/common-style.scss";
	page{ height: 100%}
	
</style>



