function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    let cleanInput = expr.replace(/\s/g, '');
    let bracketsTest = cleanInput.replace(/[^\(\)]/g, '');
    if (!check(bracketsTest)) {
        throw 'ExpressionError: Brackets must be paired';
    }
    while (cleanInput.match(/\([0-9,\.\+\-\*/]*\)/)) {
        let substr = cleanInput.match(/\([0-9,\.\+\-\*/]*\)/)['0'];
        let tempResult = expressionWithoutBrackets(substr.slice(1, substr.length - 1));
        cleanInput = cleanInput.replace(substr, tempResult);

    }

    let result = expressionWithoutBrackets(cleanInput)
    return result
}

function expressionWithoutBrackets(cleanInput) {
    let nums = cleanInput.matchAll(/(?<!\d)\-?\d+\.?\d*/g);
    let operators = cleanInput.matchAll(/(?<=\d)[\+\-\*/]{1}/g);
    let numsMap = new Map();
    let operatorsArr = [];
    for (let value of nums) {
        numsMap.set(value['index'], value['0'] - 0);
    }
    for (let value of operators) {
        operatorsArr.push([value['0'], value['index']]);
    }
    let result = calc(operatorsArr, numsMap);
    return result
}

function calc(operatorsArr, numsMap) {
    operatorsArr.forEach(operator => {
        let prevIndex = operator[1] - 1;
        while (!numsMap.has(prevIndex)) {
            prevIndex -= 1;
        }
        let nextIndex = operator[1] + 1;

        switch (operator[0]) {

            case '*':
                numsMap.set(prevIndex, numsMap.get(prevIndex) * numsMap.get(nextIndex));
                numsMap.delete(nextIndex);
                break;

            case '/':
                if (numsMap.get(nextIndex) == 0) {
                    throw 'TypeError: Division by zero.';
                }
                numsMap.set(prevIndex, numsMap.get(prevIndex) / numsMap.get(nextIndex));
                numsMap.delete(nextIndex);
                break;
        }
    });
    operatorsArr.forEach(operator => {
        let prevIndex = operator[1] - 1;
        while (!numsMap.has(prevIndex)) {
            prevIndex -= 1;
        }
        let nextIndex = operator[1] + 1;

        switch (operator[0]) {

            case '+':
                numsMap.set(prevIndex, numsMap.get(prevIndex) + numsMap.get(nextIndex));
                numsMap.delete(nextIndex);
                break;
            case '-':
                numsMap.set(prevIndex, numsMap.get(prevIndex) - numsMap.get(nextIndex));
                numsMap.delete(nextIndex);
                break;
        }
    });
    let result = numsMap.get(0);
    return result
}

function check(str) {
    let out = str;
    let bracketsConfig = [
        ['(', ')']
    ];
    for (let i = 0; i <= str.length / 2; i++) {
        bracketsConfig.forEach((item) => {
            out = out.replace(item[0] + item[1], '');

        });
    }
    return !out.length;
}



module.exports = {
    expressionCalculator
}