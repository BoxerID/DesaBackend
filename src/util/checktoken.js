import { TokenModel } from '../model/token';

const checkauth = (req, rep, next) => {
    const except = ['/auth', '/api', '/public'];
    for (let i = 0; i < except.length; i++) {
        if (req.raw.url.startsWith(except[i])) {
            next();
            return;
        }
    }
    let token = null;
    if (req.headers['x-api-key']) {
        token = req.headers['x-api-key']
    } else if (req.query.token) {
        token = req.query.token;
    }
    if (token !== null) {
        TokenModel.findOne({ 'token': token }).exec().then((res) => {
            if (res) {
                req.tokenType = 'user'
                req.user = res.user;
                next();
            } else {
                rep.code(401).send({ error: 'Token not valid' })
                next(new Error())
            }
        });
    } else {
        rep.code(401).send({ error: 'Require auth' })
        next(new Error());
    }
}

export default checkauth;