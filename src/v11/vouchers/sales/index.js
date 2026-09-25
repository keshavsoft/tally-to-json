import { vouchers } from "tally-xml-tdl";
import { createVoucherApi } from "../../createApi.js";
import selectJson from "./select.json" with { type: "json" };
import renameJson from "./rename.json" with { type: "json" };
import normalizeJson from "./normalize.json" with { type: "json" };

const { period, all } = createVoucherApi(vouchers.sales, {
    selectJson,
    renameJson,
    normalizeJson
});

export { period, all };
export default { period, all };
