var validator = require("validator");

const verifRegister = async (req, res, next) => {
  const pseudo = req.body.pseudo;
  const email = req.body.email;
  const password = req.body.password;

  if (!pseudo || !email || !password) {
    return res.status(400).json({ error: "fields missing" });
  }

  if (!validator.isAlpha(pseudo, undefined, { ignore: " -" })) {
    return res.json({ message: "le nom doit contenir que des lettres" });
  }

  if (!validator.isEmail(email)) {
    return res.json({ message: "format mail incorrect" });
  }

  if (!validator.isStrongPassword(password)) {
    return res.json({
      message:
        "le password doit contenir une majuscule, une minuscule, un caractère spéciale, et des numéros",
    });
  }

  req.pseudo = pseudo;
  req.email = email;
  req.password = password;
  next();
};

const verifLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!req.body.email || !req.body.password) {
    res.status(400).json({ error: "Some fields are missing" });
    return;
  }

  if (!validator.isEmail(email)) {
    return res.json({ message: "format mail incorrect" });
  }
  if (!validator.isStrongPassword(password)) {
    return res.json({
      message:
        "le password doit contenir une majuscule, une minuscule, un caractère spéciale, et des numéros",
    });
  }
  req.email = email;
  req.password = password;
  next();
};

module.exports = {
  verifRegister,
  verifLogin,
};
