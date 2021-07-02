import ExportJsonExcel from 'js-export-excel';

//防抖函数
function debounce(func, wait, immediate) {
	let timeout, args, context, timestamp, result;

	const later = function () {
		// 据上一次触发时间间隔
		const last = +new Date() - timestamp;

		// 上次被包装函数被调用时间间隔last小于设定时间间隔wait
		if (last < wait && last > 0) {
			timeout = setTimeout(later, wait - last);
		} else {
			timeout = null;
			// 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
			if (!immediate) {
				result = func.apply(context, args);
				if (!timeout) context = args = null;
			}
		}
	};

	return function (...args) {
		context = this;
		timestamp = +new Date();
		const callNow = immediate && !timeout;
		// 如果延时不存在，重新设定延时
		if (!timeout) timeout = setTimeout(later, wait);
		if (callNow) {
			result = func.apply(context, args);
			context = args = null;
		}

		return result;
	};
}

// 数组去重
const unique = arr => {
	const res = [];
	const json = {};
	for (let i = 0; i < arr.length; i++) {
		if (!json[arr[i]]) {
			res.push(arr[i]);
			json[arr[i]] = 1;
		}
	}
	return res;
};
//下载excl文件
const downloadFileToExcel = (dataSourse, headerFont, tableHeader) => {
	console.log();

	let dataTable = [];  //excel文件中的数据内容
	let option = {};  //option代表的就是excel文件
	dataTable = dataSourse;  //从props中获取数据源
	option.fileName = '下载文档';  //excel文件名称
	option.datas = [
		{
			sheetData: dataTable,  //excel文件中的数据源
			sheetName: '安全组',  //excel文件中sheet页名称
			sheetFilter: tableHeader,  //excel文件中需显示的列数据
			sheetHeader: headerFont,  //excel文件中每列的表头名称
		}
	]
	let toExcel = new ExportJsonExcel(option);  //生成excel文件
	toExcel.saveExcel();  //下载excel文件
}
export { unique, debounce, downloadFileToExcel };
