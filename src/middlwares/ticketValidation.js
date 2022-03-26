const Joi = require("joi");

const ticketCreteValidation = (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string()
      .regex(/^[a-zA-Z]+$/)
      .min(2)
      .required(),
    description: Joi.string()
      .min(2)
      .required(),
    countries: Joi.array().items(Joi.string())
      .required(),
    price: Joi.number()
      .positive()
      .greater(0)
      .required(),
    quantity: Joi.number()
      .positive()
      .greater(0)
      .required(),
    likeCount: Joi.number()
      .optional(),
    date: Joi.date()
      .min(new Date().toISOString().slice(0, 10)),
    cancelDate: Joi.date()
      .min(new Date().toISOString().slice(0, 10))
      .optional(),
    canCancel: Joi.boolean(),
      
  });

  const { error } = schema.validate(req.body);

  const valid = error == null;

  if (valid) {
    next();
  } else {
    const { details } = error;
    const message = details.map((i) => i.message).join(",");
    res.status(422).json({ error: message });
  }
};

const ticketUpdateValidation = (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string()
      .regex(/^[a-zA-Z]+$/)
      .min(2)
      .required(),
    description: Joi.string()
      .min(2)
      .required(),
    countries: Joi.array().items(Joi.string())
      .required(),
    price: Joi.number()
      .positive()
      .greater(0)
      .required(),
    quantity: Joi.number()
      .positive()
      .greater(0)
      .required(),
    likeCount: Joi.number()
      .optional(),  
    date: Joi.date()
      .min(new Date().toISOString().slice(0, 10)),
    cancelDate: Joi.date()
      .min(new Date().toISOString().slice(0, 10))
      .optional(),
    canCancel: Joi.boolean(),
  });

  const { error } = schema.validate(req.body);

  const valid = error == null;

  if (valid) {
    next();
  } else {
    const { details } = error;
    const message = details.map((i) => i.message).join(",");
    res.status(422).json({ error: message });
  }
};



module.exports = {
  ticketCreteValidation,
  ticketUpdateValidation,
};
