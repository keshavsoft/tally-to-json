import { vouchers } from "../../../../src/index.js";
import { saveOutput } from "../../common/index.js";

const vouchersData = await vouchers.purchases.period.selected("mani9", "1-Apr-2026", "10-Apr-2026");

saveOutput({ callerFile: import.meta.url, inData: vouchersData });
console.log("vouchersData count:", vouchersData.length);
console.log("vouchersData[0]:", vouchersData[0]);
