



                         /*************************************************************************\

                                                      */ "use strict" /*

                                           ///////    ////////    /////////   /////////
                                         //     //   //     //   //          //
                                        /////////   ////////    ////////    //
                                       //     //   //     //   //          //
                                      //     //   ////////    /////////   /////////

                                   A b s t r a c t   B i o s   E v o l u t i o n   C o r e

                         \******************************   v1.0.10   ******************************/






// load :: core : modules .. these are loaded in particular order for easy debugging along the way
// ----------------------------------------------------------------------------------------------------------------------------
    import "./core/system.mjs"; // the essence
    import "./core/parser.mjs"; // transpilation and reflection
    import "./core/viewer.mjs"; // any user input and output .. server -and client-based: CLI, DOM, WGL, WVR, WXR
    import "./core/client.mjs"; // dynamic - depending on where this library's running process is based .. `PROCBASE`
    import "./core/server.mjs"; // same as client .. these have different roles in each environment respectively
// ----------------------------------------------------------------------------------------------------------------------------




// upon :: (system loaded) : give any parent module time to hijack the `loaded` event .. if not cancelled we take over with CLI
// ----------------------------------------------------------------------------------------------------------------------------
    System.listen("loaded", function onReady()
    {
        if (!!Viewer.drivers.value){ return }; // Viewer is handled by another module .. no take-over needed
        if (length(params()) > 0){ Viewer.drivers.choose("API"); return }; // run as API .. no CLI needed
        Viewer.drivers.choose("CLI"); // as fallback interface .. most basic, but provides advanced interaction
    });
// ----------------------------------------------------------------------------------------------------------------------------




// emit :: (system loaded) : when all dependencies/assets loaded .. cross-platform
// ----------------------------------------------------------------------------------------------------------------------------
    when(function isReady()
    {
        if ((typeof Server) == "undefined"){ return };
        if (SERVERSIDE){ return true };
        return (document.readyState === "complete");
    })
    .then(function init()
    {
        after(1)(()=>{ System.signal("loaded") });
    });
// ----------------------------------------------------------------------------------------------------------------------------
