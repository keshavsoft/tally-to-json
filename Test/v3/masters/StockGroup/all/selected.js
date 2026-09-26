import { masters } from "../../../../../src/index.js";
import saveOutput from "../../../../saveToFile.js";

const result = await masters.StockGroup.all.selected("mani9");
console.log("StockGroup all selected count:", Array.isArray(result) ? result.length : typeof result);

saveOutput({
    callerFile: import.meta.url,
    inData: result
});
