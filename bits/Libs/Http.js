



// tool :: Http : for client and server
// ----------------------------------------------------------------------------------------------------------------------------
    if(SERVERSIDE){hard("Http",require("http"))};

    if(CLIENTSIDE)
    {
        bake("Http",
        {
            request:function request(opt,cbf, xhr)
            {
                if(isText(opt)){opt={target:opt};}; if(!isKnob(opt)){moan("invalid 1st argument"); return};
                if(!isKnob(opt.listen)){opt.listen={}}; if(isFunc(cbf)){opt.listen.loadend=cbf};
                xhr=(new XMLHttpRequest()); xhr.open((opt.method||"GET"),opt.target);
                opt.listen.forEach((v,k)=>{xhr.addEventListener(k,v)}); if(!isKnob(opt.header)){opt.header={}};
                if(!opt.header.apikey&&!isin(opt.target,"://")){opt.header.apikey=this.apikey};
                opt.header.forEach((v,k)=>{xhr.setRequestHeader(k,v)});
                xhr.send((opt.convey?text(opt.convey):null));
            }
        });
    };
// ----------------------------------------------------------------------------------------------------------------------------
