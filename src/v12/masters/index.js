import { masters } from "tally-xml-tdl";
import { createStageMethod } from "../createApi.js";
import defaultSelectJson from "./select.json" with { type: "json" };
import defaultRenameJson from "./rename.json" with { type: "json" };
import defaultNormalizeJson from "./normalize.json" with { type: "json" };

const specsByUnit = {
    all: {
        select: defaultSelectJson,
        rename: defaultRenameJson,
        normalize: defaultNormalizeJson
    },
    names: {
        select: defaultSelectJson,
        rename: defaultRenameJson,
        normalize: defaultNormalizeJson
    }
};

const specsByStockItem = {
    all: {
        select: defaultSelectJson,
        rename: defaultRenameJson,
        normalize: defaultNormalizeJson
    },
    names: {
        select: defaultSelectJson,
        rename: defaultRenameJson,
        normalize: defaultNormalizeJson
    },
    withBaseUnits: {
        select: { "@_NAME": true, "BASEUNITS": true },
        rename: { "@_NAME": "name", "BASEUNITS": "baseUnits" },
        normalize: { "name": "string", "baseUnits": "string" }
    },
    withBatches: {
        select: { "@_NAME": true, "BASEUNITS": true, "BATCHALLOCATIONS.LIST": true },
        rename: { "@_NAME": "name", "BASEUNITS": "baseUnits", "BATCHALLOCATIONS.LIST": "batchAllocations" },
        normalize: { "name": "string", "baseUnits": "string" }
    }
};

const specsByLedger = {
    all: {
        select: defaultSelectJson,
        rename: defaultRenameJson,
        normalize: defaultNormalizeJson
    },
    names: {
        select: defaultSelectJson,
        rename: defaultRenameJson,
        normalize: defaultNormalizeJson
    },
    withDetails: {
        select: { "@_NAME": true, "GSTREGISTRATIONTYPE": true, "GSTIN": true },
        rename: { "@_NAME": "name", "GSTREGISTRATIONTYPE": "gstRegistrationType", "GSTIN": "gstin" },
        normalize: { "name": "string", "gstRegistrationType": "string", "gstin": "string" }
    },
    moreDetails: {
        select: { "@_NAME": true, "LEDGSTREGDETAILS.LIST": true },
        rename: { "@_NAME": "name", "LEDGSTREGDETAILS.LIST": "gstRegDetails" },
        normalize: { "name": "string" }
    },
    withGstDetails: {
        select: { "@_NAME": true, "LEDGSTREGDETAILS.LIST": true },
        rename: { "@_NAME": "name", "LEDGSTREGDETAILS.LIST": "gstRegDetails" },
        normalize: { "name": "string" }
    }
};

const specsByStockGroup = {
    all: {
        select: defaultSelectJson,
        rename: defaultRenameJson,
        normalize: defaultNormalizeJson
    },
    names: {
        select: defaultSelectJson,
        rename: defaultRenameJson,
        normalize: defaultNormalizeJson
    },
    withParent: {
        select: { "@_NAME": true, "PARENT": true },
        rename: { "@_NAME": "name", "PARENT": "parent" },
        normalize: { "name": "string", "parent": "string" }
    }
};

const createMasterEntityApi = ({ inTdlSource, inSpecs = {} }) => {
    const localTdlSource = inTdlSource;
    const localSpecs = inSpecs;

    const createVariantStageMethod = ({ inVariant, inFetchFn, inSpec = {} }) => {
        const localVariant = inVariant;
        const localFetchFn = inFetchFn;
        const localSpec = inSpec;

        return createStageMethod(
            localFetchFn,
            localSpec.select || defaultSelectJson,
            localSpec.rename || defaultRenameJson,
            localSpec.normalize || defaultNormalizeJson
        );
    };

    const getFetchFn = (variant) => {
        return (company) => {
            if (!localTdlSource) {
                throw new Error("TDL master source is undefined.");
            }
            if (typeof localTdlSource[variant] === "function") {
                return localTdlSource[variant](company);
            }
            if (typeof localTdlSource.all === "function") {
                return localTdlSource.all(company, variant);
            }
            if (typeof localTdlSource === "function") {
                return localTdlSource(company, variant);
            }
            throw new Error(`Variant '${variant}' not found on master entity.`);
        };
    };

    const variantMethods = {};

    for (const [variant, spec] of Object.entries(localSpecs)) {
        variantMethods[variant] = createVariantStageMethod({
            inVariant: variant,
            inFetchFn: getFetchFn(variant),
            inSpec: spec
        });
    }

    const defaultVariant = variantMethods.all || variantMethods.names || Object.values(variantMethods)[0];

    const entityRunner = async (...args) => defaultVariant(...args);

    Object.assign(entityRunner, variantMethods);

    if (defaultVariant) {
        entityRunner.asIs = defaultVariant.asIs;
        entityRunner.cleaned = defaultVariant.cleaned;
        entityRunner.selected = defaultVariant.selected;
        entityRunner.renamed = defaultVariant.renamed;
        entityRunner.rename = defaultVariant.rename;
        entityRunner.normalized = defaultVariant.normalized;
        entityRunner.normalize = defaultVariant.normalize;
    }

    return new Proxy(entityRunner, {
        get(target, prop, receiver) {
            if (prop in target) {
                return Reflect.get(target, prop, receiver);
            }
            if (typeof prop === "string" && prop !== "then") {
                const dynamicMethod = createVariantStageMethod({
                    inVariant: prop,
                    inFetchFn: getFetchFn(prop),
                    inSpec: {}
                });
                target[prop] = dynamicMethod;
                return dynamicMethod;
            }
            return Reflect.get(target, prop, receiver);
        }
    });
};

const Unit = createMasterEntityApi({
    inTdlSource: masters.Unit || masters.uom,
    inSpecs: specsByUnit
});

const StockItem = createMasterEntityApi({
    inTdlSource: masters.StockItem || masters.stockItems,
    inSpecs: specsByStockItem
});

const Ledger = createMasterEntityApi({
    inTdlSource: masters.Ledger || masters.ledgerNames,
    inSpecs: specsByLedger
});

const StockGroup = createMasterEntityApi({
    inTdlSource: masters.StockGroup || masters.stockGroups,
    inSpecs: specsByStockGroup
});

const get = (company, type, variant = "all") => {
    const target = proxyMasterApi[type];
    if (!target) {
        throw new Error(`Master type '${type}' not found.`);
    }
    if (typeof target[variant] === "function") {
        return target[variant](company);
    }
    return target(company);
};

get.asIs = (company, type, variant = "all") => {
    const target = proxyMasterApi[type];
    const method = target && target[variant] ? target[variant] : target;
    return method.asIs(company);
};
get.cleaned = (company, type, variant = "all") => {
    const target = proxyMasterApi[type];
    const method = target && target[variant] ? target[variant] : target;
    return method.cleaned(company);
};
get.selected = (company, type, variant = "all", spec) => {
    const target = proxyMasterApi[type];
    const method = target && target[variant] ? target[variant] : target;
    return method.selected(company, spec);
};
get.renamed = (company, type, variant = "all", spec) => {
    const target = proxyMasterApi[type];
    const method = target && target[variant] ? target[variant] : target;
    return method.renamed(company, spec);
};
get.rename = get.renamed;
get.normalized = (company, type, variant = "all", spec) => {
    const target = proxyMasterApi[type];
    const method = target && target[variant] ? target[variant] : target;
    return method.normalized(company, spec);
};
get.normalize = get.normalized;

const masterApi = {
    get,
    Unit,
    StockItem,
    Ledger,
    StockGroup,
    // Aliases
    unit: Unit,
    stockItem: StockItem,
    stockItems: StockItem,
    ledger: Ledger,
    ledgers: Ledger,
    stockGroup: StockGroup,
    stockGroups: StockGroup,
    uom: Unit
};

const proxyMasterApi = new Proxy(masterApi, {
    get(target, prop, receiver) {
        if (prop in target) {
            return Reflect.get(target, prop, receiver);
        }
        if (prop === "stockItems") return target.StockItem;
        if (prop === "stockItemsWithBaseUnits") return target.StockItem.withBaseUnits;
        if (prop === "stockItemsWithBatches") return target.StockItem.withBatches;
        if (prop === "ledgerNames") return target.Ledger;
        if (prop === "ledgerNamesWithDetails") return target.Ledger.withDetails;
        if (prop === "ledgerNamesMoreDetails") return target.Ledger.moreDetails;
        if (prop === "stockGroups") return target.StockGroup;
        if (prop === "stockGroupsAndParent") return target.StockGroup.withParent;
        if (prop === "uom") return target.Unit;

        return Reflect.get(target, prop, receiver);
    }
});

export {
    get,
    Unit,
    StockItem,
    Ledger,
    StockGroup,
    Unit as unit,
    StockItem as stockItem,
    StockItem as stockItems,
    Ledger as ledger,
    Ledger as ledgers,
    StockGroup as stockGroup,
    StockGroup as stockGroups,
    Unit as uom
};

export default proxyMasterApi;