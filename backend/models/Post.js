import mongoose, { model } from "mongoose";

const postSchema=mongoose.Schema({
    title:{type:String,required:true},
    content:{type:String,required:true},
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // Ensure author is required
    image: { type: String }
},
{timestamps:true}
);
const Post=mongoose.model('Post',postSchema);
export default Post;