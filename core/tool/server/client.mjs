



// tool :: Server : create Server as global Device
// ----------------------------------------------------------------------------------------------------------------------------
    global(class Client
    {
        constructor(req,rsp)
        {
            this.query = req;
            this.reply = rsp;

            dump(req.method, req.url);
            rsp.end("olo :)");

            return this;
        }
    });
// ----------------------------------------------------------------------------------------------------------------------------
