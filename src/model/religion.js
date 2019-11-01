import mongoose from 'mongoose';

const ReligionSchema = mongoose.Schema({
    name: { type: String, required: true },
}, { minimize: false, timestamps: true })

const ReligionModel = mongoose.model('religion', ReligionSchema, 'religion')

export { ReligionModel, ReligionSchema }