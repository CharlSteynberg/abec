



// shim :: Object.assign : shorhand for `Object.assign(target, attrib)` .. now just use: `target.assign(attrib)`
// ----------------------------------------------------------------------------------------------------------------------------
    Object.prototype.define(function assign(defn)
    {
        // defn.peruse((val,key)=>
        // {
        //     Object.defineProperty(this,key,{value:val});
        // });

        Object.assign(this,defn);

        return this;
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Object.append : like assign, but does not affect the origin .. returns new merged object
// ----------------------------------------------------------------------------------------------------------------------------
    Object.prototype.define(function append(defn)
    {
        // let type = detect(this);
        // let resl = ((type == "list") ? [] : {});
        //
        // this.peruse((val,key)=>
        // {
        //     if (type == "list"){ resl.push(val) }
        //     else { Object.defineProperty(resl,key,{value:val}) };
        // });
        //
        // defn.peruse((val,key)=>
        // {
        //     if (type == "list"){ resl.push(val) }
        //     else { Object.defineProperty(resl,key,{value:val}) };
        // });
        //
        // return resl;

        return {}.assign(this).assign(defn);
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Object.hijack : shorhand for `new Proxy(target, config)`
// ----------------------------------------------------------------------------------------------------------------------------
    Object.prototype.define(function hijack(conf)
    {
        let decoy = new Proxy(this, conf);
        return decoy;
    });
// ----------------------------------------------------------------------------------------------------------------------------




// // func :: choose : neat return call .. returns choices
// // ----------------------------------------------------------------------------------------------------------------------------
//     Object.prototype.define(function choose(what)
//     {
//         return new struct("choice").define(what);
//     });
// // ----------------------------------------------------------------------------------------------------------------------------




// shim :: Object.expose : split up an object into its constituents .. applies to arrays too
// ----------------------------------------------------------------------------------------------------------------------------
    Object.prototype.define(function expose(what,indx)
    {
        let keys,vals;
        keys = Object.getOwnPropertyNames(this);
        vals = [];

        if(what === KEYS)
        {
            if(!isInum(indx)){return keys}; // return all keys
            if(indx<0){indx=((keys.length-1)+indx)};
            return keys[indx];
        };

        if(what === VALS)
        {
            keys.forEach((k)=>{vals.push(this[k])});
            if(!isInum(indx)){return vals}; // return all values
            if(indx<0){indx=((vals.length-1)+indx)};
            return vals[indx];
        };

        return [];
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: String.hasAny / .hasAll : shorthands & improv for String.includes
// ----------------------------------------------------------------------------------------------------------------------------
   String.prototype.define
   ({
       hasAny:function hasAny()
       {
           let h,a,f; h=(this+""); a=params(arguments); f=FALS;
           a.peruse((n)=>{if(h.indexOf(n) > -1){f=n; return STOP}});
           return f;
       },

       hasAll:function hasAll()
       {
           let h,a,s,f; h=(this+""); a=params(arguments); s=length(a); f=0;
           a.peruse((n)=>{if(h.indexOf(n) > -1){f++}});
           return (f===s);
       },
   });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Object.hasAny / .hasAll : shorthands & improv .. affects arrays too
// ----------------------------------------------------------------------------------------------------------------------------
   Object.prototype.define
   ({
       hasAny:function hasAny()
       {
           let h,a,f; h=(isKnob(this) ? this.expose(KEYS) : this);
           a=params(arguments); f=FALS;
           a.peruse((v,k)=>{if(h.indexOf(v) > -1){f=v; return STOP}});
           return f;
       },

       hasAll:function hasAll()
       {
           let h,a,s,f; h=(isKnob(this) ? this.expose(KEYS) : this);
           a=params(arguments); s=length(a); f=0;
           a.peruse((v,k)=>{if(h.indexOf(v) > -1){f++}});
           return (f === s);
       },
   });
// ----------------------------------------------------------------------------------------------------------------------------




// shiv :: String.shaved : trim either white-space or substring from begin -and/or end of a string
// ----------------------------------------------------------------------------------------------------------------------------
    String.prototype.define
    ({
        shaved: function shaved(b,e)
        {
            let t=(this+""); if(!isText(t,1)){return t};  if((b===VOID)&&(e===VOID)){return t.trim()}; // normal trim
            if(e===VOID){e=b};  if(b===e){return t.rshave(t.lshave(t,b),e)}; // shave off substr from both sides

            if(b&&!e){return t.lshave(b)};
            if(e&&!b){return t.rshave(e)};

            return t;
        },

        lshave: function rshave(c)
        {
            let t=(this+""); if(!isText(t,1)){return t}; if(c===VOID){return t.replace(/^\s+/g,"")};
            if(isNumr(c)){c=(c+"")}; if(!isText(c)){return t}; let s=c.length; while(t.indexOf(c)===0){t=t.slice(s);};
            return t;
        },

        rshave: function rshave(c)
        {
            let t=(this+""); if(!isText(t,1)){return t}; if(c===VOID){return t.replace(/\s+$/g,"")};
            if(isNumr(c)){c=(c+"")}; if(!isText(c)){return t}; let s=c.length;
            while(t.slice((0-s))==c){t=t.slice(0,(t.length-s));};
            return t;
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: String.expose : wonderful string parsing tool
// ----------------------------------------------------------------------------------------------------------------------------
    String.prototype.define
    ({
        expose:function expose(a0,a1,a2)
        {
            let txt,tmp,dlm,frm,bgn,end;

            txt = (this+"");
            tmp = (a1+"");
            dlm = txt.hasAny(a0+"");

            if ((a0 === WRAP) && (a1 === VOID))
            { a0=BGN; a1=END; }; // syntax sugar + convenience

            bgn = [BGN,FRST,BFOR];
            end = [END,LAST,AFTR];

            if (bgn.hasAny(a0) && end.hasAny(a1)) // return first and last characters .. to get text wrapper of e.g: `<foo>`
            { return (txt.slice(0,1) + txt.slice(-1)); };

            if ((isText(a0)||isList(a0)) && (isVoid(a1)||bgn.hasAny(tmp)||end.hasAny(tmp)) && dlm) // .:  str.expose("|");
            {
                frm = a1; if(!frm){frm=BGN};  tmp = txt.split(dlm);
                if (bgn.hasAny(frm)){bgn = tmp.shift();  end = tmp.join(dlm)}
                else if (frm.hasAny(end)){end = tmp.pop();  bgn = tmp.join(dlm)}
                else {return []}; return [bgn,dlm,end];
            };

            if (isText(a0,1) && isText(a1,1)) // .:  str.expose("begin","end");
            {
                let t,b,e,x,r,ml,xb,xe,xs,bl,el;  t=txt; b=a0;  e=a1;  x=a2;  txt=VOID;
                r=[]; bl=b.length; el=e.length; ml=(bl+el); if(t.length<(ml+1)){return r};
                do
                {
                    xb=t.indexOf(b); if(xb<0){break}; xe=t.indexOf(e,(xb+bl)); if(xe<0){break};
                    xs=t.slice((xb+bl),xe); if(!x||xs.assert(x)){r.push(xs); t=t.slice((xe+el));}else{t=t.slice(xe);};
                }
                while((t.length>ml)&&(xb>-1)&&(xe>-1))
                return r;
            };

            if (isInum(a0) && isVoid(a1)) // .: split into n-size chunks
            {return (txt.match(/[\s\S]{1,3}/g) || [])};

            if (isInum(a0) && isInum(a1)) // .: str.slice alternative
            {return txt.slice(a0,a1,(a2||0))};

            if (isFunc(a0)) // .: expose using custom function .. syntax sugar
            {return params(a0(txt))};

            return [];
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: String.shuffle : pure and simple .. from here: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
// ----------------------------------------------------------------------------------------------------------------------------
    String.prototype.define
    ({
        shuffle:function shuffle()
        {
            let s = (this+"").split("");
            let n = s.length;

            for(let i=(n-1); i>0; i--)
            {
                let x = Math.floor(Math.random() * (i+1));
                let tmp = s[i];
                s[i] = s[x];
                s[x] = tmp;
            };

            return s.join("");
        }
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Function.expose : split up a function into its constituents
// ----------------------------------------------------------------------------------------------------------------------------
    Function.prototype.define
    ({
        expose:function expose(what)
        {
            let txt,prt,nme,aro,arg,bdy,rsl; txt=this.toString(); prt=txt.expose("{");

            nme = (prt[0].split("(")[0].split("function").pop()||"").trim();
            aro = (nme?"":"=>");
            arg = prt[0].split(")")[0].split("(")[1].split(" ").join(""); arg=(arg?arg.split(","):[]);
            bdy = prt[2].expose("}",END)[0].trim(); bdy=(bdy?bdy.split("\n"):[]).trim();
            rsl = {nick:nme, args:arg, arro:aro, body:bdy};

            rsl.define({toString:function()
            {
                let aro,fun;   aro = (this.nick?"":"=>");   fun = (aro ? "" : "function ");
                return (fun+this.nick+"("+this.args.join(",")+")"+aro+"\n{\n"+this.body.join("\n")+"\n};");
            }});

            if (!what){return rsl};
            return rsl[what];
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Object.peruse() : like `array.forEach()` -but safer
// ----------------------------------------------------------------------------------------------------------------------------
    Object.prototype.define
    ({
        peruse:function peruse(cb)
        {
            for (let k in this)
            {
                if (!stable("peruse")){break}; // break this loop if an error occurred globally
                if (!this.hasOwnProperty(k)){continue}; // ignore proto's
                if(cb.apply(this,[this[k],k]) === STOP){break}; // callback-params in same order as forEach
            };
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Object.rename() : rename anything
// ----------------------------------------------------------------------------------------------------------------------------
    Object.prototype.define
    ({
        rename:function rename(name)
        {
            try{ Object.defineProperty(this,"name", meta("hard",name)) }catch(e){};
            if (this.name === name){ return this };

            let resl;

            if (isFunc(this))
            {
                resl = this.expose();  resl.nick = name;
                resl = parsed(resl.toString());
                return resl;
            };

            if (isKnob(this))
            {
                resl = struct(name);
                this.peruse((val,key)=>{ resl[key] = val });
                return resl;
            };
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: String.assert : run a test against some string/object .. exp can be a function, or RegExp .. returns boolean
// ----------------------------------------------------------------------------------------------------------------------------
    String.prototype.define(function assert(exp)
    {
        let txt = (this+"");  if(isText(exp)){exp = new RegExp(exp)};

        if(isFunc(exp)){return (!!exp(txt))};
        if(isRegx(exp)){return (!!exp.test(txt))};

        return (!!exp);
    });

    Object.prototype.define(function assert(exp)
    {
        if(isText(exp)){exp = new RegExp(exp)};

        let todo,done;
        todo = length(this);
        done = 0;

        this.peruse((val,key,idx)=>
        {
            if (isFunc(exp) && !!exp(val,key,idx)){done++}
            else if (isRegx(exp) && !!exp.test(texted(val))){done++}
            else if (!!exp){done++};
        });

        return (todo === done);
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Object.tunnel : manage object/array-properties multidimensionally by tunneling via path .: `arm/hand/fingers/2/nail`
// ----------------------------------------------------------------------------------------------------------------------------
    Object.prototype.define(function tunnel(path,valu,flag)
    {
        let prts,deep,opts,type,bufr;

        prts = path.split("/"); // list of parts
        deep = prts.length; // levels-deep
        opts = [GET,SET,RIP]; // available flag options
        flag = ((flag+"").hasAny(opts) || (isVoid(valu)?GET:(isNull(valu)?RIP:SET))); // if flag was not set, now it is
        type = detect(this); // do this once to conserve resources
        bufr = this; // temporary holder for the current object property as we traverse below

        prts.forEach((prop,levl)=>
        {
            let pt = "text"; // property-type is text by default -doh -but it may change below
            if (!isNaN(prop) && (type=="list")){ prop*=1; pt="numr" }; // this allows reference like: foo/3/bar

            if (((levl+1) < deep) || (flag===GET))  // keep growing for now
            {
                let vt = detect(bufr[prop]); // value-type
                if ((flag===GET) || vt.hasAny("knob","list","func")){ bufr=bufr[prop]; return }; // safe to proceed
                if (vt!=="void"){ moan("expecting tunnel-target type as any: void,knob,list,func"); return }; // yikes
                bufr[prop] = ((type=="list")?[]:{}); // make a tunnel .. bore
            };

            if (flag === SET){ temp[prop]=valu; return }; // assigned a value
            if (flag === RIP){ delete temp[prop]; return }; // deleted a value
        });

        if (flag === GET){return bufr}; // end of the line... (get it?) :D
        return this;
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: CustomEvent : for if missing
// ----------------------------------------------------------------------------------------------------------------------------
    if ((typeof CustomEvent) == "undefined")
    {
        global(class CustomEvent
        {
            constructor(name,data)
            {
                this.define
                ({
                    detail: data,
                    timeStamp: performance.now(),
                    type: name,
                });
            }

            preventDefault()
            {
                this.defaultPrevented = TRUE;
            }

            stopPropagation()
            {
            }

            stopImmediatePropagation()
            {
            }

            defaultPrevented = FALS
            detail = VOID
            timeStamp = 0
            type = VOID
        });
    };
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Object.liaise : turn object into event emitter, if not already
// ----------------------------------------------------------------------------------------------------------------------------
    Object.prototype.define(function liaise(conf)
    {
        if (!!this.events){return this}; // already vivified

        let myself = (this || new struct("entity")); // if called globally, `this` is undefined, so you get an entity lol

        myself.define
        ({
            events: {}, // event names are stored in here as objects, each with keys as hashes and values as functions


            listen: function listen(evnt,func)
            {
                // if (!func.name){func.define({name:(evnt+"Handler")})};
                if (!this.events[evnt]){this.events[evnt] = {}}; // if event-name does not exist, create it
                let hash = hashed(func);  this.events[evnt][hash] = func; // store each function at hash-key of event
                return this; // makes methods chainable .. you're welcome :D
            },


            signal: function signal(evnt,data)
            {
                if (!this.events[evnt]){return this}; // no listeners
                var inst = new CustomEvent(evnt,data); // prepare payload as event
                var todo = length(this.events[evnt]), done=0, temp, asnc=0; // for tracking progress

                this.events[evnt].peruse((func)=> // call each function in this event
                {
                    if (inst.status === "dead"){done=todo; return STOP} // cancelled
                    temp = func.apply(this,[inst]);
                    if (!!temp && isFunc(temp.then)) // check for returned promise
                    {
                        asnc=1; temp.then(()=> // async
                        {
                            done++;  if (todo==done)
                            {
                                if (evnt == "eventsIdle"){ delete this.events[evnt] }
                                else { this.signal("eventsIdle",inst) }
                                evnt=VOID; inst=VOID; data=VOID; todo=VOID; done=VOID; temp=VOID; asnc=VOID; // clean up!
                            };
                        });
                        return; // async
                    };

                    done++; // not async!
                });

                if (!asnc && (todo==done))
                {
                    if (evnt == "eventsIdle"){ delete this.events[evnt] }
                    else { this.signal("eventsIdle",evnt) }
                    evnt=VOID; inst=VOID; data=VOID; todo=VOID; done=VOID; temp=VOID; asnc=VOID; // clean up!
                }

                return this;
            },

            ignore: function ignore(evnt,func)
            {
                let hash = hashed(func); // to be ignored -the function must be given in order to get its hash
                if (!this.events[evnt] || !this.events[evnt][hash]){return this}; // nothing to ignore
                delete this.events[evnt][hash]; // done, gone, burnt to ashes, hurled into the sun in a sealed capsule
                return this;
            },
        });

        if (conf){ return myself.hijack(conf) };
        return myself;
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Object.modify() : this also affects arrays
// ----------------------------------------------------------------------------------------------------------------------------
    Object.prototype.define(function modify(conf)
    {
        if (isText(conf)){ conf=parsed(conf) };
        if ((length(this) < 1) || (length(conf) < 1)){ return this }; // validation

        let thisType = detect(this);
        let confType = detect(conf);
        let swapKeys = FALS;

        if (!("knob list func").hasAny(confType))
        { moan("invalid configuration"); return };


        if (confType == "func") // modify each item with a callback-function .. `this` in the callback refers to this haha
        {
            this.peruse((valu,indx)=>{ conf.apply(this,[valu,indx]) });
            return this;
        };


        if (isData(this) && conf.assert((val,key)=>{return (isNaN(key*1))})) // modify the field-names in each data-row
        {
            this.peruse((row,idx)=>
            {
                this[idx].peruse((valu,indx)=>
                {
                    let swap = conf[indx];
                    if (!swap || (swap===indx)){return}; // cataclysm avoided
                    this[indx][swap]=valu; delete this[idx][indx];
                });
            });
            return this;
        };


        if ((thisType == "knob") && conf.assert((val,key)=>{return (!isNumr(key*1))})){ swapKeys=1 }
        else if ((thisType == "list") && conf.assert((val,key)=>{return (isNumr(key*1))})){ swapKeys=1 }

        if (swapKeys) // modify own keys directly
        {
            this.peruse((valu,indx)=>
            {
                let swap = conf[indx];
                if (!swap || (swap===indx)){return}; // cataclysm avoided
                this[swap]=valu; delete this[indx];
            });
            return this;
        };
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Function.absorb : TODO absorbs `func` until done .. `rest` defines how long to wait until returned promise resolves
// ----------------------------------------------------------------------------------------------------------------------------
    Function.prototype.define(function absorb()
    {
        return function()
        {
            this.data.push(this.call(...arguments));
        }
        .bind
        ({
            name: ((this.name||"anonymous")+"Absorb"),
            data: [],
            rest: null,
            call: this,
        });
    });
// ----------------------------------------------------------------------------------------------------------------------------
