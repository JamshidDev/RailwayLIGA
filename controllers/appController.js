import multer from "multer"
import path from 'path'
import { v4 as uuidv4 } from 'uuid'


const storeDB = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/photo');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4()
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
})

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Faqat rasm fayllari (jpeg, jpg, png, gif) ruxsat etiladi!'));
    }
}

const uploadConf = multer({
    storage: storeDB,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB chegara
    fileFilter: fileFilter
})

const uploadMiddleware = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).send(`Multer xatosi: ${err.message}`);
    } else if (err) {
        return res.status(400).send(`Xato: ${err.message}`);
    }
    next()
}

const uploadStore = (req, res) => {
    if (!req.file) {
        res.status(400).json({
            success:false,
            message: "Rasm yuklashda xato",
        })
    }
    res.status(200).json({
        success:false,
        data:req.file.filename,
    })
}


const upload =  uploadConf.single('image')






export const appController = {uploadMiddleware, upload, uploadStore}

