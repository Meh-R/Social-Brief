const { pool } = require("../Services/DbMySql");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const { transporter } = require("../Services/mailer");

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
    if (result.length !== 0) {
      res.status(400).json({ error: "email existe" });
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
          subject: "Email activation",
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
      return res.redirect("http://127.0.0.1:5500/front%20end/Views/login.html");
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
    const sql = `SELECT *, FROM user  INNER JOIN role ON user.role_id = id_role WHERE user.email =  ? `;
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

module.exports = { addUser, valideAccount, login };
