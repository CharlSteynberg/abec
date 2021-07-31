



// load :: core : modules
// ------------------------------------------------------------
    import "./core/system.mjs";
    import "./core/parser.mjs";
    import "./core/viewer.mjs";
    import "./core/client.mjs";
    import "./core/server.mjs";
// ------------------------------------------------------------




// init :: core : system
// ------------------------------------------------------------
    System.listen("loaded", function onReady()
    {
        var idle = tick.after(10, function idle()
        {
            if (!!Viewer.driver.value){ cancel(idle); return }; // Viewer is handled by another module
            if (SERVERSIDE){ Viewer.drivers.choose("CLI") };
        });
    });


    (!function boot()
    {
        when(function isReady()
        {
            if (SERVERSIDE){ return true };
            return (document.readyState === "complete");
        })
        .then(function init()
        {
            System.signal("loaded");
        });
    }());
// ------------------------------------------------------------
