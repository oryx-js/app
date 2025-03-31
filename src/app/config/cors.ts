// reference : https://expressjs.com/en/resources/middleware/cors.html
const expressCors = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Authorization',
        'Content-Type',
        'X-Requested-With',
        'Accept',
        'Origin',
    ],
    credentials: true,
    exposedHeaders: ['Content-Length', 'X-Custom-Header'],
    maxAge: 3600,
    optionsSuccessStatus: 200,
};

// reference : https://socket.io/docs/v4/handling-cors/
const socketCors = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
        'Authorization',
        'Content-Type',
        'X-Requested-With',
        'Accept',
        'Origin',
    ],
    credentials: true,
};

export { expressCors, socketCors };
