import { PrismaService } from "../prisma.service.js";

export class RecipeService {
	constructor() {
		this.prismaService = new PrismaService();
	}

	async getAll() {
		try {
			const response = await this.prismaService.recipe.findMany();
			return {
				code: 200,
				message: {
					response: response,
				},
			};
		} catch (err) {
			return {
				code: 500,
				message: {
					response: "Internal Server Error",
				},
			};
		}
	}

	async findById(id) {
		try {
			const response = await this.prismaService.recipe.findUnique({
				where: {
					id: id,
				},
			});
			return {
				code: 200,
				message: {
					response: response,
				},
			};
		} catch (err) {
			return {
				code: 500,
				message: {
					response: "Internal Server Error",
				},
			};
		}
	}

	async create(data, id) {
		try {
			const dataToPost = {
				name: data.name,
				category: data.category,
				imageURL: data.url,
				ingredients: data.ingredients,
				step: data.step,
				userId: id,
			};
			const response = await this.prismaService.recipe.create({
				data: dataToPost,
			});
			return {
				code: 201,
				message: {
					response: response,
				},
			};
		} catch (err) {
			return {
				code: 500,
				message: {
					response: "Internal Server Error",
				},
			};
		}
	}

	async patchRecipe(data, id) {
		try {
			const defaultData = await this.prismaService.recipe.findUnique({
				where: {
					id: data.id,
				},
			});
			console.log(defaultData);
			const updatedData = {
				name: data.name || defaultData.name,
				category: data.category || defaultData.category,
				imageURL: data.imageURL || defaultData.imageURL,
				ingredients: data.ingredients || defaultData.ingredients,
				step: data.step || defaultData.step,
				userId: defaultData.userId,
			};
			const response = await this.prismaService.recipe.update({
				where: {
					id: defaultData.id,
				},
				data: updatedData,
			});
			return {
				code: 201,
				message: {
					response: response,
				},
			};
		} catch (err) {
			return {
				code: 500,
				message: {
					response: "Internal Server Error",
				},
			};
		}
	}

	async deleteRecipe(id) {
		try {
			const isExist = await this.prismaService.recipe.findUnique({
				where: {
					id: id,
				},
			});
			if (isExist) {
				const response = await this.prismaService.recipe.delete({
					where: {
						id: id,
					},
				});
				return {
					code: 202,
					message: {
						response: response,
					},
				};
			}
			return {
				code: 404,
				message: {
					response: "Data Not found",
				},
			};
		} catch (err) {
			return {
				code: 500,
				message: {
					response: "Server Error",
				},
			};
		}
	}
}
