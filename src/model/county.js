import mongoose from 'mongoose';
import { pointSchema, polygonSchema } from './geo';

const ObjectId = mongoose.Schema.Types.ObjectId;

const CountySchema = mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    type: { type: String, enum: ['provinsi', 'kabupaten', 'kecamatan', 'desa', 'dusun', 'rw', 'rt'] },
    domain: { type: [String], default: [], index: true },
    location: { type: pointSchema, default: null },
    area: { type: polygonSchema, default: null },
    provinsiId: { type: ObjectId, default: null, ref: 'county', index: true },
    kabupatenId: { type: ObjectId, default: null, ref: 'county', index: true },
    kecamatanId: { type: ObjectId, default: null, ref: 'county', index: true },
    desaId: { type: ObjectId, default: null, ref: 'county', index: true },
    rwId: { type: ObjectId, default: null, ref: 'county' },
}, { minimize: false, timestamps: true })

CountySchema.methods.getMainFilter = function () {
    if (this.type === 'provinsi') return { 'provinsiId': this.id }
    if (this.type === 'kabupaten') return { 'kabupatenId': this.id }
    if (this.type === 'kecamatan') return { 'kecamatanId': this.id }
    if (this.type === 'desa') return { 'desaId': this.id }
}

const CountyModel = mongoose.model('county', CountySchema, 'county')

export { CountyModel, CountySchema }