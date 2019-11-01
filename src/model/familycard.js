import mongoose from 'mongoose';
import { ResidentSchema } from './resident';

const ObjectId = mongoose.Schema.Types.ObjectId;

const FamilyCardSchema = mongoose.Schema({
    number: { type: String, unique: true },
    count: { type: Number, default: 1 },
    lead: { type: ResidentSchema, required: true },
    registeredDate: { type: Date, default: null },
    printDate: { type: Date, default: null },

    provinsiId: { type: ObjectId, default: null },
    kabupatenId: { type: ObjectId, default: null },
    kecamatanId: { type: ObjectId, default: null },
    desaId: { type: ObjectId, default: null },
    rwId: { type: ObjectId, default: null },
    rtId: { type: ObjectId, default: null },
}, { minimize: false, timestamps: true })

const FamilyCardModel = mongoose.model('familycard', FamilyCardSchema, 'familycard')

export { FamilyCardModel, FamilyCardSchema }