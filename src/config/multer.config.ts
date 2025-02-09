import multer from "multer";

// Configuración de almacenamiento en memoria (puedes personalizar)
const storage = multer.memoryStorage();

export const upload = multer({ storage });
