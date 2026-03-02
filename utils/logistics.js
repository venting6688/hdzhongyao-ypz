const OPCODE_MAP = {
  30: "快件在【XXX营业点】已装车,准备发往 【XXX集散中心】",
  31: "快件到达 【XXX集散中心】",
  36: "快件到达 【XXX集散中心】",
  44: "正在派送途中,请您准备签收(派件人:XXX,电话:XXX)",
  43: "顺丰已收件",
  50: "顺丰已收件",
  54: "顺丰已收件",
  130: "便利店交接 快件到达顺丰店/站 %s",
  123: "便利店出仓 快件正送往顺丰店/站 %s",
  607: "代理收件 代理收件",
  80: "已签收,感谢使用顺丰,期待再次为您服务",
  3036: "快件在XXX ,准备送往下一站",
  70: "派送失败 reasonCode为46时 表示取消寄件",
  8000: '在官网"运单资料&签收图",可查看签收人信息',
  33: "派件异常",
  99: "应客户要求,快件正在转寄中",
  648: "快件已退回/转寄,新单号为: XXX",
  204: "快件交给%s，正在派送途中（联系电话：%s）",
  125: "快递员派件至丰巢",
  126: "快递员取消派件将快件取出丰巢"
};
function formatString(template, ...args) {
  let index = 0;
  return template.replace(/%s/g, () => args[index++] ?? "");
}
function getOpcodeDescription(opcode, ...params) {
  const template = OPCODE_MAP[opcode];
  if (!template) return "未知状态";

  if (template.includes("%s")) {
    return formatString(template, ...params);
  }

  return template;
}
export default {
  getOpcodeDescription,
}
