import { masters } from "../../../../../src/index.js";
import saveOutput from "../../../../saveToFile.js";

const result = await masters.Ledger.withDetails.renamed("mani9");
console.log("Ledger withDetails renamed count:", Array.isArray(result) ? result.length : typeof result);

saveOutput({
    callerFile: import.meta.url,
    inData: result
});
