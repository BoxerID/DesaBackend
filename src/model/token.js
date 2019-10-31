import mongoose from 'mongoose';
import { UserSchema } from './user'

const TokenSchema = mongoose.Schema({
    token: { type: String, required: true, index: true },
    expiredIn: Date,
    user: { type: UserSchema, excludeIndexes: true }
})

const TokenModel = mongoose.model('token', TokenSchema, 'token')

export { TokenSchema, TokenModel }