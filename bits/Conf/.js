module.exports = (function(stem)
{
    let r=(function(z){pget(("/"+stem),[".js"]).forEach((i)=>
    {
        console.log(`subadd : /${stem}/${i}`);
        y=((i=="base.js")?"":cfro(`/${stem}/${i}`)); z+=(y+pget("/"+stem+"/"+i))});
        return z;
    })("");

    return r;
})("Conf");
