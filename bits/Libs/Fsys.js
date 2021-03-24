

// tool :: Fsys : file-system operations
// ----------------------------------------------------------------------------------------------------------------------------
    if(SERVERSIDE){hard("Fsys",require("fs"))};

    if(CLIENTSIDE)
    {
        bake("Fsys",
        {
            readFile:function readFile(pt,cb)
            {
                Http.request(pt,function()
                {
                    let hd=mean(this.getAllResponseHeaders(),(k)=>{return camelCase(k,1)},(v)=>
                    {if(!isin(v,"=")){return v}; v=mean(v.swap(["=",","],[":",";"])); return v});
                    this.assign({path:pt}); cb(this.response,hd,this);
                });
            },
        });
    };
// ----------------------------------------------------------------------------------------------------------------------------
