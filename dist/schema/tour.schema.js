"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tourSchema = void 0;
const mongoose = require("mongoose");
exports.tourSchema = new mongoose.Schema({
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    video: { type: String, default: "" },
    caption_images: [{ type: Object, default: [] }],
    description: { type: String, required: true },
    location: { type: String, required: true },
    message: { type: String, default: "" },
    status: { type: String, default: "pending", enum: ['pending', 'approved', 'rejected', 'edited'] }
}, {
    timestamps: true,
    versionKey: false
});
//# sourceMappingURL=tour.schema.js.map