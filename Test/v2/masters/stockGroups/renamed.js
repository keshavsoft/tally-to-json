import { masters } from "../../../../src/index.js";

const uom = await masters.stockGroups.renamed("mani9");
console.log("company", JSON.stringify(uom, null, 2));

// copyToClipboard(JSON.stringify(uom));
