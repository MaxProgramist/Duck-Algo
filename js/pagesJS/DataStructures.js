import { Input_Filter, UpdateBoxes, NumberFilter, ConvertBtwTypes, clamp, TYPES_SIGNES } from '../utility.js'
import { Point, Size, BitBox, ClearCanvasWithTransforms, GetCSSColor, EaseOutCubic, ScrollToRight, CanvasResize } from '../canvasOperations.js'

//* ---------- Variables ---------- *//

//* -------- HTML Elements -------- *//
const INPUT_ARRAY = document.getElementById('input_array');
const SELECT_ARRAY_TYPE = document.getElementById('select_array_type');
const SELECT_ARRAY_SIGN_TYPE = document.getElementById('select_array_signType');
const SELECT_ARRAY_OPERATION_TYPE = document.getElementById('select_array_operationType');
const BUTTON_ARRAY = document.getElementById('button_array');
const OUTPUT_ARRAY = document.getElementById('output_array');
const OUTPUT_ARRAY_CTX = OUTPUT_ARRAY.getContext("2d");

const OUTPUT_CTX = {
    array: {ctx: OUTPUT_ARRAY_CTX, canva: OUTPUT_ARRAY, visible: true}
};

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

const TIME_TO_APPEAR = 500;
const TIME_TO_DISAPPEAR = 250;
const TIME_TO_CHANGE_TEXT = 500;
const TIME_TO_CHANGE_SIZE = 500;
const TIME_TO_SCALE = 250;

const ANIMATION_NAMES = ["array"];

let animationState = {
    array: {
        bits: {
            index: [],
            elements: []
        },
        inputText: {
            add: "Введіть значення...", 
            remove: "Введіть індекс..."
        },
        typeSelects: {
            signType: SELECT_ARRAY_SIGN_TYPE,
            type: SELECT_ARRAY_TYPE
        },
        inputs: {
            signType: SELECT_ARRAY_SIGN_TYPE,
            type: SELECT_ARRAY_TYPE,
            operation: SELECT_ARRAY_OPERATION_TYPE,
            input: INPUT_ARRAY
        },
        functions: {
            add: ArrayAddition,
            remove: ArrayRemove
        },
        deleteAnimation: {
            isMoving: [],
            positionToMoveElement: [],
            positionFromMoveElement: [],
            positionToMoveIndex: [],
            positionFromMoveIndex: [],
            positionOfDeletion: new Point(0, 0),
            lastLength: 0,
            indexToDelete: 0,
            startTime: 0,
            duration: 150
        },
        lastType: "signed int",
        isPlaying: false
    }
}

let changingCount = {counter: 0};

EventListeners();
requestAnimationFrame(Animate);

//* ---------- Functions ---------- *//
function Animate(currentTime, repeat = true) {
    if (repeat && changingCount.counter > 0) return requestAnimationFrame(Animate);

    for (let currentCanva of Object.values(OUTPUT_CTX))
        if (currentCanva.visible)
            ClearCanvasWithTransforms(currentCanva.ctx, currentCanva.canva, GetCSSColor('--canva-color'));

    UpdateBoxes(ANIMATION_NAMES, OUTPUT_CTX, animationState, currentTime);

    if (repeat) requestAnimationFrame(Animate);
}

function EventListeners() {
    INPUT_ARRAY.addEventListener('input', 
        (event) => { ArrayInputFilter(event); });
    BUTTON_ARRAY.addEventListener('click', 
        () => { DoButtonAction("array"); });
    SELECT_ARRAY_SIGN_TYPE.addEventListener("change",
        () => { ChangeValuesForArrayElements(); });
    SELECT_ARRAY_TYPE.addEventListener("change",
        (event) => { ChangeStructureType(event, "array"); });
    SELECT_ARRAY_OPERATION_TYPE.addEventListener("change",
        (event) => { ChangeOperationType(event, "array"); });
}

function ChangeOperationType(event, operationType) {
    const INPUT = animationState[operationType].inputs.input;
    const CURRENT_TEXT = animationState[operationType].inputText;
    const CURRENT_SELECTS = animationState[operationType].typeSelects;

    INPUT.placeholder = CURRENT_TEXT[event.target.value];
    INPUT.value = "";

    if (animationState.array.bits.elements.length > 0) return;
    
    CURRENT_SELECTS.signType.disabled = (event.target.value == "remove");
    CURRENT_SELECTS.type.disabled = (event.target.value == "remove");
}

function ChangeStructureType(event, operationType) {
    const SELECT_SIGN_TYPE = animationState[operationType].inputs.signType;
    const CURRENT_LIMITS = TYPES_SIGNES[event.target.value];
    
    const OPTIONS = SELECT_SIGN_TYPE.options;

    for (let i = 0; i < OPTIONS.length; i++) {
        const CURRENT_OPTION = OPTIONS[i];
        
        if (CURRENT_LIMITS.includes(CURRENT_OPTION.value)) {
            CURRENT_OPTION.disabled = false;
        } else {
            CURRENT_OPTION.disabled = true;
            if (CURRENT_OPTION.selected) {
                CURRENT_OPTION.selected = false;
            }
        }
    } 

    for (let i = 0; i < OPTIONS.length; i++) {
        if (!OPTIONS[i].disabled) {
            SELECT_SIGN_TYPE.selectedIndex = i;
            break;
        }
    }
}

// Not used, but will be used in the future
function ChangeValuesForArrayElements() {
    const LIST_LENGTH = animationState.array.bits.elements.length;
    const NEW_TYPE = SELECT_ARRAY_SIGN_TYPE.value + " " + SELECT_ARRAY_TYPE.value;

    for (let currentBoxIndex = 0; currentBoxIndex < LIST_LENGTH; currentBoxIndex++) {
        let oldValue = animationState.array.bits.elements[currentBoxIndex].nextText;
        let newValue = ConvertBtwTypes(oldValue, animationState.array.lastType, NEW_TYPE);
        console.log(newValue);
    }

    animationState.array.lastType = NEW_TYPE;
}

function DoButtonAction(operationType) {
    const OPERATION_TYPE = animationState[operationType].inputs.operation.value;

    animationState[operationType].isPlaying = true;

    animationState[operationType].functions[OPERATION_TYPE]();
}

function ArrayAddition() {
    const VALUE_TO_ADD = INPUT_ARRAY.value;

    if (VALUE_TO_ADD == "" || VALUE_TO_ADD == "-") return;
    if (animationState.array.bits.elements.length >= 127) return;

    let visualizedValue = VALUE_TO_ADD;
    if (animationState.array.lastType.includes("char") || animationState.array.lastType.includes("wchar_t"))
        visualizedValue = String.fromCharCode(parseInt(VALUE_TO_ADD));
    else if (animationState.array.lastType.includes("bool"))
        visualizedValue = Boolean(parseInt(VALUE_TO_ADD));
    visualizedValue = visualizedValue.toString();

    let lastBitBox = animationState.array.bits.index[animationState.array.bits.index.length-1];
    let newPoint = new Point((lastBitBox != null ? lastBitBox.position.x + lastBitBox.size.x + BIT_BOX_PARAM.offset : BIT_BOX_PARAM.offset*2), 
    (lastBitBox != null ? lastBitBox.position.y : BIT_BOX_PARAM.offset*2));

    let boxWidth = ArrayBoxSize(visualizedValue, animationState.array.bits.index.length);
    
    let edgeX = newPoint.x + boxWidth + BIT_BOX_PARAM.offset*2;

    if (edgeX >= OUTPUT_ARRAY.width - BIT_BOX_PARAM.offset*2) {
        newPoint.y += (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * 2 + BIT_BOX_PARAM.offset*2;
        CanvasResize(OUTPUT_ARRAY, OUTPUT_ARRAY.width, OUTPUT_ARRAY.height + (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset) * 2 + BIT_BOX_PARAM.offset*2,
            TIME_TO_SCALE, changingCount, Animate);
        newPoint.x = BIT_BOX_PARAM.offset*2;
    }
    
    let newBoxSize = new Size(boxWidth, BIT_BOX_PARAM.height);

    let newIndexBox = new BitBox(OUTPUT_CTX.array.ctx, newPoint.clone, newBoxSize, 
        BIT_BOX_PARAM.radius, GetCSSColor("--imaginary-color"), animationState.array.bits.index.length, 
        true, BIT_BOX_PARAM.glowIntensity
    );

    newIndexBox.startAppear(TIME_TO_APPEAR);
    animationState.array.bits.index.push(newIndexBox);
    newPoint.y += BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset;

    let newElement = new BitBox(OUTPUT_CTX.array.ctx, newPoint, newBoxSize, 
        BIT_BOX_PARAM.radius, GetCSSColor("--bitBox-color"), visualizedValue, 
        true, BIT_BOX_PARAM.glowIntensity
    );

    newElement.startAppear(TIME_TO_APPEAR);
    animationState.array.bits.elements.push(newElement);

    animationState.array.isPlaying = false;

    SELECT_ARRAY_SIGN_TYPE.disabled = true;
    SELECT_ARRAY_TYPE.disabled = true;
}

function ArrayRemove() {
    const INDEX_TO_DELETE = parseInt(INPUT_ARRAY.value);

    if (animationState.array.bits.elements.length <= 0) return;
    if (INDEX_TO_DELETE >= animationState.array.bits.elements.length || INPUT_ARRAY.value.length <= 0) return;

    animationState.array.deleteAnimation.indexToDelete = INDEX_TO_DELETE;
    animationState.array.deleteAnimation.lastLength = animationState.array.bits.elements.length;
    animationState.array.deleteAnimation.positionOfDeletion = animationState.array.bits.elements[INDEX_TO_DELETE].position;

    animationState.array.bits.elements[INDEX_TO_DELETE].startDelete(TIME_TO_DISAPPEAR);
    animationState.array.bits.index[animationState.array.deleteAnimation.lastLength - 1].startDelete(TIME_TO_DISAPPEAR);

    BUTTON_ARRAY.disabled = true;
    animationState.array.deleteAnimation.positionToMoveElement = [];
    animationState.array.deleteAnimation.positionFromMoveElement = [];
    animationState.array.deleteAnimation.positionToMoveIndex = [];
    animationState.array.deleteAnimation.positionFromMoveIndex = [];
    animationState.array.deleteAnimation.isMoving = [];

    requestAnimationFrame(WaitToDeleteArray);
}

function WaitToDeleteArray() {
    const CURRENT_LENGHT = animationState.array.bits.elements.length;

    if (CURRENT_LENGHT >= animationState.array.deleteAnimation.lastLength) return requestAnimationFrame(WaitToDeleteArray);

    for (let i = 0; i<CURRENT_LENGHT; i++) {
        let moving = i >= animationState.array.deleteAnimation.indexToDelete;
        let posToMoveElement = animationState.array.bits.elements[i].position;
        let posToMoveIndex = animationState.array.bits.index[i].position;

        if (!moving) {
            animationState.array.deleteAnimation.isMoving.push(false);
            animationState.array.deleteAnimation.positionToMoveElement.push(posToMoveElement);
            animationState.array.deleteAnimation.positionFromMoveElement.push(posToMoveElement);
            animationState.array.deleteAnimation.positionToMoveIndex.push(posToMoveIndex);
            animationState.array.deleteAnimation.positionFromMoveIndex.push(posToMoveIndex);

            continue;
        }

        if (i == animationState.array.deleteAnimation.indexToDelete)
            posToMoveElement = animationState.array.deleteAnimation.positionOfDeletion;
        else {
            let onSameRow = animationState.array.bits.elements[i-1].position.y == animationState.array.deleteAnimation.positionToMoveElement[i-1].y;
            if (onSameRow) {
                let prevBoxSize = animationState.array.bits.elements[i-1].nextSize;
                posToMoveElement = new Point(
                    animationState.array.deleteAnimation.positionToMoveElement[i-1].x + prevBoxSize.x + BIT_BOX_PARAM.offset,
                    animationState.array.deleteAnimation.positionToMoveElement[i-1].y
                );
            } else {
                let prevBoxSize = animationState.array.bits.elements[i-1].nextSize;
                let thisBoxSize = animationState.array.bits.elements[i].nextSize;
                let newEdgeX = animationState.array.deleteAnimation.positionToMoveElement[i-1].x + prevBoxSize.x + BIT_BOX_PARAM.offset + thisBoxSize.x;
                if (newEdgeX <= OUTPUT_ARRAY.width - BIT_BOX_PARAM.offset*2) {
                    posToMoveElement = new Point(
                        animationState.array.deleteAnimation.positionToMoveElement[i-1].x + prevBoxSize.x + BIT_BOX_PARAM.offset,
                        animationState.array.deleteAnimation.positionToMoveElement[i-1].y
                    );
                } else
                    posToMoveElement = new Point(BIT_BOX_PARAM.offset*2, animationState.array.bits.elements[i].position.y);
            }
        }

        let newBoxWidth = ArrayBoxSize(animationState.array.bits.elements[i].text, i);
        let newBoxSize = new Size(newBoxWidth, BIT_BOX_PARAM.height);
        animationState.array.bits.elements[i].changeSize(newBoxSize.clone, TIME_TO_CHANGE_SIZE);
        animationState.array.bits.index[i].changeSize(newBoxSize.clone, TIME_TO_CHANGE_SIZE);

        posToMoveIndex = posToMoveElement.clone;
        posToMoveIndex.y -= BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset;

        animationState.array.deleteAnimation.isMoving.push(moving);
        animationState.array.deleteAnimation.positionToMoveElement.push(posToMoveElement);
        animationState.array.deleteAnimation.positionFromMoveElement.push(animationState.array.bits.elements[i].position);
        animationState.array.deleteAnimation.positionToMoveIndex.push(posToMoveIndex);
        animationState.array.deleteAnimation.positionFromMoveIndex.push(animationState.array.bits.index[i].position);
    }

    if (CURRENT_LENGHT >= 2) {
        let newWindowHeight = animationState.array.deleteAnimation.positionToMoveElement[CURRENT_LENGHT-1].y + BIT_BOX_PARAM.height + BIT_BOX_PARAM.offset * 2;
        CanvasResize(OUTPUT_ARRAY, OUTPUT_ARRAY.width, newWindowHeight, TIME_TO_SCALE, changingCount, Animate);
    }

    animationState.array.deleteAnimation.startTime = Date.now();
    ArrayMove();
}

function ArrayMove() {
    let timeOffset = Date.now() - animationState.array.deleteAnimation.startTime;

    if (timeOffset > animationState.array.deleteAnimation.duration) {
        BUTTON_ARRAY.disabled = false;
        animationState.array.isPlaying = false;
    }

    let portion = EaseOutCubic(timeOffset/animationState.array.deleteAnimation.duration);
    for (let i = 0; i<animationState.array.bits.elements.length; i++) {
        if (!animationState.array.deleteAnimation.isMoving[i]) continue;

        let newElementPoint = new Point(
            animationState.array.deleteAnimation.positionFromMoveElement[i].x + (animationState.array.deleteAnimation.positionToMoveElement[i].x - animationState.array.deleteAnimation.positionFromMoveElement[i].x)*portion,
            animationState.array.deleteAnimation.positionFromMoveElement[i].y + (animationState.array.deleteAnimation.positionToMoveElement[i].y - animationState.array.deleteAnimation.positionFromMoveElement[i].y)*portion
        );
        let newIndexPoint = new Point(
            animationState.array.deleteAnimation.positionFromMoveIndex[i].x + (animationState.array.deleteAnimation.positionToMoveIndex[i].x - animationState.array.deleteAnimation.positionFromMoveIndex[i].x)*portion,
            animationState.array.deleteAnimation.positionFromMoveIndex[i].y + (animationState.array.deleteAnimation.positionToMoveIndex[i].y - animationState.array.deleteAnimation.positionFromMoveIndex[i].y)*portion
        );

        animationState.array.bits.elements[i].position = newElementPoint;
        animationState.array.bits.index[i].position = newIndexPoint;
    }

    if (animationState.array.isPlaying) requestAnimationFrame(ArrayMove);
}

function ArrayInputFilter(event) {
    if (SELECT_ARRAY_OPERATION_TYPE.value == "add")
        Input_Filter(event, SELECT_ARRAY_SIGN_TYPE.value == "signed", SELECT_ARRAY_TYPE.value, 
            SELECT_ARRAY_SIGN_TYPE.value == "signed");
    else
        event.target.value = clamp(NumberFilter(event.target.value, false), 0, Math.max(animationState.array.bits.elements.length-1, 0));
}

function ArrayBoxSize(valueToAdd, index) {
    return Math.max(
        BIT_BOX_PARAM.width + (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset)*((valueToAdd.length-1) / 3),
        BIT_BOX_PARAM.width + (BIT_BOX_PARAM.width + BIT_BOX_PARAM.offset)*((index.toString().length-1) / 3));
}