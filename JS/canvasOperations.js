function ClearCanvasWithTransforms(ctx, canvas, color, radius=15) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    RoundedRect(ctx, 0, 0, canvas.width, canvas.height, radius, color, false);
    ctx.restore();
}

function DrawText(ctx, text, posX, posY, fontSize = 30, font = "'Exo 2'") {
    ctx.font = `${fontSize}px ${font}, sans-serif`;
    ctx.fillText(text, posX, posY);
}

function RoundedRect(ctx, x, y, width, height, radius, color, useStroke = true, glowing = false, glowIntensity = 5) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.arcTo(x, y, x, y + radius, radius);

    if (glowing) {
        ctx.shadowBlur = glowIntensity;
        ctx.shadowColor = color;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
    ctx.fill();

    if (useStroke) ctx.stroke();
}

function GetCSSColor(colorTag) {
    const rootElement = document.documentElement;
    const computedStyle = getComputedStyle(rootElement);
    
    const mainColor = computedStyle.getPropertyValue(colorTag).trim();
    
    return mainColor;
}

const ScrollToRight = (element) => {
    element.scrollLeft = element.scrollWidth;
};

function EaseOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}    

class BitBox {
    constructor(ctx, posX, posY, width, height, radius, color, text, glowing = false, glowingIntensity = 5) {
        this.ctx = ctx;

        this.positionX = posX;
        this.positionY = posY;

        this.width = width;
        this.height = height;
        this.radius = radius;

        this.color = color;
        this.glowing = glowing;
        this.glowingIntensity = glowingIntensity;

        this.text = text;
        this.nextText = text;
        this.fontSize = Math.min((width - 10) / (text.length || 1), height * 0.9);

        this.isAppearing = false;
        this.isChanging = false;
        this.isDeleting = false;

        this.shouldChangeText = false;
        this.startTime = 0;
        this.animationDuration = 500;
        this.currentScale = 0;

        this.deleted = false;
    }

    changeText(nextText, timeMs = 500) {
        this.nextText = nextText;
        this.isChanging = true;
        this.isAppearing = false;
        this.isDeleting = false;
        this.shouldChangeText = true;
        this.animationDuration = timeMs;
        this.startTime = performance.now();
    }

    startAppear(timeMs = 500) {
        this.isAppearing = true;
        this.animationDuration = timeMs;
        this.startTime = performance.now();
    }

    startDelete(timeMs = 500) {
        this.isDeleting = true;
        this.animationDuration = timeMs;
        this.startTime = performance.now();
        this.text = this.nextText;
    }

    update(currentTime) {
        if (this.isDeleting)  return this.#DeletingAnimation(currentTime);
        if (this.isAppearing) return this.#AppearingAnimation(currentTime);
        if (this.isChanging)  return this.#ChangingAnimation(currentTime);
    }

    #AppearingAnimation(currentTime) {
        let elapsed = currentTime - this.startTime;
        let progress = Math.min(elapsed / this.animationDuration, 1);

        const EaseOutBack = (x) => {
            const C1 = 1.70158;
            const C3 = C1 + 1;
            return 1 + C3 * Math.pow(x - 1, 3) + C1 * Math.pow(x - 1, 2);
        };

        this.currentScale = EaseOutBack(progress);

        if (progress >= 1) {
            this.isAppearing = false;
            this.currentScale = 1;
        }
    }

    #ChangingAnimation(currentTime) {
        let elapsed = currentTime - this.startTime;
        let progress = Math.min(elapsed / this.animationDuration, 1);

        const EaseOutBack = (x) => {
            const C1 = 1.70158;
            const C3 = C1 + 1;
            return 1 + C3 * Math.pow(x - 1, 3) + C1 * Math.pow(x - 1, 2);
        };

        if (progress < 0.5) {
            let phaseProgress = progress * 2; 
            this.currentScale = Math.max(0, 1 - EaseOutBack(phaseProgress) * 0.5); 
            this.currentScale = 1 - Math.sin(phaseProgress * Math.PI / 2);
        } else {
            if (this.shouldChangeText) {
                this.text = this.nextText;
                this.fontSize = Math.min((this.width - 10) / (this.text.length || 1), this.height * 0.8);

                this.shouldChangeText = false; 
            }

            let phaseProgress = (progress - 0.5) * 2;
            this.currentScale = EaseOutBack(phaseProgress);
        }

        if (progress >= 1) {
            this.currentScale = 1;
            this.isChanging = false;
        }
    }

    #DeletingAnimation(currentTime) {
        let elapsed = currentTime - this.startTime;
        let progress = Math.min(elapsed / this.animationDuration, 1);

        const EASE_OUT_BACK = (x) => {
            const C1 = 1.70158;
            const C3 = C1 + 1;
            return 1 + C3 * Math.pow(x - 1, 3) + C1 * Math.pow(x - 1, 2);
        };

        this.currentScale = Math.max(0, EASE_OUT_BACK(1 - progress));

        if (progress >= 1) {
            this.isDeleting = false;
            this.currentScale = 0;
            this.deleted = true;
        }
    }

    draw() {
        this.ctx.save();

        let centerX = this.positionX + this.width/2,
            centerY = this.positionY + this.height/2;

        this.ctx.translate(centerX, centerY);
        this.ctx.scale(1, this.currentScale);

        RoundedRect(this.ctx, -this.width/2, -this.height/2, this.width, this.height, this.radius, this.color, !this.glowing, this.glowing, this.glowingIntensity);

        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = "#000000";

        DrawText(this.ctx, this.text, 0, 0, this.fontSize);

        this.ctx.restore();
    }

    setPosition(newPositionX, newPositionY) {
        this.positionX = newPositionX;
        this.positionY = newPositionY;
    }

    get getNextText() {return this.nextText; }
    get canDelete() { return this.deleted; }
    get getText() { return this.text; }
    get isDeletingAnimation() { return this.isDeleting; }
    get position() { return {"x": this.positionX, "y": this.positionY}}
}
