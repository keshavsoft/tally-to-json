import { vouchers } from "tally-xml-tdl";
import cleanTallyResponse from "tally-clean-response";

const period = async (company, fromDate, toDate) => {
    const jsonToReturn = await vouchers.sales.period(company, fromDate, toDate);
    return await cleanTallyResponse(jsonToReturn);
};

const all = async (company) => {
    const jsonToReturn = await vouchers.sales.all(company);
    return await cleanTallyResponse(jsonToReturn);
};

export { period, all };
export default { period, all };
