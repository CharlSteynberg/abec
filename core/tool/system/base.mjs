



// tool :: txml : awesome XML parsing lib .. https://github.com/TobiasNickel/tXml.git
// ----------------------------------------------------------------------------------------------------------------------------
    import * as tXml from "./txml.mjs";
// ----------------------------------------------------------------------------------------------------------------------------





// defn :: (constants) : useful for if another script overwrites something we need
// ----------------------------------------------------------------------------------------------------------------------------
    Object.defineProperty(globalThis, "MAIN", {configurable:false, enumerable:false, writable:false, value:globalThis});

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




// defn :: PROCBASE,PROCROLE,PROCTYPE :
// ----------------------------------------------------------------------------------------------------------------------------
    const PROCBASE = ( SERVERSIDE ? "server" : "client" ); // "client" or "server"

    const PROCROLE = (function()
    {
        if (SERVERSIDE){ return ((process.argv[2]==="child") ? "worker" : "master") }; // server-side
        return (((typeof MAIN.document)==="undefined") ? "worker" : "master"); // client-side
    }());

    const PROCTYPE = ( PROCBASE +"-"+ PROCROLE ); // e.g: server-master .. or client-worker .. etc.
// ----------------------------------------------------------------------------------------------------------------------------




// func :: detect : concise `typeof` .. returns 4-letter word
// ----------------------------------------------------------------------------------------------------------------------------
    const detect = function detect(defn)
    {
        let type,kind;  if(defn === null){return "null"};

        type = (typeof defn).slice(0,4);  if(type == "unde"){return "void"};
        kind = descry(defn).split("/").pop().slice(0,4);

        if((type=="func") && ((typeof defn.constructor)=="function") && (defn.constructor.name !== "Function")){return "tool"}
        else if ((type=="obje") && ((typeof defn.hasOwnProperty)!="function")){ return "tool"}
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
        let defn,type,temp,name,rigd,data;  defn=(arguments)[0];  type=detect(defn); // definition is first param

        if ((type == "func") && !!defn.name)
        { defn = {[defn.name]:defn} } // make defn obj using function name .. try not to fail
        else if (detect(defn) == "text") // for words as flags
        {
            temp = defn.trim().split("\n").trim().join(" ").split(" "); // sanitize
            defn = {};  temp.forEach((item)=> // go through each, trim, validate, assign values as key-names wraped in ::
            { item=item.trim(); if (!item){return}; defn[item]=(":"+item+":")});  temp=VOID; // clean up! .. still in context
        };

        if (detect(defn) != "knob"){ throw "expecting definition-object, or named-function, or words"; return }; // validation

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




// shim :: Array.trim() : apply `trim` to array of strings
// ----------------------------------------------------------------------------------------------------------------------------
    Array.prototype.define(function trim()
    {
        this.forEach((itm,idx)=>
        {
            if((typeof itm) !== "string"){return};
            this[idx] = itm.trim();
        });
        return this;
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




// func :: copied : duplicate .. if numr or text then n repeats n-times
// ----------------------------------------------------------------------------------------------------------------------------
    const copied = function copied(v,n, r,t)
    {
        t = detect(v); if((t=="void")||(t==="null")||(t=="bool")||(v==="")){return v}; // cannot copy
        if ((t==="numr")||(t==="text")){if(!n){return v}; v=(v+""); n=parseInt(n); r=""; for(let i=0;i<n;i++){r+=v}; return r};
        if (((typeof Element)!=="undefined")&&(v instanceof Element)){return (v.cloneNode(true))};
        if (t==="list"){r=[]; v=([].slice.call(v)); v.forEach((i)=>{r.push(copied(i))}); return r};
        if (t==="knob"){r={}; for(let k in v){if(!v.hasOwnProperty(k)){continue}; r[k]=copied(v[k])}; return r};
        if (t==="func")
        {
            r=new Function("try{return "+v.toString()+"}catch(e){return}")(); if(isVoid(r))
            {fail("copy :: something went wrong; check the console"); moan("tried to copy:\n"+v.toString()); return};
            Object.keys(v).forEach((fk)=>{r[fk]=copied(v[fk])});
            return r;
        };

        moan("failed to copy "+t);
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




// func :: parsed : returns implied data-version of text given in `defn` .. very useful
// ----------------------------------------------------------------------------------------------------------------------------
    const parsed = function parsed(defn)
    {
        if ((typeof defn) !== "string"){ return defn }; // already parsed
        let text,resl;  text = defn.trim();
        let dlim = text.hasAny("\n", ";", ",", ":","=");  defn=VOID; // clean up so we can start

        for (let type in this)
        {
            if (!this.hasOwnProperty(type)){ continue }; // not interesting
            resl = this[type](text,dlim);  if (resl === VOID){ continue }; // try next parser
            text=VOID;  break; // parser worked! .. clean up memory
        };

        if (!text && !!resl){ return resl }; // we have results!
        return text; // well at lest we trimmed it for you :D
    }
    .bind
    ({
        null: function(text)
        {
            text = text.toLowerCase().slice(0,9);
            return ((["?","null","undefined"].indexOf(text) > -1) ? null : VOID);
        },


        bool: function(text)
        {
            text = text.toLowerCase().slice(0,9);
            return ((this.TRUE.indexOf(text) > -1) ? true : ((this.FALS.indexOf(text) > -1) ? false : VOID));
        }
        .bind
        ({
            TRUE: ["true", "yes", "on", "good", "yebo", "y", "+"],
            FALS: ["false", "no", "off", "bad", "fals", "n", "-"],
        }),


        func: function(text)
        {
            if (!(text.startsWith("function ")||text.startsWith("("))){ return }; // does not look like a function
            if (!(text.hasAny("){",")=>",")\n")&&text.hasAny("}"))){ return }; // .. malformed, or broken
            return (new Function("let f="+text+"\nreturn f"))(); // happy hacking :D
        },


        href: function(text)
        {
            let resl;  if ((text.indexOf(" ") > -1) || (text.indexOf("\n") > -1)){ return }; // not URL
            try{ resl = new URL(text) }catch(er){ return };
            resl.searchParams = Object.fromEntries(resl.searchParams);
            return resl;
        },


        qstr: function(text)
        {
            let resl;  if (!(/^(\?|\&)([\w-]+(=[\w-]*)?(&[\w-]+(=[\w-]*)?)*)?$/).test(text)){ return }; // not QRY
            // if (!text.slice(0,1).hasAny("?","&") || text.hasAny(" ","\n") || (text.indexOf("=") < 1)){ return }; // not QRY
            try{ resl = new URLSearchParams(text) }catch(er){ return };
            resl = Object.fromEntries(resl);
            return resl;
        },


        txml: function(text)
        {
            let resl,wrap;  wrap = text.expose(FRST,LAST);
            if ((wrap!=`<>`) || !text.hasAny(`</`,`/>`)){ return }; // not XML
            try{ resl = tXml.parse(text) }catch(er){ return };
            return resl;
        },


        xatr: function(text)
        {
            if (text.hasAny("\n") || !text.hasAll(`=`,`"`,` `)){ return }; // not ATR .. or simple enough to split
            let resl = this.xml("<obj "+text+" ></obj>");  if (!resl){ return }; // not ATR
            return resl[0].attributes;
        },


        json: function(text)
        {
            let resl;  text = text.shaved(",");
            try{ resl = JSON.parse(text);  return resl }catch(er)
            {
                try { resl = JSON.parse("{"+text+"}");  return resl }catch(er) // ..try wrap with curlies
                { try{ resl = JSON.parse("["+text+"]"); return resl }catch(err){} } // ..try wrap with squaries
            };
        },


        mlti: function(text,dlim)
        {
            if (!dlim || !dlim.hasAny("\n",";") || !text.hasAny(dlim)){ return }; // not multi-line
            let resl = [];  text.split(dlim).forEach((line)=>
            {
                let temp = parsed(line);  if (temp === VOID){ return }; // next
                if ((detect(temp) != "knob") && !!resl.push){ resl.push(temp) }
                else{ temp.peruse((val,key)=>{resl[key]=val}) };  temp = VOID; // clean up!
            });

            text=VOID; // clean up!
            return resl;
        },


        list: function(text,dlim)
        {
            if (dlim !== ","){ return }; // not array
            let resl = [];  text.split(",").forEach((item)=>{ resl.push(parsed(item)) });
            return resl;
        },


        knob: function(text,dlim)
        {
            if ((dlim !== ":") && (dlim !== "=")){ return }; // not object
            let resl,name,valu; resl = {};  text = text.split(dlim);
            name = text[0].trim();  valu = text[1].trim();

            return resl;
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: params : get/normalize a list of arguments .. if `a` is omitted then implied `argv[]` id used/improvised
// ----------------------------------------------------------------------------------------------------------------------------
    const params = function params(a, r)
    {
        if (a===VOID) // get server.argv, or client.URLSearchParams
        {
            if (CLIENTSIDE)
            { r = new URLSearchParams(location.search) }
            else
            {
                r = this.argv;  if (r){return r};
                r = process.argv;  r.shift();  r.shift();
                r = parsed(r.join("\n"));  if (isText(r)){ r = [r] };
                this.argv = r;

            }
            return r;
        };

        if (length(a) < 1){ return [] }; // void or empty
        r = ((detect(a)!="list") ? [a] : ((detect(a[0])=="list") ? a[0] : a)) // cast to array .. exhume 1st if it is array
        return ([].slice.call(r)); // normalize `arguments`
    }
    .bind({}); // keep this!
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




// func :: global : get/set global variables
// ----------------------------------------------------------------------------------------------------------------------------
    MAIN.define(function global(defn)
    {
        let type,temp,resl;
        type = detect(defn);

        if (type == "text")
        {
            // resl = (new Function(`try{return ${defn};}catch(e){};`))(); // constants .. this won't work in module
            resl = MAIN[defn];
            return resl;
        };

        MAIN.define(defn);
    });


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
        PROCBASE: PROCBASE,
        PROCROLE: PROCROLE,
        PROCTYPE: PROCTYPE,
        detect: detect,
        texted: texted,
        struct: struct,
        copied: copied,
        parsed: parsed,
        params: params,
        expect: expect,
        hard: hard,
        soft: soft,
        meta: meta,
    });


    global
    ({
        RESERVED:
        {
            meta: "apply construct defineProperty deleteProperty get getOwnPropertyDescriptor getPrototypeOf has "+
                  "ownKeys preventExtensions set setPrototypeOf writable enumerable configurable value",
        },
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
