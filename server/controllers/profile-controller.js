import User from "../schemas/userDB.js";

export const changeProfileInfo = async (req, res) => {
  try {
    const newData = req.body;
    const avatar = req.file;

    if (!newData && !avatar) {
      return res.status(400).json({ message: "Не надано даних для зміни" });
    }

    const user = await User.findById(req.user.id).select("name email avatar");
    if (!user) {
      return res.status(404).json("Користувача з таким id не знайдено");
    }

    if (newData.name) user.name = newData.name;
    if (newData.email) user.email = newData.email;
    if (avatar) user.avatar = "/" + avatar.path.replace(/\\/g, "/");

    await user.save();

    res.json({ message: "Профіль оновлено!", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
