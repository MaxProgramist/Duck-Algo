import { UpdateBoxes, DecToBin_Int, DecToBin_FloatPoint, BinToDec_Int, Input_Filter, IsNumber } from '../utility.js'
import { Point, Size, TextDisplay, ClearCanva, ResizeCanva, DrawGlowingLine, GetCSSColor, ScrollToRight, DrawText, DrawRoundedRect, Effect_Glowing } from '../canvasOperations.js'

//* ---------- Variables ---------- *//

//* -------- HTML Elements -------- *//
const POSITIVE_DECIMAL_TO_BINARY_INPUT  = document.getElementById('input_decimalNumber_positive');
const POSITIVE_DECIMAL_TO_BINARY_OUTPUT = document.getElementById('output_decimalNumber_positive');
const POSITIVE_DECIMAL_TO_BINARY_OUTPUT_CTX = POSITIVE_DECIMAL_TO_BINARY_OUTPUT.getContext("2d");

const DECIMAL_TO_BINARY_INPUT = document.getElementById('input_decimalNumber_negative');
const DECIMAL_TO_BINARY_OUTPUT = document.getElementById('output_decimalNumber_negative');
const DECIMAL_TO_BINARY_OUTPUT_CTX = DECIMAL_TO_BINARY_OUTPUT.getContext("2d");

const BINARY_TO_DECIMAL_INPUT = document.getElementById('input_binToDec');
const BINARY_TO_DECIMAL_OUTPUT = document.getElementById('output_binToDec');
const BINARY_TO_DECIMAL_OUTPUT_CTX = BINARY_TO_DECIMAL_OUTPUT.getContext("2d");

const FLOAT_POINT_TO_BINARY_INPUT = document.getElementById('input_floatNumber');
const FLOAT_POINT_TO_BINARY_OUTPUT = document.getElementById('output_floatNumber');
const FLOAT_POINT_TO_BINARY_OUTPUT_CTX = FLOAT_POINT_TO_BINARY_OUTPUT.getContext("2d");

const ADDITION_INPUT_1 = document.getElementById('input_decimalNumberAddition_1');
const ADDITION_INPUT_2 = document.getElementById('input_decimalNumberAddition_2');
const ADDITION_BUTTON = document.getElementById('button_Addition');
const ADDITION_OUTPUT = document.getElementById('additionAnimation');
const ADDITION_OUTPUT_CTX = ADDITION_OUTPUT.getContext("2d");

const SUBTRACTION_INPUT_1 = document.getElementById('input_decimalNumberSubtraction_1');
const SUBTRACTION_INPUT_2 = document.getElementById('input_decimalNumberSubtraction_2');
const SUBTRACTION_BUTTON = document.getElementById('button_Subtraction');
const SUBTRACTION_OUTPUT = document.getElementById('subtractionAnimation');
const SUBTRACTION_OUTPUT_CTX = SUBTRACTION_OUTPUT.getContext("2d");

const MULTIPLICATION_INPUT_1 = document.getElementById('input_decimalNumberMultiplication_1');
const MULTIPLICATION_INPUT_2 = document.getElementById('input_decimalNumberMultiplication_2');
const MULTIPLICATION_BUTTON = document.getElementById('button_Multiplication');
const MULTIPLICATION_OUTPUT = document.getElementById('multiplicationAnimation');
const MULTIPLICATION_OUTPUT_CTX = MULTIPLICATION_OUTPUT.getContext("2d");

const DIVISION_INPUT_1 = document.getElementById('input_decimalNumberDivision_1');
const DIVISION_INPUT_2 = document.getElementById('input_decimalNumberDivision_2');
const DIVISION_BUTTON = document.getElementById('button_Division');
const DIVISION_OUTPUT = document.getElementById('divisionAnimation');
const DIVISION_OUTPUT_CTX = DIVISION_OUTPUT.getContext("2d");

const OUTPUT_CTX = {
    positiveDecToBin: {ctx: POSITIVE_DECIMAL_TO_BINARY_OUTPUT_CTX, canva: POSITIVE_DECIMAL_TO_BINARY_OUTPUT, visible: true},
    negativeDecToBin: {ctx: DECIMAL_TO_BINARY_OUTPUT_CTX, canva: DECIMAL_TO_BINARY_OUTPUT, visible: true},
    floatToBin: {ctx: FLOAT_POINT_TO_BINARY_OUTPUT_CTX, canva: FLOAT_POINT_TO_BINARY_OUTPUT, visible: true},
    binToDec: {ctx: BINARY_TO_DECIMAL_OUTPUT_CTX, canva: BINARY_TO_DECIMAL_OUTPUT, visible: true},
    addition: {ctx: ADDITION_OUTPUT_CTX, canva: ADDITION_OUTPUT, visible: true},
    subtraction: {ctx: SUBTRACTION_OUTPUT_CTX, canva: SUBTRACTION_OUTPUT, visible: true},
    multiplication: {ctx: MULTIPLICATION_OUTPUT_CTX, canva: MULTIPLICATION_OUTPUT, visible: true},
    division: {ctx: DIVISION_OUTPUT_CTX, canva: DIVISION_OUTPUT, visible: true}
};

window.onload = () => {
    ScrollToRight(ADDITION_OUTPUT.parentElement);
    ScrollToRight(SUBTRACTION_OUTPUT.parentElement);
    ScrollToRight(MULTIPLICATION_OUTPUT.parentElement);
    ScrollToRight(DIVISION_OUTPUT.parentElement);
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

const GLOWING_EFFECT = (drawingCtx, color) => { Effect_Glowing(drawingCtx, color, BIT_BOX_PARAM.glowIntensity); };
const DRAW_TEXT_FUNCTION = (drawingCtx, position, text, fontSize) => { DrawText(drawingCtx, position, text, fontSize, "black") };
const DRAW_TEXT_DISPLAY = (drawingCtx, position, size, color) => {
    const CURRENT_GLOWING_EFFECT = (drawingCtx) => { GLOWING_EFFECT(drawingCtx, color); };
    DrawRoundedRect(drawingCtx, position, size, BIT_BOX_PARAM.radius, color, [CURRENT_GLOWING_EFFECT], []);
}
const DRAW_BIT_BOX_FUNCTION = (drawingCtx, position, size) => {
    const COLOR = GetCSSColor("--bitBox-color");
    DRAW_TEXT_DISPLAY(drawingCtx, position, size, COLOR);
};
const DRAW_HILIGHT_FUNCTION = (drawingCtx, position, size) => {
    const COLOR = GetCSSColor("--hilight-color");
    DRAW_TEXT_DISPLAY(drawingCtx, position, size, COLOR);
};
const DRAW_ANSWER_BOX_FUNCTION = (drawingCtx, position, size) => {
    const COLOR = GetCSSColor("--ansBox-color");
    DRAW_TEXT_DISPLAY(drawingCtx, position, size, COLOR);
};
const DRAW_IMAGINARY_BOX_FUNCTION = (drawingCtx, position, size) => {
    const COLOR = GetCSSColor("--imaginary-color");
    DRAW_TEXT_DISPLAY(drawingCtx, position, size, COLOR);
};

const WINDOW_SIZE = {
    multiplication: {width: 1010, height: 75},
    division: {width: 1010, height: 85},
}

const CANVA_CORNER_RADIUS = 15;

const TIME_TO_APPEAR = 500;
const TIME_TO_DISAPPEAR = 150;
const TIME_TO_CHANGE_SIZE = 500;
const TIME_TO_SCALE = 750;

const MOVING_HILIGHT_SPEED = -2;
const MOVING_IMAGINARY_SPEED = -4;
const TIME_TO_STOP = 15;

const LINE_RENDER_SPEED = 0.125;
const LINE_RENDER_WIDTH = 2.5;

let changingCanvasSizeCounter = {counter: 0};

const ANIMATION_NAMES = ["positiveDecToBin", "negativeDecToBin", "floatToBin", "binToDec", "addition", "subtraction", "multiplication", "division"];

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

EventListeners();
requestAnimationFrame(Animate);

//* ---------- Functions ---------- *//
function DecimalToBinary_Int(event, canvaAndCtx, signed) {
    let binaryNumber = "";
    if (IsNumber(event.target.value)) {
        let parsedNumber = parseInt(event.target.value);
        binaryNumber = DecToBin_Int(parsedNumber, signed, -1);
    }

    let currentBitBoxList = [];
    if (signed) currentBitBoxList = animationState.negativeDecToBin.bits.number;
    else currentBitBoxList = animationState.positiveDecToBin.bits.number;

    if (currentBitBoxList.length < binaryNumber.length)
        for (let currentBitBoxIndex = currentBitBoxList.length; currentBitBoxIndex < binaryNumber.length; currentBitBoxIndex++) {
            let currentBit = binaryNumber[currentBitBoxIndex];
            let bitBoxSize = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);

            let bitBox = new TextDisplay(canvaAndCtx, new Point(0, 0), bitBoxSize, currentBit, DRAW_TEXT_FUNCTION, DRAW_BIT_BOX_FUNCTION);
            bitBox.startAppear(TIME_TO_APPEAR);
            currentBitBoxList.push(bitBox);
        }
    else if (currentBitBoxList.length > binaryNumber.length)
        for (let currentBitBoxIndex = binaryNumber.length; currentBitBoxIndex<currentBitBoxList.length; currentBitBoxIndex++)
            currentBitBoxList[currentBitBoxIndex].startDelete(TIME_TO_DISAPPEAR);

    let currentPoint = new Point(BIT_BOX_PARAM.offset*2, BIT_BOX_PARAM.offset*2);

    for (let currentBitBoxIndex = 0; currentBitBoxIndex < currentBitBoxList.length; currentBitBoxIndex++) {
        let currentBox = currentBitBoxList[currentBitBoxIndex], textIndex = Math.min(binaryNumber.length-1, currentBitBoxIndex);
        currentBox.position = currentPoint.clone;
        currentPoint.x += BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;

        if (currentBox.isDeletingAnimation) {
            if (currentBitBoxList.length != binaryNumber.length) continue;
            else currentBox.changeText(currentBox.text, TIME_TO_CHANGE_SIZE);
        }

        if ((currentBox.text == binaryNumber[textIndex] && currentBox.nextText == binaryNumber[textIndex]) || (currentBox.text != binaryNumber[textIndex] && currentBox.nextText == binaryNumber[textIndex])) continue;

        currentBox.changeText(binaryNumber[textIndex], TIME_TO_CHANGE_SIZE);
        currentBitBoxList[currentBitBoxIndex] = currentBox;
    }
}

function BinaryToDecimal_Int(event, canva_ctx) {
    event.target.value = event.target.value.replace(/[^01]/g, '');
    let binNumber = BinToDec_Int(event.target.value, true).toString();

    if (animationState.binToDec.bits.numbers.length < binNumber.length) {
        for (let currentBitBoxIndex = animationState.binToDec.bits.numbers.length; currentBitBoxIndex < binNumber.length; currentBitBoxIndex++) {
            let currentBit = binNumber[currentBitBoxIndex];
            
            let bitBoxSize = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);
            let currentBox = new TextDisplay(canva_ctx, new Point(0, 0), bitBoxSize, currentBit, DRAW_TEXT_FUNCTION, DRAW_BIT_BOX_FUNCTION);
            
            currentBox.startAppear(TIME_TO_APPEAR);
            animationState.binToDec.bits.numbers.push(currentBox);
        }
    } else if (animationState.binToDec.bits.numbers.length > binNumber.length) {
        for (let currentBitBoxIndex = binNumber.length; currentBitBoxIndex<animationState.binToDec.bits.numbers.length; currentBitBoxIndex++) animationState.binToDec.bits.numbers[currentBitBoxIndex].startDelete(TIME_TO_DISAPPEAR);
    }

    let currentPoint = new Point(BIT_BOX_PARAM.offset*2, BIT_BOX_PARAM.offset*2);

    for (let currentBitBoxIndex = 0; currentBitBoxIndex < animationState.binToDec.bits.numbers.length; currentBitBoxIndex++) {
        let currentBox = animationState.binToDec.bits.numbers[currentBitBoxIndex], textIndex = Math.min(binNumber.length-1, currentBitBoxIndex);
        currentBox.position = currentPoint.clone;
        currentPoint.x += BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;

        if (currentBox.isDeletingAnimation) {
            if (animationState.binToDec.bits.numbers.length != binNumber.length) continue;
            else currentBox.changeText(currentBox.text, TIME_TO_CHANGE_SIZE);
        }

        if ((currentBox.text == binNumber[textIndex] && currentBox.nextText == binNumber[textIndex]) || (currentBox.text != binNumber[textIndex] && currentBox.nextText == binNumber[textIndex])) continue;

        currentBox.changeText(binNumber[textIndex], TIME_TO_CHANGE_SIZE);
        animationState.binToDec.bits.numbers[currentBitBoxIndex] = currentBox;
    }
}

function DecimalToBinary_FloatPoint(event, canva_ctx) {
    let floatBinary = DecToBin_FloatPoint(parseFloat(event.target.value), "float");

    let currentList = animationState.floatToBin.bits.number;
    if (currentList.length < floatBinary.length) {
        for (let currentBitBoxIndex = currentList.length; currentBitBoxIndex<floatBinary.length; currentBitBoxIndex++) {
            let currentBit = floatBinary[currentBitBoxIndex];
            let drawCorectColoredBit = BitColor(currentBitBoxIndex, floatBinary.length);
            let bitBoxSize = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);
            let currentBox = new TextDisplay(canva_ctx, new Point(0, 0), bitBoxSize, currentBit, DRAW_TEXT_FUNCTION, drawCorectColoredBit);
            currentBox.startAppear(TIME_TO_APPEAR);
            currentList.push(currentBox);
        }
    } else if (currentList.length > floatBinary.length) {
        for (let currentBitBoxIndex = floatBinary.length; currentBitBoxIndex < currentList.length; currentBitBoxIndex++) currentList[currentBitBoxIndex].startDelete(TIME_TO_DISAPPEAR);
    }

    let currentPoint = new Point(BIT_BOX_PARAM.offset*2, BIT_BOX_PARAM.offset*2);

    for (let currentBitBoxIndex = 0; currentBitBoxIndex < currentList.length; currentBitBoxIndex++) {
        let currentBox = currentList[currentBitBoxIndex], textIndex = Math.min(floatBinary.length-1, currentBitBoxIndex);
        currentBox.position = currentPoint.clone;
        currentPoint.x += BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;

        if (currentBox.isDeletingAnimation) {
            if (currentList.length != floatBinary.length) continue;
            else currentBox.changeText(currentBox.text, TIME_TO_CHANGE_SIZE);
        }

        if ((currentBox.text == floatBinary[textIndex] && currentBox.nextText == floatBinary[textIndex]) || (currentBox.text != floatBinary[textIndex] && currentBox.nextText == floatBinary[textIndex])) continue;

        currentBox.changeText(floatBinary[textIndex], TIME_TO_CHANGE_SIZE);
        currentList[currentBitBoxIndex] = currentBox;
    }
}

function AdditionAnimation() {
    let currentHilightPosition = animationState.addition.hilight.object.position;

    if (animationState.addition.hilight.isMoving) {
        if (animationState.addition.timeStoper < TIME_TO_STOP) {
            animationState.addition.timeStoper++;
            return;
        }

        currentHilightPosition.x += MOVING_HILIGHT_SPEED;

        if (currentHilightPosition.x <= animationState.addition.hilight.stop_x) {
            animationState.addition.hilight.isMoving = false;
            currentHilightPosition.x = animationState.addition.hilight.stop_x;
        } else if (animationState.addition.hilight.stop_x < animationState.addition.hilight.end_x) {
            currentHilightPosition.x = animationState.addition.hilight.end_x;
            animationState.addition.hilight.object.startDelete(TIME_TO_DISAPPEAR);
            animationState.addition.isPlaying = false;

            ADDITION_INPUT_1.readOnly = false;
            ADDITION_INPUT_2.readOnly = false;
        }
    } else {
        let bitIndexOfNumber_1 = animationState.addition.bits.number_1.length - 1 - animationState.addition.index;
        let bitOfNumber_1 = IsOutOfBounds(bitIndexOfNumber_1, animationState.addition.bits.number_1);

        let bitIndexOfNumber_2 = animationState.addition.bits.number_2.length - 1 - animationState.addition.index;
        let bitOfNumber_2 = IsOutOfBounds(bitIndexOfNumber_2, animationState.addition.bits.number_2);

        let answerBit = parseInt(bitOfNumber_1) + parseInt(bitOfNumber_2) + (animationState.addition.imaginary.object != null);
        animationState.addition.imaginary.imaginary = Math.floor(answerBit/2);

        if (animationState.addition.imaginary.object != null)
            animationState.addition.imaginary.object.startDelete(TIME_TO_DISAPPEAR);

        animationState.addition.imaginary.object = null;

        if (animationState.addition.imaginary.imaginary == 1)
            answerBit -= 2;
    
        if (animationState.addition.imaginary.imaginary == 1 && 
                Math.max(bitIndexOfNumber_1,bitIndexOfNumber_2) > 0) {
            let imaginaryBox_point = new Point(animationState.addition.hilight.stop_x - BIT_BOX_PARAM.width, currentHilightPosition.y - BIT_BOX_PARAM.height);
            let imaginaryBox_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);

            animationState.addition.imaginary.object = new TextDisplay(ADDITION_OUTPUT_CTX, imaginaryBox_point, imaginaryBox_size, 1, DRAW_TEXT_FUNCTION, DRAW_IMAGINARY_BOX_FUNCTION);
            animationState.addition.imaginary.object.startAppear(TIME_TO_APPEAR);
            animationState.addition.bits.additional.push(animationState.addition.imaginary.object);
        }

        let ansBox_point = new Point(animationState.addition.hilight.stop_x + BIT_BOX_PARAM.offset, currentHilightPosition.y + BIT_BOX_PARAM.height * 2 + BIT_BOX_PARAM.offset * 3);
        let ansBot_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);

        let ansBox = new TextDisplay(ADDITION_OUTPUT_CTX, ansBox_point, ansBot_size, answerBit.toString(), DRAW_TEXT_FUNCTION, DRAW_ANSWER_BOX_FUNCTION);
        ansBox.startAppear(TIME_TO_APPEAR);
        animationState.addition.bits.additional.push(ansBox);

        animationState.addition.hilight.isMoving = true;
        animationState.addition.timeStoper = 0;
        animationState.addition.hilight.stop_x -= BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
        animationState.addition.index++;
    }
}

function StartAdditionAnimation() {
    if (animationState.addition.bits.number_1.length <= 0 || animationState.addition.bits.number_2.length <= 0) return;
    if (animationState.addition.isPlaying) return;

    DeleteOperationResult("input_decimalNumberAddition_1");

    ADDITION_INPUT_1.readOnly = true;
    ADDITION_INPUT_2.readOnly = true;

    let additionHilight_point = new Point(ADDITION_OUTPUT.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset * 3, BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset * 2);
    let additionHilight_size = new Size(BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset * 2, BIT_BOX_PARAM.height * 2 + BIT_BOX_PARAM.offset * 3);

    animationState.addition.hilight.object = new TextDisplay(ADDITION_OUTPUT_CTX, additionHilight_point, additionHilight_size, "", DRAW_TEXT_FUNCTION, DRAW_HILIGHT_FUNCTION);
    animationState.addition.hilight.object.startAppear(TIME_TO_APPEAR);
    animationState.addition.bits.additional.push(animationState.addition.hilight.object);

    let countOfBits = Math.max(animationState.addition.bits.number_1.length, animationState.addition.bits.number_2.length);
    let sign_point = new Point(ADDITION_OUTPUT.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset * 2 - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * countOfBits,
        BIT_BOX_PARAM.height * 2 + BIT_BOX_PARAM.offset);
    let sign_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);

    let sign = new TextDisplay(ADDITION_OUTPUT_CTX, sign_point, sign_size, "+", DRAW_TEXT_FUNCTION, DRAW_BIT_BOX_FUNCTION);
    sign.startAppear(TIME_TO_APPEAR);
    animationState.addition.bits.additional.push(sign);

    animationState.addition.isPlaying = true;
    animationState.addition.hilight.isMoving = false;
    animationState.addition.hilight.stop_x = additionHilight_point.x;
    animationState.addition.hilight.end_x = additionHilight_point.x - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * ( Math.max(animationState.addition.bits.number_1.length, animationState.addition.bits.number_2.length) - 1 );
    animationState.addition.index = 0;
    animationState.addition.imaginary.object = null;
    animationState.addition.timeStoper = 0;
}

function SubtractionAnimation() {
    let currentHilightPosition = animationState.subtraction.hilight.object.position;

    if (animationState.subtraction.findingNextNumber) {
        currentHilightPosition = animationState.subtraction.imaginary.object.position;

        if (animationState.subtraction.imaginary.isMoving) {
            currentHilightPosition.x += MOVING_IMAGINARY_SPEED * animationState.subtraction.imaginary.direction;

            if ((currentHilightPosition.x < animationState.subtraction.imaginary.stop_x && animationState.subtraction.imaginary.direction == 1) ||
                    (currentHilightPosition.x > animationState.subtraction.imaginary.stop_x && animationState.subtraction.imaginary.direction == -1))
                animationState.subtraction.imaginary.isMoving = false;
        } else {
            let bitIndexOfNumber_1 = animationState.subtraction.bits.number_1.length - 1 - animationState.subtraction.imaginary.index;
            let bitOfNumber_1 = (bitIndexOfNumber_1 >= 0)?animationState.subtraction.bits.number_1[bitIndexOfNumber_1].text : 0;
            
            if (animationState.subtraction.imaginary.direction == 1) {
                let isLastInd = (animationState.subtraction.imaginary.index + 1 == Math.max(animationState.subtraction.bits.number_1.length, animationState.subtraction.bits.number_2.length));
                if (bitOfNumber_1 == 1 || isLastInd) {
                    let imaginaryBox_point = new Point(animationState.subtraction.imaginary.stop_x + BIT_BOX_PARAM.offset, currentHilightPosition.y + BIT_BOX_PARAM.offset);
                    let imaginaryBox_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);
                    
                    let imaginaryBox = new TextDisplay(SUBTRACTION_OUTPUT_CTX, imaginaryBox_point, imaginaryBox_size, (isLastInd) ? "1" : "0", DRAW_TEXT_FUNCTION, DRAW_IMAGINARY_BOX_FUNCTION);
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
                let imaginaryBox_point = new Point(animationState.subtraction.imaginary.stop_x + BIT_BOX_PARAM.offset, currentHilightPosition.y + BIT_BOX_PARAM.offset);
                let imaginaryBox_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);
                
                let imaginaryBox = new TextDisplay(SUBTRACTION_OUTPUT_CTX, imaginaryBox_point.clone, imaginaryBox_size, "1", DRAW_TEXT_FUNCTION, DRAW_IMAGINARY_BOX_FUNCTION);
                animationState.subtraction.bits.imaginary[animationState.subtraction.imaginary.index] = imaginaryBox;
                imaginaryBox.startAppear(TIME_TO_APPEAR);

                animationState.subtraction.imaginary.stop_x += BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
                animationState.subtraction.imaginary.index--;

                if(animationState.subtraction.imaginary.index <= animationState.subtraction.index) {
                    imaginaryBox_point.x = animationState.subtraction.hilight.object.position.x + BIT_BOX_PARAM.offset;
                    imaginaryBox_point.y = currentHilightPosition.y + BIT_BOX_PARAM.offset;

                    imaginaryBox = new TextDisplay(SUBTRACTION_OUTPUT_CTX, imaginaryBox_point, imaginaryBox_size, "2", DRAW_TEXT_FUNCTION, DRAW_IMAGINARY_BOX_FUNCTION);
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
        
        currentHilightPosition.x += MOVING_HILIGHT_SPEED;

        if (currentHilightPosition.x <= animationState.subtraction.hilight.stop_x) {
            animationState.subtraction.hilight.isMoving = false;
            currentHilightPosition.x = animationState.subtraction.hilight.stop_x;
        } else if (animationState.subtraction.hilight.stop_x < animationState.subtraction.hilight.end_x) {
            animationState.subtraction.hilight.object.startDelete(TIME_TO_DISAPPEAR);
            animationState.subtraction.isPlaying = false;

            SUBTRACTION_INPUT_1.readOnly = false;
            SUBTRACTION_INPUT_2.readOnly = false;

            for (let currImaginaryBox of animationState.subtraction.bits.imaginary)
                if (currImaginaryBox != null)
                    currImaginaryBox.startDelete(TIME_TO_DISAPPEAR);
        }
    } else {
        if (animationState.subtraction.imaginary.object != null)
            animationState.subtraction.imaginary.object.startDelete(TIME_TO_DISAPPEAR);

        let bitIndexOfNumber_1 = animationState.subtraction.bits.number_1.length - 1 - animationState.subtraction.index;
        let bitOfNumber_1 = (animationState.subtraction.bits.imaginary[animationState.subtraction.index] != null) ? 
            animationState.subtraction.bits.imaginary[animationState.subtraction.index].text : 
            IsOutOfBounds(bitIndexOfNumber_1, animationState.subtraction.bits.number_1);

        let bitIndexOfNumber_2 = animationState.subtraction.bits.number_2.length - 1 - animationState.subtraction.index;
        let bitOfNumber_2 = IsOutOfBounds(bitIndexOfNumber_2, animationState.subtraction.bits.number_2);

        let ans = parseInt(bitOfNumber_1) - parseInt(bitOfNumber_2);
        
        if (ans < 0) {
            let imaginaryBox_point = new Point(animationState.subtraction.hilight.stop_x - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset, currentHilightPosition.y);
            let imaginaryBox_size = new Size(
                BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset*2, 
                BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset*2
            );

            animationState.subtraction.imaginary.object = new TextDisplay(SUBTRACTION_OUTPUT_CTX, imaginaryBox_point, imaginaryBox_size, "", DRAW_TEXT_FUNCTION, DRAW_IMAGINARY_BOX_FUNCTION);
            animationState.subtraction.imaginary.object.startAppear(TIME_TO_APPEAR);
            animationState.subtraction.bits.additional.push(animationState.subtraction.imaginary.object);

            animationState.subtraction.findingNextNumber = true;
            animationState.subtraction.imaginary.isMoving = false;
            animationState.subtraction.imaginary.index = animationState.subtraction.index+1;
            animationState.subtraction.imaginary.stop_x = imaginaryBox_point.x;
            animationState.subtraction.imaginary.direction = 1;

            return;
        }

        let ansBox_point = new Point(animationState.subtraction.hilight.stop_x + BIT_BOX_PARAM.offset, currentHilightPosition.y + BIT_BOX_PARAM.height * 2 + BIT_BOX_PARAM.offset * 3);
        let ansBox_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);

        let ansBox = new TextDisplay(SUBTRACTION_OUTPUT_CTX, ansBox_point, ansBox_size, ans.toString(), DRAW_TEXT_FUNCTION, DRAW_ANSWER_BOX_FUNCTION);
        ansBox.startAppear(TIME_TO_APPEAR);
        animationState.subtraction.bits.additional.push(ansBox);

        animationState.subtraction.hilight.isMoving = true;
        animationState.subtraction.timeStoper = 0;
        animationState.subtraction.index++;
        animationState.subtraction.hilight.stop_x -= BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
    }
}

function StartSubtractionAnimation() {
    if (animationState.subtraction.bits.number_1.length <= 0 || animationState.subtraction.bits.number_2.length <= 0) return;
    if (animationState.subtraction.isPlaying) return;

    DeleteOperationResult("input_decimalNumberSubtraction_1");

    SUBTRACTION_INPUT_1.readOnly = true;
    SUBTRACTION_INPUT_2.readOnly = true;

    let subtractionHilight_point = new Point(SUBTRACTION_OUTPUT.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset*3, BIT_BOX_PARAM.offset);
    let subtractionHilight_size = new Size(BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset*2, BIT_BOX_PARAM.height*2 + BIT_BOX_PARAM.offset*3);

    animationState.subtraction.hilight.object = new TextDisplay(SUBTRACTION_OUTPUT_CTX, subtractionHilight_point, subtractionHilight_size, "", DRAW_TEXT_FUNCTION, DRAW_HILIGHT_FUNCTION);
    animationState.subtraction.hilight.object.startAppear(TIME_TO_APPEAR);
    animationState.subtraction.bits.additional.push(animationState.subtraction.hilight.object);

    let countOfBits = Math.max(animationState.subtraction.bits.number_1.length, animationState.subtraction.bits.number_2.length);
    let sign_point = new Point(SUBTRACTION_OUTPUT.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset * 2 - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * countOfBits,
        BIT_BOX_PARAM.height*0.5 + BIT_BOX_PARAM.offset*2.5);
    let sing_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);

    let sign = new TextDisplay(SUBTRACTION_OUTPUT_CTX, sign_point, sing_size, "-", DRAW_TEXT_FUNCTION, DRAW_BIT_BOX_FUNCTION);
    sign.startAppear(TIME_TO_APPEAR);
    animationState.subtraction.bits.additional.push(sign);

    for (let i = 0; i < 64; i++)
        animationState.subtraction.bits.imaginary[i] = null;

    animationState.subtraction.isPlaying = true;
    animationState.subtraction.hilight.isMoving = false;
    animationState.subtraction.findingNextNumber = false;
    animationState.subtraction.timeStoper = 0;
    animationState.subtraction.index = 0;
    animationState.subtraction.hilight.stop_x = subtractionHilight_point.x;
    animationState.subtraction.hilight.end_x = subtractionHilight_point.x - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * ( Math.max(animationState.subtraction.bits.number_1.length, animationState.subtraction.bits.number_2.length) - 1 );
}

function MultiplicationAnimation() {
    let current_boxPosition = animationState.multiplication.hilight_1.object.position;
    if (animationState.multiplication.hilight_2.isMoving) {
        current_boxPosition = animationState.multiplication.hilight_2.object.position;
        
        current_boxPosition.x += MOVING_HILIGHT_SPEED * 2;

        if (current_boxPosition.x <= animationState.multiplication.hilight_2.stop_x) {
            animationState.multiplication.hilight_2.isMoving = false;
            animationState.multiplication.hilight_1.stop_x = MULTIPLICATION_OUTPUT.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset*2;
            current_boxPosition.x = animationState.multiplication.hilight_2.stop_x;
            animationState.multiplication.hilight_1.isMoving = true;
            animationState.multiplication.indexNumber_1 = 0;

            let animationBox_point = new Point(MULTIPLICATION_OUTPUT.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset*2, BIT_BOX_PARAM.offset);
            let animationBox_size = new Size(
                BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset*2,
                BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset*2
            );

            animationState.multiplication.hilight_1.object = new TextDisplay(MULTIPLICATION_OUTPUT_CTX, animationBox_point, animationBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--hilight-color'), "", true, BIT_BOX_PARAM.glowIntensity);
            animationState.multiplication.hilight_1.object.startAppear(TIME_TO_APPEAR);
            animationState.multiplication.bits.additional.push(animationState.multiplication.hilight_1.object);
        }

        if (animationState.multiplication.hilight_2.stop_x < animationState.multiplication.hilight_2.end_x) {
            animationState.multiplication.hilight_2.object.startDelete(TIME_TO_DISAPPEAR);
            animationState.multiplication.hilight_2.isMoving = false;
            animationState.multiplication.isAdding = true;

            let animationBox_point = new Point(MULTIPLICATION_OUTPUT.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset*3, BIT_BOX_PARAM.height*2 + BIT_BOX_PARAM.offset*3);
            let animationBox_size = new Size(
                BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset*2,
                (BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset) * animationState.multiplication.bits.number_1.length + BIT_BOX_PARAM.offset
            );

            animationState.multiplication.hilight_addition.object = new TextDisplay(MULTIPLICATION_OUTPUT_CTX, animationBox_point, animationBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--hilight-color'), "", true, BIT_BOX_PARAM.glowIntensity);
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
        
        current_boxPosition.x += MOVING_HILIGHT_SPEED*2;

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
            current_boxPosition.x += MOVING_HILIGHT_SPEED;
    
            if (current_boxPosition.x <= animationState.multiplication.hilight_addition.stop_x) {
                animationState.multiplication.hilight_addition.isMoving = false;
                current_boxPosition.x = animationState.multiplication.hilight_addition.stop_x;
            }
            if (animationState.multiplication.hilight_addition.stop_x < animationState.multiplication.hilight_addition.end_x) {
                animationState.multiplication.hilight_addition.object.startDelete(TIME_TO_DISAPPEAR);
                animationState.multiplication.isPlaying = false;

                MULTIPLICATION_INPUT_1.readOnly = false;
                MULTIPLICATION_INPUT_2.readOnly = false;
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

            let ansBox = new TextDisplay(MULTIPLICATION_OUTPUT_CTX, ans_point, ans_size, BIT_BOX_PARAM.radius, GetCSSColor('--ansBox-color'), ans.toString(), true, BIT_BOX_PARAM.glowIntensity);
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

        let startX = MULTIPLICATION_OUTPUT.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset*2,
            startY = BIT_BOX_PARAM.height*2 + BIT_BOX_PARAM.offset*4;
        let tempAns_point = new Point(startX - (BIT_BOX_PARAM.height+BIT_BOX_PARAM.offset) * (animationState.multiplication.indexNumber_2 + animationState.multiplication.indexNumber_1),
            startY + (BIT_BOX_PARAM.height+BIT_BOX_PARAM.offset) * animationState.multiplication.indexNumber_2);
        let tempAns_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);

        let tempAnsBox = new TextDisplay(MULTIPLICATION_OUTPUT_CTX, tempAns_point, tempAns_size, BIT_BOX_PARAM.radius, GetCSSColor('--imaginary-color'), ans.toString(), true, BIT_BOX_PARAM.glowIntensity);
        tempAnsBox.startAppear(TIME_TO_APPEAR);
        animationState.multiplication.bits.additional.push(tempAnsBox);

        animationState.multiplication.indexNumber_1++;
        animationState.multiplication.hilight_1.stop_x -= BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
        animationState.multiplication.hilight_1.isMoving = true;
    }
}

function StartMultiplicationAnimation() {
    if (animationState.multiplication.bits.number_1.length <= 0 || animationState.multiplication.bits.number_2.length <= 0) return;
    if (animationState.multiplication.isPlaying) return;

    DeleteOperationResult("input_decimalNumberMultiplication_1");

    MULTIPLICATION_INPUT_1.readOnly = true;
    MULTIPLICATION_INPUT_2.readOnly = true;

    let muliplicationBox_point = new Point(MULTIPLICATION_OUTPUT.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset*3, BIT_BOX_PARAM.offset);
    let muliplicationBox_size = new Size(
        BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset*2, 
        BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset*2
    );

    animationState.multiplication.hilight_1.object = new TextDisplay(MULTIPLICATION_OUTPUT_CTX, muliplicationBox_point.clone, muliplicationBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--hilight-color'), "", true, BIT_BOX_PARAM.glowIntensity);
    animationState.multiplication.hilight_1.object.startAppear(TIME_TO_APPEAR);
    animationState.multiplication.bits.additional.push(animationState.multiplication.hilight_1.object);

    muliplicationBox_point.y = BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset*2;

    animationState.multiplication.hilight_2.object = new TextDisplay(MULTIPLICATION_OUTPUT_CTX, muliplicationBox_point, muliplicationBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--hilight-color'), "", true, BIT_BOX_PARAM.glowIntensity);
    animationState.multiplication.hilight_2.object.startAppear(TIME_TO_APPEAR);
    animationState.multiplication.bits.additional.push(animationState.multiplication.hilight_2.object);

    let countOfNumbers = Math.max(animationState.multiplication.bits.number_1.length, animationState.multiplication.bits.number_2.length);
    let sign_point = new Point(MULTIPLICATION_OUTPUT.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset * 2 - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * countOfNumbers,
        BIT_BOX_PARAM.height*0.5 + BIT_BOX_PARAM.offset*2.5);
    let sign_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);

    let animation_multiplication_sign = new TextDisplay(MULTIPLICATION_OUTPUT_CTX, sign_point, sign_size, BIT_BOX_PARAM.radius, GetCSSColor('--bitBox-color'), "×", true, BIT_BOX_PARAM.glowIntensity);
    animation_multiplication_sign.startAppear(TIME_TO_APPEAR);
    animationState.multiplication.bits.additional.push(animation_multiplication_sign);

    let windowHeight = (animationState.multiplication.bits.number_2.length + 3) * (BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset) + BIT_BOX_PARAM.offset*3
    ResizeCanva(MULTIPLICATION_OUTPUT, WINDOW_SIZE.multiplication.width, windowHeight, TIME_TO_SCALE, changingCanvasSizeCounter, Animate);

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

function DivisionAnimation() {
    let current_boxPosition = animationState.division.hilight.object.position;

    if (animationState.division.hilight.isMoving) {
        if (animationState.division.timeStoper < TIME_TO_STOP) {
            animationState.division.timeStoper++;
            return;
        }

        current_boxPosition.x += -MOVING_HILIGHT_SPEED;

        if (current_boxPosition.x >= animationState.division.hilight.stop_x) {
            animationState.division.hilight.isMoving = false;
            current_boxPosition.x = animationState.division.hilight.stop_x;
        }
        if (animationState.division.hilight.stop_x >= animationState.division.hilight.end_x) {
            animationState.division.hilight.object.startDelete(TIME_TO_DISAPPEAR);
            animationState.division.isPlaying = false;

            DIVISION_INPUT_1.readOnly = false;
            DIVISION_INPUT_2.readOnly = false;
        }
    } else {
        if (animationState.division.addingCurrNumber) {
            let currChar = animationState.division.bits.number_2[animationState.division.addingIndex].text;
            let imaginatyBox_point = new Point(current_boxPosition.x + BIT_BOX_PARAM.offset - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * (animationState.division.bits.number_2.length - 1 - animationState.division.addingIndex),
                animationState.division.currentY);
            let imaginatyBox_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);

            let imaginatyBox = new TextDisplay(DIVISION_OUTPUT_CTX, imaginatyBox_point, imaginatyBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--imaginary-color'), currChar, true, BIT_BOX_PARAM.glowIntensity);
            imaginatyBox.startAppear(TIME_TO_APPEAR);
            animationState.division.bits.additional.push(imaginatyBox);
            animationState.division.addingIndex--;
            
            if (animationState.division.addingIndex < 0)  {
                animationState.division.addingAns = true;
                animationState.division.addingCurrNumber = false;
                animationState.division.addingIndex = animationState.division.ansBinary.length - 1;
                
                animationState.division.currentY += BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset;
            }

            return requestAnimationFrame(DivisionAnimation);
        } else if (animationState.division.addingAns) {
            let currChar = animationState.division.ansBinary[animationState.division.addingIndex];
            let imaginatyBox_point = new Point(current_boxPosition.x + BIT_BOX_PARAM.offset - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * (animationState.division.ansBinary.length - 1 - animationState.division.addingIndex),
                animationState.division.currentY);
            let imaginatyBox_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);
            
            let imaginatyBox = new TextDisplay(DIVISION_OUTPUT_CTX, imaginatyBox_point, imaginatyBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--imaginary-color'), currChar, true, BIT_BOX_PARAM.glowIntensity);
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

            return requestAnimationFrame(DivisionAnimation);
        }

        animationState.division.currentDivisionNum *= 2;
        animationState.division.currentDivisionNum += parseInt(animationState.division.bits.number_1[animationState.division.index].text);
        
        if (animationState.division.copyLower) {
            let currChar = animationState.division.bits.number_1[animationState.division.index].text;
            let imaginatyBox_point = new Point(current_boxPosition.x + BIT_BOX_PARAM.offset, animationState.division.currentY);
            let imaginatyBox_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);

            let imaginatyBox = new TextDisplay(DIVISION_OUTPUT_CTX, imaginatyBox_point, imaginatyBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--imaginary-color'), currChar, true, BIT_BOX_PARAM.glowIntensity);
            imaginatyBox.startAppear(TIME_TO_APPEAR);
            animationState.division.bits.additional.push(imaginatyBox);
        }

        let ansBox;
        let ansBox_point = new Point(DIVISION_OUTPUT.width - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset)*(animationState.division.bits.number_1.length - animationState.division.index) - BIT_BOX_PARAM.offset,
            BIT_BOX_PARAM.offset*5 + BIT_BOX_PARAM.width);
        let ansBox_size = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);
        
        if (animationState.division.currentDivisionNum >= animationState.division.currentNum_2) {
            ansBox = new TextDisplay(DIVISION_OUTPUT_CTX, ansBox_point, ansBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--ansBox-color'), "1", true, BIT_BOX_PARAM.glowIntensity);
            ansBox.startAppear(TIME_TO_APPEAR);
            animationState.division.bits.additional.push(ansBox);
            
            animationState.division.currentDivisionNum -= animationState.division.currentNum_2;
            animationState.division.currentY += BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset;

            animationState.division.ansBinary = DecToBin_Int(animationState.division.currentDivisionNum);
            animationState.division.addingCurrNumber = true;
            animationState.division.addingIndex = animationState.division.bits.number_2.length - 1;

            animationState.division.copyLower = true;
            return requestAnimationFrame(DivisionAnimation);
        } else {
            ansBox = new TextDisplay(DIVISION_OUTPUT_CTX, ansBox_point, ansBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--ansBox-color'), "0", true, BIT_BOX_PARAM.glowIntensity);
            ansBox.startAppear(TIME_TO_APPEAR);
            animationState.division.bits.additional.push(ansBox);
        }

        animationState.division.hilight.isMoving = true;
        animationState.division.timeStoper = 0;
        animationState.division.index++;
        animationState.division.hilight.stop_x += BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
    }
}

function StartDivisionAnimation() {
    if (animationState.division.bits.number_1.length <= 0 || animationState.division.bits.number_2.length <= 0) return;
    if (animationState.division.isPlaying) return;

    if (DIVISION_INPUT_2.value == "0") return;

    DeleteOperationResult("input_decimalNumberDivision_1");

    DIVISION_INPUT_1.readOnly = true;
    DIVISION_INPUT_2.readOnly = true;

    let lenOfNumbers = Math.max(animationState.division.bits.number_1.length, 8) + Math.max(animationState.division.bits.number_2.length, 8);
    let divisionBox_point = new Point(DIVISION_OUTPUT.width - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset)*lenOfNumbers - BIT_BOX_PARAM.offset * 3, BIT_BOX_PARAM.offset*2);
    let divisionBox_size = new Size(
        BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset*2, 
        BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset*2
    );

    animationState.division.hilight.object = new TextDisplay(DIVISION_OUTPUT_CTX, divisionBox_point, divisionBox_size, BIT_BOX_PARAM.radius, GetCSSColor('--hilight-color'), "", true, BIT_BOX_PARAM.glowIntensity);
    animationState.division.hilight.object.startAppear(TIME_TO_APPEAR);
    animationState.division.bits.additional.push(animationState.division.hilight.object);

    let countOfOperations = 0, currNum2 = parseInt(DIVISION_INPUT_2.value), currNum = 0;

    for (let currInd = 0; currInd<animationState.division.bits.number_1.length; currInd++) {
        currNum *= 2;
        currNum += parseInt(animationState.division.bits.number_1[currInd].text);

        if (currNum >= currNum2) {
            countOfOperations++;
            currNum -= currNum2;
        }
    }

    let windowHeight = Math.max(WINDOW_SIZE.division.height, (BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset) * (countOfOperations * 2 + 1) + BIT_BOX_PARAM.offset*3);
    ResizeCanva(DIVISION_OUTPUT, WINDOW_SIZE.division.width, windowHeight, TIME_TO_SCALE, changingCanvasSizeCounter, Animate);

    animationState.division.isPlaying = true;
    animationState.division.copyLower = false;
    animationState.division.currentDivisionNum = 0;
    animationState.division.currentNum_2 = parseInt(DIVISION_INPUT_2.value);
    animationState.division.index = 0;
    animationState.division.timeStoper = 0;
    animationState.division.currentY = BIT_BOX_PARAM.offset*3;

    animationState.division.hilight.object.isMoving = false;
    animationState.division.hilight.isMoving = false;
    animationState.division.hilight.stop_x = divisionBox_point.x;
    animationState.division.hilight.end_x = divisionBox_point.x + (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * animationState.division.bits.number_1.length;
}

function Animate(currentTime, repeat = true) {
    if (repeat && changingCanvasSizeCounter.counter > 0) return requestAnimationFrame(Animate);

    if (animationState.addition.isPlaying) AdditionAnimation();
    if (animationState.subtraction.isPlaying) SubtractionAnimation();
    if (animationState.multiplication.isPlaying) MultiplicationAnimation();
    if (animationState.division.isPlaying) DivisionAnimation();

    for (let currentCanva of Object.values(OUTPUT_CTX))
        if (currentCanva.visible)
            ClearCanva(currentCanva.ctx, currentCanva.canva, GetCSSColor('--canva-color'), CANVA_CORNER_RADIUS);

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
    let lineX = DIVISION_OUTPUT.width - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset)*lenOfNumbers - BIT_BOX_PARAM.offset * 2;
    let lineXLen = (BIT_BOX_PARAM.offset + BIT_BOX_PARAM.width) * Math.max(animationState.division.bits.number_2.length, 8);

    let offSetLine_1 = lineXLen * animationState.division.lineRenderPercent;
    let offSetLine_2 = (BIT_BOX_PARAM.offset*5 + BIT_BOX_PARAM.height*2) * animationState.division.lineRenderPercent;

    DrawGlowingLine(DIVISION_OUTPUT_CTX, lineX, BIT_BOX_PARAM.offset*4 + BIT_BOX_PARAM.height, 
        lineX + offSetLine_1, BIT_BOX_PARAM.offset*4 + BIT_BOX_PARAM.height, LINE_RENDER_WIDTH, "#ffffff", true, BIT_BOX_PARAM.glowIntensity);
    
    DrawGlowingLine(DIVISION_OUTPUT_CTX, lineX, BIT_BOX_PARAM.offset*2, 
        lineX, BIT_BOX_PARAM.offset + offSetLine_2, LINE_RENDER_WIDTH, "#ffffff", true, BIT_BOX_PARAM.glowIntensity);
}

function EventListeners() {
    POSITIVE_DECIMAL_TO_BINARY_INPUT.addEventListener('input', 
        (event) => { Input_Filter(event, false, "int", false); });
    POSITIVE_DECIMAL_TO_BINARY_INPUT.addEventListener('input', 
        (event) => { DecimalToBinary_Int(event, POSITIVE_DECIMAL_TO_BINARY_OUTPUT_CTX, false); });

    DECIMAL_TO_BINARY_INPUT.addEventListener('input', 
        (event) => { Input_Filter(event, true, "int", true); });
    DECIMAL_TO_BINARY_INPUT.addEventListener('input', 
        (event) => { DecimalToBinary_Int(event, DECIMAL_TO_BINARY_OUTPUT_CTX, true); });
    
    BINARY_TO_DECIMAL_INPUT.addEventListener('input', 
        (event) => { BinaryToDecimal_Int(event, BINARY_TO_DECIMAL_OUTPUT_CTX); });

    FLOAT_POINT_TO_BINARY_INPUT.addEventListener('input', 
            (event) => { Input_Filter(event, true, "float", true); });
    FLOAT_POINT_TO_BINARY_INPUT.addEventListener('input', 
        (event) => { DecimalToBinary_FloatPoint(event, FLOAT_POINT_TO_BINARY_OUTPUT_CTX); });

    ADDITION_INPUT_1.addEventListener('input', 
        (event) => { Input_Filter(event, true, "int", true); });
    ADDITION_INPUT_2.addEventListener('input', 
        (event) => { Input_Filter(event, true, "int", true); });
    ADDITION_INPUT_1.addEventListener('input', AddBit);
    ADDITION_INPUT_2.addEventListener('input', AddBit);
    ADDITION_BUTTON.addEventListener('click', StartAdditionAnimation);

    SUBTRACTION_INPUT_1.addEventListener('input', 
        (event) => { Input_Filter(event, true, "int", true); });
    SUBTRACTION_INPUT_2.addEventListener('input', 
        (event) => { Input_Filter(event, true, "int", true); });
    SUBTRACTION_INPUT_1.addEventListener('input', AddBit);
    SUBTRACTION_INPUT_2.addEventListener('input', AddBit);
    SUBTRACTION_BUTTON.addEventListener('click', StartSubtractionAnimation);

    MULTIPLICATION_INPUT_1.addEventListener('input', 
        (event) => { Input_Filter(event, false, "short", true); });
    MULTIPLICATION_INPUT_2.addEventListener('input', 
        (event) => { Input_Filter(event, false, "short", true); });
    MULTIPLICATION_INPUT_1.addEventListener('input', AddBit);
    MULTIPLICATION_INPUT_2.addEventListener('input', AddBit);
    MULTIPLICATION_BUTTON.addEventListener('click', StartMultiplicationAnimation);

    DIVISION_INPUT_1.addEventListener('input', 
        (event) => { Input_Filter(event, false, "char", true); });
    DIVISION_INPUT_2.addEventListener('input', 
        (event) => { Input_Filter(event, false, "char", true); });
    DIVISION_INPUT_1.addEventListener('input', AddBit);
    DIVISION_INPUT_2.addEventListener('input', AddBit);
    DIVISION_BUTTON.addEventListener('click', StartDivisionAnimation);
}

function AddBit(event) {
    DeleteOperationResult(this.id);

    let binNumber = "";
    if (IsNumber(event.target.value)) {
        let number = parseInt(event.target.value);
        binNumber = DecToBin_Int(number, true, -1);
    }

    let currentBitBoxList = InputList(this.id);
    const CANVA_AND_CTX = GetCanvaAndCtx(this.id);
    const CURRENT_SETTINGS = GetCurrentSettings(this.id, CANVA_AND_CTX.canva, currentBitBoxList.length, binNumber.length);

    if (currentBitBoxList.length < binNumber.length) {
        for (let currentBitBox = currentBitBoxList.length; currentBitBox < binNumber.length; currentBitBox++) {
            let currentBit = binNumber[binNumber.length - currentBitBox - 1];
            let currentBoxSize = new Size(BIT_BOX_PARAM.width, BIT_BOX_PARAM.height);

            let currentBox = new TextDisplay(CANVA_AND_CTX.ctx, new Point(0, 0), currentBoxSize, currentBit, DRAW_TEXT_FUNCTION, DRAW_BIT_BOX_FUNCTION);
            currentBox.startAppear(TIME_TO_APPEAR);
            currentBitBoxList.unshift(currentBox);
        }
    } else if (currentBitBoxList.length > binNumber.length) {
        let endInd = currentBitBoxList.length - binNumber.length;
        if (CURRENT_SETTINGS.reverse) currentBitBoxList.reverse();

        for (let currentBitBox = 0; currentBitBox < endInd; currentBitBox++) 
            currentBitBoxList[currentBitBox].startDelete(TIME_TO_DISAPPEAR);

        if (CURRENT_SETTINGS.reverse) currentBitBoxList.reverse();
    }
    
    let startLoop = CURRENT_SETTINGS.startLoop, endLoop = CURRENT_SETTINGS.endLoop;
    let currentPoint = CURRENT_SETTINGS.position;

    for (let currentBitBox = startLoop; currentBitBox != endLoop; currentBitBox += CURRENT_SETTINGS.direction) {
        let currentBox = currentBitBoxList[currentBitBox], textIndex = Math.max(0, binNumber.length - 1 - (currentBitBoxList.length - 1 - currentBitBox));
        currentBox.position = currentPoint.clone;
        currentPoint.x += (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * CURRENT_SETTINGS.direction;

        if (currentBox.isDeletingAnimation) {
            if (currentBitBoxList.length != binNumber.length) continue;
            else currentBox.changeText(currentBox.text, TIME_TO_CHANGE_SIZE);
        }

        if ((currentBox.text == binNumber[textIndex] && currentBox.nextText == binNumber[textIndex]) || (currentBox.text != binNumber[textIndex] && currentBox.nextText == binNumber[textIndex])) continue;

        currentBox.changeText(binNumber[textIndex], TIME_TO_CHANGE_SIZE);
    }
}

function GetCurrentSettings(inputID, canva, listLen, binNumberLen) {
    if (inputID == "input_decimalNumberDivision_1" || inputID == "input_decimalNumberDivision_2") {
        let lenOfNumbers = Math.max(animationState.division.bits.number_1.length, 8) + Math.max(animationState.division.bits.number_2.length, 8);
        let currentPoint = new Point(DIVISION_OUTPUT.width - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset)*lenOfNumbers - BIT_BOX_PARAM.offset*2,
            BIT_BOX_PARAM.offset*3);

        if (inputID == "input_decimalNumberDivision_2")
            currentPoint.x += BIT_BOX_PARAM.offset + (BIT_BOX_PARAM.offset + BIT_BOX_PARAM.width) * Math.max(animationState.division.bits.number_1.length, 8);

        return {"position": currentPoint, "direction": 1, "startLoop": 0, "endLoop": Math.max(listLen, binNumberLen), "reverse": true};
    } else if (inputID == "input_decimalNumberSubtraction_1" || inputID == "input_decimalNumberSubtraction_2") {
        let currentPoint = new Point(canva.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset * 2,
            BIT_BOX_PARAM.offset * 2);

        if (SecondNumber(inputID)) currentPoint.y += BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset;

        return {"position": currentPoint, "direction": -1, "startLoop": Math.max(listLen, binNumberLen) - 1, "endLoop": -1, "reverse": false};
    } else if (inputID == "input_decimalNumberMultiplication_1" || inputID == "input_decimalNumberMultiplication_2") {
        let currentPoint = new Point(canva.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset * 2,
            BIT_BOX_PARAM.offset * 2);

        if (SecondNumber(inputID)) currentPoint.y += BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset;

        return {"position": currentPoint, "direction": -1, "startLoop": Math.max(listLen, binNumberLen) - 1, "endLoop": -1, "reverse": false};
    } else {
        let currentPoint = new Point(canva.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset * 2,
            BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset * 3);

        if (SecondNumber(inputID)) currentPoint.y += BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset;

        return {"position": currentPoint, "direction": -1, "startLoop": Math.max(listLen, binNumberLen) - 1, "endLoop": -1, "reverse": false};
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

        if (MULTIPLICATION_OUTPUT.height != WINDOW_SIZE.multiplication.height)
            ResizeCanva(MULTIPLICATION_OUTPUT, WINDOW_SIZE.multiplication.width, WINDOW_SIZE.multiplication.height, TIME_TO_SCALE, changingCanvasSizeCounter, Animate);
    } else if ((inputID == "input_decimalNumberDivision_1" || inputID == "input_decimalNumberDivision_2")) {
        for (let currBox of animationState.division.bits.additional)
            currBox.startDelete(TIME_TO_DISAPPEAR);
        if (DIVISION_OUTPUT.height != WINDOW_SIZE.division.height)
            ResizeCanva(DIVISION_OUTPUT, WINDOW_SIZE.division.width, WINDOW_SIZE.division.height, TIME_TO_SCALE, changingCanvasSizeCounter, Animate);
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

    if (indexOfBit == SIGN_BIT) return DRAW_ANSWER_BOX_FUNCTION;
    else if (indexOfBit <= POWER_BITS) return DRAW_IMAGINARY_BOX_FUNCTION;
    else return DRAW_BIT_BOX_FUNCTION;
}
