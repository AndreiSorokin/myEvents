import { Request, Response, NextFunction } from 'express';
import { InternalServerError } from '../errors/ApiError';
import { uploadImageToCloudinary } from '../services/imageUpload';

interface MulterRequest extends Request {
   file: Express.Multer.File;
}

export const uploadImage = async (req: MulterRequest, res: Response, next: NextFunction) => {
   if (!req.file) {
      return res.status(400).send('No file uploaded.');
   }
   try {
      const fileName = req.file.originalname;
      const fileBuffer = req.file.buffer;
      const imageUrl = await uploadImageToCloudinary(fileBuffer, fileName);
      res.json({ imageUrl });
   } catch (error : any) {
      next(new InternalServerError(error));
   }
};