const express = require('express')
const request = require('request');
const bodyParser = require('body-parser')

const app = express()
const PORT = 5000;
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
const api = '1402abb24c706e4d779ccfcefec6dcb3'

app.get('/', (req,res) => {
    res.render('index',{temp:null,wind:null,humidity:null,weather:null,desc:null,place:null,dir:null, errMessage: null});
})

app.post('/',(req,res)=> {
    let place = req.body.place
    console.log(place)
    let dataurl = `https://api.openweathermap.org/data/2.5/weather?q=${place}&units=imperial&appid=${api}`
    request(dataurl, (err,resp,body) => {
        if(err){
            res.render('index', {weather:null, errMessage: 'There is no data available for this place. Please try  other location!!'})
        }
        else{
            let weather = JSON.parse(body)
            if(weather.main == undefined){
                res.render('index', {weather:null, errMessage: 'There is no data available for this place. Please try other location!!'})
            }
            else{
          let temp = Math.round(weather.main.temp) + '°'
			    let humidity =   weather.main.humidity + '%'
			    let wind = Math.round(weather.wind.speed) + ' mph'
			    let dir = weather.wind.deg
			    let currentCondition = weather.weather[0].main
			    let desc = weather.weather[0].description
			    let place = weather.name
          let weatherText
          if(Math.round(weather.main.temp)<80){
            weatherText = `It's ${temp} F in ${weather.name} ⛄⛄!`;
          }
          else weatherText = `It's ${temp} F in ${weather.name}🔥🔥!`;
                res.render('index', {temp:temp,wind:wind,humidity:humidity,weather:weatherText,desc:desc,place:place,dir:dir, errMessage: null});
          }
        }
    })
})

app.listen(PORT, function(){
    console.log(`Presently weather app is listening to port ${PORT}`);
})