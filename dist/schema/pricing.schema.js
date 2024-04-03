"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pricingSchema = void 0;
const mongoose = require("mongoose");
exports.pricingSchema = new mongoose.Schema({
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
    full_day: String,
    half_day: String,
    hourly_bases: String,
}, {
    timestamps: true,
    versionKey: false
});
//# sourceMappingURL=pricing.schema.js.map