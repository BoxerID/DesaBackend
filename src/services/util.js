import * as Minio from 'minio'
import uuid from 'uuid/v4'
import { CountyModel } from '../model/county';

const fn = async (fastify, opts) => {
    fastify.post("/upload", async (req, rep) => {
        const client = new Minio.Client({
            endPoint: process.env.S3_ENDPOINT,
            accessKey: process.env.S3_ACCESS_KEY, secretKey: process.env.S3_SECRET_KEY,
        })
        const fileName = uuid();
        await client.putObject('desa', fileName, req.body.file.data, { 'Content-Type': req.body.file.mimetype })
        rep.send({ filename: fileName, url: `https://${process.env.S3_ENDPOINT}/desa/${fileName}` })
    });
    fastify.post('/exists', async (req, rep) => {
        const county = await CountyModel.findOne({ 'domain': req.body.domain }).exec();
        if (county === null) rep.code(404).send({ error: 'not found' })
        else rep.send(({ error: null }))
    });
}

export default fn;