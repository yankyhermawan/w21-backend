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

	async patch(id, data) {
		const response = await this.prismaService.customer.findUnique({
			where: {
				id: id,
			},
		});
		if (response) {
			const updatedData = {
				id: id,
				first_name: data.first_name || response.first_name,
				last_name: data.last_name || response.last_name,
				date_of_birth: data.date_of_birth || response.date_of_birth,
				country_code: data.date_of_birth || response.country_code,
				phone_number: data.phone_number || response.phone_number,
				email: data.email || response.email,
				bank_account_number:
					data.bank_account_number || response.bank_account_number,
			};
			const updateResponse = await this.prismaService.customer.update({
				where: {
					id: id,
				},
				data: updatedData,
			});
			return {
				code: 201,
				message: {
					response: updateResponse,
				},
			};
		} else if (response === null) {
			return {
				code: 404,
				message: {
					response: "Data Not Found",
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

	async deleteCustomer(id) {
		const isExist = this.prismaService.customer.findUnique({
			where: {
				id: id,
			},
		});
		if (isExist) {
			const response = await this.prismaService.customer.delete({
				where: {
					id: id,
				},
			});
			return {
				code: 204,
				message: {
					response: response,
				},
			};
		} else if (isExist === null) {
			return {
				code: 404,
				message: {
					response: "Customer Not Found",
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
