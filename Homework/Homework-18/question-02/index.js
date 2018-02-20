
function checkString (str) {
    var strArr = str.split(' ');
    console.log(strArr);
    if (strArr.length > 1 || str == '') {
        throw new Error ('String contains multiple words or is empty');
    } else {
        return 1;
    }

}

// this passes
try {
    var result = checkString('people');
    console.log(result);
} catch (error) {
    console.log(error);
}

// this fails
try {
    var result = checkString('amazing animals');
    console.log(result);
} catch (error) {
    console.log(error);
}

// this also fails
try {
    var result = checkString('');
    console.log(result);
} catch (error) {
    console.log(error);
}
