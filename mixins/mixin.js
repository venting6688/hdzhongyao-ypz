export default {
	
    methods: {
		// 节流
		throttle(fn, interval) {
		    let lastTime = 0
		    return function (...args) {
		        const nowTime = +new Date()
		        const remainTime = nowTime - lastTime
		        if (remainTime >= interval) {
		            fn.apply(this, args)
		            lastTime = nowTime
		        }
		    }
		},
		convertString(str) {
		    if (/^[+-]?\d+$/.test(str)) {
		        return parseFloat(str).toFixed(2);
		    } else {
		        return str;
		    }
		},
		// 根据身份证计算年龄
		calculateAge(idCard) {
		    if (idCard.length === 18) {
		        const birthYear = parseInt(idCard.slice(6, 10), 10);
		        const birthMonth = parseInt(idCard.slice(10, 12), 10);
		        const birthDay = parseInt(idCard.slice(12, 14), 10);
		    		
		        const now = new Date();
		        const currentYear = now.getFullYear();
		        const currentMonth = now.getMonth() + 1;
		        const currentDay = now.getDate();
		    		
		        let age = currentYear - birthYear;
		        // 如果当前月份小于出生月份，或者当前月份等于出生月份但当前日期小于出生日期，年龄减 1
		        if (
		            currentMonth < birthMonth ||
		            (currentMonth === birthMonth && currentDay < birthDay)
		        ) {
		            age--;
		        }
		        return age;
		    } else {
		        return null;
		    }
		},
		// 获取近一周的时间
		getWeek(type) { 
		    const now = new Date();
		    const year = now.getFullYear();
		    const month = now.getMonth() + 1;
		    const day = now.getDate();
		    let dateRange = {};
		    let startDate;
		    let endDate;
		    const oneDayMs = 24 * 60 * 60 * 1000; 
		    if (type === '上一周') {
		        const sevenDaysAgo = now.getTime() - 7 * oneDayMs;
		        startDate = new Date(sevenDaysAgo);
		        endDate = new Date(now.getTime());
		    } else if (type === '下一周') {
		        startDate = new Date(now.getTime());
		        endDate = new Date(now.getTime() + 7 * oneDayMs);
		    }
		    const startYear = startDate.getFullYear();
		    const startMonth = startDate.getMonth() + 1;
		    const startDay = startDate.getDate();
		    dateRange.startDate = `${startYear}-${this.padDate(startMonth)}-${this.padDate(startDay)}`;
		    const endYear = endDate.getFullYear();
		    const endMonth = endDate.getMonth() + 1;
		    const endDay = endDate.getDate();
		    dateRange.endDate = `${endYear}-${this.padDate(endMonth)}-${this.padDate(endDay)}`;
		    return dateRange;
		},
		padDate(value) {
		    return value < 10 ? '0' + value : value
		},
        pixelateNumber(value) {
            if (value) {
                // 判断括号
                if (value.length > 6) {
                    return `${value[0]}${value[1]}${value[2]}***${value[value.length - 3]}${value[value.length - 2]}${value[value.length - 1]}`
                }
            } else {
                return value
            }
        },
        pixelate(value) {
            if (value) {
                // 判断括号
                let bracket = ''
                if (value.search(/\( | （/)) {
                    let result = /[(,（].*[),）]/.exec(value)
                    if (result) bracket = result[0]
                    value = value.replace(/[(,（].*[),）]/, '')
                }
                if (value.length === 2) {
                    return `${value[0]}*${bracket}`
                }
                if (value.length > 2) {
                    return `${value[0]}*${value[value.length - 1]} ${bracket}`
                }
            } else {
                return value
            }
        },
				getDate(type) { //年月日
				    const date = new Date();
				    let year = date.getFullYear();
				    let month = date.getMonth() + 1;
				    let day = date.getDate();
				    			
				    if (type === 'start') {
				        year = year - 100;
				    } else if (type === 'end') {
				        year = year;
				    }
				    month = month > 9 ? month : '0' + month;
				    day = day > 9 ? day : '0' + day;
				    return `${year}-${month}-${day}`;
				},
    },
}
