import Say from "@randajan/say";
import dictionary from "./say.translations.json" with { type: "json" };

const { langs = ["cs", "en"], defaultLang = "cs", translations = {} } = dictionary || {};

export const say = new Say({ langs, defaultLang, translations });
export default say;