const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const resumeStorage = multer.diskStorage({
  destination: 'uploads/resumes/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const resumeFilter = (req, file, cb) => {
  const allowed = /pdf|doc|docx/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) cb(null, true);
  else cb(new Error('Only PDF and DOC/DOCX files allowed.'));
};

module.exports = {
  upload: multer({ storage }),
  resumeUpload: multer({ storage: resumeStorage, fileFilter: resumeFilter, limits: { fileSize: 5 * 1024 * 1024 } }),
};
