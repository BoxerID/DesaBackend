import fp from 'fastify-plugin'
import mongoose from 'mongoose'
import migration from './migration'

const db = async (fast, opt, next) => {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/desa'
    fast.log.info(`connecting to mongo ${mongoUrl}`);
    try {
        await mongoose.connect(mongoUrl, { useNewUrlParser: true, autoIndex: true });
        mongoose.set('debug', true);
    } catch (err) {
        next(new Error(err))
    }
    fast.log.info('db connection success');
    fast.addHook('onClose', () => {
        fast.log.info('closing database connection')
        mongoose.disconnect();
    })
    await migration(2)
    await next();
}

export default fp(db)