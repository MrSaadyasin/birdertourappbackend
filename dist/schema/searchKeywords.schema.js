"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchKeywordSchema = void 0;
const mongoose = require("mongoose");
exports.searchKeywordSchema = new mongoose.Schema({
    keyword: { type: String, required: true },
    country_location: { type: String, required: true },
}, {
    timestamps: true,
    versionKey: false
});
//# sourceMappingURL=searchKeywords.schema.js.map