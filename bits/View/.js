module.exports = (function(stem)
{
    let r=(function(z){pget(("/"+stem),[".js"]).forEach((i)=>
    {
        console.log(`subadd : /${stem}/${i}`); z+=(cfro(`/${stem}/${i}`)+pget("/"+stem+"/"+i))});
        return z;
    })("");

    return r;
})("View");
