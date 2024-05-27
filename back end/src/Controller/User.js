const { pool } = require("../Services/DbMySql");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const { transporter } = require("../Services/mailer");
const jwt = require("jsonwebtoken");

const addUser = async (req, res) => {
  let pseudo = req.pseudo;
  let email = req.email;
  let password = req.password;
  let picture = req.file.filename;
  let date = new Date();
  try {
    const values = [email];
    const verifMail = `SELECT email FROM user WHERE email=?`;
    const [result] = await pool.execute(verifMail, values);

    const valueP = [pseudo];
    const verifpseudo = `SELECT pseudo FROM user WHERE pseudo=?`;
    const [resultP] = await pool.execute(verifpseudo, valueP);

    if (result.length !== 0) {
      res.status(400).json({ error: "email existe" });
      return;
    }
    if (resultP.length !== 0) {
      res.status(400).json({ error: "pseudo existe" });
      return;
    } else {
      const hash = await bcrypt.hash(password, 10);

      console.log(pseudo);
      console.log(email);
      console.log(password);
      console.log(picture);
      console.log(date);

      const sqlAddUser =
        "INSERT INTO user (pseudo, email, password, picture, created_at, updated_at, isActive, role_id, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";

      const activationToken = await bcrypt.hash(email, 10);

      let cleanToken = activationToken.replaceAll("/", "");

      const insertValues = [
        pseudo,
        email,
        hash,
        picture,
        date,
        date,
        0,
        0,
        cleanToken,
      ];

      const [rows] = await pool.execute(sqlAddUser, insertValues);

      if (rows.affectedRows > 0) {
        const info = await transporter.sendMail({
          from: `${process.env.SMTP_EMAIL}`,
          to: `${process.env.EMAIL}`,
          subject:
            "Email activation const activationToken = await bcrypt.hash(em",
          text: "Activate your remail",
          html: `<p> You need to activate your email, to access our services, please click on this link :
                <a href="http://localhost:3007/validAccount/${cleanToken}">Activate your email</a>
          </p>`,
        });

        res.status(201).json({ success: "registration successfull" });
        return;
      } else {
        res.status(500).json({ error: "registration failed." });
        return;
      }
    }
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ message: "Erreur serveur" });
    return;
  }
};

const valideAccount = async (req, res) => {
  try {
    const token = req.params.token;

    const sql = `SELECT * FROM user WHERE token = ?`;
    const values = [token];
    const [result] = await pool.execute(sql, values);
    if (!result) {
      res.status(204).json({ error: "Wrong credentials" });
      return;
    }

    const sqlValid = "UPDATE user SET isActive = 1, token = '' WHERE token = ?";
    const [updateToken] = await pool.execute(sqlValid, values);
    if (updateToken.affectedRows >= 1) {
      return res.redirect("http://127.0.0.1:5500/Views/login.html");
    }
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const login = async (req, res) => {
  const email = req.email;
  const password = req.password;

  try {
    const values = [email];
    const sql = `SELECT * 
FROM user
INNER JOIN role ON user.role_id = role.id_role
WHERE user.email = ? AND user.isActive = 1;`;
    const [result] = await pool.execute(sql, values);

    console.log(result);

    const role = result[0].name;

    if (result[0].length === 0) {
      res.status(401).json({ error: "Invalid credentials or email not actif" });
      return;
    }
    const isValidPassword = await bcrypt.compare(password, result[0].password);

    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid credentials1" });
      return;
    } else {
      const token = jwt.sign(
        {
          email: result[0].email,
          id_user: result[0].id_user,
          pseudo: result[0].pseudo,
        },
        process.env.SECRET_KEY,
        { expiresIn: "20d" }
      );
      res.status(200).json({ jwt: token, role: role });
      return;
    }
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const messageRecovery = async (req, res) => {
  try {
    const email = req.email;
    const sql = `SELECT email FROM user WHERE email = ?`;
    const values = [email];
    const [result] = await pool.execute(sql, values);

    if (result[0].length === 0) {
      res.status(401).json({ error: "Invalid credentials or email not actif" });
      return;
    } else {
      const sqlAddUser = "UPDATE user SET token =? WHERE email = ?";

      const activationToken = await bcrypt.hash(email, 10);

      let cleanToken = activationToken.replaceAll("/", "");

      const insertValues = [cleanToken, email];

      const [rows] = await pool.execute(sqlAddUser, insertValues);

      if (rows.affectedRows > 0) {
        const info = await transporter.sendMail({
          from: `${process.env.SMTP_EMAIL}`,
          to: `${process.env.EMAIL}`,
          subject: "Reset password",
          text: "Change your password",
          html: `<p> You need to change your password, please click on this link :
                <a href="http://localhost:3007/changePassword/${cleanToken}">Change password</a>
          </p>`,
        });

        res.status(201).json({ success: "mail sending" });
        return;
      } else {
        res.status(500).json({ error: "send failed." });
        return;
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const validePassword = async (req, res) => {
  try {
    const token = req.params.token;

    const sql = `SELECT * FROM user WHERE token = ?`;
    const values = [token];
    const [result] = await pool.execute(sql, values);

    if (!result) {
      res.status(204).json({ error: "invalide " });
      return;
    }

    return res.redirect(
      `http://127.0.0.1:5500/Views/newPassword.html?token=${token}`
    );
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const newPassword = async (req, res) => {
  const newPassword = req.newPassword;
  const token = req.body.token;
  const date = new Date();

  console.log(newPassword);
  console.log(token);
  console.log(date);

  try {
    const hash = await bcrypt.hash(newPassword, 10);
    const values = [hash, date, token];
    const sql = `UPDATE user SET password = ?, token = '', updated_at = ?  WHERE token = ?;`;
    const [result] = await pool.execute(sql, values);
    console.log(result);

    res.status(200).json(result);
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ message: "erreur serveur" });
  }
};

const adminSearchUser = async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    const sql = `SELECT * FROM user WHERE pseudo LIKE '%${user}%';`;
    const [rows] = await pool.execute(sql);
    console.log(rows[0]);
    if (rows[0] != undefined) {
      res.status(200).json(rows);
    } else {
      res.status(500).json({ message: "Erreur serveur" });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
const userDisable = async (req, res) => {
  try {
    const user = req.body.id_user;
    const value = [user];
    const sql = `UPDATE user SET isActive = 0 where id_user= ? `;
    const [result] = await pool.execute(sql, value);
    res.status(200).json({ result });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ message: "erreur serveur" });
  }
};

module.exports = {
  addUser,
  valideAccount,
  login,
  messageRecovery,
  validePassword,
  newPassword,
  adminSearchUser,
  userDisable,
};
