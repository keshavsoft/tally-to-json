import { company } from "tally-to-xml-tdl";

const startFunc = async (showLog = false) => {
    const jsonToReturn = await company(showLog);

    return jsonToReturn;
};

export default startFunc;