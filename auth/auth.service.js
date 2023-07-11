import { PrismaService } from "../prisma.service";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
	constructor() {
		this.prismaService = new PrismaService();
	}

	async login(username, password) {
		const isExist = await this.prismaService.admin.findUnique({
			where: {
				username: username,
			},
		});
		if (!isExist) {
			return {
				code: 404,
				message: {
					response: "User Not Found",
				},
			};
		}
		const result = bcrypt.compareSync(password, isExist.password);
		if (!result) {
			return {
				code: 401,
				message: {
					response: "Invalid Username or Password",
				},
			};
		}
		isExist.password = undefined;
		const token = jwt.sign(isExist, process.env["JWT_PRIVATE"], {
			expiresIn: "24h",
		});
		return {
			code: 200,
			message: {
				access_token: token,
			},
		};
	}

	async register(data) {
		const isExist = await this.prismaService.admin.findUnique({
			where: {
				username: data.username,
			},
		});
		if (isExist) {
			return {
				code: 409,
				message: {
					response: "Username already exist",
				},
			};
		}
		data.password = bcrypt.hashSync(data.password, process.env["BCRYPT_SALT"]);
		const response = await this.prismaService.admin.create({
			data: data,
		});
		response.password = undefined;
		return {
			code: 201,
			message: {
				response: response,
			},
		};
	}
}
