import { PrismaService } from "../prisma.service.js";

export class RecipeAuthorization {
	constructor() {
		this.prismaService = new PrismaService();
	}
	async grantAccess(userID, itemID) {
		const itemData = await this.prismaService.recipe.findUnique({
			where: {
				id: itemID,
			},
		});
		if (itemData.userId === userID) {
			return true;
		}
		return false;
	}
}
