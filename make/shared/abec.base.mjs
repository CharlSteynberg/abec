



// defn :: (constants) : useful for if another script overwrites something we need
// ----------------------------------------------------------------------------------------------------------------------------
    const MAIN = globalThis; // context
    const VOID = (function(){}()); // undefined
    const NULL = null; // syntax sugar
    const TRUE = (!0);
    const FALS = (!1);
// ----------------------------------------------------------------------------------------------------------------------------




// func :: dump/moan : shorthands for `console.log` & console.error
// ----------------------------------------------------------------------------------------------------------------------------
    const dump = console.log.bind(console);
    const moan = console.error.bind(console);
// ----------------------------------------------------------------------------------------------------------------------------




// func :: descry : concise `typeof` .. returns "class/extension"
// ----------------------------------------------------------------------------------------------------------------------------
    const descry = function descry(defn)
    {
        let resl = Object.prototype.toString.call(defn).toLowerCase().slice(1,-1).split(" ").join("/");
        return resl;
    };
// ----------------------------------------------------------------------------------------------------------------------------




// cond :: (globalThis) : check if the current context is in fact `MAIN` .. if not, we have to HALT this unstable process
// ----------------------------------------------------------------------------------------------------------------------------
    (function(type)
    {
        if(type.endsWith("global") || type.endsWith("window")){return};
        moan("expecting `globalThis` as either `global` -or `window`");
    }(descry(MAIN)));
// ----------------------------------------------------------------------------------------------------------------------------




// defn :: ENVITYPE : string reference as the type of environment this script is running in
// ----------------------------------------------------------------------------------------------------------------------------
    const ENVITYPE = (function()
    {
        if(((typeof window)!="undefined")&&((typeof __dirname)!="string")){return "web"};
        if(((typeof browser)!="undefined")&&!!browser.browserAction&&((typeof browser.browserAction.getPopup)=="function"))
        {return "ext"}; return "njs";
    }());

    const CLIENTSIDE = (ENVITYPE=="web");
    const SERVERSIDE = (ENVITYPE=="njs");
    const PLUGINSIDE = (ENVITYPE=="ext");
// ----------------------------------------------------------------------------------------------------------------------------




// defn :: PROCTYPE : string reference as the type of process currently running, e.g:  (PROCTYPE == "web-worker")
// ----------------------------------------------------------------------------------------------------------------------------
    const PROCTYPE = (function()
    {
        if (SERVERSIDE){ return (ENVITYPE+"-"+((process.argv[2]==="child") ? "worker" : "master")) };
        return (ENVITYPE+"-"+(((typeof MAIN.document)==="undefined") ? "worker" : "master"));
    }());
// ----------------------------------------------------------------------------------------------------------------------------




// func :: detect : concise `typeof` .. returns 4-letter word
// ----------------------------------------------------------------------------------------------------------------------------
    const detect = function detect(defn)
    {
        let type,kind;  if(defn === null){return "null"};

        type = (typeof defn).slice(0,4);  if(type == "unde"){return "void"};
        kind = descry(defn).split("/").pop().slice(0,4);

        if((type=="func") && ((typeof defn.constructor)=="function") && (defn.constructor.name !== "Function")){kind="tool"}
        else if(("arra argu list coll").indexOf(kind) > -1){kind="arra"};

        return (this[kind] || this[type] || kind);
    }
    .bind
    ({
        wind:"main", glob:"main", numb:"numr", stri:"text", html:"node", arra:"list", obje:"knob", rege:"regx",
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: struct : returns an instance of a class named `name`
// ----------------------------------------------------------------------------------------------------------------------------
    const struct = function struct(attr)
    {
        let type = detect(attr);
        let name = ((type == "text") ? attr : "plain");
        let resl = (new Function(`class ${name}\n{\n}\nreturn new ${name}`))();

        if (type == "knob"){ resl.define(attr) };
        return resl;
    };
// ----------------------------------------------------------------------------------------------------------------------------




// func :: texted : returns text-version of anything given in `what`
// ----------------------------------------------------------------------------------------------------------------------------
    const texted = function texted(what)
    {
        if (!what){return (what+"")}; // anything that isn't a thing will be handled this way .. for realzies
        let tpe,rsl;  tpe = detect(what); if (tpe == "main"){return ":MAIN:"}; // woa -big one!
        if ((typeof what.toString)=="function"){return what.toString()}; // as intended .. namaste
        if(what instanceof HTMLElement){return what.outerHTML}; // gimme' dat html pleeeze
        if(what.body instanceof HTMLElement){return what.body.parentNode.outerHTML}; // oh yeah! -keep it comin'!
        if ((tpe != "knob") && (tpe != "list")){return (what+"")}; // whatever this was -is now text!

        rsl = ((tpe=="knob") ? {} : []); // re-build the result, but text everything eventually .. here we go!

        for (let idx in what)
        {
            if (!what.hasOwnProperty(idx)){continue}; // not interesting
            if (what[idx] === what){rsl[idx]=":CYCLIC:"; continue}; // dodged a bullet there .. whew
            rsl[idx] = texted(what[idx]); // however deep you're hiding, you will be texted!
        };

        rsl = JSON.stringify(rsl); // booYAA!!
        return rsl;
    };
// ----------------------------------------------------------------------------------------------------------------------------




// func :: parsed : returns implied data-version of text given in v .. covers a load of practical use cases
// ----------------------------------------------------------------------------------------------------------------------------
    const parsed = function parsed(v)
    {
    // .. validation to prvent nasty debug issues .. prep for processing .. parse out most complex first
    // ------------------------------------------------------------------------------------------------------------------------
        if((typeof v) !== "string"){return v}; // already parsed
        let t,r,d,w,p; t=v.trim();  if(!t){return t}; v=VOID; // set short vars .. trim text .. free up memory

        if ( (t.startsWith("function ")||t.startsWith("(")) && (t.hasAny("){",")=>",")\n")&&t.hasAny("}")) ) // for function
        {
            r=(new Function("let f="+t+"\nreturn f"))(); // `r` is now a function
            return r; // kept here for testing .. and for your eyes to tear less
        };
    // ------------------------------------------------------------------------------------------------------------------------


    // JSON-ish \\
    // ------------------------------------------------------------------------------------------------------------------------
        try{r=JSON.parse(t); return r} // JSON does most of the heavy lifting .. though things may get weird with config...
        catch(e) // ...it just got wierd
        {
            try{r=JSON.parse("{"+t+"}"); return r}catch(er) // ..wrapped with curlies -hey if it works, why not
            {
                try{r=JSON.parse("["+t+"]"); return r}catch(err){} // ..squaries -same idea .. if fail we improvise below
            }
        };
    // ------------------------------------------------------------------------------------------------------------------------


    // .. prep for further processing if possible, or return trimmed input if not
    // ------------------------------------------------------------------------------------------------------------------------
        if (t.startsWith("?")){t=t.slice(1); if(!t){return "?"}}; // prep for URi-decoding .. or not
        t=t.split(";").join("\n").split("&").join("\n").trim(); // convert statements to newlines
        w=t.expose(FRST,LAST);  if(t.hasAny("()","[]","{}","<>")){t=t.slice(1,-1).trim()}; // unwrap if text is context-wrapped
        d=t.hasAny("\n", ",", ":","="); // get delimiter
        if (!d){return t}; // no delimiter .. return plain trimmed text
    // ------------------------------------------------------------------------------------------------------------------------


    // multi-line statements \\
    // ------------------------------------------------------------------------------------------------------------------------
        if(d=="\n") // use self to parse each line
        {
            r={}; t.split("\n").forEach((l)=> // loop through each line .. keep
            {
                l=l.trim(); if(!l){return}; // not interesting
                let o=parsed(l); // parsing of this line happens in the next code-block after this if/loop
                let k=length(r); // we're using this for key-name in case the parsed result is not an object
                if(!isKnob(o)){r[k]=o; return}; // an object was not returned, so we've added it as array item
                r.assign(o); // extend result with object
            });

            return r; // end multi-line statements
        };
    // ------------------------------------------------------------------------------------------------------------------------


    // single-line statement \\
    // ------------------------------------------------------------------------------------------------------------------------
        p=t.expose(d); // split on first occurance -once
        p[0]=p[0].trim();  p[2]=p[2].trim(); // clean up both sides of delimiter

        if (d==",")
        {
            r=[parsed(p[0])];  p=parsed(p[2]);
            if (detect(p)=="list"){r=r.concat(p)}else{r.push(p)};
            return r;
        };

        if ((d==":")||(d=="="))
        {
            let k=p[0];  w=k.expose(FRST,LAST);
            if(w.hasAny("''",'""',"``")){k=k.slice(1,-1)}; // clean up key
            r={[k]:parsed(p[2])}; return r;
        };

        return t; // return trimmed text
    // ------------------------------------------------------------------------------------------------------------------------
    };
// ----------------------------------------------------------------------------------------------------------------------------




// func :: params : get/normalize a list of arguments, for if a function was called with an array and `arguments` is used
// ----------------------------------------------------------------------------------------------------------------------------
    const params = function params(a)
    {
        if(SERVERSIDE&&((a===VOID)||(detect(a)=="numr")))
        {
            let l=process.argv; l.shift(); l.shift();
            return ((detect(a)=="numr") ? l[a] : l); // args from CLI
        };

        if(length(a)<1){return []}; // void or empty
        if(detect(a)!="list"){a=[a]} // to array
        else if(detect(a[0])=="list"){a=a[0]}; // sub-args-array

        return ([].slice.call(a));
    }
// ----------------------------------------------------------------------------------------------------------------------------




// func :: expect : assert identifier-type -or fail .. returns boolean
// ----------------------------------------------------------------------------------------------------------------------------
    const expect = function expect(what,tobe,func)
    {
        if (!isFunc(func))
        {
            func = function fulfil(type,tobe)
            {
                let resl = tobe.hasAny(type);  if (!!resl){return resl};
                throw `expecting ${tobe}`; return FALS;
            };
        };

        if(!!tobe && !!tobe.hasAny)
        {
            return func(detect(what),tobe);
        };

        return struct("methods").define
        ({
            as: function()
            {
                return func(detect(what),params(arguments));
            },

            tobe: function(that)
            {
                return (what === that);
            },
        });
    };
// ----------------------------------------------------------------------------------------------------------------------------




// func :: hard/soft/trap : returns hard/soft/trap symbols
// ----------------------------------------------------------------------------------------------------------------------------
    const hard = function hard(data)
    {
        let resl = struct("hard");
        resl.data = data;
        return resl;
    };

    const soft = function soft(data)
    {
        let resl = struct("soft");
        resl.data = data;
        return resl;
    };

    const trap = function trap(data)
    {
        let resl = struct("trap");
        resl.data = data;
        return resl;
    };
// ----------------------------------------------------------------------------------------------------------------------------




// func :: meta : returns object for trap-config
// ----------------------------------------------------------------------------------------------------------------------------
    const meta = function meta(what,defn)
    {
        if ((typeof what) != "string"){return}; // invalid
        what = what.split(":").join("").toLowerCase(); // prevent mishaps and enhance API usability

        if (what == "soft"){ return {enumerable:FALS, value:defn} };
        if (what == "hard"){ return {configurable:FALS, enumerable:FALS, writable:FALS, value:defn} };
        if (what == "trap")
        {
            let trap = {};  if ((typeof defn) != "function"){ defn=function(){} };
            ("get set apply construct").split(" ").forEach((word)=>
            { trap[word] = defn.rename(word) }); // for dynamic reflection .. renamed function according to each trap
            return trap;
        };
    };
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Object.define : define properties .. shorhand for Object.defineProperty
// ----------------------------------------------------------------------------------------------------------------------------
    Object.defineProperty(Object.prototype, "define", meta("hard",function define()
    {
        let defn,temp,name,rigd,data;  defn=(arguments)[0]; // definition is first param

        if (detect(defn) == "text") // for words as flags
        {
            temp = defn.trim().split("\n").trim().join(" ").split(" "); // sanitize
            defn = {};  temp.forEach((item)=> // go through each, trim, validate, assign values as key-names wraped in ::
            { item=item.trim(); if (!item){return}; defn[item]=(":"+item+":")});  temp=VOID; // clean up! .. still in context
        };

        if (detect(defn) != "knob"){moan("expecting object"); return}; // you have died

        for (name in defn) // defn is now an object .. validate and set rigitity
        {
            if (!name || !defn.hasOwnProperty(name)){continue};  rigd="hard"; // property validation .. rigidity is `hard`
            data = defn[name]; try{ delete this[name] }catch(e){}; // try remove before illegal-rename
            temp = ((!!data && !!data.constructor) ? data.constructor.name : "!"); // name of possible constructor .. or not
            if (("hard soft trap").indexOf(temp) > -1){ rigd=temp; data=data.data }; // implied rigidity structures with data
            if (((typeof data)=="function") && !data.name){Object.defineProperty(data,"name",{value:name})}; // for debugging
            Object.defineProperty(this, name, meta(rigd,data)); // apply definition .. if anything went wrong, check errors
        };

        defn=VOID; temp=VOID; name=VOID; rigd=VOID; data=VOID;  // clean up!
        return this; // for your chainable pleasure ;)
    }));
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Object.assign : define properties .. shorhand for Object.assign
// ----------------------------------------------------------------------------------------------------------------------------
    Object.prototype.define
    ({
        assign: function(obj)
        {
            Object.assign(this,obj);
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Array.trim() : apply `trim` to array of strings
// ----------------------------------------------------------------------------------------------------------------------------
    Array.prototype.define
    ({
        trim: function trim()
        {
            this.forEach((itm,idx)=>
            {
                if((typeof itm) !== "string"){return};
                this[idx] = itm.trim();
            });
            return this;
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// defn :: (global constants) : to use everywhere .. mostly for system flags and syntax-sugar
// ----------------------------------------------------------------------------------------------------------------------------
    MAIN.define
    (`
        A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
        OK NA
        ANY ALL ASC DSC GET SET RIP BGN END
        INIT AUTO COOL DARK LITE INFO GOOD NEED WARN FAIL NEXT SKIP STOP DONE ACTV NONE BUSY KEYS VALS ONCE EVRY BFOR AFTR
        UNTL EVNT FILL TILE SPAN OPEN SHUT SELF VERT HORZ DEEP OKAY DUMP PROC FILE FRST LAST MIDL SOME WRAP
        CLIENT SERVER PLUGIN SILENT UNIQUE COPIES FORCED PARTED EXCEPT
    `);
// ----------------------------------------------------------------------------------------------------------------------------




// func :: global : get/set global variables
// ----------------------------------------------------------------------------------------------------------------------------
    MAIN.define({global:function global(defn)
    {
        let type,temp,resl;
        type = detect(defn);

        if (type == "text")
        {
            // resl = (new Function(`try{return ${defn};}catch(e){};`))(); // constants .. this won't work in module
            resl = MAIN[defn];
            return resl;
        };

        if (type == "func")
        {
            defn = {[(defn.name||"anonymous")]:defn};
        }

        MAIN.define(defn);
    }});


    global
    ({
        MAIN: MAIN,
        VOID: VOID,
        NULL: NULL,
        TRUE: TRUE,
        FALS: FALS,
        dump: dump,
        moan: moan,
        descry: descry,
        ENVITYPE: ENVITYPE,
        CLIENTSIDE: CLIENTSIDE,
        SERVERSIDE: SERVERSIDE,
        PLUGINSIDE: PLUGINSIDE,
        PROCTYPE: PROCTYPE,
        detect: detect,
        texted: texted,
        struct: struct,
        parsed: parsed,
        params: params,
        expect: expect,
        hard: hard,
        soft: soft,
        meta: meta,
    });
// ----------------------------------------------------------------------------------------------------------------------------




// tool :: device
// ----------------------------------------------------------------------------------------------------------------------------
    global(class device
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
                        if (!(val instanceof driver)){ throw "expecting instanceof driver"; return };
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




// tool :: driver : reactive proxy
// ----------------------------------------------------------------------------------------------------------------------------
    global(class driver
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
                if (isFunc(cfg)){ cfg=meta("trap") };
                if (isMeta(cfg)){ this.config = cfg };
            };

            return new Proxy(this.memory.target, this.config);
        }
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: stable : check if environment is stable .. designed to run fast as it is used in .peruse
// ----------------------------------------------------------------------------------------------------------------------------
    global(function stable(name)
    {
        if(!MAIN.HALT){return TRUE};
        moan("`"+name+"` is unstable");
        return FALS;
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: sha256 : secure hash algorithm 256
// ----------------------------------------------------------------------------------------------------------------------------
    global(function sha256(d)
    {
        function g(p,q){return p>>>q|p<<32-q} for(var c=Math.pow,m=c(2,32),a,r="",f=[],h=8*d.length,b=sha256.h=sha256.h||[],n=
        sha256.k=sha256.k||[],k=n.length,l={},e=2;64>k;e++) if(!l[e]){for(a=0;313>a;a+=e)l[a]=e;b[k]=c(e,.5)*m|0;n[k++]=
        c(e,1/3)*m|0} for(d+="\u0080";d.length%64-56;)d+="\x00";for(a=0;a<d.length;a++){c=d.charCodeAt(a);if(c>>8)return;
        f[a>>2]|=c<<(3-a)%4*8}f[f.length]=h/m|0;f[f.length]=h;for(c=0;c<f.length;){d=f.slice(c,c+=16);m=b;b=b.slice(0,8);
        for(a=0;64>a;a++)k=d[a-15],l=d[a-2],h=b[0],e=b[4],k=b[7]+(g(e,6)^g(e,11)^g(e,25))+(e&b[5]^~e&b[6])+n[a]+(d[a]=16>a?d[a]:
        d[a-16]+(g(k,7)^g(k,18)^k>>>3)+d[a-7]+(g(l,17)^g(l,19)^l>>>10)|0),h=(g(h,2)^g(h,13)^g(h,22))+(h&b[1]^h&b[2]^b[1]&b[2]),
        b=[k+h|0].concat(b),b[4]=b[4]+k|0;for(a=0;8>a;a++)b[a]=b[a]+m[a]|0}for(a=0;8>a;a++)
        for(c=3;c+1;c--)f=b[a]>>8*c&255,r+=(16>f?0:"")+f.toString(16); return r;
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: length : length of anything .. `length.is()` -to verify/assert length
// ----------------------------------------------------------------------------------------------------------------------------
    global(function length(d,x)
    {
        if((d===NULL)||(d===VOID)||(!d&&isNaN(d))){return 0};  if(!isNaN(d)){d+=""};
        if(x&&((typeof x)=="string")&&((typeof d)=="string")){d=(d.split(x).length-1); return d};
        let s=d.length; if(!isNaN(s)){return s;};
        try{s=Object.getOwnPropertyNames(d).length; return s;}
        catch(e){return 0;}
    });


    length.define
    ({
        is: function is(d,g,l)
        {
            if(g===VOID){return TRUE};
            let s=(((typeof d)=="number") ? d : length(d));
            g=(g||0); l=(l||s);
            return ((s>=g) && (s<=l));
        }
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: hashed : make sha256 from anything
// ----------------------------------------------------------------------------------------------------------------------------
    global(function hashed(defn)
    {
        if (isVoid(defn) || (defn === UNIQUE)) // if this below is not "unique" enough .. bite me!
        { defn = (Date.now()+""+performance.now()+""+(Math.random().toString(36).slice(2,12)))};
        return sha256(texted(defn)); // yes it's short .. and oh so sweet
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Object.expose : split up an object into its constituents .. applies to arrays too
// ----------------------------------------------------------------------------------------------------------------------------
    Object.prototype.define
    ({
        expose:function expose(what,indx)
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
        },
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
            let resl;

            if (isKnob(this))
            {
                resl = struct(name);
                this.peruse((val,key)=>{ resl[key] = val });
                return resl;
            };

            if (isFunc(this))
            {
                resl = this.expose();  resl.nick = name;
                resl = parsed(resl.toString());
                return resl;
            };
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Object.modify() : this also affects arrays
// ----------------------------------------------------------------------------------------------------------------------------
    Object.prototype.define
    ({
        modify:function modify(conf)
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
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shiv :: (types) : shorthands to identify variables .. g & l is "greater-than" & "less-than" -which counts items inside v
// ----------------------------------------------------------------------------------------------------------------------------
    global(function isVoid(v){return (v===VOID)});
    global(function isNull(v){return (v===NULL)});
    global(function isBool(v){return ((v===TRUE)||(v===FALS))});


    global(function isNumr(v,g,l){return (((typeof v)==="number") && length.is(v,g,l))});
    global(function isFrac(v,g,l){if(!isNumr(v)||((v%1)===0)){return FALS}; return length.is(v,g,l)});
    global(function isInum(v,g,l){if(!isNumr(v)||isFrac(v)){return FALS}; return length.is(v,g,l)});


    global(function isText(v,g,l){if((typeof v)!=="string"){return FALS}; return length.is(v,g,l)});

    global(function isWord(v,g,l)
    { return ((v+"").shaved("_").assert(/^([a-zA-Z])([a-zA-Z0-9_]{1,35})+$/) && length.is(v,g,l)) });

    global(function isJson(v,g,l)
    { return (((typeof v)==="string") && v.expose(BGN,END).hasAny('[]','{}','""') && length.is(v,g,l)) });

    global(function isPath(v,g,l)
    {
        let t,c;  t=(v+"");
        if (!t.startsWith("/") && !t.startsWith("./") && !t.startsWith("../")){ return FALS }; // invalid path
        if (["/", "~", ".", "~/", "..", "../"].hasAny(t)){return length.is(v,g,l)};  // shortest paths
        return (t.assert(/^([a-zA-Z0-9-\/\.\s_@~$]){2,864}$/) && length.is(v,g,l));  // returns bool
    });


    global(function isBare(v,deep)
    {
        let w=detect(v); if(w=="func"){v=v.expose("body"); w="list"};
        if(!deep){if(v===0){return TRUE}; return ("text,list,knob".hasAny(w) ? (length(v)<1) : VOID)};
        if(w=="void"){return TRUE}; if(w=="bool"){return FALS}; if(w=="numr"){return ((v===0)?TRUE:FALS)};
        if(w=="list"){v=v.join("")}else if(w=="knob"){v=(keys(v)).concat(vals(v)).join("")};
        if(isText(v)){v=trim(v)}; return (length(v)<1);
    });


    global(function isDurl(v,g,l){return (isText(v)&&(v.indexOf('data:')===0)&&(v.indexOf(';base64,')>0))});
    global(function isPurl(v,g,l)
    {
        if(!isText(v)){return FALS}; let t=v.split("?")[0].split("://")[1]; if(!t){return FALS};
        return length.is(v,g,l);
    });


    global(function isBufr(v,g,l)
    {
        if(!(v instanceof ArrayBuffer) || (Object.prototype.toString.call(v)!=="[object ArrayBuffer]")){return FALS};
        return length.is(v,g,l);
    });


    global(function isList(v,g,l)
    {
        return ((detect(v) === "list") ? length.is(v,g,l) : FALS);
    });


    global(function isData(v,g,l)
    {
        if(!isList(v)||!isKnob(v[0])){return FALS};
        let frk,lrk; frk=keys(v[0]).join(""); lrk=keys(v[(v.length-1)]).join("");
        if((frk.length<1)||(frk!==lrk)){return FALS};
        return length.is(v,g,l)
    });

    // KNOB = Key-Notation OBject
    global(function isKnob(v,g,l){return (((typeof v)=="object") && (v!==NULL) && !isList(v) && length.is(v,g,l))});
    global(function isFunc(v,g,l){return (((typeof v)==="function") && length.is(v,g,l))});


    global(function isNode(v,g,l)
    {return (isKnob(v) && isFunc(v.getBoundingClientRect) && length.is(v.childNodes.length,g,l))});


    global(function isLive(v)
    {
        if(!isNode(v)||!isNode(v.parentNode)){return FALS};
        // TODO :: if isText && ping v ?? .. could be nice no?
        return TRUE;
    });


    global(function isTemp(v){return (v instanceof DocumentFragment)});


    global(function isDeep(v,g,l)
    {
        let r,f; r=FALS; f="list,knob,func";
        if(!f.hasAny(detect(v))){return r}; // must be enumerable object/array
        v.peruse((i)=>{if(f.hasAny(detect(v))){r=TRUE; return STOP}});
        return r;
    });


    global(function isRegx(v,g,l)
    {
        return ((detect(v)==="regx") && length.is(v,g,l));
    });


    global(function isMain(a)
    {
        if(isText(a))
        {
            if(a === FILE){return (process.mainModule.filename === __filename)};
            if(a === PROC){return (PROCTYPE.slice(4) === "master")};
            return; // invalid args were given
        };

        return (!!a.global && a.global.toString() === MAIN.global.toString());
    });


    global(function isMeta(v,g,l)
    {
        if (!(detect(v)==="knob") || !length.is(v,g,l)){return FALS}; // validation before it gets complicated

        let reserved = "apply construct defineProperty deleteProperty get getOwnPropertyDescriptor getPrototypeOf has "+
                       "ownKeys preventExtensions set setPrototypeOf writable enumerable configurable value";
        return reserved.hasAny(v.expose(KEYS)); // returns first if found, else false
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: String.assert : run a test against some string/object .. exp can be a function, or RegExp .. returns boolean
// ----------------------------------------------------------------------------------------------------------------------------
    String.prototype.define
    ({
        assert: function assert(exp)
        {
            let txt = (this+"");  if(isText(exp)){exp = new RegExp(exp)};

            if(isFunc(exp)){return (!!exp(txt))};
            if(isRegx(exp)){return (!!exp.test(txt))};

            return (!!exp);
        },
    });

    Object.prototype.define
    ({
        assert: function assert(exp)
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
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Object.tunnel : manage object/array-properties multidimensionally by tunneling via path .: `arm/hand/fingers/2/nail`
// ----------------------------------------------------------------------------------------------------------------------------
    Object.prototype.define
    ({
        tunnel: function tunnel(path,valu,flag)
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
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// tool :: Relay : extendable Proxy
// ----------------------------------------------------------------------------------------------------------------------------
    global(class Relay
    {
        constructor(trgt,conf)
        {
            if (isFunc(conf)){ conf=meta("trap") };
            // let resl = new Proxy(trgt,conf);
            // resl.define({target:trgt});
            // return resl;
        }
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Object.hijack : Object.defineProperty
// ----------------------------------------------------------------------------------------------------------------------------
    Object.prototype.define
    ({
        hijack:function hijack(conf)
        {
            let trgt = (this || struct("decoy"));
            if (isFunc(conf)){ conf=meta("trap",conf) };
            if (isMeta(conf)){ return (new Relay(trgt,conf)) };
        },
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




// shim :: CustomEvent.cancel : nullify CustomEvent
// ----------------------------------------------------------------------------------------------------------------------------
    CustomEvent.prototype.define
    ({
        cancel: function cancel()
        {
            this.preventDefault();
            this.stopPropagation();
            this.stopImmediatePropagation();
            this.define({halted:TRUE});
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Object.vivify : turn object into event emitter, if not already
// ----------------------------------------------------------------------------------------------------------------------------
    Object.prototype.define
    ({
        vivify: function vivify(conf)
        {
            if (!!this.events){return this}; // already vivified

            let myself = (this || new struct("entity")); // if called globally, `this` is undefined, so you get an entity lol

            myself.define
            ({
                events: {}, // event names are stored in here as objects, each with keys as hashes and values as functions


                listen: function listen(evnt,func)
                {
                    if (!this.events[evnt]){this.events[evnt] = {}}; // if event-name does not exist, create it
                    let hash = hashed(func);  this.events[evnt][hash] = func; // store each function at hash-key of event
                    return this; // makes methods chainable .. you're welcome :D
                },


                signal: function signal(evnt,data)
                {
                    if (!this.events[evnt]){return this}; // no listeners
                    evnt = new CustomEvent(evnt,{detail:data}); // prepare payload as event
                    evnt.define({cancel:function(){}});
                    var todo=length(this.events[evnt]), done=0, temp, asnc=0; // for tracking progress

                    this.events[evnt].peruse((func)=> // call each function in this event
                    {
                        if (evnt.haled){done=todo; return STOP} // cancelled
                        else
                        {
                            temp = func.apply(this,[evnt]);
                            if (!!temp && isFunc(temp.then)) // check for returned promise
                            {
                                asnc=1; temp.then(()=> // async
                                {
                                    done++;  if (todo==done)
                                    {
                                        if (evnt == "eventsIdle"){ delete this.events[evnt] }
                                        else { this.signal("eventsIdle",evnt) }
                                        evnt=VOID; data=VOID; todo=VOID; done=VOID; temp=VOID; asnc=VOID; // clean up!
                                    };
                                });
                                return; // async
                            }

                            done++; // not async!
                        };
                    });

                    if (!asnc && (todo==done))
                    {
                        if (evnt == "eventsIdle"){ delete this.events[evnt] }
                        else { this.signal("eventsIdle",evnt) }
                        evnt=VOID; data=VOID; todo=VOID; done=VOID; temp=VOID; asnc=VOID; // clean up!
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

            if (conf){ this.hijack(conf) };
            return myself;
        }
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: random : return a random string of specified length
// ----------------------------------------------------------------------------------------------------------------------------
    global(function random(span,type)
    {

    });
// ----------------------------------------------------------------------------------------------------------------------------




// proc :: module : export
// ----------------------------------------------------------------------------------------------------------------------------
    export { MAIN };
// ----------------------------------------------------------------------------------------------------------------------------
