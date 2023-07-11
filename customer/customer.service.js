import { PrismaService } from "../prisma.service.js";

export class CustomerService {
	constructor() {
		this.prismaService = new PrismaService();
	}
	// without id as params
	async get() {
		const response = await this.prismaService.customer.findMany();
		if (response) {
			return {
				code: 200,
				message: {
					response: response,
				},
			};
		}
	}

	async create(data) {
		const response = await this.prismaService.customer.create({
			data: data,
		});
		if (response) {
			return {
				code: 201,
				message: {
					response: response,
				},
			};
		}
		return {
			code: 500,
			message: {
				response: "Internal Server Error",
			},
		};
	}
	// with id as params

	async getById(id) {
		const response = await this.prismaService.customer.findUnique({
			where: {
				id: id,
			},
		});
		if (response) {
			return {
				code: 201,
				message: {
					response: response,
				},
			};
		}
		return {
			code: 500,
			message: {
				response: "Internal Server Error",
			},
		};
	}
}
