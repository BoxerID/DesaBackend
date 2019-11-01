import { UserModel } from "../model/user";
import { TokenModel } from '../model/token';
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
                    ret.token = randomToken(32);
                    ret.expiredIn = 900;
                    ret.user = res
                    await TokenModel.create(ret)
                    rep.send(ret);
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