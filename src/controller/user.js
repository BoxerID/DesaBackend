import Crud from './crud'
import { UserModel } from '../model/user'

class UserController extends Crud {
    constructor(fast) {
        super(fast, 'user', UserModel)
    }
}

export default UserController