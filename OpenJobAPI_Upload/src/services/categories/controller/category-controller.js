import CategoryRepositories from '../repositories/category-repositories.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';

export const createCategory = async (req, res, next) => {
    const { name } = req.validated;

    const isCategoryExist = await CategoryRepositories.verifyNewCategoryName(name);
    if (isCategoryExist) {
        return next(new InvariantError('Gagal menambahkan Category. Name sudah ada.'));
    }

    const category = await CategoryRepositories.createCategory({
        name
    });

    if (!category) {
        return next(new InvariantError('category gagal ditambahkan'));
    }

    return response(res, 201, 'category berhasil ditambahkan', category);
};

export const getCategory = async (req, res, next) => {
    try {
        const categories = await CategoryRepositories.getCategories();
        return response(res, 200, 'category berhasil ditampilkan', { categories });
    } catch (err) {
        return next(err);
    }
};

export const getCategoryById = async (req, res, next) => {
    const { id } = req.params;
    const category = await CategoryRepositories.getCategoriesById(id);
    if (!category) return next(new NotFoundError('Category tidak ditemukan'));
    return response(res, 200, 'category berhasil ditampilkan', category); 
};

export const editCategoryById = async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.validated;
    const category = await CategoryRepositories.editCategories({ id, name });
    if (!category) return next(new NotFoundError('category tidak ditemukan'));
    return response(res, 200, 'category berhasil diperbarui', category);
};

export const deleteCategoryById = async (req, res, next) => {
    const { id } = req.params;
    const deletedCategory = await CategoryRepositories.deleteCategories(id);
    if (!deletedCategory) {
        return next(new NotFoundError('category tidak ditemukan'));
    }
    return response(res, 200, 'category berhasil dihapus', deletedCategory);
};

