//variables
let chartContainer=document.querySelector('.chartContainer');
let myChart = document.querySelector('#myChart').getContext('2d');
myChart.canvas.parentNode.style.width = "90vw";
myChart.canvas.parentNode.style.height = "90vh";
Chart.defaults.global.defaultFontColor='black';
Chart.defaults.global.defaultFontSize='18';
Chart.defaults.global.defaultFontFamily='Ariel';

const continentsBtn=document.querySelector("#continentsButtons");
const infoButtons=document.querySelector("#infoButtons");
const select= document.querySelector('#countries')
const popUpBox = document.getElementById("myPopUpBox");
const span = document.getElementsByClassName("close")[0];
const innerBox=document.querySelector('.innerBox');

const countriesApi = 'https://restcountries.herokuapp.com/api/v1';
const proxy = 'https://api.codetabs.com/v1/proxy/?quest';
const covidApi =' https://corona-api.com/countries';
let chart;
let xLabels=[];
let yLabels=[];
let continent;
let label='';
let divTarget;
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
    return arr;
}

//function returns the specific information by the key: confirmed, critical, deaths or recovered
async function info (regionArr,key){
    let covid=await createCovidArr();
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
}

async function update(continentStr, infoStr,labelStr){
    chart.destroy();
    btnStyle();
    xLabels=await createRegionArr(continentStr);
    yLabels=await info(xLabels,infoStr);
    label=labelStr;
    select.innerHTML='';
    changeSelectOptions(xLabels);
    getChart();
}


//Event listeners
continentsBtn.addEventListener('click',async (e)=>{
    continent=e.target.getAttribute("id");
    divTarget=e.target;
    console.log(divTarget);
    console.log(e.target.getAttribute("id"));
    switch(continent){
        case('asia'):
            update('Asia','confirmed','covid 19 confirmed');
            break;
        case('europe'):
            update('Europe','confirmed','covid 19 confirmed');
            break;
        case('africa'):
            update('Africa','confirmed','covid 19 confirmed');
            break;
        case('americas'):
            update('Americas','confirmed','covid 19 confirmed');
            break;
    }
    e.stopPropagation();
},true)

infoButtons.addEventListener('click',async (e)=>{
    let infoBtn=e.target.getAttribute("id");
    switch(continent){
        case('asia'):
            switch(infoBtn){
                case('confirmed'):
                update('Asia','confirmed','covid 19 confirmed');
                break;

                case('critical'):
                update('Asia','critical','covid 19 critical');
                break;

                case('deaths'):
                update('Asia','deaths','covid 19 deaths');
                break;

                case('recovered'):
                update('Asia','recovered','covid 19 recovered');
                break;
            }
        break;
            
        case('europe'):
            switch(infoBtn){
                case('confirmed'):
                update('Europe','confirmed','covid 19 confirmed');
                break;

                case('critical'):
                update('Europe','critical','covid 19 critical');
                break;

                case('deaths'):
                update('Europe','deaths','covid 19 deaths');
                break;

                case('recovered'):
                update('Europe','recovered','covid 19 recovered');
                break;
            }
            break;
        case('africa'): 
                switch(infoBtn){
                case('confirmed'):
                update('Africa','confirmed','covid 19 confirmed');
                break;

                case('critical'):
                update('Africa','critical','covid 19 critical');
                break;

                case('deaths'):
                update('Africa','deaths','covid 19 deaths');
                break;

                case('recovered'):
                update('Africa','recovered','covid 19 recovered');
                break;
            }
        break;
        case('americas'):
            switch(infoBtn){
                case('confirmed'):
                update('Americas','confirmed','covid 19 confirmed');
                break;

                case('critical'):
                update('Americas','critical','covid 19 critical');
                break;

                case('deaths'):
                update('Americas','deaths','covid 19 deaths');
                break;

                case('recovered'):
                update('Americas','recovered','covid 19 recovered');
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

function btnStyle(){
    divTarget.classList.add("mystyle");
    switch(continent){
        case('asia'):
            document.getElementById('europe').classList.remove("mystyle");
            document.getElementById('africa').classList.remove("mystyle");
            document.getElementById('americas').classList.remove("mystyle");
            break;
        case('europe'):
            document.getElementById('asia').classList.remove("mystyle");
            document.getElementById('africa').classList.remove("mystyle");
            document.getElementById('americas').classList.remove("mystyle");
            break;
        case('africa'):
            document.getElementById('asia').classList.remove("mystyle");
            document.getElementById('europe').classList.remove("mystyle");
            document.getElementById('americas').classList.remove("mystyle");
            break;
        case('americas'):
            document.getElementById('asia').classList.remove("mystyle");
            document.getElementById('africa').classList.remove("mystyle");
            document.getElementById('europe').classList.remove("mystyle");
            break;
    }   
}