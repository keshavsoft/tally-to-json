import { vouchers } from "../../../../src/index.js";
import saveOutput from "../../../saveToFile.js";

const vouchersData = await vouchers.sales.period.asIs("mani9", "1-Apr-2026", "1-Apr-2026");
console.log("vouchersData asIs count:", Array.isArray(vouchersData) ? vouchersData.length : typeof vouchersData);

saveOutput({
    callerFile: import.meta.url,
    inData: vouchersData
});
