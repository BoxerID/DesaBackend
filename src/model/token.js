import mongoose from 'mongoose';
import { UserSchema } from './user'
import { CountySchema } from './county';

const TokenSchema = mongoose.Schema({
    token: { type: String, required: true, index: true },
    expiredIn: Date,
    user: { type: UserSchema, excludeIndexes: true },
    county: { type: CountySchema, excludeIndexes: true },
})

const TokenModel = mongoose.model('token', TokenSchema, 'token')

export { TokenSchema, TokenModel }