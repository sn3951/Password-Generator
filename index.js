const inputSlider = document.querySelector("[data-lengthslider]")
const lengthDisplay = document.querySelector("[data-lengthDisplay]")
const passwordDisplay = document.querySelector("[data-passwordDisplay]")
const copyBtn = document.querySelector("[data-copy]")
const copyMsg = document.querySelector("[data-copymsg]")
const uppercaseCheck = document.querySelector("#uppercase")
const lowercaseCheck = document.querySelector("#lowercase")
const numbersCheck = document.querySelector("#numbers")
const symbolsCheck = document.querySelector("#symbols")
const indicator = document.querySelector("[data-indicator]")
const generateBtn = document.querySelector(".generateBtn")
const allCheckBox = document.querySelectorAll("input[type=checkbox]")
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = ""
let passwordLength = 10
let checkCount = 0
handleSlider();
// set strength circle color to grey
setIndicator("#ccc");
//set passwordlength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize =
        ((passwordLength - min) * 100) / (max - min) + "% 100%";
}
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
function getRndmInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}
function generateRandomNumber() {
    return getRndmInteger(0, 9)
}
function generateLowerCase() {
    return String.fromCharCode(getRndmInteger(97, 123))
}
function generateUpperCase() {
    return String.fromCharCode(getRndmInteger(65, 90))
}
function generateSymbol() {
    const randomNum = getRndmInteger(0, symbols.length)
    return symbols.charAt(randomNum)
}
function calcStrength() {
    let hasUpper = false
    let hasLower = false
    let hasNum = false
    let hasSymbol = false
    if (uppercaseCheck.checked) hasUpper = true
    if (lowercaseCheck.checked) hasLower = true
    if (numbersCheck.checked) hasNum = true
    if (symbolsCheck.checked) hasSymbol = true

    if (hasUpper && hasLower && (hasSymbol || hasNum) && passwordLength >= 8) {
        setIndicator("#0f0")
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSymbol) &&
        passwordLength >= 6
    ) {
        setIndicator("$ff0")
    } else {
        setIndicator("#f00")
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText = "copied"
    }
    catch (e) {
        copyMsg.innerText = "Failed"
    }
    //to make copied text visible
    copyMsg.classList.add("active")
    //to make copied text invisible
    setTimeout(() => {
        copyMsg.classList.remove("active")
    }, 2000)

}
function handleCheckBoxChange() {
    checkCount = 0
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++
    })
    //special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount
        handleSlider()
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange)
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent()
})
function shufflePassword(array) {
    //fisher yates method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

generateBtn.addEventListener('click', () => {
    //none of the checkbox selected
    if (checkCount == 0)
        return

    if (passwordLength < checkCount) {
        passwordLength = checkCount
        handleSlider()
    }

    //let's start the journey to find the new password

    //remove old password
    password = ""

    //let's put the stuff mentioned in the checkbox

    // if (uppercaseCheck.checked) {
    //     password += generateUpperCase()
    // }
    // if (lowercaseCheck.checked) {
    //     password += generateLowerCase()
    // }

    // if (numbersCheck.checked) {
    //     password += generateRandomNumber()
    // }

    // if (symbolsCheck.checked) {
    //     password += generateSymbol()
    // }

    let funcArr = []
    if (uppercaseCheck.checked) {
        funcArr.push(generateUpperCase)
    }
    if (lowercaseCheck.checked) {
        funcArr.push(generateLowerCase)
    }
    if (numbersCheck.checked) {
        funcArr.push(generateRandomNumber)
    }
    if (symbolsCheck.checked) {
        funcArr.push(generateSymbol)
    }
    // compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]()
    }

    //remaining addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndmInteger(0, funcArr.length)
        password += funcArr[randIndex]()
    }

    //shuffle the password
    password = shufflePassword(Array.from(password))

    //show in Ui
    passwordDisplay.value = password
    calcStrength()
})