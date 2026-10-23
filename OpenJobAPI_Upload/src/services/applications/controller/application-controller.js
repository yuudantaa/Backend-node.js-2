import ApplicationRepositories from '../repositories/application-repositories.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import ApplicationNotificationProducer from '../../application-notification/producer/ApplicationNotificationProducer.js';
import JobRepositories from '../../jobs/repositories/job-repositories.js';

export const createApplications = async (req, res, next) => {
    try {
        const { job_id, status } = req.validated;
        const user_id = req.user.id;

        // Cek keberadaan job
        const job = await JobRepositories.getJobById(job_id);
        if (!job) {
            return next(new NotFoundError('Job not found'));
        }

        const application = await ApplicationRepositories.createApplication({
            job_id, user_id, status
        });

        if (!application) {
            return next(new InvariantError('application gagal ditambahkan'));
        }

        // Kirim notifikasi (non-blocking)
        ApplicationNotificationProducer.sendApplicationNotification(application.id)
            .catch(err => console.error('Notification failed:', err));

        return response(res, 201, 'application berhasil ditambahkan', application);
    } catch (err) {
        // Tangani duplicate key (unique constraint)
        if (err && err.code === '23505') {
            return next(new InvariantError('Duplicate application'));
        }
        // Tangani foreign key violation (job atau user tidak ada)
        if (err && err.code === '23503') {
            return next(new NotFoundError('Job or User not found'));
        }
        return next(err);
    }
};

export const getApplications = async (req, res, next) => {
    try {
        const applications = await ApplicationRepositories.getApplication();
        return response(res, 200, 'applications berhasil ditampilkan', { applications });
    } catch (err) {
        return next(err);
    }
};

export const getApplicationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { data: application, fromCache } = await ApplicationRepositories.getApplicationById(id);
        if (!application) {
            return next(new NotFoundError('application tidak ditemukan'));
        }
        res.set('X-Data-Source', fromCache ? 'cache' : 'database');
        return response(res, 200, 'applications berhasil ditampilkan', application);
    } catch (err) {
        return next(err);
    }
};

export const getApplicationsByUser = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const { data: applications, fromCache } = await ApplicationRepositories.getApplicationByUser(user_id);
        res.set('X-Data-Source', fromCache ? 'cache' : 'database');
        return response(res, 200, 'applications berhasil ditampilkan', { applications });
    } catch (err) {
        return next(err);
    }
};

export const getApplicationsByJob = async (req, res, next) => {
    try {
        const { job_id } = req.params;
        const { data: applications, fromCache } = await ApplicationRepositories.getApplicationByJob(job_id);
        res.set('X-Data-Source', fromCache ? 'cache' : 'database');
        return response(res, 200, 'applications berhasil ditampilkan', { applications });
    } catch (err) {
        return next(err);
    }
};

export const editApplicationsById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.validated;

        const application = await ApplicationRepositories.editApplication({
            id, status
        });

        if (!application) {
            return next(new NotFoundError('application tidak ditemukan'));
        }

        return response(res, 200, 'application berhasil diperbarui', application);
    } catch (err) {
        return next(err);
    }
};

export const deleteApplicationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedApplication = await ApplicationRepositories.deleteApplication(id);

        if (!deletedApplication) {
            return next(new NotFoundError('Application tidak ditemukan'));
        }

        return response(res, 200, 'Application berhasil dihapus', deletedApplication);
    } catch (err) {
        return next(err);
    }
};

