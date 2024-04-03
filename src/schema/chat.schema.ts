import * as mongoose from 'mongoose'


export const chatSchema = new mongoose.Schema({
  user : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  vendor : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  message: { type: String, required: true },
  channel_name: { type: String, required: true },
  type: { type: String, required: true },
  is_read: { type: Boolean, default: false },
  sender : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  receiver : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
 
}, {
  timestamps: true,
  versionKey: false
});