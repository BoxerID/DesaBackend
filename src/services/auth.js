import { UserModel } from "../model/user";
import { TokenModel } from '../model/token';
import { CountyModel } from "../model/county"
import md5 from 'md5';
import randomToken from 'random-token';

const fn = async (fastify, opts) => {
    fastify.post("/auth", async (req, rep) => {
        const u = req.body;
        if (u.username == '' || u.password == '') {
            rep.code(400).send({ error: 'Username password required' });
        } else {
            const res = await UserModel.findOne({ 'username': u.username }).exec();
            const ret = {};
            if (res) {
                if (res.password === md5(u.password)) {
                    const county = await CountyModel.findOne({ 'domain': req.hostname.split(':')[0].split('.')[0] });
                    if (county === null) {
                        rep.code(400).send({ error: 'Desa domain not found' })
                    } else if (res.permissions.indexOf('ngadimin') < 0 && !res.hasCounty(county)) {
                        rep.code(400).send({ error: 'User has no access to Desa' })
                    } else {
                        ret.token = randomToken(32);
                        ret.expiredIn = 900;
                        ret.user = res
                        ret.county = county
                        await TokenModel.create(ret)
                        rep.send(ret);
                    }
                    /*.then(county => {
                        if (county) {
                            req.county = county
                            if (res.user.permissions.indexOf('ngadimin') < 0 && !res.user.hasCounty(county)) {
                                rep.code(401).send({ error: "You don't have access" })
                            }
                        }
                        next();
                    })*/
                } else {
                    rep.code(400).send({ error: 'Username password tidak sesuai' });
                }
            } else {
                rep.code(400).send({ error: 'Username password tidak sesuai' });
            }
        }
    });
    fastify.get("/info", (req, rep) => {
        UserModel.findById(req.user.id).then(v => {
            rep.send({ data: v })
        })
    });
}

export default fn;