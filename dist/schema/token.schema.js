"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenSchema = void 0;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
exports.tokenSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
});
//# sourceMappingURL=token.schema.js.map