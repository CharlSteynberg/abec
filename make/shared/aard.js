



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




// func :: typeOf : concise `typeof` .. returns 4-letter word
// ----------------------------------------------------------------------------------------------------------------------------
    const typeOf = function typeOf(defn)
    {
        let type,kind;  if(defn === null){return "null"};

        type = (typeof defn).slice(0,4);  if(type == "unde"){return "void"};
        kind = Object.prototype.toString.call(defn).toLowerCase().slice(1,-1).split(" ").pop().slice(0,4);

        if((type=="func") && ((typeof defn.constructor)=="function")){dump(defn.name); kind="tool"};
        if(("arra argu list coll").indexOf(kind) > -1){type="arra"};

        return (this[kind] || this[type] || kind);
    }
    .bind
    ({
        wind:"main", glob:"main", numb:"numr", stri:"text", html:"node", arra:"list", obje:"knob", rege:"regx",
    });
// ----------------------------------------------------------------------------------------------------------------------------




// tool :: symbol : use as system flag
// ----------------------------------------------------------------------------------------------------------------------------
    class symbol
    {
        constructor(name,data)
        {
            this.name = name;
            this.data = data;
            return this;
        }
    }
// ----------------------------------------------------------------------------------------------------------------------------




// func :: hard/soft : returns hard/soft symbols
// ----------------------------------------------------------------------------------------------------------------------------
    const hard = function hard(data)
    {
        return (new symbol("hard",data));
    };

    const soft = function soft(data)
    {
        return (new symbol("soft",data));
    };
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Object.define : define properties .. shorhand for Object.defineProperty
// ----------------------------------------------------------------------------------------------------------------------------
    Object.defineProperty(Object.prototype,"assign",{writable:FALS, enumerable:FALS, configurable:FALS, value:function assign()
    {
        let defn,name,hard,data,conf; defn = (arguments)[0];
        if(typeOf(defn) != "knob"){moan("expecting object"); return};

        for (name in defn)
        {
            if(!defn.hasOwnProperty(name)){continue};
            if(!name){console.error("invalid property name"); continue}; // property validation

            data = defn[name]; if((data instanceof symbol)){hard=(data.name=="hard"); data=data.data};

            if(!hard)
            {
                this[name] = data;
            }
            else
            {
                delete this[name];
                Object.defineProperty(this,name,{writable:FALS, configurable:FALS, enumerable:FALS, value:data});
            };
        };

        return this;
    }});
// ----------------------------------------------------------------------------------------------------------------------------




// func :: glob : define global variables
// ----------------------------------------------------------------------------------------------------------------------------
    MAIN.assign({glob:function glob(defn)
    {
        let type,resl; type = typeOf(defn);
        if(type == "func")
        {
            defn = {[(defn.name||"anonymous")]:defn};
        }
        else if(type == "text")
        {
            if(defn.indexOf(" ")<1)
            {
                resl = (new Function(`try{return ${defn};}catch(e){};`))();
                if((resl === VOID) && (MAIN[defn] === VOID)){return}
                else if((resl !== VOID) && (MAIN[defn] === VOID)){defn = {[defn]:resl}}
                else{return resl};
            }
            else
            {
                defn.split(" ").forEach((itm)=>
                {
                    resl = VOID;
                    resl = (new Function(`try{return ${itm};}catch(e){};`))();
                    if((resl === VOID) && (MAIN[defn] === VOID)){return}
                    else if((resl !== VOID) && (MAIN[defn] === VOID)){defn = {[defn]:resl}}
                    else{return resl};
                });
            }
        };
        MAIN.assign(defn);
    }});
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

    glob("MAIN VOID NULL TRUE FALS dump moan typeOf symbol hard soft ENVITYPE CLIENTSIDE SERVERSIDE PLUGINSIDE");



// func :: span : length of anything .. spanIs -to verify/assert span
// ----------------------------------------------------------------------------------------------------------------------------
    const span = function span(d,x)
    {
        if((d===NULL)||(d===VOID)||(!d&&isNaN(d))){return 0};  if(!isNaN(d)){d=(d+"")};
        if(x&&((typeof x)=="string")&&((typeof d)=="string")){d=(d.split(x).length-1); return d};
        let s=d.length; if(!isNaN(s)){return s;};
        try{s=Object.getOwnPropertyNames(d).length; return s;}
        catch(e){return 0;}
    };

    const spanIs = function spanis(d,g,l)
    {let s=(((typeof d)=="number")?d:span(d)); g=(g||0); l=(l||s); return ((s>=g)&&(s<=l))});
// ----------------------------------------------------------------------------------------------------------------------------




// shiv :: (types) : shorthands to identify variables .. g & l is "greater-than" & "less-than" -which counts items inside v
// ----------------------------------------------------------------------------------------------------------------------------
    const isVoid = function isVoid(v){return (v===VOID)};
    const isNull = function isNull(v){return (v===NULL)};
    const isBool = function isBool(v){return ((v===TRUE)||(v===FALS))};


    const isNumr = function isNumr(v,g,l){if(isNaN(v)||typeOf(v)!="numr")){return FALS}; return (isVoid(g)||spanIs(v,g,l))});
    const isFrac = function isFrac(v,g,l){if(!isNumr(v)||((v%1)>0)){return FALS}; return (isVoid(g)||spanIs(v,g,l))});
    const isInum = function isInum(v,g,l){if(!isNumr(v)||isFrac(v)){return FALS}; return (isVoid(g)||spanIs(v,g,l))};


    const isText = function isText(v,g,l){if(!((typeof v)==='string')){return FALS}; return (isVoid(g)||spanIs(v,g,l))};
    const isWord = function isWord(v,g,l){if(!test(trim(v,'_'),/^([a-zA-Z])([a-zA-Z0-9_]{1,35})+$/)){return}; return (isVoid(g)||spanIs(v,g,l))};
    const isJson = function isJson(v,g,l){return (isin(['[]','{}','""'],wrapOf(v))?TRUE:FALS);};
    const isPath = function isPath(v,g,l)
    {
        if(!test(v,/^([a-zA-Z0-9-\/\.\s_@~$]){1,432}$/)){return FALS}; if((v)!==(trim(v))){return FALS};
        return (((v[0]=='/')||(v[0]=='.')||(v[0]=='~'))&&(isVoid(g)||spanIs(v,g,l)))
    };
// ----------------------------------------------------------------------------------------------------------------------------





// ----------------------------------------------------------------------------------------------------------------------------
    const args = function args(a)
    {
        if(SERVERSIDE&&((a===VOID)||(typeOf(a)=="numr")))
        {
            let l=process.argv; l.shift(); l.shift();
            return ((typeOf(a)=="numr"))?l[a]:l); // args from CLI
        };

        if(span(a)<1){return []}; // void or empty
        if(typeOf(a)!="list")){a=[a]} // to array
        else if(typeOf(a[0])=="list")){a=a[0]}; // sub-args-array

        return ([].slice.call(a));
    }
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: String.hasAny / .hasAll : shorthands & improv for String.includes
// ----------------------------------------------------------------------------------------------------------------------------
   String.prototype.assign
   ({
       hasAny:function hasAny(inst,posi)
       {
           if(){};
           return ((this+"").indexOf(x)>-1);
       },

       hasAll:function hasAll()
       {
           let h,a,s,f; h=(this+""); a=args(arguments); s=span(a); f=0;
           a.forEach((n)=>{if(isin(h,n)){f++}});
           return (f===s);
       },
   });
// ----------------------------------------------------------------------------------------------------------------------------


    hard(function isBare(v,deep)
    {
        let w=typeOf(v); if(w=="func"){v=v.parted(); w="list"};
        if(!deep){if(v===0){return TRUE}; return (isin("text,list,knob",w)?(span(v)<1):VOID)};
        if(w=="void"){return TRUE}; if(w=="bool"){return FALS}; if(w=="numr"){return ((v===0)?TRUE:FALS)};
        if(w=="list"){v=v.join("")}else if(w=="knob"){v=(keys(v)).concat(vals(v)).join("")};
        if(isText(v)){v=trim(v)}; return (span(v)<1);
    });
    hard(function isOccu(v){return !isBare(v,TRUE)});


    hard(function isDurl(v,g,l){return (isText(v)&&(v.indexOf('data:')===0)&&(v.indexOf(';base64,')>0));});
    hard(function isPurl(v,g,l)
    {
        if(!isText(v)){return FALS}; let t=v.split("?")[0].split("://")[1]; if(!t){return FALS};
        return (isVoid(g)||spanIs(v,g,l));
    });


    hard(function isBufr(v,g,l){return ((v instanceof ArrayBuffer) || (Object.prototype.toString.call(v)==="[object ArrayBuffer]"))});


    hard(function isList(v,g,l)
    {
        let t=Object.prototype.toString.call(v).toLowerCase();
        if((t.indexOf('arra')<0)&&(t.indexOf('argu')<0)&&(t.indexOf('list')<0)&&(t.indexOf('coll')<0)){return FALS};
        return (isVoid(g)||spanIs(v,g,l))
    });


    hard(function isData(v,g,l)
    {
        if(!isList(v)||!isKnob(v[0])){return FALS};
        let frk,lrk; frk=keys(v[0]).join(""); lrk=keys(v[(v.length-1)]).join("");
        if((frk.length<1)||(frk!==lrk)){return FALS};
        return (isVoid(g)||spanIs(v,g,l))
    });


    hard(function isKnob(v,g,l) // KNOB = Key-Notation OBject
    {if(((typeof v)!='object')||(v==NULL)||isList(v)){return FALS}; return (isVoid(g)||spanIs(v,g,l))});


    hard(function isFunc(v,g,l){if(!((typeof v)==='function')){return FALS}; return TRUE});


    hard(function isNode(v,g,l)
    {
        if(isVoid(v)||((typeof v)!='object')){return FALS}; if((typeof v.getBoundingClientRect)!='function'){return FALS};
        return (isVoid(g)||spanIs(v.childNodes.length,g,l));
    });


    hard(function isLive(v)
    {
        if(!isNode(v)||!isNode(v.parentNode)){return FALS};
        // TODO :: if isText && ping v ?? .. could be nice no?
        return TRUE;
    });


    hard(function isTemp(v){return (v instanceof DocumentFragment)});


    hard(function isFold(v,g,l)
    {
        if(CLIENTSIDE){return}; // ?
        if(!isPath(v)){return}; if(!disk.exists(v)){return};
        let r=disk.stat(v).isDirectory(); if(!r||!g){return r};
        r=disk.readdir(v); return spanIs(r,g,l);
    });


    hard(function isFile(v,g,l)
    {
        if(CLIENTSIDE){return}; // ?
        if(!isPath(v)){return}; if(!disk.exists(v)){return};
        let r=disk.stat(v); if(!r.isFile()){return FALS}; r=r.size;
        if(!g){return r}; return spanIs(r,g,l);
    });


    hard(function isLink(v,g,l)
    {
        if(CLIENTSIDE){return}; // ?
        if(!isPath(v)){return}; if(!disk.exists(v)){return};
        let r=disk.stat(v); if(!r.isSymbolicLink()){return FALS}; return r
        if(!g){return r}; return spanIs(r,g,l);
    });


    hard(function isSock(v)
    {
        if(CLIENTSIDE){return}; // ?
        if(!isPath(v)){return}; if(!disk.exists(v)){return};
        let r=disk.stat(v); if(!r.isSocket()){return FALS}; return r;
    });


    hard(function isFifo(v)
    {
        if(CLIENTSIDE){return}; // ?
        if(!isPath(v)){return}; if(!disk.exists(v)){return};
        let r=disk.stat(v); if(!r.isFIFO()){return FALS}; return r;
    });


    hard(function isDeep(a,g,l)
    {
        let r=FALS; if(isText(a))
        {
            if(!expect.path(a)){return}; if(CLIENTSIDE){fail("context :: isDeep(path) only works server-side"); return};
            if(!isFold(a)){return FALS}; a=disk.scandir(a);
        };

        if(!isFunc(a.forEach)){return FALS}; // must be enumerable object/array
        a.forEach((v)=>{if(isin("list,knob,func",what(v))){r=TRUE}});
        return r;
    });


    hard(function isMain(a)
    {
        if(a === FILE){return (process.mainModule.filename === __filename)};
        // if(a === PROC){return (process.mainModule.filename === __filename)};

        if(!a.bake||!a.bake.toString){return};
        return (a.bake.toString() === MAIN.bake.toString());
    });
// ----------------------------------------------------------------------------------------------------------------------------



// shim :: Object.trap : ?
// ----------------------------------------------------------------------------------------------------------------------------
    Object.prototype.assign
    ({
        trap: function trap(defn,func)
        {
            if(typeOf(defn)=="text"){};
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------
