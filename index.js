console.clear()
const express = require('express');
const request = require('request');
const session = require('express-session')
const dotenv = require('dotenv');
const axios = require('axios')
dotenv.config();
const app = express();
app.set('view engine','ejs'); 
app.use(express.static('public'))                                                       
                            
app.use(session({
                 secret: 'bhai bhai',
                 resave: false,
                 saveUninitialized: true,
                 cookie: { secure: true, maxAge: 1000*60 }
}))


app.get('/',(req,res)=>{
    if(req.session.pageVisits)
       req.session.pageVisits++;
    else
       req.session.pageVisits=1;
    //console.log(req.session);   
    res.render('homepage');
})



app.get('/result',async (req,res)=>{
    try {
        const url = `http://www.omdbapi.com/?apikey=ecef8fbc&s=${req.query.movieName}`
        const {data} = await axios.get(url);
        //console.log(data);
        if (data.Search.length === 0) {
            res.render('movieNotFound');
        }else {
            res.render('result',{movieData : data.Search});
        }
    } catch(e) {
       // console.log(e.message);
        res.render('movieNotFound');
    }
})

app.get('/result/:id',(req,res)=>{
    const url = `http://www.omdbapi.com/?apikey=ecef8fbc&i=${req.params.id}`
    request(url,function(err,response,body){
        if(err)res.send("error");
        if(res.statusCode===200){
            const movie = JSON.parse(body);
            //console.log(movie);
            //res.send(data);
            if(movie.Response==='False')
              res.render('movieNotFound')
            else
             res.render('aboutMovie', {movie : movie});
        }    
        else{
            res.send("error");
        }
    })
})

app.get('/homepage',(req,res)=>{
    //console.log(req.query);
    res.render('homepage');
})


app.get('/aboutMe',(req,res)=>{
    //console.log(req.query);
    res.render('aboutMe');
})

app.get('*',(req,res)=>{
    //console.log(req.query);
    res.render('movieNotFound');
})

app.listen(process.env.PORT,()=>{
 console.log(`listening at port ${process.env.PORT}`);
});