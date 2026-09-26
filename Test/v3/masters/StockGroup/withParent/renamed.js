import { masters } from "../../../../../src/index.js";
import saveOutput from "../../../../saveToFile.js";

const result = await masters.StockGroup.withParent.renamed("mani9");
console.log("StockGroup withParent renamed count:", Array.isArray(result) ? result.length : typeof result);

saveOutput({
    callerFile: import.meta.url,
    inData: result
});
