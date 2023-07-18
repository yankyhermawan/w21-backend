import express from "express";
import cors from "cors";
import { AuthService } from "./auth/auth.service.js";
import { RecipeGuard } from "./recipe/recipe.guard.js";
import { RecipeService } from "./recipe/recipe.service.js";
import { RecipeAuthorization } from "./recipe/recipe.authorization.js";
import multer from "multer";

const app = express();
const port = process.env.PORT || 4000;
const authService = new AuthService();
const recipeGuard = new RecipeGuard();
const recipeService = new RecipeService();
const recipeAuthorization = new RecipeAuthorization();

app.use(express.json());
app.use(cors());

// AUTH USER

app.route("/auth/login").post(async (req, res) => {
	const { username, password } = req.body;
	const response = await authService.login(username, password);
	res.status(response.code).json(response.message);
});

app.route("/auth/register").post(async (req, res) => {
	const response = await authService.register(req.body);
	res.status(response.code).json(response.message);
});

// RECIPE ROUTE

app
	.route("/recipe")
	.get(async (req, res) => {
		const token = String(
			req.headers["authorization"].split(" ")[1].replace("'", "")
		);
		const checkToken = recipeGuard.checkTokenValid(token);
		if (checkToken) {
			const response = await recipeService.getAll();
			res.status(response.code).json(response.message);
		}
		res.status(400).json({ response: "Invalid token" });
	})
	.post(async (req, res) => {
		try {
			const token = String(
				req.headers["authorization"].split(" ")[1].replace("'", "")
			);
			const checkToken = recipeGuard.checkTokenValid(token);
			if (checkToken) {
				console.log(req.body);
				const response = await recipeService.create(req.body, checkToken.id);
				res.status(response.code).json(response.message);
			}
			res.status(400).json({
				response: "Invalid Token",
			});
		} catch (err) {
			res.status(500).json({
				response: "Server Error",
			});
		}
	});

app.route("/recipe/:query").get(async (req, res) => {
	const token = String(
		req.headers["authorization"].split(" ")[1].replace("'", "")
	);
	const checkToken = recipeGuard.checkTokenValid(token);
	if (checkToken) {
		const response = await recipeService.findByName(req.params.query);
		res.status(response.code).json(response.message);
	}
	res.status(400).json({ response: "Invalid token" });
});

app
	.route("/recipe/:id")
	.get(async (req, res) => {
		const token = String(
			req.headers["authorization"].split(" ")[1].replace("'", "")
		);
		const checkToken = recipeGuard.checkTokenValid(token);
		if (checkToken) {
			const response = await recipeService.findById(+req.params.id);
			res.status(response.code).json(response.message);
		}
		res.status(400).json({ response: "Invalid token" });
	})
	.patch(async (req, res) => {
		try {
			const token = String(
				req.headers["authorization"].split(" ")[1].replace("'", "")
			);
			const checkToken = recipeGuard.checkTokenValid(token);
			if (checkToken) {
				const checkAuthorization = recipeAuthorization.grantAccess(
					+checkToken.id,
					+req.params.id
				);
				if (checkAuthorization) {
					const response = await recipeService.patchRecipe(
						req.body,
						checkToken.id
					);
					res.status(response.code).json(response.message);
				} else {
					console.log("c");
					res.status(401).json({
						message: "Access Denied",
					});
				}
			} else if (!checkToken) {
				res.status(400).json({
					response: "Invalid Token",
				});
			}
		} catch (err) {
			res.status(500).json({
				response: "Server Error",
			});
		}
	})
	.delete(async (req, res) => {
		try {
			const token = String(
				req.headers["authorization"].split(" ")[1].replace("'", "")
			);
			const checkToken = recipeGuard.checkTokenValid(token);
			if (checkToken) {
				const checkAuthorization = recipeAuthorization.grantAccess(
					+checkToken.id,
					+req.params.id
				);
				if (checkAuthorization) {
					const response = await recipeService.deleteRecipe(+req.params.id);
					res.status(response.code).json(response.message);
				} else {
					console.log("c");
					res.status(401).json({
						message: "Access Denied",
					});
				}
			} else if (!checkToken) {
				res.status(400).json({
					response: "Invalid Token",
				});
			}
		} catch (err) {
			res.status(500).json({
				response: "Server Error",
			});
		}
	});

app.listen(port, () => {
	console.log(`Server Running on port ${port}`);
});
