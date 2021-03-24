



// defn :: (constants) : useful for if another script overwrites something we need
// ----------------------------------------------------------------------------------------------------------------------------
    const MAIN = globalThis; // context
    const VOID = (function(){}()); // undefined
    const NULL = null; // syntax sugar
    const TRUE = (!0);
    const FALS = (!1);
// ----------------------------------------------------------------------------------------------------------------------------




// func :: bake : define immutable property .. shorhand for Object.defineProperty and all required constituents
// ----------------------------------------------------------------------------------------------------------------------------
    const bake = function bake(p,v,x,s)
    {
        if(((typeof p)==="function")&&(v===VOID)){if(!p.name){return}; v=p; p=v.name}; // named function
        if(!x){x=MAIN}; // if no context is given then MAIN is assumed
        if(((typeof p)!="string")){return}; if(!x.hasOwnProperty){return}; // validation
        if(v===VOID){v=x[p]; if(v===VOID){return}}; // value is already in context, or undefined
        if(s){Object.defineProperty(x,p,{value:v})} // soft .. not bake -but saves duplication
        else{Object.defineProperty(x,p,{writable:false,enumerable:false,configurable:false,value:v})}; // harden, or fail
        return v; // all is well
    };

    bake(bake); // harden unbaked
    bake("MAIN",MAIN); bake("VOID",VOID); bake("NULL",NULL); bake("TRUE",TRUE); bake("FALS",FALS); bake("config",config);
// ----------------------------------------------------------------------------------------------------------------------------




// func :: hard/soft : define something in another context (e.g global) -from within any other context .. immutable -or mutable
// ----------------------------------------------------------------------------------------------------------------------------
    bake(function hard(p,v,x){return bake(p,v,x)});   // syntax sugar for bake hard .. immutable
    bake(function soft(p,v,x){return bake(p,v,x,1)}); // syntax sugar for bake soft .. mutable
// ----------------------------------------------------------------------------------------------------------------------------




// func :: defn : define immutable globals .. syntax sugar .. returns true if all went well
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function defn(o)
    {
        let t,f; t=(typeof o); f=0; // t:type .. f:fail

        if(t=="string")
        {
            let l=o.trim(); if(!l){return}; // validation
            l.split(" ").forEach((i)=>{i=i.trim(); if(!i){f++;return}; bake(i,`:${i}:`)});
            return (f?(!1):(!0)); // if all defined then return true, else false
        };

        if(t=="object")
        {
            if(Object.keys(o).length<1){return}; // validation
            for(let k in o)
            {
                if(((typeof k)!="string")||(k.length<1)||!o.hasOwnProperty(k)){f++;continue}; // validation
                bake(k,o[k]);
            };
            return (f?(!1):(!0)); // if all defined then return true, else false
        };
    });
// ----------------------------------------------------------------------------------------------------------------------------




// defn :: ENVITYPE : string reference as the type of environment this script is running in
// ----------------------------------------------------------------------------------------------------------------------------
    defn({ENVITYPE:(function()
    {
        if(((typeof window)!="undefined")&&((typeof __dirname)!="string")){return "web"};
        if(((typeof browser)!="undefined")&&!!browser.browserAction&&((typeof browser.browserAction.getPopup)=="function"))
        {return "ext"}; return "njs";
    }())});

    defn({CLIENTSIDE:(ENVITYPE!="njs"), SERVERSIDE:(ENVITYPE=="njs")});
    defn({WEB:((ENVITYPE=="web")?"web":""), EXT:((ENVITYPE=="ext")?"ext":""), NJS:((ENVITYPE=="njs")?"njs":"")});
// ----------------------------------------------------------------------------------------------------------------------------






// func :: (dump/moan) : console.log & console.error shorthands
// ----------------------------------------------------------------------------------------------------------------------------
    hard("dump",console.log.bind(console));
    hard(function moan(m)
    {
        let a=([].slice.call(arguments)); if(isKnob(m)){m=text(m); a[0]=m};
        a.unshift("\x1b[31m%s\x1b[0m"); console.error.apply(console,a);
    });
// ----------------------------------------------------------------------------------------------------------------------------




// defn :: (global constants) : to use everywhere .. mostly for shorthand .. syntax-sugar
// ----------------------------------------------------------------------------------------------------------------------------
    defn("A B C D E F G H I J K L M N O P Q R S T U V W X Y Z");
    defn("OK NA TL TM TR RT RM RB BR BM BL LB LM LT MM");
    defn("ANY ALL ASC DSC");
    defn("INIT AUTO COOL DARK LITE INFO GOOD NEED WARN FAIL NEXT SKIP STOP DONE ACTV NONE BUSY KEYS VALS ONCE EVRY BFOR AFTR");
    defn("UNTL EVNT FILL TILE SPAN OPEN SHUT SELF VERT HORZ DEEP OKAY DUMP PROC FILE");
    defn("CLIENT SERVER SILENT UNIQUE COPIES FORCED PARTED EXCEPT");

    defn("MD5 SHA1");

    defn
    ({
        CRUDREFS:`count fetch using alter write claim touch where group order limit parse shape apply erase purge debug dbase`+
                 ` table field sproc funct after basis named param parts yield`,

        DIRINDEX:`aard.html aard.htm aard.js aard.md index.html index.htm index.js index.md README.md`.split(" "),
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: runsAt : to use when expected to run at CLIENT or SERVER
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function runsAt(w)
    {
        if((w!=CLIENT)&&(w!=SERVER)){return}; let m=`only available at ${w}`; // validation
        if((w==CLIENT)&&(ENVITYPE=="njs")){fail(m); return FALS};
        if((w==SERVER)&&(ENVITYPE!="njs")){fail(m); return FALS};
        return TRUE;
    });
// ----------------------------------------------------------------------------------------------------------------------------




// defn :: PROTOCOL : string reference as the URL-schema of the environment this script is running in
// ----------------------------------------------------------------------------------------------------------------------------
    defn({PROTOCOL:(function()
    {
        if(ENVITYPE=="web"){return (location.protocol+"").split(":").join("")};
        if(ENVITYPE=="njs"){return "file"};
        return "webext";
    }())});
// ----------------------------------------------------------------------------------------------------------------------------




// func :: what : concise `typeof` .. returns 4-letter word, or undefined
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function what(v)
    {
        let l=("Void,Bool,Numr,Text,List,Knob,Func").split(",");
        for(let i in l){if(!l.hasOwnProperty(i)){continue}; if(MAIN[`is${l[i]}`](v)){return l[i].toLowerCase()}};
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: span : length of anything .. spanIs -to verify/assert span
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function span(d,x)
    {
        if((d===NULL)||(d===VOID)||(!d&&isNaN(d))){return 0};  if(!isNaN(d)){d=(d+"")};
        if(x&&((typeof x)=="string")&&((typeof d)=="string")){d=(d.split(x).length-1); return d};
        let s=d.length; if(!isNaN(s)){return s;};
        try{s=Object.getOwnPropertyNames(d).length; return s;}
        catch(e){return 0;}
    });

    hard(function spanIs(d,g,l){let s=(((typeof d)=='number')?d:span(d)); g=(g||0); l=(l||s); return ((s>=g)&&(s<=l))});
// ----------------------------------------------------------------------------------------------------------------------------




// shiv :: (types) : shorthands to identify variables .. g & l is "greater-than" & "less-than" -which counts items inside v
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function isVoid(v){return ((v===VOID)||(v===null))});
    hard(function isBool(v){return ((v===TRUE)||(v===FALS))});


    hard(function isBare(v,deep)
    {
        let w=what(v); if(w=="func"){v=v.parted(); w="list"};
        if(!deep){if(v===0){return TRUE}; return (isin("text,list,knob",w)?(span(v)<1):VOID)};
        if(w=="void"){return TRUE}; if(w=="bool"){return FALS}; if(w=="numr"){return ((v===0)?TRUE:FALS)};
        if(w=="list"){v=v.join("")}else if(w=="knob"){v=(keys(v)).concat(vals(v)).join("")};
        if(isText(v)){v=trim(v)}; return (span(v)<1);
    });
    hard(function isOccu(v){return !isBare(v,TRUE)});


    hard(function isNumr(v,g,l){if(!((typeof v)==='number')||isNaN(v)){return FALS}; return (isVoid(g)||spanIs(v,g,l))});
    hard(function isFrac(v,g,l){if(!(isNumr(v)&&((v+'').indexOf('.')>0))){return FALS}; return (isVoid(g)||spanIs(v,g,l))});
    hard(function isInum(v,g,l){if(!isNumr(v)||isFrac(v)){return FALS}; return (isVoid(g)||spanIs(v,g,l))});


    hard(function isText(v,g,l){if(!((typeof v)==='string')){return FALS}; return (isVoid(g)||spanIs(v,g,l))});
    hard(function isWord(v,g,l){if(!test(trim(v,'_'),/^([a-zA-Z])([a-zA-Z0-9_]{1,35})+$/)){return}; return (isVoid(g)||spanIs(v,g,l))});
    hard(function isJson(v,g,l){return (isin(['[]','{}','""'],wrapOf(v))?TRUE:FALS);});
    hard(function isPath(v,g,l)
    {
        if(!test(v,/^([a-zA-Z0-9-\/\.\s_@~$]){1,432}$/)){return FALS}; if((v)!==(trim(v))){return FALS};
        return (((v[0]=='/')||(v[0]=='.')||(v[0]=='~'))&&(isVoid(g)||spanIs(v,g,l)))
    });


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
        if(isNode(v)&&!v.select("^")){return FALS};
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




// shiv :: (trim) : trim either white-space or substring from begin -and/or end of string
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function ltrim(t,c)
    {
        if(!isText(t,1)){return t}; if(c===VOID){return t.replace(/^\s+/g,'')};
        if(isNumr(c)){c=(c+'')}; if(!isText(c)){return t}; let s=c.length; while(t.indexOf(c)===0){t=t.slice(s);}; return t;
    });

    hard(function rtrim(t,c)
    {
        if(!isText(t,1)){return t}; if(c===VOID){return t.replace(/\s+$/g,'')};
        if(isNumr(c)){c=(c+'')}; if(!isText(c)){return t}; let s=c.length;
        while(t.slice((0-s))==c){t=t.slice(0,(t.length-s));};
        return t;
    });

    hard(function trim(t,b,e)
    {
        if(!isText(t,1)){return t}; if((b===VOID)&&(e===VOID)){return t.trim();}; if(isNumr(b)){b=(b+'')};
        if(e===VOID){e=b}else if(isNumr(e)){e=(b+'')}; if(b===e){t=rtrim(ltrim(t,b),e); return t;};
        if(b&&!e){return ltrim(t,b)}; if(e&&!b){return rtrim(t,e)}; return t;
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: part : split once on first occurance of delimeter
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function part(t,a)
    {
        var c,i,b,e,s; c=isin(t,a); if(!c){return};
        s=c.length; i=t.indexOf(c);  b=((i>0)?t.slice(0,i):'');  e=(t[(i+s)]?t.slice((i+s)):'');  return [b,c,e];
    });

    hard(function rpart(t,a)
    {
        var c,i,b,e,a,s;  c=isin(t,a); if(!c){return};
        s=c.length; i=t.lastIndexOf(c); b=((i>0)?t.slice(0,i):''); e=(t[(i+s)]?t.slice((i+s)):'');  return [b,c,e];
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: diff : get the difference between 2 of anything
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function diff(a1,a2)
    {
        let t1,t2,tv; t1=what(a1); t2=what(a2);
        if((span(a1)<1)||(span(a2)<1)||(t1!==t2)){return};

        if(t1 == "numr"){return ((a1>a2)?(a1-a2):(a2-a1))} // returns number
        else if(t1 == "text"){a1=a1.split(a2); a2=a2.split(a1)} // returns list
        else if(t1 == "knob"){a1=keys(a1); a2=keys(a2)} // returns list
        else if(t1 == "func"){a1=a1.parted().body; a2=a2.parted().body} // returns list
        else if(t1 != "list"){moan("cannot get the diff of `"+t1+"`")}; // add more options above this line

        if(!isList(a1)){return [VOID]}; // expected to return list but method to convert to list is undefined above
        return a1.filter((i)=>{return (a2.indexOf(i)<0)});
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shiv :: (case) : set -and test text-case
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function lowerCase(v){if(!isText(v,1)){return v}; return v.toLowerCase()});
    hard(function upperCase(v){if(!isText(v,1)){return v}; return v.toUpperCase()});

    hard(function proprCase(v)
    {
        if(!isText(v,1)){return v};  let d,r; r=[]; d=part(v,[" ","-"]);
        if(!d){return (v[0].toUpperCase()+(v[1]?v.substring(1).toLowerCase():""))};
        d=d[1]; v=v.toLowerCase().split(d).forEach((i)=>{r.radd(i[0].toUpperCase()+i.slice(1))});
        r=r.join(d); return r;
    });

    hard(function camelCase(v,camlBack)
    {
        if(!isText(v,1)){return v}; v=v.toLowerCase().split(' ').join('-'); let r='';
        v.split('-').forEach((i)=>{r+=proprCase(i)});
        if(!camlBack){return r;}; let f=r.slice(0,1); r=r.slice(1); return (f.toLowerCase()+r);
    });

    hard(function breakCase(v,d)
    {
        if(!isText(v,1)){return}; if(!isText(d,1)){d="-"}; let lst,rsl;
        lst=v.split(""); rsl=[]; lst.forEach((c)=>{if(isUpperCase(c)){rsl.radd("-")}; rsl.radd(lowerCase(c))});
        rsl=rsl.join(""); return rsl;
    });

    hard(function isLowerCase(v){return (v===lowerCase(v));});
    hard(function isUpperCase(v){return (v===upperCase(v));});
    hard(function isProprCase(v){return (v===proprCase(v));});
    hard(function isCamelCase(v,cb){return (v===camelCase(v,cb));});
// ----------------------------------------------------------------------------------------------------------------------------




// func :: escapeHtml : sanitise text for safer HTML rendering
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function escapeHtml(text)
    {
        if(!isText(text)){return text};

        var map = // object
        {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;",
        };

        return text.replace(/[&<>"']/g, function(m){return map[m];});
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: test : test a string against some Regex pattern
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function test(v,x)
    {
        if(((typeof v)!="string")||(v.length<1)){return FALS}; if(!x){return};
        if((typeof x)=="string"){if(wrapOf(x)!=="//"){return}; x=(new RegExp(x));}; if(!x){return};
        if(x.constructor&&(x.constructor.name=="RegExp")){return (x.test(v)?TRUE:FALS)};
        if(isFunc(x)){return x(v)};
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: keys/vals : return a list of own-keys, or own-values of an object .. returns empty array if invalid
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function keys(o,x)
    {
        if(!isKnob(o)&&!isList(o)&&!isFunc(o)){return []}; // validation .. array is expected as return value
        let r=Object.getOwnPropertyNames(o); if(!isNumr(x)){return r}; // get properties .. return all
        if(x<0){x=((r.length-1)+x)}; return r[x];
    });

    hard(function vals(o,x)
    {
      let r=[]; keys(o).forEach((k)=>{r.push(o[k])});
      if(!isNumr(x)){return r}; if(x<0){x=((r.length-1)+x)};
      return r[x];
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: seen : returns the value of the first occurence in given context -or undefined .. if no x is given -MAIN is assumed
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function seen(f,x)
    {
        if(isVoid(x)&&isWord(f)){return (new Function(`try{return ${f};}catch(e){};`))();}; // global / constant
        if(!x||(x===TRUE)||(f===VOID)){return}; // validation .. no search-able context, or trying to find `undefined`
        if(isNumr(x)){x=(x+""); if(isNumr(f)){f=(f+"");}}; // turn numbers into strings for searching
        if(!isFunc(x.indexOf)){x=keys(x);}; if(!x.length){return};  // validation
        if(isList(f)&&isList(x))
        {for(let i in f){if(!f.hasOwnProperty(i)){continue}; i=f[i]; if(x.indexOf(i)>-1){return i}}; return VOID};
        if(f.indexOf&&isList(x))
        {for(let i in x){if(!x.hasOwnProperty(i)){continue}; i=x[i]; if(f.indexOf(i)>-1){return i}}; return VOID};
        if(!isList(f)){return ((x.indexOf(f)>-1)?f:VOID)}; // single search
        for(let i in f){if(!f.hasOwnProperty(i)){continue}; if(x.indexOf(f[i])>-1){return f[i]}}; // bulk search
    });

    hard(function isin(x,f){return seen(f,x)}); // syntax sugar .. reversed params for `seen`
// ----------------------------------------------------------------------------------------------------------------------------




// func :: mean : parse text into meaning
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function mean(v,km,vm, s,k,r)
    {
        if(!isText(v,1)){return};  let t=v.trim();  if(!t){return t}; v=VOID; // obvious stuff out the way
        try{let r=JSON.parse(t); return r}catch(e){}; // JSON does most of the heavy lifting

        if((t.startsWith("function ")||t.startsWith("("))&&(isin(t,["){",")=>",")\n"])&&isin(t,"}")))
        {
            r=(new Function("let f="+t+"\nreturn f"))();
            return r;
        };

        t=t.split(";").join("\n"); if(isin(t,"\n"))
        {
            r={}; t.split("\n").forEach((l)=>
            {
                let o=mean(l,km,vm); if(!isKnob(o)){r[span(r)]=o; return};
                k=keys(o)[0]; r[k]=o[k];
            });
            return r;
        };

        if(isin(t,['"',"`"])){return v}; // ignore multi-line or too complex
        s=part(t,":"); if(s)
        {k=trim(s[0]," "); if(isin(k,[" ",","])){return t}; if(km){k=km(k)}; v=mean(s[2]); if(vm){v=vm(v)}; return {[k]:v}};
        if(!isin(t,",")){return t}; // not a list
        r=[]; t.split(",").forEach((i)=>{r.radd(mean(i))});
        return r;
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: text : parse meaning into text
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function text(v,w, r)
    {
        if((v===VOID)||isFunc(v)||isText(v)){return (v+"")};
        try{r=JSON.stringify(v);}catch(e){r=(v+"")};
        return (r||"");
    });
    hard(function textOf(v,w){return text(v,w)});
// ----------------------------------------------------------------------------------------------------------------------------




// func :: bool : parse implicit boolean
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function bool(x)
    {
        if(isBool(x)){return x}; if(span(x)<1){return FALS};
        if(isNumr(x)){return ((x<1)?FALS:TRUE)};

        if(isText(x))
        {
            x=lowerCase(trim(x)); if(!test(x,/[a-z0-1\+\-]{1,8}/)){return};
            if(isin(`+ 1 y ok yes true good okay positive`,x)){return TRUE};
            if(isin(`- 0 n no bad fals null false negative`,x)){return FALS};
            return;
        };

        if(isList(x)||isKnob(x)){return bool(vals(x)[0])};
        return;
    });
    hard(function boolOf(x){return bool(x)});
// ----------------------------------------------------------------------------------------------------------------------------




// func :: bore : get/set/rip keys of objects by dot -or slash delimiter
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function bore(o,k,v)
    {
        if(((typeof k)!='string')||(k.trim().length<1)||isin(k,"*")){return}; // invalid
        if(seen("/",k)&&!seen(".",k)){k=k.split("/").join(".")}; // slashes to dots
        let t=""; k.split(".").forEach((i)=>{t+=(!isNaN(i)?`[${i}]`:`.${i}`)}); k=t;
        if(v===VOID){return (new Function("a",`try{return a${k}}catch(e){return}`))(o)}; // get
        if(v===NULL){(new Function("a",`try{delete a.${k}}catch(e){return}`))(o); return TRUE}; // rip
        (new Function("a","z",`try{a.${k}=z}catch(e){return}`))(o,v); return TRUE; // set
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: rename : define/change the name of a function
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function rename(f,n)
    {
        let t,p,r; if(isText(f)){t=f; f=n; n=t}; // swap args
        if(((typeof f)!='function')||((typeof n)!='string')||(n.trim().length<1)){return}; // validate
        p=f.parted(); if(p.name){p.name=n}; t=p.toString(); r=(new Function("a",`return {[a]:${t}}[a];`))(n);
        return r;
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: copyOf : duplicate .. if numr or text then n repeats n-times
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function copyOf(v,n, r)
    {
        if(isVoid(v)||(v===null)||(v==="")||isBool(v)){return v};
        if(isNumr(v)||isText(v)){if(!n){return v}; v=(v+""); n=parseInt(n); r=""; for(let i=0;i<n;i++){r+=v}; return r};
        if(((typeof Element)!=="undefined")&&(v instanceof Element)){return (v.cloneNode(true))};
        if(isList(v)){r=[]; v=([].slice.call(v)); v.forEach((i)=>{r.push(copyOf(i))}); return r};
        if(isKnob(v)){r={}; for(let k in v){if(!v.hasOwnProperty(k)){continue}; r[k]=copyOf(v[k])}; return r};
        if(isFunc(v))
        {
            r=new Function("try{return "+v.toString()+"}catch(e){return}")(); if(isVoid(r))
            {fail("copy :: something went wrong; see what was tried (but failed) in the console."); moan(v.toString()); return};
            v.forEach((fv,fk)=>{r[fk]=copyOf(fv)});
            return r;
        };
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: extend : define hardened properties -- neat shorthand to define multiple immutable properties of multiple targets
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function extend()
    {
        var a = [].slice.call(arguments);
        var z = function(d)
        {
            if(!isKnob(d)){return}; let r,o; r=TRUE; o={writable:FALS,enumerable:FALS,configurable:FALS,value:VOID};
            a.forEach((i)=>
            {
                if((("o,f").indexOf((typeof i)[0])<0)){r=FALS; moan("extend only words with objects and functions"); return};
                for(let p in d)
                {
                    if(!d.hasOwnProperty(p)){continue;}; let w,v,c,t,q; w=VOID; v=VOID; c=VOID; v=d[p]; t=(typeof v)[0];
                    if(!p.startsWith("hard ")&&!p.startsWith("soft ")){p=("hard "+p);}; // must be `hard` or `soft`
                    p=p.split(" "); w=p.shift(); p=p.pop().trim(); w=((w=="soft")?TRUE:FALS); // hard/soft determines writable
                    if(isin("o,f",t)){q=copyOf(o); q.value=p; Object.defineProperty(v,"name",q)};
                    c=copyOf(o); c.writable=w; c.value=v; try{Object.defineProperty(i,p,c)}catch(e){r=FALS;};
                };
                return r;
            });
        }; z.with=z;

        return z;
    });

    extend(Math)({name:'Math'});  extend(console)({name:'console'});
// ----------------------------------------------------------------------------------------------------------------------------




// func :: isConstructor : check if given arg is a constructor
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function isConstructor(f)
    {
        try{new f();}catch(e){if(e.message.indexOf('not a constructor')>=0){return FALS;}};
        return TRUE;
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: listOf : convert into list
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function listOf(a)
    {
        if(isList(a))
        {
            if(!!a.forEach&&!!a.pop){return a};
            return ([].slice.call(a));
        };
        return [a];
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: range : list of numbers from start to stop
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function range(sta,sto,ste=1){return Array(sto-sta).fill(sta).map((x,y) => x + y * ste)});
    // const range = (start, stop, step=1) => Array(stop - start).fill(start).map((x, y) => x + y * step);
    // bake("range",range);
// ----------------------------------------------------------------------------------------------------------------------------




// func :: pathOf : get path from string
// ----------------------------------------------------------------------------------------------------------------------------
   hard(function pathOf(v)
   {
      if(!isText(v)){return}; let r=trim(v); if(!r){return}; if(isPath(r)){return r;}; if(r.startsWith("~")){return ("/"+r);};
      if(!isText(v,2)){return}; r=v; if(isin(r,'://')){r=r.split('://')[1]}; r=part(r,'/'); if(!r){return};
      r=('/'+r[2]); r=r.split('//').join('/'); r=r.split(' ').join('_'); r=r.split('?')[0];
      return (isPath(r)?r:VOID);
   });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: twig : get path from string - minus the last item after `/`
// ----------------------------------------------------------------------------------------------------------------------------
   hard(function twig(v)
   {
       let r=pathOf(v); if(!r){return};
       return r.split("/").rpop(TRUE).join("/");
   });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: leaf : base-name from path
// ---------------------------------------------------------------------------------------------------------------------------------------------
   hard(function leaf(p)
   {
      let r=pathOf(p); if(!r){r=pathOf('/'+p); if(!r){return}}; let b=r.split('/').pop(); return b;
   });
// ---------------------------------------------------------------------------------------------------------------------------------------------




// func :: fext : get valid file extension from path
// ----------------------------------------------------------------------------------------------------------------------------
   hard(function fext(p)
   {
      let r=pathOf(p); if(!r){r=pathOf('/'+p); if(!r){return}}; let b=r.split('/').pop();
      if(!isin(b,'.')){return}; r=b.split('.').pop();
      if(test(r,/^[a-zA-Z0-9]{1,8}$/)){return r};
   });
// ----------------------------------------------------------------------------------------------------------------------------




// shiv :: (wrap) : related to distinct first and last character pairs in text
// --------------------------------------------------------------------------------------------------------------------------------------------
   hard(function isWrap(v, r,l)
   {
      if(!isText(v,2)){return FALS}; r=(v.slice(0,1)+v.slice(-1)); l="\"\" '' `` {} [] () <> // :: \\\\ **".split(" ");
      return ((l.indexOf(r)<0)?FALS:r);
   });

   hard(function wrapOf(v, w){w=isWrap(v); return (w?w:'')});
   hard(function unwrap(v, w){w=isWrap(v); return (w?v.slice(1,-1):v)});
// --------------------------------------------------------------------------------------------------------------------------------------------




// func :: akin : check if needle is similar to hastack .. as in: "begins-with", "ends-with" or "contains" .. marked with `*`
// ----------------------------------------------------------------------------------------------------------------------------
   hard(function akin(h,n, l,f,p,b,e)
   {
      if(!isText(h,1)||!isText(n,1)){return (h==n)}; if(n.indexOf("*")<0){return (h==n)}; // validate
      if(n.indexOf("**")>-1){if(n.startsWith('**')||n.endsWith("**")){return;}}; // validate
      if(n==="*"){return TRUE;}; if(n.length<2){return}; // for * or invalid
      if(wrapOf(n)==="**"){n=unwrap(n); return (h.indexOf(n)>-1)}; // contains
      if(n.startsWith("*")){n=ltrim(n,"*"); return h.endsWith(n);}; // ends-with
      if(n.slice(-1)==='*'){n=rtrim(n,"*"); return h.startsWith(n);}; // starts-with
      if(n.indexOf("**")<1){return FALS;}; p=n.split("**");
      b=akin(h,(p[0]+"*")); e=akin(h,("*"+p[1])); return (b&&e); // starts-&-ends-with
   });
// ----------------------------------------------------------------------------------------------------------------------------




// tool :: time : returns seconds
// ----------------------------------------------------------------------------------------------------------------------------
   extend(MAIN)
   ({
      round:function round(n,d, r)
      {
         if(isList(n)){n.forEach((v,k)=>{n[k]=round(v,d)}); return n};
         if(!isNumr(n)){return}; if(isInum(n)){return n}; if(!d||!isInum(d)){return Math.round(n)}; r=n.toFixed(d); r=rtrim(rtrim(r,'0'),'.');
         r=(r*1); return r;
      },
      time:function time(d, r)
      {
         r=((isText(d)?Date.parse(d):Date.now()) / 1000);
         return (isInum(d)?round(r,d):Math.round(r));
      },
   });

   defn({BOOTTIME:time(4)});
// ----------------------------------------------------------------------------------------------------------------------------




// shiv :: (array) : tools for arrays
// ----------------------------------------------------------------------------------------------------------------------------
   extend(Array.prototype)
   ({
      ladd:function ladd(i){this.unshift(i); return this},
      radd:function radd(i){this[this.length]=i; return this},

      lpop:function lpop(n, r)
      {
          if(!n){r=this.shift(); return r;};
          if(n===TRUE){this.shift(); return this;};
      },
      rpop:function rpop(n, r)
      {
          if(!n){r=this.pop(); return r;};
          if(n===TRUE){this.pop(); return this;};
      },
      xpop:function xpop(f,n)
      {
          let x=this.indexOf(f); if(x > -1){this.splice(x,1)};
          return this;
      },

      item:function item(x){if(!isInum(x)){return}; if(x<0){x=(this.length+x)}; return this[x];},
      last:function last(i){let z=(this.length-1); if(i){return z}; return ((z<0)?VOID:this[z])},

      padd:function padd(l,r)
      {
          if(isVoid(l)){l=""}; if(isVoid(r)){r=""}; let z=[];
          this.forEach((i)=>{i=(l+i+r); z.radd(i)});
          return z;
      },
   });

   hard(function ladd(a,i){a.ladd(i); return a});
   hard(function radd(a,i){a.radd(i); return a});

   hard(function lpop(a,i){let r=a.lpop(); return r});
   hard(function rpop(a,i){let r=a.rpop(); return r});
   hard(function xpop(a,i){let r=a.xpop(); return r});

   hard(function last(a,i){let r=a.last(i); return r});

   hard(function args(a)
   {
       if(SERVERSIDE&&(!a||isNumr(a)))
       {
           let l=process.argv; l.shift(); l.shift();
           return (isNumr(a)?l[a]:l);
       };
       if(span(a)<1){return [];}; // void or empty
       if(!isList(a)){a=[a];}; // thing to arguments array
       if(isList(a[0])){a=a[0];}; // sub-arguments-array
       a=([].slice.call(a));
       return a;
   });
// ----------------------------------------------------------------------------------------------------------------------------




// shiv :: (number) : tools for numbers
// ----------------------------------------------------------------------------------------------------------------------------
   extend(Number.prototype)
   ({
      padd:function padd(max,wth=0)
      {
          let rsl,spn,pad; rsl=text(this); if(!isInum(max)||(max<1)||!isInum(wth)||(span(wth)>1)){return}; // validation
          spn=span(max); wth=text(wth); pad="";
          for(let i=0; i<spn; i++){if((pad+rsl).length==spn){break}; pad+=wth};
           // do{pad+=wth}while(pad.length<max);
          return (pad+rsl);
      },
   });
// ----------------------------------------------------------------------------------------------------------------------------




// shiv :: (Object.forEach) : expected functionality with added benefit: it stops when it should
// ----------------------------------------------------------------------------------------------------------------------------
   extend(Object.prototype)
   ({
       forEach:function forEach(cb)
       {
           for(let k in this)
           {
               if(!this.hasOwnProperty(k)){continue}; if(MAIN.HALT){moan("forEach halted"); break};
               let r=cb.apply(this,[this[k],k]); if(r===STOP){break};
           };
       },
   });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: nodeName : of element
// ----------------------------------------------------------------------------------------------------------------------------
   hard(function nodeName(o)
   {
      if(isNode(o)){return o.nodeName.toLowerCase()}; if(isKnob(o)){return keys(o)[0]};
   });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: fail : trigger error
// ----------------------------------------------------------------------------------------------------------------------------
    extend(MAIN)
    ({
        fail:function fail(m, a,n,f,l,s,p,o)
        {
           if(MAIN.HALT){return}; MAIN.HALT=1; if(MAIN.Busy){Busy.tint('red')}; tick.after(2000,()=>{MAIN.HALT=0});
           if(wrapOf(m)=="{}"){m=JSON.parse(m);};
           if(isText(m))
           {
               if(isin(m,"evnt: ")&&isin(m,"\nmesg: "))
               {
                   a=m.split("\n"); lpop(a); m=part(a[0],": ")[2]; n=part(m,' - ');
                   if(n&&isWord(n[0])){m=n[2];n=n[0]}else{n="Undefined"};
                   f=part(a[1],": ")[2]; l=part(a[2],": ")[2]; a=decode.jso(atob(part(a[3],": ")[2]));
                   s=[]; a.forEach((i)=>{radd(s,`${i.func} ${i.file} ${i.line}`)}); o={evnt:n,mesg:m,file:f,line:l,stak:s};
                   if(seenFail(o)){return}; emit("FAIL",o); return;
               };
               if(!isin(m,' :: ')){m=('Usage :: '+m);}; n=part(m,' :: '); m=n[2]; n=n[0]; s=stak(); p=(s[0]||"").split(" ");
               o={evnt:n,mesg:m,file:p[1],line:p[2],stak:s}; m=copyOf(o); moan(o);
               if(seenFail(o)){return}; emit("FAIL",o); return;
           };
           if(!isKnob(m)){console.error(m); alert("an error has occurred, me scuzi"); return};
           m.evnt=(m.evnt||m.name); if(!m.evnt){p=part(m.mesg," - "); if(p&&isWord(p[0])){m.evnt=p[0]; m.mesg=p[2]}};
           m.stak=(m.stak||stak());
           if(isKnob(m.stak[0])){s=[]; m.stak.forEach((i)=>{radd(s,`${i.func} ${i.file} ${i.line}`)}); m.stak=s};
           if(seenFail(m)){return}; emit("FAIL",m); return true;
       },

       seenFail:function seenFail(d, r)
       {
           d=md5(`${d.evnt}${d.mesg}${d.file}${d.line}`); r=(this.hash==d); this.hash=d; return r;
       }.bind({hash:""}),
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: jack : intercept class-constructors or methods
// ----------------------------------------------------------------------------------------------------------------------------
    const jack = function(k,v,x)
    {
        if(((typeof k)!='string')||!k.trim()){return}; // invalid reference
        if(!!v&&((typeof v)!='function')){return}; // invalid callback func
        if(!v){return this[k]}; // return existing definition, or undefined
        if(k in this){this[k].list[(this[k].list.length)]=v; return}; //add
        if(!x||((typeof x)!='object')){x=VOID}; //  validate once as object
        let h,n,c,f; h=k.split('.'); n=h.pop(); h=h.join('.'); //short vars
        this[k]={func:bore(MAIN,k),list:[v],evnt:x}; // callback definition
        h=(h?bore(MAIN,h):MAIN); c=isConstructor(this[k].func); //obj & con
        this[k].cons=c; bore(MAIN,k,null); //set cons & delete the original

        f=function()
        {
            let n,r,j,a,z,q; j='_fake_'; r=stak(0,j); r=(r||'').split(' ')[0];
            if(r.startsWith(j)||(r.indexOf(`.${j}`)>0)){n=(r.split(j).pop())};
            if(!n&&(r=='new')&&!!this.constructor){n=this.constructor.name;};
            if(!n){console.error(`can't jack "${r}"`);return}; r=jack(n);
            a=([].slice.call(arguments)); for(let p in r.list)
            {if(!r.list.hasOwnProperty(p)){continue}; let i=rename(j,r.list[p]);
            q=i.apply(this,a); if(q!=VOID){break};}; if(!Array.isArray(q)){q=[q]};
            try{if(!r.cons){z=r.func.apply(this,q)}else
            {z=(new (Function.prototype.bind.apply(r.func,[null].concat(a))));}}
            catch(e){if(!!r.evnt&&!!r.evnt.error){r.evnt.error(e)}
            else{console.error(e)};return}; if(!!r.evnt&&!!z.addEventListener)
            {for(let en in r.evnt){if(r.evnt.hasOwnProperty(en))
            {z.addEventListener(en,r.evnt[en],false)}}}; return z;
        };

        if(!c){f=rename(`_fake_${k}`,f)}; bake(h,n,f);
        try{h[n].prototype=Object.create(this[k].func.prototype)}catch(e){};
    }.bind({});

    bake(jack);

    hard(function hijack(l,f)
    {
        if(isList(l)){l.forEach((i)=>{jack(i,f)})};
        if(isKnob(l)){l.forEach((v,k)=>{jack(k,v)})};
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: stak : get call-stack .. returns array of text (per stack-item) .. should be compatible with all modern platforms
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function stak(x,a, e,s,r,h,o,d)
    {
        a=(a||""); e=(new Error(".")); s=e.stack.split("\n"); s.shift(); r=[];
        d=(CLIENTSIDE?HOSTPURL:twig(__filename));
        o=["_fake_"]; // omit

        s.forEach((i)=>
        {
            if(!isin(i,d)){return}; // validation & security
            let p,c,f,l,q; q=1; p=i.trim().split(d);
            c=p[0].split("@").join("").split("at ").join("").trim(); c=c.split(" ")[0]; if(!c){c="anon"};
            o.forEach((y)=>{if(((c.indexOf(y)==0)||(c.indexOf("."+y)>0))&&(a.indexOf(y)<0)){q=0}}); if(!q){return};
            p=(p[1]||p[0]).split(" "); f=p[0]; if(f.indexOf(":")>0){p=f.split(":"); f=p[0]}else{p=p.pop().split(":")};
            if((c=="stak")||(f=="/")){return}; l=p[1]; c=ltrim(c,"Object."); f=rtrim(f,")");
            if(f.startsWith(":")){p=part(f,"/")[2].split(":"); f=p[0]; l=(p[1]*1)};
            l=([c,("."+f),l]).join(" "); if(l.indexOf(" at ")>-1){return};
            r[r.length]=l;
        });
        if(!isNaN(x*1)){return r[x]}; return r;
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: enable : syntax sugar for custom-promise-callee constructor .. limits code duplication .. DRYKIS
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function enable(wrd,obj,fnc)
    {
        if(!expect.word(wrd)){return};
        if(isFunc(obj)&&!fnc){fnc=obj; obj=VOID; obj={}};
        if(!expect["knob,func"](obj)){return}; if(!expect.func(fnc)){return}; // validation
        if(!!obj[wrd]&&!obj[wrd][("en"+wrd)]){moan(`object.${wrd} is not undefined .. it will be replaced!`,obj)}; // warning
        if(!fnc.name){rename(fnc,wrd)}; fnc.assign({[("en"+wrd)]:1}); // name the caller and remember
        obj.assign({[wrd]:fnc}); tick.after(0,()=>{delete obj[wrd]}); // now you see me
        return obj;
    });

    hard(function enthen(obj,fnc){return enable("then",obj,fnc);}); // so easy!
    hard(function enwith(obj,fnc){return enable("with",obj,fnc);}); // to enable e.g: slap("garfield").with("a squeeky toy");
// ----------------------------------------------------------------------------------------------------------------------------




// func :: herald : upgrade given object to listen `upon` and `emit` events in its own scope
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function herald(o)
    {
        if(!o){o={}}; // validate

        if(!o.upon)
        {
            extend(o)
            ({
                upon:function upon(en,cb,bl,dj)
                {
                    let me=(this||MAIN); //if(!cb.name){rename(cb,(en+"EventHandler"))};
                    if(isKnob(en)){en.forEach((v,k)=>{me.upon(k,v)}); return me};
                    if(!me.upon.events[en]){me.upon.events[en]=[]}; me.upon.events[en].push(cb);
                    if(me.on&&!me.on.heralded){me.on(en,cb); return me};
                    if(me.addEventListener){me.addEventListener(en,cb,(bl?true:false)); return me};
                    return me;
                },
            });
            extend(o.upon)({events:{}});
        };

        if(!o.listen){extend(o)({listen:function listen(en,cb,bl){return this.upon(en,cb,bl)}})};
        if(!o.on){extend(o)({on:function on(en,cb,bl){return this.upon(en,cb,bl)}}); extend(o.on)({heralded:TRUE})};

        if(!o.when){extend(o)({when:function when(en,bl)
        {
            if(!this){fail("context issue .. `this` is undefined in heralded object.when"); return};
            enthen(this,function(cb){return this.upon(en,cb,bl)});
            return this;
        }})};


        // if(!!o.emit)
        // {
        //     let ae=o.emit.revise((obj)=>
        //     {
        //         obj.body.ladd(`enthen(this);`);
        //         obj.body[obj.body.last(1)]=`return this;`;
        //         return obj;
        //     });
        //     bake("emit",ae,o,1);
        // };


        if(!o.emit){extend(o)({emit:function emit(en,ev)
        {
            let me=(this||MAIN);
            if(me.dispatchEvent){me.dispatchEvent((new CustomEvent(en,{detail:ev})))}
            else{(me.upon.events[en]||[]).forEach((cb)=>{cb.apply(me,[{detail:ev}])})};
            enthen(me,function(cb){after(1)(()=>{cb.apply(this,[])}); return this});
            return me;
        }})};

        if(!o.signal){extend(o)({signal:function signal(en,ev)
        {
            return (this||MAIN).emit(en,ev);
        }})};

        if(!o.hush){extend(o)({hush:function hush(en,ev)
        {
            let me=(this||MAIN); if(!me.upon.events[en]){return me};
            if(!ev){delete me.upon.events[en]; return me};
            if(me.removeListener){me.removeEventListener(en,ev)};
            me.upon.events[en].xpop(ev); return me;
        }})};

        if(!o.revoke){extend(o)({revoke:function revoke(en,ev){return this.hush(en,ev)}})};

        return o;
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: tick : nice syntax for setTimeout and setInterval
// ----------------------------------------------------------------------------------------------------------------------------
    extend(MAIN)
    ({
        tick:
        {
            after:function after(frst,scnd)
            {
                if(isFrac(frst)){frst=Math.floor(frst*1000)}; // fraction to seconds
                if(!isFunc(scnd)){moan("2nd arg must be a function"); return}; // validation

                if(isNumr(frst)){let timr=setTimeout(scnd,frst); return timr}; // simple timeout
                if(isFunc(frst)&&isFunc(scnd)){scnd(frst());}; // syntax sugar
            },


            every:function every(frst,scnd,slow,lmit)
            {
                if(isFrac(frst)){frst=Math.floor(frst*1000)}; // fraction to seconds
                if(!isFunc(scnd)){moan("2nd arg must be a function"); return}; // validation
                if(!isInum(slow)||(slow<0)){slow=0}; if(!isInum(lmit)||(lmit<0)){lmit=null}; // normalize to prevent issues

                if(isNumr(frst))
                {
                    lmit=slow; if(!lmit){return setInterval(scnd,frst)}; // simple interval
                    let timr=setInterval(()=>{scnd(); lmit--; if(lmit<0){clearInterval(timr)};},frst);
                    return timr;
                };

                if(isFunc(frst)&&isFunc(scnd))
                {
                    let timr=setInterval(()=>
                    {
                        if(lmit!==null){lmit--; if(lmit<0){clearInterval(timr); return}};
                        let resl=frst(); if(resl||(resl===0)){scnd(resl)};
                    },slow);
                    return timr;
                };
            },


            until:function until(frst,scnd,slow,lmit)
            {
                if(!isFunc(frst)){fail("1st arg must be a function"); return}; // validation
                if(!isFunc(scnd)){fail("2nd arg must be a function"); return}; // validation
                if(!isInum(slow)||(slow<0)){slow=0}; if(!isInum(lmit)||(lmit<0)){lmit=null};

                let timr=setInterval(()=>
                {
                    if(lmit!==null){lmit--; if(lmit<0){clearInterval(timr); return}};
                    let resl=frst(); if(resl||(resl===0)){clearInterval(timr); scnd(resl);};
                },slow);
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

    hard(function cancel(tgt)
    {
        if(isKnob(tgt)&&isFunc(tgt.preventDefault)&&isFunc(tgt.stopPropagation))
        {tgt.preventDefault(); tgt.stopPropagation(); tgt.stopImmediatePropagation(); return true};
        try{clearInterval(tgt)}catch(e){}; try{clearTimout(tgt)}catch(e){}; return true;
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: trap : neat Proxy
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function trap(trgt,nick)
    {
        if(isText(trgt)){nick=trgt; trgt=(seen(trgt)||function(){});}; // given string
        return function(o)
        {
            if(isFunc(o)){o={get:o,set:o,apply:o,construct:o}};
            let r=(new Proxy(trgt,o)); if(!isWord(nick)){return r};
            extend(MAIN)({[nick]:r}); return r;
        };
    });

    extend(Object.prototype,Function.prototype)
    ({
        trap:function trap(o)
        {
            if(isFunc(o)){o={get:o,set:o,apply:o,construct:o}};
            if(!isKnob(o)){moan("invalid argument"); return}; // validation
            return (new Proxy(this,o));
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// tool :: expect : for validation .. usage: expect.bool(123); // throws error because 123 is not boolean
// ----------------------------------------------------------------------------------------------------------------------------
    trap("expect")
    ({
        get:function(o,k)
        {
            return function(v,c)
            {
                let gvn,exp,r,m,e; r=FALS; m=""; e="";

                if(k=="envi")
                {
                    if(!isin("web,ext,njs",v)){moan("wrong ENVITYPE string given"); return}; if(ENVITYPE==v){return TRUE};
                    v=upperCase(v); fail(`environment :: expecting ${v} context`); return FALS;
                };

                if(k=="args")
                {
                    gvn=(v||{}); exp=(c||{}); if(!exp.forEach){return}; exp.forEach((v,k)=>
                    {
                        if(!isText(v,1)||e){return}; if(!v.indexOf(",")<0){v+=",0"};
                        let p,t,f,c,w; p=v.split(","); t=p[0]; f=seen('is'+proprCase(t)); c=(p[2]*1);
                        if(f&&f(gvn[k],c)){r=TRUE}else{r=FALS; e=`${k} as :${t}:`;}
                    });

                    if(r){return r}; if(c>0){m=` -which must contain ${c} item(s) or more`};
                    fail(`type :: expecting ${e}${m}`); return r;
                };

                k=k.split(' ').join(",").split(",");
                k.forEach((i)=>{let f=seen('is'+proprCase(i)); if(f&&f(v,c)){r=TRUE}});
                if(r){return r}; // no issues .. all is well
                k=k.join(', or '); if(isNumr(c)){m=` -which must contain ${c} item(s) or more`};
                fail('type :: expecting '+k+m);
            };
        },
        apply:function(o,x,a, r)
        {
            a=a[0]; if(!isKnob(a)){fail('calling `expect` directly requires an object');return}; r=true;
            a.forEach((v,k)=>{let f=seen('is'+proprCase(k)); if(f&&!f(v)){fail('type :: expecting '+k); r=false;}});
            return r;
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------





// func :: expose : returns a list of items found in string wrapped inside string-pair
// ----------------------------------------------------------------------------------------------------------------------------
   hard(function expose(t,b,e,x)
   {
      if(!isText(t,1)||!isText(b,1)||!isText(e,1)||(t.indexOf(b)<0)||(t.indexOf(e)<0)){return};  // validate
      let r,ml,xb,xe,xs,bl,el; bl=b.length; el=e.length; ml=(bl+el); if(t.length<(ml+1)){return}; r=[];
      do
      {
         xb=t.indexOf(b); if(xb<0){break}; xe=t.indexOf(e,(xb+bl)); if(xe<0){break};
         xs=t.slice((xb+bl),xe); if(!x||test(xs,x)){r.push(xs); t=t.slice((xe+el));}else{t=t.slice(xe);};
      }
      while((t.length>ml)&&(xb>-1)&&(xe>-1))
      return ((r.length>0)?r:VOID);
   });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: hash : make a hash of any value .. `f` is expected as function -or hash-algorithm-name as function
// ----------------------------------------------------------------------------------------------------------------------------
   hard(function hash(v,f)
   {
      if(isFunc(v)&&!f){f=v; v=VOID}; if(!f){f="md5"}; if(isWord(f)){f=seen(f)}; if(!expect.func(f)){return};
      v=((v!==VOID)?text(v):(performance.now()+''+(Math.random().toString(36).slice(2,12))));
      return f(v);
   });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: swap : replace substrings .. yes it's a bit slower than [whatever], but it's handy and has no "issues"
// ----------------------------------------------------------------------------------------------------------------------------
   hard(function swap(s,f,r)
   {
      if(!isText(s)){return s}; if(isNumr(f)){f=(f+'')}; if(isNumr(r)){r=(r+'')}; // normalize
      if(isText(f)&&isText(r)){s=s.split(f).join(r); return s}; // all text
      if(isList(f)&&isText(r)){f.forEach((i,x)=>{s=s.split(i).join(r);}); return s}; // list of things to find & replace with r
      if(isList(f)&&isList(r)){f.forEach((i,x)=>{s=s.split(i).join(r[x]);}); return s}; // find & replace in order of f & r
      return s;
   });

   extend(String.prototype)
   ({
       swap:function swap(f,r){return MAIN.swap(this,f,r);}, // to use like: "whatever".swap("ever","what"); // whatwhat
   });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: reckon : calculate simple expressions in text .. works with mesurement-units too
// ----------------------------------------------------------------------------------------------------------------------------
    const reckon = function(txt,vrs, wrp,lst,opk,prt,lft,opr,rgt,rsl,tmp)
    {
        txt=trim(txt); if(!isText(txt,3)){return}; if(!isKnob(vrs)){vrs={}};
        opk=keys(this); wrp=wrapOf(txt); if(wrp=="()"){txt=unwrap(txt);};
        prt=part(txt,opk); if(!prt){return}; lft=mean(prt[0]); opr=prt[1]; rgt=mean(prt[2]); if(!this[opr]){return};

        if(!isNaN(lft)){lft*=1}; if(!isNaN(rgt)){rgt*=1}; let l,o,r;
        if(isText(lft)){l=bore(vrs,lft)}; if(l!=VOID){lft=l};
        if(isText(rgt)){r=bore(vrs,rgt)}; if(r!=VOID){rgt=r};

        tmp=part(rgt,opk); if(!tmp){rsl=this[opr](lft,rgt); return rsl;};
        return rsl;
    }
    .bind
    ({
        ' <= ':function(l,r){return (l<=r);},
        ' >= ':function(l,r){return (l>=r);},
        ' != ':function(l,r){return (l!==r);},
        ' !~ ':function(l,r){return (isin(l,"*")?!akin(r,l):!akin(l,r));},
        ' ~ ':function(l,r){return (isin(l,"*")?akin(r,l):akin(l,r));},
        ' = ':function(l,r){return (l===r);},
        ' + ':function(l,r){return (l+r);},
        ' - ':function(l,r){return (l-r);},
        ' / ':function(l,r){return (l/r);},
        ' % ':function(l,r){return (l%r);},
        ' < ':function(l,r){return (l<r);},
        ' > ':function(l,r){return (l>r);},
        ' | ':function(l,r){return (l||r);},
        ' & ':function(l,r){return (l&&r);},
        ' * ':function(l,r){return (l*r);},
    });

    bake("reckon",reckon);
// ----------------------------------------------------------------------------------------------------------------------------

    if(CLIENTSIDE){herald(MAIN)};
