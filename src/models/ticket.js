const { boolean } = require('joi');
const mongoose = require('mongoose');
// const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const TicketSchema = new Schema(
  {
    owner: {
      type: ObjectId,
            
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
    likes: {
      type: Array
    },
    comment: {
      type: Array
    },

  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

// TicketSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Ticket', TicketSchema);
