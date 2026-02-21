//* ---------- Variables ----------
//* ---- HTML Elements ----
const INPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE  = document.getElementById('input_decimalNumber_positive');
const OUTPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE = document.getElementById('output_decimalNumber_positive');
const OUTPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE_CTX = OUTPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE.getContext("2d");

const INPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE = document.getElementById('input_decimalNumber_negative');
const OUTPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE = document.getElementById('output_decimalNumber_negative');
const OUTPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE_CTX = OUTPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE.getContext("2d");

const INPUT_FLOAT_TO_BINARY_NUMBER = document.getElementById('input_floatNumber');
const OUTPUT_FLOAT_TO_BINARY_NUMBER = document.getElementById('output_floatNumber');
const OUTPUT_FLOAT_TO_BINARY_NUMBER_CTX = OUTPUT_FLOAT_TO_BINARY_NUMBER.getContext("2d");

const INPUT_SUM_1 = document.getElementById('input_decimalNumberSum_1');
const INPUT_SUM_2 = document.getElementById('input_decimalNumberSum_2');
const OUTPUT_SUM = document.getElementById('additionAnimation');
const OUTPUT_SUM_CTX = OUTPUT_SUM.getContext("2d");

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
    {"ctx": OUTPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE_CTX, "canva": OUTPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE},
    {"ctx": OUTPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE_CTX, "canva": OUTPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE},
    {"ctx": OUTPUT_SUM_CTX, "canva": OUTPUT_SUM},
    {"ctx": OUTPUT_SUBTRACTION_CTX, "canva": OUTPUT_SUBTRACTION},
    {"ctx": OUTPUT_MULTIPLICATION_CTX, "canva": OUTPUT_MULTIPLICATION},
    {"ctx": OUTPUT_DIVISION_CTX, "canva": OUTPUT_DIVISION},
    {"ctx": OUTPUT_FLOAT_TO_BINARY_NUMBER_CTX, "canva": OUTPUT_FLOAT_TO_BINARY_NUMBER}
];

window.onload = () => {
    ScrollToRight(OUTPUT_SUM.parentElement);
    ScrollToRight(OUTPUT_SUBTRACTION.parentElement);
    ScrollToRight(OUTPUT_MULTIPLICATION.parentElement);
    ScrollToRight(OUTPUT_DIVISION.parentElement);
}

//* ---- Other ----

const BIT_BOX_WIDTH = 25;
const BIT_BOX_HEIGHT = 25;
const OFFSET = 5;

const TIME_TO_APEAR = 500;
const TIME_TO_DISAPEAR = 500;

const MOVING_BOX_SPEED = -1.5;
const TIME_TO_STOP = 25;

let animation_addition = false, animation_addition_moving = false, animation_addition_addedBox = false;
let animation_addition_stop_x = 0, animation_addition_box_edge_x = 0;
let animation_addition_currentIndex = 0, animation_addition_imaginary = 0, animation_addition_currentTimeToStop = 0;
let animation_addition_hilightBox = null, animation_addition_imaginaryBox = null, animation_addition_plus = null;

let animation_subtraction = false, animation_subtraction_moving_hilight = false, animation_subtraction_moving_check = false;
let animation_subtraction_imaginary_moving = false, animation_subtraction_imaginary_movingDirection = 1, animation_subtraction_imaginary_index = 0;
let animation_subtraction_imaginary_stop_x = 0;
let animation_subtraction_stop_x = 0, animation_subtraction_box_edge_x = 0;
let animation_subtraction_currentIndex = 0, animation_subtraction_imaginaryIndex = 0, animation_subtraction_currentTimeToStop = 0;
let numberBits_subtraction_1_imaginary = [];
let animation_subtraction_hilightBox = null, animation_subtraction_imaginaryBox = null, animation_subtraction_minus = null;

let numberBits_decNumber = [];
let numberBits_addition_1 = [], numberBits_addition_2 = [], numberAdditionalThings_addition = [];
let numberBits_subtraction_1 = [], numberBits_subtraction_2 = [], numberAdditionalThings_subtraction = [];

let newList = [
    numberBits_decNumber, 
    numberAdditionalThings_addition, numberBits_addition_1, numberBits_addition_2, 
    numberAdditionalThings_subtraction, numberBits_subtraction_1, numberBits_subtraction_2, numberBits_subtraction_1_imaginary
];

EventListeners();
requestAnimationFrame(Animate);

//* ---------- Functions ----------
function Input_DecToBin(event, canva_ctx) {
    let binNumber = "";
    if (IsNumber(event.target.value)) {
        let number = clamp(parseInt(event.target.value), -2147483648, 2147483647);
        binNumber = DecToBin(number);
    }

    if (numberBits_decNumber.length < binNumber.length) {
        for (let i = numberBits_decNumber.length; i<binNumber.length; i++) {
            let currentBit = binNumber[i];
            let currentBox = new BitBox(canva_ctx, 0, 0, BIT_BOX_WIDTH, BIT_BOX_HEIGHT, 6, GetCSSColor('--bitBox-color'), currentBit, true, 15);
            currentBox.startAppear(TIME_TO_APEAR);
            numberBits_decNumber.push(currentBox);
        }
    } else if (numberBits_decNumber.length > binNumber.length) {
        for (let i = binNumber.length; i<numberBits_decNumber.length; i++) numberBits_decNumber[i].startDelete(TIME_TO_DISAPEAR);
    }

    let currentX = OFFSET*2.5;
    let currentY = OFFSET*2.5;

    for (let i = 0; i<numberBits_decNumber.length; i++) {
        let currentBox = numberBits_decNumber[i], textIndex = Math.min(binNumber.length-1, i);
        currentBox.setPosition(currentX, currentY);
        currentX += BIT_BOX_WIDTH + OFFSET;

        if (currentBox.isDeletingAnimation) continue;

        if ((currentBox.getText == binNumber[textIndex] && currentBox.getNextText == binNumber[textIndex]) || (currentBox.getText != binNumber[textIndex] && currentBox.getNextText == binNumber[textIndex])) continue;

        currentBox.changeText(binNumber[textIndex]);
        numberBits_decNumber[i] = currentBox;
    }
}

function Addition(currentTime) {
    let current_boxPosition = animation_addition_hilightBox.position;

    if (animation_addition_moving) {
        if (animation_addition_currentTimeToStop < TIME_TO_STOP) {
            animation_addition_currentTimeToStop++;
            return requestAnimationFrame(Addition);
        }
        
        current_boxPosition.x += MOVING_BOX_SPEED;

        if (current_boxPosition.x <= animation_addition_stop_x) {
            animation_addition_moving = false;
            current_boxPosition.x = animation_addition_stop_x;
        }
        if (animation_addition_stop_x < animation_addition_box_edge_x) {
            animation_addition_hilightBox.startDelete(TIME_TO_DISAPEAR);
            animation_addition = false;
        }
        animation_addition_hilightBox.setPosition(current_boxPosition.x, current_boxPosition.y);

        animation_addition_addedBox = false;
    } else if (!animation_addition_addedBox) {
        let number_1_index = numberBits_addition_1.length - 1 - animation_addition_currentIndex;
        let number_1 = (number_1_index >= 0)?numberBits_addition_1[number_1_index].getText : 0;

        let number_2_index = numberBits_addition_2.length - 1 - animation_addition_currentIndex;
        let number_2 = (number_2_index >= 0)?numberBits_addition_2[number_2_index].getText : 0;

        let ans = parseInt(number_1) + parseInt(number_2) + (animation_addition_imaginaryBox != null);
        animation_addition_imaginary = Math.floor(ans/2);

        if (animation_addition_imaginaryBox != null)
            animation_addition_imaginaryBox.startDelete(TIME_TO_DISAPEAR);

        animation_addition_imaginaryBox = null;

        if (animation_addition_imaginary == 1) {
            ans -= 2;

            if (!(number_1_index == 0 && number_1_index == 0)) {

            let imaginaryBox_x = animation_addition_stop_x - BIT_BOX_WIDTH,
                imaginaryBox_y = current_boxPosition.y - BIT_BOX_HEIGHT;

            animation_addition_imaginaryBox = new BitBox(OUTPUT_SUM_CTX, imaginaryBox_x, imaginaryBox_y, BIT_BOX_WIDTH, BIT_BOX_HEIGHT, 6, GetCSSColor('--imagery-color'), 1, true, 15);
            animation_addition_imaginaryBox.startAppear(TIME_TO_APEAR);
            numberAdditionalThings_addition.push(animation_addition_imaginaryBox);
            }
        }

        let ansBox_x = animation_addition_stop_x + OFFSET,
            ansBox_y = current_boxPosition.y + BIT_BOX_HEIGHT * 2 + OFFSET * 3;

        let ansBox = new BitBox(OUTPUT_SUM_CTX, ansBox_x, ansBox_y, BIT_BOX_WIDTH, BIT_BOX_HEIGHT, 6, GetCSSColor('--ansBox-color'), ans.toString(), true, 15);
        ansBox.startAppear(TIME_TO_APEAR);
        numberAdditionalThings_addition.push(ansBox);

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

    for (let currBox of numberAdditionalThings_addition)
        currBox.startDelete(TIME_TO_DISAPEAR);

    let hilight_witdh = BIT_BOX_WIDTH + OFFSET*2;
    let hilight_height = BIT_BOX_HEIGHT*2 + OFFSET*3;

    let animation_addition_box_x = OUTPUT_SUM.width - BIT_BOX_WIDTH * 2 - OFFSET*2;
    let animation_addition_box_y = BIT_BOX_HEIGHT + OFFSET*2;

    animation_addition_hilightBox = new BitBox(OUTPUT_SUM_CTX, animation_addition_box_x, animation_addition_box_y, hilight_witdh, hilight_height, 6, GetCSSColor('--additionBox-color'), "", true, 15);
    animation_addition_hilightBox.startAppear(TIME_TO_APEAR);
    numberAdditionalThings_addition.push(animation_addition_hilightBox);

    let countOfNumbers = Math.max(numberBits_addition_1.length, numberBits_addition_2.length);
    let plus_x = OUTPUT_SUM.width - (BIT_BOX_WIDTH + OFFSET)*(countOfNumbers+1) - BIT_BOX_WIDTH,
        plus_y = BIT_BOX_HEIGHT*2 + OFFSET;

    animation_addition_plus = new BitBox(OUTPUT_SUM_CTX, plus_x, plus_y, BIT_BOX_WIDTH, BIT_BOX_HEIGHT, 6, GetCSSColor('--bitBox-color'), "+", true, 15);
    animation_addition_plus.startAppear(TIME_TO_APEAR);
    numberAdditionalThings_addition.push(animation_addition_plus);

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

function Subtraction(currentTime) {
    let current_boxPosition = animation_subtraction_hilightBox.position;

    if (animation_subtraction_moving_check) {
        current_boxPosition = animation_subtraction_imaginaryBox.position;

        if (animation_subtraction_imaginary_moving) {
            current_boxPosition.x += MOVING_BOX_SPEED * 2 * animation_subtraction_imaginary_movingDirection;
            animation_subtraction_imaginaryBox.setPosition(current_boxPosition.x, current_boxPosition.y);

            if ((current_boxPosition.x < animation_subtraction_imaginary_stop_x && animation_subtraction_imaginary_movingDirection == 1) ||
                (current_boxPosition.x > animation_subtraction_imaginary_stop_x && animation_subtraction_imaginary_movingDirection == -1)) {
                animation_subtraction_imaginary_moving = false;
                animation_subtraction_imaginaryBox.setPosition(animation_subtraction_imaginary_stop_x, current_boxPosition.y);
            }
        } else {
            let number_1_index = numberBits_subtraction_1.length - 1 - animation_subtraction_imaginary_index;
            let number_1 = (number_1_index >= 0)?numberBits_subtraction_1[number_1_index].getText : 0;
            
            if (animation_subtraction_imaginary_movingDirection == 1) {
                let isLastInd = (animation_subtraction_imaginary_index + 1 == numberBits_subtraction_1.length);
                if (number_1 == 1 || isLastInd) {
                    let imaginaryBox_x = current_boxPosition.x + OFFSET,
                        imaginaryBox_y = current_boxPosition.y + OFFSET;
                    let imaginaryBox = new BitBox(OUTPUT_SUBTRACTION_CTX, imaginaryBox_x, imaginaryBox_y, BIT_BOX_WIDTH, BIT_BOX_HEIGHT, 6, GetCSSColor('--imagery-color'), (isLastInd)?"1":"0", true, 15);
                    numberBits_subtraction_1_imaginary[animation_subtraction_imaginary_index] = imaginaryBox;
                    imaginaryBox.startAppear(TIME_TO_APEAR);

                    animation_subtraction_imaginary_movingDirection *= -1;
                    animation_subtraction_imaginary_stop_x += BIT_BOX_WIDTH + OFFSET;
                    animation_subtraction_imaginary_index--;
                } else {
                    animation_subtraction_imaginary_stop_x -= BIT_BOX_WIDTH + OFFSET;
                    animation_subtraction_imaginary_index++;
                }
            } else {
                let imaginaryBox_x = current_boxPosition.x + OFFSET,
                    imaginaryBox_y = current_boxPosition.y + OFFSET;
                let imaginaryBox = new BitBox(OUTPUT_SUBTRACTION_CTX, imaginaryBox_x, imaginaryBox_y, BIT_BOX_WIDTH, BIT_BOX_HEIGHT, 6, GetCSSColor('--imagery-color'), "1", true, 15);
                numberBits_subtraction_1_imaginary[animation_subtraction_imaginary_index] = imaginaryBox;
                imaginaryBox.startAppear(TIME_TO_APEAR);

                animation_subtraction_imaginary_stop_x += BIT_BOX_WIDTH + OFFSET;
                animation_subtraction_imaginary_index--;

                if(animation_subtraction_imaginary_index <= animation_subtraction_currentIndex) {
                    imaginaryBox_x = animation_subtraction_hilightBox.position.x + OFFSET;
                    imaginaryBox_y = current_boxPosition.y + OFFSET;

                    imaginaryBox = new BitBox(OUTPUT_SUBTRACTION_CTX, imaginaryBox_x, imaginaryBox_y, BIT_BOX_WIDTH, BIT_BOX_HEIGHT, 6, GetCSSColor('--imagery-color'), "2", true, 15);
                    numberBits_subtraction_1_imaginary[animation_subtraction_currentIndex] = imaginaryBox;
                    imaginaryBox.startAppear(TIME_TO_APEAR);

                    animation_subtraction_imaginaryBox.startDelete(TIME_TO_DISAPEAR);
                    animation_subtraction_moving_check = false;
                    animation_subtraction_moving_hilight = false;
                }
            }

            animation_subtraction_imaginary_moving = true;
        }
    } else if (animation_subtraction_moving_hilight) {
        if (animation_subtraction_currentTimeToStop < TIME_TO_STOP) {
            animation_subtraction_currentTimeToStop++;
            return requestAnimationFrame(Subtraction);
        }
        
        current_boxPosition.x += MOVING_BOX_SPEED;

        if (current_boxPosition.x <= animation_subtraction_stop_x) {
            animation_subtraction_moving_hilight = false;
            current_boxPosition.x = animation_subtraction_stop_x;
        }
        if (animation_subtraction_stop_x < animation_subtraction_box_edge_x) {
            animation_subtraction_hilightBox.startDelete(TIME_TO_DISAPEAR);
            animation_subtraction = false;

            for (let currImaginaryBox of numberBits_subtraction_1_imaginary)
                if (currImaginaryBox != null)
                    currImaginaryBox.startDelete(TIME_TO_DISAPEAR);
        }

        animation_subtraction_hilightBox.setPosition(current_boxPosition.x, current_boxPosition.y);
    } else {
        if (animation_subtraction_imaginaryBox != null)
            animation_subtraction_imaginaryBox.startDelete(TIME_TO_DISAPEAR);

        let number_1_index = numberBits_subtraction_1.length - 1 - animation_subtraction_currentIndex;
        let number_1 = (numberBits_subtraction_1_imaginary[animation_subtraction_currentIndex] != null) ? 
            numberBits_subtraction_1_imaginary[animation_subtraction_currentIndex].getText : 
            IsOutOfBounds(number_1_index, numberBits_subtraction_1);

        let number_2_index = numberBits_subtraction_2.length - 1 - animation_subtraction_currentIndex;
        let number_2 = (number_2_index >= 0)?numberBits_subtraction_2[number_2_index].getText : 0;

        let ans = parseInt(number_1) - parseInt(number_2);
        
        if (ans < 0) {
            let imaginaryBox_witdh = BIT_BOX_WIDTH + OFFSET*2;
            let imaginaryBox_height = BIT_BOX_HEIGHT + OFFSET*2;

            let imaginaryBox_x = animation_subtraction_stop_x - BIT_BOX_WIDTH - OFFSET,
                imaginaryBox_y = current_boxPosition.y;

            animation_subtraction_imaginaryBox = new BitBox(OUTPUT_SUBTRACTION_CTX, imaginaryBox_x, imaginaryBox_y, imaginaryBox_witdh, imaginaryBox_height, 6, GetCSSColor('--imagery-color'), "", true, 15);
            animation_subtraction_imaginaryBox.startAppear(TIME_TO_APEAR);
            numberAdditionalThings_subtraction.push(animation_subtraction_imaginaryBox);

            animation_subtraction_moving_check = true;
            animation_subtraction_imaginary_moving = false;
            animation_subtraction_imaginary_index = animation_subtraction_currentIndex+1;
            animation_subtraction_imaginary_stop_x = imaginaryBox_x;
            animation_subtraction_imaginary_movingDirection = 1;

            return requestAnimationFrame(Subtraction);
        }

        let ansBox_x = animation_subtraction_stop_x + OFFSET,
            ansBox_y = current_boxPosition.y + BIT_BOX_HEIGHT * 2 + OFFSET * 3;

        let ansBox = new BitBox(OUTPUT_SUBTRACTION_CTX, ansBox_x, ansBox_y, BIT_BOX_WIDTH, BIT_BOX_HEIGHT, 6, GetCSSColor('--ansBox-color'), ans.toString(), true, 15);
        ansBox.startAppear(TIME_TO_APEAR);
        numberAdditionalThings_subtraction.push(ansBox);

        animation_subtraction_moving_hilight = true;
        animation_subtraction_currentTimeToStop = 0;
        animation_subtraction_currentIndex++;
        animation_subtraction_stop_x -= BIT_BOX_WIDTH + OFFSET;
    }

    if (animation_subtraction) requestAnimationFrame(Subtraction);
}

function SubtractionOfTwoDec() {
    if (numberBits_subtraction_1.length <= 0 && numberBits_subtraction_2.length <= 0) return;
    if (animation_subtraction) return;

    for (let currBox of numberAdditionalThings_subtraction)
        currBox.startDelete(TIME_TO_DISAPEAR);

    let hilight_witdh = BIT_BOX_WIDTH + OFFSET*2;
    let hilight_height = BIT_BOX_HEIGHT*2 + OFFSET*3;

    let animation_box_x = OUTPUT_SUM.width - BIT_BOX_WIDTH * 2 - OFFSET*2;
    let animation_box_y = BIT_BOX_HEIGHT + OFFSET*2;

    animation_subtraction_hilightBox = new BitBox(OUTPUT_SUBTRACTION_CTX, animation_box_x, animation_box_y, hilight_witdh, hilight_height, 6, GetCSSColor('--additionBox-color'), "", true, 15);
    animation_subtraction_hilightBox.startAppear(TIME_TO_APEAR);
    numberAdditionalThings_subtraction.push(animation_subtraction_hilightBox);

    let countOfNumbers = Math.max(numberBits_subtraction_1.length, numberBits_subtraction_2.length);
    let minus_x = OUTPUT_SUM.width - (BIT_BOX_WIDTH + OFFSET)*(countOfNumbers+1) - BIT_BOX_WIDTH,
        minus_y = BIT_BOX_HEIGHT*2 + OFFSET;

    animation_subtraction_minus = new BitBox(OUTPUT_SUBTRACTION_CTX, minus_x, minus_y, BIT_BOX_WIDTH, BIT_BOX_HEIGHT, 6, GetCSSColor('--bitBox-color'), "-", true, 15);
    animation_subtraction_minus.startAppear(TIME_TO_APEAR);
    numberAdditionalThings_subtraction.push(animation_subtraction_minus);

    for (let i = 0; i<64; i++)
        numberBits_subtraction_1_imaginary[i] = null;

    animation_subtraction = true;
    animation_subtraction_moving_hilight = false;
    animation_subtraction_moving_check = false;
    animation_subtraction_currentTimeToStop = 0;
    animation_subtraction_currentIndex = 0;
    animation_subtraction_stop_x = animation_box_x;
    animation_subtraction_box_edge_x = animation_box_x - (BIT_BOX_WIDTH + OFFSET) * ( Math.max(numberBits_subtraction_1.length, numberBits_subtraction_2.length) - 1 );

    requestAnimationFrame(Subtraction);
}

function Animate(currentTime) {
    for (let currentCanva of OUTPUT_CTX)
        ClearCanvasWithTransforms(currentCanva.ctx, currentCanva.canva, GetCSSColor('--canva-color'));

    for (let currentList of newList) {
        for (let currBoxIndex = 0; currBoxIndex < currentList.length; currBoxIndex++) {
            let box = currentList[currBoxIndex];
            if (box == null) continue;

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
    INPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE.addEventListener('input', 
        (event) => { Input_Filter(event, false); });
    INPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE.addEventListener('input', 
        (event) => { Input_DecToBin(event, OUTPUT_DECIMAL_TO_BINARY_NUMBER_POSITIVE_CTX); });

    INPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE.addEventListener('input', 
        (event) => { Input_DecToBin(event, OUTPUT_DECIMAL_TO_BINARY_NUMBER_NEGATIVE_CTX); });

    INPUT_SUM_1.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_SUM_2.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_SUM_1.addEventListener('input', AddBit);
    INPUT_SUM_2.addEventListener('input', AddBit);

    INPUT_SUBTRACTION_1.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_SUBTRACTION_2.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_SUBTRACTION_1.addEventListener('input', AddBit);
    INPUT_SUBTRACTION_2.addEventListener('input', AddBit);
}

function AddBit(event) {
    if (!CanType(this.id)) return;
    DeleteOperationResult(this.id);

    let binNumber = "";
    if (IsNumber(event.target.value)) {
        let number = clamp(parseInt(event.target.value), -2147483648, 2147483647);
        binNumber = DecToBin(number);
    }

    let currentList = InputList(this.id);
    const CANVA_AND_CTX = GetCanvaAndCtx(this.id);

    if (currentList.length < binNumber.length) {
        currentList.reverse();
        for (let i = currentList.length; i<binNumber.length; i++) {
            let currentBit = binNumber[binNumber.length - i - 1];
            let currentBox = new BitBox(CANVA_AND_CTX.ctx, 0, 0, BIT_BOX_WIDTH, BIT_BOX_HEIGHT, 6, GetCSSColor('--bitBox-color'), currentBit, true, 15);
            currentBox.startAppear(TIME_TO_APEAR);
            currentList.push(currentBox);
        }
        currentList.reverse();
    } else if (currentList.length > binNumber.length) {
        currentList.reverse();
        for (let i = binNumber.length; i<currentList.length; i++) currentList[i].startDelete(TIME_TO_DISAPEAR);
        currentList.reverse();
    }

    let currentX = CANVA_AND_CTX.canva.width - BIT_BOX_WIDTH * 2 - OFFSET;
    let currentY = BIT_BOX_HEIGHT + OFFSET * 3;
    if (SecondNumber(this.id)) currentY += BIT_BOX_HEIGHT + OFFSET;

    for (let i = currentList.length-1; i>=0; i--) {
        let currentBox = currentList[i], textIndex = Math.max(0, binNumber.length - 1 - (currentList.length - 1 - i));
        currentBox.setPosition(currentX, currentY);
        currentX -= BIT_BOX_WIDTH + OFFSET;

        if (currentBox.isDeletingAnimation) continue;

        if ((currentBox.getText == binNumber[textIndex] && currentBox.getNextText == binNumber[textIndex]) || (currentBox.getText != binNumber[textIndex] && currentBox.getNextText == binNumber[textIndex])) continue;

        currentBox.changeText(binNumber[textIndex]);
        currentList[i] = currentBox;
    }

    OutputList(this.id, currentList);
}

function IsOutOfBounds(index, listOfBitBoxes) {
    if (index >= 0) return listOfBitBoxes[index].getText;
    return 0;
}

function InputList(inputID) {
    if (inputID == "input_decimalNumberSum_1") return numberBits_addition_1;
    else if (inputID == "input_decimalNumberSum_2") return numberBits_addition_2;
    else if (inputID == "input_decimalNumberSubtraction_1") return numberBits_subtraction_1;
    else if (inputID == "input_decimalNumberSubtraction_2") return numberBits_subtraction_2;
    else if (inputID == "input_decimalNumberMultiplication_1") return numberBits_addition_1;
    else if (inputID == "input_decimalNumberMultiplication_2") return numberBits_addition_2;
    else if (inputID == "input_decimalNumberDivision_1") return numberBits_addition_1;
    else if (inputID == "input_decimalNumberDivision_2") return numberBits_addition_2;

    return null;
}

function OutputList(inputID, list) {
    if (inputID == "input_decimalNumberSum_1") numberBits_addition_1 = list;
    else if (inputID == "input_decimalNumberSum_2") numberBits_addition_2 = list;
    else if (inputID == "input_decimalNumberSubtraction_1") numberBits_subtraction_1 = list;
    else if (inputID == "input_decimalNumberSubtraction_2") numberBits_subtraction_2 = list;
    else if (inputID == "input_decimalNumberMultiplication_1") numberBits_addition_1 = list;
    else if (inputID == "input_decimalNumberMultiplication_2") numberBits_addition_2 = list;
    else if (inputID == "input_decimalNumberDivision_1") numberBits_addition_1 = list;
    else if (inputID == "input_decimalNumberDivision_2") numberBits_addition_2 = list;
}

function CanType(inputID) {
    if (inputID == "input_decimalNumberSum_1" || inputID == "input_decimalNumberSum_2") return !animation_addition;
    if (inputID == "input_decimalNumberSubtraction_1" || inputID == "input_decimalNumberSubtraction_2") return !animation_subtraction;

    return true;
}

function SecondNumber(inputID) {
    if (inputID == "input_decimalNumberSum_2") return true;
    else if (inputID == "input_decimalNumberSubtraction_2") return true;
    else if (inputID == "input_decimalNumberMultiplication_2") return true;
    else if (inputID == "input_decimalNumberDivision_2") return true;

    return false;
}

function DeleteOperationResult(inputID) {
    if ((inputID == "input_decimalNumberSum_1" || inputID == "input_decimalNumberSum_2"))
        for (let currBox of numberAdditionalThings_addition)
            currBox.startDelete(TIME_TO_DISAPEAR);

    if ((inputID == "input_decimalNumberSubtraction_1" || inputID == "input_decimalNumberSubtraction_2"))
        for (let currBox of numberAdditionalThings_subtraction)
            currBox.startDelete(TIME_TO_DISAPEAR);
}

function GetCanvaAndCtx(inputID) {
    if ((inputID == "input_decimalNumberSum_1" || inputID == "input_decimalNumberSum_2"))
        return {"ctx": OUTPUT_SUM_CTX, "canva": OUTPUT_SUM};

    if ((inputID == "input_decimalNumberSubtraction_1" || inputID == "input_decimalNumberSubtraction_2"))
        return {"ctx": OUTPUT_SUBTRACTION_CTX, "canva": OUTPUT_SUBTRACTION};
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

function Input_Filter(event, canBeNegative, type = "int") {
    limits = {
        "int": {"min": -2147483648, "max": 2147483647},
        "short": {"min": -32768, "max": 32767}
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
