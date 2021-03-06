//variables
let chartContainer=document.querySelector('.chartContainer');
let myChart = document.querySelector('#myChart').getContext('2d');
myChart.canvas.parentNode.style.width = "90vw";
myChart.canvas.parentNode.style.height = "90vh";

const continentsBtn=document.querySelector("#continentsButtons");
const infoButtons=document.querySelector("#infoButtons");
const select= document.querySelector('#countries')
const popUpBox = document.getElementById("myPopUpBox");
const span = document.getElementsByClassName("close")[0];
const innerBox=document.querySelector('.innerBox');



const countriesApi = 'https://restcountries.herokuapp.com/api/v1';
// const proxy = 'https://api.allorigins.win/raw?url';
const proxy = 'https://api.codetabs.com/v1/proxy/?quest';
const covidApi =' https://corona-api.com/countries';
let xLabels=[];
let yLabels=[];
let continent;
let label='';
getChart();

// CHART.JS
async function getChart(){
    let chart = new Chart(myChart, {
        // The type of chart we want to create
        type: 'line',
    
        // The data for our dataset
        data: {
            labels: xLabels,
            datasets: [{
                label: label,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
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
            }
        }
        
    });
}

//functions
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
    return covidData.data; 
}

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
        recovered: item.latest_data.recovered,
        todeyDeaths:item.today.deaths,
        todayConfirmed:item.today.confirmed
    }
}

async function createCovidArr(){
    let covidArr=(await fetchCovidApi()).map((x)=>(mapCovidData(x)));
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
    console.log("regionArr",arr);
    return arr;
}

//function returns the specific information by the key: confirmed, critical, deaths or recovered
async function info (regionArr,key){
    let covid=await createCovidArr();
    let covidKey=covid.map((x)=>{return x[key]});
    console.log('covidKey',covidKey)
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
    let totalDeates=arr[0].deaths+arr[0].todeyDeaths;
    let totalCases=totalDeates+arr[0].critical+arr[0].recovered;
    const mainDiv=document.querySelector('.mainDiv');
    let ul=`<ul class=ulList>
        <li class=list>Total cases<br> ${totalCases}</li>
        <li class=list>New cases<br> ${arr[0].todayConfirmed}</li>
        <li class=list>Total deates <br> ${totalDeates}</li>
        <li class=list>New deates<br>${arr[0].todeyDeaths}</li>
        <li class=list>Total recovered <br> ${arr[0].recovered}</li>
        <li class=list>Critical <br> ${arr[0].critical}</li>
    </ul>`

    mainDiv.innerHTML=ul;
    console.log(arr);
    console.log("todeyDeaths",arr[0].todeyDeaths);
    console.log("todayConfirmed",arr[0].todayConfirmed);
    console.log("critical",arr[0].critical);
    console.log("recovered",arr[0].recovered);
    console.log("deates",arr[0].deaths);
    console.log("total deates:",totalDeates);
    console.log("total cases:",totalDeates+arr[0].critical+arr[0].recovered);

}

//Event listeners
continentsBtn.addEventListener('click',async (e)=>{
    continent=e.target.getAttribute("id");
    console.log(e.target.getAttribute("id"));
    switch(continent){
        case('asia'):
            xLabels=await createRegionArr('Asia');
            yLabels=await info(xLabels,'confirmed');
            label='covid 19 confirmed';
            select.innerHTML='';
            changeSelectOptions(xLabels);
            getChart();
            break;
        case('europe'):
            xLabels=await createRegionArr('Europe');
            yLabels=await info(xLabels,'confirmed');
            label='covid 19 confirmed';
            select.innerHTML='';
            changeSelectOptions(xLabels);
            getChart();
            break;
        case('africa'):
            xLabels=await createRegionArr('Africa');
            yLabels=await info(xLabels,'confirmed');
            label='covid 19 confirmed';
            select.innerHTML='';
            changeSelectOptions(xLabels);
            getChart();
            break;
        case('americas'):
            xLabels=await createRegionArr('Americas');
            yLabels=await info(xLabels,'confirmed');
            label='covid 19 confirmed';
            select.innerHTML='';
            changeSelectOptions(xLabels);
            getChart();
            break;
    }
    e.stopPropagation();
})

infoButtons.addEventListener('click',async (e)=>{
    let infoBtn=e.target.getAttribute("id");
    console.log(e.target.getAttribute("id"));
    console.log(continent);
    switch(continent){
        case('asia'):
        xLabels=await createRegionArr('Asia');
            switch(infoBtn){
                case('confirmed'):
                yLabels=await info(xLabels,'confirmed');
                label='covid 19 confirmed';
                getChart();
                break;

                case('critical'):
                yLabels=await info(xLabels,'critical');
                label='covid 19 critical';
                getChart();
                break;

                case('deaths'):
                yLabels=await info(xLabels,'deaths');
                label='covid 19 deaths';
                getChart();
                break;

                case('recovered'):
                yLabels=await info(xLabels,'recovered');
                label='covid 19 recovered';
                getChart();
                break;
            }
        break;
            
        case('europe'):
        xLabels=await createRegionArr('Europe');
            switch(infoBtn){
                case('confirmed'):
                yLabels=await info(xLabels,'confirmed');
                label='covid 19 confirmed';
                getChart();
                break;

                case('critical'):
                yLabels=await info(xLabels,'critical');
                label='covid 19 critical';
                getChart();
                break;

                case('deaths'):
                yLabels=await info(xLabels,'deaths');
                label='covid 19 deaths';
                getChart();
                break;

                case('recovered'):
                yLabels=await info(xLabels,'recovered');
                label='covid 19 recovered';
                getChart();
                break;
            }
            break;
        case('africa'): 
        xLabels=await createRegionArr('Africa');
        switch(infoBtn){
            case('confirmed'):
            yLabels=await info(xLabels,'confirmed');
            label='covid 19 confirmed';
            getChart();
            break;

            case('critical'):
            yLabels=await info(xLabels,'critical');
            label='covid 19 critical';
            getChart();
            break;

            case('deaths'):
            yLabels=await info(xLabels,'deaths');
            label='covid 19 deaths';
            getChart();
            break;

            case('recovered'):
            yLabels=await info(xLabels,'recovered');
            label='covid 19 recovered';
            getChart();
            break;
        }
        break;
        case('americas'):
        xLabels=await createRegionArr('Americas');
        switch(infoBtn){
            case('confirmed'):
            yLabels=await info(xLabels,'confirmed');
            label='covid 19 confirmed';
            getChart();
            break;

            case('critical'):
            yLabels=await info(xLabels,'critical');
            label='covid 19 critical';
            getChart();
            break;

            case('deaths'):
            yLabels=await info(xLabels,'deaths');
            label='covid 19 deaths';
            getChart();
            break;

            case('recovered'):
            yLabels=await info(xLabels,'recovered');
            label='covid 19 recovered';
            getChart();
            break;
        }
        break;
    }


})

// Get the popUpBox
select.addEventListener('change',()=>{
    console.log(select.value);
    showInfoByCountry(select.value);
    popUpBox.style.display = "block";
})

span.onclick = function() {
    popUpBox.style.display = "none";
  }

document.addEventListener('click',(e)=>{
    console.log('window click');
    if(e.target.getAttribute("id")=='myPopUpBox')
        popUpBox.style.display = "none";

})