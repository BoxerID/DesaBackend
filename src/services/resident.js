import Crud from '../common/crud'
import { ReligionModel } from '../model/resident'

class Service extends Crud {
    constructor(fast) {
        super(fast, 'resident', ReligionModel)
    }
}

const fn = async (fastify, opts) => {
    new Service(fastify)
}

export default fn