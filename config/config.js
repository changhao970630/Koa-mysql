module.exports = {
    datebase: {
        DATABASE: "CH",
        USERNAME: "root",
        PASSWORD: "12345678",
        host: "localhost",
        dialect: "mysql",
        port: 3306
    },
    jwt: {
        secretKey:"chang_chang~!@#$%chang_chang",
        expiresIn: 60 * 60 * 24//token有效时间
    }
};
