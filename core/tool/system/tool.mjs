



// tool :: Choice : ... ?
// ----------------------------------------------------------------------------------------------------------------------------
    global(class Choice
    {
        constructor(defn)
        {
            if (isKnob(defn)){ this.assign(defn) };
            return this.liaise();
        }


        choose(indx)
        {
            if (isVoid(this[indx]) || (!isText(indx) && !isNumr(indx)))
            { moan("invalid choice"); return }; // must validate

            let choice = {index:indx, value:this[indx]};

            if (this.index !== indx)
            {
                this.signal("change", choice.append({parent:this.parent}));
            };

            this.define(choice);
            return this.value;
        }


        extend(defn)
        {
            this.assign(defn);
            return this;
        }


        toString()
        {
            return texted(this.value);
        }
    });
// ----------------------------------------------------------------------------------------------------------------------------




// tool :: Device
// ----------------------------------------------------------------------------------------------------------------------------
    global(class Device
    {
        constructor(name)
        {
            this.source = struct(name+"Device").liaise();
            this.source.define
            ({
                parent: this,
                driver: {},
                extend: function(defn)
                {
                    defn.peruse((val,key)=>
                    {
                        this.driver[key] = val;  // put the driver in a safe place .. below is for: `device.driver.method()`
                        this[key] = ((val instanceof Driver) ? this.driver[key].liaise(this) : this.driver[key]);
                        if (!!this[key] && !this[key].parent){ this[key].define({parent:this.parent}) };
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
            this.memory = {device:udev, status:"ready"};

            this.config = // object
            {
                get:function(dev,key,obj, rsl)
                {
                    rsl = dev[key];  // result
                    if (!isVoid(rsl) && !isFunc(rsl)){return rsl}; // property which is not a function
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
            if (!(dev instanceof Device)){ cfg=dev; dev=VOID }
            if (!isVoid(dev)){ this.memory.device = dev };

            if (!!cfg)
            {
                if (isFunc(cfg)){ cfg = meta("trap") };
                if (isMeta(cfg)){ this.config = cfg };
            };

            return new Proxy(this.memory.device, this.config);
        }


        extend(obj)
        {
            this.define(obj);
            return this;
        }
    });
// ----------------------------------------------------------------------------------------------------------------------------




// tool :: System : create System as global Device
// ----------------------------------------------------------------------------------------------------------------------------
    global
    ({
        System: new Device("System"),
    });
// ----------------------------------------------------------------------------------------------------------------------------




// tool :: tick : nice syntax for setTimeout and setInterval
// ----------------------------------------------------------------------------------------------------------------------------
    global
    ({
        tick:
        {
            timer:{},

            liven:function liven(t)
            {
                let h=hashed(); tick.timer[h]=t;
                return tick.timer[h];
            },


            after:function after(frst,scnd)
            {
                if(isFrac(frst)){frst=Math.floor(frst*1000)}; // fraction to seconds in milliseconds
                if(!isFunc(scnd)){moan("2nd arg must be a function"); return}; // validation

                if(isNumr(frst)) // simple timeout in milliseconds
                {return tick.liven(setTimeout(scnd,frst))};

                if(isFunc(frst)&&isFunc(scnd)) // async call
                {let r=frst(); return tick.liven(setTimeout(()=>{scnd(r)},0))};
            },


            every:function every(frst,scnd,slow,lmit)
            {
                if(isFrac(frst)){frst=Math.floor(frst*1000)}; // fraction to seconds
                if(!isFunc(scnd)){moan("2nd arg must be a function"); return}; // validation
                if(!isInum(slow)||(slow<0)){slow=0}; if(!isInum(lmit)||(lmit<0)){lmit=null}; // normalize to prevent issues

                if(isNumr(frst))
                {
                    lmit=slow; if(!lmit){return setInterval(scnd,frst)}; // simple interval
                    let timr=tick.liven(setInterval(()=>{scnd(); lmit--; if(lmit<0){clearInterval(timr)};},frst));
                    return timr;
                };

                if(isFunc(frst)&&isFunc(scnd))
                {
                    let timr = tick.liven(setInterval(()=>
                    {
                        if(lmit!==null){lmit--; if(lmit<0){clearInterval(timr); return}};
                        let resl=frst(); if(resl||(resl===0)){scnd(resl)};
                    },slow));
                    return timr;
                };
            },


            until:function until(frst,scnd,slow,lmit)
            {
                if(!isFunc(frst)){fail("1st arg must be a function"); return}; // validation
                if(!isFunc(scnd)){fail("2nd arg must be a function"); return}; // validation
                if(!isInum(slow)||(slow<0)){slow=0}; if(!isInum(lmit)||(lmit<0)){lmit=null};

                let timr = tick.liven(setInterval(()=>
                {
                    if(lmit!==null){lmit--; if(lmit<0){clearInterval(timr); return}};
                    let resl=frst(); if(resl||(resl===0)){clearInterval(timr); scnd(resl);};
                },slow));
                return timr;
            },
        },


        after:function after(a){return function runAfter(b){return tick.after(a,b);}},
        every:function every(a,s,l){return function runEvery(b){return tick.every(a,b,s,l);}},
        until:function until(a,s,l){return function runUntil(b){return tick.until(a,b,s,l);}},

        when:function when(a){return {then:function then(b)
        {
            if(isWord(a)){return upon(a,b)};
            return tick.until(a,b);
        }}},
    });
// ----------------------------------------------------------------------------------------------------------------------------
