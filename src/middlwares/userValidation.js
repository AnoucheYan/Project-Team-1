const Joi = require("joi");

const userRegValidation = (req, res, next) => {
  const schema = Joi.object().keys({
    firstName: Joi.string()
      .regex(/^[a-zA-Z]+$/)
      .min(2)
      .required(),
    lastName: Joi.string()
      .regex(/^[a-zA-Z]+$/)
      .min(2)
      .required(),
    country: Joi.string()
      .regex(/^[a-zA-Z]+$/)
      .min(2)
      .required(),
    email: Joi.string()
      .regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/)
      .required(),
    password: Joi.string()
      .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9_.+-]{8,})$/)
      .min(8)
      .required(),
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

const userUpdateValidation = (req, res, next) => {
  const schema = Joi.object().keys({
    userName: Joi.string()
      .regex(/^[a-zA-Z]+ [a-zA-Z]+$/)
      .min(2)
      .required(),
    country: Joi.string()
      .regex(/^[a-zA-Z]+$/)
      .min(2)
      .required(),
    email: Joi.string()
      .regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/)
      .required(),
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

const updatePasswordValidation = (req, res, next) => {
  const schema = Joi.object().keys({
    password: Joi.string().required(),
    newPassword: Joi.string()
      .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9_.+-]{8,})$/)
      .min(8)
      .required(),
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
  userRegValidation,
  userUpdateValidation,
  updatePasswordValidation,
};
