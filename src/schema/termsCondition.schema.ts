import * as mongoose from 'mongoose'


export const TermsConditionSchema = new mongoose.Schema({
    terms_condition: { type: String, required: true },

}, {
    timestamps: true,
    versionKey: false
});





