const { boolean } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const TicketSchema = new Schema(
  {
    owner: {
      type: ObjectId            
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    date: {
      type: Date,      
      required: true,
    },
    canCancel: {
      type: Boolean,
      required: true,
    },
    cancelDate: {
      type: Date,      
      required: true,
    },
    countries: {
      type: Array,
      required: true,
    },
    like: {
      type: Array
    },
    comment: {
      type: Array
    },
    likeCount: {
      type: Number,
      default: "0",
    }

  },
  {
    collection: "tickets", timestamps: true
  }
);



module.exports = mongoose.model('Ticket', TicketSchema);
