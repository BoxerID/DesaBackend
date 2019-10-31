import fp from 'fastify-plugin'
import mongoose from 'mongoose'
import migration from './migration'

const db = async (fast, opt, next) => {
    fast.log.info(`connecting to mongo ${process.env.MONGO_URL}`);
    try {
        await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, autoIndex: true });
        mongoose.set('debug', true);
    } catch (err) {
        next(new Error(err))
    }
    fast.log.info('db connection success');
    fast.addHook('onClose', () => {
        fast.log.info('closing database connection')
        mongoose.disconnect();
    })
    await migration(1)
    await next();
}

export default fp(db)