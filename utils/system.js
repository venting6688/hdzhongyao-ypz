const SYSTEM_INFO = uni.getSystemInfoSync();

export const getStatusBarHeight = ()=> SYSTEM_INFO.statusBarHeight || 15;

export const getTitleBarHeight= () => {
	if (uni.getMenuButtonBoundingClientRect) {
		let {top, height} = uni.getMenuButtonBoundingClientRect();
		return height + (top - getStatusBarHeight()) * 2;
	} else {
		return 40
	}
}

export const getNavBarHeight= () => getStatusBarHeight() + getTitleBarHeight()
// 二进制转为base64
export function handleBinaryImage(arrayBuffer) {
  // 转换为base64
  const base64 = uni.arrayBufferToBase64(arrayBuffer)
  return `data:image/png;base64,${base64}`;
}


