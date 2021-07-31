



// tool :: Viewer : create Viewer as global Device
// ----------------------------------------------------------------------------------------------------------------------------
    global
    ({
        Viewer: new Device("Viewer").extend
        ({
            drivers: new Choice().listen("change",(evnt)=>
            {
                evnt = evnt.detail;
                evnt.parent.driver = evnt.chosen.value;
                System.signal("viewerChange");

                evnt.parent.driver.vivify({get:function(a1,a2)
                {
                    dump("Viewer: ",a1,a2);
                }});
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
            create: function()
            {
            },


            select: function()
            {

            },


            remove: function()
            {

            },
        })
    });
// ----------------------------------------------------------------------------------------------------------------------------
