import * as mongoose from 'mongoose'


export const paymentSchema = new mongoose.Schema({
  booking : {type: mongoose.Schema.Types.ObjectId, ref: 'Booking'},
  stripe_session_id: { type: String, required: true },
 
}, {
  timestamps: true,
  versionKey: false
});