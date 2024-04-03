"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsConditionSchema = void 0;
const mongoose = require("mongoose");
exports.TermsConditionSchema = new mongoose.Schema({
    terms_condition: { type: String, required: true },
}, {
    timestamps: true,
    versionKey: false
});
//# sourceMappingURL=termsCondition.schema.js.map