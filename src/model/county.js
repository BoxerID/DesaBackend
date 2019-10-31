import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const CountySchema = mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    type: { type: String, enum: ['provinsi', 'kabupaten', 'kecamatan', 'desa'] },
    //location: { type: { type: String, enum: ['Point'] }, coordinates: { type: [Number], required: true } },
    provinsiId: ObjectId,
    kabupatenId: ObjectId,
    kecamatanId: ObjectId,
}, { minimize: false, timestamps: true })

const CountyModel = mongoose.model('county', CountySchema, 'county')

export { CountyModel, CountySchema }