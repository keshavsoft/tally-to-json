import { masters } from "../../../../src/index.js";
import saveOutput from "../../../saveToFile.js";

const result = await masters.Unit.cleaned("mani9");
console.log("Unit cleaned count:", Array.isArray(result) ? result.length : typeof result);

saveOutput({
    callerFile: import.meta.url,
    inData: result
});
