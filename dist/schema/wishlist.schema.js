"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistSchema = void 0;
const mongoose = require("mongoose");
exports.wishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
}, {
    timestamps: true,
    versionKey: false
});
//# sourceMappingURL=wishlist.schema.js.map