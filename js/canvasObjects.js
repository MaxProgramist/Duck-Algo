const FPS = 60;
const CANVA_COLOR = window.getComputedStyle(document.documentElement).getPropertyValue('--canvasColor').trim();

function HEXtoLCH(color) {
    let filteredColor = parseInt(color.replace('#', ''), 16);

    let color_red = ((filteredColor >> 16) & 0xff) / 255, color_green = ((filteredColor >> 8) & 0xff) / 255, color_blue = (filteredColor & 0xff) / 255;

    let linearR = color_red > 0.04045 ? Math.pow((color_red + 0.055) / 1.055, 2.4) : color_red / 12.92;
    let linearG = color_green > 0.04045 ? Math.pow((color_green + 0.055) / 1.055, 2.4) : color_green / 12.92;
    let linearB = color_blue > 0.04045 ? Math.pow((color_blue + 0.055) / 1.055, 2.4) : color_blue / 12.92;

    let lComp = Math.cbrt(0.4122214708 * linearR + 0.5363325363 * linearG + 0.0514459929 * linearB);
    let mComp = Math.cbrt(0.2118591070 * linearR + 0.6806995451 * linearG + 0.1074413479 * linearB);
    let sComp = Math.cbrt(0.0883024619 * linearR + 0.2817188376 * linearG + 0.6299787005 * linearB);

    let lightness = 0.2104542553 * lComp + 0.7936177850 * mComp - 0.0040720403 * sComp;
    let aComp = 1.9779984951 * lComp - 2.4285922050 * mComp + 0.4505937099 * sComp;
    let bComp = 0.0259040371 * lComp + 0.7827717662 * mComp - 0.8086757660 * sComp;

    let chroma = Math.sqrt(aComp * aComp + bComp * bComp);
    let hue = (Math.atan2(bComp, aComp) * 180) / Math.PI;

    if (hue < 0)
        hue += 360;

    return { lightness, chroma, hue };
}

function LCHtoHEX(lchColor) {
    let hueInRadians = (lchColor.hue * Math.PI) / 180;
    let aComp = lchColor.chroma * Math.cos(hueInRadians);
    let bComp = lchColor.chroma * Math.sin(hueInRadians);

    let lComp = lchColor.lightness + 0.3963377774 * aComp + 0.2158037573 * bComp;
    let mComp = lchColor.lightness - 0.1055613458 * aComp - 0.0638541728 * bComp;
    let sComp = lchColor.lightness - 0.0894841775 * aComp - 1.2914855480 * bComp;

    let lCube = lComp * lComp * lComp;
    let mCube = mComp * mComp * mComp;
    let sCube = sComp * sComp * sComp;

    let linearR = 4.0767416621 * lCube - 3.3077115913 * mCube + 0.2309699292 * sCube;
    let linearG = -1.2684380046 * lCube + 2.6097574011 * mCube - 0.3413193965 * sCube;
    let linearB = -0.0041960863 * lCube - 0.7034186147 * mCube + 1.7076147010 * sCube;

    linearR = Math.max(0, Math.min(1, linearR));
    linearG = Math.max(0, Math.min(1, linearG));
    linearB = Math.max(0, Math.min(1, linearB));

    let redColor = linearR > 0.0031308 ? 1.055 * Math.pow(linearR, 1 / 2.4) - 0.055 : 12.92 * Math.max(0, linearR);
    let greenColor = linearG > 0.0031308 ? 1.055 * Math.pow(linearG, 1 / 2.4) - 0.055 : 12.92 * Math.max(0, linearG);
    let blueColor = linearB > 0.0031308 ? 1.055 * Math.pow(linearB, 1 / 2.4) - 0.055 : 12.92 * Math.max(0, linearB);

    redColor = Math.round(Math.max(0, Math.min(255, redColor * 255)));
    greenColor = Math.round(Math.max(0, Math.min(255, greenColor * 255)));
    blueColor = Math.round(Math.max(0, Math.min(255, blueColor * 255)));

    let redHex = redColor.toString(16).padStart(2, "0");
    let greenHex = greenColor.toString(16).padStart(2, "0");
    let blueHex = blueColor.toString(16).padStart(2, "0");

    return `#${redHex}${greenHex}${blueHex}`;
}

function ClearCanva(canva, pos, size, color) {
    const CTX = canva.getContext("2d");

    let startX = Math.floor(pos.x);
    let startY = Math.floor(pos.y);
    let width = Math.ceil(pos.x + size.x) - startX;
    let height = Math.ceil(pos.y + size.y) - startY;

    CTX.clearRect(startX, startY, width, height);
    CTX.fillStyle = color;
    CTX.fillRect(startX, startY, width, height);
}

function IsOverlaping(box1, box2) {
    let box1Parametrs = box1.GetCurrentParametrs;
    let box2Parametrs = box2.GetCurrentParametrs;

    box1Parametrs.size.x += 1;
    box1Parametrs.size.y += 1;
    box2Parametrs.size.x += 1;
    box2Parametrs.size.y += 1;

    return !(box1Parametrs.pos.x + box1Parametrs.size.x <= box2Parametrs.pos.x ||
        box2Parametrs.pos.x + box2Parametrs.size.x <= box1Parametrs.pos.x ||
        box1Parametrs.pos.y + box1Parametrs.size.y <= box2Parametrs.pos.y ||
        box2Parametrs.pos.y + box2Parametrs.size.y <= box1Parametrs.pos.y);
}

function FindCoveredBoxes(currBoxInd, boxes, boxesToUpdate) {
    boxesToUpdate.push(currBoxInd);
    boxes[currBoxInd].willUpdate = true;

    let currBox = boxes[currBoxInd];

    for (let boxInd = 0; boxInd < boxes.length; boxInd++) {
        if (boxInd == currBoxInd || boxes[boxInd].willUpdate)
            continue;

        let box = boxes[boxInd];
        if (IsOverlaping(currBox, box))
            FindCoveredBoxes(boxInd, boxes, boxesToUpdate);
    }
}

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get clone() {
        return new Vector2(this.x, this.y);
    }
}

class Text {
    constructor(ctx, fontStyle) {
        this.ctx = ctx;

        this.pos = new Vector2(0, 0);

        this.color = "#000000";
        this.fontStyle = fontStyle;
        this.fontSize = 0;
        this.text = "";
    }

    Draw(parentPos) {
        let realPos = this.pos.clone;
        realPos.y += this.fontSize;

        let fontStyling = this.fontStyle.split(" ");
        let font = fontStyling[0] + " " + this.fontSize + "px " + fontStyling[1] + ', monospace';

        if (parentPos != null) {
            realPos.x += parentPos.x;
            realPos.y += parentPos.y;
        }

        this.ctx.fillStyle = this.color;
        this.ctx.font = font;
        this.ctx.fillText(this.text, realPos.x, realPos.y);
    }

    get RealSize() {
        let fontStyling = this.fontStyle.split(" ");
        let font = fontStyling[0] + " " + this.fontSize + "px " + fontStyling[1];
        this.ctx.font = font;

        let metrics = this.ctx.measureText(this.text);
        let width = Math.ceil(metrics.width);

        return new Vector2(width, this.fontSize);
    }
}

class Animation {
    constructor(duration, functions, startState, endState, newBaseState) {
        this.duration = duration;

        this.functions = functions;

        this.startState = startState;
        this.endState = endState;
        this.newBaseState = newBaseState;
    }
}

class Animator {
    constructor(animationList, drawFunction, textObject, baseState) {
        this.drawFunction = drawFunction;
        this.animationList = animationList;
        this.textObject = textObject;

        this.startAnimationTime = new Date();
        this.currAnimation = null;

        this.baseState = baseState;
        this.needUpdate = false;
    }

    StartAnimation(animationName) {
        this.startAnimationTime = new Date();

        this.currAnimation = this.animationList[animationName];
    }

    Draw(ctx, parametrs) {
        let deltaTime = new Date() - this.startAnimationTime;

        this.drawFunction(ctx, parametrs.pos, parametrs.size, parametrs.color);

        if (this.textObject != null) {
            this.textObject.fontSize = parametrs.fontSize;
            this.textObject.color = parametrs.textColor;
            this.textObject.pos = parametrs.textPos;
            this.textObject.text = parametrs.text;
            this.textObject.Draw(parametrs.pos);
        }

        this.needUpdate = false;
        if (this.currAnimation != null && deltaTime >= this.currAnimation.duration) {
            this.baseState = this.currAnimation.newBaseState;
            this.currAnimation = null;
            this.needUpdate = true;
        }
    }

    CurrentParameters(objPos) {
        let baseParams;

        if (this.currAnimation == null) {
            let currPos = new Vector2(this.baseState.pos.x + objPos.x, this.baseState.pos.y + objPos.y);

            baseParams = { pos: currPos, size: this.baseState.size, fontSize: this.baseState.fontSize, color: this.baseState.color, textColor: this.baseState.textColor, textPos: this.baseState.textPos, text: this.baseState.text };
        } else {
            let deltaTime = new Date() - this.startAnimationTime;
            let time = deltaTime / this.currAnimation.duration;

            let endStatePos = this.currAnimation.endState.pos, startStatePos = this.currAnimation.startState.pos;
            let endStateSize = this.currAnimation.endState.size, startStateSize = this.currAnimation.startState.size;
            let endStateFontSize = this.currAnimation.endState.fontSize, startStateFontSize = this.currAnimation.startState.fontSize;
            let endStateColor = this.currAnimation.endState.color, startStateColor = this.currAnimation.startState.color;
            let endStateTextColor = this.currAnimation.endState.textColor, startStateTextColor = this.currAnimation.startState.textColor;
            let endStateTextPos = this.currAnimation.endState.textPos, startStateTextPos = this.currAnimation.startState.textPos;
            let endStateText = this.currAnimation.endState.text, startStateText = this.currAnimation.startState.text;

            let nextPos = this.currAnimation.functions.pos(startStatePos, endStatePos, time);
            let nextSize = this.currAnimation.functions.size(startStateSize, endStateSize, time);
            let nextFontSize = this.currAnimation.functions.fontSize(startStateFontSize, endStateFontSize, time);
            let nextColor = this.currAnimation.functions.color(startStateColor, endStateColor, time);
            let nextTextColor = this.currAnimation.functions.textColor(startStateTextColor, endStateTextColor, time);
            let nextTextPos = this.currAnimation.functions.textPos(startStateTextPos, endStateTextPos, time);
            let nextText = this.currAnimation.functions.text(startStateText, endStateText, time);

            nextPos.x += objPos.x;
            nextPos.y += objPos.y;

            baseParams = { pos: nextPos, size: nextSize, fontSize: nextFontSize, color: nextColor, textColor: nextTextColor, textPos: nextTextPos, text: nextText };
        }

        if (this.textObject == null)
            return {
                pos: baseParams.pos,
                size: baseParams.size,
                fontSize: baseParams.fontSize,
                color: baseParams.color,
                textColor: baseParams.textColor,
                textPos: baseParams.textPos,
                text: baseParams.text,
                clearPos: baseParams.pos,
                clearSize: baseParams.size
            };

        this.textObject.fontSize = baseParams.fontSize;
        let textSize = this.textObject.RealSize;
        let textPad = 2;

        let rectMin = new Vector2(baseParams.pos.x, baseParams.pos.y);
        let rectMax = new Vector2(baseParams.pos.x + baseParams.size.x, baseParams.pos.y + baseParams.size.y);
        let textMin = new Vector2(baseParams.pos.x + baseParams.textPos.x - textPad, baseParams.pos.y + baseParams.textPos.y - textPad);
        let textMax = new Vector2(textMin.x + textSize.x + textPad, textMin.y + textSize.y + baseParams.fontSize + textPad);

        let finalMin = new Vector2(Math.floor(Math.min(rectMin.x, textMin.x)), Math.floor(Math.min(rectMin.y, textMin.y)));
        let finalMax = new Vector2(Math.ceil(Math.max(rectMax.x, textMax.x)), Math.ceil(Math.max(rectMax.y, textMax.y)));

        let pos = finalMin, size = new Vector2(finalMax.x - finalMin.x, finalMax.y - finalMin.y);

        return {
            pos: baseParams.pos,
            size: baseParams.size,
            fontSize: baseParams.fontSize,
            color: baseParams.color,
            textColor: baseParams.textColor,
            textPos: baseParams.textPos,
            text: baseParams.text,
            clearPos: pos,
            clearSize: size
        };
    }

    get NeedUpdate() {
        return this.currAnimation !== null || this.needUpdate;
    }

    get clone() {
        return new Animator(this.animationList, this.drawFunction, this.textObject, this.baseState);
    }
}

class TextBox {
    constructor(ctx, pos, animator) {
        this.ctx = ctx;

        this.pos = pos;
        this.willUpdate = false;

        this.animator = animator;
        this.prevParametrs = this.GetCurrentParametrs;
    }

    Draw() {
        let objectParametrs = this.GetCurrentParametrs;
        this.prevParametrs = objectParametrs;

        this.animator.Draw(this.ctx, objectParametrs);
    }

    StartAnimation(animationName) {
        this.animator.StartAnimation(animationName);
    }

    get GetCurrentParametrs() {
        return this.animator.CurrentParameters(this.pos);
    }

    get NeedUpdate() {
        return this.animator.NeedUpdate;
    }
}

export { HEXtoLCH, LCHtoHEX, ClearCanva, FindCoveredBoxes, Vector2, Text, Animation, Animator, TextBox, FPS, CANVA_COLOR };
