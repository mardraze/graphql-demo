var jwt = require('jsonwebtoken');
require('dotenv').config();

var userControl = require('./user-control');

var jwtPassword = process.env.JWT_PASSWORD;
var UID_EXPIRE_DAYS = process.env.COOKIE_UID_EXPIRE_DAYS || 30;

class session {
    constructor() {
        this.currentUser = null;
    }
    getUidToken() {
        let uid = this.currentUser;
        if (uid) {
            return jwt.sign({ uid: uid }, jwtPassword);
        }
    }
    login(email, password) {
        let foundUser = userControl.login(email, password);
        if (foundUser) {
            this.currentUser = foundUser.id;
            return this.currentUser;
        }
    }
    loginToken(token) {
        try {
            var decoded = jwt.verify(token, jwtPassword);
            if (decoded && decoded.uid && decoded.iat) {
                let d = new Date();
                if ((decoded.iat + (UID_EXPIRE_DAYS * 24 * 3600)) * 1000 > d.getTime()) {
                    let foundUser = userControl.find(decoded.uid);
                    if (foundUser) {
                        this.currentUser = foundUser.id;
                        return true;
                    }
                }
            }
        } catch (err) {
            console.log('ERROR', err);
        }
        return false;
    }
    getUid() {
        return this.currentUser;
    }
    getCookieExpireDays() {
        return UID_EXPIRE_DAYS;
    }
}

module.exports = session
