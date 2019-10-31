import mongoose from 'mongoose';
//import mongoose_delete from 'mongoose-delete'

const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = mongoose.Schema({
    username: { type: String, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    ableLogin: { type: Boolean, default: false },
    permissions: { type: [String], default: [] },
    provinsiId: { type: ObjectId, default: null },
    kabupatenId: { type: ObjectId, default: null },
    kecamatanId: { type: ObjectId, default: null },
    desaId: { type: ObjectId, default: null }
}, { minimize: false, timestamps: true })

//UserSchema.plugin(mongoose_delete, { deletedAt: true, indexFields: ['deleted'] })

/*UserSchema.methods.testFunction = function () {
    console.log("##########");
}*/

const UserModel = mongoose.model('user', UserSchema, 'user')

export { UserModel, UserSchema }