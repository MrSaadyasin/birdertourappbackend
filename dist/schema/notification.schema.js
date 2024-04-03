"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationSchema = void 0;
const mongoose = require("mongoose");
exports.notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    channel_name: { type: String, required: true },
}, {
    timestamps: true,
    versionKey: false
});
//# sourceMappingURL=notification.schema.js.map