import Crud from "../common/crud"
import {
    ReligionModel, FamilyPositionModel, BirthLocationModel, BirthTypeModel,
    BirthHelperModel, EducationModel, JobModel, AkseptorKBModel, BloodTypeModel,
    ChronicPainModel, InsuranceModel, DisabilityModel
} from "../model/resident"
import { ADMINISTRATOR } from "../common/permission"

const fn = async (fastify, opts) => {
    new Crud(fastify, 'religion', ReligionModel, { INSERT: { permissions: [ADMINISTRATOR] }, UPDATE: { permissions: [ADMINISTRATOR] }, DELETE: { permissions: [ADMINISTRATOR] }, })
    new Crud(fastify, 'familyposition', FamilyPositionModel, { INSERT: { permissions: [ADMINISTRATOR] }, UPDATE: { permissions: [ADMINISTRATOR] }, DELETE: { permissions: [ADMINISTRATOR] } })
    new Crud(fastify, 'birthlocation', BirthLocationModel, { INSERT: { permissions: [ADMINISTRATOR] }, UPDATE: { permissions: [ADMINISTRATOR] }, DELETE: { permissions: [ADMINISTRATOR] } })
    new Crud(fastify, 'birthtype', BirthTypeModel, { INSERT: { permissions: [ADMINISTRATOR] }, UPDATE: { permissions: [ADMINISTRATOR] }, DELETE: { permissions: [ADMINISTRATOR] } })
    new Crud(fastify, 'birthhelper', BirthHelperModel, { INSERT: { permissions: [ADMINISTRATOR] }, UPDATE: { permissions: [ADMINISTRATOR] }, DELETE: { permissions: [ADMINISTRATOR] } })
    new Crud(fastify, 'education', EducationModel, { INSERT: { permissions: [ADMINISTRATOR] }, UPDATE: { permissions: [ADMINISTRATOR] }, DELETE: { permissions: [ADMINISTRATOR] } })
    new Crud(fastify, 'job', JobModel, { INSERT: { permissions: [ADMINISTRATOR] }, UPDATE: { permissions: [ADMINISTRATOR] }, DELETE: { permissions: [ADMINISTRATOR] } })
    new Crud(fastify, 'akseptorkb', AkseptorKBModel, { INSERT: { permissions: [ADMINISTRATOR] }, UPDATE: { permissions: [ADMINISTRATOR] }, DELETE: { permissions: [ADMINISTRATOR] } })
    new Crud(fastify, 'bloodtype', BloodTypeModel, { INSERT: { permissions: [ADMINISTRATOR] }, UPDATE: { permissions: [ADMINISTRATOR] }, DELETE: { permissions: [ADMINISTRATOR] } })
    new Crud(fastify, 'chronicpain', ChronicPainModel, { INSERT: { permissions: [ADMINISTRATOR] }, UPDATE: { permissions: [ADMINISTRATOR] }, DELETE: { permissions: [ADMINISTRATOR] } })
    new Crud(fastify, 'insurance', InsuranceModel, { INSERT: { permissions: [ADMINISTRATOR] }, UPDATE: { permissions: [ADMINISTRATOR] }, DELETE: { permissions: [ADMINISTRATOR] } })
    new Crud(fastify, 'disability', DisabilityModel, { INSERT: { permissions: [ADMINISTRATOR] }, UPDATE: { permissions: [ADMINISTRATOR] }, DELETE: { permissions: [ADMINISTRATOR] } })
}

export default fn;