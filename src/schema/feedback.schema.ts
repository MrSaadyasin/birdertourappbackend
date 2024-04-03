import * as mongoose from 'mongoose'


export const feedBackSchema = new mongoose.Schema({
  user : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  tour : {type: mongoose.Schema.Types.ObjectId, ref: 'Tour'},
  vendor : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  comment: { type: String },
  rating: { type: Number },
  type : {type : String, required: true}
 
}, {
  timestamps: true,
  versionKey: false
});