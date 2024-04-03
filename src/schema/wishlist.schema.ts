import * as mongoose from 'mongoose'


export const wishlistSchema = new mongoose.Schema({
  user : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  tour : {type: mongoose.Schema.Types.ObjectId, ref: 'Tour'},
}, {
  timestamps: true,
  versionKey: false
});