import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const CountySchema = mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    type: { type: String, enum: ['provinsi', 'kabupaten', 'kecamatan', 'desa'] },
    location: { type: { type: String, enum: ['Point'] }, coordinates: { type: [Number], required: true } },
    provinsi: ObjectId,
    kabupaten: ObjectId,
    kecamatan: ObjectId,
}, { minimize: false, timestamps: true })

const CountyModel = mongoose.model('county', UserSchema, 'county')

export { CountyModel, CountySchema }