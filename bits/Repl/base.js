



// defn :: CLI : server-side
// ----------------------------------------------------------------------------------------------------------------------------
    if(SERVERSIDE)
    {
        extend(MAIN)
        ({
            Repl:
            {
                init: function init()
                {
                    this.cli=require("readline");
                    this.cli.createInterface
                    ({
                        input: process.stdin,
                        output: process.stdout,
                    });
                },

                echo: function echo()
                {
                    if(!this.tty){this.init()};
                },

                read: function read()
                {
                    if(!this.tty){this.init()};
                },

                exec: function exec()
                {
                    if(!this.tty){this.init()};
                },
            },
        });
    };
// ----------------------------------------------------------------------------------------------------------------------------
