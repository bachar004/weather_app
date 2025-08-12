//api meteo :https://api.openweathermap.org
var modif=true;
//fonction pour avoir donnees de meteo avec lat et lon 
function fetch_weather(lat,lon){
    // 2eme fetch pour avoir les données 
    var url=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=2a92a64b8b16507646a4fd445affa647&units=metric`;
    fetch(url).then(rep=>rep.json()).then(met=>{
        document.querySelector("img").src=`https://openweathermap.org/img/wn/${met.weather[0].icon}@2x.png`;
        document.querySelector("#temp").textContent=Math.round(parseFloat(met.main.temp));
        document.querySelector("#description").textContent=met.weather[0].description;
        document.querySelector("#fk").textContent=met.main.feels_like+"°C";
        document.querySelector("#humidity").textContent=met.main.humidity+"%";
        document.querySelector("#wind").textContent=met.wind.speed+"Km/h";
        }
    ).catch(err=>console.error("Erreur",err.message));
    //url pour fetch tmp des jours suivants                   
    var daily=`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&units=metric&appid=90c5821c97673877b7599ad7d2a21be2`;
        fetch(daily).then(rep=>rep.json()).then(days=>{
            var date_today=new Date((days.list[0].dt)*1000).toLocaleDateString('en',{weekday:"long",day:"numeric",month:"long",year:"numeric"});
            document.querySelector("#date").textContent=date_today;
            for(var i=1;i<7;i++){
                var datid=new Date((days.list[i].dt)*1000).toLocaleDateString("en",{day:"numeric",month:"long"});//car timestamp en seconde et date timestamp doit etre en milliseconde;
                var id_deg="deg"+i;
                var id_date="d"+i;
                var id_img="img"+i;
                document.getElementById(id_date).textContent=datid;
                document.getElementById(id_deg).textContent=days.list[i].temp.day+"°";
                document.getElementById(id_img).src=`https://openweathermap.org/img/wn/${days.list[i].weather[0].icon}@2x.png`
             }
        }).catch(err=>console.error("Erreur",err.message));
    //click sur search pour avoir les données s'il existe 
}
function weather(){
    modif=true;
    var lat,lon,main,description,icon,temp,feels_like,humidity,temp_min,temp_max;
    var city=document.querySelector("#recherche").value;
    var url1=`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=2a92a64b8b16507646a4fd445affa647`;
    if(city.trim()){
        //1ere fetch pour avoir lon et lat du pays saisie
        fetch(url1).then(rep=>rep.json()).then(data=>{
            try{    //en cas le cité n'existe pas dans api il va declencher un message d'erreur
                    if(data[0]===undefined){
                        alert("There is no such City ");
                        throw "City doesn' Exist"
                    } 
                    lat=data[0].lat;
                    lon=data[0].lon;
                    document.querySelector("#city").textContent=data[0].name;
                    fetch_weather(lat,lon)
            }
            catch(err){
                console.log(err);
            }
        }
        ).catch(err=>console.error("erreur",err.message));//pour probleme connexion a l'api
    }
}
function load(){
    // a l'ouverture du cite on affiche les cordonnes sur mon pays Tunis(c'est un choix)
    fetch_weather(36.8065,10.1815);
    document.querySelector("button").addEventListener('click',weather);
    document.querySelector("#kal").addEventListener('click',function kal(){
        if(modif){
        var old =document.querySelector("#temp").textContent;
        document.querySelector("#temp").textContent=parseInt(old)+273;
        modif=false;
        }
    })
    document.querySelector("#cel").addEventListener('click',function cel(){
        if(!modif){
        var old =document.querySelector("#temp").textContent;
        document.querySelector("#temp").textContent=parseInt(old)-273;
        modif=true;
        }
    })
}
document.addEventListener("DOMContentLoaded",load);