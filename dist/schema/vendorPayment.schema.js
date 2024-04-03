"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorPaymentSchema = void 0;
const mongoose = require("mongoose");
exports.vendorPaymentSchema = new mongoose.Schema({
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    total: { type: Number, required: true },
    payment_status: { type: String, default: "unpaid" },
    stripe_session_id: { type: String },
}, {
    timestamps: true,
    versionKey: false
});
//# sourceMappingURL=vendorPayment.schema.js.map