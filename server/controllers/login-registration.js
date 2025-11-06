import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../userDB.js";

export const registration = async (req, res) => {
  try {
    const body = req.body;
    if (!body.name || !body.email || !body.password) {
      return res
        .status(400)
        .json({ message: "Всі поля повинні бути заповнені." });
    }

    const salt = 11;
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const user = new User({ ...body, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "Реєстрація успішна!", user });
  } catch (error) {
    if (error.code === 11000) {
      // Це код дубліката унікального поля (E11000)
      return res.status(400).json({ message: "Такий користувач вже існує" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Всі поля повинні бути заповнені!" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        message:
          "Такого користувача не існує. Перевірте правильність введення даних",
      });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(409).json({ message: "Невірний пароль." });
    }

    const payload = { id: user._id, name: user.name, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.cookie("user", token, {
      maxAge: 90000000,
      httpOnly: true,
      signed: true,
    });
    res.json({ message: "Вхід успішний!", payload });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const authStatus = async (req, res) => {
  try {
    const user = req.signedCookies.user;
    if (!user) {
      return res.json({ auth: false, user: null });
    }
    const payload = jwt.verify(user, process.env.JWT_SECRET);
    res.json({ auth: true, user: payload.id });
  } catch (error) {
    res.status(500).json({ message: "Server erorr", error: error.message });
  }
};

export const getCookieAndVerify = async (req, res, next) => {
  const user = req.signedCookies.user;
  if (!user) {
    return next();
  }
  const payload = jwt.verify(user, process.env.JWT_SECRET);
  req.user = payload;
  next();
};

export const cookieGetId = (req, res, next) => {
  const user = req.signedCookies.user;

  if (!user) {
    return res.status(401).json({ message: "Користувач не авторизований" });
  }
  const payload = jwt.verify(user, process.env.JWT_SECRET);
  req.user = payload;
  next();
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("user");
    res.json({ message: "Успішно розлогінено!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
