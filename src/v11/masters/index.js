import { masters } from "tally-xml-tdl";
import { createStageMethod } from "../createApi.js";
import defaultSelectJson from "./select.json" with { type: "json" };
import defaultRenameJson from "./rename.json" with { type: "json" };
import defaultNormalizeJson from "./normalize.json" with { type: "json" };

const specsByMaster = {
    uom: {
        select: defaultSelectJson,
        rename: defaultRenameJson,
        normalize: defaultNormalizeJson
    },
    stockItems: {
        select: defaultSelectJson,
        rename: defaultRenameJson,
        normalize: defaultNormalizeJson
    },
    stockItemsWithBaseUnits: {
        select: { "@_NAME": true, "BASEUNITS": true },
        rename: { "@_NAME": "name", "BASEUNITS": "baseUnits" },
        normalize: { "name": "string", "baseUnits": "string" }
    },
    ledgerNames: {
        select: defaultSelectJson,
        rename: defaultRenameJson,
        normalize: defaultNormalizeJson
    },
    ledgerNamesWithDetails: {
        select: { "@_NAME": true, "GSTREGISTRATIONTYPE": true, "GSTIN": true },
        rename: { "@_NAME": "name", "GSTREGISTRATIONTYPE": "gstRegistrationType", "GSTIN": "gstin" },
        normalize: { "name": "string", "gstRegistrationType": "string", "gstin": "string" }
    },
    ledgerNamesMoreDetails: {
        select: { "@_NAME": true, "LEDGSTREGDETAILS.LIST": true },
        rename: { "@_NAME": "name", "LEDGSTREGDETAILS.LIST": "gstRegDetails" },
        normalize: { "name": "string" }
    },
    stockGroups: {
        select: defaultSelectJson,
        rename: defaultRenameJson,
        normalize: defaultNormalizeJson
    },
    stockGroupsAndParent: {
        select: { "@_NAME": true, "PARENT": true },
        rename: { "@_NAME": "name", "PARENT": "parent" },
        normalize: { "name": "string", "parent": "string" }
    }
};

const createMasterStageMethod = (jsonId) => {
    const spec = specsByMaster[jsonId] || {};
    return createStageMethod(
        (company) => (typeof masters[jsonId] === "function" ? masters[jsonId](company) : masters.all(company, jsonId)),
        spec.select || defaultSelectJson,
        spec.rename || defaultRenameJson,
        spec.normalize || defaultNormalizeJson
    );
};

const uom = createMasterStageMethod("uom");
const stockItems = createMasterStageMethod("stockItems");
const stockItemsWithBaseUnits = createMasterStageMethod("stockItemsWithBaseUnits");
const ledgerNames = createMasterStageMethod("ledgerNames");
const ledgerNamesWithDetails = createMasterStageMethod("ledgerNamesWithDetails");
const ledgerNamesMoreDetails = createMasterStageMethod("ledgerNamesMoreDetails");
const stockGroups = createMasterStageMethod("stockGroups");
const stockGroupsAndParent = createMasterStageMethod("stockGroupsAndParent");

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

const masterApi = {
    get,
    uom,
    stockItems,
    stockItemsWithBaseUnits,
    ledgerNames,
    ledgerNamesWithDetails,
    ledgerNamesMoreDetails,
    stockGroups,
    stockGroupsAndParent
};

const proxyMasterApi = new Proxy(masterApi, {
    get(target, prop, receiver) {
        if (prop in target) {
            return Reflect.get(target, prop, receiver);
        }
        if (typeof prop === "string" && prop !== "then") {
            const dynamicStageMethod = createMasterStageMethod(prop);
            target[prop] = dynamicStageMethod;
            return dynamicStageMethod;
        }
        return Reflect.get(target, prop, receiver);
    }
});

export {
    get,
    uom,
    stockItems,
    stockItemsWithBaseUnits,
    ledgerNames,
    ledgerNamesWithDetails,
    ledgerNamesMoreDetails,
    stockGroups,
    stockGroupsAndParent
};

export default proxyMasterApi;