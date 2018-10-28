//==================
//puesto
//==================

process.env.PORT = process.env.PORT || 3000;


//======================
// Entorno
// =================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//======================    
// BD
// =================


let urlBD;

if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/caffe';
} else {
    urlBD = process.env.MONGO_URI;
}

process.env.URLDB = urlBD;