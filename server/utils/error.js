export const errorHandler = (statusCode, message = "Something went wrong") => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    throw error;
}