import multer from 'multer';

const storage = multer.diskStorage({}); // We'll let Cloudinary handle storage
const upload = multer({ storage });
export default upload;
