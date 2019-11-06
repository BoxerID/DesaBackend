import mongoose from 'mongoose';
import { CountyModel } from './county';
//import mongoose_delete from 'mongoose-delete'

const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = mongoose.Schema({
    username: { type: String, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    ableLogin: { type: Boolean, default: false },
    permissions: { type: [String], default: [] },
    countyType: { type: String, enum: ['provinsi', 'kabupaten', 'kecamatan', 'desa', 'dusun', 'rw', 'rt'] },
    provinsiId: { type: ObjectId, default: null, ref: 'county' },
    kabupatenId: { type: ObjectId, default: null, ref: 'county' },
    kecamatanId: { type: ObjectId, default: null, ref: 'county' },
    desaId: { type: ObjectId, default: null, ref: 'county' },
}, { minimize: false, timestamps: true })

//UserSchema.plugin(mongoose_delete, { deletedAt: true, indexFields: ['deleted'] })

UserSchema.methods.hasCounty = async function (county) {
    if (this.countyType === 'dusun' || this.countyType === 'rw' || this.countyType === 'rt') return false;
    if (this.countyType === 'desa' && county.type === 'desa') {
        return county.id.equals(this.desaId)
    } else if (this.countyType === 'kabupaten') {
        if (county.type === 'kabupaten') {
            return county.id.equals(this.kabupatenId)
        } else if (county.type === 'desa') {
            const c = CountyModel.findOne({ kabupatenId: this.kabupatenId, desaId: county.id })
            return c !== null;
        }
    } else if (this.countyType === 'provinsi') {
        if (county.type === 'provinsi') {
            return county.id.equals(this.provinsiId)
        } else if (county.type === 'kabupaten') {
            const c = CountyModel.findOne({ provinsiId: this.provinsiId, kabupatenId: county.id })
            return c !== null;
        } else if (county.type === 'desa') {
            const c = CountyModel.findOne({ provinsiId: this.provinsiId, desaId: county.id })
            return c !== null;
        }
    }
    return false
}

const UserModel = mongoose.model('user', UserSchema, 'user')

export { UserModel, UserSchema }