const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
  
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },

    
    user: {
      type: Schema.Types.ObjectId,
      ref: "UserCollection",
      required: true,
      index: true,
    },

   
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

  

    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);




module.exports = mongoose.model("Comment", CommentSchema);
