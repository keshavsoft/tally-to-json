import { vouchers } from "tally-xml-tdl";
import { createVoucherApi } from "../../createApi.js";
import selectJson from "./select.json" with { type: "json" };

const { period, all } = createVoucherApi(vouchers.sales, selectJson);

export { period, all };
export default { period, all };
