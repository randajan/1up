import {
    BooleanField,
    ColorField,
    DateField,
    EnumField,
    FileField,
    NumberField,
    RangeField,
    TextFieldControl
} from "../types";

const _typeMap = new Map([
    ["date", DateField],
    ["boolean", BooleanField],
    ["enum", EnumField],
    ["range", RangeField],
    ["number", NumberField],
    ["color", ColorField],
    ["file", FileField],
    ["text", TextFieldControl],
    ["email", TextFieldControl],
    ["url", TextFieldControl],
    ["textarea", TextFieldControl]
]);

export const resolveTypeField = (uiType) => _typeMap.get(uiType) || TextFieldControl;
