import mongoose from 'mongoose';
import { ResidentSchema } from './resident';

const ObjectId = mongoose.Schema.Types.ObjectId;

const FamilyCardSchema = mongoose.Schema({
    number: { type: String, unique: true },
    count: { type: Number, default: 1 },
    lead: { type: ResidentSchema, required: true },
    registeredDate: { type: Date, default: null },
    printDate: { type: Date, default: null },

    provinsiId: { type: ObjectId, default: null, ref: 'county' },
    kabupatenId: { type: ObjectId, default: null, ref: 'county' },
    kecamatanId: { type: ObjectId, default: null, ref: 'county' },
    desaId: { type: ObjectId, default: null, ref: 'county' },
    rwId: { type: ObjectId, default: null, ref: 'county' },
    rtId: { type: ObjectId, default: null, ref: 'county' },
}, { minimize: false, timestamps: true })

const FamilyCardModel = mongoose.model('familycard', FamilyCardSchema, 'familycard')

export { FamilyCardModel, FamilyCardSchema }