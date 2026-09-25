import { vouchers } from "tally-to-xml-tdl";
import cleanTallyResponse from "tally-clean-response";
import select from "select-json-by-json";

import infoJson from "./select.json" with {type: "json"};

const period = async (company, fromDate, ToDate) => {
    const jsonToReturn = await vouchers.sales.period(company, fromDate, ToDate);
    const cleaned = cleanTallyResponse(jsonToReturn);
    const selected = select(cleaned, infoJson);

    return await selected;
};

const all = async (company) => {
    const jsonToReturn = await vouchers.sales.all(company);
    const cleaned = cleanTallyResponse(jsonToReturn);
    const selected = select(cleaned, infoJson);

    return await selected;
};

export { period, all };
