



// evnt :: device : events
// ----------------------------------------------------------------------------------------------------------------------------
    if(CLIENTSIDE)
    {
        extend(MAIN)
        ({
            device:
            {
                vars:
                {
                    axis:{x:0,y:0}, btns:{}, busy:{}, last:{},
                },
                keyCombo:"",
                getCombo:function getCombo(how, ae)
                {
                    this.keyCombo=keys(this.vars.btns).join(" ").trim();
                    if((how!=SILENT)&&isin(this.keyCombo," "))
                    {
                        emit("KeyCombo",this.keyCombo); emit(this.keyCombo);
                        ae=vars("View/lastFobj"); if(!!ae){ae.emit(this.keyCombo)};
                    };
                    return this.keyCombo;
                },
            },
        });

        MAIN.upon("mousemove",function(e)
        {
            let na,oa,en,be,ae; be="MouseMove"; oa=device.vars.axis; na={x:e.clientX,y:e.clientY};
            ae=vars("View/lastFobj"); emit((be+"Any"),na); if(!!ae){ae.emit((be+"Any"),na)};
            en=((na.x>oa.x)?"Rigt":((na.x<oa.x)?"Left":((na.y>oa.y)?"Down":((na.y<oa.y)?"Up":""))));
            if(!en){return}; en=(be+en); device.vars.axis=na; emit(en,na); if(!!ae){ae.emit(en,na)};
            device.vars.last="mouse"; if(device.vars.busy.mouse)
            {clearTimeout(device.vars.busy.mouse)}else{emit((be+"Begin"),na); if(!!ae){ae.emit((be+"Begin"),na)};};
            device.vars.busy.mouse=tick.after(300,()=>
            {
                delete device.vars.busy.mouse; delete device.vars.btns[en];
                emit((be+"End"),na); if(!!ae){ae.emit((be+"End"),na)};
            });
        });

        MAIN.upon("wheel",function(me)
        {
            let x=(Math.round(me.deltaX)||0); let y=(Math.round(me.deltaY)||0); let ae,ew,sw,sl,bx,xr,xd,xp,a;
            let d; if(!x){x=0;}; if(!y){y=0;}; if(me.deltaMode==1){x*=12; y*=12}; let eh,sh,st,el,yr,yd,yp,p;
            el=me.target; bx=rect(el); ew=bx.width; eh=bx.height; sw=el.scrollWidth; sh=el.scrollHeight;
            d=((sw>ew)?((x>0)?R:((x<0)?L:M)):((sh>eh)?((y>0)?D:((y<0)?U:M)):M)); let z;
            a=((d==M)?M:(((d==L)||(d==R))?X:Y)); sl=el.scrollLeft; st=el.scrollTop;
            p=round(((a==X)?((sl+ew)/sw):((st+eh)/sh)),1); ae=vars("View/lastFobj");
            z=round((a==M)?0:((a==X)?(sw-(sl+ew)):(sh-(st+eh)))); let crd=[x,y,d,a,p,z];

            emit("MouseWheel",crd); if(!!ae){ae.emit("MouseWheel",crd)};
            if(device.vars.busy.wheel){clearTimeout(device.vars.busy.wheel);}
            else{emit("WheelBegin",crd); if(!!ae){ae.emit("WheelBegin",crd)};};
            device.vars.busy.wheel=tick.after(300,()=>
            {delete device.vars.busy.wheel; emit("WheelEnd",crd); if(!!ae){ae.emit("WheelEnd",crd)};});
        });

        MAIN.upon("mousedown",function(e)
        {
            let cb,en,ae; cb=((e.which<2)?"Left":((e.which==2)?"Middle":"Right")); device.vars.last="mouse";
            en=(cb+"Click"); device.vars.btns[en]=1; device.getCombo(); emit(en);
            ae=vars("View/lastFobj"); if(!!ae){ae.emit(en,cb)};
            let tap=(device.vars.taps||0); tap++;
            if((cb!="Left")||(tap<2)){emit(en); return}; device.vars.taps=tap;
            if(device.vars.busy.tap){clearTimeout(device.vars.busy.tap)};
            device.vars.busy.tap=tick.after(120,()=>
            {delete device.vars.busy.tap; delete device.vars.taps; emit("tap"+tap);});

        });

        MAIN.upon("mouseup",function(e)
        {
            let cb,en,ae; cb=((e.which<2)?"Left":((e.which==2)?"Middle":"Right")); device.vars.last="mouse";
            en=("MouseUp"+cb); delete device.vars.btns[(cb+"Click")]; device.getCombo(SILENT); emit(en);
            ae=vars("View/lastFobj"); if(!!ae){ae.emit(en,cb)};
        });

        MAIN.upon("keydown",function(e)
        {
            let cb,ae; cb=e.key; if(e.keyCode==91){cb="Meta";}else if(cb==" "){cb="Space"}; device.vars.last="keyboard";
            device.vars.btns[cb]=1; device.getCombo(); emit("KeyDown",cb); emit(("Key"+cb));
            ae=vars("View/lastFobj"); if(!!ae){ae.emit("KeyDown",cb); ae.emit(("Key"+cb))};
        });

        MAIN.upon("keyup",function(e)
        {
            let cb,ae; cb=e.key; if(e.keyCode==91){cb="Meta";}else if(cb==" "){cb="Space"}; device.vars.last="keyboard";
            delete device.vars.btns[cb]; device.getCombo(); emit("KeyUp",cb);
            ae=vars("View/lastFobj"); if(!!ae){ae.emit("KeyUp",cb)};
        });

        MAIN.upon("keypress",function(e)
        {
            let cb,ae; cb=e.key; ae=vars("View/lastFobj");
            if(e.keyCode==91){cb="Meta";}else if(cb==" "){cb="Space"}; emit("KeyPress",cb); if(!!ae){ae.emit("KeyPress",cb)};
            device.vars.last="keyboard"; if(e.repeat){emit("KeyRepeat",cb); if(!!ae){ae.emit("KeyRepeat",cb)};};
            if(device.vars.busy.keyboard){clearTimeout(device.vars.busy.keyboard)}
            else{emit("TypingBegin",cb); if(!!ae){ae.emit("TypingBegin",cb)};};
            device.vars.busy.keyboard=tick.after(300,()=>
            {delete device.vars.busy.keyboard; emit("TypingEnd",cb); if(!!ae){ae.emit("TypingEnd",cb)};});
        });

        MAIN.upon("contextmenu",function(e)
        {
            if(device.vars.last=="mouse"){e.preventDefault(); return false;};
        });

        MAIN.upon("resize",function(e)
        {
            if(device.vars.busy.resize){clearTimeout(device.vars.busy.resize)}else{emit("ResizeBegin")};
            device.vars.busy.resize=tick.after(300,()=>{delete device.vars.busy.resize; emit("ResizeEnd")});
        });

        MAIN.upon("blur",function(e)
        {
            device.vars.btns={};
        });
    };
// ----------------------------------------------------------------------------------------------------------------------------







// evnt :: device : events
// ----------------------------------------------------------------------------------------------------------------------------
    if(CLIENTSIDE)
    {
        upon("load",function prep()
        {
            if(seen("HEAD")){return}; // window.onload was triggered before
            defn({HEAD:document.head, BODY:document.body}); // global shorthands

            defn({HOSTNAME:(function()
            {
                if(ENVITYPE=="web"){return location.hostname};
                return ":webext:";
            }())});

            defn({HOSTPURL:(function()
            {
                if(ENVITYPE=="web"){return (PROTOCOL+"://"+HOSTNAME)};
                return "webext";
            }())});

            emit("almostReady").then(()=>
            {
                tick.after(10,function prep()
                {
                    vars({config:copyOf(config)});
                    tick.every(conf("View/guiClock"),function domClock(oref,crnt,prev,fobj)
                    {
                        oref = "View/lastFobj";
                        crnt = document.activeElement;
                        prev = vars(oref); signal("tick");
                        fobj = {type:"gain",crnt:crnt,prev:prev};

                        if(!!crnt && !crnt.uuid){extend(crnt)({uuid:hash(md5)})}; vars({[oref]:crnt}); // needed for below
                        if((!crnt && !prev) || ((!!crnt&&!!prev)&&(crnt.uuid==prev.uuid))){return}; // no change
                        if((!crnt && !!prev)){fobj.type="lost"}else if(!!crnt && !!prev){fobj.type="swap"}; // set type

                        signal("focuschange",fobj);
                    });

                    BODY.enclan(conf("View/cssTheme"));
                    emit("configReady").then(()=>
                    {
                        loadFont(conf("View/iconFont"),"icon",{},()=>
                        {
                            emit("allReady");
                        });
                    });
                });
            });
        });
    };
// ----------------------------------------------------------------------------------------------------------------------------
