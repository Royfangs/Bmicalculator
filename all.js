//Get the value of tall and weight
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
var wrong = '';
//wrong varibale is for checking input elements
var reloadButton;
//get the reloadButton's DOM after button shift


//Check if users input number correctly or not

function numCheck(e){
    let inputTall = tall.value / 100;
    let inputWeight = weight.value;
    //get inputed tall and weight value
    let checkTall = Number(inputTall);
    let checkWeight = Number(inputWeight);
    //if tall and weight value aren't number, number() will return 'NaN'
    if (isNaN(checkTall) || isNaN(checkWeight)) {
        alert('請輸入數字');
        wrong = 'NaN';
        return wrong;
        // equal to return 'NaN'
    }else if (inputTall == '' || inputWeight=='' || inputTall <= 0 || inputWeight<= 0) {
        alert('請填入身高與體重，數值不可為0或是負數');
        wrong = 'NaN';
        return wrong;
        // equal to return 'NaN'
    }else {
        wrong = '';
        return wrong;
    }
    // use isNaN() to see if tall and weight value are NaN or not
}


//Calculate and return BMI value

function addBmi() {
    let inputTall = tall.value / 100;
    let inputWeight = weight.value;
    let bmiResult = inputWeight / (inputTall * inputTall);
    let finalBmi = bmiResult.toFixed(2);
    //Convert a number into a string, keeping only two decimals
    return finalBmi;
}


//Get and return time value

function addTime(){
    let today = new Date();
    let timeNow = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()
    //set date and create the format
    return timeNow;
}


//Judge and return BMI level value 

function bmiLevel() {
    let level = addBmi();
    //Calculate and return BMI value first
    let judge = '';
    //let an empty variable and use if statement to judge which level it is 
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
    let level = addBmi();
    //first it will call addBmi() and get return BMI value, then decide the border color class name
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

//reload button

function reloadBtn(e) {
    e.preventDefault();
    e.stopPropagation();
    let str = '';
    str = `
    <input type="button" id="checkbmi" class="header__container__col-4__resultBtn" value="看結果">
    `
    //construct original button and insert to str
    headerButton.innerHTML = str;
    tall.value = '';
    weight.value = '';
    //clear input value
    // let bmiCalculate = document.querySelector('#checkbmi');
    /*!important
    retarget original button's DOM
    If I don't do it, I can't add event listener to bmiCalculate again.
    *問題點2 這邊假設我不重複let bmiCalculate 去抓位置便沒有辦法重新綁定事件
    可是我一開始var bmiCalculate不是已經存過了? 還是我更動DOM的關係，此值已被洗掉?
    */
    // console.log(bmiCalculate);
    // bmiCalculate.addEventListener('click', addData, false);
    //add event listener to bmiCalculate again.
}

//All function and Data control

function addData(e) {
    if (e.target.nodeName === 'INPUT' || e.target.nodeName === 'A' ) {
        numCheck();
        //check the inputed element first
        if (wrong == 'NaN'){
            // console.log(wrong);
            return;
        }
        //If user's input is invalid, jump out of the function 
        let bmiValue = addBmi();
        //get BMI value
        let timeValue = addTime();
        //get time value
        let judgeBmi = bmiLevel();
        //judge and get the BMI string
        let borderSet = borderCheck();
        //get the border class name
        buttonShift(bmiValue,judgeBmi,borderSet);
        reloadButton.addEventListener('click', reloadBtn, false);
        //add event listerer to reloadButton after button shift
        let bmiRecord = {
            bmiCheck: judgeBmi,
            bmi: bmiValue,
            inputWeight: weight.value,
            inputTall: tall.value,
            time: timeValue,
            border: borderSet
        };
        //declare an object and insert all date into it
        bmiData.push(bmiRecord);
        //insert one whole object into BmiData array
        localStorage.setItem('bmiStorage', JSON.stringify(bmiData));
        /*transfer the array to string because localStorage only accepts string data
          then set it into localStorage
        */
        updateList(bmiData);
        //call the function to update list
    }else {
        return
    }
}

//Delete whole list

function deleteList(e) {
    e.preventDefault();
    //stop the default behaviour
    e.stopPropagation();
    //it prevents the event from pbubbling up the DOM.
    localStorage.removeItem('bmiStorage');
    //remove localStorage item
    bmiData = [];
    //update the array to empty array
    updateList(bmiData);
    //and update list
}

//Delete target li

function deleteTarget(e) {
    e.preventDefault();
    //stop the default behaviour
    e.stopPropagation();
    //it prevents the event from pbubbling up the DOM.
    if (e.target.nodeName !== 'A') {
        return;
    }
    //if users don't click anchor, it will not work because it jump out of the function 
    let indexCheck = e.target.dataset.index;
    //get the index value
    // console.log(indexCheck);
    bmiData.splice(indexCheck,1);
    //splice out target object
    localStorage.setItem('bmiStorage', JSON.stringify(bmiData));
    //transfer array to string and update the localStorage
    updateList(bmiData);
    //then update list
}

//EventListener

headerButton.addEventListener('click', addData, false);
//this binds click event to all elements under #headerButton
clear.addEventListener('click', deleteList, false);
bmiTable.addEventListener('click', deleteTarget, false);
updateList(bmiData);
//update list when load