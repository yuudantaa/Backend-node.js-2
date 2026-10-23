import BookmarkRepositories from '../repositories/bookmark-repositories.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';

export const createBookmark = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const userId = req.user && req.user.id;
        if (!userId) {
            return next(new InvariantError('User harus login'));
        }

        const bookmark = await BookmarkRepositories.createBookmark({
            job_id: jobId,
            user_id: userId,
        });

        if (!bookmark) {
            return next(new InvariantError('Bookmark gagal ditambahkan'));
        }

        return response(res, 201, 'Bookmark berhasil ditambahkan', bookmark);
    } catch (err) {
        return next(err);
    }
};

export const getBookmarkById = async (req, res, next) => {
    const { id } = req.params;
    const bookmark = await BookmarkRepositories.getBookmarkById(id);
    if (!bookmark) return next(new NotFoundError('bookmark tidak ditemukan'));
    return response(res, 200, 'bookmark berhasil ditampilkan', bookmark);
};

export const deleteBookmarkByJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const userId = req.user && req.user.id;
        if (!userId) {
            return next(new InvariantError('User harus login'));
        }

        const deleted = await BookmarkRepositories.deleteBookmarkByJob({
            job_id: jobId,
            user_id: userId,
        });

        if (!deleted) {
            return next(new NotFoundError('Bookmark tidak ditemukan'));
        }

        return response(res, 200, 'Bookmark berhasil dihapus', deleted);
    } catch (err) {
        return next(err);
    }
};

export const getBookmarks = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { data: bookmarks, fromCache } = await BookmarkRepositories.getBookmarksByUser(userId);
        res.set('X-Data-Source', fromCache ? 'cache' : 'database');
        return response(res, 200, 'bookmark berhasil ditampilkan', { bookmarks });
    } catch (err) {
        return next(err);
    }
};
