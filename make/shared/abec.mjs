



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
        if((typeof v) !== "string"){return v}; // already parsed
        let t,r,d,w,p; t=v.trim();  if(!t){return t}; v=VOID; // set short vars .. trim text .. free up memory

        if ( (t.startsWith("function ")||t.startsWith("(")) && (t.hasAny("){",")=>",")\n")&&t.hasAny("}")) ) // for function
        {
            r=(new Function("let f="+t+"\nreturn f"))(); // `r` is now a function
            return r; // kept here for testing .. and for your eyes to tear less
        };

        try{r=JSON.parse(t); return r} // JSON does most of the heavy lifting .. though things may get weird with config...
        catch(e) // ...it just got wierd
        {
            try{r=JSON.parse("{"+t+"}"); return r}catch(er) // ..wrapped with curlies -hey if it works, why not
            {
                try{r=JSON.parse("["+t+"]"); return r}catch(err){} // ..squaries -same idea .. if fail we improvise below
            }
        };

        if (t.startsWith("?")){t=t.slice(1); if(!t){return "?"}}; // prep for URi-decoding .. or not
        t=t.split(";").join("\n").split("&").join("\n").trim(); // convert statements to newlines
        w=t.expose(FRST,LAST);  if(t.hasAny("()","[]","{}","<>")){t=t.slice(1,-1).trim()}; // unwrap if text is context-wrapped
        d=t.hasAny("\n", ",", ":","="); // get delimiter

        if (!d){return t}; // no delimiter .. return plain trimmed text

        if(d=="\n") // we have newlines -or statements, so use self to parse each line
        {
            r={}; t.split("\n").forEach((l)=> // loop through each line .. keep
            {
                l=l.trim(); if(!l){return}; // not interesting
                let o=parsed(l,km,vm); // parsing of this line happens in the next code-block after this if/loop
                let k=length(r); // we're using this for key-name in case the parsed result is not an object
                if(!isKnob(o)){r[k]=o; return}; // an object was not returned, so we've added it as array item
                r.define(o); // this `define` is very useful
            });
            return r; // multi-statements done
        };

        p=t.expose(d); // split on first occurance -once
        p[0]=p[0].trim();  p[2]=p[2].trim(); // clean up both sides of delimiter

        if ((d==":")||(d=="="))
        {
            let k=p[0];  w=k.expose(FRST,LAST);  if(w.hasAny("''",'""',"``")){k=k.slice(1,-1)}; // clean up key
            r={[k]:parsed(p[2])}; return r;
        };

        if (d==",")
        {
            r=[parsed(p[0])];  p=parsed(p[2]);
            if (detect(p)=="list"){r=r.concat(p)}else{r.push(p)};
            return r;
        };

        return t; // return trimmed text
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
    const expect = function expect(what,tobe)
    {
        if(!!tobe && !!tobe.indexOf)
        {
            if(tobe.indexOf(detect(what)) > -1){return TRUE};
            throw `expecting ${tobe}`; return FALS;
        };

        return {as:function as(type)
        {
            type=texted(type); if(type.hasAny(detect(what))){return TRUE};
            throw `expecting ${type}`; return FALS;
        }}
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
        let defn,temp,name,hard,data,conf; defn = (arguments)[0];

        if (detect(defn) == "text")
        {
            temp = defn.trim().split("\n").trim().join(" ").split(" ");
            defn = {};  temp.forEach((item)=>{defn[item]=(":"+item+":")});
        };

        if (detect(defn) != "knob"){moan("expecting object"); return};

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




// tool :: device
// ----------------------------------------------------------------------------------------------------------------------------
    class device
    {
        constructor(name)
        {
            this.define({name:name});
            return this;
        }
    }
// ----------------------------------------------------------------------------------------------------------------------------




// func :: global : get/set global variables
// ----------------------------------------------------------------------------------------------------------------------------
    MAIN.define({global:function global(defn)
    {
        let type,temp,resl;
        type = detect(defn);

        if (type == "text")
        {
            // resl = (new Function(`try{return ${defn};}catch(e){};`))();
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
        parsed: parsed,
        params: params,
        expect: expect,
        symbol: symbol,
        hard: hard,
        device: device,
        soft: soft,
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: stable : check if environment is stable .. designed to run fast -as in .peruse
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




// shim :: String.expose : wonderful string parsing tool
// ----------------------------------------------------------------------------------------------------------------------------
    String.prototype.define
    ({
        expose:function expose(a0,a1,a2)
        {

            let txt,tmp,dlm,frm,bgn,end;

            txt = (this+"");
            tmp = (a1+"");

            if ((a0 === WRAP) && (a0 === VOID))
            { a0=BGN; a1=END; }; // syntax sugar + convenience

            bgn = [BGN,FRST,BFOR];
            end = [END,LAST,AFTR];

            if (bgn.hasAny(a0) && end.hasAny(a1)) // return first and last characters .. to get text wrapper of e.g: `<foo>`
            { return (txt.slice(0,1) + txt.slice(-1)); };

            if ((isText(a0)||isList(a0)) && (isVoid(tmp)||bgn.hasAny(tmp)||end.hasAny(tmp))) // .:  str.expose("delimiter");
            {
                dlm = txt.hasAny(a0);  frm = tmp; if(!frm){frm=BGN};
                tmp = txt.split(dlm); if(!dlm){return tmp}; // each char
                if (frm.hasAny(bgn)){bgn = tmp.shift();  end = tmp.join(dlm)}
                else if (frm.hasAny(end)){end = tmp.pop();  bgn = tmp.join(dlm)};
                return [bgn,dlm,end];
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




// shim :: Function.expose : split up a function into its constituents
// ----------------------------------------------------------------------------------------------------------------------------
    Function.prototype.define
    ({
        expose:function expose(what)
        {
            let txt,prt,nme,aro,arg,bdy,rsl; txt=this.toString(); prt=txt.expose("{");

            nme = prt[0].split("(")[0].split("function").trim(); aro=(nme?"":"=>");
            arg = prt[0].split(")")[0].split("(")[1].split(" ").join(""); arg=(arg?arg.split(","):[]);
            bdy = prt[2].expose("}",END)[0].trim(); bdy=(bdy?bdy.split("\n"):[]);
            rsl = {name:nme, args:arg, arro:aro, body:bdy};

            rsl.toString = function toString()
            {
                let aro,fun;   aro = this.arro;   fun = (aro ? "" : "function ");
                return (fun+this.name+"("+this.args.join(",")+")"+aro+"\n{\n"+this.body.join("\n")+"\n};");
            }.bind(rsl);

            if(what){rsl = rsl[what]};
            return rsl;
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Object.peruse() : this also affects arrays
// ----------------------------------------------------------------------------------------------------------------------------
    Object.prototype.define
    ({
        peruse:function peruse(cb)
        {
            for(let k in this)
            {
                if(!this.hasOwnProperty(k)){continue}; if(!stable("peruse")){break};
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
            tpe = detect(this);
            rsl = ((tpe == "list") ? [] : {});
            this.peruse((val,key)=>
            {
                tmp = fnc.apply(this,[val,key]);
                if(detect(tmp)=="knob"){rsl.define(tmp)}
                else{rsl[key] = tmp}
            });
            return rsl;
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
    global(function isWord(v,g,l){return (test(trim(v,'_'),/^([a-zA-Z])([a-zA-Z0-9_]{1,35})+$/) && length.is(v,g,l))});
    global(function isJson(v,g,l){return (isin(['[]','{}','""'],wrapOf(v))?TRUE:FALS)});
    global(function isPath(v,g,l)
    {
        if(!test(v,/^([a-zA-Z0-9-\/\.\s_@~$]){1,432}$/)){return FALS}; if((v)!==(trim(v))){return FALS};
        return (((v[0]=='/')||(v[0]=='.')||(v[0]=='~'))&&length.is(v,g,l))
    });


    global(function isBare(v,deep)
    {
        let w=detect(v); if(w=="func"){v=v.expose("body"); w="list"};
        if(!deep){if(v===0){return TRUE}; return (isin("text,list,knob",w)?(length(v)<1):VOID)};
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
        let reserved = "apply construct defineProperty deleteProperty get getOwnPropertyDescriptor getPrototypeOf has "+
                       "ownKeys preventExtensions set setPrototypeOf writable enumerable configurable value"
                       .split(" "); // given `v` must be object and must have any key-name in this list above
        let maxWords = reserved.length; // the supported number of words from the list above
        if (!g){g=1};  if (!l || (l>maxWords)){l=maxWords}; // must not be more than supported words
        if (!(detect(v)==="knob") || !length.is(v,g,l)){return FALS}; // validation for abovementioned
        return v.expose(KEYS).hasAny(reserved); // returns first if found, else false
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

            this.peruse((val)=>
            {
                if(isFunc(exp) && !!exp(val)){done++}
                else if(isRegx(exp) && !!exp.test(texted(val))){done++}
                else if(!!exp){done++};
            });

            return (todo === done);
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Object.tunnel :
// ----------------------------------------------------------------------------------------------------------------------------
    Object.prototype.define
    ({
        tunnel: function tunnel(p,v,w)
        {
            if(((typeof p)!="string")||(p.trim().length<1)||isin(p,"*")){return}; // invalid
            let m,o,t,q,d,s,z="invalid bore option .. expecting any";  // validate
            o=[GET,SET,RIP]; t=""; q=this; if(isText(w)&&!isWrap(w,":")){w=(":"+upperCase(w)+":")};// validate
            w=(w||((v===VOID)?GET:((v===NULL)?RIP:SET)));
            if(!isin(o,w)){fail(m+" of these: "+o.join(" ")); return}; // invalid

            s=this; z=span(p,"/"); p.split("/").forEach((i,x)=> // .. `foo.3.1` -> `foo[3][1]`
            {
                if(!isNaN(i)&&isList(q)){i=(i*1)}; t+=(isNumr(i)?("["+i+"]"):("."+i)); d=(isin(".[",t.slice(0,1))?"":".");
                t=t.trim(); if((t==="")||(t===".")){dump("bore ignored: "+p); return};
                if((w==SET)&&(x<z)&&(q[i]===VOID)){q[i]=(isKnob(q)?{}:[]); func(["a"],`this${d}${t}=a`,s)(q[i])};
                q=(q||{})[i];
            });

            if(w == GET){return q}; // select
            if(w == RIP){func(`try{delete this${d}${t}}catch(e){}`); return TRUE}; // delete
            func(["a"],`this${d}${t}=a`,s)(v); return TRUE;  // define/update
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: Object.trap : fusion of Proxy & Object.defineProperty
// ----------------------------------------------------------------------------------------------------------------------------
    Object.prototype.define
    ({
        trap:function trap(trgt,conf)
        {
            if (!isText(trgt) && !conf){ conf=trgt; trgt=VOID; }; // only conf-object was given
            if (!conf){conf = function dummy(){}}; // if nothing was given we know a dummy-trap is implied
            if (isFunc(conf)) // function given as handler for all
            {
                if (!trgt && conf.name && (conf.name !== "anonymous")){ trgt=conf.name }; // property-name is function-name
                conf = {get:conf, set:conf, apply:conf, construct:conf}
            };

            if (!!this && isText(trgt)) // implied - local property trap
            {
                Object.defineProperty(this,trgt,conf);
                return this;
            };

            if (isText(trgt)){trgt = global(trgt)};
            if (!trgt){trgt = new symbol("trap")};

            let prox = new Proxy(trgt, conf);
            return prox;
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

            let myself = (this || new symbol("entity")); // if called globally `this` is undefined, so you get an entity lol
            let entity = (conf ? trap(myself,conf) : myself); // if a config object was given, then use it as a trap for myself

            entity.define
            ({
                events: {}, // event names are stored in here as objects, each with keys as hashes and values as functions

                listen: function listen(evnt,func)
                {
                    if (!this.events[evnt]){this.events[evnt] = {}}; // if event-name does not exist, create it
                    let hash = hashed(func);  this.events[evnt][hash] = func; // store each function at hashed key of event
                    return this; // makes it chainable .. you're welcome :D
                },

                signal: function signal(evnt,data)
                {
                    if (!this.events[evnt]){return this}; // no listeners
                    evnt = new CustomEvent(evnt,{detail:data}); // prepare payload as event
                    this.events[evnt].forEach((func)=>{func.apply(this,[evnt])}); // call each function attached to this event
                    return this;
                },

                ignore: function ignore(evnt,func)
                {
                    let hash = hashed(func); // to be ignored -the function must be given in order to get its hash
                    if (!this.events[evnt] || !this.events[evnt][hash]){return this}; // nothing to ignore
                    delete this.events[evnt][hash]; // done, gone, burnt and its ashes hurled into the sun in a sealed tube
                    return this;
                },
            });

            return entity;
        }
    });
// ----------------------------------------------------------------------------------------------------------------------------




// proc :: module : export
// ----------------------------------------------------------------------------------------------------------------------------
    export { MAIN };
// ----------------------------------------------------------------------------------------------------------------------------
