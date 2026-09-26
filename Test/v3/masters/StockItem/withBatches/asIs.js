import { masters } from "../../../../../src/index.js";
import saveOutput from "../../../../saveToFile.js";

const result = await masters.StockItem.withBatches.asIs("mani9");
console.log("StockItem withBatches asIs count:", Array.isArray(result) ? result.length : typeof result);

saveOutput({
    callerFile: import.meta.url,
    inData: result
});
