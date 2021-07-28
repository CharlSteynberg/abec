



// tool :: txml : awesome XML parsing lib .. https://github.com/TobiasNickel/tXml.git
// ----------------------------------------------------------------------------------------------------------------------------
    import * as tXml from "./txml.mjs";
    global({txml: tXml}); // make it known
// ----------------------------------------------------------------------------------------------------------------------------




// tool :: Device
// ----------------------------------------------------------------------------------------------------------------------------
    global(class Device
    {
        constructor(name)
        {
            this.source = struct(name+"Device").vivify();
            this.source.define
            ({
                parent: this,
                driver: {},
                extend: function(defn)
                {
                    defn.peruse((val,key)=>
                    {
                        if (!(val instanceof Driver)){ throw "expecting instanceof Driver"; return };
                        this.driver[key] = val;  // put the driver in a safe place
                        this[key] = this.driver[key].vivify(this); // .. now `device.driver.method()` works as expected
                    });

                    return this;
                }
            });

            return this.source;
        }
    });
// ----------------------------------------------------------------------------------------------------------------------------




// tool :: Driver : reactive proxy
// ----------------------------------------------------------------------------------------------------------------------------
    global(class Driver
    {
        constructor(udev)
        {
            this.memory = {target:udev, status:"ready"};

            this.config = // object
            {
                get:function(dev,key,obj, rsl)
                {
                    rsl = dev[key];  if (!isVoid(rsl) && !isFunc(rsl)){return rsl};
                    if (key == "constructor"){ return rsl };  rsl=VOID;
                    rsl = this.memory[key]; if (!isVoid(rsl)){return rsl};

                    return function()
                    {
                        let arg = params(arguments),  syn = "Sync";
                        if (!isFunc(arg.slice(-1)[0]) && !key.endsWith(syn) && isFunc(dev[(key+syn)])){key += syn};
                        return dev[key](...arg);
                    }
                    .define({name:key});
                }
                .bind(this),

                set:function(dev,key,val)
                {
                    this.memory[key] = val;
                    return TRUE;
                }
                .bind(this),
            };

            return this;
        }


        vivify(dev,cfg)
        {
            this.memory.device = dev;

            if (!!cfg)
            {
                if (isFunc(cfg)){ cfg = meta("trap") };
                if (isMeta(cfg)){ this.config = cfg };
            };

            return new Proxy(this.memory.target, this.config);
        }
    });
// ----------------------------------------------------------------------------------------------------------------------------
