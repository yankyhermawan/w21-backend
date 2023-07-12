import jwt from "jsonwebtoken";

export class RecipeGuard {
	checkTokenValid(token) {
		try {
			return jwt.verify(token, process.env["JWT_KEY"]);
		} catch {
			return false;
		}
	}
}
