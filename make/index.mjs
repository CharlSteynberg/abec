// /*****************************************\
//
//     THIS IS EXPECTED TO RUN IN NODE.JS
//     run: > node ./build
//
// \*****************************************/
//
//
//
// // init :: (prep) : prepare the environment
// // ----------------------------------------------------------------------------------------------------------------------------
//     process.chdir(__dirname);
//     globalThis.Main = globalThis;
//
//     Main.Fsys = require("fs");
//     Main.Bash = require("child_process");
//     Main.Ugly = require("uglify-js");
//     Main.Root = "./bits";
//
//     Main.pget = function pget(p,o)
//     {
//         if(!p||!p.startsWith){return}; if(p.startsWith(Root)){p=p.slice(Root.length-1)};
//         if(!p.startsWith("../")&&!p.startsWith("./")&&!p.startsWith("/")){p=("/"+p)};
//         if(p.startsWith("/")){p=(Root+p)}; if(!Fsys.existsSync(p)){return};
//         let d=Fsys.statSync(p).isDirectory(); let r;
//         r=(d?Fsys.readdirSync(p):(Fsys.readFileSync(p,{encoding:"utf8"})+""));
//         if(!d||!o||!o.indexOf){return r}; // not a folder, or nothing to omit
//         let z,t; z=[]; t=(typeof o).slice(0,3); r.forEach((i)=>
//         {
//             if((t!=="str")&&(o.indexOf(i)>-1)){return};
//             if((t==="str")&&o.startsWith("*")&&o.endsWith("*")&&(i.indexOf(o.slice(1,(o.length-2)))>-1)){return};
//             z.push(i);
//         });
//         return z;
//     };
//
//     Main.pset = function pset(p,v)
//     {
//         if(!p||!p.startsWith){return}; if(p.startsWith(Root)){p=p.slice(Root.length-1)};
//         if(!p.startsWith("../")&&!p.startsWith("./")&&!p.startsWith("/")){p=("/"+p)};
//         if(p.startsWith("/")){p=(Root+p)}; //let d=Fsys.statSync(p).isDirectory();
//         return Fsys.writeFileSync(p,v,{encoding:"utf8"});
//     };
//
//     Main.cfro = function cfro(txt)
//     {
//         return ("\n\n\n\n// ====== >> COMPILER :: FROM : "+txt+" ====== << \\\\\n\n");
//     };
// // ----------------------------------------------------------------------------------------------------------------------------
//
//
//
//
// // exec :: (combine) : funnel all constituents into 1 file
// // ----------------------------------------------------------------------------------------------------------------------------
//     console.log("\nadding : Main");
//     Main.Abec = require(Root+"/Main/.js");
//
//     pget("/",["Main","Conf","Libs"]).forEach((stem)=>
//     {
//         console.log("adding : "+stem);
//
//         let path = (Root+"/"+stem+"/.js"); if(!Fsys.existsSync(path)){return};
//         let code = require(path);
//
//         Abec += (cfro(stem)+code);
//     });
// // ----------------------------------------------------------------------------------------------------------------------------
//
//
//
//
// // exec :: (output) : write raw Abec to ./dist/abec.max.js file .. for reflection testing
// // ----------------------------------------------------------------------------------------------------------------------------
//     pset("./dist/abec.max.js",Abec);
// // ----------------------------------------------------------------------------------------------------------------------------
//
//
//
//
// // exec :: (output) : write minified Abec to file
// // ----------------------------------------------------------------------------------------------------------------------------
//     Abec = Ugly.minify(Abec); // TODO :: fix this : it breaks the library!
//     // Abec = {code:Abec}; console.log("\n! errors prevented .. code not minified"); // TODO :: hack : remove this line once fixed
//
//     if(Abec.error){console.log(Abec.error);}
//     else
//     {
//         Abec = Abec.code;
//
//         pset("./dist/abec.min.js",Abec);
//         let path = (Bash.execSync("which node",{encoding:"utf8"})+"").trim();
//         let code = pget("./dist/abec"); code=code.split("#!/usr/bin/node").join("#!"+path);
//         pset("./dist/abec",code);
//
//         console.log("\nall gone into\n ./dist/abec.max.js\n ./dist/abec.min.js\n\nhave fun ;)\n");
//     };
// // ----------------------------------------------------------------------------------------------------------------------------
