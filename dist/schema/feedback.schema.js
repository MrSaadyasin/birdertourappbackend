"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedBackSchema = void 0;
const mongoose = require("mongoose");
exports.feedBackSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String },
    rating: { type: Number },
    type: { type: String, required: true }
}, {
    timestamps: true,
    versionKey: false
});
//# sourceMappingURL=feedback.schema.js.map