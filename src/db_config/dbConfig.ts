import mongoose from "mongoose";

export async function dbConfig() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });

    connection.on("error", (error) => {
      console.error("Error connecting to MongoDB:", error);
      process.exit();
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
