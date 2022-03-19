const mongoose = require('mongoose'),
const mongoosePaginate = require('mongoose-paginate'),
const Schema = mongoose.Schema,
const ObjectId = Schema.Types.ObjectId;

const TicketSchema = new Schema(
  {
    owner: {
      type: ObjectId,
      ref: 'User',
      required: true
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
      format : 'date-time'
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'cancel']
    },
    cancelDate: {
      type: Date,
      format: 'date-time'
    },
    country: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

TicketSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Ticket', TicketSchema);
