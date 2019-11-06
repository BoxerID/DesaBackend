import * as Minio from 'minio'
import uuid from 'uuid/v4'

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
}

export default fn;