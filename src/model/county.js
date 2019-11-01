import mongoose from 'mongoose';
import { pointSchema, polygonSchema } from './geo';

const ObjectId = mongoose.Schema.Types.ObjectId;

const CountySchema = mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    type: { type: String, enum: ['provinsi', 'kabupaten', 'kecamatan', 'desa', 'dusun', 'rw', 'rt'] },
    location: { type: pointSchema, default: null },
    area: { type: polygonSchema, default: null },
    provinsiId: { type: ObjectId, default: null },
    kabupatenId: { type: ObjectId, default: null },
    kecamatanId: { type: ObjectId, default: null },
    desaId: { type: ObjectId, default: null },
    rwId: { type: ObjectId, default: null },
}, { minimize: false, timestamps: true })

const CountyModel = mongoose.model('county', CountySchema, 'county')

export { CountyModel, CountySchema }