



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

        if((type=="func") && ((typeof defn.constructor)=="function")){kind="tool"};
        if(("arra argu list coll").indexOf(kind) > -1){type="arra"};

        return (this[kind] || this[type] || kind);
    }
    .bind
    ({
        wind:"main", glob:"main", numb:"numr", stri:"text", html:"node", arra:"list", obje:"knob", rege:"regx",
    });
// ----------------------------------------------------------------------------------------------------------------------------




// cond :: (context) : check if `globalThis` is in fact `MAIN` if not, we have to HALT! .. unstable environment
// ----------------------------------------------------------------------------------------------------------------------------
    if(typeOf(MAIN) !== "main")
    {
        throw "`globalThis` is not `global` nor `window` .. it was over-written .. run this library first to avoid that";
    };
// ----------------------------------------------------------------------------------------------------------------------------




// func :: texted : returns text-version of anything given in arg
// ----------------------------------------------------------------------------------------------------------------------------
    const texted = function texted(what)
    {
        if (!!what && !!what.performance && !!what.setInterval && !!what.clearInterval){return ":MAIN:"};
        if (!!what && ((typeof what.toString)=="function")){return what.toString();};
        let tpe,rsl;  tpe = typeOf(what);

        if (tpe == "main"){return ":MAIN:"};
        if ((tpe != "knob") && (tpe != "list")){return (what+"")};

        rsl = ((tpe=="knob") ? {} : []);

        for (let idx in what)
        {
            if (!what.hasOwnProperty(idx)){continue};
            if (what[idx] === what){rsl[idx]=":CYCLIC:"; continue};
            rsl[idx] = texted(what[idx]);
        };

        rsl = JSON.stringify(rsl);
        return rsl;
    };
// ----------------------------------------------------------------------------------------------------------------------------




// tool :: symbol : use as system flag
// ----------------------------------------------------------------------------------------------------------------------------
    class symbol
    {
        constructor(name,data)
        {
            this.name = name;
            this.data = (data || name);
            return this;
        }

        toString()
        {
            return texted(this.data);
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
    Object.defineProperty(Object.prototype,"define",{writable:FALS, enumerable:FALS, configurable:FALS, value:function define()
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
    eval((function(bufr)
    {
        (`
            A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
            OK NA
            ANY ALL ASC DSC GET SET RIP BGN END
            INIT AUTO COOL DARK LITE INFO GOOD NEED WARN FAIL NEXT SKIP STOP DONE ACTV NONE BUSY KEYS VALS ONCE EVRY BFOR AFTR
            UNTL EVNT FILL TILE SPAN OPEN SHUT SELF VERT HORZ DEEP OKAY DUMP PROC FILE FRST LAST MIDL SOME
            CLIENT SERVER PLUGIN SILENT UNIQUE COPIES FORCED PARTED EXCEPT
        `)
        .trim().split("\n").trim().join(" ").split(" ").forEach((itm,idx)=>
        {
            itm = itm.trim(); if(!itm){return};
            bufr += `const ${itm} = ":${itm}:";\n`;
        });

        return bufr;
    }("")));
// ----------------------------------------------------------------------------------------------------------------------------




// func :: glob : define global variables
// ----------------------------------------------------------------------------------------------------------------------------
    MAIN.define({glob:function glob(defn,rigd)
    {
        let type,temp,resl;
        type = typeOf(defn);

        if(type == "func")
        {
            defn = {[(defn.name||"anonymous")]:defn};
        }
        else if(type == "text")
        {
            if(defn.indexOf(" ")<0)
            {
                resl = (new Function(`try{return ${defn};}catch(e){};`))();
                if((resl === VOID) && (MAIN[defn] === VOID)){return}
                else if((resl !== VOID) && (MAIN[defn] === VOID)){defn = {[defn]:resl}}
                else{return resl};
            }
            else
            {
                let temp=(defn+""); defn = {};
                temp.split(" ").forEach((itm)=>
                {defn[itm] = (":" +itm+ ":");});
            }
        };
        MAIN.define(defn);
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




// func :: length : length of anything .. spanIs -to verify/assert length
// ----------------------------------------------------------------------------------------------------------------------------
    const length = function length(d,x)
    {
        if((d===NULL)||(d===VOID)||(!d&&isNaN(d))){return 0};  if(!isNaN(d)){d+=""};
        if(x&&((typeof x)=="string")&&((typeof d)=="string")){d=(d.split(x).length-1); return d};
        let s=d.length; if(!isNaN(s)){return s;};
        try{s=Object.getOwnPropertyNames(d).length; return s;}
        catch(e){return 0;}
    };


    length.define
    ({
        is: function assertLength(d,g,l)
        {
            if(g===VOID){return TRUE};
            let s=(((typeof d)=="number")?d:length(d)); g=(g||0); l=(l||s); return ((s>=g)&&(s<=l))
        }
    });
// ----------------------------------------------------------------------------------------------------------------------------




// ----------------------------------------------------------------------------------------------------------------------------
    const args = function args(a)
    {
        if(SERVERSIDE&&((a===VOID)||(typeOf(a)=="numr")))
        {
            let l=process.argv; l.shift(); l.shift();
            return ((typeOf(a)=="numr") ? l[a] : l); // args from CLI
        };

        if(length(a)<1){return []}; // void or empty
        if(typeOf(a)!="list"){a=[a]} // to array
        else if(typeOf(a[0])=="list"){a=a[0]}; // sub-args-array

        return ([].slice.call(a));
    }
// ----------------------------------------------------------------------------------------------------------------------------




// func :: stable : check if environment is stable
// ----------------------------------------------------------------------------------------------------------------------------
    const stable = function stable(a,f)
    {
        if(MAIN.HALT){return FALS}; if(!isText(a,1)){return};
        moan("`"+a+"` was running in unstable conditions");
        if(isFunc(f)){f()}; return a;
    };
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: String.hasAny / .hasAll : shorthands & improv for String.includes
// ----------------------------------------------------------------------------------------------------------------------------
   String.prototype.define
   ({
       hasAny:function hasAny(inst)
       {
           return ((this+"").indexOf(x)>-1);
       },

       hasAll:function hasAll()
       {
           let h,a,s,f; h=(this+""); a=args(arguments); s=length(a); f=0;
           a.forEach((n)=>{if(h.indexOf(n) > -1){f++}});
           return (f===s);
       },
   });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: String.parted : like `.split()` .. just a tad more elaborate
// ----------------------------------------------------------------------------------------------------------------------------
   String.prototype.define
   ({
       parted:function parted(dlm,frm)
       {
           let txt,tmp,bgn,end;  txt=(this+"");  if(!frm){frm=BGN};
           tmp = txt.split((dlm||"")); // raw result

           if (!dlm || !frm){return tmp};

           if ((frm === BGN) || (frm === FRST))
           {
               bgn = tmp.shift();
               end = tmp.join(dlm);
           }
           else if ((frm === END) || (frm === LAST))
           {
               end = tmp.pop();
               bgn = tmp.join(dlm);
           };

           return [bgn,dlm,end];
       },
   });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Function.parted : split up a function into its constituents
// ----------------------------------------------------------------------------------------------------------------------------
    Function.prototype.define
    ({
        parted:function parted(what)
        {
            let txt,prt,nme,aro,arg,bdy,rsl; txt=this.toString(); prt=txt.parted("{");

            nme=prt[0].split("(")[0].trim(); aro=(nme?"":"=>");
            arg=prt[0].split(")")[0].split("(")[1].split(" ").join(""); arg=(arg?arg.split(","):[]);
            bdy=prt[2].parted("}",END)[0].trim(); bdy=(bdy?bdy.split("\n"):[]);
            rsl={name:nme, args:arg, arro:aro, body:bdy};

            rsl.toString=function()
            {
                let rsl=(this.name+"("+this.args.join(",")+")"+this.arro+"\n{\n"+this.body.join("\n")+"\n};");
            }.bind(rsl);

            if(what){rsl = rsl[what]};
            return rsl;
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Object.forEach() : this also affects arrays
// ----------------------------------------------------------------------------------------------------------------------------
    Object.prototype.define
    ({
        forEach:function forEach(cb)
        {
            for(let k in this)
            {
                if(!this.hasOwnProperty(k)){continue}; if(!stable("forEach")){break};
                let r=cb.apply(this,[this[k],k]); if(r===STOP){break};
            };
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Object.modify() : this also affects arrays
// ----------------------------------------------------------------------------------------------------------------------------
    Object.prototype.define
    ({
        modify:function modify(fnc)
        {
            let tpe,rsl,tmp;
            tpe = typeOf(this);
            rsl = ((tpe == "list") ? [] : {});
            this.forEach((val,key)=>
            {
                tmp = fnc.apply(this,[val,key]);
                if(isKnob(tmp)){rsl.define(tmp)}
                else{rsl[key] = tmp}
            });
            return rsl;
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shiv :: (types) : shorthands to identify variables .. g & l is "greater-than" & "less-than" -which counts items inside v
// ----------------------------------------------------------------------------------------------------------------------------
    const isVoid = function isVoid(v){return (v===VOID)};
    const isNull = function isNull(v){return (v===NULL)};
    const isBool = function isBool(v){return ((v===TRUE)||(v===FALS))};


    const isNumr = function isNumr(v,g,l){return (((typeof v)==="number") && spanIs(v,g,l))};
    const isFrac = function isFrac(v,g,l){if(!isNumr(v)||((v%1)===0)){return FALS}; return spanIs(v,g,l)};
    const isInum = function isInum(v,g,l){if(!isNumr(v)||isFrac(v)){return FALS}; return spanIs(v,g,l)};


    const isText = function isText(v,g,l){if((typeof v)!=="string"){return FALS}; return spanIs(v,g,l)};
    const isWord = function isWord(v,g,l){return (test(trim(v,'_'),/^([a-zA-Z])([a-zA-Z0-9_]{1,35})+$/) && spanIs(v,g,l))};
    const isJson = function isJson(v,g,l){return (isin(['[]','{}','""'],wrapOf(v))?TRUE:FALS);};
    const isPath = function isPath(v,g,l)
    {
        if(!test(v,/^([a-zA-Z0-9-\/\.\s_@~$]){1,432}$/)){return FALS}; if((v)!==(trim(v))){return FALS};
        return (((v[0]=='/')||(v[0]=='.')||(v[0]=='~'))&&spanIs(v,g,l))
    };


    const isBare = function isBare(v,deep)
    {
        let w=typeOf(v); if(w=="func"){v=v.parted("body"); w="list"};
        if(!deep){if(v===0){return TRUE}; return (isin("text,list,knob",w)?(length(v)<1):VOID)};
        if(w=="void"){return TRUE}; if(w=="bool"){return FALS}; if(w=="numr"){return ((v===0)?TRUE:FALS)};
        if(w=="list"){v=v.join("")}else if(w=="knob"){v=(keys(v)).concat(vals(v)).join("")};
        if(isText(v)){v=trim(v)}; return (length(v)<1);
    };


    const isDurl = function isDurl(v,g,l){return (isText(v)&&(v.indexOf('data:')===0)&&(v.indexOf(';base64,')>0));};
    const isPurl = function isPurl(v,g,l)
    {
        if(!isText(v)){return FALS}; let t=v.split("?")[0].split("://")[1]; if(!t){return FALS};
        return spanIs(v,g,l);
    };


    const isBufr = function isBufr(v,g,l)
    {
        if(!(v instanceof ArrayBuffer) || (Object.prototype.toString.call(v)!=="[object ArrayBuffer]")){return FALS};
        return spanIs(v,g,l);
    };


    const isList = function isList(v,g,l)
    {
        return ((typeOf(v) === "list") ? spanIs(v,g,l) : FALS);
    };


    const isData = function isData(v,g,l)
    {
        if(!isList(v)||!isKnob(v[0])){return FALS};
        let frk,lrk; frk=keys(v[0]).join(""); lrk=keys(v[(v.length-1)]).join("");
        if((frk.length<1)||(frk!==lrk)){return FALS};
        return spanIs(v,g,l)
    };

    // KNOB = Key-Notation OBject
    const isKnob = function isKnob(v,g,l){return (((typeof v)=="object") && (v!==NULL) && !isList(v) && spanIs(v,g,l))};
    const isFunc = function isFunc(v,g,l){return (((typeof v)==="function") && spanIs(v,g,l))};


    const isNode = function isNode(v,g,l)
    {return (isKnob(v) && isFunc(v.getBoundingClientRect) && spanIs(v.childNodes.length,g,l))};


    const isLive = function isLive(v)
    {
        if(!isNode(v)||!isNode(v.parentNode)){return FALS};
        // TODO :: if isText && ping v ?? .. could be nice no?
        return TRUE;
    };


    const isTemp = function isTemp(v){return (v instanceof DocumentFragment)};


    const isDeep = function isDeep(v,g,l)
    {
        let r,f; r=FALS; f="list,knob,func";
        if(!f.hasAny(typeOf(v))){return r}; // must be enumerable object/array
        v.forEach((i)=>{if(f.hasAny(typeOf(v))){r=TRUE; return STOP}});
        return r;
    };


    const isRegx = function isRegx(v,g,l)
    {
        return ((typeOf(v)==="regx") && spanIs(v,g,l));
    };


    const isMain = function isMain(a)
    {
        if(a === FILE)
        {return (process.mainModule.filename === __filename)};

        // if(a === PROC)
        // {};

        if(!a.glob||!a.glob.toString){return};
        return (a.glob.toString() === MAIN.glob.toString());
    };
// ----------------------------------------------------------------------------------------------------------------------------



// shim :: String.testWith : run a test against some string, the test can be a function, or RegExp
// ----------------------------------------------------------------------------------------------------------------------------
    String.prototype.define
    ({
        assert: function assert(exp)
        {
            let txt = (this+"");  if(isText(exp)){exp = new RegExp(exp)};

            if(isFunc(exp)){return (!!exp(txt))};
            if(isRegx(exp)){return (!!exp.test(txt))};
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

            this.forEach((val)=>
            {
                if(isFunc(exp) && !!exp(val)){done++}
                else if(isRegx(exp) && !!exp.test(texted(val))){done++};
            });

            return (todo === done);
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------



// shim :: Object.trap : ?
// ----------------------------------------------------------------------------------------------------------------------------
    Object.prototype.define
    ({
        trap: function trap(defn,func)
        {
            if(typeOf(defn)=="text"){};
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------
