import { vouchers } from "../../../../src/index.js";

const vouchersData = await vouchers.purchases.period("mani9", "10-Apr-2026", "10-Apr-2026");
console.log("vouchersData", vouchersData[0]);
