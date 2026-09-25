import { vouchers } from "tally-to-xml-tdl";

const period = async (company, fromDate, toDate) => {
    const jsonToReturn = await vouchers.sales.period(company, fromDate, toDate);

    return jsonToReturn;
};

const all = async (company) => {
    const jsonToReturn = await vouchers.sales.all(company);

    return jsonToReturn;
};

export { period, all };
export default { period, all };
