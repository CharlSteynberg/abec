



// dcor :: (style) : client-side .. all CSS included into ABEC .. .. atob() these `ornate` strings to see their contents
// ----------------------------------------------------------------------------------------------------------------------------
    if(CLIENTSIDE){upon("configReady",function()
    {
        // vars :: local : to use in this context
        var gridBase = (conf("View/gridBase")+1);

        // CSS :: htmlAuto : normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css
        ornate(`htmlAuto`,`aHRtbHtsaW5lLWhlaWdodDoxLjE1Oy13ZWJraXQtdGV4dC1zaXplLWFkanVzdDoxMDAlfWJvZHl7bWFyZ2luOjB9bWFpbntkaXNwbGF5OmJsb2NrfWgxe2ZvbnQtc2l6ZToyZW07bWFyZ2luOjAuNjdlbSAwfWhye2JveC1zaXppbmc6Y29udGVudC1ib3g7aGVpZ2h0OjA7b3ZlcmZsb3c6dmlzaWJsZX1wcmV7Zm9udC1mYW1pbHk6bW9ub3NwYWNlLCBtb25vc3BhY2U7Zm9udC1zaXplOjFlbX1he2JhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnR9YWJiclt0aXRsZV17Ym9yZGVyLWJvdHRvbTpub25lO3RleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmU7dGV4dC1kZWNvcmF0aW9uOnVuZGVybGluZSBkb3R0ZWR9YixzdHJvbmd7Zm9udC13ZWlnaHQ6Ym9sZGVyfWNvZGUsa2JkLHNhbXB7Zm9udC1mYW1pbHk6bW9ub3NwYWNlLCBtb25vc3BhY2U7Zm9udC1zaXplOjFlbX1zbWFsbHtmb250LXNpemU6ODAlfXN1YixzdXB7Zm9udC1zaXplOjc1JTtsaW5lLWhlaWdodDowO3Bvc2l0aW9uOnJlbGF0aXZlO3ZlcnRpY2FsLWFsaWduOmJhc2VsaW5lfXN1Yntib3R0b206LTAuMjVlbX1zdXB7dG9wOi0wLjVlbX1pbWd7Ym9yZGVyLXN0eWxlOm5vbmV9YnV0dG9uLGlucHV0LG9wdGdyb3VwLHNlbGVjdCx0ZXh0YXJlYXtmb250LWZhbWlseTppbmhlcml0O2ZvbnQtc2l6ZToxMDAlO2xpbmUtaGVpZ2h0OjEuMTU7bWFyZ2luOjB9YnV0dG9uLGlucHV0e292ZXJmbG93OnZpc2libGV9YnV0dG9uLHNlbGVjdHt0ZXh0LXRyYW5zZm9ybTpub25lfVt0eXBlPSJidXR0b24iXSxbdHlwZT0icmVzZXQiXSxbdHlwZT0ic3VibWl0Il0sYnV0dG9uey13ZWJraXQtYXBwZWFyYW5jZTpidXR0b259W3R5cGU9ImJ1dHRvbiJdOjotbW96LWZvY3VzLWlubmVyLFt0eXBlPSJyZXNldCJdOjotbW96LWZvY3VzLWlubmVyLFt0eXBlPSJzdWJtaXQiXTo6LW1vei1mb2N1cy1pbm5lcixidXR0b246Oi1tb3otZm9jdXMtaW5uZXJ7Ym9yZGVyLXN0eWxlOm5vbmU7cGFkZGluZzowfVt0eXBlPSJidXR0b24iXTotbW96LWZvY3VzcmluZyxbdHlwZT0icmVzZXQiXTotbW96LWZvY3VzcmluZyxbdHlwZT0ic3VibWl0Il06LW1vei1mb2N1c3JpbmcsYnV0dG9uOi1tb3otZm9jdXNyaW5ne291dGxpbmU6MXB4IGRvdHRlZCBCdXR0b25UZXh0fWZpZWxkc2V0e3BhZGRpbmc6MC4zNWVtIDAuNzVlbSAwLjYyNWVtfWxlZ2VuZHtib3gtc2l6aW5nOmJvcmRlci1ib3g7Y29sb3I6aW5oZXJpdDtkaXNwbGF5OnRhYmxlO21heC13aWR0aDoxMDAlO3BhZGRpbmc6MDt3aGl0ZS1zcGFjZTpub3JtYWx9cHJvZ3Jlc3N7dmVydGljYWwtYWxpZ246YmFzZWxpbmV9dGV4dGFyZWF7b3ZlcmZsb3c6YXV0b31bdHlwZT0iY2hlY2tib3giXSxbdHlwZT0icmFkaW8iXXtib3gtc2l6aW5nOmJvcmRlci1ib3g7cGFkZGluZzowfVt0eXBlPSJudW1iZXIiXTo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixbdHlwZT0ibnVtYmVyIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b257aGVpZ2h0OmF1dG99W3R5cGU9InNlYXJjaCJdey13ZWJraXQtYXBwZWFyYW5jZTp0ZXh0ZmllbGQ7b3V0bGluZS1vZmZzZXQ6LTJweH1bdHlwZT0ic2VhcmNoIl06Oi13ZWJraXQtc2VhcmNoLWRlY29yYXRpb257LXdlYmtpdC1hcHBlYXJhbmNlOm5vbmV9Ojotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbnstd2Via2l0LWFwcGVhcmFuY2U6YnV0dG9uO2ZvbnQ6aW5oZXJpdH1kZXRhaWxze2Rpc3BsYXk6YmxvY2t9c3VtbWFyeXtkaXNwbGF5Omxpc3QtaXRlbX10ZW1wbGF0ZXtkaXNwbGF5Om5vbmV9W2hpZGRlbl17ZGlzcGxheTpub25lfQ==`);


        // CSS :: htmlCore : border-box for all .. fixes for expected CSS rendering .. margins, padding, outline, scrollbars ...
        ornate(`htmlCore`).with
        (`
            html{height:100%; font-size:1.125vw; line-height:1.5vw;}
            @media all and (max-width: 900px){ html{font-size:10px; line-height:13px;} }

            *{box-sizing:border-box; user-select:text; text-align:left; vertical-align:top;}
            *,*:focus,*:hover{outline:none;}
            body{margin:0px;padding:0px;height:100%}
            body{background:hsla(210,3%,16%,1);font-family:Arial,Helvetica,sans-serif;color:#AAA;}
            ::-webkit-scrollbar{width:10px; height:10px;}
            ::-webkit-scrollbar-track{background:hsla(0,0%,40%,0.25);}
            ::-webkit-scrollbar-thumb{background:hsla(0,0%,50%,0.25);border:1px solid hsla(0,0%,50%,0.2);border-radius:2px;}
            ::-webkit-scrollbar-corner{background:hsla(0,0%,40%,0.25);}
            div {display:block; position:relative; vertical-align:top; padding:0px; margin:0px;}
            table,th,tr,td {border-width:0px;border-collapse:collapse;margin:0px;padding:0px;vertical-align:top;}
            iframe,object {display:inline-block;position:relative;padding:0px;margin:0px;border:none;background:transparent;}
            pre {position:relative; padding:0px; margin:0px;}
            ul {margin:0px; padding:0px; margin-left:1.5rem; margin-top:0.5rem;}
            li {margin:0px; padding:0px;}
            p {margin:0px; margin-bottom:1rem;}
            a {font-weight:bold; cursor:pointer; text-decoration:underline; color:#CCC;}
            a:hover {color:#EEE;}
            textarea,input,select {position:relative; margin:0px; padding:4px; resize:none; background:hsla(210,3%,15%,1); font-family:monospace; font-size:12px; line-height:14px; color:#999; border:1px solid #AAA; border-radius:2px;}
            code {position:relative; margin:0px; padding:0px;}
            form {margin:0px; padding:0px;}
        `);


        // CSS :: htmlTags : custom nodes
        ornate(`htmlTags`).with
        (`
            view {display:block; position:fixed;    top:0; left:0; z-index:1000000; width:100%; height:100%;}
            layr {display:block; position:absolute; top:0; left:0; z-index:9000000; width:100%; height:100%;}
            panl {display:block; position:relative; width:100%; height:100%; overflow:auto;}
            wrap {display:block; position:relative;}
            slab {display:block; position:relative; overflow:hidden;}
            card {display:inline-block; position:relative; overflow:hidden;}
            icon {display:inline-block; position:relative; overflow:hidden;}

            grid {display:table; position:relative;}
            grow {display:table-row;}
            gcol {display:table-cell;}

            butn
            {
                display:inline-block; position:relative;
                min-width:9px; min-height:9px;
                background:hsla(0,0%,50%,0.5);
                text-align:center; color:hsla(0,0%,70%,1); text-shadow:0px 0px 1px hsla(0,0%,0%,0.2);
                white-space:nowrap !important;
                border:0.1rem solid hsl(0,0%,50%); border-radius:0.3rem;
                box-shadow:0px 0px 0.3rem hsla(0,0%,0%,0.2);
                text-shadow:0px 0px 0.1rem hsla(0,0%,0%,0.1);
                cursor:pointer; user-select:none;
            }

        `);


        // CSS :: htmlClan : base CSS classes
        ornate(`htmlClan`).with
        (`
            .view {display:block;position:fixed;top:0;left:0;z-index:1000000;width:100%;height:100%}
            .layr {display:block;position:absolute;top:0;left:0;z-index:9000000;width:100%;height:100%}

            .dbug {min-width:20px !important; min-height:20px !important; background:#BADA55 !important; font-size:11px !important; color:#AA0000 !important; border:1px solid #AA0000 !important; border-radius:0px !important; opacity:1 !important;}
            .hide {display:none;}

            .holder {display:block; position:relative; box-sizing:border-box; overflow:auto;}
            .ownrow {display:block;}
            .inline {display:inline-block;}

            .scrollNone {width:unset; height:unset; overflow:unset;}
            .scrollAuto {overflow:auto}
            .scrollShow {overflow:scroll}
            .scrollHide {overflow:none}

            .nonhuman {display:inline-block; position:absolute; width:320px; height:240px; top:-500px; left:-500px; overflow:hidden;}

            .link {cursor:pointer !important;}
            .link:hover {text-decoration:underline !important;}
        `);


        // CSS :: cssAlign : alignment
        ornate(`cssAlign`).with
        (
            cssGrp(".hold",
            {
                TL:`vertical-align:top; text-align:left;`,
                TC:`vertical-align:top; text-align:center;`,
                TR:`vertical-align:top; text-align:right;`,

                ML:`vertical-align:middle; text-align:left;`,
                MC:`vertical-align:middle; text-align:center;`,
                CM:`text-align:center; vertical-align:middle;`,
                MR:`vertical-align:middle; text-align:right;`,

                BL:`vertical-align:bottom; text-align:left;`,
                BC:`vertical-align:bottom; text-align:center;`,
                BR:`vertical-align:bottom; text-align:right;`,

                TT:`vertical-align:top;`,
                MM:`vertical-align:middle;`,
                BB:`vertical-align:bottom;`,

                LL:`text-align:left;`,
                CC:`text-align:center;`,
                RR:`text-align:right;`,
            })
            +"\n\n"+
            cssGrp(".margin",range(0,gridBase),(cn,mx)=>
            {
                let cp,fs,lh,ro; cp=cn.padd(mx); fs=((cn/10)*2); lh=((fs/3)*4); ro={};
                ro.assign
                ({
                    [`TL${cp}`]:`margin-top:${lh}rem; margin-left:${lh}rem;`,
                    [`TC${cp}`]:`margin-top:${lh}rem;`,
                    [`TT${cp}`]:`margin-top:${lh}rem;`,
                    [`TR${cp}`]:`margin-top:${lh}rem; margin-right:${lh}rem;`,

                    [`RT${cp}`]:`margin-right:${lh}rem; margin-top:${lh}rem;`,
                    [`RM${cp}`]:`margin-right:${lh}rem;`,
                    [`RR${cp}`]:`margin-right:${lh}rem;`,
                    [`RB${cp}`]:`margin-right:${lh}rem; margin-bottom:${lh}rem;`,

                    [`BR${cp}`]:`margin-bottom:${lh}rem; margin-right:${lh}rem;`,
                    [`BC${cp}`]:`margin-bottom:${lh}rem;`,
                    [`BB${cp}`]:`margin-bottom:${lh}rem;`,
                    [`BL${cp}`]:`margin-bottom:${lh}rem; margin-left:${lh}rem;`,

                    [`LB${cp}`]:`margin-left:${lh}rem; margin-bottom:${lh}rem;`,
                    [`LM${cp}`]:`margin-left:${lh}rem;`,
                    [`LL${cp}`]:`margin-left:${lh}rem;`,
                    [`LT${cp}`]:`margin-left:${lh}rem; margin-top:${lh}rem;`,

                    [`CM${cp}`]:`margin:${lh}rem;`,
                    [`MC${cp}`]:`margin:${lh}rem;`,
                    [`MM${cp}`]:`margin:${lh}rem;`,

                    [`LR${cp}`]:`margin-left:${lh}rem; margin-right:${lh}rem;`,
                    [`RL${cp}`]:`margin-right:${lh}rem; margin-left:${lh}rem;`,
                    [`TB${cp}`]:`margin-top:${lh}rem; margin-bottom:${lh}rem;`,
                    [`BT${cp}`]:`margin-bottom:${lh}rem; margin-top:${lh}rem;`,
                });
                return ro;
            })
            +"\n\n"+
            cssGrp(".padded",range(0,gridBase),(cn,mx)=>
            {
                let cp,fs,lh,ro; cp=cn.padd(mx); fs=((cn/10)*2); lh=((fs/3)*4); ro={};
                ro.assign
                ({
                    [`TL${cp}`]:`padding-top:${lh}rem; padding-left:${lh}rem;`,
                    [`TC${cp}`]:`padding-top:${lh}rem;`,
                    [`TT${cp}`]:`padding-top:${lh}rem;`,
                    [`TR${cp}`]:`padding-top:${lh}rem; padding-right:${lh}rem;`,

                    [`RT${cp}`]:`padding-right:${lh}rem; padding-top:${lh}rem;`,
                    [`RM${cp}`]:`padding-right:${lh}rem;`,
                    [`RR${cp}`]:`padding-right:${lh}rem;`,
                    [`RB${cp}`]:`padding-right:${lh}rem; padding-bottom:${lh}rem;`,

                    [`BR${cp}`]:`padding-bottom:${lh}rem; padding-right:${lh}rem;`,
                    [`BC${cp}`]:`padding-bottom:${lh}rem;`,
                    [`BB${cp}`]:`padding-bottom:${lh}rem;`,
                    [`BL${cp}`]:`padding-bottom:${lh}rem; padding-left:${lh}rem;`,

                    [`LB${cp}`]:`padding-left:${lh}rem; padding-bottom:${lh}rem;`,
                    [`LM${cp}`]:`padding-left:${lh}rem;`,
                    [`LL${cp}`]:`padding-left:${lh}rem;`,
                    [`LT${cp}`]:`padding-left:${lh}rem; padding-top:${lh}rem;`,

                    [`CM${cp}`]:`padding:${lh}rem;`,
                    [`MC${cp}`]:`padding:${lh}rem;`,
                    [`MM${cp}`]:`padding:${lh}rem;`,

                    [`LR${cp}`]:`padding-left:${lh}rem; padding-right:${lh}rem;`,
                    [`RL${cp}`]:`padding-right:${lh}rem; padding-left:${lh}rem;`,
                    [`TB${cp}`]:`padding-top:${lh}rem; padding-bottom:${lh}rem;`,
                    [`BT${cp}`]:`padding-bottom:${lh}rem; padding-top:${lh}rem;`,
                });
                return ro;
            })
            +"\n\n"+
            cssGrp(".size",range(0,gridBase),(cn,mx)=>
            {
                let cp,fs,lh,ro; cp=cn.padd(mx); fs=((cn/10)*2); lh=((fs/3)*4); ro={};
                ro.assign
                ({
                    [("Hold"+cp)]:("width:"+fs+"rem; height:"+fs+"rem; min-width:"+fs+"rem; min-height:"+fs+"rem; max-width:"+fs+"rem; max-height:"+fs+"rem; font-size:"+fs+"rem; line-height:"+lh+"rem;"),
                    [("Rect"+cp)]:("width:"+fs+"rem; height:"+(fs/3)+"rem; min-width:"+fs+"rem; min-height:"+(fs/3)+"rem;"),
                    [("Circ"+cp)]:("width:"+fs+"rem; height:"+fs+"rem; min-width:"+fs+"rem; min-height:"+fs+"rem; border-radius:"+(fs/2)+"rem;"),
                    [("Wide"+cp)]:("width:"+fs+"rem; min-width:"+fs+"rem; max-width:"+fs+"rem;"),
                    [("High"+cp)]:("height:"+fs+"rem; min-height:"+fs+"rem; max-height:"+fs+"rem;"),
                    [("Text"+cp)]:("font-size:"+fs+"rem; line-height:"+lh+"rem;"),
                    [("Line"+cp)]:("font-size:"+((fs/4)*3)+"rem; line-height:"+fs+"rem;"),
                    [("Icon"+cp)]:("font-size:"+fs+"rem; line-height:"+fs+"rem;"),
                });
                return ro;
            })
            +"\n\n"+
            cssGrp(".posi",
            {
                TT:`position:absolute; top:0px;`,
                TL:`position:absolute; top:0px; left:0px;`,
                TC:`position:absolute; top:0px; left:50%; transform:translate(-50%,0%);`,
                TR:`position:absolute; top:0px; right:0px;`,

                RR:`position:absolute; right:0px;`,
                RT:`position:absolute; right:0px; top:0px;`,
                RM:`position:absolute; right:0px; top:50%; transform:translate(0%,-50%);`,
                RB:`position:absolute; right:0px; bottom:0px;`,

                BB:`position:absolute; bottom:0px;`,
                BR:`position:absolute; bottom:0px; right:0px;`,
                BC:`position:absolute; bottom:0px; left:50%; transform:translate(-50%,0%);`,
                BL:`position:absolute; bottom:0px; left:0px;`,

                LL:`position:absolute; left:0px;`,
                LB:`position:absolute; bottom:0px; left:0px;`,
                LM:`position:absolute; left:0px; top:50%; transform:translate(0%,-50%);`,
                LT:`position:absolute; left:0px; top:0px;`,

                MM:`position:absolute; transform:translate(-50%,-50%); left:50%; top:50%;`,
                CM:`position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);`,
                MC:`position:absolute; transform:translate(-50%,-50%); left:50%; top:50%;`,
            })
            +"\n\n"+
            cssGrp(".span",range(0,gridBase),(cn,mx)=>
            {
                let cp,ro,cx,uv; cp=cn.padd(mx); ro={};
                uv=Math.ceil(((mx<=100)?(cn/100):(100/cn))*100);

                ro.assign
                ({
                    [`XX${cp}`]:`width:${uv}vw;`,
                    [`YY${cp}`]:`height:${uv}vh;`,
                    [`XY${cp}`]:`width:${uv}vw; height:${uv}vh`,
                });

                if((cn<10)||isInum(cn/10)||isInum(cn/12)||isInum(cn/15))
                {
                    cn=(cn||1); for(cx=0; cx<=cn; cx++){let xp=cx.padd(mx); ro.assign
                    ({
                        [`XX${xp}of${cp}`]:(`width:`+(cx/cn)+`vw;`),
                        [`XY${xp}of${cp}`]:(`width:`+(cx/cn)+`vw; height:`+(cx/cn)+`vh;`),
                        [`YY${xp}of${cp}`]:(`height:`+(cx/cn)+`vh;`),
                    })};
                };

                ro.assign
                ({
                    [`XX${cp}of${mx}`]:(`width:`+(cn/mx)+`vw;`),
                    [`XY${cp}of${mx}`]:(`width:`+(cn/mx)+`vw; height:`+(cn/mx)+`vh;`),
                    [`YY${cp}of${mx}`]:(`height:`+(cn/mx)+`vh;`),
                });

                return ro;
            })
        );



        // CSS :: tone :  input style
        ornate(`toneTint`).with((function(base,resl)
        {
            base.forEach((v,k)=>
            {
                let t,h; t=v.join(","); h=copyOf(v); h[2]=((((rtrim(h[2],"%"))*1)+10)+"%"); h=h.join(",");
                resl[`.${k}`]=//obj
                {
                    border:`0.15rem solid hsl(${t})`,
                    color:`hsl(${t})`,
                };
                resl[`.${k}:hover`]=//obj
                {
                    borderColor:`hsl(${h})`,
                    color:`hsl(${h})`,
                };
            });
            return resl;
        })
        ({
            auto:[0,"0%","50%"],
            harm:[0,"100%","60%"],
            warn:[90,"100%","60%"],
            good:[220,"100%","60%"],
            need:[300,"100%","60%"],
        },{}));



        // CSS :: cssEffects : various effects
        ornate(`cssEffects`).with
        (
            cssGrp(".blurBD",range(0,gridBase),(cn,mn)=>
            {
                let pn,ro,an; pn=cn.padd(mn); ro={}; an=(cn/10);
                ro[pn]=`backdrop-filter: blur(${an}rem);`;
                return ro;
            })
            // +"\n\n"+
            // cssGrp(".glow",range(0,gridBase),(cn,mn)=>
            // {
            //     let pn,ro,bn; pn=cn.padd(mn); ro={}; bn=(cn/10);
            //     let tn,tr; tr=(360/gridBase); tn=(cn*tr);
            //     if(360 % gridBase){moan("invalid gridbase!"); return};
            //
            //
            //     ro[pn]=`box-shadow: 0px 0px ${an}rem hsla(0,0,100,0,1);`;
            //     return ro;
            // })
        );



        // CSS :: skinDark :  theme
        ornate(`skinDark`).with
        ({
            ".AutoDark butn":{backgroundColor:hsla(0,0,0,0.5)},

            ".AutoDark .bgtint":
            {
                backgroundColor: hsla(0,0,0,0.7),
                backdropFilter: `blur(0.1rem)`,
            },

            ".AutoDark .softEdge":
            {
                border: `0.1rem solid hsla(0,0%,100%,0.5)`,
                borderRadius: `0.3rem`,
                boxShadow:`0px 0px 0.3rem hsla(0,0%,0%,1)`,
            },
        });



        // CSS :: skinLite :  theme
        ornate(`skinLite`).with
        ({
            ".AutoLite .bgtint": {backgroundColor:hsla(0,0,100,0.9)},
            ".AutoLite butn":{backgroundColor:hsla(0,0,90,0.5)},
        });
    })};
// ----------------------------------------------------------------------------------------------------------------------------
