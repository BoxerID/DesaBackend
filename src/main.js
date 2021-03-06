import denv from 'dotenv';
import fastify from 'fastify';
import router from './router';
import db from './db';
import swagger from 'fastify-swagger';
import compress from 'fastify-compress';
import multipart from 'fastify-multipart';
import staticserve from 'fastify-static';
import cors from 'fastify-cors';
import { PublicPath } from './pathutil';
import path from 'path'

if (process.env.NODE_ENV === 'dev')
    denv.config({ path: path.join(__dirname, '../.env') });
else
    denv.config({ path: path.join(__dirname, '.env') });

console.log(process.env.NODE_ENV)
console.log(path.join(__dirname, '../.env'))
const f = fastify({ logger: true })

f.register(swagger, {
    routePrefix: '/doc',
    mode: 'static',
    specification: {
        path: './swagger/api.yaml',
    },
    exposeRoute: true
})

f.register(compress)
f.register(multipart, { addToBody: true, limits: { fieldSize: 10000000 } })
f.register(staticserve, {
    root: PublicPath,
    prefix: '/public/',
    //wildcard: true,
})
f.register(cors)
f.register(db)
f.register(router)

const start = async () => {
    try {
        await f.listen(process.env.PORT || 6001, '0.0.0.0');
        f.log.info(`Server is listening at ${f.server.address().port}`);
    } catch (err) {
        f.log.error(err);
        process.exit(1);
    }
}

process.on('SIGINT', () => {
    console.log('Shuttingdown server')
    f.close(() => console.log('Shuttingdown server success'));
})

process.on('SIGTERM', () => {
    console.log('Shuttingdown server')
    f.close(() => console.log('Shuttingdown server success'));
})

start();