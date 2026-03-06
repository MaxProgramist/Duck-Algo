//* ---------- Variables ---------- *//
//* -------- HTML Elements -------- *//
const INPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE  = document.getElementById('input_decimalNumber_positive');
const OUTPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE = document.getElementById('output_decimalNumber_positive');
const OUTPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE_CTX = OUTPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE.getContext("2d");

const INPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE = document.getElementById('input_decimalNumber_negative');
const OUTPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE = document.getElementById('output_decimalNumber_negative');
const OUTPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE_CTX = OUTPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE.getContext("2d");

const INPUT_FLOAT_TO_BINARY_NUMBER = document.getElementById('input_floatNumber');
const OUTPUT_FLOAT_TO_BINARY_NUMBER = document.getElementById('output_floatNumber');
const OUTPUT_FLOAT_TO_BINARY_NUMBER_CTX = OUTPUT_FLOAT_TO_BINARY_NUMBER.getContext("2d");

const INPUT_ADDITION_1 = document.getElementById('input_decimalNumberAddition_1');
const INPUT_ADDITION_2 = document.getElementById('input_decimalNumberAddition_2');
const OUTPUT_ADDITION = document.getElementById('additionAnimation');
const OUTPUT_ADDITION_CTX = OUTPUT_ADDITION.getContext("2d");

const INPUT_SUBTRACTION_1 = document.getElementById('input_decimalNumberSubtraction_1');
const INPUT_SUBTRACTION_2 = document.getElementById('input_decimalNumberSubtraction_2');
const OUTPUT_SUBTRACTION = document.getElementById('subtractionAnimation');
const OUTPUT_SUBTRACTION_CTX = OUTPUT_SUBTRACTION.getContext("2d");

const INPUT_MULTIPLICATION_1 = document.getElementById('input_decimalNumberMultiplication_1');
const INPUT_MULTIPLICATION_2 = document.getElementById('input_decimalNumberMultiplication_2');
const OUTPUT_MULTIPLICATION = document.getElementById('multiplicationAnimation');
const OUTPUT_MULTIPLICATION_CTX = OUTPUT_MULTIPLICATION.getContext("2d");

const INPUT_DIVISION_1 = document.getElementById('input_decimalNumberDivision_1');
const INPUT_DIVISION_2 = document.getElementById('input_decimalNumberDivision_2');
const OUTPUT_DIVISION = document.getElementById('divisionAnimation');
const OUTPUT_DIVISION_CTX = OUTPUT_DIVISION.getContext("2d");

const OUTPUT_CTX = [
    {"ctx": OUTPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE_CTX, "canva": OUTPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE, "visible": true},
    {"ctx": OUTPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE_CTX, "canva": OUTPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE, "visible": true},
    {"ctx": OUTPUT_ADDITION_CTX, "canva": OUTPUT_ADDITION, "visible": true},
    {"ctx": OUTPUT_SUBTRACTION_CTX, "canva": OUTPUT_SUBTRACTION, "visible": true},
    {"ctx": OUTPUT_MULTIPLICATION_CTX, "canva": OUTPUT_MULTIPLICATION, "visible": true},
    {"ctx": OUTPUT_DIVISION_CTX, "canva": OUTPUT_DIVISION, "visible": true},
    {"ctx": OUTPUT_FLOAT_TO_BINARY_NUMBER_CTX, "canva": OUTPUT_FLOAT_TO_BINARY_NUMBER, "visible": true}
];

window.onload = () => {
    ScrollToRight(OUTPUT_ADDITION.parentElement);
    ScrollToRight(OUTPUT_SUBTRACTION.parentElement);
    ScrollToRight(OUTPUT_MULTIPLICATION.parentElement);
    ScrollToRight(OUTPUT_DIVISION.parentElement);
}

const OBSERVER_SETTINGS = { root: null, threshold: 0.1 };

const ObserverCallback = (Entries) => {
    Entries.forEach(Entry => {
        const TARGET_DATA = OUTPUT_CTX.find(Item => Item.canva === Entry.target);
        if (TARGET_DATA) TARGET_DATA.visible = Entry.isIntersecting;
    });
};

const CANVAS_OBSERVER = new IntersectionObserver(ObserverCallback, OBSERVER_SETTINGS);
OUTPUT_CTX.forEach(Item => { CANVAS_OBSERVER.observe(Item.canva); });

//* ------------ Other ------------ *//

const BIT_BOX_PARAM = {width: 25, height: 25, offset: 5};

const TIME_TO_APEAR = 500;
const TIME_TO_DISAPEAR = 150;

const MOVING_BOX_SPEED = -2;
const LINE_RENDER_SPEED = 0.125;
const TIME_TO_STOP = 15;

let animationState = {
    "decToBin": {
        "bits": {
            "positive": [],
            "negative": [],
            "float": []
        }
    },
    "addition": {
        "isPlaying": false,
        "bits": {
            "additional": [],
            "number_1": [],
            "number_2": []
        },
        "index": 0,
        "timeStoper": 0,
        "hilight":{
            "object": null,
            "isMoving": false,
            "stop_x": false,
            "end_x": false
        },
        "imaginary": {
            "object": null,
            "imaginary": 0
        }
    },
    "subtraction": {
        "isPlaying": false,
        "bits": {
            "additional": [],
            "number_1": [],
            "number_2": [],
            "imaginary": []
        },
        "index": 0,
        "timeStoper": 0,
        "hilight":{
            "object": null,
            "isMoving": false,
            "stop_x": false,
            "end_x": false
        },
        "findingNextNumber": false,
        "imaginary": {
            "object": null,
            "isMoving": false,
            "index": 0,
            "direction": 0,
            "stop_x": false,
            "end_x": false
        }
    },
    "multiplication" : {
        "isPlaying": false,
        "bits": {
            "numbers": [],
            "additional": [],
            "number_1": [],
            "number_2": []
        },
        "hilight_1":{
            "object": null,
            "isMoving": false,
            "stop_x": false,
            "end_x": false
        },
        "hilight_2":{
            "object": null,
            "isMoving": false,
            "stop_x": false,
            "end_x": false
        },
        "hilight_addition":{
            "object": null,
            "isMoving": false,
            "stop_x": false,
            "end_x": false
        },
        "addingImaginary": 0,
        "isAdding": false,
        "indexNumber_1": 0,
        "indexNumber_2": 0,
        "indexAddition": 0
    },
    "division": {
        "bits": {
            "additional": [],
            "number_1": [],
            "number_2": []
        },
        "index": 0,
        "currentDivisionNum": 0,
        "currentNum_2": 0,
        "timeStoper": 0,
        "currentY": 0,
        "copyLower": false,
        "addingCurrNumber": false,
        "addingAns": false,
        "addingIndex": 0,
        "ansBinary": 0,
        "hilight":{
            "object": null,
            "isMoving": false,
            "stop_x": false,
            "end_x": false
        },
        "lineRenderPercent": 0
    }
};

const ANIMATION_NAMES = ["decToBin", "addition", "subtraction", "multiplication", "division"];

EventListeners();
requestAnimationFrame(Animate);

//* ---------- Functions ---------- *//
function Input_IntDecToBin(event, canva_ctx, canBeNegative) {
    let binNumber = "";
    if (IsNumber(event.target.value)) {
        let number = clamp(parseInt(event.target.value), -2147483648, 2147483647);
        binNumber = DecToBin(number);
    }

    let currentList = [];
    if (canBeNegative) currentList = animationState.decToBin.bits.negative;
    else currentList = animationState.decToBin.bits.positive;

    if (currentList.length < binNumber.length) {
        for (let i = currentList.length; i<binNumber.length; i++) {
            let currentBit = binNumber[i];
            let currentBox = new BitBox(canva_ctx, new Point(0, 0), BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, GetCSSColor('--bitBox-color'), currentBit, true, 15);
            currentBox.startAppear(TIME_TO_APEAR);
            currentList.push(currentBox);
        }
    } else if (currentList.length > binNumber.length) {
        for (let i = binNumber.length; i<currentList.length; i++) currentList[i].startDelete(TIME_TO_DISAPEAR);
    }

    let currentPoint = new Point(BIT_BOX_PARAM.offset*2, BIT_BOX_PARAM.offset*2);

    for (let i = 0; i<currentList.length; i++) {
        let currentBox = currentList[i], textIndex = Math.min(binNumber.length-1, i);
        currentBox.position = currentPoint.clone;
        currentPoint.x += BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;

        if (currentBox.isDeletingAnimation) {
            if (currentList.length != binNumber.length) continue;
            else currentBox.changeText(currentBox.getText);
        }

        if ((currentBox.getText == binNumber[textIndex] && currentBox.getNextText == binNumber[textIndex]) || (currentBox.getText != binNumber[textIndex] && currentBox.getNextText == binNumber[textIndex])) continue;

        currentBox.changeText(binNumber[textIndex]);
        currentList[i] = currentBox;
    }

    if (canBeNegative) animationState.decToBin.bits.negative = currentList;
    else animationState.decToBin.bits.positive = currentList;
}

function Input_FloatDecToBin(event, canva_ctx) {
    let floatBinary = DecToBin_Float(event.target);

    let currentList = animationState.decToBin.bits.float;
    if (currentList.length < floatBinary.length) {
        for (let i = currentList.length; i<floatBinary.length; i++) {
            let currentBit = floatBinary[i];
            let boxColor = BitColor(i, floatBinary.length);
            let currentBox = new BitBox(canva_ctx, new Point(0, 0), BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, boxColor, currentBit, true, 15);
            currentBox.startAppear(TIME_TO_APEAR);
            currentList.push(currentBox);
        }
    } else if (currentList.length > floatBinary.length) {
        for (let i = floatBinary.length; i<currentList.length; i++) currentList[i].startDelete(TIME_TO_DISAPEAR);
    }

    let currentPoint = new Point(BIT_BOX_PARAM.offset*2, BIT_BOX_PARAM.offset*2);

    for (let i = 0; i<currentList.length; i++) {
        let currentBox = currentList[i], textIndex = Math.min(floatBinary.length-1, i);
        currentBox.position = currentPoint.clone;
        currentPoint.x += BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;

        if (currentBox.isDeletingAnimation) {
            if (currentList.length != floatBinary.length) continue;
            else currentBox.changeText(currentBox.getText);
        }

        if ((currentBox.getText == floatBinary[textIndex] && currentBox.getNextText == floatBinary[textIndex]) || (currentBox.getText != floatBinary[textIndex] && currentBox.getNextText == floatBinary[textIndex])) continue;

        currentBox.changeText(floatBinary[textIndex]);
        currentList[i] = currentBox;
    }
}

function Addition() {
    let current_boxPosition = animationState.addition.hilight.object.position;

    if (animationState.addition.hilight.isMoving) {
        if (animationState.addition.timeStoper < TIME_TO_STOP) {
            animationState.addition.timeStoper++;
            return requestAnimationFrame(Addition);
        }

        current_boxPosition.x += MOVING_BOX_SPEED;

        if (current_boxPosition.x <= animationState.addition.hilight.stop_x) {
            animationState.addition.hilight.isMoving = false;
            current_boxPosition.x = animationState.addition.hilight.stop_x;
        } else if (animationState.addition.hilight.stop_x < animationState.addition.hilight.end_x) {
            animationState.addition.hilight.object.startDelete(TIME_TO_DISAPEAR);
            animationState.addition.isPlaying = false;
        }
    } else {
        let number_1_index = animationState.addition.bits.number_1.length - 1 - animationState.addition.index;
        let number_1 = IsOutOfBounds(number_1_index, animationState.addition.bits.number_1);

        let number_2_index = animationState.addition.bits.number_2.length - 1 - animationState.addition.index;
        let number_2 = IsOutOfBounds(number_2_index, animationState.addition.bits.number_2);

        let ans = parseInt(number_1) + parseInt(number_2) + (animationState.addition.imaginary.object != null);
        animationState.addition.imaginary.imaginary = Math.floor(ans/2);

        if (animationState.addition.imaginary.object != null)
            animationState.addition.imaginary.object.startDelete(TIME_TO_DISAPEAR);

        animationState.addition.imaginary.object = null;

        if (animationState.addition.imaginary.imaginary == 1) {
            ans -= 2;

            if (!(number_1_index == 0 && number_2_index == 0)) {
                let imaginaryBox_point = new Point(animationState.addition.hilight.stop_x - BIT_BOX_PARAM.width, current_boxPosition.y - BIT_BOX_PARAM.height);

                animationState.addition.imaginary.object = new BitBox(OUTPUT_ADDITION_CTX, imaginaryBox_point, BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, GetCSSColor('--imaginary-color'), 1, true, 15);
                animationState.addition.imaginary.object.startAppear(TIME_TO_APEAR);
                animationState.addition.bits.additional.push(animationState.addition.imaginary.object);
            }
        }

        let ansBox_point = new Point(animationState.addition.hilight.stop_x + BIT_BOX_PARAM.offset, current_boxPosition.y + BIT_BOX_PARAM.height * 2 + BIT_BOX_PARAM.offset * 3);

        let ansBox = new BitBox(OUTPUT_ADDITION_CTX, ansBox_point, BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, GetCSSColor('--ansBox-color'), ans.toString(), true, 15);
        ansBox.startAppear(TIME_TO_APEAR);
        animationState.addition.bits.additional.push(ansBox);

        animationState.addition.hilight.isMoving = true;
        animationState.addition.timeStoper = 0;
        animationState.addition.hilight.stop_x -= BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
        animationState.addition.index++;
    }

    if (animationState.addition.isPlaying) requestAnimationFrame(Addition);
}

function StartAnimation_Addition() {
    if (animationState.addition.bits.number_1.length <= 0 && animationState.addition.bits.number_2.length <= 0) return;
    if (animationState.addition.isPlaying) return;

    DeleteOperationResult("input_decimalNumberAddition_1");

    let hilight_witdh = BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset*2;
    let hilight_height = BIT_BOX_PARAM.height*2 + BIT_BOX_PARAM.offset*3;

    let additionBox_point = new Point(OUTPUT_ADDITION.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset * 3, BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset*2);

    animationState.addition.hilight.object = new BitBox(OUTPUT_ADDITION_CTX, additionBox_point, hilight_witdh, hilight_height, 6, GetCSSColor('--hilight-color'), "", true, 15);
    animationState.addition.hilight.object.startAppear(TIME_TO_APEAR);
    animationState.addition.bits.additional.push(animationState.addition.hilight.object);

    let countOfNumbers = Math.max(animationState.addition.bits.number_1.length, animationState.addition.bits.number_2.length);
    let ansBox_point = new Point(OUTPUT_ADDITION.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset * 2 - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * countOfNumbers,
        BIT_BOX_PARAM.height*2 + BIT_BOX_PARAM.offset);

    animation_addition_sign = new BitBox(OUTPUT_ADDITION_CTX, ansBox_point, BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, GetCSSColor('--bitBox-color'), "+", true, 15);
    animation_addition_sign.startAppear(TIME_TO_APEAR);
    animationState.addition.bits.additional.push(animation_addition_sign);

    animationState.addition.isPlaying = true;
    animationState.addition.hilight.isMoving = false;
    animationState.addition.hilight.stop_x = additionBox_point.x;
    animationState.addition.hilight.end_x = additionBox_point.x - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * ( Math.max(animationState.addition.bits.number_1.length, animationState.addition.bits.number_2.length) - 1 );
    animationState.addition.index = 0;
    animationState.addition.imaginary.object = null;
    animationState.addition.timeStoper = 0;

    requestAnimationFrame(Addition);
}

function Subtraction() {
    let current_boxPosition = animationState.subtraction.hilight.object.position;

    if (animationState.subtraction.findingNextNumber) {
        current_boxPosition = animationState.subtraction.imaginary.object.position;

        if (animationState.subtraction.imaginary.isMoving) {
            current_boxPosition.x += MOVING_BOX_SPEED * 2 * animation_subtraction_imaginary_movingDirection;

            if ((current_boxPosition.x < animationState.subtraction.imaginary.stop_x && animation_subtraction_imaginary_movingDirection == 1) ||
                (current_boxPosition.x > animationState.subtraction.imaginary.stop_x && animation_subtraction_imaginary_movingDirection == -1)) {
                animationState.subtraction.imaginary.isMoving = false;
            }
        } else {
            let number_1_index = animationState.subtraction.bits.number_1.length - 1 - animation_subtraction_imaginary_index;
            let number_1 = (number_1_index >= 0)?animationState.subtraction.bits.number_1[number_1_index].getText : 0;
            
            if (animation_subtraction_imaginary_movingDirection == 1) {
                let isLastInd = (animation_subtraction_imaginary_index + 1 == Math.max(animationState.subtraction.bits.number_1.length, animationState.subtraction.bits.number_2.length));
                if (number_1 == 1 || isLastInd) {
                    let imaginaryBox_point = new Point(animationState.subtraction.imaginary.stop_x + BIT_BOX_PARAM.offset, current_boxPosition.y + BIT_BOX_PARAM.offset);
                    let imaginaryBox = new BitBox(OUTPUT_SUBTRACTION_CTX, imaginaryBox_point, BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, GetCSSColor('--imaginary-color'), (isLastInd)?"1":"0", true, 15);
                    animationState.subtraction.bits.imaginary[animation_subtraction_imaginary_index] = imaginaryBox;
                    imaginaryBox.startAppear(TIME_TO_APEAR);

                    animation_subtraction_imaginary_movingDirection *= -1;
                    animationState.subtraction.imaginary.stop_x += BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
                    animation_subtraction_imaginary_index--;
                } else {
                    animationState.subtraction.imaginary.stop_x -= BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
                    animation_subtraction_imaginary_index++;
                }
            } else {
                let imaginaryBox_point = new Point(animationState.subtraction.imaginary.stop_x + BIT_BOX_PARAM.offset, current_boxPosition.y + BIT_BOX_PARAM.offset);
                let imaginaryBox = new BitBox(OUTPUT_SUBTRACTION_CTX, imaginaryBox_point.clone, BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, GetCSSColor('--imaginary-color'), "1", true, 15);
                animationState.subtraction.bits.imaginary[animation_subtraction_imaginary_index] = imaginaryBox;
                imaginaryBox.startAppear(TIME_TO_APEAR);

                animationState.subtraction.imaginary.stop_x += BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
                animation_subtraction_imaginary_index--;

                if(animation_subtraction_imaginary_index <= animationState.subtraction.index) {
                    imaginaryBox_point.x = animationState.subtraction.hilight.object.position.x + BIT_BOX_PARAM.offset;
                    imaginaryBox_point.y = current_boxPosition.y + BIT_BOX_PARAM.offset;

                    imaginaryBox = new BitBox(OUTPUT_SUBTRACTION_CTX, imaginaryBox_point, BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, GetCSSColor('--imaginary-color'), "2", true, 15);
                    animationState.subtraction.bits.imaginary[animationState.subtraction.index] = imaginaryBox;
                    imaginaryBox.startAppear(TIME_TO_APEAR);

                    animationState.subtraction.imaginary.object.startDelete(TIME_TO_DISAPEAR);
                    animationState.subtraction.findingNextNumber = false;
                    animationState.subtraction.hilight.isMoving = false;
                }
            }

            animationState.subtraction.imaginary.isMoving = true;
        }
    } else if (animationState.subtraction.hilight.isMoving) {
        if (animationState.subtraction.timeStoper < TIME_TO_STOP) {
            animationState.subtraction.timeStoper++;
            return requestAnimationFrame(Subtraction);
        }
        
        current_boxPosition.x += MOVING_BOX_SPEED;

        if (current_boxPosition.x <= animationState.subtraction.hilight.stop_x) {
            animationState.subtraction.hilight.isMoving = false;
            current_boxPosition.x = animationState.subtraction.hilight.stop_x;
        } else if (animationState.subtraction.hilight.stop_x < animationState.subtraction.hilight.end_x) {
            animationState.subtraction.hilight.object.startDelete(TIME_TO_DISAPEAR);
            animationState.subtraction.isPlaying = false;

            for (let currImaginaryBox of animationState.subtraction.bits.imaginary)
                if (currImaginaryBox != null)
                    currImaginaryBox.startDelete(TIME_TO_DISAPEAR);
        }
    } else {
        if (animationState.subtraction.imaginary.object != null)
            animationState.subtraction.imaginary.object.startDelete(TIME_TO_DISAPEAR);

        let number_1_index = animationState.subtraction.bits.number_1.length - 1 - animationState.subtraction.index;
        let number_1 = (animationState.subtraction.bits.imaginary[animationState.subtraction.index] != null) ? 
            animationState.subtraction.bits.imaginary[animationState.subtraction.index].getText : 
            IsOutOfBounds(number_1_index, animationState.subtraction.bits.number_1);

        let number_2_index = animationState.subtraction.bits.number_2.length - 1 - animationState.subtraction.index;
        let number_2 = IsOutOfBounds(number_2_index, animationState.subtraction.bits.number_2);

        let ans = parseInt(number_1) - parseInt(number_2);
        
        if (ans < 0) {
            let imaginaryBox_witdh = BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset*2;
            let imaginaryBox_height = BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset*2;

            let imaginaryBox_point = new Point(animationState.subtraction.hilight.stop_x - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset, current_boxPosition.y);

            animationState.subtraction.imaginary.object = new BitBox(OUTPUT_SUBTRACTION_CTX, imaginaryBox_point, imaginaryBox_witdh, imaginaryBox_height, 6, GetCSSColor('--imaginary-color'), "", true, 15);
            animationState.subtraction.imaginary.object.startAppear(TIME_TO_APEAR);
            animationState.subtraction.bits.additional.push(animationState.subtraction.imaginary.object);

            animationState.subtraction.findingNextNumber = true;
            animationState.subtraction.imaginary.isMoving = false;
            animation_subtraction_imaginary_index = animationState.subtraction.index+1;
            animationState.subtraction.imaginary.stop_x = imaginaryBox_point.x;
            animation_subtraction_imaginary_movingDirection = 1;

            return requestAnimationFrame(Subtraction);
        }

        let ansBox_point = new Point(animationState.subtraction.hilight.stop_x + BIT_BOX_PARAM.offset, current_boxPosition.y + BIT_BOX_PARAM.height * 2 + BIT_BOX_PARAM.offset * 3);

        let ansBox = new BitBox(OUTPUT_SUBTRACTION_CTX, ansBox_point, BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, GetCSSColor('--ansBox-color'), ans.toString(), true, 15);
        ansBox.startAppear(TIME_TO_APEAR);
        animationState.subtraction.bits.additional.push(ansBox);

        animationState.subtraction.hilight.isMoving = true;
        animationState.subtraction.timeStoper = 0;
        animationState.subtraction.index++;
        animationState.subtraction.hilight.stop_x -= BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
    }

    if (animationState.subtraction.isPlaying) requestAnimationFrame(Subtraction);
}

function StartAnimation_Subtraction() {
    if (animationState.subtraction.bits.number_1.length <= 0 && animationState.subtraction.bits.number_2.length <= 0) return;
    if (animationState.subtraction.isPlaying) return;

    DeleteOperationResult("input_decimalNumberSubtraction_1");

    let hilight_witdh = BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset*2;
    let hilight_height = BIT_BOX_PARAM.height*2 + BIT_BOX_PARAM.offset*3;

    let subtractionBox_point = new Point(OUTPUT_SUBTRACTION.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset*3, BIT_BOX_PARAM.offset);

    animationState.subtraction.hilight.object = new BitBox(OUTPUT_SUBTRACTION_CTX, subtractionBox_point, hilight_witdh, hilight_height, 6, GetCSSColor('--hilight-color'), "", true, 15);
    animationState.subtraction.hilight.object.startAppear(TIME_TO_APEAR);
    animationState.subtraction.bits.additional.push(animationState.subtraction.hilight.object);

    let countOfNumbers = Math.max(animationState.subtraction.bits.number_1.length, animationState.subtraction.bits.number_2.length);
    let sign_point = new Point(OUTPUT_SUBTRACTION.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset * 2 - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * countOfNumbers,
        BIT_BOX_PARAM.height*0.5 + BIT_BOX_PARAM.offset*2.5);

    let sign = new BitBox(OUTPUT_SUBTRACTION_CTX, sign_point, BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, GetCSSColor('--bitBox-color'), "-", true, 15);
    sign.startAppear(TIME_TO_APEAR);
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

    requestAnimationFrame(Subtraction);
}

function Multiplication() {
    if (animationState.multiplication.hilight_2.isMoving) {
        current_boxPosition = animationState.multiplication.hilight_2.object.position;
        
        current_boxPosition.x += MOVING_BOX_SPEED * 2;

        if (current_boxPosition.x <= animationState.multiplication.hilight_2.stop_x) {
            animationState.multiplication.hilight_2.isMoving = false;
            animationState.multiplication.hilight_1.stop_x = OUTPUT_MULTIPLICATION.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset*2;
            current_boxPosition.x = animationState.multiplication.hilight_2.stop_x;
            animationState.multiplication.hilight_1.isMoving = true;
            animationState.multiplication.indexNumber_1 = 0;

            let hilight_witdh = BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset*2;
            let hilight_height = BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset*2;

            let animationBox_point = new Point(OUTPUT_MULTIPLICATION.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset*2, BIT_BOX_PARAM.offset);

            animationState.multiplication.hilight_1.object = new BitBox(OUTPUT_MULTIPLICATION_CTX, animationBox_point, hilight_witdh, hilight_height, 6, GetCSSColor('--hilight-color'), "", true, 15);
            animationState.multiplication.hilight_1.object.startAppear(TIME_TO_APEAR);
            animationState.multiplication.bits.additional.push(animationState.multiplication.hilight_1.object);
        }

        if (animationState.multiplication.hilight_2.stop_x < animationState.multiplication.hilight_2.end_x) {
            animationState.multiplication.hilight_2.object.startDelete(TIME_TO_DISAPEAR);
            animationState.multiplication.hilight_2.isMoving = false;
            animationState.multiplication.isAdding = true;

            let hilight_witdh = BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset * 2;
            let hilight_height = (BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset) * animationState.multiplication.bits.numbers.length + BIT_BOX_PARAM.offset;

            let animationBox_point = new Point(OUTPUT_MULTIPLICATION.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset*3, BIT_BOX_PARAM.height*2 + BIT_BOX_PARAM.offset*3);

            animationState.multiplication.hilight_addition.object = new BitBox(OUTPUT_MULTIPLICATION_CTX, animationBox_point, hilight_witdh, hilight_height, 6, GetCSSColor('--hilight-color'), "", true, 15);
            animationState.multiplication.hilight_addition.object.startAppear(TIME_TO_APEAR);
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
            animationState.multiplication.hilight_1.object.startDelete(TIME_TO_DISAPEAR);
            animationState.multiplication.hilight_2.isMoving = true;
            animationState.multiplication.hilight_1.isMoving = false;
            animationState.multiplication.hilight_2.stop_x -= BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
            animationState.multiplication.indexNumber_2++;
        }
    } else if (animationState.multiplication.isAdding) {
        current_boxPosition = animationState.multiplication.hilight_addition.object.position;

        if (animationState.multiplication.hilight_addition.isMoving) {
            current_boxPosition.x += MOVING_BOX_SPEED*2;
    
            if (current_boxPosition.x <= animationState.multiplication.hilight_addition.stop_x) {
                animationState.multiplication.hilight_addition.isMoving = false;
                current_boxPosition.x = animationState.multiplication.hilight_addition.stop_x;
            }
            if (animationState.multiplication.hilight_addition.stop_x < animationState.multiplication.hilight_addition.end_x) {
                animationState.multiplication.hilight_addition.object.startDelete(TIME_TO_DISAPEAR);
                animationState.multiplication.isPlaying = false;
            }
        } else {
            let currAns = parseInt(animationState.multiplication.addingImaginary);
            for (let currTempNumber = 0; currTempNumber <= Math.min(animationState.multiplication.indexAddition, 7); currTempNumber++) {
                let currIndex = animationState.multiplication.indexAddition - currTempNumber;
                let number = IsOutOfBounds(currIndex, animationState.multiplication.bits.numbers[currTempNumber]);

                currAns += parseInt(number);
            }

            let ans = parseInt(currAns) % 2;

            let startY = BIT_BOX_PARAM.height*2 + BIT_BOX_PARAM.offset*4;
            let ans_point = new Point(animationState.multiplication.hilight_addition.stop_x + BIT_BOX_PARAM.offset,
                startY + (BIT_BOX_PARAM.height+BIT_BOX_PARAM.offset) * animationState.multiplication.indexNumber_2);

            ansBox = new BitBox(OUTPUT_MULTIPLICATION_CTX, ans_point, BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, GetCSSColor('--ansBox-color'), ans.toString(), true, 15);
            ansBox.startAppear(TIME_TO_APEAR);
            animationState.multiplication.bits.additional.push(ansBox);

            animationState.multiplication.addingImaginary = Math.max(currAns / 2, 0);
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

        tempAnsBox = new BitBox(OUTPUT_MULTIPLICATION_CTX, tempAns_point, BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, GetCSSColor('--imaginary-color'), ans.toString(), true, 15);
        tempAnsBox.startAppear(TIME_TO_APEAR);
        animationState.multiplication.bits.additional.push(tempAnsBox);
        animationState.multiplication.bits.numbers[animationState.multiplication.indexNumber_2].push(tempAnsBox);

        animationState.multiplication.indexNumber_1++;
        animationState.multiplication.hilight_1.stop_x -= BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
        animationState.multiplication.hilight_1.isMoving = true;
    }

    if (animationState.multiplication.isPlaying) requestAnimationFrame(Multiplication);
}

function StartAnimation_Multiplication() {
    if (animationState.multiplication.bits.number_1.length <= 0 && animationState.multiplication.bits.number_2.length <= 0) return;
    if (animationState.multiplication.isPlaying) return;

    DeleteOperationResult("input_decimalNumberMultiplication_1");

    let hilight_witdh = BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset*2;
    let hilight_height = BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset*2;

    let muliplicationBox_point = new Point(OUTPUT_MULTIPLICATION.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset*3, BIT_BOX_PARAM.offset);

    animationState.multiplication.hilight_1.object = new BitBox(OUTPUT_MULTIPLICATION_CTX, muliplicationBox_point.clone, hilight_witdh, hilight_height, 6, GetCSSColor('--hilight-color'), "", true, 15);
    animationState.multiplication.hilight_1.object.startAppear(TIME_TO_APEAR);
    animationState.multiplication.bits.additional.push(animationState.multiplication.hilight_1.object);

    muliplicationBox_point.y = BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset*2;

    animationState.multiplication.hilight_2.object = new BitBox(OUTPUT_MULTIPLICATION_CTX, muliplicationBox_point, hilight_witdh, hilight_height, 6, GetCSSColor('--hilight-color'), "", true, 15);
    animationState.multiplication.hilight_2.object.startAppear(TIME_TO_APEAR);
    animationState.multiplication.bits.additional.push(animationState.multiplication.hilight_2.object);

    let countOfNumbers = Math.max(animationState.multiplication.bits.number_1.length, animationState.multiplication.bits.number_2.length);
    let sign_point = new Point(OUTPUT_MULTIPLICATION.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset * 2 - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * countOfNumbers,
        BIT_BOX_PARAM.height*0.5 + BIT_BOX_PARAM.offset*2.5);

    animation_multiplication_sign = new BitBox(OUTPUT_MULTIPLICATION_CTX, sign_point, BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, GetCSSColor('--bitBox-color'), "×", true, 15);
    animation_multiplication_sign.startAppear(TIME_TO_APEAR);
    animationState.multiplication.bits.additional.push(animation_multiplication_sign);

    СanvasResize(OUTPUT_MULTIPLICATION, 1010, (animationState.multiplication.bits.number_2.length + 3) * (BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset) + BIT_BOX_PARAM.offset*3);

    animationState.multiplication.bits.numbers = [];
    for (let i = 0; i<animationState.multiplication.bits.number_2.length; i++)
        animationState.multiplication.bits.numbers.push([]);

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

    requestAnimationFrame(Multiplication);
}

function Division() {
    let current_boxPosition = animationState.division.hilight.object.position;

    if (animationState.division.hilight.isMoving) {
        if (animationState.division.timeStoper < TIME_TO_STOP) {
            animationState.division.timeStoper++;
            return requestAnimationFrame(Division);
        }

        current_boxPosition.x += -MOVING_BOX_SPEED;

        if (current_boxPosition.x >= animationState.division.hilight.stop_x) {
            animationState.division.hilight.isMoving = false;
            current_boxPosition.x = animationState.division.hilight.stop_x;
        }
        if (animationState.division.hilight.stop_x >= animationState.division.hilight.end_x) {
            animationState.division.hilight.object.startDelete(TIME_TO_DISAPEAR);
            animationState.division.isPlaying = false;
        }
    } else {
        if (animationState.division.addingCurrNumber) {
            let currChar = animationState.division.bits.number_2[animationState.division.addingIndex].getText;
            let currentPoint = new Point(current_boxPosition.x + BIT_BOX_PARAM.offset - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * (animationState.division.bits.number_2.length - 1 - animationState.division.addingIndex),
                animationState.division.currentY);

            let imaginatyBox = new BitBox(OUTPUT_DIVISION_CTX, currentPoint, BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, GetCSSColor('--imaginary-color'), currChar, true, 15);
            imaginatyBox.startAppear(TIME_TO_APEAR);
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
            let currentPoint = new Point(current_boxPosition.x + BIT_BOX_PARAM.offset - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * (animationState.division.ansBinary.length - 1 - animationState.division.addingIndex),
                animationState.division.currentY);
            
            let imaginatyBox = new BitBox(OUTPUT_DIVISION_CTX, currentPoint, BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, GetCSSColor('--imaginary-color'), currChar, true, 15);
            imaginatyBox.startAppear(TIME_TO_APEAR);
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
        animationState.division.currentDivisionNum += parseInt(animationState.division.bits.number_1[animationState.division.index].getText);
        
        if (animationState.division.copyLower) {
            let currChar = animationState.division.bits.number_1[animationState.division.index].getText;
            let currentPoint = new Point(current_boxPosition.x + BIT_BOX_PARAM.offset, animationState.division.currentY);
            
            let imaginatyBox = new BitBox(OUTPUT_DIVISION_CTX, currentPoint, BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, GetCSSColor('--imaginary-color'), currChar, true, 15);
            imaginatyBox.startAppear(TIME_TO_APEAR);
            animationState.division.bits.additional.push(imaginatyBox);
        }

        let ansBox;
        let ansBox_point = new Point(OUTPUT_DIVISION.width - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset)*(animationState.division.bits.number_1.length - animationState.division.index) - BIT_BOX_PARAM.offset,
            BIT_BOX_PARAM.offset*5 + BIT_BOX_PARAM.width);
        
        if (animationState.division.currentDivisionNum >= animationState.division.currentNum_2) {
            ansBox = new BitBox(OUTPUT_DIVISION_CTX, ansBox_point, BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, GetCSSColor('--ansBox-color'), "1", true, 15);
            ansBox.startAppear(TIME_TO_APEAR);
            animationState.division.bits.additional.push(ansBox);
            
            animationState.division.currentDivisionNum -= animationState.division.currentNum_2;
            animationState.division.currentY += BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset;

            animationState.division.ansBinary = DecToBin(animationState.division.currentDivisionNum);
            animationState.division.addingCurrNumber = true;
            animationState.division.addingIndex = animationState.division.bits.number_2.length - 1;

            animationState.division.copyLower = true;
            return requestAnimationFrame(Division);
        } else {
            ansBox = new BitBox(OUTPUT_DIVISION_CTX, ansBox_point, BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, GetCSSColor('--ansBox-color'), "0", true, 15);
            ansBox.startAppear(TIME_TO_APEAR);
            animationState.division.bits.additional.push(ansBox);
        }

        animationState.division.hilight.isMoving = true;
        animationState.division.timeStoper = 0;
        animationState.division.index++;
        animationState.division.hilight.stop_x += BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
    }

    if (animationState.division.isPlaying) requestAnimationFrame(Division);
}

function StartAnimation_Division() {
    if (animationState.division.bits.number_1.length <= 0 && animationState.division.bits.number_2.length <= 0) return;
    if (animationState.division.isPlaying) return;

    if (INPUT_DIVISION_2.value == "0") return;

    DeleteOperationResult("input_decimalNumberDivision_1");

    let hilight_witdh = BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset*2;
    let hilight_height = BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset*2;

    let divisionBox_point = new Point(OUTPUT_DIVISION.width - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset)*16 - BIT_BOX_PARAM.offset * 3, BIT_BOX_PARAM.offset*2);

    animationState.division.hilight.object = new BitBox(OUTPUT_DIVISION_CTX, divisionBox_point, hilight_witdh, hilight_height, 6, GetCSSColor('--hilight-color'), "", true, 15);
    animationState.division.hilight.object.startAppear(TIME_TO_APEAR);
    animationState.division.bits.additional.push(animationState.division.hilight.object);

    let countOfOperations = 0, currNum2 = parseInt(INPUT_DIVISION_2.value), currNum = 0;

    for (let currInd = 0; currInd<animationState.division.bits.number_1.length; currInd++) {
        currNum *= 2;
        currNum += parseInt(animationState.division.bits.number_1[currInd].getText);

        if (currNum >= currNum2) {
            countOfOperations++;
            currNum -= currNum2;
        }
    }

    let windowHeight = Math.max(85, (BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset) * (countOfOperations * 2 + 1) + BIT_BOX_PARAM.offset*3);
    СanvasResize(OUTPUT_DIVISION, 1010, windowHeight);

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

    requestAnimationFrame(Division);
}

function Animate(currentTime) {
    for (let currentCanva of OUTPUT_CTX)
        if (currentCanva.visible)
            ClearCanvasWithTransforms(currentCanva.ctx, currentCanva.canva, GetCSSColor('--canva-color'));

    for (let currentAnimationName of ANIMATION_NAMES) {
        let currentAnimation = animationState[currentAnimationName];
        for (let currentKey in currentAnimation.bits) {
            let currentList =  currentAnimation.bits[currentKey];
            for (let currentElement = 0; currentElement < currentList.length; currentElement++) {
                let element = currentList[currentElement];
                if (!Array.isArray(element)) {
                    if (element == null) continue;

                    if (element.canDelete) {
                        currentList.splice(currentElement, 1);
                        currentElement--;
                        continue;
                    }

                    const CURRENT_CANVA = OUTPUT_CTX.find(Item => Item.ctx === element.getCTX);
                
                    if (CURRENT_CANVA.visible) {
                        element.update(currentTime);
                        element.draw();
                    }
                } else {
                    for (let currentBoxIndex = 0; currentBoxIndex < element.length; currentBoxIndex++) {
                        let currBox = element[currentBoxIndex];
                        if (currBox == null) continue;

                        if (currBox.canDelete) {
                            element.splice(currentBoxIndex, 1);
                            currentBoxIndex--;
                            continue;
                        }
                    
                        const CURRENT_CANVA = OUTPUT_CTX.find(Item => Item.ctx === currBox.getCTX);
                
                        if (CURRENT_CANVA.visible) {
                            currBox.update(currentTime);
                            currBox.draw();
                        }
                    }
                }
            }
        }
    }

    if (animationState.division.bits.number_1.length | animationState.division.bits.number_2.length > 0) {
        if (animationState.division.lineRenderPercent < 1)
            animationState.division.lineRenderPercent += LINE_RENDER_SPEED;
        else animationState.division.lineRenderPercent = 1;
    } else if (animationState.division.lineRenderPercent > 0)
        animationState.division.lineRenderPercent -= LINE_RENDER_SPEED;
    else animationState.division.lineRenderPercent = 0;

    if (animationState.division.lineRenderPercent > 0) DrawLine();

    requestAnimationFrame(Animate);
}

function DrawLine() {
    let lineX = OUTPUT_DIVISION.width - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset)*8 - BIT_BOX_PARAM.offset * 2;
    let lineXLen = (BIT_BOX_PARAM.offset + BIT_BOX_PARAM.width) * Math.max(animationState.division.bits.number_2.length, 8);

    let offSetLine_1 = lineXLen * animationState.division.lineRenderPercent;
    let offSetLine_2 = (BIT_BOX_PARAM.offset*5 + BIT_BOX_PARAM.height*2) * animationState.division.lineRenderPercent;

    GlowingLine(OUTPUT_DIVISION_CTX, lineX, BIT_BOX_PARAM.offset*4 + BIT_BOX_PARAM.height, 
        lineX + offSetLine_1, BIT_BOX_PARAM.offset*4 + BIT_BOX_PARAM.height, 2.5, "#ffffff", true, 15);
    
    GlowingLine(OUTPUT_DIVISION_CTX, lineX, BIT_BOX_PARAM.offset*2, 
        lineX, BIT_BOX_PARAM.offset + offSetLine_2, 2.5, "#ffffff", true, 15);
}

function EventListeners() {
    INPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE.addEventListener('input', 
        (event) => { Input_Filter(event, false); });
    INPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE.addEventListener('input', 
        (event) => { Input_IntDecToBin(event, OUTPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE_CTX, false); });

    INPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE.addEventListener('input', 
        (event) => { Input_IntDecToBin(event, OUTPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE_CTX, true); });

    INPUT_FLOAT_TO_BINARY_NUMBER.addEventListener('input', 
        (event) => { Input_FloatDecToBin(event, OUTPUT_FLOAT_TO_BINARY_NUMBER_CTX); });

    INPUT_ADDITION_1.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_ADDITION_2.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_ADDITION_1.addEventListener('input', AddBit);
    INPUT_ADDITION_2.addEventListener('input', AddBit);

    INPUT_SUBTRACTION_1.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_SUBTRACTION_2.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_SUBTRACTION_1.addEventListener('input', AddBit);
    INPUT_SUBTRACTION_2.addEventListener('input', AddBit);

    INPUT_MULTIPLICATION_1.addEventListener('input', 
        (event) => { Input_Filter(event, false, "char"); });
    INPUT_MULTIPLICATION_2.addEventListener('input', 
        (event) => { Input_Filter(event, false, "char"); });
    INPUT_MULTIPLICATION_1.addEventListener('input', AddBit);
    INPUT_MULTIPLICATION_2.addEventListener('input', AddBit);

    INPUT_DIVISION_1.addEventListener('input', 
        (event) => { Input_Filter(event, false, "char"); });
    INPUT_DIVISION_2.addEventListener('input', 
        (event) => { Input_Filter(event, false, "char"); });
    INPUT_DIVISION_1.addEventListener('input', AddBit);
    INPUT_DIVISION_2.addEventListener('input', AddBit);
}

function AddBit(event) {
    if (!CanType(this.id)) return;
    DeleteOperationResult(this.id);

    let binNumber = "";
    if (IsNumber(event.target.value)) {
        let number = parseInt(event.target.value);
        binNumber = DecToBin(number);
    }

    let currentList = InputList(this.id);
    const CANVA_AND_CTX = GetCanvaAndCtx(this.id);
    const SETTINGS = GetCurrentSettings(this.id, CANVA_AND_CTX.canva, currentList.length, binNumber.length);

    if (currentList.length < binNumber.length) {
        for (let i = currentList.length; i<binNumber.length; i++) {
            let currentBit = binNumber[binNumber.length - i - 1];
            let currentBox = new BitBox(CANVA_AND_CTX.ctx, new Point(0, 0), BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, GetCSSColor('--bitBox-color'), currentBit, true, 15);
            currentBox.startAppear(TIME_TO_APEAR);
            currentList.unshift(currentBox);
        }
    } else if (currentList.length > binNumber.length) {
        let endInd = currentList.length - binNumber.length;
        if (SETTINGS.reverse) currentList.reverse();

        for (let i = 0; i<endInd; i++) currentList[i].startDelete(TIME_TO_DISAPEAR);

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
            else currentBox.changeText(currentBox.getText);
        }

        if ((currentBox.getText == binNumber[textIndex] && currentBox.getNextText == binNumber[textIndex]) || (currentBox.getText != binNumber[textIndex] && currentBox.getNextText == binNumber[textIndex])) continue;

        currentBox.changeText(binNumber[textIndex]);
    }
}

function GetCurrentSettings(inputID, canva, listLen, binNumberLen) {
    if (inputID == "input_decimalNumberDivision_1" || inputID == "input_decimalNumberDivision_2") {
        let currentPoint = new Point(OUTPUT_DIVISION.width - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset)*16 - BIT_BOX_PARAM.offset*2,
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
    if (index >= 0 && index < listOfBitBoxes.length) return listOfBitBoxes[index].getText;
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

function CanType(inputID) {
    if (inputID == "input_decimalNumberAddition_1" || inputID == "input_decimalNumberAddition_2") return !animationState.addition.isPlaying;
    if (inputID == "input_decimalNumberSubtraction_1" || inputID == "input_decimalNumberSubtraction_2") return !animationState.subtraction.isPlaying;
    if (inputID == "input_decimalNumberMultiplication_1" || inputID == "input_decimalNumberMultiplication_2") return !animationState.multiplication.isPlaying;
    if ((inputID == "input_decimalNumberDivision_1" || inputID == "input_decimalNumberDivision_2")) return !animationState.division.isPlaying;
    return true;
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
            currBox.startDelete(TIME_TO_DISAPEAR);
    else if ((inputID == "input_decimalNumberSubtraction_1" || inputID == "input_decimalNumberSubtraction_2"))
        for (let currBox of animationState.subtraction.bits.additional)
            currBox.startDelete(TIME_TO_DISAPEAR);
    else if ((inputID == "input_decimalNumberMultiplication_1" || inputID == "input_decimalNumberMultiplication_2")) {
        for (let currBox of animationState.multiplication.bits.additional)
            currBox.startDelete(TIME_TO_DISAPEAR);
        for (let currBoxList of animationState.multiplication.bits.numbers)
            for (let currBox of currBoxList)
                currBox.startDelete(TIME_TO_DISAPEAR);

        if (OUTPUT_MULTIPLICATION.height != 75)
            СanvasResize(OUTPUT_MULTIPLICATION, 1010, 75);
    } else if ((inputID == "input_decimalNumberDivision_1" || inputID == "input_decimalNumberDivision_2")) {
        for (let currBox of animationState.division.bits.additional)
            currBox.startDelete(TIME_TO_DISAPEAR);
        if (OUTPUT_DIVISION.height != 85)
            СanvasResize(OUTPUT_DIVISION, 1010, 85);
    }
}

function GetCanvaAndCtx(inputID) {
    if (inputID == "input_decimalNumberAddition_1" || inputID == "input_decimalNumberAddition_2")
        return OUTPUT_CTX[2];

    if (inputID == "input_decimalNumberSubtraction_1" || inputID == "input_decimalNumberSubtraction_2")
        return OUTPUT_CTX[3];

    if (inputID == "input_decimalNumberMultiplication_1" || inputID == "input_decimalNumberMultiplication_2")
        return OUTPUT_CTX[4];

    if (inputID == "input_decimalNumberDivision_1" || inputID == "input_decimalNumberDivision_2")
        return OUTPUT_CTX[5];
}

function СanvasResize(canvasElement, width, height) {
    const START_WIDTH = canvasElement.width;
    const START_HEIGHT = canvasElement.height;
    const DURATION = 750;
    let StartTime = null;
    function Step(Timestamp) {
        if (!StartTime) StartTime = Timestamp;
        const Progress = Math.min((Timestamp - StartTime) / DURATION, 1);
        canvasElement.width = START_WIDTH + (width - START_WIDTH) * EaseOutCubic(Progress);
        canvasElement.height = START_HEIGHT + (height - START_HEIGHT) * EaseOutCubic(Progress);
        if (Progress < 1) requestAnimationFrame(Step);
    }
    requestAnimationFrame(Step);
    requestAnimationFrame(Animate);
}

function BitColor(indexOfBit) {
    if (indexOfBit == 0) return GetCSSColor('--float-sign-color');
    else if (indexOfBit < 9) return GetCSSColor('--float-power-color');
    else return GetCSSColor('--float-mantissa-color');
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

function DecToBin_Float(inputElement) {
    const value = parseFloat(inputElement.value);
    if (isNaN(value)) return "";

    const MAX_FLOAT32 = 3.4028234663852886e+38;
    const MIN_FLOAT32 = 1.1754943508222875e-38;
    const ABSOLUTE_VALUE = Math.abs(value);

    let buffer, view;

    if (value !== 0 && (ABSOLUTE_VALUE > MAX_FLOAT32 || ABSOLUTE_VALUE < MIN_FLOAT32))
        inputElement.value = clamp(ABSOLUTE_VALUE, MIN_FLOAT32, MAX_FLOAT32) * Math.sign(value);

    buffer = new ArrayBuffer(4);
    view = new DataView(buffer);
    view.setFloat32(0, value, false);

    let binaryString = "";
    const BYTE_LENGTH = buffer.byteLength;

    for (let i = 0; i < BYTE_LENGTH; i++) {
        let bits = view.getUint8(i).toString(2).padStart(8, '0');
        binaryString += bits;
    }

    return binaryString;
}

function Input_Filter(event, canBeNegative, type = "int") {
    limits = {
        "int": {"min": -2147483648, "max": 2147483647},
        "short": {"min": -32768, "max": 32767},
        "char": {"min": -128, "max": 127}
    }

    event.target.value = numberFilter(event.target.value, canBeNegative);
    if (IsNumber(event.target.value))
        event.target.value = clamp(parseInt(event.target.value), limits[type].min, limits[type].max);
}

function numberFilter(inputString, canBeNegative) { 
    let cleaned = inputString.replace(/[^0-9-]/g, "").replace(/\s/g, '');
    if (cleaned.includes("-")) {
        let isNegative = cleaned.startsWith("-");
        let onlyDigits = cleaned.replace(/-/g, "");
        cleaned = (isNegative && canBeNegative ? "-" : "") + onlyDigits;
    }
    return cleaned;
}
function IsNumber     (value)         { return !(value.length == 0 || (value.length == 1 && value == "-")); }
function reverseString(string)        { return string.split("").reverse().join(""); }
function clamp        (val, min, max) { return Math.min(Math.max(val, min), max); }
