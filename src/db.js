import fp from 'fastify-plugin';
import mongoose from 'mongoose';
import { TokenModel } from './model/token';
import { UserModel } from './model/user';
import md5 from 'md5';

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
    //migration
    let migration = await mongoose.connection.db.collection('migration').findOne({ '_id': 'MIGRATION' })
    if (migration == null)
        console.log('ASD');
    //await TokenModel.createIndexes()
    await next();
}

export default fp(db)