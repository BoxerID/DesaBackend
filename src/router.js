import fp from 'fastify-plugin';
import checkauth from './common/checktoken';
import autoLoad from 'fastify-autoload';
import path from 'path'

const router = async (fast, opt, next) => {
    fast.addHook('onRequest', checkauth);
    fast.register(autoLoad, {
        dir: path.join(__dirname, 'services'),
        options: { ...opt }
    })
    next()
}

export default fp(router);