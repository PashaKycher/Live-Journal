import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    from_user_id: {type: String, required: true, ref: 'User'},
    to_user_id: {type: String, required: true, ref: 'User'},
    text: {type: String, trim: true, default: ''},
    media_url: {type: Array, default: []},
    message_type: {type: String, enum: ['text', 'image']},
    seen: {type: Boolean, default: false},
},{timestamps: true, minimize: false});

const Message = mongoose.model('Message', messageSchema);

export default Message