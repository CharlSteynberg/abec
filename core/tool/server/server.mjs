



// load :: (required) : modules
// ----------------------------------------------------------------------------------------------------------------------------
    import * as Disk from "fs";
    import * as Mule from "child_process";
    import * as Http from "http";
    import { performance } from "perf_hooks";
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: (functionality) : for cross-platform compaibility
// ----------------------------------------------------------------------------------------------------------------------------
    global
    ({
        performance: performance,  // dependency for `performance.now()`
    });
// ----------------------------------------------------------------------------------------------------------------------------




// tool :: Server : create Server as global Device
// ----------------------------------------------------------------------------------------------------------------------------
    global
    ({
        Server: new Device("Server").extend
        ({
            disk: new Driver(Disk),

            proc: new Driver(Mule),

            http: new Driver(Http).extend
            ({
                create: function(path, port, addr)
                {
                    path = (path || process.cwd());
                    port = (port || 1728);
                    addr = (addr || "0.0.0.0");

                    this.memory.inst = this.memory.device.createServer(function handler(req,rsp)
                    {
                        new Client(req,rsp);
                    });

                    this.memory.inst.listen(port,addr);
                },
            }),
        }),
    });
// ----------------------------------------------------------------------------------------------------------------------------
