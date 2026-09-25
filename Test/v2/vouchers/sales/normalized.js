import { vouchers } from "../../../../src/index.js";

const vouchersData = await vouchers.sales.period.normalized("mani9", "1-Apr-2026", "1-Apr-2026");
console.log("vouchersData count:", vouchersData.length);
console.log("vouchersData[0]:", JSON.stringify(vouchersData[0], null, 2));
