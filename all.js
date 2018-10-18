//Global variables
var tall = document.querySelector('#tall');
var weight = document.querySelector('#weight');
// var bmiCalculate = document.querySelector('#headerButton');
var bmiTable = document.querySelector('.bmiHistory');
var clear = document.querySelector('#clearHistory a');
var headerButton = document.getElementById('headerButton');
var bmiData = JSON.parse(localStorage.getItem('bmiStorage')) || [];
/*It will be empty array if there are no any values
And if this array has values in it, it will be parsed into array form
*/
//Wrong varibale is for checking input elements and get the reloadButton's DOM after button shift
var wrong = '', reloadButton;



//Check if users input number correctly or not

function numCheck(e){
    //1.Get inputed tall and weight value
    let inputTall = tall.value / 100;
    let inputWeight = weight.value;
    //2.If tall and weight value aren't number, number() will return 'NaN'
    let checkTall = Number(inputTall);
    let checkWeight = Number(inputWeight);
    if (isNaN(checkTall) || isNaN(checkWeight)) {
        alert('請輸入數字');
        wrong = 'NaN';
    }else if (inputTall == '' || inputWeight=='' || inputTall <= 0 || inputWeight<= 0) {
        alert('請填入身高與體重，數值不可為0或是負數');
        wrong = 'NaN';
    }else {
        wrong = '';
    // Use isNaN() to see if tall and weight value are NaN or not
    }return wrong;
}


//Calculate and return BMI value

function addBmi() {
    let inputTall = tall.value / 100;
    let inputWeight = weight.value;
    let bmiResult = inputWeight / (inputTall * inputTall);
    //Convert a number into a string, keeping only two decimals
    let finalBmi = bmiResult.toFixed(2);
    return finalBmi;
}


//Get and return time value

function addTime(){
    let today = new Date();
    //set date and create the format
    let timeNow = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()
    return timeNow;
}


//Judge and return BMI level value 

function bmiLevel() {
    //1. Calculate and return BMI value
    const level = addBmi();
    //2.let an empty variable and use if statement to judge which level it is 
    let judge = '';
    if (level < 18.5) {
        judge = '過輕';
    } else if (level >= 18.5 && level < 24) {
        judge = '理想';
    } else if (level >= 24 && level < 27) {
        judge = '過重';
    } else if (level >= 27 && level < 30) {
        judge = '輕度肥胖';
    } else if (level >= 30 && level < 35) {
        judge = '中度肥胖';
    } else {
        judge = '重度肥胖';
    }
    return judge;
}


//Update HTML page

function updateList(list) {
    let str = '';
    let len = list.length;
    for (let i = 0; i<len ; i++) {
        str +=`
        <li>
            <table class="${bmiData[i].border}">
                <tr>
                    <td>${bmiData[i].bmiCheck}</td>
                    <td><small>bmi</small>${bmiData[i].bmi}</td>
                    <td><small>weight</small>${bmiData[i].inputWeight}KG</td>
                    <td><small>height</small>${bmiData[i].inputTall}CM</td>
                    <td><small>${bmiData[i].time}</small></td>
                    <td class="bmiHistory_delete"><a data-index="${i}" href="#">&times;</a></td>
                </tr>
             </table>
        </li>
        `
    }
    bmiTable.innerHTML = str;
}


//Judge and decide border color

function borderCheck() {
    //1.Call addBmi() and get return BMI value
    let level = addBmi();
    //2.Decide the border color class name
    let border = '';
    if (level < 18.5) {
        border = 'light';
    } else if (level >= 18.5 && level < 24) {
        border = 'health';
    } else if (level >= 24 && level < 27) {
        border = 'overWeight';
    } else if (level >= 27 && level < 30) {
        border = 'obese';
    } else if (level >= 30 && level < 35) {
        border = 'midObese';
    } else {
        border = 'overObese';
    }
    return border;
}

// Button shift

function buttonShift(bmi,level,border) {
    let str = '';
    str =`
    <div class="header__container__col-4__afterBtn ${border} fullBorder">
        <p>${bmi}</p>
        <p>bmi</p>
        <p><a href="#" id="iconButton">
            <img src="img/icons_loop.png" alt="loop">
        </a></p>
        <p>${level}</p>
    </div>
    `
    headerButton.innerHTML = str;
    reloadButton = document.getElementById('iconButton');
    //get the reloadButton's DOM after button shift
}

//Reload button

function reloadBtn(e) {
    //1.Stop the default behaviour
    e.preventDefault();
    //2.Stop bubbling
    e.stopPropagation();
    //3.Construct original button and insert to str
    let str = '';
    str = `
    <input type="button" id="checkbmi" class="header__container__col-4__resultBtn" value="看結果">
    `
    headerButton.innerHTML = str;
    //4.Reset input value
    tall.value = '';
    weight.value = '';

    //clear input value
    // let bmiCalculate = document.querySelector('#checkbmi');
    // console.log(bmiCalculate);
    // bmiCalculate.addEventListener('click', addData, false);
    //add event listener to bmiCalculate again.
}

//All function and Data control

function addData(e) {
    //1.Because I add eventlistener to this whole div id="headerButton", so I need to exclude ares I don't want to triger eventlistener
    if (e.target.nodeName === 'INPUT' || e.target.nodeName === 'A' ) {
        //2.Check number is it's valid or not, if it's invalid, jump out of the function
        numCheck();
        if (wrong == 'NaN'){
            return;
        }
        //3.Get BMI value
        let bmiValue = addBmi();
        //4.Get time value
        let timeValue = addTime();
        //5.Judge and get the BMI level
        let judgeBmi = bmiLevel();
        //6.Get the border class name
        let borderSet = borderCheck();
        //7.Shift the button to show resule
        buttonShift(bmiValue,judgeBmi,borderSet);
        //8.Add event listerer to reloadButton after button shifting
        reloadButton.addEventListener('click', reloadBtn, false);
        //9.Construc an object and insert all values I need
        let bmiRecord = {
            bmiCheck: judgeBmi,
            bmi: bmiValue,
            inputWeight: weight.value,
            inputTall: tall.value,
            time: timeValue,
            border: borderSet
        };
        //10.Push an constructed object to bmiData array
        bmiData.push(bmiRecord);
        //11.Transfer bmiData array to string because localStorage only accepts string data then set it into localStorage
        localStorage.setItem('bmiStorage', JSON.stringify(bmiData));
        //12.Call the function to update list
        updateList(bmiData);
    }else {
        //If user clicks other area, it won call any function
        return
    }
}

//Delete the whole list

function deleteList(e) {
    //1.Stop the default behaviour
    e.preventDefault();
    //2.Stop bubbing
    e.stopPropagation();
    //3.Remove the whole localStorage item
    localStorage.removeItem('bmiStorage');
    //4.Update the array to empty array
    bmiData = [];
    //5.Update list
    updateList(bmiData);
}

//Delete target li

function deleteTarget(e) {
    //1.Stop the default behaviour
    e.preventDefault();
    //2.Stop bubbing
    e.stopPropagation();
    //3.Because the eventlistener is added to the whole table, so I needs to exclude ares I don't want to triger eventlistener
    if (e.target.nodeName !== 'A') {
        return;
    }
    //4.Get the data-index value which responds it's place in array
    let indexCheck = e.target.dataset.index;
    // console.log(indexCheck);
    //5.Splice out target object
    bmiData.splice(indexCheck,1);
    //6.Transfer array to string and update the localStorage
    localStorage.setItem('bmiStorage', JSON.stringify(bmiData));
    //7.Update list
    updateList(bmiData);
}

//EventListener
//Binds click event to all elements under #headerButton
headerButton.addEventListener('click', addData, false);
clear.addEventListener('click', deleteList, false);
bmiTable.addEventListener('click', deleteTarget, false);
//Update list when load
updateList(bmiData);