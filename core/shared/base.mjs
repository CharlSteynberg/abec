



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

        if (detect(defn) != "knob"){ throw "expecting definition-object, or named-function, or words"; return }; // you shall not pass!!

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
        let t,r,d,w,p,q; t=v.trim();  if(!t){return t}; v=VOID; // set short vars .. trim text .. free up memory
        // w = t.expose(FRST,LAST);  if ((w==`<>`) && t.hasAny(`</`,`/>`)){ return txml.parse(t) }; // XML,SVG,HTML,etc
        w = t.expose(FRST,LAST);  if ((w==`<>`) && t.hasAny(`</`,`/>`)){ return `undefined XML` }; // XML,SVG,HTML,etc
    // ------------------------------------------------------------------------------------------------------------------------


    // function \\
    // ------------------------------------------------------------------------------------------------------------------------
        if ( (t.startsWith("function ")||t.startsWith("(")) && (t.hasAny("){",")=>",")\n")&&t.hasAny("}")) ) // for function
        {
            r=(new Function("let f="+t+"\nreturn f"))(); // `r` is now a function
            return r; // kept here for testing .. and for your eyes to tear less
        };
    // ------------------------------------------------------------------------------------------------------------------------


    // JSON -ish \\
    // ------------------------------------------------------------------------------------------------------------------------
        try{r=JSON.parse(t); return r} // JSON does most of the heavy lifting .. though things may get weird with config...
        catch(e) // ...it just got wierd
        {
            q = t.shaved(",");  try{r=JSON.parse("{"+q+"}"); return r}catch(er) // ..try wrap with curlies
            { try{r=JSON.parse("["+q+"]"); return r}catch(err){} } // ..try wrap with squaries
        };
    // ------------------------------------------------------------------------------------------------------------------------


    // .. prep for further processing if possible, or return trimmed input if not
    // ------------------------------------------------------------------------------------------------------------------------
        if (t.startsWith("?")){t=t.slice(1); if(!t){return "?"}}; // prep for URi-decoding .. or not
        t=t.split(";").join("\n").split("&").join("\n").trim(); // convert statements to newlines
        if(t.hasAny("()","[]","{}","<>")){t=t.slice(1,-1).trim()}; // unwrap if in context
        d=t.hasAny("\n", ",", ":", "="); // get delimiter
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
