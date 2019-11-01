import { UserModel } from '../model/user'
import Crud from '../common/crud'

class Service extends Crud {
    constructor(fast) {
        super(fast, 'user', UserModel)
    }
}

const fn = async (fastify, opts) => {
    new Service(fastify)
}

export default fn