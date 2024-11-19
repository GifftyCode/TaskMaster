

// // error handler middleware
// const errorHandler = (err, req, res, next) => {
//   // check if response headers have already been sent to the client
//   if (res.headersSent) {
//     // if true, pass the error to the next error-handling middleware
//     return next(err);
//   }

  

//   // set the status code of the response
//   const statusCode =
//     res.statusCode && res.statusCode >= 400 ? res.statusCode : 500;
//   res.status(statusCode); // set the status code of the response

//   // log error stack trace to the console if not in production --> for debugging
//   if (process.env.NODE_ENV !== "production") {
//     console.log(err);
//   }

//   res.json({
//     message: err.message,
//     stack: process.env.NODE_ENV === "production" ? null : err.stack,
//   });
// };

// export default errorHandler;



const errorHandler = (err, req, res, next) => {
  // Get origin from request headers
  const origin = req.headers.origin;
  
  // Set CORS headers if origin exists
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  // Handle CORS errors specifically
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS Error: This origin is not allowed to access the resource'
    });
  }

  // Default error status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Error response
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

export default errorHandler;