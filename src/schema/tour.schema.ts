import * as mongoose from 'mongoose'


export const tourSchema = new mongoose.Schema({
  vendor : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  name: { type: String, required: true },
  video: { type: String, default: "" },
  // images: [{ type: String, default: [] }],
  caption_images: [{ type: Object, default: [] }],
  description: { type: String, required: true },
  location: { type: String, required: true },
  message : {type: String, default: ""},
  status: {type: String, default:"pending", enum:['pending', 'approved', 'rejected','edited']}
  
  
}, {
  timestamps: true,
  versionKey: false
});





