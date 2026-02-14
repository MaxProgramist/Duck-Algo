//* ---------- Variables ----------
const INPUT_DECIMAL_TO_BINARY_NUMBER  = document.getElementById('input_decimalNumber');
const OUTPUT_DECIMAL_TO_BINARY_NUMBER = document.getElementById('output_decimalNumber');
const OUTPUT_DECIMAL_TO_BINARY_NUMBER_CTX = OUTPUT_DECIMAL_TO_BINARY_NUMBER.getContext("2d");

const INPUT_DECIMAL_SUM_1 = document.getElementById('input_decimalNumberSum_1');
const INPUT_DECIMAL_SUM_2 = document.getElementById('input_decimalNumberSum_2');
const OUTPUT_DECIMAL_SUM = document.getElementById('additionAnimation');
const OUTPUT_DECIMAL_SUM_CTX = OUTPUT_DECIMAL_SUM.getContext("2d");

let numberBits_decNumber = [];
let numberBits_addition_1 = [], numberBits_addition_2 = [];

ResizeCanva(OUTPUT_DECIMAL_SUM);
window.addEventListener("resize", () => ResizeCanva(OUTPUT_DECIMAL_SUM));
ResizeCanva(OUTPUT_DECIMAL_TO_BINARY_NUMBER);
window.addEventListener("resize", () => ResizeCanva(OUTPUT_DECIMAL_TO_BINARY_NUMBER));


EventListeners();
requestAnimationFrame(Animate);

//* ---------- Functions ----------
function Input_DecToBin(event) {
    const BIT_BOX_WIDTH = 25;
    const BIT_BOX_HEIGHT = 25;
    const OFFSET = 5;

    let binNumber = "";
    if (IsNumber(event.target.value)) {
        let number = clamp(parseInt(event.target.value), -2147483648, 2147483647);
        binNumber = DecToBin(number);
    }

    if (numberBits_decNumber.length < binNumber.length) {
        for (let i = numberBits_decNumber.length; i<binNumber.length; i++) {
            let currentBit = binNumber[i];
            let currentBox = new BitBox(OUTPUT_DECIMAL_TO_BINARY_NUMBER_CTX, 0, 0, BIT_BOX_WIDTH, BIT_BOX_HEIGHT, 6, GetCSSColor('--bitBox-color'), currentBit, true, 15);
            currentBox.startAppear(500);
            numberBits_decNumber.push(currentBox);
        }
    } else if (numberBits_decNumber.length > binNumber.length) {
        for (let i = binNumber.length; i<numberBits_decNumber.length; i++) numberBits_decNumber[i].startDelete(250);
    }

    let currentX = OFFSET*2.5;
    let currentY = OFFSET*2.5;

    for (let i = 0; i<numberBits_decNumber.length; i++) {
        let currentBox = numberBits_decNumber[i], textIndex = Math.min(binNumber.length-1, i);
        currentBox.position(currentX, currentY);
        currentX += BIT_BOX_WIDTH + OFFSET;

        if (currentBox.isDeletingAnimation) continue;

        if ((currentBox.getText == binNumber[textIndex] && currentBox.getNextText == binNumber[textIndex]) || (currentBox.getText != binNumber[textIndex] && currentBox.getNextText == binNumber[textIndex])) continue;

        currentBox.changeText(binNumber[textIndex]);
        numberBits_decNumber[i] = currentBox;
    }
}

function SumeOfTwoDec() {
    
}

function Animate(currentTime) {
    ClearCanvasWithTransforms(OUTPUT_DECIMAL_SUM_CTX, OUTPUT_DECIMAL_SUM, GetCSSColor('--canva-color'));
    ClearCanvasWithTransforms(OUTPUT_DECIMAL_TO_BINARY_NUMBER_CTX, OUTPUT_DECIMAL_TO_BINARY_NUMBER, GetCSSColor('--canva-color'));

    let newList = [numberBits_decNumber, numberBits_addition_1, numberBits_addition_2]
    for (let currentList of newList) {
        for (let currBoxIndex = 0; currBoxIndex < currentList.length; currBoxIndex++) {
            let box = currentList[currBoxIndex];
            if (box.canDelete) {
                currentList.splice(currBoxIndex, 1);
                currBoxIndex--;
                continue;
            }

            box.update(currentTime);
            box.draw();
        }
    }

    requestAnimationFrame(Animate);
}

function EventListeners() {
    INPUT_DECIMAL_TO_BINARY_NUMBER.addEventListener('input', Input_DecToBin);
    INPUT_DECIMAL_TO_BINARY_NUMBER.addEventListener('input', Input_Filter);

    INPUT_DECIMAL_SUM_1.addEventListener('input', Input_Filter);
    INPUT_DECIMAL_SUM_1.addEventListener('input', AddBit);
    INPUT_DECIMAL_SUM_2.addEventListener('input', Input_Filter);
    INPUT_DECIMAL_SUM_2.addEventListener('input', AddBit);
}

function AddBit(event) {
    const BIT_BOX_WIDTH = 25;
    const BIT_BOX_HEIGHT = 25;
    const OFFSET = 5;

    let binNumber = "";
    if (IsNumber(event.target.value)) {
        let number = clamp(parseInt(event.target.value), -2147483648, 2147483647);
        binNumber = DecToBin(number);
    }

    let currentList = InputList(this.id);

    if (currentList.length < binNumber.length) {
        currentList.reverse();
        for (let i = currentList.length; i<binNumber.length; i++) {
            let currentBit = binNumber[binNumber.length - i - 1];
            let currentBox = new BitBox(OUTPUT_DECIMAL_SUM_CTX, 0, 0, BIT_BOX_WIDTH, BIT_BOX_HEIGHT, 6, GetCSSColor('--bitBox-color'), currentBit, true, 15);
            currentBox.startAppear(500);
            currentList.push(currentBox);
        }
        currentList.reverse();
    } else if (currentList.length > binNumber.length) {
        currentList.reverse();
        for (let i = binNumber.length; i<currentList.length; i++) currentList[i].startDelete(250);
        currentList.reverse();
    }

    let currentX = OUTPUT_DECIMAL_SUM.width - BIT_BOX_WIDTH * 2 - OFFSET;
    let currentY = BIT_BOX_HEIGHT + OFFSET * 2;
    if (this.id == "input_decimalNumberSum_2") currentY += BIT_BOX_HEIGHT + OFFSET;

    for (let i = currentList.length-1; i>=0; i--) {
        let currentBox = currentList[i], textIndex = Math.max(0, binNumber.length - 1 - (currentList.length - 1 - i));
        currentBox.position(currentX, currentY);
        currentX -= BIT_BOX_WIDTH + OFFSET;

        if (currentBox.isDeletingAnimation) continue;

        if ((currentBox.getText == binNumber[textIndex] && currentBox.getNextText == binNumber[textIndex]) || (currentBox.getText != binNumber[textIndex] && currentBox.getNextText == binNumber[textIndex])) continue;

        currentBox.changeText(binNumber[textIndex]);
        currentList[i] = currentBox;
    }

    if (this.id == "input_decimalNumberSum_1") numberBits_addition_1 = currentList;
    else if (this.id == "input_decimalNumberSum_2") numberBits_addition_2 = currentList;
}

function InputList(inputID) {
    if (inputID == "input_decimalNumberSum_1") return numberBits_addition_1;
    else if (inputID == "input_decimalNumberSum_2") return numberBits_addition_2;

    return null;
}

function DecToBin(decimalNumber) {
    const BITS_IN_BYTE = 8;

    let binaryResult = "";
    let isNegative = decimalNumber < 0;
    let absoluteNumber = Math.abs(decimalNumber);

    if (isNegative) absoluteNumber -= 1;

    for (let currentPower = 1; currentPower <= absoluteNumber; currentPower *= 2) {
        if (absoluteNumber & currentPower) binaryResult += isNegative ? "0" : "1";
        else binaryResult += isNegative ? "1" : "0";
    }

    let targetLength = Math.ceil((binaryResult.length+1) / BITS_IN_BYTE) * BITS_IN_BYTE - 1;
    
    for (let i = binaryResult.length; i < targetLength; i++)
        binaryResult += isNegative ? "1" : "0";

    binaryResult += isNegative ? "1" : "0";

    return reverseString(binaryResult);
}

function Input_Filter(event) {
    event.target.value = numberFilter(event.target.value);
    if (IsNumber(event.target.value))
        event.target.value = clamp(parseInt(event.target.value), -2147483648, 2147483647);
}

function numberFilter(inputString) { 
    let cleaned = inputString.replace(/[^0-9-]/g, "").replace(/\s/g, '');
    if (cleaned.includes("-")) {
        let isNegative = cleaned.startsWith("-");
        let onlyDigits = cleaned.replace(/-/g, "");
        cleaned = (isNegative ? "-" : "") + onlyDigits;
    }
    return cleaned;
}
function IsNumber     (value)         { return !(value.length == 0 || (value.length == 1 && value == "-")); }
function reverseString(string)        { return string.split("").reverse().join(""); }
function clamp        (val, min, max) { return Math.min(Math.max(val, min), max); }
