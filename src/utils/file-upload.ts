import { extname } from 'path';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
      return cb(null, uuid() + extname(file.originalname));
    },
  }),
};
