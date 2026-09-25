import { vouchers } from "../../../../src/index.js";
// import { saveOutput } from "../../common/index.js";

const vouchersData = await vouchers.purchases.all("mani9");
// saveOutput({ callerFile: import.meta.url, inData: vouchersData });
console.log("vouchersData", vouchersData.length);
console.log("vouchersData[0]", vouchersData[0]);
