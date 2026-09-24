import { masters } from "../../../src/index.js";

const uom = await masters.get("mani9", "uom");
console.log("company", JSON.stringify(uom, null, 2));

// copyToClipboard(JSON.stringify(uom));
