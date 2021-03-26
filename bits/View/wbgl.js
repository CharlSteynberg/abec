



// tool :: renderer : 3d helper tool
// ----------------------------------------------------------------------------------------------------------------------------
    class renderer
    {
        constructor(tgt)
        {
            if(!runsAt(CLIENT)){return};
            let tmp; this.assign({loaded:{OBJLoader:THREE.OBJLoader},halted:TRUE,driver:{},recent:{}});

            if(isKnob(tgt)&&!isNode(tgt)){tgt=create("div").modify(tgt)}
            else if(isText(tgt))
            {
                tgt=trim(tgt); if(!expect.text(tgt,1)){return}; try{tmp=select(tgt);}catch(e){};
                if(isNode(tmp)){tgt=tmp}else if(isList(tmp,1)){tgt=tmp[0]}
                else if(isWord(tgt)){tgt=create(tgt)}else{tgt=create({div:tgt})};
            };

            if(!expect.node(tgt)){return}; this.holder=tgt; herald(this); // must be DOM node

            when(()=>{return ((this.holder.select("^")&&!this.recent.busy)?this.holder:VOID)}).
            then((nde)=>
            {
                let box=rect(nde.parentNode); let opt; // options may be optional later
                let req={angle:45,ratio:(box.width/box.height),place:15000,speed:1};
                if(!isKnob(opt)){opt=req}else{opt.assign(req)};

                this.driver.scene = new THREE.Scene();
                this.driver.webgl = new THREE.WebGLRenderer();
                this.driver.camra = new THREE.PerspectiveCamera(opt.angle,opt.ratio,1,opt.place);
                this.driver.rayca = new THREE.Raycaster();
                this.driver.mouse = new THREE.Vector2();
                this.driver.cntrl = new THREE.OrbitControls(this.driver.camra,this.driver.webgl.domElement);

                this.driver.cntrl.zoomSpeed = opt.speed;
                this.driver.cntrl.target = (new THREE.Vector3(0,0,0));
                this.driver.camra.position.z = 1500;
                this.driver.webgl.setPixelRatio(window.devicePixelRatio);
                this.driver.webgl.setSize(box.width, box.height);

                nde.appendChild(this.driver.webgl.domElement);


                this.driver.cntrl.addEventListener("change",(e)=>
                {
                    if(!this.isLive()){return}; // nothing to do .. prevents errors
                    if(this.recent.ctrl){this.recent.ctrl=0; return}; // this was us .. below

                    let num,bfr,pos,rot,dir; num=(this.recent.numr||0); num++; bfr=(this.recent.bufr||[]);

                    pos=round(vals(e.target.object.position).lpop(!0),12);
                    rot=round(vals(e.target.object.rotation).lpop(!0).rpop(!0).rpop(!0),12);
                    bfr.radd({pos:pos,rot:rot}); if(bfr.length>3){bfr.lpop()}; this.recent.bufr=bfr;

                    if(bfr.length<3){this.render(1); return}; // wait for 3 objects
                    if(bfr.select({fetch:"rot",where:UNIQUE}).length == 1)
                    {
                        if((bfr[0].pos[2]<bfr[1].pos[2])&&(bfr[1].pos[2]<bfr[2].pos[2])){dir="Bck"}
                        else if((bfr[0].pos[2]>bfr[1].pos[2])&&(bfr[1].pos[2]>bfr[2].pos[2])){dir="Fwd"};
                        if(dir){this.emit("CameraDolly",{direct:dir,buffer:bfr});};
                    }
                    else if(!dir)
                    {this.emit("CameraRotate",{buffer:bfr});};

                    this.render(EXCEPT);
                });


                // this.upon("CameraDolly",(e)=>
                // {
                //     let dir,bfr,dif,rot; dir=e.detail.direct; bfr=e.detail.buffer; dif=500;
                //     if((dir=="Fwd")&&((bfr[0].pos[2]-bfr[2].pos[2]) > dif)){return};
                //     if((dir=="Bck")&&((bfr[2].pos[2]-bfr[0].pos[2]) > dif)){return}; rot=this.driver.camra.rotation;
                //     this.driver.cntrl.target=(new THREE.Vector3(bfr[0].pos[0], bfr[0].pos[1], (bfr[0].pos[2]-dif)));
                //     this.driver.cntrl.update();
                //     this.driver.camra.setRotationFromEuler(rot);
                // });


                upon("ResizeEnd",()=>{this.resync()});

                this.halted=FALS; this.resync(); this.render();
                this.holder.renderer=this;
                this.emit("ready");
            });

            after(3000)(()=>{if(!this.isLive()){moan("the holder is expected inside the DOM by now")}});
            return this;
        }


        deploy(tgt)
        {
            if(!expect.node(tgt)){return};
            if(!tgt.select("^")){fail("deploy target must exist inside the DOM"); return};
            tgt.appendChild(this.holder);
            return this;
        }


        obtain(obj,dmp)
        {
            if(isPath(obj)){obj={[(leaf(obj).split(".")[0])]:obj}};
            if(!expect.knob(obj,1)){return}; this.recent.busy=1;
            var d,m; d=[0,span(obj)]; m={}; obj.forEach((v,k)=>
            {
                if(!expect.path(v)){return}; let mod,ext; mod=leaf(v).split(".")[0]; ext=fext(v);
                if(isin(this.loaded,mod)){d[0]++; return NEXT};

                if(isin("jpg,jpeg,png,gif,webp,svg,bmp",ext))
                {
                    this.loaded[k]=new THREE.TextureLoader().load(v,()=>{d[0]++});
                    return NEXT;
                };

                if(isin("js,jsm",ext))
                {
                    disk.readFile(v,(txt,hdr,obj)=>
                    {
                        let frg; frg=`var ${mod} = (`; mod=leaf(obj.path).split(".")[0];
                        let vrs,arg; vrs = expose(txt,"import {","} from "); txt=trim(txt);
                        if(!isin(txt,frg)){moan(`expecting \`${frg}\``); d[1]--; return};
                        if(!vrs){moan(`expecting import vars`); d[1]--; return};

                        arg=swap(vrs[0].trim(),["\n","\t"," "],"").split(",");
                        vrs=arg.modify((i)=>{return (i+" = THREE."+i)});
                        arg=arg.join(","); vrs=(vrs.join(";\n")+";\n");
                        txt=txt.split(frg).pop(); txt=txt.split("\n").rpop(TRUE).join("\n");
                        txt=(`!(function(${arg})\n{\n${vrs}\n${frg+txt}\n\nTHREE.${mod}=${mod}; return ${mod};\n}());`);

                        if(dmp==DUMP){dump(btoa(txt))}; HEAD.insert({script:`#THREE_${mod}`,$:txt});
                        this.loaded[mod]=THREE[mod]; m[mod]=THREE[mod]; d[0]++;
                    });
                    return NEXT;
                };

                if(isin("obj",ext))
                {
                    // let man = new THREE.LoadingManager();
                    let ldr = new this.loaded.OBJLoader(); ldr.load(v,(o)=>
                    {
                        (function(s){s.loaded[this.mod]=o; m[this.mod]=o; d[0]++;}.bind({mod:mod})).apply(null,[this]);
                    });
                };
            });

            when(()=>{return (d[0]>=d[1])}).then(()=>{this.recent.busy=0; this.emit("loaded",this.loaded)});

            enthen(this,function(cbf){when(()=>{return (d[0]>=d[1])}).then(()=>
            {this.recent.busy=0; cbf.apply(this,[((span(m)<2)?vals(m)[0]:m)])})});
            // this.then.done=m;
            return this;
        }


        vivify()
        {
            this.halted=FALS; if(!this.isLive()){moan(`the holder is expected inside the DOM`); this.halted=TRUE; return};
            this.resync(); return this;
        }


        pacify()
        {
            this.halted=TRUE;
            return this;
        }


        isLive()
        {
            return (MAIN.HALT||this.halted||(!isNode(this.holder)||!this.holder.select("^"))?FALS:TRUE);
        }


        resync()
        {
            if(!this.isLive()){return}; let box=rect(this.holder.parentNode);
            this.driver.camra.aspect = (box.width/box.height);
            this.driver.camra.updateProjectionMatrix(); this.driver.webgl.setSize(box.width,box.height);
            this.render(); this.emit("resync"); return this;
        }


        render(ctrl)
        {
            if(!this.isLive()){return};
            this.driver.mouse.x = ((device.vars.axis.x/window.innerWidth) * 2 - 1);
            this.driver.mouse.y = ((device.vars.axis.y/window.innerHeight) * 2 + 1);

            this.driver.rayca.setFromCamera(this.driver.mouse,this.driver.camra);
            if(ctrl!==EXCEPT){this.driver.cntrl.update()}; this.emit("beforeRender");
            this.driver.webgl.render(this.driver.scene,this.driver.camra);
        }


        create(arg)
        {
            if(!expect.knob(arg,1)){return}; let nme,fnc,qck,kds,atr; nme=keys(arg)[0]; fnc=this.skills[nme];
            if(!isFunc(fnc)){moan(`no skill available to create "${nme}"`); return this}; qck=arg[nme]; delete arg[nme];
            kds=(arg.$||arg.children||arg.contents); delete arg.$; delete arg.children; delete arg.contents;
            if(!isList(kds)){kds=[]};
            return fnc.apply(this,[qatr(qck),arg,kds]); // extended skills
        }


        select(arg)
        {
            if(isText(arg,2)&&arg.startsWith("#"))
            {
                return this.driver.scene.getObjectByName(arg.slice(1));
            };
        }


        insert(arg)
        {
            if(isPath(arg))
            {
                this.obtain(arg).then((m)=>{this.driver.scene.add(m)});
                return this;
            };

            return this;
        }


        remove(arg,vac)
        {
            let tgt=this.select(arg); if(!tgt){return this}; if(!isList(tgt)){tgt=[tgt]};
            tgt.forEach((i)=>{if(vac){i.material.dispose(); i.geometry.dispose()}; i.remove()});
            this.render();
            return this;
        }
    }
// ----------------------------------------------------------------------------------------------------------------------------




// xtnd :: (renderer.create) : dots
// ----------------------------------------------------------------------------------------------------------------------------
    extend(renderer.prototype).with
    ({
        skills:
        {
            dots:function dots(atr,opt,kds)
            {
                let rsl = //object
                {
                    source: this,
                    points: [],
                    recent: {busy:null,done:{}},
                    insert: function insert(itm)
                    {
                        cancel(this.recent.busy); let win,len,hsh,vrt,far,lst;
                        hsh=hash(itm); if(this.recent.done[hsh]){return};
                        this.recent.done[hsh]=itm; this.points.radd(itm); this.recent.busy=tick.after(50,()=>
                        {
                            win=[window.innerWidth,window.innerHeight]; this.points=this.points.select({order:"xyz.2:DSC"});
                            lst=this.points; len=lst.length; far=lst.item(-1).xyz[2];

                            if(!this.geomet)
                            {
                                opt = ({size:35,sizeAttenuation:true,alphaTest:0.4,transparent:true}).assign(opt); let a,x,y,z;
                                this.geomet=(new THREE.BufferGeometry()); this.materi=(new THREE.PointsMaterial(opt)); vrt=[];

                                lst.forEach((obj)=>
                                {
                                    a=obj.xyz; x=a[0]; y=a[1]; z=((a[2]-far)/(1-far)); x-=0.5; y-=0.5; z-=0.5;
                                    x*=win[0]; y*=win[1]; z*=len; vrt.push(x,y,z);
                                });

                                this.geomet.setAttribute("position",(new THREE.Float32BufferAttribute(vrt,3)));
                                this.partic = (new THREE.Points(this.geomet,this.materi));
                                this.recent = {over:VOID};
                                this.source.driver.scene.add(this.partic);
                                this.source.driver.scene.fog = (new THREE.FogExp2(0x000000,0.001));


                                this.source.listen("beforeRender",()=>
                                {
                                    let hvr,idx; hvr=this.source.driver.rayca.intersectObject(this.partic);

                                    if(hvr.length<1)
                                    {
                                        if(this.recent.over!==VOID)
                                        {this.source.signal("mouseout",this); this.recent.over=VOID};
                                        return;
                                    };

                                    idx=hvr[0].index; this.recent.over=idx;
                                    this.source.signal("mouseover",this);
                                });


                            };

                            this.source.render();
                        })
                    },
                    remove: function remove(itm)
                    {

                    },
                };

                return rsl;
            },
        }
    })
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: (Element.prototype.init3D) : 3d helper tool to bind it to an HTML node
// ----------------------------------------------------------------------------------------------------------------------------
    if(CLIENTSIDE)
    {
        extend(Element.prototype)
        ({
            init3D:function init3D(arg)
            {
                return (new renderer(arg)).deploy(this);
            }
        });
    };
// ----------------------------------------------------------------------------------------------------------------------------
