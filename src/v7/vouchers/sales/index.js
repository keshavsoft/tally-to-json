import tdlMessage from "../../tdlMessage.json" with { type: "json" };
import { createVoucherApi } from "../../createApi.js";

const { period, all } = createVoucherApi(tdlMessage.vouchers.sales);

export { period, all };
export default { period, all };
