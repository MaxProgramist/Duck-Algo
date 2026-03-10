function DecToBin(decimalNumber) {
    let binaryResult = "";
    let isNegative = decimalNumber < 0;
    let absoluteNumber = Math.abs(decimalNumber);

    if (isNegative) absoluteNumber -= 1;

    for (let currentPower = 1; currentPower <= absoluteNumber; currentPower *= 2) {
        if (absoluteNumber & currentPower) binaryResult += isNegative ? "0" : "1";
        else binaryResult += isNegative ? "1" : "0";
    }

    let targetLength = Math.ceil((binaryResult.length+1) / 8) * 8 - 1;
    
    for (let i = binaryResult.length; i < targetLength; i++)
        binaryResult += isNegative ? "1" : "0";

    binaryResult += isNegative ? "1" : "0";

    return reverseString(binaryResult);
}

function DecToBin_Float(inputElement) {
    const value = parseFloat(inputElement.value);
    if (isNaN(value)) return "";

    const MAX_FLOAT32 = 3.4028234663852886e+38;
    const MIN_FLOAT32 = 1.1754943508222875e-38;
    const ABSOLUTE_VALUE = Math.abs(value);

    let buffer, view;

    if (value !== 0 && (ABSOLUTE_VALUE > MAX_FLOAT32 || ABSOLUTE_VALUE < MIN_FLOAT32))
        inputElement.value = clamp(ABSOLUTE_VALUE, MIN_FLOAT32, MAX_FLOAT32) * Math.sign(value);

    buffer = new ArrayBuffer(4);
    view = new DataView(buffer);
    view.setFloat32(0, value, false);

    let binaryString = "";
    const BYTE_LENGTH = buffer.byteLength;

    for (let i = 0; i < BYTE_LENGTH; i++) {
        let bits = view.getUint8(i).toString(2).padStart(8, '0');
        binaryString += bits;
    }

    return binaryString;
}

function BinaryToDecimalComplement(binaryString) {
    if (binaryString.length % 8 !== 0 || binaryString.length == 0) {
        return "";
    }

    let isNegative = binaryString[0] === '1';
    let resultDecimal = 0;

    if (isNegative) {
        let invertedBits = "";
        for (let i = 0; i < binaryString.length; i++) {
            invertedBits += binaryString[i] === '0' ? '1' : '0';
        }
        
        resultDecimal = -(parseInt(invertedBits, 2) + 1);
    } else {
        resultDecimal = parseInt(binaryString, 2);
    }

    return resultDecimal.toString();
}

function Input_Filter(event, canBeNegative, type = "int") {
    const LIMITS = {
        "int": {"min": -2147483648, "max": 2147483647},
        "short": {"min": -32768, "max": 32767},
        "char": {"min": -128, "max": 127}
    }

    event.target.value = numberFilter(event.target.value, canBeNegative);
    if (IsNumber(event.target.value))
        event.target.value = clamp(parseInt(event.target.value), LIMITS[type].min, LIMITS[type].max);
}

function numberFilter(inputString, canBeNegative) { 
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

export { DecToBin, DecToBin_Float, BinaryToDecimalComplement, Input_Filter, IsNumber, clamp }