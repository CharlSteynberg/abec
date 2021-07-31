



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
        return RESERVED.meta.hasAny(v.expose(KEYS)); // returns first if found, else false
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
        if((d===NULL)||(d===VOID)||(!d&&isNaN(d))){return 0};  if(!isNaN(d)){ d+="" }; // get obvious out the way + prep d
        let s=d.length; if(!isNaN(s)){ return s }; // has `length` already so use it .. namaste
        if(x&&((typeof x)=="string")&&((typeof d)=="string")){return (d.split(x).length-1)}; // count occurences of x
        try{ s=Object.getOwnPropertyNames(d).length; return s } // count keys in obj
        catch(e){ return 0 }
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




// func :: cancel : clearTimeout + event-prevent stuff
// ----------------------------------------------------------------------------------------------------------------------------
    global(function cancel(that)
    {
        if (!that){ return that }; // whatever that was :D
        if (isFunc(that.preventDefault))
        {
            that.preventDefault();
            that.stopPropagation();
            that.stopImmediatePropagation();
            that.define({status:"dead"});
            return that;
        };

        try{ clearTimeout(that) }
        catch(er){};
    });
// ----------------------------------------------------------------------------------------------------------------------------
