function EaseOutCubic(x) { 
    return 1 - Math.pow(1 - x, 3); 
}

function EaseOutBack(x) {
    const C1 = 1.70158;
    const C3 = C1 + 1;
    return 1 + C3 * Math.pow(x - 1, 3) + C1 * Math.pow(x - 1, 2);
};

export { EaseOutCubic, EaseOutBack };