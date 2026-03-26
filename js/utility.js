const TYPES_SIGNES = {
    "int": ["signed", "unsigned"],
    "float": ["signed"],
    "double": ["signed"],
    "char": ["signed", "unsigned"],
    "wchar_t": ["unsigned"],
    "bool": []
}

const TYPES_BIT_LENGTH = {
    int: 32,
    float: 32,
    double: 64,
    char: 8,
    wchar_t: 16,
    bool: 8
}

function UpdateBoxes(tagList, outputCtx, animationObject, currentTime) {
    for (let currentAnimationName of tagList) {
        let currentAnimation = animationObject[currentAnimationName];
        for (let currentKey in currentAnimation.bits) {
            let currentList =  currentAnimation.bits[currentKey];
            let visibleCanva = outputCtx[currentAnimationName].visible;

            for (let currentElement = 0; currentElement < currentList.length; currentElement++) {
                let bitBox = currentList[currentElement];

                if (bitBox == null) continue;
                
                if (bitBox.canDelete) {
                    currentList.splice(currentElement, 1);
                    currentElement--;
                    continue;
                }
            
                bitBox.update(currentTime);
                if (visibleCanva) bitBox.draw();
            }
        }
    }
}

function DecToBin_Int(decimalNumber, signed = true, length = -1) {
    let binaryResult = "";
    let isNegative = decimalNumber < 0;
    let absoluteNumber = Math.abs(decimalNumber);

    if (isNegative) absoluteNumber -= 1;

    for (let currentPower = 1; currentPower <= absoluteNumber; currentPower *= 2) {
        if (absoluteNumber & currentPower) binaryResult += isNegative ? "0" : "1";
        else binaryResult += isNegative ? "1" : "0";
    }

    let targetLength = length - 1*signed;
    if (length == -1)
        targetLength = Math.ceil((binaryResult.length+1*signed) / 8) * 8 - 1*signed;
    
    for (let i = binaryResult.length; i < targetLength; i++)
        binaryResult += isNegative ? "1" : "0";

    if (signed) binaryResult += isNegative ? "1" : "0";

    return reverseString(binaryResult);
}

function DecToBin_FloatPoint(numberToConvert, type) {
    if (isNaN(numberToConvert)) return "";

    let buffer, view;

    buffer = new ArrayBuffer(TYPES_BIT_LENGTH[type]/8);
    view = new DataView(buffer);
    if (type == "float") view.setFloat32(0, numberToConvert, false);
    else view.setFloat64(0, numberToConvert, false);

    let binaryString = "";
    const BYTE_LENGTH = buffer.byteLength;

    for (let i = 0; i < BYTE_LENGTH; i++) {
        let bits = view.getUint8(i).toString(2).padStart(8, '0');
        binaryString += bits;
    }

    return binaryString;
}

function BinToDec_Int(binaryString, signed) {
    if (binaryString.length % 8 !== 0 || binaryString.length == 0) {
        return "";
    }

    let isNegative = binaryString[0] === '1';
    let resultDecimal = 0;

    if (isNegative && signed) {
        let invertedBits = "";
        for (let i = 0; i < binaryString.length; i++) {
            invertedBits += binaryString[i] === '0' ? '1' : '0';
        }
        
        resultDecimal = -(parseInt(invertedBits, 2) + 1);
    } else {
        resultDecimal = parseInt(binaryString, 2);
    }

    return resultDecimal;
}

function BinToDec_FloatPoint(binaryString, type) {
    const FLOAT_EXPONENT_BITS = 8;
    const FLOAT_BIAS = 127;
    const DOUBLE_EXPONENT_BITS = 11;
    const DOUBLE_BIAS = 1023;

    let exponentBitsCount;
    let biasValue;

    if (type === "float") {
        exponentBitsCount = FLOAT_EXPONENT_BITS;
        biasValue = FLOAT_BIAS;
    } else {
        exponentBitsCount = DOUBLE_EXPONENT_BITS;
        biasValue = DOUBLE_BIAS;
    }

    let signBit = parseInt(binaryString[0]);
    let signMultiplier = (signBit === 1) ? -1 : 1;

    let exponentPart = binaryString.substring(1, 1 + exponentBitsCount);
    let rawExponent = parseInt(exponentPart, 2);
    let actualExponent = rawExponent - biasValue;

    let mantissaPart = binaryString.substring(1 + exponentBitsCount);
    let fractionValue = 0;

    if (rawExponent !== 0) fractionValue = 1;

    for (let i = 0; i < mantissaPart.length; i++)
        if (mantissaPart[i] === "1")
            fractionValue += Math.pow(2, -(i + 1));

    let finalResult = signMultiplier * fractionValue * Math.pow(2, actualExponent);

    return finalResult;
}

function ConvertBtwTypes(value, typeFrom, typeTo) {
    if (typeFrom.includes("char") || typeFrom.includes("wchar_t")) {
        value = value.charCodeAt(0);
        let signed = typeFrom.trim()[0];

        return ConvertBtwTypes(value, signed + " int", typeTo);
    }
    if (typeFrom.includes("bool")) {
        value = (value == "true")?1:0;

        return ConvertBtwTypes(value, "int", typeTo);
    }

    let binValue = "";

    if (typeFrom.includes("int"))
        binValue = DecToBin_Int(parseInt(value), !typeFrom.includes("unsigned"), TYPES_BIT_LENGTH.int).toString();
    else if (typeFrom.includes("float") || typeFrom.includes("double"))
        binValue = DecToBin_FloatPoint(value, typeFrom.replace("signed ","")).toString();

    let filteredTypeTo = typeTo.replace("unsigned ","").replace("signed ","");

    if (binValue.length > TYPES_BIT_LENGTH[filteredTypeTo])
        binValue = binValue.slice(binValue.length - TYPES_BIT_LENGTH[filteredTypeTo]);
    else if (binValue.length < TYPES_BIT_LENGTH[filteredTypeTo])
        binValue = binValue.padStart(TYPES_BIT_LENGTH[filteredTypeTo], "0");

    if (typeTo.includes("float") || typeTo.includes("double"))
        return BinToDec_FloatPoint(binValue, typeTo.replace("signed ","")).toString();

    let signedValue = typeTo.includes("signed") && !typeTo.includes("unsigned");
    let finalValue = BinToDec_Int(binValue, signedValue).toString();

    if (typeTo.includes("bool"))
        return Boolean(parseInt(finalValue));
    if (typeTo.includes("char") || typeTo.includes("wchar_t")) 
        return String.fromCharCode(parseInt(finalValue));

    return finalValue.toString();
}

function Input_Filter(event, canBeNegative, type = "int", signed = true) {
    let currentType = (type == "bool"?"":(signed?"signed ":"unsigned ")) + type;
    const LIMITS = {
        "signed int": {min: -2147483648, max: 2147483647},
        "unsigned int": {min: 0, max: 4294967295},
        "signed short": {min: -32768, max: 32767},
        "unsigned short": {min: 0, max: 65535},

        "signed float": {min: 1.1754943508222875e-38, max: 3.4028234663852886e+38},
        "signed double": {min: 2.2250738585072014e-308, max: 1.7976931348623157e+308},

        "signed char": {min: -128, max: 127},
        "unsigned char": {min: 0, max: 255},
        
        "unsigned wchar_t": {min: 0, max: 65535},

        "bool": {min: 0, max: 1}
    }

    if (currentType == "signed float" || currentType == "signed double") {
        if (event.target.value.endsWith(".") || event.target.value.endsWith('e') || event.target.value === "-") return;
        const value = parseFloat(event.target.value);
        if (isNaN(value)) return event.target.value = "";

        const ABSOLUTE_VALUE = Math.abs(value);

        event.target.value = clamp(ABSOLUTE_VALUE, LIMITS[currentType].min, LIMITS[currentType].max) * Math.sign(value);
    } else {
        event.target.value = NumberFilter(event.target.value, canBeNegative);
        if (IsNumber(event.target.value))
            event.target.value = clamp(parseInt(event.target.value), LIMITS[currentType].min, LIMITS[currentType].max);
    }
}

function NumberFilter(inputString, canBeNegative) { 
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

export { UpdateBoxes, DecToBin_Int, DecToBin_FloatPoint, BinToDec_Int, Input_Filter, IsNumber, NumberFilter, ConvertBtwTypes, clamp, TYPES_SIGNES }