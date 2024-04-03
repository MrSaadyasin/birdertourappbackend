"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const role_enum_1 = require("../common/enum/role.enum");
exports.userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, default: "" },
    google_id: { type: String, default: "" },
    facebook_id: { type: String, default: "" },
    role: { type: String, enum: Object.values(role_enum_1.Role), required: true },
    status: { type: String, default: "pending", enum: ['pending', 'approved', 'rejected'] },
    message: { type: String, default: "" },
    address: { type: String, default: "" },
    description: { type: String, default: "" },
    languages: [{ type: String, default: [] }],
    documents: [{ type: Object, default: [] }],
    available_time_slots: { type: Object, default: {} },
    profile_image: { type: String, default: "" },
    start_date: { type: String, default: "" },
    end_date: { type: String, default: "" },
    start_time: { type: String, default: "" },
    end_time: { type: String, default: "" },
    startTime: { type: String, default: "" },
    endTime: { type: String, default: "" },
    dates: [{ type: String, default: [] }],
    booking_request: { type: String, default: "instant", enum: ['instant', 'requested'] },
    rating: { type: Number, default: 0 },
    badge: { type: Boolean, default: false },
    stripe_user_id: { type: String, default: "" },
}, {
    timestamps: true,
    versionKey: false
});
exports.userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        const hashed = await bcrypt.hash(this['password'], 10);
        this['password'] = hashed;
        return next();
    }
    catch (err) {
        return next(err);
    }
});
//# sourceMappingURL=user.schema.js.map