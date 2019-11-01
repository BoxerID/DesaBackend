import mongoose, { mongo } from 'mongoose';
import { pointSchema } from './geo';

const ObjectId = mongoose.Schema.Types.ObjectId;

const ReligionSchema = mongoose.Schema({
    name: { type: String, required: true },
}, { minimize: false, timestamps: true })

const ParentSchema = mongoose.Schema({
    nik: { type: String, default: '' },
    fullname: { type: String, default: '' },
})

const FamilyPositionSchema = mongoose.Schema({
    name: { type: String, required: true },
}, { minimize: false, timestamps: true })

const BirthLocationSchema = mongoose.Schema({
    name: { type: String, required: true },
}, { minimize: false, timestamps: true })

const BirthTypeSchema = mongoose.Schema({
    name: { type: String, required: true },
}, { minimize: false, timestamps: true })

const BirthHelperSchema = mongoose.Schema({
    name: { type: String, required: true },
}, { minimize: false, timestamps: true })

const BloodTypeSchema = mongoose.Schema({
    name: { type: String, required: true },
}, { minimize: false, timestamps: true })

const ChronicPainSchema = mongoose.Schema({
    name: { type: String, required: true },
}, { minimize: false, timestamps: true })

const AksptorKBScheme = mongoose.Schema({
    name: { type: String, required: true },
}, { minimize: false, timestamps: true })

const InsuranceScheme = mongoose.Schema({
    name: { type: String, required: true },
}, { minimize: false, timestamps: true })

const ResidentSchema = mongoose.Schema({
    nik: { type: String, required: true },
    image: { type: String, default: '' },
    fullname: { type: String, required: true },
    ktpEl: { type: String, enum: ['no', 'yes'], default: null },
    ktpRecordStatus: {
        type: String, enum: ['not_required', 'not_recorded', 'recorded', 'card_printed',
            'print_ready_record', 'card_shippped', 'sent_for_card_printing', 'card_issued'],
        default: null,
    },
    ktpTag: { type: String, default: '' },
    gender: { type: String, enum: ['man', 'woman'], required: true },
    oldKKNumber: { type: String, default: '' },
    familyPosition: { type: FamilyPositionSchema, default: null },

    religion: { type: ReligionSchema, required: true },
    residentStatus: { type: String, enum: ['tetap', 'tidak_tetap', 'pendatang'], default: null },

    birthCertificateNumber: { type: String, default: '' },
    birthPlace: { type: String, default: '' },
    birthDate: { type: Date, default: null },
    birthLocation: { type: BirthLocationSchema, default: null },
    birthType: { type: BirthTypeSchema, default: null },
    birthOrder: { type: Number, default: null },
    birthHelper: { type: BirthHelperSchema, default: null },
    birthWeight: { type: Number, default: null },
    birthLength: { type: Number, default: null },

    citizen: { type: String, enum: ['wni', 'wna', 'double'], default: null },
    pasporNumber: { type: String, default: '' },
    pasporExpired: { type: Date, default: null },
    kitasNumber: { type: String, default: '' },

    father: { type: ParentSchema, default: null },
    mother: { type: ParentSchema, default: null },

    location: { type: pointSchema, default: null },
    phone: { type: String, default: '' },
    addressCurrent: { type: String, default: '' },
    addressLast: { type: String, default: '' },

    maritalStatus: { type: String, enum: ['not_married', 'maried', 'cerai_hidup', 'cerai_mati'], default: null },
    maritalNumber: { type: String, default: '' },
    maritalDate: { type: Date, default: null },
    divorceNumber: { type: String, default: '' },
    divorceDate: { type: Date, default: null },

    bloodType: { type: BloodTypeSchema, default: null },
    disablity: { type: BloodTypeSchema, default: null },
    chronicPain: { type: ChronicPainSchema, default: null },
    akseptorKB: { type: AksptorKBScheme, default: null },
    insurance: { type: InsuranceScheme, default: null },
    insuranceNumber: { type: String, default: null },

    provinsiId: { type: ObjectId, default: null },
    kabupatenId: { type: ObjectId, default: null },
    kecamatanId: { type: ObjectId, default: null },
    desaId: { type: ObjectId, default: null },
    rwId: { type: ObjectId, default: null },
    rtId: { type: ObjectId, default: null },
}, { minimize: false, timestamps: true })

const ResidentModel = mongoose.model('resident', ResidentSchema, 'resident')
const ReligionModel = mongoose.model('religion', ReligionSchema, 'religion')
const FamilyPositionModel = mongoose.model('familyposition', FamilyPositionSchema, 'familyposition')
const BirthLocationModel = mongoose.model('birthlocation', BirthLocationSchema, 'birthlocation')
const BirthTypeModel = mongoose.model('birthtype', BirthTypeSchema, 'birthtype')
const BirthHelperModel = mongoose.model('birthhelper', BirthHelperSchema, 'birthhelper')
const AkseptorKBModel = mongoose.model('akseptorkp', AksptorKBScheme, 'akseptorkp')
const InsuranceModel = mongoose.model('insurance', InsuranceScheme, 'insurance')

export {
    ResidentModel, ResidentSchema,
    ReligionModel, ReligionSchema,
    BirthLocationModel, BirthLocationSchema,
    BirthTypeModel, BirthTypeSchema,
    BirthHelperModel, BirthHelperSchema,
    ChronicPainModel, ChronicPainSchema,
    AkseptorKBModel, AksptorKBScheme,
    InsuranceModel, InsuranceScheme,
    FamilyPositionModel, FamilyPositionSchema,
}