import { QrGen } from "./class/QRGen";
import { drawQRCanvas } from "./drawing/draw";
import { cornerTest } from "./cornerDev";
import { getModule, listModules, validModuleId } from "./inputs/content";
import { styleFields } from "./inputs/styleFields";
import { configFields } from "./inputs/configFields";
import say from "./say";

export {
    QrGen, say,
    drawQRCanvas,
    getModule, listModules, validModuleId,
    styleFields, configFields,
    cornerTest,
};
