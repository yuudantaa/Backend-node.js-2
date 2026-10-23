import CompanyRepositories from '../repositories/company-repositories.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import { companyPayloadSchema } from '../validator/schema.js';

export const createCompany = async (req, res, next) => {
    const { name,description,location } = req.validated;

    const isCompanyExist = await CompanyRepositories.verifyNewCompanyName(name);
    if (isCompanyExist) {
        return next(new InvariantError('Gagal menambahkan company. Name sudah ada.'));
    }

    const company = await CompanyRepositories.createCompanies({
        name, description, location
    });

    if (!company) {
        return next(new InvariantError('company gagal ditambahkan'));
    }

    return response(res, 201, 'company berhasil ditambahkan', company);
};

export const getCompanies = async (req, res, next) => {
    try {
        const companies = await CompanyRepositories.getCompanies();
        return response(res, 200, 'company berhasil ditampilkan', { companies });
    } catch (err) {
        return next(err);
    }
};

export const getCompanyById = async (req, res, next) => {
    const { id } = req.params;
    const { data: company, fromCache } = await CompanyRepositories.getCompaniesById(id);
    if (!company) return next(new NotFoundError('company tidak ditemukan'));
    res.set('X-Data-Source', fromCache ? 'cache' : 'database');
    return response(res, 200, 'company berhasil ditampilkan', company);
};

export const editCompanyById = async (req, res, next) => {
    const { id } = req.params;

    const existingCompany = await CompanyRepositories.getCompaniesById(id);
    if (!existingCompany) {
        return next(new NotFoundError('company tidak ditemukan'));
    }

    const {
        name, description, location
    } = req.validated;

    const merged = {
        name: name ?? existingCompany.name,
        location: location ?? existingCompany.location,
        description: description ?? existingCompany.description,
    };

    const companies = await CompanyRepositories.editCompanies({ id, ...merged });

    if (!companies) {
        return next(new NotFoundError('companies tidak ditemukan'));
    }

    return response(res, 200, 'companies berhasil diperbarui', companies);
};

export const deleteCompanyById = async (req, res, next) => {
    const { id } = req.params;
    const deletedCompany = await CompanyRepositories.deleteCompanies(id);
    if (!deletedCompany) {
        return next(new NotFoundError('company tidak ditemukan'));
    }
    return response(res, 200, 'company berhasil dihapus', deletedCompany);
};

