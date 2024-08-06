import getUserByToken from '../utils/auth';

class FilesController {
  static async  postUpload (res, req) {
    const user = await getUserByToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { name, type, parentIdn = 0, isPublic = false, data } = req.body;

    
  }
}