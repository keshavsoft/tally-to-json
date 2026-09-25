import { masters } from "tally-to-xml-tdl";

const get = async (company, jsonId) => {
    const jsonToReturn = await masters.get(company, jsonId);

    return jsonToReturn;
};

const uom = async (company) => {
    return await get(company, "uom");
};

const stockItems = async (company) => {
    return await get(company, "stockItems");
};

const ledgerNames = async (company) => {
    return await get(company, "ledgerNames");
};

const stockGroups = async (company) => {
    return await get(company, "stockGroups");
};

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