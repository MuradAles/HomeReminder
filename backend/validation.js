const validatePassword = (password) => {
    const capitalLetterRegex = /[A-Z]/;
    const symbolRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    const numberRegex = /[0-9]/;
    if (password.length < 6) {
        throw "Password should contain at least 6 characters long";
    }
    if (!capitalLetterRegex.test(password)) {
        throw "Password should contain at least 1 capital letter";
    }
    if (!symbolRegex.test(password)) {
        throw "Password should contain at least 1 symbol";
    }
    if (!numberRegex.test(password)) {
        throw "Password should contain at least 1 number";
    }
    return password;
}

const validateEmail = (email) => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return email
    }
    throw "Email is wrong"
}

const checkPageValidation = (page) => {
    if (isNaN(page)) { page = 1 }
    if (!Number.isInteger(page)) { page = 1 }
    if (page <= 0) { page = 1 }
    if (page % 1 != 0) { page = 1 }
    return page
}

module.exports = { validatePassword, validateEmail, checkPageValidation }