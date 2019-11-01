import Crud from "../common/crud"
import {
    ReligionModel, FamilyPositionModel, BirthLocationModel, BirthTypeModel,
    BirthHelperModel, EducationModel, JobModel, AkseptorKBModel, BloodTypeModel,
    ChronicPainModel, InsuranceModel, DisablitySchema
} from "../model/resident"

const fn = async (fastify, opts) => {
    new Crud(fastify, 'religion', ReligionModel)
    new Crud(fastify, 'familyposition', FamilyPositionModel)
    new Crud(fastify, 'birthlocation', BirthLocationModel)
    new Crud(fastify, 'birthtype', BirthTypeModel)
    new Crud(fastify, 'birthhelper', BirthHelperModel)
    new Crud(fastify, 'education', EducationModel)
    new Crud(fastify, 'job', JobModel)
    new Crud(fastify, 'akseptorkb', AkseptorKBModel)
    new Crud(fastify, 'bloodtype', BloodTypeModel)
    new Crud(fastify, 'chronicpain', ChronicPainModel)
    new Crud(fastify, 'insurance', InsuranceModel)
    new Crud(fastify, 'disability', DisablitySchema)
}

export default fn;