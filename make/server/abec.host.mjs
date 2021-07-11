



// load :: required : modules
// ----------------------------------------------------------------------------------------------------------------------------
    import * as Disk from "fs";
    import * as Mule from "child_process";
    import { performance } from "perf_hooks";

    import "../shared/abec.base.mjs"; // pure awesomeness

    global
    ({
        performance: performance,  // dependency for `performance.now()`
    });
// ----------------------------------------------------------------------------------------------------------------------------




// tool :: server : create server as global device
// ----------------------------------------------------------------------------------------------------------------------------
    global
    ({
        server: new device("server").extend
        ({
            disk: new driver(Disk),
            proc: new driver(Mule),
        })
    });
// ----------------------------------------------------------------------------------------------------------------------------
