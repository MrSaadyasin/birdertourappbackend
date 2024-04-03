"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogSchema = void 0;
const mongoose = require("mongoose");
exports.blogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    banner_image: { type: String, required: true },
    slug: { type: String, slug: 'title', unique: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }],
}, {
    timestamps: true,
    versionKey: false
});
exports.blogSchema.pre("save", function (next) {
    if (this.isModified('title')) {
        this.slug = this.title.split(" ").join("-").toLowerCase();
    }
    next();
});
//# sourceMappingURL=blog.schema.js.map