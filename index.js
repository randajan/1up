import sapp from "@randajan/simple-app";
import argv from "@randajan/simple-app/argv";
import { parseEnvs } from "@randajan/simple-app/env";

import ImportGlobPlugin from 'esbuild-plugin-import-glob'


const { isBuild, env } = argv;

const { uni, fe, be } = parseEnvs(env);

sapp({
    isBuild,
    include:["yarn.lock", "README.md"],
    env:{
        name:env
    },
    plugins:[
        ImportGlobPlugin.default()
    ],
    loader:{
        ".js":"jsx",
        ".md":"text",
        '.png': 'file',
        ".jpg": "file",
        ".gif": "file",
        ".eot": "file",
        ".woff": "file",
        ".ttf": "file",
        ".svg": "file",
        ".mp3": "file",
        ".wav": "file",
        ".webp": "file"
    },
    info:uni,
    be:{
        info:be,
    },
    fe:{
        info:fe,
    }
})