import { TokenModel } from '../model/token';
import { CountyModel } from '../model/county';

const checkauth = (req, rep, next) => {
    const except = ['/auth', '/doc', '/public'];
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
        //TODO: check expired
        TokenModel.findOne({ 'token': token }).exec().then(res => {
            if (res) {
                req.user = res.user;
                CountyModel.findOne({ 'domain': req.hostname }).then(county => {
                    if (county) {
                        req.county = county
                        if (res.user.permissions.indexOf('ngadimin') < 0 && !res.user.hasCounty(county)) {
                            rep.code(401).send({ error: "You don't have access" })
                        }
                    }
                    next();
                })
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