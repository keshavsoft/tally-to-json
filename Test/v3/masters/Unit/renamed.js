import { masters } from "../../../../src/index.js";
import saveOutput from "../../../saveToFile.js";

const result = await masters.Unit.renamed("mani9");
console.log("Unit renamed count:", Array.isArray(result) ? result.length : typeof result);

saveOutput({
    callerFile: import.meta.url,
    inData: result
});
