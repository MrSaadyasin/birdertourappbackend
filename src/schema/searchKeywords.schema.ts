import * as mongoose from 'mongoose'


export const searchKeywordSchema = new mongoose.Schema({
    keyword: { type: String, required: true },
    country_location: { type: String, required: true },

}, {
    timestamps: true,
    versionKey: false
});





