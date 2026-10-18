import { HEXtoLCH, LCHtoHEX, ClearCanva, FindCoveredBoxes, TextBox, Text, Vector2, Animator, Animation, FPS, CANVA_COLOR } from './canvasObjects.js';

let canva = document.querySelector('canvas#convertation_INT');
let ctx = canva.getContext("2d");
let boxes = [];
ClearCanva(canva, new Vector2(0, 0), new Vector2(canva.width, canva.height), CANVA_COLOR);

let baseBox = {
    size: new Vector2(200, 30),
    pos: new Vector2(0, 0),
    color: "#ff0000",
    textPos: new Vector2(0, 0),
    fontSize: 24,
    textColor: "#000000",
    text: "1111",
};

let nextBox = {
    size: new Vector2(200, 30),
    pos: new Vector2(0, 0),
    color: "#ff0000",
    textPos: new Vector2(0, 0),
    fontSize: 24,
    textColor: "#000000",
    text: "0ANn",
}

let animationList = {
    "intro": new Animation(
        1500,
        {
            size: (startSize, endSize, t) => {
                let multyplier = t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
                let diff = new Vector2(endSize.x - startSize.x, endSize.y - startSize.y);

                return new Vector2(
                    Math.round(startSize.x + diff.x * multyplier),
                    Math.round(startSize.y + diff.y * multyplier));
            },
            pos: (startPos, endPos, t) => {
                let multyplier = 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);
                let diff = new Vector2(endPos.x - startPos.x, endPos.y - startPos.y);

                return new Vector2(
                    Math.round(startPos.x + diff.x * multyplier),
                    Math.round(startPos.y + diff.y * multyplier));
            },
            fontSize: (startFontSize, endFontSize, t) => {
                let multyplier = t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
                return Math.round(startFontSize + (endFontSize - startFontSize) * multyplier);
            },
            color: (startColor, endColor, t) => {
                let multyplier = t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
                let startColorLCH = HEXtoLCH(startColor), endColorLCH = HEXtoLCH(endColor);

                let hueStart = startColorLCH.hue;
                let hueEnd = endColorLCH.hue;
                let deltaHue = hueEnd - hueStart;

                if (deltaHue > 180)
                    hueStart += 360;
                else if (deltaHue < -180)
                    hueEnd += 360;

                let interpolatedLightness = startColorLCH.lightness + (endColorLCH.lightness - startColorLCH.lightness) * multyplier;
                let interpolatedChroma = startColorLCH.chroma + (endColorLCH.chroma - startColorLCH.chroma) * multyplier;
                let interpolatedHue = hueStart + (hueEnd - hueStart) * multyplier;

                if (interpolatedHue >= 360)
                    interpolatedHue -= 360;
                else if (interpolatedHue < 0)
                    interpolatedHue += 360;

                let hexFinal = LCHtoHEX({
                    lightness: interpolatedLightness,
                    chroma: interpolatedChroma,
                    hue: interpolatedHue
                });

                return hexFinal;
            },
            textColor: (startColor, endColor, t) => {
                let multyplier = t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
                let startColorLCH = HEXtoLCH(startColor), endColorLCH = HEXtoLCH(endColor);

                let deltaHue = endColorLCH.hue - startColorLCH.hue;

                if (deltaHue > 180)
                    startColorLCH.hue += 360;
                else if (deltaHue < -180)
                    endColorLCH.hue += 360;

                let interpolatedLightness = startColorLCH.lightness + (endColorLCH.lightness - startColorLCH.lightness) * multyplier;
                let interpolatedChroma = startColorLCH.chroma + (endColorLCH.chroma - startColorLCH.chroma) * multyplier;
                let interpolatedHue = startColorLCH.hue + (endColorLCH.hue - startColorLCH.hue) * multyplier;

                if (interpolatedHue >= 360)
                    interpolatedHue -= 360;
                else if (interpolatedHue < 0)
                    interpolatedHue += 360;

                let hexFinal = LCHtoHEX({
                    lightness: interpolatedLightness,
                    chroma: interpolatedChroma,
                    hue: interpolatedHue
                });

                return hexFinal;
            },
            textPos: (startPos, endPos, t) => {
                let multyplier = t;
                let diff = new Vector2(endPos.x - startPos.x, endPos.y - startPos.y);

                return new Vector2(
                    Math.round(startPos.x + diff.x * multyplier),
                    Math.round(startPos.y + diff.y * multyplier));
            },
            text: (startText, endText, t) => {
                let newText = new String(startText.padEnd(endText.length)), finalText = new String(endText.padEnd(newText.length));
                let transformString = "0123456789", lenOfTransition = newText.length;

                let multyplier = (t < 0.5) ? (4 * t * t * t) : (1 - Math.pow(-2 * t + 2, 3) / 2);
                let lastInd = Math.round((newText.length + lenOfTransition) * multyplier);

                for (let currInd = Math.min(lastInd, newText.length) - 1; currInd >= 0; currInd--) {
                    let transformStringInd = lenOfTransition - (lastInd - currInd);

                    if (transformStringInd < 0)
                        newText = newText.slice(0, currInd) + finalText[currInd] + newText.slice(currInd + 1);
                    else
                        newText = newText.slice(0, currInd) + transformString[Math.floor(Math.random() * transformString.length)] + newText.slice(currInd + 1);
                }

                return newText;
            }
        },
        baseBox,
        nextBox,
        nextBox
    )
}

function DrawFunction(ctx, pos, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(pos.x, pos.y, size.x, size.y);
}

let text = new Text(ctx, 'normal font');
let boxAnimator = new Animator(animationList, DrawFunction, text, baseBox);
let textBox = new TextBox(ctx, new Vector2(100, 20), boxAnimator.clone);
textBox.StartAnimation("intro");
boxes.push(textBox);

function ScreenUpdates() {
    let boxesToUpdate = [];
    for (let currBoxInd = 0; currBoxInd < boxes.length; currBoxInd++) {
        let currBox = boxes[currBoxInd];

        if (currBox.willUpdate || !currBox.NeedUpdate)
            continue;

        FindCoveredBoxes(currBoxInd, boxes, boxesToUpdate);
    }

    boxesToUpdate.sort((a, b) => a - b);

    for (let currBoxInd of boxesToUpdate) {
        let currBox = boxes[currBoxInd];
        ClearCanva(currBox.ctx.canvas, currBox.prevParametrs.clearPos, currBox.prevParametrs.clearSize, CANVA_COLOR);
    }

    for (let currBox of boxesToUpdate)
        boxes[currBox].Draw();

    for (let currBox of boxes)
        currBox.willUpdate = false;

    setTimeout(ScreenUpdates, 1000 / FPS);
}

ScreenUpdates();
