import { vouchers } from "tally-xml-tdl";
import cleanTallyResponse from "tally-clean-response";
import { selectJson } from "select-json-by-json";
import defaultSelectJson from "./select.json" with { type: "json" };

const asIsPeriod = async (company, fromDate, toDate) => {
    return await vouchers.purchases.period(company, fromDate, toDate);
};

const cleanedPeriod = async (company, fromDate, toDate) => {
    const raw = await asIsPeriod(company, fromDate, toDate);
    return await cleanTallyResponse(raw);
};

const selectedPeriod = async (company, fromDate, toDate, selectSpec = defaultSelectJson) => {
    const cleaned = await cleanedPeriod(company, fromDate, toDate);
    return selectJson(cleaned, selectSpec);
};

// Default period runner (cleaned)
const period = async (company, fromDate, toDate) => {
    return await cleanedPeriod(company, fromDate, toDate);
};

// Attach stage methods to period
period.asIs = asIsPeriod;
period.cleaned = cleanedPeriod;
period.selected = selectedPeriod;

const asIsAll = async (company) => {
    return await vouchers.purchases.all(company);
};

const cleanedAll = async (company) => {
    const raw = await asIsAll(company);
    return await cleanTallyResponse(raw);
};

const selectedAll = async (company, selectSpec = defaultSelectJson) => {
    const cleaned = await cleanedAll(company);
    return selectJson(cleaned, selectSpec);
};

// Default all runner (cleaned)
const all = async (company) => {
    return await cleanedAll(company);
};

// Attach stage methods to all
all.asIs = asIsAll;
all.cleaned = cleanedAll;
all.selected = selectedAll;

export {
    period,
    all,
};

export default {
    period,
    all,
};
