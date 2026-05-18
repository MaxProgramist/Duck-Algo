import { EaseOutCubic, EaseOutBack } from './easingFunctions.js'

const DEFULT_FONT = "'Exo 2'";

function Effect_Glowing(drawingCtx, color, glowIntensity) {
    drawingCtx.shadowBlur = glowIntensity;
    drawingCtx.shadowColor = color;
    drawingCtx.shadowOffsetX = 0;
    drawingCtx.shadowOffsetY = 0;
}

function Effect_Stroke(drawingCtx) {
    drawingCtx.stroke();
}

function ScrollToRight(canvasToScroll) {
    canvasToScroll.scrollLeft = canvasToScroll.scrollWidth;
}

function ClearCanva(drawingCtx, canvasToDraw, clearCtxColor, cornerRadius) {
    let canvasSize = new Size(canvasToDraw.width, canvasToDraw.height);

    drawingCtx.save();
    drawingCtx.setTransform(1, 0, 0, 1, 0, 0);
    drawingCtx.clearRect(0, 0, canvasSize.x, canvasSize.y);
    DrawRoundedRect(drawingCtx, new Point(0, 0), canvasSize, cornerRadius, clearCtxColor, [], []);
    drawingCtx.restore();
}

function ResizeCanva(canvasElement, width, height, duration, changingCount, AnimateFunction) {
    const START_WIDTH = canvasElement.width;
    const START_HEIGHT = canvasElement.height;
    let startTime = null;
    
    function Step(timestamp) {
        if (!startTime) startTime = timestamp;
        const Progress = Math.min((timestamp - startTime) / duration, 1);
        canvasElement.width = START_WIDTH + (width - START_WIDTH) * EaseOutCubic(Progress);
        canvasElement.height = START_HEIGHT + (height - START_HEIGHT) * EaseOutCubic(Progress);
        AnimateFunction(timestamp, false);
        
        if (Progress < 1) return requestAnimationFrame(Step);
        changingCount.counter--;
    }

    changingCount.counter++;
    requestAnimationFrame(Step);
}

function DrawText(drawingCtx, point, text, fontSize, fontColor, font = DEFULT_FONT) {
    drawingCtx.fillStyle = fontColor;
    drawingCtx.font = `${fontSize}px ${font}, sans-serif`;
    drawingCtx.fillText(text, point.x, point.y);
}

function DrawRoundedRect(drawingCtx, point, size, radius, color, beforeFillEffects, afterFillEffects) {
    drawingCtx.fillStyle = color;
    drawingCtx.beginPath();
    drawingCtx.moveTo(point.x, point.y + radius);
    drawingCtx.arcTo(point.x, point.y + size.y, point.x + radius, point.y + size.y, radius);
    drawingCtx.arcTo(point.x + size.x, point.y + size.y, point.x + size.x, point.y + size.y - radius, radius);
    drawingCtx.arcTo(point.x + size.x, point.y, point.x + size.x - radius, point.y, radius);
    drawingCtx.arcTo(point.x, point.y, point.x, point.y + radius, radius);

    for (let CurrentEffect of beforeFillEffects)
        CurrentEffect(drawingCtx);

    drawingCtx.fill();

    for (let CurrentEffect of afterFillEffects)
        CurrentEffect(drawingCtx);
}

function DrawGlowingLine(drawingCtx, startPoint, endPoint, lineWidth, color, glowing, glowIntensity) {
    drawingCtx.beginPath();
    drawingCtx.strokeStyle = color;
    drawingCtx.lineWidth = lineWidth;
    drawingCtx.lineCap = "round";

    if (glowing) {
        drawingCtx.shadowBlur = glowIntensity;
        drawingCtx.shadowColor = color;
        drawingCtx.shadowOffsetX = 0;
        drawingCtx.shadowOffsetY = 0;
    }
    drawingCtx.moveTo(startPoint.x, startPoint.y);
    drawingCtx.lineTo(endPoint.x, endPoint.y);
    drawingCtx.stroke();

    drawingCtx.shadowBlur = 0;
}

function GetCSSColor(colorTag) {
    const ROOT_ELEMENT = document.documentElement;
    const COMPUTER_STYLE = getComputedStyle(ROOT_ELEMENT);
    
    const MAIN_COLOR = COMPUTER_STYLE.getPropertyValue(colorTag).trim();
    
    return MAIN_COLOR;
}

class Point {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    get x() { return this._x; }
    get y() { return this._y; } 
    set x(newX) { this._x = newX; }
    set y(newY) { this._y = newY; } 

    get clone() { return new Point(this._x, this._y); }
}

class Size {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    get x() { return this._x; }
    get y() { return this._y; } 
    set x(newX) { this._x = newX; }
    set y(newY) { this._y = newY; } 

    get clone() { return new Point(this._x, this._y); }
}

class TextDisplay {
    constructor(ctx, point, size, textToDraw, textDrawingFunction, objectDrawingFunction) {
        this._ctx = ctx;

        this._point = point;

        this._size = size;
        this._nextSize = size;

        this._text = textToDraw;
        this._nextText = textToDraw;
        this._fontSize = this.#FontSize();

        this._textDrawing = textDrawingFunction;
        this._objectDrawing = objectDrawingFunction;

        this._isAppearing = false;
        this._isChangingText = false;
        this._isChangingSize = true;
        this._isDeleting = false;

        this._shouldChangeText = false;
        this._startTime = 0;
        this._animationDuration = 500;
        this._currentScale = 0;

        this._deleted = false;
    }

    changeText(newText, durationMs = 500) {
        this._nextText = newText;
        this._isChangingText = true;
        this._isChangingSize = false;
        this._isAppearing = false;
        this._isDeleting = false;
        this._shouldChangeText = true;
        this._animationDuration = durationMs;
        this._startTime = performance.now();
    }

    changeSize(newSize, durationMs = 500) {
        this._nextSize = newSize;
        this._isChangingSize = true;
        this._isChangingText = false;
        this._isAppearing = false;
        this._isDeleting = false;
        this._animationDuration = durationMs;
        this._startTime = performance.now();
    }

    startAppear(durationMs = 500) {
        this._isAppearing = true;
        this._isChangingSize = false;
        this._isChangingText = false;
        this._isDeleting = false;
        this._animationDuration = durationMs;
        this._startTime = performance.now();
    }

    startDelete(durationMs = 500) {
        this._isDeleting = true;
        this._isChangingSize = false;
        this._isChangingText = false;
        this._isAppearing = false;
        this._animationDuration = durationMs;
        this._startTime = performance.now();
        this._text = this._nextText;
    }

    update(currentTime) {
        if (this._isDeleting)  return this.#DeletingAnimation(currentTime);
        if (this._isAppearing) return this.#AppearingAnimation(currentTime);
        if (this._isChangingText)  return this.#ChangingTextAnimation(currentTime);
        if (this._isChangingSize) return this.#ChangingSizeAnimation(currentTime);
    }

    #AppearingAnimation(currentTime) {
        let elapsed = currentTime - this._startTime;
        let progress = Math.min(elapsed / this._animationDuration, 1);

        this._currentScale = EaseOutBack(progress);

        if (progress >= 1) {
            this._isAppearing = false;
            this._currentScale = 1;
        }
    }

    #ChangingTextAnimation(currentTime) {
        let elapsed = currentTime - this._startTime;
        let progress = Math.min(elapsed / this._animationDuration, 1);

        if (progress < 0.5) {
            let phaseProgress = progress * 2; 
            this._currentScale = Math.max(0, 1 - EaseOutBack(phaseProgress) * 0.5); 
            this._currentScale = 1 - Math.sin(phaseProgress * Math.PI / 2);
        } else {
            if (this._shouldChangeText) {
                this._text = this._nextText;
                this._fontSize = this.#FontSize();

                this._shouldChangeText = false; 
            }

            let phaseProgress = (progress - 0.5) * 2;
            this._currentScale = EaseOutBack(phaseProgress);
        }

        if (progress >= 1) {
            this._currentScale = 1;
            this._isChangingText = false;
        }
    }

    #ChangingSizeAnimation(currentTime) {
        let elapsed = currentTime - this._startTime;
        let progress = Math.min(elapsed / this._animationDuration, 1);
        let portion = EaseOutBack(progress);

        let changeX = this._size.x + (this._nextSize.x - this._size.x) * portion;
        let changeY = this._size.y + (this._nextSize.y - this._size.y) * portion;

        this._size = new Size(changeX, changeY);

        if (progress >= 1) {
            this._nextSize = this._size;
            this._isChangingSize = false;
        }
    }

    #DeletingAnimation(currentTime) {
        let elapsed = currentTime - this._startTime;
        let progress = Math.min(elapsed / this._animationDuration, 1);

        this._currentScale = Math.max(0, EaseOutBack(1 - progress));

        if (progress >= 1) {
            this._isDeleting = false;
            this._currentScale = 0;
            this._deleted = true;
        }
    }

    #FontSize() {
        return Math.min((this._size.x - 5) / ((this._text.length/2) || 1), this._size.y * 0.8);
    }

    draw() {
        this._ctx.save();

        this._ctx.translate(this._point.x + this._size.x/2, this._point.y + this._size.y/2);
        this._ctx.scale(1, this._currentScale);

        let posToDraw = new Point(-this._size.x/2, -this._size.y/2);

        this._objectDrawing(this._ctx, posToDraw, this._size);

        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";

        this._textDrawing(this._ctx, new Point(0, 0), this._text, this._fontSize);

        this._ctx.restore();
    }

    get isDeletingAnimation() { return this._isDeleting; }
    get canDelete() { return this._deleted; }

    get nextText() {return this._nextText; }
    get text() { return this._text; }

    get size() { return this._size; }
    get nextSize() { return this._nextSize; }

    get position() { return this._point; }

    set position(newPoint) { this._point = newPoint; }
}

export { Point, Size, TextDisplay, ClearCanva, ResizeCanva, DrawGlowingLine, DrawText, DrawRoundedRect, GetCSSColor, ScrollToRight, Effect_Glowing, Effect_Stroke }