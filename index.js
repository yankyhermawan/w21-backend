import express from "express";
import cors from "cors";
import { CustomerGuard } from "./customer/customer.guard";
import { CustomerService } from "./customer/customer.service";

const customerGuard = new CustomerGuard();
const customerService = new CustomerService();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.route("/customer").get(async (req, res) => {
	const token = String(req.headers["authorization"].split(" ")[1]);
	const checkToken = customerGuard.checkTokenValid(token);
	if (checkToken) {
		const data = await customerService.get();
		res.status(data.code).json(data.message.response);
	}
});

app.listen(port, () => {
	console.log(`Server Started on Port ${port}`);
});
