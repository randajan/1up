import sapp from "@randajan/simple-app";
import argv from "@randajan/simple-app/argv";
import { parseEnvs } from "@randajan/simple-app/env";

import ImportGlobPlugin from 'esbuild-plugin-import-glob';
import { sassPlugin } from 'esbuild-sass-plugin';


const { isBuild, env } = argv;

const { uni, be, fe } = parseEnvs(env);


sapp({
    isBuild,
    info:uni,
    env:{
        name:env
    },
    include:["yarn.lock", "README.md"],
    plugins:[
        ImportGlobPlugin.default()
    ],
    loader:{
            ".js":"jsx",
            '.png': 'file',
            ".jpg": "file",
            ".gif": "file",
            ".eot": "file",
            ".woff": "file",
            ".ttf": "file",
            ".svg": "file"
    },
    be:{
        info:be,
    },
    fe:{
        info:fe,
        plugins:[
            sassPlugin()
        ]
    }
})