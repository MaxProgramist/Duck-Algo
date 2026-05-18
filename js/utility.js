const TYPES_SIGNES = {
    "int": ["signed", "unsigned"],
    "float": ["signed"],
    "double": ["signed"],
    "char": ["signed", "unsigned"],
    "wchar_t": ["unsigned"],
    "bool": []
}

const TYPES_LENGTH_IN_BITS = {
    int: 32,
    float: 32,
    double: 64,
    char: 8,
    wchar_t: 16,
    bool: 8
}

const TYPES_LIMITS = {
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

function UpdateBoxes(animationTagList, outputCtx, animationSettings, currentTime) {
    for (let currentAnimationTag of animationTagList) {
        let currentAnimation = animationSettings[currentAnimationTag];
        for (let currentListOfBits of Object.values(currentAnimation.bits)) {
            let isCanvaVisible = outputCtx[currentAnimationTag].visible;

            for (let currentElementIndex = 0; currentElementIndex < currentListOfBits.length; currentElementIndex++) {
                let currentBitBox = currentListOfBits[currentElementIndex];

                if (currentBitBox == null) continue;
                
                if (currentBitBox.canDelete) {
                    currentListOfBits.splice(currentElementIndex, 1);
                    currentElementIndex--;
                    continue;
                }
            
                currentBitBox.update(currentTime);
                if (isCanvaVisible) currentBitBox.draw();
            }
        }
    }
}

function DecToBin_Int(decimalValue, isSigned, outputLength) {
    let binaryValue = "";
    let isNegative = decimalValue < 0;
    let absoluteValue = Math.abs(decimalValue);

    if (isNegative) absoluteValue -= 1;

    for (let currentPowerOfTen = 1; currentPowerOfTen <= absoluteValue; currentPowerOfTen *= 2) {
        if (absoluteValue & currentPowerOfTen) binaryValue += isNegative ? "0" : "1";
        else binaryValue += isNegative ? "1" : "0";
    }

    let targetLength = outputLength - 1 * isSigned;
    if (outputLength == -1)
        targetLength = Math.ceil((binaryValue.length + 1 * isSigned) / 8) * 8 - 1 * isSigned;
    
    for (let tempCounter = binaryValue.length; tempCounter < targetLength; tempCounter++)
        binaryValue += isNegative ? "1" : "0";

    if (isSigned) binaryValue += isNegative ? "1" : "0";

    return reverseString(binaryValue);
}

function DecToBin_FloatPoint(decimalValue, floatPointType) {
    if (isNaN(decimalValue)) return "";

    let bitBuffer, bitView;

    bitBuffer = new ArrayBuffer(TYPES_LENGTH_IN_BITS[floatPointType] / 8);
    bitView = new DataView(bitBuffer);
    if (floatPointType == "float")
        bitView.setFloat32(0, decimalValue, false);
    else if (floatPointType == "double")
        bitView.setFloat64(0, decimalValue, false);

    let binaryValue = "";
    const BINARY_VALUE_LENGTH = bitBuffer.byteLength;

    for (let bitCounter = 0; bitCounter < BINARY_VALUE_LENGTH; bitCounter++) {
        let bits = bitView.getUint8(bitCounter).toString(2).padStart(8, '0');
        binaryValue += bits;
    }

    return binaryValue;
}

function BinToDec_Int(binaryValue, isSigned) {
    if (binaryValue.length % 8 !== 0 || binaryValue.length == 0)
        return "";

    let isNegative = binaryValue[0] === '1';
    let decimalValue = 0;

    if (isNegative && isSigned) {
        let invertedBits = "";
        for (let i = 0; i < binaryValue.length; i++)
            invertedBits += binaryValue[i] === '0' ? '1' : '0';
        
        decimalValue = -(parseInt(invertedBits, 2) + 1);
    } else decimalValue = parseInt(binaryValue, 2);

    return decimalValue;
}

function BinToDec_FloatPoint(binaryValue, floatPointType) {
    const FLOAT_EXPONENT_BITS = 8;
    const FLOAT_BIAS = 127;
    const DOUBLE_EXPONENT_BITS = 11;
    const DOUBLE_BIAS = 1023;

    let exponentBitsCount, biasValue;

    if (floatPointType === "float") {
        exponentBitsCount = FLOAT_EXPONENT_BITS;
        biasValue = FLOAT_BIAS;
    } else {
        exponentBitsCount = DOUBLE_EXPONENT_BITS;
        biasValue = DOUBLE_BIAS;
    }

    let signBitValue = parseInt(binaryValue[0]);
    let isNegative = (signBitValue === 1) ? -1 : 1;

    let exponentPart = binaryValue.substring(1, 1 + exponentBitsCount);
    let rawExponent = parseInt(exponentPart, 2);
    let actualExponent = rawExponent - biasValue;

    let mantissaPart = binaryValue.substring(1 + exponentBitsCount);
    let fractionValue = 0;

    if (rawExponent !== 0) fractionValue = 1;

    for (let i = 0; i < mantissaPart.length; i++)
        if (mantissaPart[i] === "1")
            fractionValue += Math.pow(2, -(i + 1));

    let decimalValue = isNegative * fractionValue * Math.pow(2, actualExponent);

    return decimalValue;
}

function ConvertBtwTypes(decimalValueToConvert, typeFromConvert, typeToConvert) {
    if (typeFromConvert.includes("char") || typeFromConvert.includes("wchar_t")) {
        decimalValueToConvert = decimalValueToConvert.charCodeAt(0);
        let signed = typeFromConvert.trim()[0];

        return ConvertBtwTypes(decimalValueToConvert, signed + " int", typeToConvert);
    }
    if (typeFromConvert.includes("bool")) {
        decimalValueToConvert = (decimalValueToConvert == "true")?1:0;

        return ConvertBtwTypes(decimalValueToConvert, "int", typeToConvert);
    }

    let binaryValue = "";

    if (typeFromConvert.includes("int")) {
        const IS_SIGNED = typeFromConvert.includes("signed") && !typeFromConvert.includes("unsigned");

        binaryValue = DecToBin_Int(parseInt(decimalValueToConvert), IS_SIGNED, TYPES_LENGTH_IN_BITS.int).toString();
    } else if (typeFromConvert.includes("float") || typeFromConvert.includes("double")) {
        const FLOAT_POINT_TYPE = typeFromConvert.replace("signed ","");

        binaryValue = DecToBin_FloatPoint(decimalValueToConvert, FLOAT_POINT_TYPE).toString();
    }

    let typeToConvert_filtered = typeToConvert.replace("unsigned ","").replace("signed ","");

    if (binaryValue.length > TYPES_LENGTH_IN_BITS[typeToConvert_filtered])
        binaryValue = binaryValue.slice(binaryValue.length - TYPES_LENGTH_IN_BITS[typeToConvert_filtered]);
    else if (binaryValue.length < TYPES_LENGTH_IN_BITS[typeToConvert_filtered])
        binaryValue = binaryValue.padStart(TYPES_LENGTH_IN_BITS[typeToConvert_filtered], "0");

    if (typeToConvert.includes("float") || typeToConvert.includes("double")) {
        const FLOAT_POINT_TYPE = typeToConvert.replace("signed ","");

        return BinToDec_FloatPoint(binaryValue, FLOAT_POINT_TYPE).toString();
    }

    const IS_SIGNED = typeToConvert.includes("signed") && !typeToConvert.includes("unsigned");
    let finalDecimalValue = BinToDec_Int(binaryValue, IS_SIGNED).toString();

    if (typeToConvert.includes("bool"))
        return Boolean(parseInt(finalDecimalValue));
    if (typeToConvert.includes("char") || typeToConvert.includes("wchar_t")) 
        return String.fromCharCode(parseInt(finalDecimalValue));

    return finalDecimalValue.toString();
}

function Input_Filter(event, canBeNegative, dataType, isSigned) {
    let currentType = dataType;
    if (dataType != "bool") {
        if (isSigned) currentType = "signed " + currentType;
        else currentType = "unsigned " + currentType;
    }

    const INPUT_VALUE = event.target.value;

    if (INPUT_VALUE.length == 0) return;

    if (currentType.includes("float") || currentType.includes("double")) {
        if (INPUT_VALUE.endsWith(".") || INPUT_VALUE.endsWith('e') || INPUT_VALUE === "-") 
            return;
        
        const FLOAT_POINT_VALUE = parseFloat(INPUT_VALUE);

        if (isNaN(FLOAT_POINT_VALUE)) return event.target.value = "";

        const ABSOLUTE_FLOAT_POINT_VALUE = Math.abs(FLOAT_POINT_VALUE);

        event.target.value = clamp(ABSOLUTE_FLOAT_POINT_VALUE, 
            TYPES_LIMITS[currentType].min, TYPES_LIMITS[currentType].max) * Math.sign(FLOAT_POINT_VALUE);
    } else {
        event.target.value = NumberFilter(INPUT_VALUE, canBeNegative);
        if (IsNumber(INPUT_VALUE))
            event.target.value = clamp(parseInt(event.target.value), 
                TYPES_LIMITS[currentType].min, TYPES_LIMITS[currentType].max);
    }
}

function NumberFilter(inputValue, canBeNegative) { 
    let cleaned = inputValue.replace(/[^0-9-]/g, "").replace(/\s/g, '');

    if (cleaned.includes("-")) {
        const IS_NEGATIVE = cleaned.startsWith("-");
        const DIGITS = cleaned.replace(/-/g, "");
        cleaned = (IS_NEGATIVE && canBeNegative ? "-" : "") + DIGITS;
    }

    return cleaned;
}

function IsNumber     (value)         { return !(value.length == 0 || (value.length == 1 && value == "-")); }
function reverseString(string)        { return string.split("").reverse().join(""); }
function clamp        (val, min, max) { return Math.min( Math.max(val, min), max ); }

export { UpdateBoxes, DecToBin_Int, DecToBin_FloatPoint, BinToDec_Int, Input_Filter, IsNumber, NumberFilter, ConvertBtwTypes, clamp, TYPES_SIGNES }