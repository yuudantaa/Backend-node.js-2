import UserRepositories from '../repositories/user-repositories.js';
import ApplicationRepositories from '../../applications/repositories/application-repositories.js';
import BookmarkRepositories from '../../bookmarks/repositories/bookmark-repositories.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';

export const createUser = async (req, res, next) => {
    const { name, password, email, role } = req.validated;

    const isEmailExist = await UserRepositories.verifyNewEmail(email);
    if (isEmailExist) {
        return next(new InvariantError('Gagal menambahkan user. Email sudah digunakan.'));
    }

    const user = await UserRepositories.createUser({
        name, password, email, role
    });

    if (!user) {
        return next(new InvariantError('User gagal ditambahkan'));
    }

    return response(res, 201, 'User berhasil ditambahkan', user);
};

export const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { data: user, fromCache } = await UserRepositories.getUserById(userId);
        if (!user) {
            return next(new NotFoundError('User tidak ditemukan'));
        }
        res.set('X-Data-Source', fromCache ? 'cache' : 'database');
        return response(res, 200, 'user berhasil ditampilkan', user);
    } catch (err) {
        return next(err);
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const users = await UserRepositories.getUsers();
        return response(res, 200, 'user berhasil ditampilkan', { users });
    } catch (err) {
        return next(err);
    }
};

export const getUserById = async (req, res, next) => {
    const { id } = req.params;
    const { data: user, fromCache } = await UserRepositories.getUserById(id);
    if (!user) return next(new NotFoundError('User tidak ditemukan'));
    res.set('X-Data-Source', fromCache ? 'cache' : 'database');
    return response(res, 200, 'user berhasil ditampilkan', user);
};

export const getMyApplications = async (req, res, next) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return next(new InvariantError('User harus login'));
        }

        const { data: applications, fromCache } = await ApplicationRepositories.getApplicationByUser(userId);
        res.set('X-Data-Source', fromCache ? 'cache' : 'database');

        return response(res, 200, 'Applications berhasil ditampilkan', { applications });
    } catch (err) {
        return next(err);
    }
};

export const editUserById = async (req, res, next) => {
    const { id } = req.params;

    const existingUser = await UserRepositories.getUserById(id);
    if (!existingUser) {
        return next(new NotFoundError('user tidak ditemukan'));
    }

    const {
        name, email, role, password
    } = req.validated;

    const merged = {
        name: name ?? existingUser.name,
        email: email ?? existingUser.email,
        role: role ?? existingUser.role,
        password: password ?? existingUser.password,
    };

    const users = await UserRepositories.editUsers({ id, ...merged });

    if (!users) {
        return next(new NotFoundError('users tidak ditemukan'));
    }

    return response(res, 200, 'users berhasil diperbarui', users);
};


export const getMyBookmarks = async (req, res, next) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return next(new InvariantError('User harus login'));
        }

        const { data: bookmarks, fromCache } = await BookmarkRepositories.getBookmarksByUser(userId);
        res.set('X-Data-Source', fromCache ? 'cache' : 'database');

        return response(res, 200, 'Bookmarks berhasil ditampilkan', { bookmarks });
    } catch (err) {
        return next(err);
    }
};
