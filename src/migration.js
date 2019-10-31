import mongoose from 'mongoose'
import { CountyModel } from './model/county'
import { UserModel } from './model/user'
import md5 from 'md5';

const doMigration = async (current) => {
    let mig = await mongoose.connection.db.collection('config').findOne({ '_id': 'MIGRATION' })
    if (mig == null) {
        mig = { version: 0 }
        await mongoose.connection.db.collection('config').insertOne({ '_id': 'MIGRATION', 'version': 0 })
    }
    for (let i = mig.version + 1; i <= current; i++) {
        await singleMigration(i)
    }
    await mongoose.connection.db.collection('config').updateOne({ '_id': 'MIGRATION' }, { '$set': { version: current } })
}

const singleMigration = async (version) => {
    if (version === 1) {
        const provinsi = await CountyModel.create({ name: 'Jawa Timur', code: 'Jatim', type: 'provinsi' })
        const kabupaten = await CountyModel.create({ name: 'Bojonegoro', code: 'BJN', type: 'kabupaten', provinsiId: provinsi.id })
        const kecamatan = await CountyModel.create({ name: 'Purwosari', code: 'KECPUR', type: 'kecamatan', provinsiId: provinsi.id, kabupatenId: kabupaten.id })
        const desa = await CountyModel.create({ name: 'Purwosari', code: 'DESAPUR', type: 'desa', provinsiId: provinsi.id, kabupatenId: kabupaten.id, kecamatanId: kecamatan })
        const user = await UserModel.create({ username: 'admin', password: md5('mypass123'), name: 'Administrator' })
    }
}

export default doMigration;