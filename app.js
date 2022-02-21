// import 
const express  = require('express');
const app = express();
const path = require('path');


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


app.use(express.static('public'))

app.get('/',(req,resp)=>{
    resp.render('home');
})

app.listen(9090,()=>{
    console.log('Listning on port 9090');
})