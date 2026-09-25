import { masters } from "tally-xml-tdl";
import { createStageMethod } from "../createApi.js";
import defaultSelectJson from "./select.json" with { type: "json" };

const createMasterStageMethod = (jsonId) => {
    return createStageMethod((company) => masters.all(company, jsonId), defaultSelectJson);
};

const uom = createMasterStageMethod("uom");
const stockItems = createMasterStageMethod("stockItems");
const ledgerNames = createMasterStageMethod("ledgerNames");
const stockGroups = createMasterStageMethod("stockGroups");

const get = (company, jsonId) => {
    return createMasterStageMethod(jsonId)(company);
};
get.asIs = (company, jsonId) => createMasterStageMethod(jsonId).asIs(company);
get.cleaned = (company, jsonId) => createMasterStageMethod(jsonId).cleaned(company);
get.selected = (company, jsonId, spec) => createMasterStageMethod(jsonId).selected(company, spec);

export {
    get,
    uom,
    stockItems,
    ledgerNames,
    stockGroups
};

export default {
    get,
    uom,
    stockItems,
    ledgerNames,
    stockGroups
};