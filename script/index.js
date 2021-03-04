let myChart = document.querySelector('#myChart').getContext('2d');
const asia=document.querySelector("#asia");
const africa=document.querySelector("#africa");

const countriesApi = 'https://restcountries.herokuapp.com/api/v1';
const proxy = 'https://api.allorigins.win/raw?url';
const covidApi =' https://corona-api.com/countries';
let xlabels=[];
let ytamps=[];
getChart();

async function fetchCountriesApi(){
    const response = await fetch(`${proxy}=${countriesApi}`);
    let countriesData = await response.json ();
    return countriesData;
}

// async function fetchCovidApi(){
//     const callApi = await fetch(covidApi);
//     let covidData= await callApi.json();
//     return covidData; 
// }

function mapCountryItem(countryItem){
    return{
        name:countryItem.name.common,
        code:countryItem.cca2,
        region:countryItem.region
    }
}

async function createCountryArr(){
    let countryArr=(await fetchCountriesApi()).map((x)=>(mapCountryItem(x)));;
    // console.log("countryArr",countryArr); 
    return countryArr;  
}


async function createRegionArr(region){
    let regionArr=(await createCountryArr());
    let arr=[];
    regionArr.forEach((x)=>{
        console.log(x.region)
        if(x.region==region){  
           arr.push(x.name) ;
        }
    })
    console.log(arr);
    return arr;
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




function addData(chart, label) {
    chart.data.label='hello'
  
    chart.update();
}

// function removeData(chart) {
//     chart.data.labels.pop();
//     chart.data.datasets.forEach((dataset) => {
//         dataset.data.pop();
//     });
//     chart.update();
// }



asia.addEventListener('click',async ()=>{
    xlabels=await createRegionArr('Asia');
    ytamps=[1000,2000,3000,4000,5000];
    getChart();
    
})

africa.addEventListener('click',async ()=>{
    xlabels=await createRegionArr('Africa');
    ytamps=[1000,2000,3000,4000,5000,6000,7000,8000,9000,10000,11000,12000,13000,14000,15000];
    getChart();
    
})