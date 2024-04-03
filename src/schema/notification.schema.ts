import * as mongoose from 'mongoose'


export const notificationSchema = new mongoose.Schema({
  user : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  vendor : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  title: { type: String, required: true },
  message: { type: String, required: true },
  channel_name: { type: String, required: true },
 
}, {
  timestamps: true,
  versionKey: false
});