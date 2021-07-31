



// tool :: Client : create Client as global Device
// ----------------------------------------------------------------------------------------------------------------------------
    global
    ({
        Client: new Device("Client").extend
        ({
            view: new Driver(Viewer).listen("change",(evnt)=>
            {
                Client.view.vivify(evnt.detail);
            }),
        }),
    });
// ----------------------------------------------------------------------------------------------------------------------------

dump("\n",">>> 1 <<<",Client.view,"\n");

Client.view.choose("DOM");

dump("\n",">>> 2 <<<",Client.view,"\n");
