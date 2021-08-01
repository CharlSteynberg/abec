



// tool :: Viewer : create Viewer as global Device
// ----------------------------------------------------------------------------------------------------------------------------
    global
    ({
        Viewer: new Device("Viewer").extend
        ({
            drivers: new Choice().listen("change",(evnt)=>
            {
                evnt = evnt.detail;
                evnt.parent.driver = evnt.value;
                System.listen("viewerChange",()=>
                {
                    after(1)(()=>
                    {
                        evnt.parent.driver.vivify(evnt.parent.driver.config);
                    });
                });

                System.signal("viewerChange", evnt.parent.driver);
            }),
        }),
    });
// ----------------------------------------------------------------------------------------------------------------------------




// defn :: Viewer.drivers.CLI : Command Line Interface
// ----------------------------------------------------------------------------------------------------------------------------
    Viewer.drivers.extend
    ({
        CLI: new Driver(process).extend
        ({
            config:
            {
            },


            vivify: function(conf)
            {
                // dump(conf);
            },


            resync: function()
            {

            },


            render: function()
            {

            },


            create: function()
            {
            },


            modify: function()
            {
            },


            insert: function()
            {
            },


            remove: function()
            {

            },


            search: function()
            {

            },


            parlay: function()
            {

            },
        })
    });
// ----------------------------------------------------------------------------------------------------------------------------




// defn :: Viewer.drivers.API : Application Programming Interface
// ----------------------------------------------------------------------------------------------------------------------------
    Viewer.drivers.extend
    ({
        API: new Driver(process).extend
        ({
            config:
            {
            },


            vivify: function(conf)
            {
                let exec = params()[0];
                let resl = parsed("function exec(){ "+exec+" }")();
                return resl;
            },
        })
    });
// ----------------------------------------------------------------------------------------------------------------------------
