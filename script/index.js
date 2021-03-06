//variables
let chartContainer=document.querySelector('.chartContainer');
let myChart = document.querySelector('#myChart').getContext('2d');
// myChart.canvas.parentNode.style.width = "90vw";
// myChart.canvas.parentNode.style.height = "90vh";
Chart.defaults.global.defaultFontColor='black';
Chart.defaults.global.defaultFontSize='18';
Chart.defaults.global.defaultFontFamily='Ariel';

const continentsBtn=document.querySelector("#continentsButtons");
const infoButtons=document.querySelector("#infoButtons");
const select= document.querySelector('#countries')
const popUpBox = document.getElementById("myPopUpBox");
const span = document.getElementsByClassName("close")[0];
const innerBox=document.querySelector('.innerBox');
let loader=document.querySelector('#loader');

const countriesApi = 'https://restcountries.herokuapp.com/api/v1';
const proxy = 'https://api.codetabs.com/v1/proxy/?quest';
const covidApi =' https://corona-api.com/countries';
let covidDataArr=[];
let countriesDataArr=[];
let chart;
let xLabels=[];
let yLabels=[];
let continent;
let label='';
let divTarget;
let uniqueContintinents;
getChart();

// CHART.JS
async function getChart(){
    chart = new Chart(myChart, {
        // The type of chart we want to create
        type: 'line',
    
        // The data for our dataset
        data: {
            labels: xLabels,
            datasets: [{
                label: label,
                backgroundColor: 'rgb(138, 188, 226)',
                borderColor: 'rgb(100, 170, 223)',
                data: yLabels
            }]
        },
    
        // Configuration options go here
        options: {
            title:{
                display:true,
                text:'Covid 19',
                fontSize:50,
                fontColor:'#000'
            },
            legend: {
                labels: {
                    fontSize:18,
                }
            },   
        }
    });
}

//Call Data
fetchCountriesApi();
fetchCovidApi();

//functions
async function fetchCountriesApi(){
    loader.style.display='block';
    const response = await fetch(`${proxy}=${countriesApi}`);
    let countriesData = await response.json ();
    const continents = countriesData.map(country => country.region)
    countriesDataArr=countriesData;
    uniqueContintinents = Array.from(new Set(continents));
    uniqueContintinents.sort();
    uniqueContintinents.pop();
    uniqueContintinents.shift();    
    loader.style.display='none';
}

async function fetchCovidApi(){
    const callApi = await fetch(covidApi);
    let covidData= await callApi.json();
    covidDataArr=covidData.data; 
}

function mapCountryData(countryItem){
    return{
        name:countryItem.name.common,
        code:countryItem.cca2,
        region:countryItem.region
    }
}
function createCountryArr(){
    let countryArr=countriesDataArr.map((x)=>(mapCountryData(x)));
    console.log(countriesDataArr);
    return countryArr;  
}
function mapCovidData(item){
    return{
        name: item.name,
        code:item.code,
        confirmed:item.latest_data.confirmed,
        critical: item.latest_data.critical,
        deaths: item.latest_data.deaths,
        recovered: item.latest_data.recovered,
        todeyDeaths:item.today.deaths,
        todayConfirmed:item.today.confirmed
    }
}

function createCovidArr(){
    let covidArr=covidDataArr.map((x)=>(mapCovidData(x)));
    return covidArr;  
}

function createRegionArr(region){
    let regionArr=createCountryArr();
    let arr=[];
    regionArr.forEach((x)=>{
        if(x.region==region){  
           arr.push(x.name) ;
        }
    })
    return arr;
}

//function returns the specific information by the key: confirmed, critical, deaths or recovered
function info (regionArr,key){
    let covid=createCovidArr();
    let covidKey=covid.map((x)=>{return x[key]});
    let infoArr=[];
    for(let i=0 ; i<regionArr.length ; i++){
        for(let j=0; j<covid.length ; j++){
            if(regionArr[i]==covid[j].name){
                infoArr[i]=covidKey[j];
            }
        }
    }
    return infoArr;
}

function changeSelectOptions(data){
    let option1 = document.createElement("option");
    option1.text = 'Choose country';
    select.add(option1);
    option1.setAttribute('disabled','true');
    for(let i=0; i<data.length;i++){
        let option = document.createElement("option");
        option.text = data[i];
        select.add(option);
    }
}

async function showInfoByCountry(value){
    let covid=await createCovidArr();
    let arr=covid.filter((x)=> x.name===value);
    let totalDeaths=arr[0].deaths+arr[0].todeyDeaths;
    let totalCases=totalDeaths+arr[0].critical+arr[0].recovered;
    const mainDiv=document.querySelector('.mainDiv');
    let p= `<p class=text> ${arr[0].name} </p>`
    let ul=`<ul class=ulList>
        <li class=list>Total cases<br> ${totalCases}</li>
        <li class=list>New cases<br> ${arr[0].todayConfirmed}</li>
        <li class=list>Total deaths <br> ${totalDeaths}</li>
        <li class=list>New deaths<br>${arr[0].todeyDeaths}</li>
        <li class=list>Total recovered <br> ${arr[0].recovered}</li>
        <li class=list>Critical <br> ${arr[0].critical}</li>
    </ul>`
    mainDiv.innerHTML=p;
    mainDiv.innerHTML+=ul;
}

//upDate chart function
async function update(continentStr, infoStr){
    chart.destroy();
    btnStyle();
    xLabels=await createRegionArr(continentStr);
    yLabels=await info(xLabels,infoStr);
    select.innerHTML='';
    changeSelectOptions(xLabels);
    getChart();
}


//Event listeners
continentsBtn.addEventListener('click',async (e)=>{
    continent=e.target.getAttribute("id");
    divTarget=e.target;
    label='covid 19 confirmed';
    update(continent,'confirmed');      
    e.stopPropagation();
},true)


infoButtons.addEventListener('click',async (e)=>{
    let infoBtn=e.target.getAttribute("id");
    label=`covid 19 ${infoBtn}`;           
    update(continent,infoBtn);
    
    e.stopPropagation();

},true);


// Get the popUpBox
select.addEventListener('change',()=>{
    showInfoByCountry(select.value);
    popUpBox.style.display = "block";
})

span.onclick = function() {
    popUpBox.style.display = "none";
  }

document.addEventListener('click',(e)=>{
    if(e.target.getAttribute("id")=='myPopUpBox')
        popUpBox.style.display = "none";
})

function btnStyle(){
    divTarget.classList.add("mystyle");
    uniqueContintinents.forEach((x)=>{
      if(x!=continent){
            document.getElementById(`${x}`).classList.remove("mystyle");
    }  
})}