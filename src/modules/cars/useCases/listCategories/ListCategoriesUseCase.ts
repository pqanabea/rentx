import { inject, injectable } from 'tsyringe';

import { Category } from '@modules/cars/infra/typeorm/entities/Category';
import { ICategoriesRepository } from '@modules/cars/repositories/ICategoriesRepository';


@injectable()
class ListCategoriesUseCase {
    constructor(
        @inject('CategoriesRepository')
        private categoriesRespository: ICategoriesRepository,
    ) {}

    async execute(): Promise<Category[]> {
        const categories = await this.categoriesRespository.list();

        return categories;
    }
}
export { ListCategoriesUseCase };
