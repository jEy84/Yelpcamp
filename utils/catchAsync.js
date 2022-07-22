// input the function and catch if error has and pass to the next 
module.exports = func =>{
    return (req,resp,next)=>{
        func(req,resp,next).catch(next);
    }
}