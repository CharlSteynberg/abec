


// load :: required : libs
// ----------------------------------------------------------------------------------------------------------------------------
    import * as THREE from "three";
// ----------------------------------------------------------------------------------------------------------------------------




// tool :: Viewer : create Viewer as global Device
// ----------------------------------------------------------------------------------------------------------------------------
    global
    ({
        Viewer: new Device("Viewer").extend
        ({
            drivers: new Choice().listen("change",(evnt)=>
            {
                evnt = evnt.detail;
                this.driver = evnt.chosen.value;

                // System.signal("viewerChange");

                this.driver.vivify({get:function(a1,a2)
                {
                    dump("Viewer: ",a1,a2);
                }});
            }),
        }),
    });
// ----------------------------------------------------------------------------------------------------------------------------




// defn :: Viewer.drivers.DOM : Document Object Model
// ----------------------------------------------------------------------------------------------------------------------------
    Viewer.drivers.define
    ({
        DOM: new Driver(document).extend
        ({
            create: function()
            {
                // let args = params( arguments );
                // this.signal("viewerCreate", args);
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




// defn :: Viewer.drivers.THREE : THREE.JS
// ----------------------------------------------------------------------------------------------------------------------------
    Viewer.drivers.define
    ({
        THREE: function(document).extend
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
