import fp from 'fastify-plugin';
import authController from './controller/auth';
import UserController from './controller/user';
import checkauth from './util/checktoken';

const router = async (fast, opt, next) => {
    fast.addHook('onRequest', checkauth);
    authController(fast)
    new UserController(fast)
    next()
}

export default fp(router);