import Crud from '../common/crud'
import { ResidentModel } from '../model/resident'

class Service extends Crud {
    constructor(fast) {
        super(fast, 'resident', ResidentModel)
    }
}

const fn = async (fastify, opts) => {
    new Service(fastify)
}

export default fn