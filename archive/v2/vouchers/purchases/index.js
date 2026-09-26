import { vouchers } from "tally-to-xml-tdl";
import cleanTallyResponse from "tally-clean-response";
import select from "select-json-by-json";
import norm from "../../../../norm/v3/index.js";

import infoJson from "./select.json" with {type: "json"};
import nomalizeJson from "./nomalize.json" with {type: "json"};

const period = async (company, fromDate, ToDate) => {
    const jsonToReturn = await vouchers.purchases.period(company, fromDate, ToDate);
    const cleaned = cleanTallyResponse(jsonToReturn);
    const selected = select(cleaned, infoJson);
    const nomalizedOutput = norm(selected, nomalizeJson);

    return await nomalizedOutput;
};

const all = async (company) => {
    const jsonToReturn = await vouchers.purchases.all(company);
    const cleaned = cleanTallyResponse(jsonToReturn);
    const selected = select(cleaned, infoJson);

    return await selected;
};

export { period, all };
