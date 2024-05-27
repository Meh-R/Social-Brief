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

const verifRecovery = async (req, res, next) => {
  const email = req.body.email;

  if (!req.body.email) {
    res.status(400).json({ error: "E-mail are missing" });
    return;
  }

  if (!validator.isEmail(email)) {
    return res.json({ message: "format mail incorrect" });
  }

  req.email = email;

  next();
};

const verifNewPassword = async (req, res, next) => {
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  const token = req.body.token;

  if (newPassword !== confirmPassword) {
    res.status(400).json({ error: "Password different " });
    return;
  }

  if (!validator.isStrongPassword(newPassword)) {
    return res.json({ message: "format mail incorrect" });
  }

  if (!validator.isStrongPassword(confirmPassword)) {
    return res.json({ message: "format mail incorrect" });
  }

  // if (!validator.isHash(token)){
  //   return res.json({ message: "is not hash" });
  // }

  req.newPassword = newPassword;
  req.confirmPassword = confirmPassword;

  console.log(newPassword);
  console.log(token);

  next();
};

const verifPost = async (req, res, next) => {
  const comment = req.body.comment;

  if (
    !validator.isAlphanumeric(comment, undefined, {
      ignore: " -!?#/@$€£^.,'éèàçàêô",
    })
  ) {
    return res.json({
      message:
        "le commentaire ne doit contenir que des chiffres et des lettres",
    });
  }

  req.comment = comment;
  next();
};

const verifSearchUser = async (req, res, next) => {
  const user = req.body.user;
  console.log(user);
  if (!validator.isAlpha(user, undefined, { ignore: " -" })) {
    return res.json({ message: "le nom doit contenir que des lettres" });
  }

  req.user = user;

  next();
};

module.exports = {
  verifRegister,
  verifLogin,
  verifRecovery,
  verifNewPassword,
  verifPost,
  verifSearchUser,
};
