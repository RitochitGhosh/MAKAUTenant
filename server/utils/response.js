export const responseHandler = (res, statusCode = 200, data = {}, message = 'Success') => {
  return res.status(statusCode).json({
    status: 'success',
    statusCode,
    message,
    data,
  });
};
