import mongoose from 'mongoose';
//import mongoose_delete from 'mongoose-delete'

const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = mongoose.Schema({
    username: { type: String, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: String,
    address: String,
    phone: String,
    ableLogin: Boolean,
    permissions: [String],
}, { minimize: false, timestamps: true })

//UserSchema.plugin(mongoose_delete, { deletedAt: true, indexFields: ['deleted'] })

/*UserSchema.methods.testFunction = function () {
    console.log("##########");
}*/

const UserModel = mongoose.model('user', UserSchema, 'user')

export { UserModel, UserSchema }