import express from "express";
import cors from "cors";
import { CustomerGuard } from "./customer/customer.guard.js";
import { CustomerService } from "./customer/customer.service.js";

const customerGuard = new CustomerGuard();
const customerService = new CustomerService();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app
	.route("/customer")
	.get(async (req, res) => {
		try {
			const token = String(req.headers["authorization"].split(" ")[1]);
			const checkToken = customerGuard.checkTokenValid(token);
			if (checkToken) {
				const data = await customerService.get();
				res.status(data.code).json(data.message);
			}
		} catch (err) {
			res.status(401).json({ response: "Invalid Token" });
		}
	})
	.post(async (req, res) => {
		try {
			const token = String(req.headers["authorization"].split(" ")[1]);
			const checkToken = customerGuard.checkTokenValid(token);
			if (checkToken) {
				const data = await customerService.create(req.body);
				res.status(data.code).json(data.message);
			}
		} catch (err) {
			res.status(401).json({ response: "Invalid Token" });
		}
	});

app.route("/customer/:id").get(async (req, res) => {
	try {
		const token = String(req.headers["authorization"].split(" ")[1]);
		const checkToken = customerGuard.checkTokenValid(token);
		if (checkToken) {
			const data = await customerService.getById(+req.params.id);
			res.status(data.code).json(data.message);
		}
	} catch (err) {
		res.status(401).json({ response: "Invalid Token" });
	}
});

app.listen(port, () => {
	console.log(`Server Started on Port ${port}`);
});
