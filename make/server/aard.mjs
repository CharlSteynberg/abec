



// load :: required : modules
// ----------------------------------------------------------------------------------------------------------------------------
    import "../shared/abec.mjs";
    import * as Fsys from "fs";
    import { performance } from "perf_hooks";
// ----------------------------------------------------------------------------------------------------------------------------




// tool :: server : create server as global device and set some expected globals
// ----------------------------------------------------------------------------------------------------------------------------
    global({ server: new device("server") });
    global({ performance: performance });
// ----------------------------------------------------------------------------------------------------------------------------




// tool :: server.disk : extends `fs` as proxy .. if no callback is given -then "Sync" is implied .: server.disk.readFile();
// ----------------------------------------------------------------------------------------------------------------------------
    server.define({disk:trap(Fsys, function autoSync(fsys,func)
    {
        let temp = fsys[func]; // lowercase `f` in `fsys` .. syntax sugar
        if (!isVoid(temp) && !isFunc(temp)){return temp}; // no checking for "Sync" here, most likely some property

        return function call()
        {
            let args = params(arguments);
            let last = args.slice(-1)[0];
            if (!isFunc(last)){func += "Sync"};
            return fsys[func].apply(fsys,args);
        };
    })});
// ----------------------------------------------------------------------------------------------------------------------------
