module.exports = (function()
{
    let c=require("../Conf/.js");
    let b=pget("/Main/base.js");
    let x=pget("/Main/xtnd.js");
    let l=require("../Libs/.js");

    return (c+b+l+cfro("/Main/xtnd.js")+x);
})();
