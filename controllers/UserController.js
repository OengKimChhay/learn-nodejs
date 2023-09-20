var bcrypt = require("bcryptjs");
const UserModel = require("../models/UserModel");
const { generateAccessToken, generateRefreshToken } = require("../service/jwt");
const all = async (req, res) => {
  try {
    const users = await UserModel.find({ deleted: false });
    return res.status(200).json({ status: 200, data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "All fields can not be blank!!" });

    const exist = await UserModel.findOne({ email: email });
    if (exist) return res.status(400).json({ error: "User already exist!" });

    const newUser = new UserModel({
      email,
      password: await cryptPassword(password),
    });
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getOne = async (req, res) => {
  try {
    const user = await findDataById(req.params.id, res);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOne = async (req, res) => {
  try {
    const user = await findDataById(req.params.id, res);
    user.name = req.body.name;
    user.password = await cryptPassword(req.body.password);
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteOne = async (req, res) => {
  try {
    const user = await findDataById(req.params.id, res);
    const deletedUser = await user.deleteOne({ _id: req.params.id });
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "All fields can not be blank!!" });

    const user = await UserModel.findOne({ email: email });
    if (!user) return res.status(404).json({ error: "User not yet register" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(403).json({ error: "Unauthorized" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set the refresh token as a cookie
    res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 6 * 24 * 60 * 60 * 1000, // 6 days
    });
    // .header('Authorization', accessToken);

    req.user = user;
    res.status(200).json({ user, accessToken});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findDataById = async (id, res) => {
  try {
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return user;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cryptPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error("Error hashing password:", error);
  }
};

module.exports = { all, create, updateOne, login, getOne, deleteOne };
