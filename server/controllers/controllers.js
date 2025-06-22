import * as userRespositories from "../repositories/sqlUserRepositories";
export async function sign_up(req, res) {
  try {
    const newUser = await userRespositories.sign_up(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating User:", error);
    res.status(500).json({ message: "Server error" });
  }
}
