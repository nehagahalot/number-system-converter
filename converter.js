function validateInput(value, base) {
    if (base === "binary") {
        return /^[01]+$/.test(value);
    }
    if (base === "octal") {
        return /^[0-7]+$/.test(value);
    }
    if (base === "decimal") {
    return /^[0-9]+$/.test(value);
    }
    if (base === "hexadecimal") {
        return /^[0-9A-Fa-f]+$/.test(value);
    }
    return false;
}
function decimalToBinary(number) {

    let binary = [];
    if(number === 0) {
        return "0";
    }

    while (number > 0) {
        let remainder = number % 2;
        binary.unshift(remainder);
        number = Math.floor(number / 2);
    }

    return binary.join("");
}
function binaryToDecimal(number) {

    let decimal = 0;
    let power = 0;

    while (number > 0) {
        let digit = number % 10;
        decimal += digit * Math.pow(2, power);
        number = Math.floor(number / 10);
        power++;
    }

    return decimal;
}
function decimalToOctal(number) {

    let octal = [];
    if(number === 0) {
        return "0";
    }

    while (number > 0) {
        let remainder = number % 8;
        octal.unshift(remainder);
        number = Math.floor(number / 8);
    }

    return octal.join("");
}
function octalToDecimal(number) {
    let decimal = 0;
    let power = 0;

    while (number > 0) {
        let digit = number % 10;
        decimal += digit * Math.pow(8, power);
        number = Math.floor(number / 10);
        power++;
    }

    return decimal;
}
function decimalToHexadecimal(number) {
    let hexadecimal = [];
    let hexDigits = "0123456789ABCDEF";
    if(number === 0) {
        return "0";
    }
    while (number > 0) {
        let remainder = number % 16;
        hexadecimal.unshift(hexDigits[remainder]);
        number = Math.floor(number / 16);
    }
    return hexadecimal.join("");
}
function hexadecimalToDecimal(number) {

    let hexDigits = "0123456789ABCDEF";
    let decimal = 0;
    let power = 0;
    while (number.length > 0){
        let digit = number[number.length - 1];
        let digitValue = hexDigits.indexOf(digit.toUpperCase());
        decimal += digitValue * Math.pow(16, power);
        number = number.slice(0, -1);
        power++;
    }

    return decimal;
}
function convertToDecimal(value, base) {

    if (base === "decimal") {
        return parseInt(value, 10);
    }

    if (base === "binary") {
        return binaryToDecimal(parseInt(value, 10));
    }

    if (base === "octal") {
        return octalToDecimal(parseInt(value, 10));
    }

    if (base === "hexadecimal") {
        return hexadecimalToDecimal(value);
    }
}
function convertFromDecimal(value, base) {
    if (base === "decimal") {
        return value.toString();
    }           
    if (base === "binary") {
        return decimalToBinary(value);
    }
    if (base === "octal") {
        return decimalToOctal(value);
    }
    if (base === "hexadecimal") {
        return decimalToHexadecimal(value);
    }
}
let convertButton = document.getElementById("convertButton");
let conversion = document.getElementById("conversion");
let target = document.getElementById("target");
let numberInput = document.getElementById("numberInput");
let copyButton = document.getElementById("copyButton");
numberInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        convertButton.click();
    }

});
convertButton.addEventListener("click", function () {

    let from = conversion.value;
    let to = target.value;
    let input = numberInput.value.trim();
    if (!validateInput(input, from)) {
    document.getElementById("result").textContent = "Invalid input";
    document.getElementById("explanation").textContent =
        "Please enter a valid number for the selected number system.";
    return;
    }
    if (from === to) {
    document.getElementById("result").textContent = input;

    addToHistory(from, input, to,input);

    document.getElementById("explanation").textContent =
        "The number is already in the selected number system. No conversion is needed.";

    return;
}
    let decimalValue = convertToDecimal(input, from);
    let base = getBase(to);

    let result = convertFromDecimal(decimalValue, to);
    let explanation = document.getElementById("explanation");
    if (to === "decimal" && from !== "decimal") {

    let steps = explainToDecimal(input, getBase(from));

    explanation.textContent = steps.join("\n");

} else if (from === "decimal" && to !== "decimal") {

    let steps = explainDecimalConversion(decimalValue, base);

    let formattedSteps = formatDecimalExplanation(steps, base);

    explanation.textContent = formattedSteps.join("\n");

} else if (from !== "decimal" && to !== "decimal") {

    let toDecimalSteps = explainToDecimal(input, getBase(from));

    let decimalToTargetSteps =
        explainDecimalConversion(decimalValue, base);

    let formattedTargetSteps =
        formatDecimalExplanation(decimalToTargetSteps, base);

    let allSteps = [];

    allSteps.push("Step 1: Convert to Decimal");
    allSteps.push(...toDecimalSteps);

    allSteps.push("");
    allSteps.push("Step 2: Convert Decimal to " + to);
    allSteps.push(...formattedTargetSteps);

    explanation.textContent = allSteps.join("\n");
}
    
   

    document.getElementById("result").textContent = result;
    addToHistory(from, input, to, result);
});

function getBase(base) {

    if (base === "binary") {
        return 2;
    }

    if (base === "octal") {
        return 8;
    }

    if (base === "decimal") {
        return 10;
    }

    if (base === "hexadecimal") {
        return 16;
    }
}
function explainDecimalConversion(number, targetBase) {
     let steps = [];
    if (number === 0) {
       steps.push({
        number: 0,
        quotient: 0,
        remainder: 0
    });
    return steps;
}
    while (number > 0) {

    let remainder = number % targetBase;
    let quotient = Math.floor(number / targetBase);

    steps.push({
        number: number,
        quotient: quotient,
        remainder: remainder
    });

    number = quotient;
}
    return steps;
}
function formatRemainder(remainder, base) {

    if (base === 16) {
        let hexDigits = "0123456789ABCDEF";
        return hexDigits[remainder];
    }

    return remainder;
}

function formatDecimalExplanation(steps, base) {

    let explanation = [];
    let remainders = steps.map(function(step) {
    return formatRemainder(step.remainder, base);
});
    let result = remainders.reverse().join("");
    steps.forEach(function(step) {

        explanation.push(
            `${step.number} ÷ ${base} = ${step.quotient} remainder ${formatRemainder(step.remainder, base)}`
        );

    });
    explanation.push("");
    explanation.push(`Read the remainders from bottom to top: ${result}`);

    return explanation;
}
function explainToDecimal(number, base) {

    let explanation = [];
    let power = number.length - 1;
    let values = [];

    for (let i = 0; i < number.length; i++) {
    let digit = number[i];
    let digitValue;

    if (base === 16) {
        let hexDigits = "0123456789ABCDEF";
        digitValue = hexDigits.indexOf(digit.toUpperCase());
    } else {
        digitValue = parseInt(digit);
    }

    let value = digitValue * Math.pow(base, power);

    explanation.push(
        `${digit} × ${base}^${power} = ${value}`
    );

    power--;
    values.push(value);
    }
    let total = values.reduce(function(sum, value) {
    return sum + value;
}, 0);
    explanation.push(`Total: ${total}`);
    return explanation;
}
copyButton.addEventListener("click", function () {
    let result = document.getElementById("result").textContent;

    if (result === "") {
        return;
    }

    navigator.clipboard.writeText(result);

    copyButton.textContent = "Copied!";

    setTimeout(function () {
        copyButton.textContent = "Copy Result";
    }, 1500);
});
let historyList = document.getElementById("historyList");
let history = JSON.parse(localStorage.getItem("conversionHistory")) || [];
function addToHistory(from, input, to, result) {
    let conversion = {
        from: from,
        input: input,
        to: to,
        result: result
    };

    history.unshift(conversion);
    localStorage.setItem("conversionHistory", JSON.stringify(history));
    displayHistory();
}
function displayHistory() {
    historyList.innerHTML = "";

    if (history.length === 0) {
        historyList.textContent = "No conversions yet.";
        return;
    }

    history.forEach(function(conversion) {
        let historyItem = document.createElement("div");

        historyItem.textContent =
            `${conversion.input} (${conversion.from}) → ${conversion.result} (${conversion.to})`;

        historyList.appendChild(historyItem);
    });
}
let clearHistoryButton = document.getElementById("clearHistoryButton");
clearHistoryButton.addEventListener("click", function () {
    history = [];
    localStorage.removeItem("conversionHistory");
    displayHistory();
});
displayHistory();