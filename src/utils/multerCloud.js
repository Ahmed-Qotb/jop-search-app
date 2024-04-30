import multer, { diskStorage } from "multer";

export function uploadFileCloud() {
  const storage = diskStorage({});
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("must be pdf"), false);
    }
  };

  const multerUpload = multer({ storage, fileFilter });

  return multerUpload;
}