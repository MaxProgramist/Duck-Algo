const ScrollToRight = (element) => { element.scrollLeft = element.scrollWidth; };

function ClearCanvasWithTransforms(ctx, canvas, color, radius=15) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    RoundedRect(ctx, new Point(0, 0), canvas.width, canvas.height, radius, color, false);
    ctx.restore();
}

function CanvasResize(canvasElement, width, height, duration, changingCount, AnimateFunction) {
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

function DrawText(ctx, text, point, fontSize = 30, font = "'Exo 2'") {
    ctx.font = `${fontSize}px ${font}, sans-serif`;
    ctx.fillText(text, point.x, point.y);
}

function RoundedRect(ctx, point, width, height, radius, color, useStroke = true, glowing = false, glowIntensity = 5) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y + radius);
    ctx.arcTo(point.x, point.y + height, point.x + radius, point.y + height, radius);
    ctx.arcTo(point.x + width, point.y + height, point.x + width, point.y + height - radius, radius);
    ctx.arcTo(point.x + width, point.y, point.x + width - radius, point.y, radius);
    ctx.arcTo(point.x, point.y, point.x, point.y + radius, radius);

    if (glowing) {
        ctx.shadowBlur = glowIntensity;
        ctx.shadowColor = color;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
    ctx.fill();

    if (useStroke) ctx.stroke();
}

function GlowingLine(ctx, startX, startY, endX, endY, lineWidth = 5, color, glowing = false, glowIntensity = 5) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";

    if (glowing) {
        ctx.shadowBlur = glowIntensity;
        ctx.shadowColor = color;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.shadowBlur = 0;
}

function GetCSSColor(colorTag) {
    const rootElement = document.documentElement;
    const computedStyle = getComputedStyle(rootElement);
    
    const mainColor = computedStyle.getPropertyValue(colorTag).trim();
    
    return mainColor;
}

function EaseOutCubic(x) { return 1 - Math.pow(1 - x, 3); }

function EaseOutBack(x) {
    const C1 = 1.70158;
    const C3 = C1 + 1;
    return 1 + C3 * Math.pow(x - 1, 3) + C1 * Math.pow(x - 1, 2);
};

class Point {
    constructor(x, y) {
        this.xValue = x;
        this.yValue = y;
    }

    get x() { return this.xValue; }
    get y() { return this.yValue; } 
    set x(newX) { this.xValue = newX; }
    set y(nexY) { this.yValue = nexY; } 

    get clone() { return new Point(this.xValue, this.yValue); }
}

class Size {
    constructor(x, y) {
        this.xValue = x;
        this.yValue = y;
    }

    get x() { return this.xValue; }
    get y() { return this.yValue; } 
    set x(newX) { this.xValue = newX; }
    set y(nexY) { this.yValue = nexY; } 

    get clone() { return new Point(this.xValue, this.yValue); }
}

class BitBox {
    constructor(ctx, point, size, radius, color, text, glowing = false, glowingIntensity = 5) {
        this._ctx = ctx;

        this._position = point;

        this._size = size;
        this._nextSize = size;
        this._radius = radius;

        this._color = color;
        this._glowing = glowing;
        this._glowingIntensity = glowingIntensity;

        this._text = text;
        this._nextText = text;
        this._fontSize = this.#FontSize();

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

    changeText(nextText, timeMs = 500) {
        this._nextText = nextText;
        this._isChangingText = true;
        this._isChangingSize = false;
        this._isAppearing = false;
        this._isDeleting = false;
        this._shouldChangeText = true;
        this._animationDuration = timeMs;
        this._startTime = performance.now();
    }

    changeSize(newSize, timeMs = 500) {
        this._nextSize = newSize;
        this._isChangingSize = true;
        this._isChangingText = false;
        this._isAppearing = false;
        this._isDeleting = false;
        this._animationDuration = timeMs;
        this._startTime = performance.now();
    }

    startAppear(timeMs = 500) {
        this._isAppearing = true;
        this._isChangingSize = false;
        this._isChangingText = false;
        this._isDeleting = false;
        this._animationDuration = timeMs;
        this._startTime = performance.now();
    }

    startDelete(timeMs = 500) {
        this._isDeleting = true;
        this._isChangingSize = false;
        this._isChangingText = false;
        this._isAppearing = false;
        this._animationDuration = timeMs;
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

        this._ctx.translate(this._position.x + this._size.x/2, this._position.y + this._size.y/2);
        this._ctx.scale(1, this._currentScale);

        let posToDraw = new Point(-this._size.x/2, -this._size.y/2);

        RoundedRect(this._ctx, posToDraw, this._size.x, this._size.y, this._radius, this._color, !this._glowing, this._glowing, this._glowingIntensity);

        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";
        this._ctx.fillStyle = "#000000";

        DrawText(this._ctx, this._text, new Point(0, 0), this._fontSize);

        this._ctx.restore();
    }

    get isDeletingAnimation() { return this._isDeleting; }
    get canDelete() { return this._deleted; }

    get nextText() {return this._nextText; }
    get text() { return this._text; }

    get size() { return this._size; }
    get nextSize() { return this._nextSize; }

    get position() { return this._position; }
    get getCTX() { return this._ctx; }

    set position(point) { this._position = point; }
}

export { Point, Size, BitBox, ClearCanvasWithTransforms, CanvasResize, GlowingLine, GetCSSColor, ScrollToRight, EaseOutBack, EaseOutCubic }