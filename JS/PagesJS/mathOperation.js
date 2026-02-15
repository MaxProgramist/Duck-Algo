//* ---------- Variables ----------
//* ---- HTML Elements ----
const INPUT_DECIMAL_TO_BINARY_NUMBER  = document.getElementById('input_decimalNumber');
const OUTPUT_DECIMAL_TO_BINARY_NUMBER = document.getElementById('output_decimalNumber');
const OUTPUT_DECIMAL_TO_BINARY_NUMBER_CTX = OUTPUT_DECIMAL_TO_BINARY_NUMBER.getContext("2d");

const INPUT_DECIMAL_SUM_1 = document.getElementById('input_decimalNumberSum_1');
const INPUT_DECIMAL_SUM_2 = document.getElementById('input_decimalNumberSum_2');
const OUTPUT_DECIMAL_SUM = document.getElementById('additionAnimation');
const OUTPUT_DECIMAL_SUM_CTX = OUTPUT_DECIMAL_SUM.getContext("2d");

//* ---- Other ----

const BIT_BOX_WIDTH = 25;
const BIT_BOX_HEIGHT = 25;
const OFFSET = 5;

const MOVING_BOX_SPEED = -1.5;
const TIME_TO_STOP = 25;

let animation_addition = false, animation_addition_moving = false;
let animation_addition_addedBox = false;
let animation_addition_box_x = 0, animation_addition_box_y = 0, animation_addition_stop_x = 0;
let animation_addition_box_edge_x = 0;
let animation_addition_currentIndex = 0, animation_addition_imaginary = 0;
let animation_addition_hilightBox, animation_addition_imaginaryBox = null, animation_addition_plus = null;
let animation_addition_currentTimeToStop = 0;

let numberBits_decNumber = [];
let numberBits_addition_1 = [], numberBits_addition_2 = [];
let numberAdditon_additionalThings = [];

ResizeCanva(OUTPUT_DECIMAL_SUM);
window.addEventListener("resize", () => ResizeCanva(OUTPUT_DECIMAL_SUM));
ResizeCanva(OUTPUT_DECIMAL_TO_BINARY_NUMBER);
window.addEventListener("resize", () => ResizeCanva(OUTPUT_DECIMAL_TO_BINARY_NUMBER));

EventListeners();
requestAnimationFrame(Animate);

//* ---------- Functions ----------
function Input_DecToBin(event) {
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

function Addition(currentTime) {
    if (animation_addition_moving) {
        if (animation_addition_currentTimeToStop < TIME_TO_STOP) {
            animation_addition_currentTimeToStop++;
            return requestAnimationFrame(Addition);
        }

        animation_addition_box_x += MOVING_BOX_SPEED;

        if (animation_addition_box_x <= animation_addition_stop_x) {
            animation_addition_moving = false;
            animation_addition_box_x = animation_addition_stop_x;
        }
        if (animation_addition_stop_x < animation_addition_box_edge_x) {
            animation_addition_hilightBox.startDelete(250);
            animation_addition = false;
        }
        animation_addition_hilightBox.position(animation_addition_box_x, animation_addition_box_y);

        animation_addition_addedBox = false;
    } else if (!animation_addition_addedBox) {
        let number_1_index = numberBits_addition_1.length - 1 - animation_addition_currentIndex;
        let number_1 = (number_1_index >= 0)?numberBits_addition_1[number_1_index].getText : 0;

        let number_2_index = numberBits_addition_2.length - 1 - animation_addition_currentIndex;
        let number_2 = (number_2_index >= 0)?numberBits_addition_2[number_2_index].getText : 0;

        let ans = parseInt(number_1) + parseInt(number_2) + (animation_addition_imaginaryBox != null);
        animation_addition_imaginary = Math.floor(ans/2);

        if (animation_addition_imaginaryBox != null)
            animation_addition_imaginaryBox.startDelete(500);

        animation_addition_imaginaryBox = null;

        if (animation_addition_imaginary == 1) {
            ans -= 2;

            if (!(number_1_index == 0 && number_1_index == 0)) {

            let imaginaryBox_x = animation_addition_stop_x - BIT_BOX_WIDTH,
                imaginaryBox_y = animation_addition_box_y - BIT_BOX_HEIGHT;

            animation_addition_imaginaryBox = new BitBox(OUTPUT_DECIMAL_SUM_CTX, imaginaryBox_x, imaginaryBox_y, BIT_BOX_WIDTH, BIT_BOX_HEIGHT, 6, GetCSSColor('--imagery-color'), 1, true, 15);
            animation_addition_imaginaryBox.startAppear(500);
            numberAdditon_additionalThings.push(animation_addition_imaginaryBox);
            }
        }

        let ansBox_x = animation_addition_stop_x + OFFSET,
            ansBox_y = animation_addition_box_y + BIT_BOX_HEIGHT * 2 + OFFSET * 3;

        let ansBox = new BitBox(OUTPUT_DECIMAL_SUM_CTX, ansBox_x, ansBox_y, BIT_BOX_WIDTH, BIT_BOX_HEIGHT, 6, GetCSSColor('--ansBox-color'), ans.toString(), true, 15);
        ansBox.startAppear(500);
        numberAdditon_additionalThings.push(ansBox);

        animation_addition_addedBox = true;
        animation_addition_moving = true;
        animation_addition_currentTimeToStop = 0;
        animation_addition_stop_x -= BIT_BOX_WIDTH + OFFSET;
        animation_addition_currentIndex++;
    }

    if (animation_addition) requestAnimationFrame(Addition);
}

function SumeOfTwoDec() {
    if (numberBits_addition_1.length <= 0 && numberBits_addition_2.length <= 0) return;
    if (animation_addition) return;

    for (let currBox of numberAdditon_additionalThings)
        currBox.startDelete(150);

    let hilight_witdh = BIT_BOX_WIDTH + OFFSET*2;
    let hilight_height = BIT_BOX_HEIGHT*2 + OFFSET*3;

    animation_addition_box_x = OUTPUT_DECIMAL_SUM.width - BIT_BOX_WIDTH * 2 - OFFSET*2;
    animation_addition_box_y = BIT_BOX_HEIGHT + OFFSET*2;

    animation_addition_hilightBox = new BitBox(OUTPUT_DECIMAL_SUM_CTX, animation_addition_box_x, animation_addition_box_y, hilight_witdh, hilight_height, 6, GetCSSColor('--additionBox-color'), "", true, 15);
    animation_addition_hilightBox.startAppear(500);
    numberAdditon_additionalThings.push(animation_addition_hilightBox);

    let countOfNumbers = Math.max(numberBits_addition_1.length, numberBits_addition_2.length);
    let plus_x = OUTPUT_DECIMAL_SUM.width - (BIT_BOX_WIDTH + OFFSET)*(countOfNumbers+1) - BIT_BOX_WIDTH,
        plus_y = BIT_BOX_HEIGHT*2 + OFFSET;

    animation_addition_plus = new BitBox(OUTPUT_DECIMAL_SUM_CTX, plus_x, plus_y, BIT_BOX_WIDTH, BIT_BOX_HEIGHT, 6, GetCSSColor('--bitBox-color'), "+", true, 15);
    animation_addition_plus.startAppear(500);
    numberAdditon_additionalThings.push(animation_addition_plus);

    animation_addition = true;
    animation_addition_moving = false;
    animation_addition_addedBox = false;
    animation_addition_stop_x = animation_addition_box_x;
    animation_addition_box_edge_x = animation_addition_box_x - (BIT_BOX_WIDTH + OFFSET) * ( Math.max(numberBits_addition_1.length, numberBits_addition_2.length) - 1 );
    animation_addition_currentIndex = 0;
    animation_addition_imaginaryBox = null;
    animation_addition_currentTimeToStop = 0;

    requestAnimationFrame(Addition);
}

function Animate(currentTime) {
    ClearCanvasWithTransforms(OUTPUT_DECIMAL_SUM_CTX, OUTPUT_DECIMAL_SUM, GetCSSColor('--canva-color'));
    ClearCanvasWithTransforms(OUTPUT_DECIMAL_TO_BINARY_NUMBER_CTX, OUTPUT_DECIMAL_TO_BINARY_NUMBER, GetCSSColor('--canva-color'));

    let newList = [numberBits_decNumber, numberAdditon_additionalThings, numberBits_addition_1, numberBits_addition_2]
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
    if (!CanType(this.id)) {
        return;
    }

    DeleteOperationResult(this.id);

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
    let currentY = BIT_BOX_HEIGHT + OFFSET * 3;
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

function CanType(inputID) {
    if ((inputID == "input_decimalNumberSum_1" || inputID == "input_decimalNumberSum_2") &&
        animation_addition)return false;

    return true;
}

function DeleteOperationResult(inputID) {
    if ((inputID == "input_decimalNumberSum_1" || inputID == "input_decimalNumberSum_2"))
        for (let currBox of numberAdditon_additionalThings)
            currBox.startDelete(200);
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
