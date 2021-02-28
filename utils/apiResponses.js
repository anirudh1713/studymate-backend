const successResponse = (res, msg, data, status) => {
    const resData = {
        status: 1,
        msg,
        data,
    };
    return res.status(status).json(resData);
};

const errorResponse = (res, msg, status) => {
    const resData = {
        status: 0,
        msg,
    };
    return res.status(status).json(resData);
};

module.exports = {
    successResponse,
    errorResponse,
}