export default {
	workerStatus: [{
			value: "hired",
			text: "已入职",
			icon: "/broker/ic_entry.png"
		},
		{
			value: "resigned",
			text: "已离职",
			icon: "/broker/ic_depart.png"
		}
	],
	txStatus: [{
			value: "",
			text: "全部提现状态"
		}, {
			value: "pending",
			text: "提现中"
		},
		{
			value: "success",
			text: "提现成功"
		},
		{
			value: "failed",
			text: "提现失败"
		}
	],
	periodList: [{
			value: "hourly",
			text: "/时"
		},
		{
			value: "daily",
			text: "/天"
		},
		{
			value: "weekly",
			text: "/周"
		},
		{
			value: "monthly",
			text: "/月"
		},
	],
	paySalaryPeriod: [{
			value: "daily",
			text: "按天"
		},
		{
			value: "weekly",
			text: "按周"
		},
		{
			value: "monthly",
			text: "按月"
		}
	],
	paySalaryWeekly: [{
			value: "0",
			text: "星期天"
		},
		{
			value: "1",
			text: "星期一"
		},
		{
			value: "2",
			text: "星期二"
		},
		{
			value: "3",
			text: "星期三"
		},
		{
			value: "4",
			text: "星期四"
		},
		{
			value: "5",
			text: "星期五"
		},
		{
			value: "6",
			text: "星期六"
		}
	],
	requireStatus: [{
			value: "all",
			text: "全部"
		},
		{
			value: "requirement_created",
			text: "进行中"
		},
		{
			value: "requirement_finished",
			text: "已关闭"
		}
	]
}