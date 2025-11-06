import mongoose from "mongoose";
const url =
  "mongodb+srv://Polina:Mo3TTUvdETmMGVCl@cluster0.wb86g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

//якщо локальна, то просто:
//await mongoose.connect("mongodb://127.0.0.1:27017/notesApp"); //припутим

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("Успішно підключено!");
  } catch (error) {
    console.error("Error: ", error.message);
    process.exit(1);
  }
};

export default connectDB;
