import { masters } from "../../../../src/index.js";

const uom = await masters.ledgerNamesWithDetails.selected("mani9");
console.log("company", JSON.stringify(uom, null, 2));

// copyToClipboard(JSON.stringify(uom));
