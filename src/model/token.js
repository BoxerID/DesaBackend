import mongoose from 'mongoose';
import { UserSchema } from './user'

const TokenSchema = mongoose.Schema({
    token: { type: String, required: true, index: true },
    expiredIn: Number,
    user: { type: UserSchema, excludeIndexes: true }
})

const TokenModel = mongoose.model('token', TokenSchema, 'token')

export { TokenSchema, TokenModel }