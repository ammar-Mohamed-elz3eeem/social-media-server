import origins from './allowedOrigins';

const corsOptions = {
    origin: (origin: string | undefined, callback: CallableFunction) => {
        if (origins.indexOf(origin || '') !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

export default corsOptions;
