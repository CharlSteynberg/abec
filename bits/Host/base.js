



// defn :: (tools) : server-side .. to run bash code: exec(`echo "flerb"`).then((out)=>{dump(out)}); // flerb
// ----------------------------------------------------------------------------------------------------------------------------
    if(SERVERSIDE)
    {
        hard("Host",require("os"));

        extend(Host)({mule:require("child_process")});

        extend(MAIN)
        ({
            exec:function exec(cmd,shh)
            {
                return enthen((fnc)=>{Host.mule(cmd,(hlt,rsl,err)=>
                {
                    if(hlt){if(!shh){fail(hlt)}; return};
                    if(!isText(rsl)){rsl=""}; if(!isText(err)){err=""};
                    rsl=(err+"\n\n"+rsl).trim(); fnc(rsl);
                })});
            },
        });
    };
// ----------------------------------------------------------------------------------------------------------------------------





// shim :: performance.now : for server side
// ----------------------------------------------------------------------------------------------------------------------------
    if(SERVERSIDE)
    {
        extend(MAIN)({performance:{now: function now(bgn)
        {
            if (!bgn){return process.hrtime()};
            var end = process.hrtime(bgn);
            return Math.round((end[0]*1000) + (end[1]/1000000));
        }}});
    };
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: (libs) : misc tools
// ----------------------------------------------------------------------------------------------------------------------------
    if(SERVERSIDE)
    {
        extend(Fsys).with
        ({
            "soft rootPath": process.cwd(),


            dirIndex: function dirIndex(pth,cbf)
            {
                if(!expect.path(pth)){return}; let x;

                if(!isFunc(cbf))
                {
                    try{x = Fsys.readdirSync(pth)}catch(e){return}; if(!x){return};
                    x=isin(x,DIRINDEX); return x;
                };

                Fsys.readdir(pth,(err,lst)=>
                {
                    cbf(isList(lst)?isin(DIRINDEX,lst):err);
                });
            },
            dirIndexSync: function dirIndexSync(pth){return Fsys.dirIndex(pth)},


            scandir: function scandir(pth,cbf)
            {
                if(!expect.path(pth)){return}; pth=rtrim(pth,"/"); let l,r; r={};

                if(!isFunc(cbf))
                {
                    try{l = Fsys.readdirSync(pth)}catch(e){return};
                    l.forEach((i)=>{let p=(pth+"/"+i); r[i]=(isFold(p)?[]:"")});
                    return r;
                };

                Fsys.readdir(pth,(err,lst)=>
                {
                    cbf(lst||err);
                });
            },
            scandirSync: function scandirSync(pth){return Fsys.scandir(pth)},


            descry: function descry(pth,cbf, inf,tpe,spn,rsl)
            {
                if(isList(pth)){rsl=[]; pth.forEach((i)=>{rsl.radd(Fsys.descry(i))}); if(!isFunc(cbf)){return rsl}; cbf(rsl); return};
                if(!expect.path(pth)){dump("Sh!!!!!!!!!!ttt",pth); return}; inf=VOID; try{inf=disk.stat(pth);}catch(err){if(err){fail(err);return}};
                if(!inf||!inf.isFile){fail(`invalid stat-object`); return};
                tpe=(inf.isSymbolicLink()?"link":(inf.isDirectory()?"fold":(inf.isFile()?"file":(inf.isSocket()?"sock":inf.isFIFO()?"fifo":VOID))));
                if(tpe=="fold"){spn=keys(Fsys.scandir(pth)).length;};
                rsl={path:pth,type:tpe,size:((tpe=="file")?(round(((inf.size/1000)/1000),3)+" MiB"):((tpe=="fold")?(spn+" Itm"):"- Lnk"))};
                rsl.mime=((tpe=="file")?mime(pth):mime(tpe));
                if(!isFunc(cbf)){return rsl}; cbf(rsl);
            },
            descrySync: function descrySync(pth){return Fsys.descry(pth)},
        });


        hard(function btoa(arg)
        {return Buffer.from(arg).toString("base64");});

        hard(function atob(arg)
        {return Buffer.from(arg,"base64").toString();});
    }
// ----------------------------------------------------------------------------------------------------------------------------




// tool :: server : for server and client
// ----------------------------------------------------------------------------------------------------------------------------
    extend(MAIN)
    ({
        server:
        {
            config:
            {
            },


            recent:{},


            agnize:function agnize(q)
            {
                if(!isKnob(q)){return}; let y,a,u,i,k,h,b,r,z,t; a=q.clientAddress; b=conf("Host/botMatch");
                y=(q.headers||{}); r=y["referer"]; u=y["user-agent"]; i=y["interface"]; k=y["apikey"]; r=part(r,"://");
                r=(r?r[2].split(":")[0]:""); t=server.recent.info.select({apply:function(o){return o.addr}});
                z=(i||(k?"API":(isin(u,b)?"BOT": (r.startsWith(HOSTNAME)?"DPR":"GUI"))));
                return z;
            },


            create:function create(path,addr,indx,dbug)
            {
                runsAt(SERVER); let prt,inf,erg,pts,alt,arg,nme,msg,cfg; prt=conf("Host/openPort"); cfg=conf("Host");
                if(isInum(path)){prt=path; path=VOID};  if(!path){path=""};
                if(isText(addr)){addr=lowerCase(addr); pts=part(addr,":"); if(pts){addr=pts[0]; prt=(pts[2]*1)}}
                else if(isInum(addr)){prt=addr; addr=VOID}; arg=[prt]; alt="0.0.0.0"; if(addr&&(addr!=alt)){arg.radd(addr)};
                if(!cfg.authKeys[HOSTADDR]){cfg.authKeys[HOSTADDR]=hash(VOID,"sha1"); conf({Host:cfg});};
                server.recent.apikey=cfg.authKeys[HOSTADDR];

                let host = Http.createServer(function relay(req,rsp)
                {
                    extend(req)({getCookie:function getCookie(n)
                    {
                        let r={}; (this.headers.cookie||"").split(';').forEach(function(p)
                        {p=p.match(/(.*?)=(.*)$/); r[(p[1].trim())]=(p[2]||"").trim()});
                        return ((n&&(n!=="*"))?r[n]:r);
                    }});

                    extend(rsp)({setCookie:function setCookie(o,v)
                    {
                        if(isText(o)&&(v!=VOID)){o={name:o,value:v}}; if(!o.path){o.path="/"};
                        let t = (`${o.name||""}=${o.value||""}`)+(o.expires!=null?`; Expires=${o.expires.toUTCString()}`:"")
                        + (o.maxAge!=null?`; Max-Age=${o.maxAge}`:"") + (o.domain!=null?`; Domain=${o.domain}`:"")
                        + (o.path!=null?`; Path=${o.path}`:"") + (o.secure?'; Secure':"") + (o.httpOnly?'; HttpOnly':"")
                        + (o.sameSite!=null?`; SameSite=${o.sameSite}`:"");
                        this.setHeader("Set-Cookie",t); return true;
                    }});

                    server.handle.apply(server,[req,rsp,{addr:addr,port:prt,path:path,indx:indx,dbug:dbug,host:this}]);
                });

                host.listen.apply(host,arg); herald(host); nme=(addr||HOSTNAME);
                if(cfg.eventLog)
                {
                    msg=`\nhttp server running .. http://${nme}:${prt}\n`;
                    if(!addr){msg+=`server info:`}; dump(msg); dump(server.recent.info,"\n");
                };
                return host;
            },


            handle:function handle(req,rsp,srv)
            {
                let cfg = conf("Host");

                let rp,np,fd,tv,dr,hl; rp=process.cwd(); np=(rtrim(req.url.split("?")[0].split("&")[0],"/")||"/");
                if(isin(np,"%")){np=decode.url(np)}; tv=cfg.reRoutes[np];
                let fx,mt,cp; if(isPath(tv)){np=tv}; if(np=="/"){np=(srv.indx||(np+(disk.dirIndex(srv.path||process.cwd())||"")))};
                let ag,bu,ex,ap; hl=req.headers; bu=isin(hl.referer,HOSTNAME); cp=srv.path; tv=VOID; if(np.startsWith("/")){np=("."+np)};
                let cs,rm,qs; cs=(req.connection||req.socket); if(cs.socket){cs=cs.socket}; rm=req.method; qs=(req.url.split("?")[1]||"");
                req.clientAdrress=((hl["user-agent"]["x-forwarded-for"]||"").split(",").pop().trim()||cs.remoteAddress||"");

                if(!np.startsWith("..")){ex=disk.exists(`..${np}`); np=(ex?`..${np}`:(srv.path+np))};
                if(!ex&&!disk.exists(np)){tv=404}; fx=fext(np); mt=mime(np); dr=0; if(qs){qs=("&"+qs)};
                if(!tv){ap=(isin(cp,"../")?Path.resolve((rpart(cp,"../")[0]||"../")):(cp||rp))};
                if(ap&&!Path.resolve(np).startsWith(ap)){tv=403}; ag=server.agnize(req);
                if(isFold(np)){dr=1; tv=(srv.indx||disk.dirIndex(np)); if(tv){np+=((np.endsWith("/")?"":"/")+tv); dr=0}; tv=VOID};
                if(dr&&!cfg.readDirs){tv=403}; // forbidden
                if(cfg.eventLog){dump(ag,req.method,np,(tv||200))};

                if(qs.startsWith("&ABEC")||(!tv&&(ag=="DPR")&&(rm=="GET")&&((__filename)===Path.resolve(np)))) // for self by self
                {
                    rsp.statusCode=200; rsp.setCookie("apikey",server.recent.apikey); // set APIKEY
                    rsp.setHeader("Content-type",mime("js")); rsp.end(disk.readFile(__filename)); return;
                };

                srv.host.signal(rm,{rqst:req,resp:rsp,info:{path:np,stat:(tv||200),face:ag},host:srv.host});
                if(isin(keys(srv.host._events).concat(keys(srv.host.upon.events)).xpop("name"),rm)){return}; // handled

                if(isInum(tv,3)&&(tv!=200)){rsp.writeHead(tv); rsp.end(); return};

                if(rm=="GET")
                {
                    if(!dr)
                    {
                        fd = Fsys.createReadStream(np); rsp.statusCode=200; rsp.setHeader("Content-type",(mt||"text/plain"));
                        fd.pipe(rsp); return;
                    };

                    dr=disk.descry(disk.readdir(np).padd(np)); dr=encode.jso(dr);
                    rsp.statusCode=200;

                    if(ag=="GUI")
                    {
                        if(!np.endsWith("/")){np+="/"}; dr=encode.b64(dr);
                        tv=dedurl(conf("View/autoHTML")).swap(`(~tabTitle~)`,np);
                        tv=tv.swap(`// (~autoExec~)`,`let b64='${dr}';\nconf("View/autoExec/showFold")("${np}",b64);`);
                        rsp.setHeader("Content-type","text/html"); rsp.end(tv); return;
                    };

                    rsp.setHeader("Content-type","application/json");
                    rsp.end(text(dr)); return;
                };

                rsp.writeHead(501); rsp.end();
            },


            select:function select(opt,cbf)
            {
                if(isPath(opt)){opt={using:opt}}; if(!isKnob(opt)){moan("1st arg is invalid"); return};
                if(isFunc(cbf)){opt.yield=cbf}; if(!isFunc(opt.yield)){moan("invalid options/arguments"); return};
                disk.readFile(opt.using,function(rsp,hdr)
                {
                    if(isFunc(opt.apply)){rsp=opt.apply(rsp,hdr);};
                    opt.yield(rsp,hdr);
                });
            },
        }
    });
// ----------------------------------------------------------------------------------------------------------------------------




// evnt :: (server) : get internet & local ip address before we start
// ----------------------------------------------------------------------------------------------------------------------------
    if(SERVERSIDE)
    {
        herald(MAIN); // ?!
        emit("almostReady").then(function almostReady()
        {
            vars({config:copyOf(config)}); // waited for other code to change the config before all is ready
            if(conf("Host/eventLog")){dump("\nABEC warming up...")};

            lookup().then(function prep(inf,err)
            {
                if(err){fail(`lookup :: ${err}`); return};
                server.recent.info=copyOf(inf); let whr=(conf("Host/pingSelf")?"from = rdns":"host != localhost");
                inf=inf.select({fetch:"*",where:whr}); if(span(inf)<1)
                {inf=server.recent.info.select({fetch:"*",where:"host = localhost"})}; inf=inf[0];
                defn({HOSTADDR:inf.addr, HOSTNAME:inf.host, HOSTPURL:`http://${inf.host}`});
                after(10)(function allReady()
                {
                    if(conf("Host/eventLog")){dump("all ready\n")};
                    emit("allReady",inf);
                });
            });
        });

        module.exports = server;
    };
// ----------------------------------------------------------------------------------------------------------------------------
