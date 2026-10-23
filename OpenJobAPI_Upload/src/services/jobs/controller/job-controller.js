import JobRepositories from '../repositories/job-repositories.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';

export const createJob = async (req, res, next) => {
    const {
        company_id, category_id, user_id, title, description, job_type,
        experience_level, location_type, location_city, salary_min, salary_max,
        is_salary_visible, status
    } = req.validated;

    // Cek duplikat title (optional)
    const isJobExist = await JobRepositories.verifyNewJobTitle(title);
    if (isJobExist) {
        return next(new InvariantError('Gagal menambahkan job. Title sudah ada.'));
    }

    // Siapkan data dengan null untuk field opsional
    const jobData = {
        company_id,
        category_id,
        user_id: user_id ?? null,
        title,
        description,
        job_type,
        experience_level,
        location_type,
        location_city: location_city ?? null,
        salary_min: salary_min ?? null,
        salary_max: salary_max ?? null,
        is_salary_visible: is_salary_visible ?? null,
        status,
    };

    const jobs = await JobRepositories.createJob(jobData);
    if (!jobs) {
        return next(new InvariantError('jobs gagal ditambahkan'));
    }

    return response(res, 201, 'jobs berhasil ditambahkan', jobs);
};

export const getJobs = async (req, res, next) => {
    try {
        const { title, 'company-name': companyName } = req.query;
        const job = await JobRepositories.getJobs({ title, companyName });
        return response(res, 200, 'jobs berhasil ditampilkan', { jobs: job });
    } catch (err) {
        return next(err);
    }
};

export const getJobById = async (req, res, next) => {
    const { id } = req.params;
    const jobs = await JobRepositories.getJobById(id);
    if (!jobs) return next(new NotFoundError('jobs tidak ditemukan'));
    return response(res, 200, 'jobs berhasil ditampilkan', jobs);
};

export const getJobByCompanies = async (req, res, next) => {
    try {
        const { company_id } = req.params;
        const jobs = await JobRepositories.getJobsByCompany(company_id);
        return response(res, 200, 'jobs berhasil ditampilkan', { jobs });
    } catch (err) {
        return next(err);
    }
};

export const getJobByCategories = async (req, res, next) => {
    try {
        const { category_id } = req.params;
        const jobs = await JobRepositories.getJobsByCategory(category_id);
        return response(res, 200, 'jobs berhasil ditampilkan', { jobs });
    } catch (err) {
        return next(err);
    }
};

export const editJobById = async (req, res, next) => {
    const { id } = req.params;

    const existingJob = await JobRepositories.getJobById(id);
    if (!existingJob) {
        return next(new NotFoundError('jobs tidak ditemukan'));
    }

    const {
        company_id, category_id, user_id, title, description, job_type,
        experience_level, location_type, location_city,
        salary_min, salary_max, is_salary_visible, status
    } = req.validated;

    const merged = {
        company_id: company_id ?? existingJob.company_id,
        category_id: category_id ?? existingJob.category_id,
        user_id: user_id ?? existingJob.user_id,
        title: title ?? existingJob.title,
        description: description ?? existingJob.description,
        job_type: job_type ?? existingJob.job_type,
        experience_level: experience_level ?? existingJob.experience_level,
        location_type: location_type ?? existingJob.location_type,
        location_city: location_city ?? existingJob.location_city,
        salary_min: salary_min ?? existingJob.salary_min,
        salary_max: salary_max ?? existingJob.salary_max,
        is_salary_visible: is_salary_visible ?? existingJob.is_salary_visible,
        status: status ?? existingJob.status,
    };

    const jobs = await JobRepositories.editJobs({ id, ...merged });

    if (!jobs) {
        return next(new NotFoundError('jobs tidak ditemukan'));
    }

    return response(res, 200, 'jobs berhasil diperbarui', jobs);
};

export const deleteJobsById = async (req, res, next) => {
    const { id } = req.params;
    const deletedJob = await JobRepositories.deleteJob(id);
    if (!deletedJob) {
        return next(new NotFoundError('job tidak ditemukan'));
    }
    return response(res, 200, 'job berhasil dihapus', deletedJob);
};
