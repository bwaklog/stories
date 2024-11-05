import dotenv from 'dotenv';

dotenv.config();

export default {
    app : {
        port: process.env.PORT || 3000,
    },
    mongo : {
        dbName: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        cluster: process.env.CLUSTER_NAME,
        appName: process.env.APP_NAME,
    },
    "jwt" : {
        jwtSecret: process.env.JWT_SECRET,
    }
}