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
  return `data:image/png;base64,${base64}`
}

// 计算年龄
export function getAge(birthday) {
  const birthDate = new Date(birthday)
  let year = birthDate.getFullYear()
  let month = birthDate.getMonth() + 1
  let day = birthDate.getDate()
  let today = new Date()
  let age = today.getFullYear() - parseInt(year)
  if (
    today.getMonth() + 1 < parseInt(month) ||
    (today.getMonth() + 1 == parseInt(month) && today.getDate() < parseInt(day))
  ) {
    age--
  }
  return age
}


