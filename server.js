require('dotenv').config();
let express = require('express')
let app = express()
let ejsLayouts = require('express-ejs-layouts')

app.use(ejsLayouts);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static("static"));

app.get('/', (req, res)=>{
  res.render('home')
})

app.use('/', require ('./routes/cities'));

app.get('/*', (req, res)=> {
  res.render('404');
})


app.listen(process.env.PORT || 8000, console.log(`🎧 Port ${process.env.PORT || 8000}`));