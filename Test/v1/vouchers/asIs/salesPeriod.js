import { vouchers } from "../../../../src/index.js";
import { saveOutput } from "../../common/index.js";

const vouchersData = await vouchers.sales.period("mani9", "1-Apr-2026", "1-Sep-2026");
saveOutput({ callerFile: import.meta.url, inData: vouchersData });
// console.log("vouchersData", JSON.stringify(vouchersData, null, 2));
console.log("vouchersData", vouchersData);
