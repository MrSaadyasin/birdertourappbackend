"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentSchema = void 0;
const mongoose = require("mongoose");
exports.paymentSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    stripe_session_id: { type: String, required: true },
}, {
    timestamps: true,
    versionKey: false
});
//# sourceMappingURL=payment.schema.js.map