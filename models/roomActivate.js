module.exports = function active(isActive) {
    if (isActive === true) {
        return isActive === false;
    } else {
        return isActive === true;
    }
}