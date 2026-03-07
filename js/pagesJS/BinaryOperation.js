import { DecToBin, Input_Filter, IsNumber } from '../utility.js'

//* ---------- Variables ---------- *//
//* -------- HTML Elements -------- *//
const INPUT_BIT_OR_1 = document.getElementById('input_bitOr_1');
const INPUT_BIT_OR_2 = document.getElementById('input_bitOr_2');
const BUTTON_BIT_OR = document.getElementById('button_bitOr');
const OUTPUT_BIT_OR = document.getElementById('output_bitOr');
const OUTPUT_BIT_OR_CTX = OUTPUT_BIT_OR.getContext("2d");

const INPUT_BIT_AND_1 = document.getElementById('input_bitAnd_1');
const INPUT_BIT_AND_2 = document.getElementById('input_bitAnd_2');
const BUTTON_BIT_AND = document.getElementById('button_bitAnd');
const OUTPUT_BIT_AND = document.getElementById('output_bitAnd');
const OUTPUT_BIT_AND_CTX = OUTPUT_BIT_AND.getContext("2d");

const INPUT_BIT_XOR_1 = document.getElementById('input_bitXor_1');
const INPUT_BIT_XOR_2 = document.getElementById('input_bitXor_2');
const BUTTON_BIT_XOR = document.getElementById('button_bitXor');
const OUTPUT_BIT_XOR = document.getElementById('output_bitXor');
const OUTPUT_BIT_XOR_CTX = OUTPUT_BIT_XOR.getContext("2d");

const INPUT_BIT_NOT = document.getElementById('input_bitNot');
const BUTTON_BIT_NOT = document.getElementById('button_bitNot');
const OUTPUT_BIT_NOT = document.getElementById('output_bitNot');
const OUTPUT_BIT_NOT_CTX = OUTPUT_BIT_NOT.getContext("2d");

const INPUT_BIT_SHIFT_1 = document.getElementById('input_bitShift_1');
const INPUT_BIT_SHIFT_2 = document.getElementById('input_bitShift_2');
const INPUT_BIT_SHIFT_DIRECTION = document.getElementById('shiftDirection');
const BUTTON_BIT_SHIFT = document.getElementById('button_bitShift');
const OUTPUT_BIT_SHIFT = document.getElementById('output_bitShift');
const OUTPUT_BIT_SHIFT_CTX = OUTPUT_BIT_SHIFT.getContext("2d");

const OUTPUT_CTX = [
    {ctx: OUTPUT_BIT_OR_CTX, canva: OUTPUT_BIT_OR, visible: true},
    {ctx: OUTPUT_BIT_AND_CTX, canva: OUTPUT_BIT_AND, visible: true},
    {ctx: OUTPUT_BIT_XOR_CTX, canva: OUTPUT_BIT_XOR, visible: true},
    {ctx: OUTPUT_BIT_NOT_CTX, canva: OUTPUT_BIT_NOT, visible: true},
    {ctx: OUTPUT_BIT_SHIFT_CTX, canva: OUTPUT_BIT_SHIFT, visible: true}
];

window.onload = () => {
    ScrollToRight(OUTPUT_BIT_OR.parentElement);
    ScrollToRight(OUTPUT_BIT_AND.parentElement);
    ScrollToRight(OUTPUT_BIT_XOR.parentElement);
    ScrollToRight(OUTPUT_BIT_NOT.parentElement);
    ScrollToRight(OUTPUT_BIT_SHIFT.parentElement);
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
const TIME_TO_STOP = 15;

const ANIMATION_NAMES = ["bitOr", "bitAnd", "bitXor", "bitNot", "bitShift"];

let animationState = {
    "bitOr": {
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
        }
    },
    "bitAnd": {
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
        }
    },
    "bitXor": {
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
        }
    },
    "bitNot": {
        "isPlaying": false,
        "bits": {
            "additional": [],
            "number": []
        },
        "index": 0,
        "timeStoper": 0,
        "hilight":{
            "object": null,
            "isMoving": false,
            "stop_x": false,
            "end_x": false
        }
    },
    "bitShift": {
        "isPlaying": false,
        "bits": {
            "additional": [],
            "number": []
        },
        "index": 0,
        "shiftNumber": 0,
        "direction": "none",
        "timeStoper": 0,
        "hilight": {
            "object": null,
            "isMoving": false,
            "stop_x": false,
            "end_x": false
        },
        "imaginary": {
            "object": null
        }
    }
};

const CELLS = document.querySelectorAll('td');
CELLS.forEach(cell => {
    cell.style.backgroundColor = GetCSSColor('--canva-color');
    if (cell.textContent.trim() == 1) {
        cell.style.backgroundColor = GetCSSColor('--ansBox-color');
        cell.style.color = "#000000";
        cell.style.fontWeight = 'bold';
    } else if (cell.textContent.trim() == 0) {
        cell.style.backgroundColor = GetCSSColor('--error-color');
        cell.style.color = "#000000";
        cell.style.fontWeight = 'bold';
        cell.style.boxShadow = '0 0 10px '
    }
    cell.style.boxShadow = `0 0 15px ${cell.style.backgroundColor}`;
});

EventListeners();
requestAnimationFrame(Animate);

//* ---------- Functions ---------- *//
function BitAnimation(AnsFunction, canvaAndCtx, animationName) {
    let current_boxPosition = animationState[animationName].hilight.object.position;

    if (animationState[animationName].hilight.isMoving) {
        if (animationState[animationName].timeStoper < TIME_TO_STOP) {
            animationState[animationName].timeStoper++;
            return requestAnimationFrame(() => BitAnimation(AnsFunction, canvaAndCtx, animationName));
        }

        current_boxPosition.x += MOVING_BOX_SPEED;

        if (current_boxPosition.x <= animationState[animationName].hilight.stop_x) {
            animationState[animationName].hilight.isMoving = false;
            current_boxPosition.x = animationState[animationName].hilight.stop_x;
        } else if (animationState[animationName].hilight.stop_x < animationState[animationName].hilight.end_x) {
            animationState[animationName].hilight.object.startDelete(TIME_TO_DISAPEAR);
            animationState[animationName].isPlaying = false;
        }
    } else {
        let number_1_index = animationState[animationName].bits.number_1.length - 1 - animationState[animationName].index;
        let number_1 = IsOutOfBounds(number_1_index, animationState[animationName].bits.number_1);

        let number_2_index = animationState[animationName].bits.number_2.length - 1 - animationState[animationName].index;
        let number_2 = IsOutOfBounds(number_2_index, animationState[animationName].bits.number_2);

        let ans = AnsFunction(parseInt(number_1), parseInt(number_2));
        let ansBox_point = new Point(animationState[animationName].hilight.stop_x + BIT_BOX_PARAM.offset, current_boxPosition.y + BIT_BOX_PARAM.height * 2 + BIT_BOX_PARAM.offset * 3);

        let ansBox = new BitBox(canvaAndCtx.ctx, ansBox_point, BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, GetCSSColor('--ansBox-color'), ans.toString(), true, 15);
        ansBox.startAppear(TIME_TO_APEAR);
        animationState[animationName].bits.additional.push(ansBox);

        animationState[animationName].hilight.isMoving = true;
        animationState[animationName].timeStoper = 0;
        animationState[animationName].hilight.stop_x -= BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
        animationState[animationName].index++;
    }

    if (animationState[animationName].isPlaying) requestAnimationFrame(() => BitAnimation(AnsFunction, canvaAndCtx,animationName));
}

function StartAnimation(ansFunction, canvaIndex, operationText, operationName) {
    if (animationState[operationName].bits.number_1.length <= 0 && animationState[operationName].bits.number_2.length <= 0) return;
    if (animationState[operationName].isPlaying) return;

    DeleteOperationResult(canvaIndex);

    const CURRENT_CANVA_CTX = OUTPUT_CTX[canvaIndex];

    let hilight_witdh = BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset*2;
    let hilight_height = BIT_BOX_PARAM.height*2 + BIT_BOX_PARAM.offset*3;

    let bitOperationBox_point = new Point(CURRENT_CANVA_CTX.canva.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset * 3, BIT_BOX_PARAM.offset);

    animationState[operationName].hilight.object = new BitBox(CURRENT_CANVA_CTX.ctx, bitOperationBox_point, hilight_witdh, hilight_height, 6, GetCSSColor('--hilight-color'), "", true, 15);
    animationState[operationName].hilight.object.startAppear(TIME_TO_APEAR);
    animationState[operationName].bits.additional.push(animationState[operationName].hilight.object);

    let scale = (canvaIndex == 0 ? 1.35 : 2);

    let countOfNumbers = Math.max(animationState[operationName].bits.number_1.length, animationState[operationName].bits.number_2.length);
    let ansBox_point = new Point(CURRENT_CANVA_CTX.canva.width - BIT_BOX_PARAM.width*scale - BIT_BOX_PARAM.offset * 2 - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * countOfNumbers,
        BIT_BOX_PARAM.height*0.5 + BIT_BOX_PARAM.offset*2.5);

    let animation_bit_sign = new BitBox(CURRENT_CANVA_CTX.ctx, ansBox_point, BIT_BOX_PARAM.width*scale, BIT_BOX_PARAM.height, 6, GetCSSColor('--bitBox-color'), operationText, true, 15);
    animation_bit_sign.startAppear(TIME_TO_APEAR);
    animationState[operationName].bits.additional.push(animation_bit_sign);

    animationState[operationName].isPlaying = true;
    animationState[operationName].hilight.isMoving = false;
    animationState[operationName].hilight.stop_x = bitOperationBox_point.x;
    animationState[operationName].hilight.end_x = bitOperationBox_point.x - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * ( Math.max(animationState[operationName].bits.number_1.length, animationState[operationName].bits.number_2.length) - 1 );
    animationState[operationName].index = 0;
    animationState[operationName].timeStoper = 0;

    requestAnimationFrame(() => BitAnimation(ansFunction, OUTPUT_CTX[canvaIndex], operationName));
}

function BitNotAnimation() {
    let current_boxPosition = animationState.bitNot.hilight.object.position;

    if (animationState.bitNot.hilight.isMoving) {
        if (animationState.bitNot.timeStoper < TIME_TO_STOP) {
            animationState.bitNot.timeStoper++;
            return requestAnimationFrame(BitNotAnimation);
        }

        current_boxPosition.x += MOVING_BOX_SPEED;

        if (current_boxPosition.x <= animationState.bitNot.hilight.stop_x) {
            animationState.bitNot.hilight.isMoving = false;
            current_boxPosition.x = animationState.bitNot.hilight.stop_x;
        } else if (animationState.bitNot.hilight.stop_x < animationState.bitNot.hilight.end_x) {
            animationState.bitNot.hilight.object.startDelete(TIME_TO_DISAPEAR);
            animationState.bitNot.isPlaying = false;
        }
    } else {
        let number_index = animationState.bitNot.bits.number.length - 1 - animationState.bitNot.index;
        let number = IsOutOfBounds(number_index, animationState.bitNot.bits.number);

        let ans = Math.abs(parseInt(number)-1);

        let ansBox_point = new Point(animationState.bitNot.hilight.stop_x + BIT_BOX_PARAM.offset, current_boxPosition.y + BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset * 2);

        let ansBox = new BitBox(OUTPUT_BIT_NOT_CTX, ansBox_point, BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, GetCSSColor('--ansBox-color'), ans.toString(), true, 15);
        ansBox.startAppear(TIME_TO_APEAR);
        animationState.bitNot.bits.additional.push(ansBox);

        animationState.bitNot.hilight.isMoving = true;
        animationState.bitNot.timeStoper = 0;
        animationState.bitNot.hilight.stop_x -= BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
        animationState.bitNot.index++;
    }

    if (animationState.bitNot.isPlaying) requestAnimationFrame(BitNotAnimation);
}

function StartAnimation_BitNot() {
    if (animationState.bitNot.bits.number.length <= 0) return;
    if (animationState.bitNot.isPlaying) return;

    DeleteOperationResult("input_bitNot");

    let hilight_witdh = BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset*2;
    let hilight_height = BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset*2;

    let bitNotBox_point = new Point(OUTPUT_BIT_NOT.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset * 3, BIT_BOX_PARAM.offset);

    animationState.bitNot.hilight.object = new BitBox(OUTPUT_BIT_NOT_CTX, bitNotBox_point, hilight_witdh, hilight_height, 6, GetCSSColor('--hilight-color'), "", true, 15);
    animationState.bitNot.hilight.object.startAppear(TIME_TO_APEAR);
    animationState.bitNot.bits.additional.push(animationState.bitNot.hilight.object);

    let countOfNumbers = animationState.bitNot.bits.number.length;
    let ansBox_point = new Point(OUTPUT_BIT_NOT.width - BIT_BOX_PARAM.width*1.5 - BIT_BOX_PARAM.offset * 2 - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * countOfNumbers, BIT_BOX_PARAM.offset*2);

    let animation_not_sign = new BitBox(OUTPUT_BIT_NOT_CTX, ansBox_point, BIT_BOX_PARAM.width*1.5, BIT_BOX_PARAM.height, 6, GetCSSColor('--bitBox-color'), "not", true, 15);
    animation_not_sign.startAppear(TIME_TO_APEAR);
    animationState.bitNot.bits.additional.push(animation_not_sign);

    animationState.bitNot.isPlaying = true;
    animationState.bitNot.hilight.isMoving = false;
    animationState.bitNot.hilight.stop_x = bitNotBox_point.x;
    animationState.bitNot.hilight.end_x = bitNotBox_point.x - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * (animationState.bitNot.bits.number.length - 1);
    animationState.bitNot.index = 0;
    animationState.bitNot.timeStoper = 0;

    requestAnimationFrame(BitNotAnimation);
}

function BitShiftAnimation() {
    let current_boxPosition = animationState.bitShift.hilight.object.position;

    if (animationState.bitShift.hilight.isMoving) {
        if (animationState.bitShift.timeStoper < TIME_TO_STOP) {
            animationState.bitShift.timeStoper++;
            return requestAnimationFrame(BitShiftAnimation);
        }

        current_boxPosition.x += MOVING_BOX_SPEED;
        animationState.bitShift.imaginary.object.position.x += MOVING_BOX_SPEED;

        if (current_boxPosition.x <= animationState.bitShift.hilight.stop_x) {
            animationState.bitShift.hilight.isMoving = false;
            current_boxPosition.x = animationState.bitShift.hilight.stop_x;
        } else if (animationState.bitShift.hilight.stop_x < animationState.bitShift.hilight.end_x) {
            animationState.bitShift.hilight.object.startDelete(TIME_TO_DISAPEAR);
            animationState.bitShift.imaginary.object.startDelete(TIME_TO_DISAPEAR);
            animationState.bitShift.isPlaying = false;
        }
    } else {
        let number_index = animationState.bitShift.bits.number.length - 1 - animationState.bitShift.index;
        let number = IsOutOfBounds(number_index - animationState.bitShift.shiftNumber * (animationState.bitShift.direction == "right" ? 1 : -1), animationState.bitShift.bits.number);

        let ans = parseInt(number);

        let ansBox_point = new Point(animationState.bitShift.hilight.stop_x + BIT_BOX_PARAM.offset, current_boxPosition.y + BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset * 2);

        let ansBox = new BitBox(OUTPUT_BIT_SHIFT_CTX, ansBox_point, BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, GetCSSColor('--ansBox-color'), ans.toString(), true, 15);
        ansBox.startAppear(TIME_TO_APEAR);
        animationState.bitShift.bits.additional.push(ansBox);

        animationState.bitShift.hilight.isMoving = true;
        animationState.bitShift.timeStoper = 0;
        animationState.bitShift.hilight.stop_x -= BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;
        animationState.bitShift.index++;
    }

    if (animationState.bitShift.isPlaying) requestAnimationFrame(BitShiftAnimation);
}

function StartAnimation_BitShift() {
    if (animationState.bitShift.bits.number.length <= 0) return;
    if (animationState.bitShift.isPlaying) return;
    if (INPUT_BIT_SHIFT_2.value.length <= 0) return;
    if (!IsNumber(INPUT_BIT_SHIFT_2.value)) return;

    let bitShiftOffset = parseInt(INPUT_BIT_SHIFT_2.value), bitShiftOffsetDirection = INPUT_BIT_SHIFT_DIRECTION.value;

    DeleteOperationResult("input_bitShift_1");

    let hilight_witdh = BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset*2;
    let hilight_height = BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset*2;

    let bitShiftBox_point = new Point(OUTPUT_BIT_NOT.width - BIT_BOX_PARAM.width - BIT_BOX_PARAM.offset * 3, BIT_BOX_PARAM.offset);

    animationState.bitShift.hilight.object = new BitBox(OUTPUT_BIT_SHIFT_CTX, bitShiftBox_point.clone, hilight_witdh, hilight_height, 6, GetCSSColor('--hilight-color'), "", true, 15);
    animationState.bitShift.hilight.object.startAppear(TIME_TO_APEAR);
    animationState.bitShift.bits.additional.push(animationState.bitShift.hilight.object);

    bitShiftBox_point.x += (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * bitShiftOffset * (bitShiftOffsetDirection == "right" ? -1 : 1);

    animationState.bitShift.imaginary.object = new BitBox(OUTPUT_BIT_SHIFT_CTX, bitShiftBox_point.clone, hilight_witdh, hilight_height, 6, GetCSSColor('--imaginary-color'), "", true, 15);
    animationState.bitShift.imaginary.object.startAppear(TIME_TO_APEAR);
    animationState.bitShift.bits.additional.push(animationState.bitShift.imaginary.object);

    bitShiftBox_point.x -= (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * bitShiftOffset * (bitShiftOffsetDirection == "right" ? -1 : 1);

    let countOfNumbers = animationState.bitShift.bits.number.length;
    let ansBox_point = new Point(OUTPUT_BIT_NOT.width - BIT_BOX_PARAM.width*1.5 - BIT_BOX_PARAM.offset * 2 - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * countOfNumbers, BIT_BOX_PARAM.offset*2);

    let animation_shift_sign = new BitBox(OUTPUT_BIT_SHIFT_CTX, ansBox_point, BIT_BOX_PARAM.width*1.5, BIT_BOX_PARAM.height, 6, GetCSSColor('--bitBox-color'), "shift", true, 15);
    animation_shift_sign.startAppear(TIME_TO_APEAR);
    animationState.bitShift.bits.additional.push(animation_shift_sign);

    animationState.bitShift.isPlaying = true;
    animationState.bitShift.hilight.isMoving = false;
    animationState.bitShift.hilight.stop_x = bitShiftBox_point.x;
    animationState.bitShift.hilight.end_x = bitShiftBox_point.x - (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * (animationState.bitShift.bits.number.length - 1);
    animationState.bitShift.index = 0;
    animationState.bitShift.timeStoper = 0;
    animationState.bitShift.shiftNumber = bitShiftOffset;
    animationState.bitShift.direction = bitShiftOffsetDirection;

    requestAnimationFrame(BitShiftAnimation);
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
                let bitBox = currentList[currentElement];
                if (bitBox == null) continue;
                if (bitBox.canDelete) {
                    currentList.splice(currentElement, 1);
                    currentElement--;
                    continue;
                }
                const CURRENT_CANVA = OUTPUT_CTX.find(Item => Item.ctx === bitBox.getCTX);
            
                if (CURRENT_CANVA.visible) {
                    bitBox.update(currentTime);
                    bitBox.draw();
                }
            }
        }
    }

    requestAnimationFrame(Animate);
}

function EventListeners() {
    INPUT_BIT_OR_1.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_BIT_OR_2.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_BIT_OR_1.addEventListener('input', AddBit);
    INPUT_BIT_OR_2.addEventListener('input', AddBit);
    BUTTON_BIT_OR.addEventListener('click', () => StartAnimation(((a, b) => a | b), 0, 'or', 'bitOr'));

    INPUT_BIT_AND_1.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_BIT_AND_2.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_BIT_AND_1.addEventListener('input', AddBit);
    INPUT_BIT_AND_2.addEventListener('input', AddBit);
    BUTTON_BIT_AND.addEventListener('click', () => StartAnimation(((a, b) => a & b), 1, 'and', 'bitAnd'));

    INPUT_BIT_XOR_1.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_BIT_XOR_2.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_BIT_XOR_1.addEventListener('input', AddBit);
    INPUT_BIT_XOR_2.addEventListener('input', AddBit);
    BUTTON_BIT_XOR.addEventListener('click', () => StartAnimation(((a, b) => a ^ b), 2, 'xor', 'bitXor'));

    INPUT_BIT_NOT.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_BIT_NOT.addEventListener('input', AddBit);
    BUTTON_BIT_NOT.addEventListener('click', StartAnimation_BitNot);

    INPUT_BIT_SHIFT_1.addEventListener('input', 
        (event) => { Input_Filter(event, true); });
    INPUT_BIT_SHIFT_1.addEventListener('input', AddBit);
    INPUT_BIT_SHIFT_2.addEventListener('input', 
        (event) => { Input_Filter(event, false, "char"); });
    BUTTON_BIT_SHIFT.addEventListener('click', StartAnimation_BitShift);
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

    if (currentList.length < binNumber.length) {
        for (let i = currentList.length; i<binNumber.length; i++) {
            let currentBit = binNumber[binNumber.length - i - 1];
            let currentBox = new BitBox(CANVA_AND_CTX.ctx, new Point(0, 0), BIT_BOX_PARAM.width, BIT_BOX_PARAM.height, 6, GetCSSColor('--bitBox-color'), currentBit, true, 15);
            currentBox.startAppear(TIME_TO_APEAR);
            currentList.unshift(currentBox);
        }
    } else if (currentList.length > binNumber.length) {
        let lastInd = currentList.length - binNumber.length;
        for (let i = 0; i<lastInd; i++) currentList[i].startDelete(TIME_TO_DISAPEAR);
    }
    
    let offset = (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * currentList.length + BIT_BOX_PARAM.offset;
    let currentY = (SecondNumber(this.id) ? BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset*3 : BIT_BOX_PARAM.offset*2);
    let currentPoint = new Point(CANVA_AND_CTX.canva.width - offset, currentY);

    for (let i = 0; i != currentList.length; i++) {
        let currentBox = currentList[i], textIndex = Math.max(0, binNumber.length - 1 - (currentList.length - 1 - i));
        currentBox.position = currentPoint.clone;
        currentPoint.x += BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;

        if (currentBox.isDeletingAnimation) {
            if (currentList.length != binNumber.length) continue;
            else currentBox.changeText(currentBox.getText);
        }

        if ((currentBox.getText == binNumber[textIndex] && currentBox.getNextText == binNumber[textIndex]) || (currentBox.getText != binNumber[textIndex] && currentBox.getNextText == binNumber[textIndex])) continue;

        currentBox.changeText(binNumber[textIndex]);
    }
}

function IsOutOfBounds(index, listOfBitBoxes) {
    if (index >= 0 && index < listOfBitBoxes.length) return listOfBitBoxes[index].getText;
    return 0;
}

function InputList(inputID) {
    if (inputID == "input_bitOr_1") return animationState.bitOr.bits.number_1;
    if (inputID == "input_bitOr_2") return animationState.bitOr.bits.number_2;
    if (inputID == "input_bitAnd_1") return animationState.bitAnd.bits.number_1;
    if (inputID == "input_bitAnd_2") return animationState.bitAnd.bits.number_2;
    if (inputID == "input_bitXor_1") return animationState.bitXor.bits.number_1;
    if (inputID == "input_bitXor_2") return animationState.bitXor.bits.number_2;
    if (inputID == "input_bitNot") return animationState.bitNot.bits.number;
    if (inputID == "input_bitShift_1") return animationState.bitShift.bits.number;

    return null;
}

function CanType(inputID) {
    if (inputID == "input_bitOr_1" || inputID == "input_bitOr_2") return !animationState.bitOr.isPlaying;
    if (inputID == "input_bitAnd_1" || inputID == "input_bitAnd_2") return !animationState.bitAnd.isPlaying;
    if (inputID == "input_bitXor_1" || inputID == "input_bitXor_2") return !animationState.bitXor.isPlaying;
    if (inputID == "input_bitShift_1") return !animationState.bitShift.isPlaying;
    if (inputID == "input_bitNot") return !animationState.bitNot.isPlaying;

    return true;
}

function SecondNumber(inputID) {
    if (inputID == "input_bitOr_2") return true;
    if (inputID == "input_bitAnd_2") return true;
    if (inputID == "input_bitXor_2") return true;

    return false;
}

function DeleteOperationResult(inputID) {
    if (inputID == "input_bitOr_1" || inputID == "input_bitOr_2" || inputID == 0)
        for (let currBox of animationState.bitOr.bits.additional)
            currBox.startDelete(TIME_TO_DISAPEAR);
    if (inputID == "input_bitAnd_1" || inputID == "input_bitAnd_2" || inputID == 1)
        for (let currBox of animationState.bitAnd.bits.additional)
            currBox.startDelete(TIME_TO_DISAPEAR);
    if (inputID == "input_bitXor_1" || inputID == "input_bitXor_2" || inputID == 2)
        for (let currBox of animationState.bitXor.bits.additional)
            currBox.startDelete(TIME_TO_DISAPEAR);
    if (inputID == "input_bitShift_1")
        for (let currBox of animationState.bitShift.bits.additional)
            currBox.startDelete(TIME_TO_DISAPEAR);
    if (inputID == "input_bitNot")
        for (let currBox of animationState.bitNot.bits.additional)
            currBox.startDelete(TIME_TO_DISAPEAR);
}

function GetCanvaAndCtx(inputID) {
    if (inputID == "input_bitOr_1" || inputID == "input_bitOr_2")
        return OUTPUT_CTX[0];
    if (inputID == "input_bitAnd_1" || inputID == "input_bitAnd_2")
        return OUTPUT_CTX[1];
    if (inputID == "input_bitXor_1" || inputID == "input_bitXor_2")
        return OUTPUT_CTX[2];
    if (inputID == "input_bitNot")
        return OUTPUT_CTX[3];
    if (inputID == "input_bitShift_1")
        return OUTPUT_CTX[4];
}
