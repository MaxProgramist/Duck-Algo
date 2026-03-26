import { UpdateBoxes, DecToBin_Int, DecToBin_FloatPoint, BinToDec_Int, Input_Filter, IsNumber } from '../utility.js'
import { Point, Size, BitBox, ClearCanvasWithTransforms, CanvasResize, GlowingLine, GetCSSColor, ScrollToRight } from '../canvasOperations.js'

//* ---------- Variables ---------- *//

//* -------- HTML Elements -------- *//
const INPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE  = document.getElementById('input_decimalNumber_positive');
const OUTPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE = document.getElementById('output_decimalNumber_positive');
const OUTPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE_CTX = OUTPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE.getContext("2d");

const INPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE = document.getElementById('input_decimalNumber_negative');
const OUTPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE = document.getElementById('output_decimalNumber_negative');
const OUTPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE_CTX = OUTPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE.getContext("2d");

const INPUT_BINARY_TO_DECIMAL = document.getElementById('input_binToDec');
const OUTPUT_BINARY_TO_DECIMAL = document.getElementById('output_binToDec');
const OUTPUT_BINARY_TO_DECIMAL_CTX = OUTPUT_BINARY_TO_DECIMAL.getContext("2d");

const INPUT_FLOAT_TO_BINARY_NUMBER = document.getElementById('input_floatNumber');
const OUTPUT_FLOAT_TO_BINARY_NUMBER = document.getElementById('output_floatNumber');
const OUTPUT_FLOAT_TO_BINARY_NUMBER_CTX = OUTPUT_FLOAT_TO_BINARY_NUMBER.getContext("2d");

const INPUT_ADDITION_1 = document.getElementById('input_decimalNumberAddition_1');
const INPUT_ADDITION_2 = document.getElementById('input_decimalNumberAddition_2');
const BUTTON_ADDITION = document.getElementById('button_Addition');
const OUTPUT_ADDITION = document.getElementById('additionAnimation');
const OUTPUT_ADDITION_CTX = OUTPUT_ADDITION.getContext("2d");

const INPUT_SUBTRACTION_1 = document.getElementById('input_decimalNumberSubtraction_1');
const INPUT_SUBTRACTION_2 = document.getElementById('input_decimalNumberSubtraction_2');
const BUTTON_SUBTRACTION = document.getElementById('button_Subtraction');
const OUTPUT_SUBTRACTION = document.getElementById('subtractionAnimation');
const OUTPUT_SUBTRACTION_CTX = OUTPUT_SUBTRACTION.getContext("2d");

const INPUT_MULTIPLICATION_1 = document.getElementById('input_decimalNumberMultiplication_1');
const INPUT_MULTIPLICATION_2 = document.getElementById('input_decimalNumberMultiplication_2');
const BUTTON_MULTIPLICATION = document.getElementById('button_Multiplication');
const OUTPUT_MULTIPLICATION = document.getElementById('multiplicationAnimation');
const OUTPUT_MULTIPLICATION_CTX = OUTPUT_MULTIPLICATION.getContext("2d");

const INPUT_DIVISION_1 = document.getElementById('input_decimalNumberDivision_1');
const INPUT_DIVISION_2 = document.getElementById('input_decimalNumberDivision_2');
const BUTTON_DIVISION = document.getElementById('button_Division');
const OUTPUT_DIVISION = document.getElementById('divisionAnimation');
const OUTPUT_DIVISION_CTX = OUTPUT_DIVISION.getContext("2d");

const OUTPUT_CTX = {
    positiveDecToBin: {ctx: OUTPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE_CTX, canva: OUTPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE, visible: true},
    negativeDecToBin: {ctx: OUTPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE_CTX, canva: OUTPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE, visible: true},
    floatToBin: {ctx: OUTPUT_FLOAT_TO_BINARY_NUMBER_CTX, canva: OUTPUT_FLOAT_TO_BINARY_NUMBER, visible: true},
    binToDec: {ctx: OUTPUT_BINARY_TO_DECIMAL_CTX, canva: OUTPUT_BINARY_TO_DECIMAL, visible: true},
    addition: {ctx: OUTPUT_ADDITION_CTX, canva: OUTPUT_ADDITION, visible: true},
    subtraction: {ctx: OUTPUT_SUBTRACTION_CTX, canva: OUTPUT_SUBTRACTION, visible: true},
    multiplication: {ctx: OUTPUT_MULTIPLICATION_CTX, canva: OUTPUT_MULTIPLICATION, visible: true},
    division: {ctx: OUTPUT_DIVISION_CTX, canva: OUTPUT_DIVISION, visible: true}
};

window.onload = () => {
    ScrollToRight(OUTPUT_ADDITION.parentElement);
    ScrollToRight(OUTPUT_SUBTRACTION.parentElement);
    ScrollToRight(OUTPUT_MULTIPLICATION.parentElement);
    ScrollToRight(OUTPUT_DIVISION.parentElement);
}

const OBSERVER_SETTINGS = { root: null, threshold: 0.1 };

const ObserverCallback = (Entries) => {
    Entries.forEach(Entry => {
        const TARGET_DATA = Object.values(OUTPUT_CTX).find(item => item.canva === Entry.target);
        if (TARGET_DATA) TARGET_DATA.visible = Entry.isIntersecting;
    });
};

const CANVAS_OBSERVER = new IntersectionObserver(ObserverCallback, OBSERVER_SETTINGS);
Object.values(OUTPUT_CTX).forEach(item => { CANVAS_OBSERVER.observe(item.canva); });

//* ------------ Other ------------ *//

const BIT_BOX_PARAM = {width: 25, height: 25, radius: 6, offset: 5, glowIntensity: 15};
const WINDOW_SIZE = {
    multiplication: {width: 1010, height: 75},
    division: {width: 1010, height: 85},
}

const TIME_TO_APPEAR = 500;
const TIME_TO_DISAPPEAR = 150;
const TIME_TO_CHANGE_SIZE = 500;
const TIME_TO_SCALE = 750;

const MOVING_BOX_SPEED = -2;
const LINE_RENDER_SPEED = 0.125;
const LINE_RENDER_WIDTH = 2.5;
const TIME_TO_STOP = 15;

let changingCount = {counter: 0};

let animationState = {
    positiveDecToBin: {
        bits: {
            number: []
        }
    },
    negativeDecToBin: {
        bits: {
            number: []
        }
    },
    floatToBin: {
        bits: {
            number: []
        }
    },
    binToDec: {
        bits: {
            numbers: []
        }
    },
    addition: {
        isPlaying: false,
        bits: {
            additional: [],
            number_1: [],
            number_2: []
        },
        index: 0,
        timeStoper: 0,
        hilight:{
            object: null,
            isMoving: false,
            stop_x: false,
            end_x: false
        },
        imaginary: {
            object: null,
            imaginary: 0
        }
    },
    subtraction: {
        isPlaying: false,
        bits: {
            additional: [],
            number_1: [],
            number_2: [],
            imaginary: []
        },
        index: 0,
        timeStoper: 0,
        hilight:{
            object: null,
            isMoving: false,
            stop_x: false,
            end_x: false
        },
        findingNextNumber: false,
        imaginary: {
            object: null,
            isMoving: false,
            index: 0,
            direction: 0,
            stop_x: false,
            end_x: false
        }
    },
    multiplication : {
        isPlaying: false,
        bits: {
            additional: [],
            number_1: [],
            number_2: []
        },
        hilight_1:{
            object: null,
            isMoving: false,
            stop_x: false,
            end_x: false
        },
        hilight_2:{
            object: null,
            isMoving: false,
            stop_x: false,
            end_x: false
        },
        hilight_addition:{
            object: null,
            isMoving: false,
            stop_x: false,
            end_x: false
        },
        addingImaginary: 0,
        isAdding: false,
        indexNumber_1: 0,
        indexNumber_2: 0,
        indexAddition: 0
    },
    division: {
        bits: {
            additional: [],
            number_1: [],
            number_2: []
        },
        index: 0,
        currentDivisionNum: 0,
        currentNum_2: 0,
        timeStoper: 0,
        currentY: 0,
        copyLower: false,
        addingCurrNumber: false,
        addingAns: false,
        addingIndex: 0,
        ansBinary: 0,
        hilight:{
            object: null,
            isMoving: false,
            stop_x: false,
            end_x: false
        },
        lineRenderPercent: 0
    }
};

const ANIMATION_NAMES = ["positiveDecToBin", "negativeDecToBin", "floatToBin", "binToDec", "addition", "subtraction", "multiplication", "division"];

EventListeners();
requestAnimationFrame(Animate);

//* ---------- Functions ---------- *//
function Input_IntDecToBin(event, canva_ctx, canBeNegative) {
    let binNumber = "";
    if (IsNumber(event.target.value)) {
        let number = parseInt(event.target.value);
        binNumber = DecToBin_Int(number, canBeNegative);
    }

    let currentList = [];
    if (canBeNegative) currentList = animationState.negativeDecToBin.bits.number;
    else currentList = animationState.positiveDecToBin.bits.number;

    if (currentList.length < binNumber.length) {
        for (let i = currentList.length; i<binNumber.length; i++) {
            let currentBit = binNumber[i];
            let bitBoxSize = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);
            let currentBox = new BitBox(canva_ctx, new Point(0, 0), bitBoxSize, BIT_BOX_PARAM.radius, GetCSSColor('--bitBox-color'), currentBit, true, BIT_BOX_PARAM.glowIntensity);
            currentBox.startAppear(TIME_TO_APPEAR);
            currentList.push(currentBox);
        }
    } else if (currentList.length > binNumber.length) {
        for (let i = binNumber.length; i<currentList.length; i++) currentList[i].startDelete(TIME_TO_DISAPPEAR);
    }

    let currentPoint = new Point(BIT_BOX_PARAM.offset*2, BIT_BOX_PARAM.offset*2);

    for (let i = 0; i<currentList.length; i++) {
        let currentBox = currentList[i], textIndex = Math.min(binNumber.length-1, i);
        currentBox.position = currentPoint.clone;
        currentPoint.x += BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;

        if (currentBox.isDeletingAnimation) {
            if (currentList.length != binNumber.length) continue;
            else currentBox.changeText(currentBox.text, TIME_TO_CHANGE_SIZE);
        }

        if ((currentBox.text == binNumber[textIndex] && currentBox.nextText == binNumber[textIndex]) || (currentBox.text != binNumber[textIndex] && currentBox.nextText == binNumber[textIndex])) continue;

        currentBox.changeText(binNumber[textIndex], TIME_TO_CHANGE_SIZE);
        currentList[i] = currentBox;
    }
}

function Input_IntBinToDec(event, canva_ctx,) {
    event.target.value = event.target.value.replace(/[^01]/g, '');
    let binNumber = BinToDec_Int(event.target.value, true).toString();

    if (animationState.binToDec.bits.numbers.length < binNumber.length) {
        for (let i = animationState.binToDec.bits.numbers.length; i<binNumber.length; i++) {
            let currentBit = binNumber[i];
            let bitBoxSize = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);
            let currentBox = new BitBox(canva_ctx, new Point(0, 0), bitBoxSize, BIT_BOX_PARAM.radius, GetCSSColor('--bitBox-color'), currentBit, true, BIT_BOX_PARAM.glowIntensity);
            currentBox.startAppear(TIME_TO_APPEAR);
            animationState.binToDec.bits.numbers.push(currentBox);
        }
    } else if (animationState.binToDec.bits.numbers.length > binNumber.length) {
        for (let i = binNumber.length; i<animationState.binToDec.bits.numbers.length; i++) animationState.binToDec.bits.numbers[i].startDelete(TIME_TO_DISAPPEAR);
    }

    let currentPoint = new Point(BIT_BOX_PARAM.offset*2, BIT_BOX_PARAM.offset*2);

    for (let i = 0; i<animationState.binToDec.bits.numbers.length; i++) {
        let currentBox = animationState.binToDec.bits.numbers[i], textIndex = Math.min(binNumber.length-1, i);
        currentBox.position = currentPoint.clone;
        currentPoint.x += BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;

        if (currentBox.isDeletingAnimation) {
            if (animationState.binToDec.bits.numbers.length != binNumber.length) continue;
            else currentBox.changeText(currentBox.text, TIME_TO_CHANGE_SIZE);
        }

        if ((currentBox.text == binNumber[textIndex] && currentBox.nextText == binNumber[textIndex]) || (currentBox.text != binNumber[textIndex] && currentBox.nextText == binNumber[textIndex])) continue;

        currentBox.changeText(binNumber[textIndex], TIME_TO_CHANGE_SIZE);
        animationState.binToDec.bits.numbers[i] = currentBox;
    }
}

function Input_FloatDecToBin(event, canva_ctx) {
    let floatBinary = DecToBin_FloatPoint(parseFloat(event.target.value), "float");

    let currentList = animationState.floatToBin.bits.number;
    if (currentList.length < floatBinary.length) {
        for (let i = currentList.length; i<floatBinary.length; i++) {
            let currentBit = floatBinary[i];
            let boxColor = BitColor(i, floatBinary.length);
            let bitBoxSize = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);
            let currentBox = new BitBox(canva_ctx, new Point(0, 0), bitBoxSize, BIT_BOX_PARAM.radius, boxColor, currentBit, true, BIT_BOX_PARAM.glowIntensity);
            currentBox.startAppear(TIME_TO_APPEAR);
            currentList.push(currentBox);
        }
    } else if (currentList.length > floatBinary.length) {
        for (let i = floatBinary.length; i<currentList.length; i++) currentList[i].startDelete(TIME_TO_DISAPPEAR);
    }

    let currentPoint = new Point(BIT_BOX_PARAM.offset*2, BIT_BOX_PARAM.offset*2);

    for (let i = 0; i<currentList.length; i++) {
        let currentBox = currentList[i], textIndex = Math.min(floatBinary.length-1, i);
        currentBox.position = currentPoint.clone;
        currentPoint.x += BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;

        if (currentBox.isDeletingAnimation) {
            if (currentList.length != floatBinary.length) continue;
            else currentBox.changeText(currentBox.text, TIME_TO_CHANGE_SIZE);
        }

        if ((currentBox.text == floatBinary[textIndex] && currentBox.nextText == floatBinary[textIndex]) || (currentBox.text != floatBinary[textIndex] && currentBox.nextText == floatBinary[textIndex])) continue;

        currentBox.changeText(floatBinary[textIndex], TIME_TO_CHANGE_SIZE);
        currentList[i] = currentBox;
    }
}

function Addition() {
    let current_boxPosition = animationState.addition.hilight.object.position;

    if (animationState.addition.hilight.isMoving) {
        if (animationState.addition.timeStoper < TIME_TO_STOP) {
            animationState.addition.timeStoper++;
            return;
        }

        current_boxPosition.x += MOVING_BOX_SPEED;

        if (current_boxPosition.x <= animationState.addition.hilight.stop_x) {
            animationState.addition.hilight.isMoving = false;
            current_boxPosition.x = animationState.addition.hilight.stop_x;
        } else if (animationState.addition.hilight.stop_x < animationState.addition.hilight.end_x) {
            animationState.addition.hilight.object.startDelete(TIME_TO_DISAPPEAR);
            animationState.addition.isPlaying = false;

            INPUT_ADDITION_1.readOnly = false;
            INPUT_ADDITION_2.readOnly = false;
        }
    } else {
        let number_1_index = animationState.addition.bits.number_1.length - 1 - animationState.addition.index;
        let number_1 = IsOutOfBounds(number_1_index, animationState.addition.bits.number_1);

        let number_2_index = animationState.addition.bits.number_2.length - 1 - animationState.addition.index;
        let number_2 = IsOutOfBounds(number_2_index, animationState.addition.bits.number_2);

        let ans = parseInt(number_1) + parseInt(number_2) + (animationState.addition.imaginary.object != null);
        animationState.addition.imaginary.imaginary = Math.floor(ans/2);

        if (animationState.addition.imaginary.object != null)
            animationState.addition.imaginary.object.startDelete(TIME_TO_DISAPPEAR);

        animationState.addition.imaginary.object = null;

        if (animationState.addition.imaginary.imaginary == 1) {
            ans -= 2;

            if (!(number_1_index == 0 && number_2_index == 0)) {
                let imaginaryBox_point = new Point(animationState.addition.hilight.stop_x - BIT_BOX_PARAM.width, current_boxPosition.y - BIT_BOX_PARAM.height);
                let imaginaryBox_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);

                animationState.addition.imaginary.object = new BitBox(OUTPUT_ADDITION_CTX, imaginaryBox_point, imaginaryBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--imaginary-color'), 1, true, BIT_BOX_PARAM.glowIntensity);
                animationState.addition.imaginary.object.startAppear(TIME_TO_APPEAR);
                animationState.addition.bits.additional.push(animationState.addition.imaginary.object);
            }
        }

        let ansBox_point = new Point(animationState.addition.hilight.stop_x + BIT_BOX_PARAM.offset, current_boxPosition.y + BIT_BOX_PARAM.height * 2 + BIT_BOX_PARAM.offset * 3);
        let ansBot_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);

        let ansBox = new BitBox(OUTPUT_ADDITION_CTX, ansBox_point, ansBot_size, BIT_BOX_PARAM.radius, GetCSSColor('--ansBox-color'), ans.toString(), true, BIT_BOX_PARAM.glowIntensity);
        ansBox.startAppear(TIME_TO_APPEAR);
        animationState.addition.bits.additional.push(ansBox);

        animationState.addition.hilight.isMoving = true;
        animationState.addition.timeStoper = 0;
        animationState.addition.hilight.stop_x -= BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
        animationState.addition.index++;
    }
}

function StartAnimation_Addition() {
    if (animationState.addition.bits.number_1.length <= 0 || animationState.addition.bits.number_2.length <= 0) return;
    if (animationState.addition.isPlaying) return;

    DeleteOperationResult("input_decimalNumberAddition_1");

    INPUT_ADDITION_1.readOnly = true;
    INPUT_ADDITION_2.readOnly = true;

    let additionBox_point = new Point(OUTPUT_ADDITION.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset * 3, BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset*2);
    let additionBox_size = new Size(
        BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset*2, 
        BIT_BOX_PARAM.height*2 + BIT_BOX_PARAM.offset*3
    );

    animationState.addition.hilight.object = new BitBox(OUTPUT_ADDITION_CTX, additionBox_point, additionBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--hilight-color'), "", true, BIT_BOX_PARAM.glowIntensity);
    animationState.addition.hilight.object.startAppear(TIME_TO_APPEAR);
    animationState.addition.bits.additional.push(animationState.addition.hilight.object);

    let countOfNumbers = Math.max(animationState.addition.bits.number_1.length, animationState.addition.bits.number_2.length);
    let sign_point = new Point(OUTPUT_ADDITION.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset * 2 - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * countOfNumbers,
        BIT_BOX_PARAM.height*2 + BIT_BOX_PARAM.offset);
    let sign_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);

    let animation_addition_sign = new BitBox(OUTPUT_ADDITION_CTX, sign_point, sign_size, BIT_BOX_PARAM.radius, GetCSSColor('--bitBox-color'), "+", true, BIT_BOX_PARAM.glowIntensity);
    animation_addition_sign.startAppear(TIME_TO_APPEAR);
    animationState.addition.bits.additional.push(animation_addition_sign);

    animationState.addition.isPlaying = true;
    animationState.addition.hilight.isMoving = false;
    animationState.addition.hilight.stop_x = additionBox_point.x;
    animationState.addition.hilight.end_x = additionBox_point.x - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * ( Math.max(animationState.addition.bits.number_1.length, animationState.addition.bits.number_2.length) - 1 );
    animationState.addition.index = 0;
    animationState.addition.imaginary.object = null;
    animationState.addition.timeStoper = 0;
}

function Subtraction() {
    let current_boxPosition = animationState.subtraction.hilight.object.position;

    if (animationState.subtraction.findingNextNumber) {
        current_boxPosition = animationState.subtraction.imaginary.object.position;

        if (animationState.subtraction.imaginary.isMoving) {
            current_boxPosition.x += MOVING_BOX_SPEED * 2 * animationState.subtraction.imaginary.direction;

            if ((current_boxPosition.x < animationState.subtraction.imaginary.stop_x && animationState.subtraction.imaginary.direction == 1) ||
                (current_boxPosition.x > animationState.subtraction.imaginary.stop_x && animationState.subtraction.imaginary.direction == -1)) {
                animationState.subtraction.imaginary.isMoving = false;
            }
        } else {
            let number_1_index = animationState.subtraction.bits.number_1.length - 1 - animationState.subtraction.imaginary.index;
            let number_1 = (number_1_index >= 0)?animationState.subtraction.bits.number_1[number_1_index].text : 0;
            
            if (animationState.subtraction.imaginary.direction == 1) {
                let isLastInd = (animationState.subtraction.imaginary.index + 1 == Math.max(animationState.subtraction.bits.number_1.length, animationState.subtraction.bits.number_2.length));
                if (number_1 == 1 || isLastInd) {
                    let imaginaryBox_point = new Point(animationState.subtraction.imaginary.stop_x + BIT_BOX_PARAM.offset, current_boxPosition.y + BIT_BOX_PARAM.offset);
                    let imaginaryBox_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);
                    
                    let imaginaryBox = new BitBox(OUTPUT_SUBTRACTION_CTX, imaginaryBox_point, imaginaryBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--imaginary-color'), (isLastInd)?"1":"0", true, BIT_BOX_PARAM.glowIntensity);
                    animationState.subtraction.bits.imaginary[animationState.subtraction.imaginary.index] = imaginaryBox;
                    imaginaryBox.startAppear(TIME_TO_APPEAR);

                    animationState.subtraction.imaginary.direction *= -1;
                    animationState.subtraction.imaginary.stop_x += BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
                    animationState.subtraction.imaginary.index--;
                } else {
                    animationState.subtraction.imaginary.stop_x -= BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
                    animationState.subtraction.imaginary.index++;
                }
            } else {
                let imaginaryBox_point = new Point(animationState.subtraction.imaginary.stop_x + BIT_BOX_PARAM.offset, current_boxPosition.y + BIT_BOX_PARAM.offset);
                let imaginaryBox_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);
                
                let imaginaryBox = new BitBox(OUTPUT_SUBTRACTION_CTX, imaginaryBox_point.clone, imaginaryBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--imaginary-color'), "1", true, BIT_BOX_PARAM.glowIntensity);
                animationState.subtraction.bits.imaginary[animationState.subtraction.imaginary.index] = imaginaryBox;
                imaginaryBox.startAppear(TIME_TO_APPEAR);

                animationState.subtraction.imaginary.stop_x += BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
                animationState.subtraction.imaginary.index--;

                if(animationState.subtraction.imaginary.index <= animationState.subtraction.index) {
                    imaginaryBox_point.x = animationState.subtraction.hilight.object.position.x + BIT_BOX_PARAM.offset;
                    imaginaryBox_point.y = current_boxPosition.y + BIT_BOX_PARAM.offset;

                    imaginaryBox = new BitBox(OUTPUT_SUBTRACTION_CTX, imaginaryBox_point, imaginaryBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--imaginary-color'), "2", true, 15);
                    animationState.subtraction.bits.imaginary[animationState.subtraction.index] = imaginaryBox;
                    imaginaryBox.startAppear(TIME_TO_APPEAR);

                    animationState.subtraction.imaginary.object.startDelete(TIME_TO_DISAPPEAR);
                    animationState.subtraction.findingNextNumber = false;
                    animationState.subtraction.hilight.isMoving = false;
                }
            }

            animationState.subtraction.imaginary.isMoving = true;
        }
    } else if (animationState.subtraction.hilight.isMoving) {
        if (animationState.subtraction.timeStoper < TIME_TO_STOP) {
            animationState.subtraction.timeStoper++;
            return;
        }
        
        current_boxPosition.x += MOVING_BOX_SPEED;

        if (current_boxPosition.x <= animationState.subtraction.hilight.stop_x) {
            animationState.subtraction.hilight.isMoving = false;
            current_boxPosition.x = animationState.subtraction.hilight.stop_x;
        } else if (animationState.subtraction.hilight.stop_x < animationState.subtraction.hilight.end_x) {
            animationState.subtraction.hilight.object.startDelete(TIME_TO_DISAPPEAR);
            animationState.subtraction.isPlaying = false;

            INPUT_SUBTRACTION_1.readOnly = false;
            INPUT_SUBTRACTION_2.readOnly = false;

            for (let currImaginaryBox of animationState.subtraction.bits.imaginary)
                if (currImaginaryBox != null)
                    currImaginaryBox.startDelete(TIME_TO_DISAPPEAR);
        }
    } else {
        if (animationState.subtraction.imaginary.object != null)
            animationState.subtraction.imaginary.object.startDelete(TIME_TO_DISAPPEAR);

        let number_1_index = animationState.subtraction.bits.number_1.length - 1 - animationState.subtraction.index;
        let number_1 = (animationState.subtraction.bits.imaginary[animationState.subtraction.index] != null) ? 
            animationState.subtraction.bits.imaginary[animationState.subtraction.index].text : 
            IsOutOfBounds(number_1_index, animationState.subtraction.bits.number_1);

        let number_2_index = animationState.subtraction.bits.number_2.length - 1 - animationState.subtraction.index;
        let number_2 = IsOutOfBounds(number_2_index, animationState.subtraction.bits.number_2);

        let ans = parseInt(number_1) - parseInt(number_2);
        
        if (ans < 0) {
            let imaginaryBox_point = new Point(animationState.subtraction.hilight.stop_x - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset, current_boxPosition.y);
            let imaginaryBox_size = new Size(
                BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset*2, 
                BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset*2
            );

            animationState.subtraction.imaginary.object = new BitBox(OUTPUT_SUBTRACTION_CTX, imaginaryBox_point, imaginaryBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--imaginary-color'), "", true, 15);
            animationState.subtraction.imaginary.object.startAppear(TIME_TO_APPEAR);
            animationState.subtraction.bits.additional.push(animationState.subtraction.imaginary.object);

            animationState.subtraction.findingNextNumber = true;
            animationState.subtraction.imaginary.isMoving = false;
            animationState.subtraction.imaginary.index = animationState.subtraction.index+1;
            animationState.subtraction.imaginary.stop_x = imaginaryBox_point.x;
            animationState.subtraction.imaginary.direction = 1;

            return requestAnimationFrame(Subtraction);
        }

        let ansBox_point = new Point(animationState.subtraction.hilight.stop_x + BIT_BOX_PARAM.offset, current_boxPosition.y + BIT_BOX_PARAM.height * 2 + BIT_BOX_PARAM.offset * 3);
        let ansBox_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);

        let ansBox = new BitBox(OUTPUT_SUBTRACTION_CTX, ansBox_point, ansBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--ansBox-color'), ans.toString(), true, BIT_BOX_PARAM.glowIntensity);
        ansBox.startAppear(TIME_TO_APPEAR);
        animationState.subtraction.bits.additional.push(ansBox);

        animationState.subtraction.hilight.isMoving = true;
        animationState.subtraction.timeStoper = 0;
        animationState.subtraction.index++;
        animationState.subtraction.hilight.stop_x -= BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
    }
}

function StartAnimation_Subtraction() {
    if (animationState.subtraction.bits.number_1.length <= 0 || animationState.subtraction.bits.number_2.length <= 0) return;
    if (animationState.subtraction.isPlaying) return;

    DeleteOperationResult("input_decimalNumberSubtraction_1");

    INPUT_SUBTRACTION_1.readOnly = true;
    INPUT_SUBTRACTION_2.readOnly = true;

    let subtractionBox_point = new Point(OUTPUT_SUBTRACTION.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset*3, BIT_BOX_PARAM.offset);
    let subtractionBox_size = new Size(
        BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset*2, 
        BIT_BOX_PARAM.height*2 + BIT_BOX_PARAM.offset*3
    );

    animationState.subtraction.hilight.object = new BitBox(OUTPUT_SUBTRACTION_CTX, subtractionBox_point, subtractionBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--hilight-color'), "", true, BIT_BOX_PARAM.glowIntensity);
    animationState.subtraction.hilight.object.startAppear(TIME_TO_APPEAR);
    animationState.subtraction.bits.additional.push(animationState.subtraction.hilight.object);

    let countOfNumbers = Math.max(animationState.subtraction.bits.number_1.length, animationState.subtraction.bits.number_2.length);
    let sign_point = new Point(OUTPUT_SUBTRACTION.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset * 2 - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * countOfNumbers,
        BIT_BOX_PARAM.height*0.5 + BIT_BOX_PARAM.offset*2.5);
    let sing_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);

    let sign = new BitBox(OUTPUT_SUBTRACTION_CTX, sign_point, sing_size, BIT_BOX_PARAM.radius, GetCSSColor('--bitBox-color'), "-", true, BIT_BOX_PARAM.glowIntensity);
    sign.startAppear(TIME_TO_APPEAR);
    animationState.subtraction.bits.additional.push(sign);

    for (let i = 0; i<64; i++)
        animationState.subtraction.bits.imaginary[i] = null;

    animationState.subtraction.isPlaying = true;
    animationState.subtraction.hilight.isMoving = false;
    animationState.subtraction.findingNextNumber = false;
    animationState.subtraction.timeStoper = 0;
    animationState.subtraction.index = 0;
    animationState.subtraction.hilight.stop_x = subtractionBox_point.x;
    animationState.subtraction.hilight.end_x = subtractionBox_point.x - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * ( Math.max(animationState.subtraction.bits.number_1.length, animationState.subtraction.bits.number_2.length) - 1 );
}

function Multiplication() {
    let current_boxPosition = animationState.multiplication.hilight_1.object.position;
    if (animationState.multiplication.hilight_2.isMoving) {
        current_boxPosition = animationState.multiplication.hilight_2.object.position;
        
        current_boxPosition.x += MOVING_BOX_SPEED * 2;

        if (current_boxPosition.x <= animationState.multiplication.hilight_2.stop_x) {
            animationState.multiplication.hilight_2.isMoving = false;
            animationState.multiplication.hilight_1.stop_x = OUTPUT_MULTIPLICATION.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset*2;
            current_boxPosition.x = animationState.multiplication.hilight_2.stop_x;
            animationState.multiplication.hilight_1.isMoving = true;
            animationState.multiplication.indexNumber_1 = 0;

            let animationBox_point = new Point(OUTPUT_MULTIPLICATION.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset*2, BIT_BOX_PARAM.offset);
            let animationBox_size = new Size(
                BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset*2,
                BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset*2
            );

            animationState.multiplication.hilight_1.object = new BitBox(OUTPUT_MULTIPLICATION_CTX, animationBox_point, animationBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--hilight-color'), "", true, BIT_BOX_PARAM.glowIntensity);
            animationState.multiplication.hilight_1.object.startAppear(TIME_TO_APPEAR);
            animationState.multiplication.bits.additional.push(animationState.multiplication.hilight_1.object);
        }

        if (animationState.multiplication.hilight_2.stop_x < animationState.multiplication.hilight_2.end_x) {
            animationState.multiplication.hilight_2.object.startDelete(TIME_TO_DISAPPEAR);
            animationState.multiplication.hilight_2.isMoving = false;
            animationState.multiplication.isAdding = true;

            let animationBox_point = new Point(OUTPUT_MULTIPLICATION.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset*3, BIT_BOX_PARAM.height*2 + BIT_BOX_PARAM.offset*3);
            let animationBox_size = new Size(
                BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset*2,
                (BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset) * animationState.multiplication.bits.number_1.length + BIT_BOX_PARAM.offset
            );

            animationState.multiplication.hilight_addition.object = new BitBox(OUTPUT_MULTIPLICATION_CTX, animationBox_point, animationBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--hilight-color'), "", true, BIT_BOX_PARAM.glowIntensity);
            animationState.multiplication.hilight_addition.object.startAppear(TIME_TO_APPEAR);
            animationState.multiplication.bits.additional.reverse();
            animationState.multiplication.bits.additional.push(animationState.multiplication.hilight_addition.object);
            animationState.multiplication.bits.additional.reverse();

            animationState.multiplication.hilight_addition.stop_x = animationBox_point.x;
            animationState.multiplication.hilight_addition.end_x = animationBox_point.x - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * (animationState.multiplication.bits.number_1.length + animationState.multiplication.bits.number_2.length - 1);

            animationState.multiplication.indexAddition = 0;
            animationState.multiplication.addingImaginary = 0;
            animationState.multiplication.hilight_addition.isMoving = false;
        }
    } else if (animationState.multiplication.hilight_1.isMoving) {
        current_boxPosition = animationState.multiplication.hilight_1.object.position;
        
        current_boxPosition.x += MOVING_BOX_SPEED*2;

        if (current_boxPosition.x <= animationState.multiplication.hilight_1.stop_x) {
            animationState.multiplication.hilight_1.isMoving = false;
            current_boxPosition.x = animationState.multiplication.hilight_1.stop_x;
        }

        if (animationState.multiplication.hilight_1.stop_x < animationState.multiplication.hilight_1.end_x) {
            animationState.multiplication.hilight_1.object.startDelete(TIME_TO_DISAPPEAR);
            animationState.multiplication.hilight_2.isMoving = true;
            animationState.multiplication.hilight_1.isMoving = false;
            animationState.multiplication.hilight_2.stop_x -= BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
            animationState.multiplication.indexNumber_2++;
        }
    } else if (animationState.multiplication.isAdding) {
        current_boxPosition = animationState.multiplication.hilight_addition.object.position;

        if (animationState.multiplication.hilight_addition.isMoving) {
            current_boxPosition.x += MOVING_BOX_SPEED;
    
            if (current_boxPosition.x <= animationState.multiplication.hilight_addition.stop_x) {
                animationState.multiplication.hilight_addition.isMoving = false;
                current_boxPosition.x = animationState.multiplication.hilight_addition.stop_x;
            }
            if (animationState.multiplication.hilight_addition.stop_x < animationState.multiplication.hilight_addition.end_x) {
                animationState.multiplication.hilight_addition.object.startDelete(TIME_TO_DISAPPEAR);
                animationState.multiplication.isPlaying = false;

                INPUT_MULTIPLICATION_1.readOnly = false;
                INPUT_MULTIPLICATION_2.readOnly = false;
            }
        } else {
            let currAns = parseInt(animationState.multiplication.addingImaginary);
            let currentGetInd = 2 + animationState.multiplication.indexAddition + (animationState.multiplication.indexAddition == 0);
            let skipNumbers = animationState.multiplication.indexAddition <= animationState.multiplication.bits.number_1.length - 1 ? 0 : animationState.multiplication.indexAddition - animationState.multiplication.bits.number_1.length + 1;
            for (let currTempNumber = 0; currTempNumber <= Math.min(animationState.multiplication.indexAddition, animationState.multiplication.bits.number_2.length - 1); currTempNumber++) {
                let number = 0;

                if (skipNumbers <= 0 && currTempNumber < animationState.multiplication.bits.number_2.length)
                    number = animationState.multiplication.bits.additional[currentGetInd].text;
                
                currentGetInd += animationState.multiplication.bits.number_1.length - 1;

                if (skipNumbers > 0) skipNumbers--;

                currAns += parseInt(number);
            }

            let ans = parseInt(currAns) % 2;

            let startY = BIT_BOX_PARAM.height*2 + BIT_BOX_PARAM.offset*4;
            let ans_point = new Point(animationState.multiplication.hilight_addition.stop_x + BIT_BOX_PARAM.offset,
                startY + (BIT_BOX_PARAM.height+BIT_BOX_PARAM.offset) * animationState.multiplication.indexNumber_2);
            let ans_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);

            let ansBox = new BitBox(OUTPUT_MULTIPLICATION_CTX, ans_point, ans_size, BIT_BOX_PARAM.radius, GetCSSColor('--ansBox-color'), ans.toString(), true, BIT_BOX_PARAM.glowIntensity);
            ansBox.startAppear(TIME_TO_APPEAR);
            animationState.multiplication.bits.additional.push(ansBox);

            animationState.multiplication.addingImaginary = Math.floor(currAns / 2);
            animationState.multiplication.indexAddition++;
            animationState.multiplication.hilight_addition.stop_x -= BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
            animationState.multiplication.hilight_addition.isMoving = true;
        }
    } else {
        let number_1_index = animationState.multiplication.bits.number_1.length - 1 - animationState.multiplication.indexNumber_1;
        let number_1 = IsOutOfBounds(number_1_index, animationState.multiplication.bits.number_1);

        let number_2_index = animationState.multiplication.bits.number_2.length - 1 - animationState.multiplication.indexNumber_2;
        let number_2 = IsOutOfBounds(number_2_index, animationState.multiplication.bits.number_2);

        let ans = parseInt(number_1) * parseInt(number_2);

        let startX = OUTPUT_MULTIPLICATION.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset*2,
            startY = BIT_BOX_PARAM.height*2 + BIT_BOX_PARAM.offset*4;
        let tempAns_point = new Point(startX - (BIT_BOX_PARAM.height+BIT_BOX_PARAM.offset) * (animationState.multiplication.indexNumber_2 + animationState.multiplication.indexNumber_1),
            startY + (BIT_BOX_PARAM.height+BIT_BOX_PARAM.offset) * animationState.multiplication.indexNumber_2);
        let tempAns_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);

        let tempAnsBox = new BitBox(OUTPUT_MULTIPLICATION_CTX, tempAns_point, tempAns_size, BIT_BOX_PARAM.radius, GetCSSColor('--imaginary-color'), ans.toString(), true, BIT_BOX_PARAM.glowIntensity);
        tempAnsBox.startAppear(TIME_TO_APPEAR);
        animationState.multiplication.bits.additional.push(tempAnsBox);

        animationState.multiplication.indexNumber_1++;
        animationState.multiplication.hilight_1.stop_x -= BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
        animationState.multiplication.hilight_1.isMoving = true;
    }
}

function StartAnimation_Multiplication() {
    if (animationState.multiplication.bits.number_1.length <= 0 || animationState.multiplication.bits.number_2.length <= 0) return;
    if (animationState.multiplication.isPlaying) return;

    DeleteOperationResult("input_decimalNumberMultiplication_1");

    INPUT_MULTIPLICATION_1.readOnly = true;
    INPUT_MULTIPLICATION_2.readOnly = true;

    let muliplicationBox_point = new Point(OUTPUT_MULTIPLICATION.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset*3, BIT_BOX_PARAM.offset);
    let muliplicationBox_size = new Size(
        BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset*2, 
        BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset*2
    );

    animationState.multiplication.hilight_1.object = new BitBox(OUTPUT_MULTIPLICATION_CTX, muliplicationBox_point.clone, muliplicationBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--hilight-color'), "", true, BIT_BOX_PARAM.glowIntensity);
    animationState.multiplication.hilight_1.object.startAppear(TIME_TO_APPEAR);
    animationState.multiplication.bits.additional.push(animationState.multiplication.hilight_1.object);

    muliplicationBox_point.y = BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset*2;

    animationState.multiplication.hilight_2.object = new BitBox(OUTPUT_MULTIPLICATION_CTX, muliplicationBox_point, muliplicationBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--hilight-color'), "", true, BIT_BOX_PARAM.glowIntensity);
    animationState.multiplication.hilight_2.object.startAppear(TIME_TO_APPEAR);
    animationState.multiplication.bits.additional.push(animationState.multiplication.hilight_2.object);

    let countOfNumbers = Math.max(animationState.multiplication.bits.number_1.length, animationState.multiplication.bits.number_2.length);
    let sign_point = new Point(OUTPUT_MULTIPLICATION.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset * 2 - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * countOfNumbers,
        BIT_BOX_PARAM.height*0.5 + BIT_BOX_PARAM.offset*2.5);
    let sign_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);

    let animation_multiplication_sign = new BitBox(OUTPUT_MULTIPLICATION_CTX, sign_point, sign_size, BIT_BOX_PARAM.radius, GetCSSColor('--bitBox-color'), "×", true, BIT_BOX_PARAM.glowIntensity);
    animation_multiplication_sign.startAppear(TIME_TO_APPEAR);
    animationState.multiplication.bits.additional.push(animation_multiplication_sign);

    let windowHeight = (animationState.multiplication.bits.number_2.length + 3) * (BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset) + BIT_BOX_PARAM.offset*3
    CanvasResize(OUTPUT_MULTIPLICATION, WINDOW_SIZE.multiplication.width, windowHeight, TIME_TO_SCALE, changingCount, Animate);

    animationState.multiplication.isPlaying = true;
    animationState.multiplication.hilight_1.isMoving = false;
    animationState.multiplication.hilight_2.isMoving = false;
    animationState.multiplication.isAdding = false;
    animationState.multiplication.indexNumber_1 = 0;
    animationState.multiplication.indexNumber_2 = 0;
    animationState.multiplication.indexAddition = 0;
    animationState.multiplication.hilight_addition.object = null
    animationState.multiplication.hilight_addition.stop_x = 0;
    animationState.multiplication.hilight_addition.end_x = 0;
    animationState.multiplication.hilight_1.stop_x = muliplicationBox_point.x;
    animationState.multiplication.hilight_1.end_x = muliplicationBox_point.x - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * ( animationState.multiplication.bits.number_1.length - 1 );
    animationState.multiplication.hilight_2.stop_x = muliplicationBox_point.x;
    animationState.multiplication.hilight_2.end_x = muliplicationBox_point.x - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * ( animationState.multiplication.bits.number_2.length - 1 );
}

function Division() {
    let current_boxPosition = animationState.division.hilight.object.position;

    if (animationState.division.hilight.isMoving) {
        if (animationState.division.timeStoper < TIME_TO_STOP) {
            animationState.division.timeStoper++;
            return;
        }

        current_boxPosition.x += -MOVING_BOX_SPEED;

        if (current_boxPosition.x >= animationState.division.hilight.stop_x) {
            animationState.division.hilight.isMoving = false;
            current_boxPosition.x = animationState.division.hilight.stop_x;
        }
        if (animationState.division.hilight.stop_x >= animationState.division.hilight.end_x) {
            animationState.division.hilight.object.startDelete(TIME_TO_DISAPPEAR);
            animationState.division.isPlaying = false;

            INPUT_DIVISION_1.readOnly = false;
            INPUT_DIVISION_2.readOnly = false;
        }
    } else {
        if (animationState.division.addingCurrNumber) {
            let currChar = animationState.division.bits.number_2[animationState.division.addingIndex].text;
            let imaginatyBox_point = new Point(current_boxPosition.x + BIT_BOX_PARAM.offset - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * (animationState.division.bits.number_2.length - 1 - animationState.division.addingIndex),
                animationState.division.currentY);
            let imaginatyBox_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);

            let imaginatyBox = new BitBox(OUTPUT_DIVISION_CTX, imaginatyBox_point, imaginatyBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--imaginary-color'), currChar, true, BIT_BOX_PARAM.glowIntensity);
            imaginatyBox.startAppear(TIME_TO_APPEAR);
            animationState.division.bits.additional.push(imaginatyBox);
            animationState.division.addingIndex--;
            
            if (animationState.division.addingIndex < 0)  {
                animationState.division.addingAns = true;
                animationState.division.addingCurrNumber = false;
                animationState.division.addingIndex = animationState.division.ansBinary.length - 1;
                
                animationState.division.currentY += BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset;
            }

            return requestAnimationFrame(Division);
        } else if (animationState.division.addingAns) {
            let currChar = animationState.division.ansBinary[animationState.division.addingIndex];
            let imaginatyBox_point = new Point(current_boxPosition.x + BIT_BOX_PARAM.offset - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * (animationState.division.ansBinary.length - 1 - animationState.division.addingIndex),
                animationState.division.currentY);
            let imaginatyBox_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);
            
            let imaginatyBox = new BitBox(OUTPUT_DIVISION_CTX, imaginatyBox_point, imaginatyBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--imaginary-color'), currChar, true, BIT_BOX_PARAM.glowIntensity);
            imaginatyBox.startAppear(TIME_TO_APPEAR);
            animationState.division.bits.additional.push(imaginatyBox);

            animationState.division.addingIndex--;

            if (animationState.division.addingIndex < 0)  {
                animationState.division.addingAns = false;
                animationState.division.addingCurrNumber = false;
                animationState.division.hilight.isMoving = true;

                animationState.division.timeStoper = 0;
                animationState.division.index++;
                animationState.division.hilight.stop_x += BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
            }

            return requestAnimationFrame(Division);
        }

        animationState.division.currentDivisionNum *= 2;
        animationState.division.currentDivisionNum += parseInt(animationState.division.bits.number_1[animationState.division.index].text);
        
        if (animationState.division.copyLower) {
            let currChar = animationState.division.bits.number_1[animationState.division.index].text;
            let imaginatyBox_point = new Point(current_boxPosition.x + BIT_BOX_PARAM.offset, animationState.division.currentY);
            let imaginatyBox_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);

            let imaginatyBox = new BitBox(OUTPUT_DIVISION_CTX, imaginatyBox_point, imaginatyBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--imaginary-color'), currChar, true, BIT_BOX_PARAM.glowIntensity);
            imaginatyBox.startAppear(TIME_TO_APPEAR);
            animationState.division.bits.additional.push(imaginatyBox);
        }

        let ansBox;
        let ansBox_point = new Point(OUTPUT_DIVISION.width - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset)*(animationState.division.bits.number_1.length - animationState.division.index) - BIT_BOX_PARAM.offset,
            BIT_BOX_PARAM.offset*5 + BIT_BOX_PARAM.width);
        let ansBox_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);
        
        if (animationState.division.currentDivisionNum >= animationState.division.currentNum_2) {
            ansBox = new BitBox(OUTPUT_DIVISION_CTX, ansBox_point, ansBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--ansBox-color'), "1", true, BIT_BOX_PARAM.glowIntensity);
            ansBox.startAppear(TIME_TO_APPEAR);
            animationState.division.bits.additional.push(ansBox);
            
            animationState.division.currentDivisionNum -= animationState.division.currentNum_2;
            animationState.division.currentY += BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset;

            animationState.division.ansBinary = DecToBin_Int(animationState.division.currentDivisionNum);
            animationState.division.addingCurrNumber = true;
            animationState.division.addingIndex = animationState.division.bits.number_2.length - 1;

            animationState.division.copyLower = true;
            return requestAnimationFrame(Division);
        } else {
            ansBox = new BitBox(OUTPUT_DIVISION_CTX, ansBox_point, ansBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--ansBox-color'), "0", true, BIT_BOX_PARAM.glowIntensity);
            ansBox.startAppear(TIME_TO_APPEAR);
            animationState.division.bits.additional.push(ansBox);
        }

        animationState.division.hilight.isMoving = true;
        animationState.division.timeStoper = 0;
        animationState.division.index++;
        animationState.division.hilight.stop_x += BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
    }
}

function StartAnimation_Division() {
    if (animationState.division.bits.number_1.length <= 0 || animationState.division.bits.number_2.length <= 0) return;
    if (animationState.division.isPlaying) return;

    if (INPUT_DIVISION_2.value == "0") return;

    DeleteOperationResult("input_decimalNumberDivision_1");

    INPUT_DIVISION_1.readOnly = true;
    INPUT_DIVISION_2.readOnly = true;

    let lenOfNumbers = Math.max(animationState.division.bits.number_1.length, 8) + Math.max(animationState.division.bits.number_2.length, 8);
    let divisionBox_point = new Point(OUTPUT_DIVISION.width - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset)*lenOfNumbers - BIT_BOX_PARAM.offset * 3, BIT_BOX_PARAM.offset*2);
    let divisionBox_size = new Size(
        BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset*2, 
        BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset*2
    );

    animationState.division.hilight.object = new BitBox(OUTPUT_DIVISION_CTX, divisionBox_point, divisionBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--hilight-color'), "", true, BIT_BOX_PARAM.glowIntensity);
    animationState.division.hilight.object.startAppear(TIME_TO_APPEAR);
    animationState.division.bits.additional.push(animationState.division.hilight.object);

    let countOfOperations = 0, currNum2 = parseInt(INPUT_DIVISION_2.value), currNum = 0;

    for (let currInd = 0; currInd<animationState.division.bits.number_1.length; currInd++) {
        currNum *= 2;
        currNum += parseInt(animationState.division.bits.number_1[currInd].text);

        if (currNum >= currNum2) {
            countOfOperations++;
            currNum -= currNum2;
        }
    }

    let windowHeight = Math.max(WINDOW_SIZE.division.height, (BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset) * (countOfOperations * 2 + 1) + BIT_BOX_PARAM.offset*3);
    CanvasResize(OUTPUT_DIVISION, WINDOW_SIZE.division.width, windowHeight, TIME_TO_SCALE, changingCount, Animate);

    animationState.division.isPlaying = true;
    animationState.division.copyLower = false;
    animationState.division.currentDivisionNum = 0;
    animationState.division.currentNum_2 = parseInt(INPUT_DIVISION_2.value);
    animationState.division.index = 0;
    animationState.division.timeStoper = 0;
    animationState.division.currentY = BIT_BOX_PARAM.offset*3;

    animationState.division.hilight.object.isMoving = false;
    animationState.division.hilight.isMoving = false;
    animationState.division.hilight.stop_x = divisionBox_point.x;
    animationState.division.hilight.end_x = divisionBox_point.x + (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * animationState.division.bits.number_1.length;
}

function Animate(currentTime, repeat = true) {
    if (repeat && changingCount.counter > 0) return requestAnimationFrame(Animate);

    if (animationState.addition.isPlaying) Addition();
    if (animationState.subtraction.isPlaying) Subtraction();
    if (animationState.multiplication.isPlaying) Multiplication();
    if (animationState.division.isPlaying) Division();

    for (let currentCanva of Object.values(OUTPUT_CTX))
        if (currentCanva.visible)
            ClearCanvasWithTransforms(currentCanva.ctx, currentCanva.canva, GetCSSColor('--canva-color'));

    UpdateBoxes(ANIMATION_NAMES, OUTPUT_CTX, animationState, currentTime);

    if (animationState.division.bits.number_1.length > 0 || animationState.division.bits.number_2.length > 0) {
        if (animationState.division.lineRenderPercent < 1)
            animationState.division.lineRenderPercent += LINE_RENDER_SPEED;
        else animationState.division.lineRenderPercent = 1;
    } else if (animationState.division.lineRenderPercent > 0)
        animationState.division.lineRenderPercent -= LINE_RENDER_SPEED;
    else animationState.division.lineRenderPercent = 0;

    if (animationState.division.lineRenderPercent > 0 && OUTPUT_CTX.division.visible) DrawLine();

    if (repeat) return requestAnimationFrame(Animate);
}

function DrawLine() {
    let lenOfNumbers = Math.max(animationState.division.bits.number_2.length, 8);
    let lineX = OUTPUT_DIVISION.width - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset)*lenOfNumbers - BIT_BOX_PARAM.offset * 2;
    let lineXLen = (BIT_BOX_PARAM.offset + BIT_BOX_PARAM.width) * Math.max(animationState.division.bits.number_2.length, 8);

    let offSetLine_1 = lineXLen * animationState.division.lineRenderPercent;
    let offSetLine_2 = (BIT_BOX_PARAM.offset*5 + BIT_BOX_PARAM.height*2) * animationState.division.lineRenderPercent;

    GlowingLine(OUTPUT_DIVISION_CTX, lineX, BIT_BOX_PARAM.offset*4 + BIT_BOX_PARAM.height, 
        lineX + offSetLine_1, BIT_BOX_PARAM.offset*4 + BIT_BOX_PARAM.height, LINE_RENDER_WIDTH, "#ffffff", true, BIT_BOX_PARAM.glowIntensity);
    
    GlowingLine(OUTPUT_DIVISION_CTX, lineX, BIT_BOX_PARAM.offset*2, 
        lineX, BIT_BOX_PARAM.offset + offSetLine_2, LINE_RENDER_WIDTH, "#ffffff", true, BIT_BOX_PARAM.glowIntensity);
}

function EventListeners() {
    INPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE.addEventListener('input', 
        (event) => { Input_Filter(event, false, "int", false); });
    INPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE.addEventListener('input', 
        (event) => { Input_IntDecToBin(event, OUTPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE_CTX, false); });

    INPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE.addEventListener('input', 
        (event) => { Input_IntDecToBin(event, OUTPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE_CTX, true); });
    
    INPUT_BINARY_TO_DECIMAL.addEventListener('input', 
        (event) => { Input_IntBinToDec(event, OUTPUT_BINARY_TO_DECIMAL_CTX); });

    INPUT_FLOAT_TO_BINARY_NUMBER.addEventListener('input', 
            (event) => { Input_Filter(event, true, "float"); });
    INPUT_FLOAT_TO_BINARY_NUMBER.addEventListener('input', 
        (event) => { Input_FloatDecToBin(event, OUTPUT_FLOAT_TO_BINARY_NUMBER_CTX); });

    INPUT_ADDITION_1.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_ADDITION_2.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_ADDITION_1.addEventListener('input', AddBit);
    INPUT_ADDITION_2.addEventListener('input', AddBit);
    BUTTON_ADDITION.addEventListener('click', StartAnimation_Addition);

    INPUT_SUBTRACTION_1.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_SUBTRACTION_2.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_SUBTRACTION_1.addEventListener('input', AddBit);
    INPUT_SUBTRACTION_2.addEventListener('input', AddBit);
    BUTTON_SUBTRACTION.addEventListener('click', StartAnimation_Subtraction);

    INPUT_MULTIPLICATION_1.addEventListener('input', 
        (event) => { Input_Filter(event, false, "short"); });
    INPUT_MULTIPLICATION_2.addEventListener('input', 
        (event) => { Input_Filter(event, false, "short"); });
    INPUT_MULTIPLICATION_1.addEventListener('input', AddBit);
    INPUT_MULTIPLICATION_2.addEventListener('input', AddBit);
    BUTTON_MULTIPLICATION.addEventListener('click', StartAnimation_Multiplication);

    INPUT_DIVISION_1.addEventListener('input', 
        (event) => { Input_Filter(event, false, "char"); });
    INPUT_DIVISION_2.addEventListener('input', 
        (event) => { Input_Filter(event, false, "char"); });
    INPUT_DIVISION_1.addEventListener('input', AddBit);
    INPUT_DIVISION_2.addEventListener('input', AddBit);
    BUTTON_DIVISION.addEventListener('click', StartAnimation_Division);
}

function AddBit(event) {
    DeleteOperationResult(this.id);

    let binNumber = "";
    if (IsNumber(event.target.value)) {
        let number = parseInt(event.target.value);
        binNumber = DecToBin_Int(number);
    }

    let currentList = InputList(this.id);
    const CANVA_AND_CTX = GetCanvaAndCtx(this.id);
    const SETTINGS = GetCurrentSettings(this.id, CANVA_AND_CTX.canva, currentList.length, binNumber.length);

    if (currentList.length < binNumber.length) {
        for (let i = currentList.length; i<binNumber.length; i++) {
            let currentBit = binNumber[binNumber.length - i - 1];
            let currentBoxSize = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);

            let currentBox = new BitBox(CANVA_AND_CTX.ctx, new Point(0, 0), currentBoxSize, BIT_BOX_PARAM.radius, GetCSSColor('--bitBox-color'), currentBit, true, BIT_BOX_PARAM.glowIntensity);
            currentBox.startAppear(TIME_TO_APPEAR);
            currentList.unshift(currentBox);
        }
    } else if (currentList.length > binNumber.length) {
        let endInd = currentList.length - binNumber.length;
        if (SETTINGS.reverse) currentList.reverse();

        for (let i = 0; i<endInd; i++) currentList[i].startDelete(TIME_TO_DISAPPEAR);

        if (SETTINGS.reverse) currentList.reverse();
    }
    
    let startLoop = SETTINGS.startLoop, endLoop = SETTINGS.endLoop;
    let currentPoint = SETTINGS.point;

    for (let i = startLoop; i != endLoop; i += SETTINGS.direction) {
        let currentBox = currentList[i], textIndex = Math.max(0, binNumber.length - 1 - (currentList.length - 1 - i));
        currentBox.position = currentPoint.clone;
        currentPoint.x += (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * SETTINGS.direction;

        if (currentBox.isDeletingAnimation) {
            if (currentList.length != binNumber.length) continue;
            else currentBox.changeText(currentBox.text, TIME_TO_CHANGE_SIZE);
        }

        if ((currentBox.text == binNumber[textIndex] && currentBox.nextText == binNumber[textIndex]) || (currentBox.text != binNumber[textIndex] && currentBox.nextText == binNumber[textIndex])) continue;

        currentBox.changeText(binNumber[textIndex], TIME_TO_CHANGE_SIZE);
    }
}

function GetCurrentSettings(inputID, canva, listLen, binNumberLen) {
    if (inputID == "input_decimalNumberDivision_1" || inputID == "input_decimalNumberDivision_2") {
        let lenOfNumbers = Math.max(animationState.division.bits.number_1.length, 8) + Math.max(animationState.division.bits.number_2.length, 8);
        let currentPoint = new Point(OUTPUT_DIVISION.width - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset)*lenOfNumbers - BIT_BOX_PARAM.offset*2,
            BIT_BOX_PARAM.offset*3);

        if (inputID == "input_decimalNumberDivision_2")
            currentPoint.x += BIT_BOX_PARAM.offset + (BIT_BOX_PARAM.offset + BIT_BOX_PARAM.width) * Math.max(animationState.division.bits.number_1.length, 8);

        return {"point": currentPoint, "direction": 1, "startLoop": 0, "endLoop": Math.max(listLen, binNumberLen), "reverse": true};
    } else if (inputID == "input_decimalNumberSubtraction_1" || inputID == "input_decimalNumberSubtraction_2") {
        let currentPoint = new Point(canva.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset * 2,
            BIT_BOX_PARAM.offset * 2);

        if (SecondNumber(inputID)) currentPoint.y += BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset;

        return {"point": currentPoint, "direction": -1, "startLoop": Math.max(listLen, binNumberLen) - 1, "endLoop": -1, "reverse": false};
    } else if (inputID == "input_decimalNumberMultiplication_1" || inputID == "input_decimalNumberMultiplication_2") {
        let currentPoint = new Point(canva.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset * 2,
            BIT_BOX_PARAM.offset * 2);

        if (SecondNumber(inputID)) currentPoint.y += BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset;

        return {"point": currentPoint, "direction": -1, "startLoop": Math.max(listLen, binNumberLen) - 1, "endLoop": -1, "reverse": false};
    } else {
        let currentPoint = new Point(canva.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset * 2,
            BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset * 3);

        if (SecondNumber(inputID)) currentPoint.y += BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset;

        return {"point": currentPoint, "direction": -1, "startLoop": Math.max(listLen, binNumberLen) - 1, "endLoop": -1, "reverse": false};
    }
}

function IsOutOfBounds(index, listOfBitBoxes) {
    if (index >= 0 && index < listOfBitBoxes.length) return listOfBitBoxes[index].text;
    return 0;
}

function InputList(inputID) {
    if (inputID == "input_decimalNumberAddition_1") return animationState.addition.bits.number_1;
    else if (inputID == "input_decimalNumberAddition_2") return animationState.addition.bits.number_2;
    else if (inputID == "input_decimalNumberSubtraction_1") return animationState.subtraction.bits.number_1;
    else if (inputID == "input_decimalNumberSubtraction_2") return animationState.subtraction.bits.number_2;
    else if (inputID == "input_decimalNumberMultiplication_1") return animationState.multiplication.bits.number_1;
    else if (inputID == "input_decimalNumberMultiplication_2") return animationState.multiplication.bits.number_2;
    else if (inputID == "input_decimalNumberDivision_1") return animationState.division.bits.number_1;
    else if (inputID == "input_decimalNumberDivision_2") return animationState.division.bits.number_2;

    return null;
}

function SecondNumber(inputID) {
    if (inputID == "input_decimalNumberAddition_2") return true;
    else if (inputID == "input_decimalNumberSubtraction_2") return true;
    else if (inputID == "input_decimalNumberMultiplication_2") return true;
    else if (inputID == "input_decimalNumberDivision_2") return true;

    return false;
}

function DeleteOperationResult(inputID) {
    if ((inputID == "input_decimalNumberAddition_1" || inputID == "input_decimalNumberAddition_2"))
        for (let currBox of animationState.addition.bits.additional)
            currBox.startDelete(TIME_TO_DISAPPEAR);
    else if ((inputID == "input_decimalNumberSubtraction_1" || inputID == "input_decimalNumberSubtraction_2"))
        for (let currBox of animationState.subtraction.bits.additional)
            currBox.startDelete(TIME_TO_DISAPPEAR);
    else if ((inputID == "input_decimalNumberMultiplication_1" || inputID == "input_decimalNumberMultiplication_2")) {
        for (let currBox of animationState.multiplication.bits.additional)
            currBox.startDelete(TIME_TO_DISAPPEAR);

        if (OUTPUT_MULTIPLICATION.height != WINDOW_SIZE.multiplication.height)
            CanvasResize(OUTPUT_MULTIPLICATION, WINDOW_SIZE.multiplication.width, WINDOW_SIZE.multiplication.height, TIME_TO_SCALE, changingCount, Animate);
    } else if ((inputID == "input_decimalNumberDivision_1" || inputID == "input_decimalNumberDivision_2")) {
        for (let currBox of animationState.division.bits.additional)
            currBox.startDelete(TIME_TO_DISAPPEAR);
        if (OUTPUT_DIVISION.height != WINDOW_SIZE.division.height)
            CanvasResize(OUTPUT_DIVISION, WINDOW_SIZE.division.width, WINDOW_SIZE.division.height, TIME_TO_SCALE, changingCount, Animate);
    }
}

function GetCanvaAndCtx(inputID) {
    if (inputID == "input_decimalNumberAddition_1" || inputID == "input_decimalNumberAddition_2") return OUTPUT_CTX.addition;
    if (inputID == "input_decimalNumberSubtraction_1" || inputID == "input_decimalNumberSubtraction_2") return OUTPUT_CTX.subtraction;
    if (inputID == "input_decimalNumberMultiplication_1" || inputID == "input_decimalNumberMultiplication_2") return OUTPUT_CTX.multiplication;
    if (inputID == "input_decimalNumberDivision_1" || inputID == "input_decimalNumberDivision_2") return OUTPUT_CTX.division;
}

function BitColor(indexOfBit) {
    const SIGN_BIT = 0, POWER_BITS = 8;

    if (indexOfBit == SIGN_BIT) return GetCSSColor('--float-sign-color');
    else if (indexOfBit <= POWER_BITS) return GetCSSColor('--float-power-color');
    else return GetCSSColor('--float-mantissa-color');
}
