import { masters } from "tally-xml-tdl";
import { createStageMethod } from "../createApi.js";
import defaultSelectJson from "./select.json" with { type: "json" };
import defaultRenameJson from "./rename.json" with { type: "json" };
import defaultNormalizeJson from "./normalize.json" with { type: "json" };

const createMasterStageMethod = (jsonId) => {
    return createStageMethod(
        (company) => masters.all(company, jsonId),
        defaultSelectJson,
        defaultRenameJson,
        defaultNormalizeJson
    );
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
get.renamed = (company, jsonId, spec) => createMasterStageMethod(jsonId).renamed(company, spec);
get.rename = get.renamed;
get.normalized = (company, jsonId, spec) => createMasterStageMethod(jsonId).normalized(company, spec);
get.normalize = get.normalized;

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