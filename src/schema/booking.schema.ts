import * as mongoose from 'mongoose'


export const bookingSchema = new mongoose.Schema({
  user : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  vendor : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  tour : {type: mongoose.Schema.Types.ObjectId, ref: 'Tour'},
  extra_person: { type: Number, defalut : "" },
  // booking_type: { type: String, required : true, enum:['full_day', 'half_day', 'hourly_bases'] },
  booking_type: { type: String, required : true, enum:['full_day', 'half_day','multi_day'] },
  total: { type: Number, required: true },
  date: { type: Date, default : "" },
  dates: [{ type: Date, default: [] }],
  start_time: { type: String, required: true },  
  end_time: { type: String, required: true },  
  booked_slot: { type: String, required: true },  
  is_reminder: { type: Boolean, default : false },  
  payment_status: {type: String, default:"unpaid"},
  booking_request_status: {type: String, default:"pending",enum:['pending', 'approved', 'rejected']},
  booking_request_reason : {type : String, default : ""},
  request_status: {type: String, default:"unpaid",enum:['unpaid', 'paid', 'pending','cancel']},
  feedback_status: {type: String, default:"pending" ,enum:['inProgress', 'pending', 'cancel', 'success'] }
  
}, { 
  timestamps: true,
  versionKey: false
});





