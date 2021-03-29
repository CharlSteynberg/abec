



// shim :: (Object.indexOf) : find an object key like this: {foo:123}.indexOf(123); // foo
// ----------------------------------------------------------------------------------------------------------------------------
    extend(Object.prototype)
    ({
        indexOf:function indexOf(x)
        {
            let k,v,i; k=keys(this); v=vals(this); i=v.indexOf(x);
            if(i<0){return i}; return k[i];
        },

        join:function join(x)
        {
            if(span(keys(x))<1){return this}; x.forEach((v,k)=>{this[k]=v});
            return this;
        },

        concat:function concat(x)
        {
            if(span(keys(x))<1){return this}; x.forEach((v,k)=>{this[k]=v});
            return this;
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: (Function.join) : extend function to access properties like `this.whatever` -even externally
// ----------------------------------------------------------------------------------------------------------------------------
    extend(Function.prototype)
    ({
        join:function join(o)
        {
            if(!expect.knob(o)){return};
            let r=this.bind(o); o.forEach((v,k)=>{r[k]=v});
            return r;
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// sham :: (Function.revise) : change how a function works in place .. meta-programming
// ----------------------------------------------------------------------------------------------------------------------------
    extend(Function.prototype)
    ({
        parted:function parted()
        {
            let txt,prt,nme,aro,arg,bdy,rsl; txt=this.toString(); prt=part(txt,"{");

            nme=prt[0].split("(")[0].trim(); aro=(nme?"":"=>");
            arg=prt[0].split(")")[0].split("(")[1].split(" ").join(""); arg=(arg?arg.split(","):[]);
            bdy=rpart(prt[2],"}")[0].trim(); bdy=(bdy?bdy.split("\n"):[]);  rsl={name:nme,args:arg,arro:aro,body:bdy};

            rsl.toString=function()
            {
                let rsl=(this.name+"("+this.args.join(",")+")"+this.arro+"\n{\n"+this.body.join("\n")+"\n};");
            }.bind(rsl);

            return rsl;
        },

        revise:function revise(fnc)
        {
            if(!expect.func(fnc)){return}; let rsl=this.parted().toString();
            return mean(rsl);
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: (Object.prototype) : CRUD functionality
// ----------------------------------------------------------------------------------------------------------------------------
    extend(Object.prototype)
    ({
        "soft update":function update(atr)
        {
            if(!expect.knob(atr)){return};
            let rsl,lst; rsl=copyOf(this); lst=keys(rsl);
            atr.forEach((v,k)=>{if(!isin(lst,k)){moan(`undefined key: ${k}`); return}; rsl[k]=v});
            return rsl;
        },

        "soft modify":function modify(atr)
        {
            if(!expect.knob(atr)){return};
            let rsl,lst; rsl={}; lst=keys(this);
            this.forEach((v,k)=>{if(!isin(lst,k)){moan(`undefined key: ${k}`); return}; rsl[(atr[k]||k)]=v});
            return rsl;
        },

        assign:function assign(obj)
        {
            if(!expect.knob(obj)){return};
            obj.forEach((v,k)=>{this[k]=v});
            return this;
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: (Array.prototype) : misc functionality
// ----------------------------------------------------------------------------------------------------------------------------
    extend(Array.prototype)
    ({
        assign:function assign(what)
        {
            let resl = {};  if(isKnob(what)){what=vals(what)};  if(!isList(what,1)){return this};
            what.forEach((name,indx)=>{resl[name]=this[indx]});
            return resl;
        },


        random:function random(num)
        {
            let a,r; a=copyOf(this);
            for (let i=(a.length-1); i>0; i--)
            {
                let j = Math.floor(Math.random()*(i+1));
                [a[i], a[j]] = [a[j], a[i]];
            }

            if(!isInum(num)||(num<1)){return ((num<1)?[]:a)};
            r=a.slice(0,num); return ((num<2)?r[0]:r);
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: (Array.prototype) : CRUD functionality
// ----------------------------------------------------------------------------------------------------------------------------
    extend(Array.prototype)
    ({
        insert:function insert(opt)
        {
            if((this.length>1)&&!expect.data(this)){return}; // CRUD validation
            let okl,nkl,rsl; rsl=true;

            if(isList(opt))
            {
                if(!expect.data(opt)){return}; // validation
                okl=keys(this[0]); opt.forEach((row)=>
                {
                    if(!rsl){return}; // failed before
                    if(okl!==keys(row)){rsl=false; fail("column missmatch"); return};
                    this.radd(row);
                });
                return rsl;
            };
        },



        select:function select(opt)
        {
            if((this.length>1)&&!expect.data(this)){return}; // CRUD validation
            if(isFunc(opt)){opt={apply:opt}}else
            if(isin(["*",UNIQUE,COPIES],opt)){opt=((opt=="*")?{fetch:"*"}:{fetch:"*",where:opt})};
            if(!expect.knob(opt,1)){return []}; // SELECT validation

            if(isText(opt.fetch)&&(wrapOf(opt.fetch)!="::")&&isin(opt.fetch,[":"," ",","]))
            {opt.fetch=(isin(opt.fetch,": ")?opt.fetch:mean(opt.fetch.swap(" ","\n")))};
            if(isWord(opt.fetch)){opt.fetch={[opt.fetch]:opt.fetch}}; if(!opt.fetch){opt.fetch="*"};

            if(isList(opt.fetch)){opt.fetch=opt.fetch.assign(opt.fetch);};
            if(isText(opt.order)){opt.order=trim(opt.order); if(!isin(opt.order,":")){opt.order+=":ASC"}};

            let rsl=[];  let dne=0;  let uni={};  for(let k in this)
            {
                if(!this.hasOwnProperty(k)){continue};
                let add,itm,tmp,lst,val,hsh,spn; add={}; itm=this[k];

                if(opt.fetch=="*"){add=itm}
                else if(isKnob(opt.fetch))
                {
                    if(!isKnob(itm)){itm={value:itm};}; lst=keys(itm);
                    opt.fetch.forEach((v,k)=>
                    {
                        val=bore(itm,k); if(val!=VOID){add[v]=val};
                    });
                };

                if(isText(opt.where,1))
                {
                    if(opt.where==UNIQUE)
                    {
                        spn=span(add); hsh=hash((spn>0)?add:itm);
                        if(uni[hsh]){continue}; add=((spn>0)?add:itm); uni[hsh]=1;
                    }
                    else if(opt.where==COPIES)
                    {
                        spn=span(add); hsh=hash((spn>0)?add:itm);
                        if(uni[hsh]){add=((spn>0)?add:itm)}else{add={}}; uni[hsh]=1;
                    }
                    else if(!reckon(opt.where,itm.join(add))){continue};
                };

                if(isFunc(opt.apply)){add=opt.apply(((span(add)>0)?add:itm),itm,k)};

                if(span(add)>0)
                {
                    dne++; rsl.radd(add);
                    if(isInum(opt.limit) && (dne>=opt.limit))
                    {break;};
                };
            };

            if(isText(opt.order,5))
            {
                let prt,col,ord,lst,bfr,ref; prt=opt.order.split(":"); col=prt[0]; ord=upperCase(prt[1]);
                lst=rsl; rsl=[]; bfr=[]; ref=[]; if(!isin("ASC,DSC",ord)){ord="ASC";};

                lst.forEach((obj,idx)=>
                {
                    let val=bore(obj,col); // get deep value by reference
                    if(val==VOID){moan(`undefined field: "${col}"`); return}; // invalid field-name
                    bfr.radd(val); ref.radd(val);
                });

                bfr=bfr.sort(); if(ord=="DSC"){bfr=bfr.reverse()};
                bfr.forEach((itm)=>{let oir=ref.indexOf(itm); rsl.radd(lst[oir]);});
            };

            return rsl;
        },



        "delete": function(opt) // `delete` is a reserved word, but this works
        {
            if((this.length>1)&&!expect.data(this)){return}; // CRUD validation
            if(!expect.knob(opt,1)){return}; // DELETE validation
            let rsl,dne; rsl=[]; dne=0; for(let k in this)
            {
                if(!this.hasOwnProperty(k)){continue};
                let row,tmp,add; row=this[k]; add=1;

                if(isText(opt.where,1) && reckon(opt.where,row)){add=0; dne++};

                if(add){rsl.radd(row)};
                if(isNumr(opt.limit)&&(dne>=opt.limit)){break};
            };

            return rsl;
        },



        update:function update(opt)
        {
            if((this.length>1)&&!expect.data(this)){return}; // CRUD validation
            if(!expect.knob(opt,1)){return}; // UPDATE validation

            let rsl,dne; rsl=[]; dne=0; for(let k in this)
            {
                if(!this.hasOwnProperty(k)){continue};
                let itm,row; itm=this[k]; row=VOID;

                if(isText(opt.where,1) && reckon(opt.where,row) && isKnob(opt.write))
                {row=itm.update(opt.write)};

                if(!row && isKnob(opt.write)){row=itm.update(opt.write)};

                if(!!row && isFunc(opt.apply)){row=opt.apply(row,itm)};

                if(isKnob(row)){rsl.radd(row); dne++}else{rsl.radd(itm)};
                if(isNumr(opt.limit)&&(dne>=opt.limit)){break};
            };

            return rsl;
        },



        modify:function modify(opt)
        {
            if(isFunc(opt))
            {
                let rsl=[]; this.forEach((v,k)=>{let r=opt.apply(this,[v,k]); if(r!==VOID){rsl.radd(r)}});
                return rsl;
            };

            if((this.length>1)&&!expect.data(this)){return}; // CRUD validation
            if(!expect.knob(opt,1)){return []}; // MODIFY validation

            if(isKnob(opt.alter))
            {
                let rsl=[]; this.forEach((row)=>
                {rsl.radd(row.modify(opt.alter));});

                return rsl; // TODO :: do not return here
            };
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------







// sham :: (syntax-sugar) : used for using JS as CSS
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function url(a){return `url("${a}")`});
    hard(function hsl(h,s,l){return `hsl(${h},${s}%,${l}%)`});
    hard(function hsla(h,s,l,a){return `hsla(${h},${s}%,${l}%,${a})`});
    hard(function rgb(r,g,b){return `rgb(${r},${g},${b})`});
    hard(function rgba(r,g,b){return `rgb(${r},${g},${b},${a})`});
    // TODO :: attr, calc, var, etc.
// ----------------------------------------------------------------------------------------------------------------------------




// tool :: encode/decode : unified syntax for various encoding and decoding methods
// ----------------------------------------------------------------------------------------------------------------------------
    extend(MAIN)
    ({
        encode:
        {
            blo:function(arg1,type)
            {
                if(isList(arg1)||isText(arg1))
                {
                    var resl = (new Blob([arg1],{type:(type||'text/plain')}));
                    return resl;
                };

                if(isKnob(arg1)&&(isText(arg1.mime)||isText(arg1.type))&&!!arg1.data)
                {
                    let l,s,a,r; s=arg1.data.length; l=(new Array(s));
                    for(let i=0; i<s; i++){l[i]=arg1.data.charCodeAt(i)};
                    a=(new Uint8Array(l)); r=(new Blob([a],{type:trim(arg1.mime)}));
                    return r;
                };
            },

            jso:function jso(what)
            {
                let resl=VOID; try{resl=JSON.stringify(what)}catch(e){};
                return resl;
            },

            b64:function b64(what)
            {
                let resl=VOID; try{resl=btoa(what)}catch(e){};
                return resl;
            },

            uri:function uri(what)
            {
                let resl=VOID; try{resl=encodeURIComponent(what)}catch(e){};
                return resl;
            },

            url:function uri(what)
            {
                let resl=VOID; try{resl=encodeURI(what)}catch(e){};
                return resl;
            },

            atr:function atr(o)
            {
                if(!isKnob(o)){return}; let r=[];
                o.forEach((v,k)=>{k=breakCase(k); r.radd(`${k}="${v}"`)});
                r=r.join(" "); return r;
            },

            pty:function pty(o,d)
            {
                if(!isKnob(o,1)){return}; let r=[]; if(isVoid(d)){d=" "};
                o.forEach((v,k)=>{k=breakCase(k); r.radd(`${k}:${v};`)});
                r=r.join(d); return r;
            },

            css:function css(o,d)
            {
                if(!isKnob(o,1)){return}; let r=[]; if(isVoid(d)){d="\n"};
                o.forEach((sv,sk)=>{sv=this.pty(sv,d); r.radd(d+sk+d+"{"+d+sv+d+"}")});
                r=r.join(d); return (r+d);
            },
        },


        decode:
        {
            blo:function blo(d,f)
            {
                if((d instanceof Blob)||(!!d&&isPath(`/${d.type}`)&&isInum(d.size)&&isInum(d.lastModified)))
                {
                    var p=(new FileReader()); p.onloadend=function(){f(p.result);};
                    p.readAsDataURL(d); return;
                };

                if(isKnob(d)&&(isText(d.mime)||isText(d.type)))
                {
                    let r=encode.BLOB(d.type);
                    if(!r){fail("Type :: invalid blob(ish) object"); return};
                    decode.BLOB(r,f); return;
                };

                fail("Args :: invalid 1st parameter");
            },

            jso:function jso(what)
            {
                let resl=VOID; try{resl=JSON.parse(what)}catch(e){};
                return resl;
            },

            b64:function b64(what)
            {
                let resl=VOID; try{resl=atob(what)}catch(e){};
                return resl;
            },

            uri:function uri(what)
            {
                let resl=VOID; try{resl=decodeURIComponent(what)}catch(e){};
                return resl;
            },

            url:function uri(what)
            {
                let resl=VOID; try{resl=decodeURI(what)}catch(e){};
                return resl;
            },

            atr:function atr(d)
            {
                if(isText(d)){d=d.trim()}; if(!isText(d,1)){return}; let l,r,k;
                l=d.split('\n').join(' '); l+=' '; l=swap(l,['   ','  '],' '); r={};
                l.split('" ').forEach((i)=>{i=i.trim().split('="'); k=trim(i[0]); if(!k){return}; let v=sval(i[1]); r[k]=v});
                return r;
            },

            pty:function pty(d)
            {
                let o,r,y; o=mean(d); if(!isKnob(o)){return}; r={};
                o.forEach((v,k)=>{if(isin(k,"-")){k=camelCase(k,1)}; r[k]=v});
                return r;
            },

            css:function css(d)
            {
                if(!isText(d,1)){return}; let l,r; l=d.split("}"); r={}; if(span(l)<2){return};
                l.forEach((i)=>
                {
                    let p,s; p=part(i,"{"); if(!p){return}; s=trim(p[0]); p=p[2].split(";"); if(span(p)<2){return};
                    let t={}; p.forEach((x)=>{x=part(x,":"); if(!x){return}; let k,v; k=camelCase(k,1); t[k]=v}); r[s]=t;
                });
                return r;
            },
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: endurl : data-url from path
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function endurl(pth,opt)
    {
        if(isText(pth,1)&&!isPath(pth)&&isText(opt,1))
        {
            return ("data:"+opt+";base64,"+encode.b64(pth));
        };

        if(SERVERSIDE)
        {
            if(!expect.path(pth)||(opt&&(opt!==PARTED))){return}; let rsl,mim; mim=mime(pth);
            if(!mim){moan("undefine mime-type"); return};
            rsl=Fsys.readFileSync(pth); rsl=Buffer.from(rsl).toString("base64");
            if(!opt){return ("data:"+mim+";base64,"+rsl)};
            return {head:mim,body:rsl};
        };

        moan("TODO :: client-side implimentation");
    });

    hard(function dedurl(txt,opt)
    {
        if(!expect.durl(txt)||(opt&&(opt!==PARTED))){return};
        let r,p; p=part(txt,","); r={head:p[0],body:p[2]};
        r.head=r.head.split(":").pop().split(";")[0]; r.body=decode.b64(r.body);
        return (opt?r:r.body);
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: loadFont : sync/async way to load a font from path -or data-url .. path is only sync on server-side
// ----------------------------------------------------------------------------------------------------------------------------
    defn({loadFont:function loadFont(txt,cls,pty,cbf)
    {
        if(isPath(txt)&&SERVERSIDE)
        {
            cbf=cls; if(!cbf){return opentype.loadSync(pth)}; if(!expect.func(cbf)){return};
            return opentype.load(pth,cbf);
        };

        if(!isText(txt,5)){fail("expecting 1st arg as :text:"); return};
        if(!isWord(cls)){fail("expecting 2nd arg as :word:"); return}; var me,du,mt; me=this; mt=mime(txt);
        if(isFunc(pty)){cbf=pty; pty=VOID}; if(!isFunc(cbf)){fail("expecting 3rd/4th arg as :func:"); return};

        if(isPath(txt))
        {
            opentype.load(txt,(err,fnt)=>{if(err){fail(err); return};
            me.writeCSS(mt,fnt,cls,pty,cbf)});
            return;
        };

        if(isDurl(txt))
        {
            if(!expect.func(cbf)){return}; let bs,ms,ab,ia,rb,ro;
            bs = atob(txt.split(',')[1]);
            ms = txt.split(',')[0].split(':')[1].split(';')[0];
            ab = new ArrayBuffer(bs.length);
            ia = new Uint8Array(ab);
            for (let i = 0; i < bs.length; i++) {ia[i] = bs.charCodeAt(i)}
            rb = new Blob([ab],{type:ms});
            new Response(rb).arrayBuffer().then((bd)=>
            {ro = opentype.parse(bd); me.writeCSS(mt,ro,cls,pty,cbf);});
            return;
        };
    }
    .bind({writeCSS:function(mim,fnt,cls,pty,cbf)
    {
        var bfr,blo,rdr,css,fmt;  bfr=fnt.toArrayBuffer();
        blo=(new Blob([bfr],{type:mim})); rdr=(new FileReader());
        rdr.addEventListener("load",()=>
        {
            blo=rdr.result;

            let mim,css,fmt; fmt=fnt.outlinesFormat;
            css=`@font-face{font-family:"${cls}"; src:url("${blo}") format("${fmt}");}\n\n`;
            css+=`[class^="${cls}-"], [class*=" ${cls}-"] {font-family:"${cls}" !important; `
            // add pty as CSS
            css+=`-webkit-font-smoothing:antialiased; -moz-osx-font-smoothing: grayscale;}\n\n`
            if(fnt.glyphNames.names.length>0){fnt.glyphs.glyphs.forEach((g)=>
            {
                if(!g.unicode||!g.name||g.name.startsWith('.')){return}; let c=g.unicode.toString(16);
                css+=`.${cls}-${g.name}:before{content:"\\${c}";}\n`;
            })}
            else
            {
                for(let gx=33; gx<256; gx++)
                {let hx=gx.toString(16); while(hx.length<4){hx=`0${hx}`}; css+=`.${fam}-${hx}:before{content:"\\${hx}";}\n`;};
            };
            HEAD.insert({style:("#Font_"+cls), $:css});
            cbf(fnt);
        });
        rdr.readAsDataURL(blo);
    }})});
// ----------------------------------------------------------------------------------------------------------------------------




// sham :: Math.rand : shorter and more intuitive
// ----------------------------------------------------------------------------------------------------------------------------
    extend(Math)
    ({
        rand:function rand(min,max)
        {
            return Math.floor(Math.random()*(max-min+1)+min);
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: wack : kick out hackers
// ----------------------------------------------------------------------------------------------------------------------------
    extend(MAIN)
    ({
        wack:function wack(arg)
        {
            let msg=decode.b64(this.msg).split("|");

            if(isList(arg))
            {msg=msg.concat(arg); this.msg=encode.b64(msg.join("|")); return TRUE;}; // added messages

            msg=msg.random(1); if(arg){return msg}; // return message instead of wacking
            MAIN.HALT=1; if(SERVERSIDE){moan("forbidden"); moan(msg); dump(stak(),"\n"); return}; // .. may be handy some time
            moan("forbidden"); moan(msg); dump(stak()); HEAD.innerHTML=""; BODY.innerHTML=msg;
        }
        .bind
        ({
            msg:"aW5zZXJ0IDUwYyBhbmQgdHJ5IGFnYWlufHN0b3AgYnJlYWtpbmcgc2ghdHxiZXR0ZXIgbHVjayBuZXh0IHRpbWV8b2theSBmaW5lLCB5b3Ugd2lufHRoYW5rIHlvdSBnZW5pdXMsIG5vdyBpdCdzIGJyb2tlbnxoYXZpbmcgZnVuP3xkb2VzIHRoaXMgbWFrZSB5b3UgaGFwcHk/fG5leHQgc3RvcDogSG9nd2FydHN8T2gsIHNheSEgY2FuIHlvdSBzZWUsIGJ5IHRoZSBkYXduJ3MgZWFybHkgbGlnaHQsIHRoYXQgeW91J3JlIHdhc3RpbmcgeW91ciB0aW1lfHlvdSBnb3R0YSBhc2sgeW91cnNlbGY6ICJkbyBJIGZlZWwgbHVja3k/Inx0aGlzIGlzIGFib3V0IGFzIGV4Y2l0aW5nIGFzIHdhdGNoaW5nIHdvcm1zIHByb2NyZWF0ZXx5b3UgZGlkIGl0ISBvaCBoYWlsIHRoZSBkZXN0cm95ZXIhIGJyaW5nZXIgb2YgYm9yZWRvbXx3b3VsZCB5b3UgbGlrZSBmcmllcyB3aXRoIHRoYXQ/",
        }),
    });
// ----------------------------------------------------------------------------------------------------------------------------




// tool :: vars : less smelly globals .. denies access if not authorized by: function-name AND file-path
// ----------------------------------------------------------------------------------------------------------------------------
    extend(MAIN)
    ({
        vars:function vars(arg,alo)
        {
            let frm,obj; frm=stak(0); if(!frm){wack(); return}; frm=rpart(frm," ")[0];

            if(isText(arg))
            {
                arg=trim(arg); if(span(arg)<1){return};
                obj=this.data.bore(arg); return obj;
            };

            if(!expect.knob(arg,1)){return}; if(isText(alo,1)){alo=[alo]};
            if(!isList(alo)){alo=[]}; if(!isin(alo,frm)){alo.ladd(frm)};

            arg.forEach((v,k)=>
            {
                let lst=this.auth.bore(k);
                if((span(lst)>0)&&!isin(lst,frm)){moan(`only allowed for: `+text(lst)); wack(); return STOP};
                this.auth.bore(k,alo); this.data.bore(k,v);
            });
        }
        .bind({auth:{},data:{}}),
    });
// ----------------------------------------------------------------------------------------------------------------------------




// tool :: file : disk tools
// ----------------------------------------------------------------------------------------------------------------------------
    trap("disk")({get:function(tgt,key,val)
    {
        if(!isFunc(Fsys[key])){return tgt[key];};
        return function()
        {
            let a,k,r,z; a=listOf(arguments); k=this.k; z=last(a);
            if(isPath(a[0])&&a[0].startsWith("~")){a[0]=(Host.homedir()+ltrim(a[0],"~"))};
            if(isPath(a[1])&&a[1].startsWith("~")){a[1]=(Host.homedir()+ltrim(a[1],"~"))};
            // if(isPath(a[0])&&!isKnob(a[1])&&!isFunc(a[1])){let f=a.lpop(); a.ladd({encoding:"utf8"}); a.ladd(f)}; // BAD!
            if(!isFunc(z)){k+="Sync"}; return Fsys[k].apply(Fsys,a);
        }
        .bind({k:rtrim(key,"Sync")});
    }});

    extend(disk)
    ({
        "soft rootPath": (Fsys.rootPath),
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: lookup : get remote host info
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function lookup(addr,port, ipv,tmb,tme,lan,hst,tmp)
    {
        if(!addr){addr=SELF}; if(!expect.text(addr,3)){return}; port=(port||80); ipv=VOID; tmb=time(4); lan=[]; hst={};
        if(addr==SELF){addr=VOID}; // don't look at me in that tone of voice .. this is intentional .. look again .. boom baby!

        if(SERVERSIDE)
        {
            if(Netx.isIPv4(addr)){ipv=4;}else if(Netx.isIPv6(addr)){ipv=6;};
            disk.readFile("/etc/hosts","utf8").trim().split("\n").forEach((l)=>
            {
                l=trim(l); if(!l||l.startsWith("#")){return};
                l=l.split("\t").join(" ").split("    ").join(" ").split("   ").join(" ").split("  ").join(" ").split(" ");
                if(l<2){return}; let a=l.lpop(); hst[a]=l[0];
            });

            (Host.networkInterfaces()).forEach((v,k)=>{v.forEach((o,i)=>
            {
                let a=o.address; tme=round((time(4)-tmb),4);
                lan.radd({from:(hst[a]?"host":k),addr:a,host:(hst[a]||Host.hostname()),time:tme});
            })});

            if(ipv||addr){return enthen(function(cbfn)
            {
                let rsl=lan.select({fetch:"*", where:`addr = ${addr}`});
                if(rsl.length>0){cbfn(rsl); return};

                Dnsx[(ipv?"reverse":"resolve")](addr,(err,lst)=>
                {
                    tme=round((time(4)-tmb),4); let rsl=[];
                    lst.forEach((a)=>{rsl.radd({from:"rdns",addr:(ipv?null:a),host:(ipv?a:null),time:tme})});
                    cbfn((err?null:rsl),(err?err.message:null));
                });
            })};

            return enthen(function(cbfn)
            {
                if(!conf("Host/pingSelf")){cbfn(lan,null); return};
                Http.get({host:conf("Host/discover"), port:port, path:"/"},function pong(rsp)
                {
                    rsp.setEncoding("utf8"); rsp.on("data",function then(adr)
                    {
                        adr=trim(adr); lookup(adr).then(function then(obj)
                        {
                            tme=round((time(4)-tmb),4);
                            obj.forEach((o)=>{lan.radd({from:"rdns",addr:adr,host:o.host,time:tme})});
                            cbfn(lan,null);
                        });
                    });
                })
                .on("error", e => cbfn(null,e.message));
            });
        };
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: mime : return mimeType from file-extention
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function mime(ext,alt)
    {
        let rsl; if(isDurl(ext)){rsl=part(ext,";")[0].split(":").pop(); return rsl};
        if(isPath(ext)){ext=fext(ext)}; if(!isText(ext,1)){return alt};
        rsl = conf(`Host/mimeType/${ext}`);
        return (rsl||alt);
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: qatr : quick-attributes .. CSS-like select to object
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function qatr(arg,tgt)
    {
        if(!isText(arg,2)){return}; if(!isKnob(tgt)){tgt={}}; arg.split(" ").forEach((d)=>
        {
            let c=d.slice(0,1); d=d.slice(1);
            if((c=="#")){tgt.id=d; tgt.name=d}
            else if(c=="."){if(!tgt.class){tgt.class=""}; tgt.class=tgt.class.split(" ").radd(d).join(" ").trim()}
        });

        return tgt;
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: (fsToLh/lhToFs) : one place to configure font-size & line-height ratio
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function fsToLh(n)
    {
        if(isNumr(n)){return ((n/3)*4)};
    });

    hard(function lhToFs(n)
    {
        if(isNumr(n)){return ((n/4)*3)};
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: conf : get & set configuration
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function conf(arg)
    {
        if(isText(arg,1))
        {
            arg=trim(arg,"/"); arg=ltrim(arg,"config/"); arg=("config/"+(arg||":none:"));
            return vars(arg)
        };

        if(isKnob(arg))
        {
            arg=arg.padd("config/");
            return vars(arg);
        };
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: load : load & run JS-files .. parse any other file
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function load()
    {
        var arg,cbf,rsl,dne,thn; arg=args(arguments); cbf=rpop(arg);
        if(!isFunc(cbf)){arg.radd(cbf); cbf=VOID}; // no callback as last arg .. add it back
        rsl=[]; dne=[0,span(arg)];

        thn=function then()
        {
            return this.then.apply(null,args(arguments));
        }.join({then:function then(tfa)
        {
            if(isFunc(tfa)){this.done=tfa; return};
            if(isFunc(this.done)){this.done.apply(this.done,args(arguments))};
        }.join({done:cbf})});

        arg.forEach((pth)=>
        {
            let fun,ext; ext=fext(pathOf(pth));
            fun=function(wut){dne[0]++; rsl.radd(wut||this); if(dne[0]==dne[1]){tick.after(0,()=>{thn.apply(thn,rsl)})}};

            if(SERVERSIDE)
            {
                if(ext=="js"){fun(require(pth)); return};
                if(ext=="json"){fun(decode.jso(disk.readFile(pth))); return};
                fun(disk.readFile(pth)); return;
            };

            if(!render.handle[ext]){fail(`missing handler for "${ext}"`); return STOP};
            let dja=select(`[src="${pth}"]`); if(dja){fun(dja[0]); return};
            render.handle[ext](pth,(rsl)=>
            {
                if(isin("js,css",ext)){HEAD.insert(rsl);};
                fun(rsl);
            });
        });

        return thn;
    });
// ----------------------------------------------------------------------------------------------------------------------------



// func :: exists : check if path or dom-node exists .. if so: the arg is returned; else an empty string is returned
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function exists(arg)
    {
        if(isText(arg)&&arg.startsWith("~/"))
        {
            let usr = Host.userInfo().username;
            arg = ("/home/"+usr+arg.slice(1));
        };

        if(SERVERSIDE&&isPath(arg)){return (disk.exists(arg)?arg:"")};
        try{if(!!select(arg)){return arg}}catch(err){return ""};
    });
// ----------------------------------------------------------------------------------------------------------------------------




// func :: create : path or DOM-node/tree
// ----------------------------------------------------------------------------------------------------------------------------
    hard(function create(arg,fnc)
    {
        if(isPath(arg))
        {
            if(arg.endsWith("/")){return disk.mkdir(arg,fnc)};
            return disk.writeFile(arg,fnc);
        };

        let obj=arg; if(isWord(obj)){return document.createElement(obj)}; // done .. only text given as tag-name
        if(!expect.knob(obj,1)){return}; // validation
        let tmp,tag,def,ext,kds,rsl,chr; tmp=keys(obj); tag=tmp[0]; def=obj[tag]; delete obj[tag]; // tag-name
        chr=(!isText(def,2)?"":def.slice(0,1));
        if(!chr||(chr&&(!isin("#.",chr)||!test(def.slice(1,2),/[a-zA-Z]/)))){kds=def; def=VOID}; // quick-atr, or children
        ext=isin(tmp,["$","children","contents"]); if(ext){kds=obj[ext]; delete obj[ext]}; // contents
        rsl=document.createElement(tag); if(!def&&!kds&&(span(obj)<1)){return rsl}; // done .. no attributes nor contents
        obj=qatr(def,obj); rsl.modify(obj); if(kds){rsl.insert(kds)};
        return rsl;
    });
// ----------------------------------------------------------------------------------------------------------------------------


// ----------------------------------------------------------------------------------------------------------------------------
    hard(function select(def)
    {
        return document.documentElement.select(def);
    });
// ----------------------------------------------------------------------------------------------------------------------------


// ----------------------------------------------------------------------------------------------------------------------------
    hard(function remove()
    {
        return document.documentElement.remove.apply(document.documentElement,args(arguments));
    });
// ----------------------------------------------------------------------------------------------------------------------------
