import { vouchers } from "../../../../src/index.js";

const vouchersData = await vouchers.sales.period.selected("mani9", "1-Apr-2026", "1-Apr-2026");
console.log("vouchersData", vouchersData.length);
console.log("vouchersData", vouchersData[0]);
