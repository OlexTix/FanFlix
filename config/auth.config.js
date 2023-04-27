module.exports = {
    secret: process.env.API_SECRET || "secret",
    tokenExpiration: parseInt(process.env.TOKEN_EXPIRATION) || 3600,       // 1 hour
};