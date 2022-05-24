/*
Student ID | Name
-----------------------
1155127438 | HONG Kai Yin 
1155141990 | NG Wing Ki Vickie
1155142639 | LAM Yan Yu
1155127411 | WONG Sai Ho
1155127379 | Tang Siu Cheong
1155133623 | Ho Lee Lee
*/

class HttpError extends Error {
    constructor(statusCode=500, message=""){
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.status = statusCode;
    }

    statusCode() {
        return this.status;
    }

    errorMessage(){
        return this.name + ": " + this.message;
    }
}

class HttpInvalidArgumentError extends HttpError {
    constructor(message="Invalid Arguments!"){
        super(400, message);
    }
}

class HttpNotLoggedInError extends HttpError {
    constructor(message="Not Logged In!"){
        super(401, message);
    }
}

class HttpForbiddenError extends HttpError {
    constructor(message="Forbidden!"){
        super(403, message);
    }
}

class HttpNotFoundError extends HttpError {
    constructor(message="Not Found!"){
        super(404, message);
    }
}

class HttpAlreadyExistedError extends HttpError {
    constructor(message="Already Existed!"){
        super(409, message);
    }
}

class HttpInternalServerError extends HttpError {
    constructor(message="Internal Server Error!"){
        super(500, message);
    }
}

module.exports = { HttpError, HttpInvalidArgumentError, HttpNotLoggedInError, HttpForbiddenError, HttpNotFoundError, HttpAlreadyExistedError, HttpInternalServerError };