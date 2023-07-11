import { PrismaService } from "../prisma.service";

export class CustomerService {
	constructor() {
		this.prismaService = new PrismaService();
	}

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
}
