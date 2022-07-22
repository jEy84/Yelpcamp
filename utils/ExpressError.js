// extends defualt express error
class ExpressError extends Error{
    constructor(message, statusCode){
        super(); //calling default no-arg const
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;