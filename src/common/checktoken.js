import { TokenModel } from '../model/token';
import { CountyModel } from '../model/county';

const checkauth = (req, rep, next) => {
    const except = ['/auth', '/doc', '/public', '/exists'];
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
                req.user = res.user
                req.county = res.county
                CountyModel.findOne({ 'domain': req.hostname }).then(async (county) => {
                    if (county) {
                        req.county = county
                        const hasCounty = await res.user.hasCounty(county)
                        if (res.user.permissions.indexOf('ngadimin') < 0 && !hasCounty) {
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