import purchasesSelect from "../vouchers/purchases/select.json" with { type: "json" };
import purchasesNormalize from "../vouchers/purchases/nomalize.json" with { type: "json" };
import salesSelect from "../vouchers/sales/select.json" with { type: "json" };

const schemas = {
    vouchers: {
        purchases: {
            select: purchasesSelect,
            normalize: purchasesNormalize
        },
        sales: {
            select: salesSelect
        }
    },
    masters: {}
};

export { schemas };
export default schemas;
