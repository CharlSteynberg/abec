



// defn :: (dom-crud) : CRUD for the DOM .. runs clientSide
// ----------------------------------------------------------------------------------------------------------------------------
    if(CLIENTSIDE)
    {
        extend(Element.prototype)
        ({
            lookup:function(c,n, r,w,s,d)
            {
                if(c=="^"){return this.parentNode}; if(c=="^^"){c="^",n=2}; d=["^","<",">"];
                if(c=="<"){return this.previousSibling}; if(c==">"){return this.nextSibling}; if(!isText(c,1)){return};
                if((c=="<<")||(c==">>")){r=this.parentNode; return (!r?VOID:((c=="<<")?r.firstElementChild:r.lastElementChild))};
                if(!isin(d,c)||!isInum(n)||(n<1)){return this}; s=rpart(c,d); if(s&&!isNaN(s[2])){n=s[2]}; n=(n*1);
                r=this; w=((c=="^")?"parentNode":((c=="<")?"previousSibling":"nextSibling"));
                while(n){n--; if(!!r[w]){r=r[w]}else{break}}; // find
                return r; // returns found-relative, or self if relative-not-found
            },

            select:function select(def)
            {
                if(!isText(def,1)){return}; let chr,qry,rsl,lst,tmp; chr=def.slice(0,1); qry="querySelectorAll"; rsl=[];
                if(isin("^<>",chr)){return this.lookup(def);}; // parents & siblings
                if(def=="*") // all children .. omit empty `#text` nodes
                {
                    listOf(this.childNodes).forEach((n)=>{if(((n.nodeName!="#text")||n.textContent.trim())){rsl.radd(n)}});
                    return rsl;
                };
                lst=this[qry](`:scope ${def}`);
                if((lst.length<1)&&(chr=="#")&&(def.indexOf(" ")<1)){def=def.slice(1); lst=this[qry](`:scope [name=${def}]`)};
                if(lst.length<1){return}; listOf(lst).forEach((n)=> // fixed querySelector bug
                {
                    if(isin(def,"[value=")){tmp=part(def,"=")[2]; tmp=unwrap(rpart(tmp,"]")[0]); if(n.value!=tmp){return}};
                    rsl.radd(n);
                });
                if(rsl.length<1){return}; if(chr=="#"){rsl=rsl[0]}; // implied
                return rsl;
            },

            modify:function modify(obj)
            {
                if(!isKnob(obj)){return this}; // validation

                obj.forEach((v,k)=>
                {
                    if((k=="style")&&isKnob(v)){this.setStyle(v); return};
                    if(!isFunc(v)&&!isKnob(v)&&(k!="innerHTML")){this.setAttribute(k,v);}; // normal attribute
                    if(k=="class"){k="className"}; // prep attribute names for JS
                    if(k!="style"){this[k]=v};
                    // set as property -which possibly triggers some DOM event - TODO :: check - it MAY FIRE TWICE!!
                });

                if(isText(obj.href,1))
                {this.enclan("link"); this.upon("click",function href(e){cancel(e); MAIN.location.href=this.href})};

                return this;
            },

            insert:function insert(v)
            {
                if(v==VOID){return this}; let t=nodeName(this);
                if(isList(v)){var s=this; listOf(v).forEach((o)=>{s.insert(o)});return s}; // works with nodelist also
                if(t=="img"){return this}; // TODO :: impose?
                if(t=="input"){this.value=text(v); return this}; // form input text
                if(isNode(v)||isTemp(v)){this.appendChild(v); return this}; // normal DOM-node append
                if(isKnob(v)){let n=create(v); if(!isNode(n)){return this}; this.appendChild(n);return this}; //create & append
                if(isText(v)&&(wrapOf(trim(v))=="<>")){this.innerHTML=v; return this}; // insert as html
                if(!isText(v)){v=text(v);}; // convert any non-text to text .. circular, boolean, number, function, etc.
                if(isin("code,text",t)){this.textContent=v; return this;}; // insert as TEXT
                if(isin("style,script,pre,span,h1,h2,h3,h4,h5,h6,p,a,i,b",t)){this.innerHTML=v; return this}; // insert as HTML
                let n=create("span"); n.innerHTML=v; this.appendChild(n); return this; // append text as span
            },

            remove:function remove()
            {
                let a=args(arguments); a.forEach((d)=>
                {
                    if(isText(d)){d=this.select(d);}; if(!isList(d)){d=[d]};
                    d.forEach((n)=>{if(!isNode(n)){return}; n.parentNode.removeChild(n)});
                });
                return this;
            },

            getStyle:function getStyle()
            {
                let n,a,r,s,t,y; n=this; if(!expect.live(n)){return}; a=args(arguments); r={};
                if((a.length<2)&&isin(a[0],",")){a=mean(a[0])}; s=getComputedStyle(n);
                a.forEach((p)=>{t=s.getPropertyValue(p); y=(rtrim(t,"px")*1); r[p]=(!isNaN(y)?y:t)});
                return ((span(r)<2)?vals(r)[0]:r);
            },

            setStyle:function setStyle(a)
            {
                a=decode.pty(a); if(!isKnob(a,1)){return};
                a.forEach((v,k)=>{if(isNumr(v)&&!isin("zIndex,opacity,fontWeight",k)){v+="px"}; this.style[k]=v});
                return this;
            },
        });
    };
// ----------------------------------------------------------------------------------------------------------------------------




// defn :: (tools) : client-side
// ----------------------------------------------------------------------------------------------------------------------------
    if(CLIENTSIDE)
    {
        herald(document); herald(Element.prototype);


        extend(HTMLImageElement.prototype)
        ({
            toDataURL:function(m,q)
            {
                let c=document.createElement("canvas");
                c.width=this.naturalWidth; c.height=this.naturalHeight;
                c.getContext("2d").drawImage(this,0,0);
                c=c.toDataURL(m,q); return c;
            },
        });


        const copyToClipboard = str =>
        {
            let el=document.createElement("textarea"); el.value=str;
            el.setAttribute("readonly",""); el.style.position="absolute";
            el.style.left="-9999px"; BODY.appendChild(el); el.select();
            document.execCommand("copy"); BODY.removeChild(el);
        };
        bake(copyToClipboard);


        hard(function render(src,tgt,cbf)
        {
            if(isFunc(tgt)){cbf=tgt; tgt=VOID};
            if(!isNode(tgt)){tgt=BODY}; if(!isFunc(cbf)){cbf=function(){}}; tgt.innderHTML="";
            if(isPath(src)||isPurl(src))
            {
                let ext=fext(pathOf(src));
                if(!ext||!render.handle[ext]){fail(`missing handler for "${ext}" .. user render.modify()`); return};
                render.handle[ext](src,(rsl)=>{tgt.insert(rsl); cbf(rsl)});
                return;
            };
            // src=create({div:src}).select("*");  tgt.innderHTML=""; tgt.insert(src); cbf(src);
            tgt.innderHTML=""; tgt.insert(src); cbf(src);
        });

        extend(render)
        ({
            handle:
            {
                js:function js(src,cbf){cbf(create({script:"",src:src}));},
                css:function css(src,cbf){cbf(create({link:"",rel:"stylesheet",href:src}));},
                jpg:function jpg(src,cbf){cbf(create({img:"",src:src}));},
                png:function png(src,cbf){cbf(create({img:"",src:src}));},
                gif:function gif(src,cbf){cbf(create({img:"",src:src}));},
                txt:function txt(src,cbf){disk.readFile(src,(rsp)=>{cbf(create({pre:rsp}))});},
                htm:function htm(src,cbf){disk.readFile(src,(rsp)=>{cbf(create({div:rsp}).select("*"))});},
                html:function html(src,cbf){render.handle.htm(src,cbf);},
                jpeg:function jpeg(src,cbf){cbf(create({img:"",src:src}));},
                webp:function webp(src,cbf){cbf(create({img:"",src:src}));},
                json:function json(src,cbf){disk.readFile(src,(rsp)=>{cbf(decode.jso(rsp))});},
            },
            modify:function modify(obj)
            {
                extend(this.handle)(obj);
            },
        });

        extend(Element.prototype)
        ({
            render:function render(def,cbf)
            {
                MAIN.render(def,this,cbf);
            },
        });


        hard(function rect(a)
        {
            if(isText(a)){a=select(a)}; if(!isNode(a)){fail("reference :: expecting node or #nodeID");return};
            if(!a.parentNode){fail("lookup :: node is not attached to the DOM .. yet");return};
            let r=decode.jso(encode.jso(a.getBoundingClientRect())); r.forEach((v,k)=>{r[k]=Math.round(v)});
            return r;
        });


        hard(function styleSheet(d)
        {
          let r,z,l; r=VOID; z={}; if(!isText(d,1)){return};
          l=listOf(document.styleSheets); if(d==="*"){return l}; l.forEach((v)=>
          {if(isin(v.ownerNode.href,d)||(v.ownerNode.id==d)||isin(v.className,d)){r=listOf(v.rules); return STOP}});
          (r||{}).forEach((i)=>
          {
             let s=i.selectorText; let p={}; if(!s||!isin(i.cssText,';')){return};
             let q=trim(unwrap(trim(i.cssText.split(s)[1]))).split(';'); q.forEach((y)=>{y=part(y,':'); if(!y){return};
             let k=trim(y[0]); let v=trim(y[2]); if(isNumr(v)){v*=1}else{v=unwrap(v)}; p[k]=v}); z[s]=p;
          });
          return z;
        });

    };
// ----------------------------------------------------------------------------------------------------------------------------







// func :: ordain : creates a named template, used as CSS-class-name for attribute enheritance, including events
// ----------------------------------------------------------------------------------------------------------------------------
    extend(MAIN)
    ({
        ordain:function ordain(nme,obj)
        {
            if(!expect.word(nme)){return}; if(!!this.done[nme]){return TRUE};
            if(!!select(`#${nme}`)){fail(`a node with ID "${nme}" already exists`); return};

            let wth = function(a)
            {
                let k,n,t; n=this.n;
                if(isKnob(a,1))
                {
                    if(isKnob(a.style)){a.style=decode.pty(a.style)};
                    this.s.done[n]=a;
                }
                else if(isText(a,1))
                {
                    if(!isin(a,"{")){a=decode.b64(a)}; t=create({style:("#"+n),$:a});
                    this.s.done[n]=t; HEAD.insert(t);
                    this.s.call();
                };
            }
            .bind({n:nme,s:this});

            return (!isVoid(obj)?wth(obj):enwith(wth));
        }
        .bind
        ({
            done: {},
            call: function call(w)
            {
                ((isText(w,1)&&!!this.done[w])?[w]:keys(this.done)).forEach((c)=>
                {
                    let v=copyOf(this.done[c]); if(isText(v)){return}; // clobal CSS class
                    (select("."+c)||[]).forEach((n)=>{if(n.ordained==c){return}; n.ordained=c; n.modify(v);});
                });
            },
        })
    });


    hard(function ornate(nme,css)
    {
        let wth = function(txt){if(isKnob(txt)){txt=encode.css(txt)}; return ordain(nme,txt)};
        return (!isVoid(css)?wth(css):enwith(wth));
    });


    hard(function cssGrp(c,l,o)
    {
        if(!expect.text(c,1)){return}; let q=0; if(isKnob(l)){o=l; l=[0]; q=1}; if(isVoid(l)){l=[0]; q=1};
        if(!expect.list(l)){return}; let r,s,z,d; r=""; s=l.length; z=l.item(-1); d={}; l.forEach((i)=>
        {
            let x=(q?"":i.padd(s)); if(isText(o)&&isin(o,"?")){r+=(c+x+" {"+o.swap("?",i)+"}\n"); return};
            if(isKnob(o)){o.forEach((v,k)=>{r+=(c+k+x+" {"+text(v).swap("?",i)+"}\n")}); return};
            if(isFunc(o))
            {
                let t; t=o.apply(l,[i,z]); if(!isKnob(t,1)){return};
                t.forEach((v,k)=>{if(d[(c+k)]){return}; d[(c+k)]=1; r+=(c+k+" {"+v+"}\n")}); return;
            };
        });
        return r;
    });
// ----------------------------------------------------------------------------------------------------------------------------




// tool :: (Element.prototype) : enclan/declan .. add/remove classNames of an element
// ----------------------------------------------------------------------------------------------------------------------------
    if(CLIENTSIDE)
    {
       extend(Element.prototype)
       ({
          enclan:function()
          {
             let c,l,a,slf; slf=this; c=(slf.className||'').trim(); l=(c?c.split(' '):[]); a=args(arguments);
             a.forEach((v,k)=>{v=ltrim(v,'.'); if(!isin(l,v)){l.push(v);}});
             this.className=l.join(' ').trim();
          },


          declan:function()
          {
             var c,l,a,x; c=(this.className||'').trim(); l=(c?c.split(' '):[]); a=listOf(arguments);
             a.forEach((i)=>{x=l.indexOf(ltrim(i,'.')); if(x>-1){l.splice(x,1)}}); this.className=l.join(' ').trim();
          },


          reclan:function()
          {
             var a; a=listOf(arguments); a.forEach((i)=>
             {
                if(!isText(i)||!isin(i,':')){return}; let p=i.split(':'); let f=p[0].trim(); let t=p[1].trim();
                if(!f||!t){return}; this.declan(f); this.enclan(t);
             });
          },


          inclan:function()
          {
             var a,c,r; a=listOf(arguments); c=(this.className||'').trim(); r=FALS;
             a.forEach((i)=>{i=ltrim(i,'.'); if(isin(c),i){r=TRUE;return STOP}});
             return r;
          },


          enbool:function(w)
          {
             if(!isText(w,1)){return}; this[w]=true; this.setAttribute(w,w); this.enclan(w);
          },


          debool:function(w)
          {
             if(!isText(w,1)){return}; this[w]=false; this.removeAttribute(w); this.declan(w);
          },
       });
    };
// ----------------------------------------------------------------------------------------------------------------------------




// tool :: (Element.prototype) : assort .. sort node placement order either by `sorted` (arg/parent), or `placed` of siblings
// ----------------------------------------------------------------------------------------------------------------------------
    if(CLIENTSIDE)
    {
       extend(Element.prototype)
       ({
          assort:function(r, f,w)
          {
             if(!r){r=this.sorted}; w=`assort rule: ${r}`; f=`invalid ${w}`;  let prts,slct,attr,ordr,indx,fltr;
             if(!isText(r,6)||!isin(r,"::")){fail(f);return}; prts=part(r,"::"); slct=trim(prts[0]);
             prts=part(trim(prts[2]),":"); if(!slct||!prts){return}; attr=trim(prts[0]); ordr=lowerCase(trim(prts[2]));
             if(!attr||!ordr){return}; slct=this.select(slct); if(!slct){return}; indx={};
             slct.forEach((n)=>{let a=bore(n,attr); if(isVoid(a)){return}; indx[a]=n; remove(n)});
             fltr=(keys(indx)).sort(); if(ordr=="dsc"){fltr.reverse()}; fltr.forEach((i)=>{this.appendChild(indx[i])});
          },
       });
    };
// ----------------------------------------------------------------------------------------------------------------------------




// sham :: Cookies : cookie handler .. https://github.com/js-cookie/js-cookie
// ----------------------------------------------------------------------------------------------------------------------------
    if(CLIENTSIDE)
    {
        !function(e){var n=!1;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var o=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=o,t}}}(function(){function g(){for(var e=0,n={};e<arguments.length;e++){var o=arguments[e];for(var t in o)n[t]=o[t]}return n}return function e(l){function C(e,n,o){var t;if("undefined"!=typeof document){if(1<arguments.length){if("number"==typeof(o=g({path:"/"},C.defaults,o)).expires){var r=new Date;r.setMilliseconds(r.getMilliseconds()+864e5*o.expires),o.expires=r}o.expires=o.expires?o.expires.toUTCString():"";try{t=JSON.stringify(n),/^[\{\[]/.test(t)&&(n=t)}catch(e){}n=l.write?l.write(n,e):encodeURIComponent(String(n)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),e=(e=(e=encodeURIComponent(String(e))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape);var i="";for(var c in o)o[c]&&(i+="; "+c,!0!==o[c]&&(i+="="+o[c]));return document.cookie=e+"="+n+i}e||(t={});for(var a=document.cookie?document.cookie.split("; "):[],s=/(%[0-9A-Z]{2})+/g,f=0;f<a.length;f++){var p=a[f].split("="),d=p.slice(1).join("=");this.json||'"'!==d.charAt(0)||(d=d.slice(1,-1));try{var u=p[0].replace(s,decodeURIComponent);if(d=l.read?l.read(d,u):l(d,u)||d.replace(s,decodeURIComponent),this.json)try{d=JSON.parse(d)}catch(e){}if(e===u){t=d;break}e||(t[u]=d)}catch(e){}}return t}}return(C.set=C).get=function(e){return C.call(C,e)},C.getJSON=function(){return C.apply({json:!0},[].slice.call(arguments))},C.defaults={},C.remove=function(e,n){C(e,"",g(n,{expires:-1}))},C.withConverter=e,C}(function(){})});
        Cookies.defaults.path='/';
        // Cookies.defaults.domain=HOSTNAME;

        Http.request.assign({apikey:Cookies.get("apikey")}); Cookies.remove("apikey"); // for security
    };
// ----------------------------------------------------------------------------------------------------------------------------




// func :: parlay : modal basis .. creates a user-negotiations layer that disables anything under it .. closes with ESC-key
// ----------------------------------------------------------------------------------------------------------------------------
    if(CLIENTSIDE)
    {
        hard(function parlay(dfn)
        {
            let lay=create({view:`.parlay .bgtint`, tabindex:-1, $:dfn});
            lay.listen("KeyDown",function(btn){dump(btn)});
            BODY.insert(lay); after(10)(()=>{lay.focus()});
        });
    };
// ----------------------------------------------------------------------------------------------------------------------------




// func :: popwin : client-side .. modals
// ----------------------------------------------------------------------------------------------------------------------------
    if(CLIENTSIDE)
    {
        hard(function popwin()
        {

        });
    };
// ----------------------------------------------------------------------------------------------------------------------------
