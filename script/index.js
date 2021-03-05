let myChart = document.querySelector('#myChart').getContext('2d');
const asia=document.querySelector("#asia");
const africa=document.querySelector("#africa");
const confirmed=document.querySelector("#confirmed");
myChart.canvas.parentNode.style.width = "90vw";
myChart.canvas.parentNode.style.height = "500px";


const countriesApi = 'https://restcountries.herokuapp.com/api/v1';
const proxy = 'https://api.allorigins.win/raw?url';
const covidApi =' https://corona-api.com/countries';
let xlabels=[];
let ytamps=[];
getChart();

async function fetchCountriesApi(){
    const response = await fetch(`${proxy}=${countriesApi}`);
    let countriesData = await response.json ();
    const continents = countriesData.map(country => country.region)
    const uniqueContintinents = Array.from(new Set(continents))

    return countriesData;
}

async function fetchCovidApi(){
    const callApi = await fetch(covidApi);
    let covidData= await callApi.json();
    // console.log(covidData.data);
    return covidData.data; 
}
fetchCovidApi();

function mapCountryData(countryItem){
    return{
        name:countryItem.name.common,
        code:countryItem.cca2,
        region:countryItem.region
    }
}

async function createCountryArr(){
    let countryArr=(await fetchCountriesApi()).map((x)=>(mapCountryData(x)));;
    return countryArr;  
}

function mapCovidData(item){
    return{
        name: item.name,
        code:item.code,
        confirmed:item.latest_data.confirmed,
        critical: item.latest_data.critical,
        deaths: item.latest_data.deaths,
        recovered: item.latest_data.recovered
    }
}

async function createCovidArr(){
    let covidArr=(await fetchCovidApi()).map((x)=>(mapCovidData(x)));;
    return covidArr;  
}



async function createRegionArr(region){
    let regionArr=(await createCountryArr());
    let arr=[];
    regionArr.forEach((x)=>{
        if(x.region==region){  
           arr.push(x.name) ;
        }
    })
    return arr;
}

async function info (str,key){
    let covid=await createCovidArr();
    let covidKey=covid.map((x)=>{return x[key]});
    console.log("covidKey",covidKey);
    let region=await createRegionArr(str);
    let infoArr=[];
    console.log(covid);
    console.log(region);
    for(let i=0 ; i<region.length ; i++){
        for(let j=0; j<covid.length ; j++){
            if(region[i]==covid[j].name){
                infoArr[i]=covidKey[j];
            }
        }
    }
    return infoArr;
}



// CHART.JS
async function getChart(){
let chart = new Chart(myChart, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: xlabels,
        datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: ytamps
        }]
    },

    // Configuration options go here
    options: {
        title:{
            display:true,
            text:'Covid 19',
            fontSize:50,
            fontColor:'#000'
        }
    }
});
}




asia.addEventListener('click',async ()=>{
    xlabels=await createRegionArr('Asia');
    ytamps=await info('Asia','confirmed');
    // let x=e.terget;
    getChart();
    
})

africa.addEventListener('click',async ()=>{
    xlabels=await createRegionArr('Africa');
    ytamps=await info('Africa','confirmed');
    getChart();
    
})
