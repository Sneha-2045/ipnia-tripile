function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error";

  // Never log secrets
  console.error("[error]", {
    status,
    message,
    path: req.originalUrl,
    method: req.method,
  });

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && err.cashfree
      ? { details: err.cashfree }
      : {}),
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
