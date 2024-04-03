import * as mongoose from 'mongoose'


export const vendorPaymentSchema = new mongoose.Schema({
  vendor : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  tour : {type: mongoose.Schema.Types.ObjectId, ref: 'Tour'},
  booking : {type: mongoose.Schema.Types.ObjectId, ref: 'Booking'},
  total: { type: Number, required: true },
  payment_status: {type: String, default : "unpaid"},
  stripe_session_id: { type: String },
  
}, {
  timestamps: true,
  versionKey: false
});





