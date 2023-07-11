import jwt from "jsonwebtoken";

export class CustomerGuard {
	checkTokenValid(token) {
		try {
			return jwt.verify(token, process.env["JWT_KEY"]);
		} catch (err) {
			return false;
		}
	}
}
