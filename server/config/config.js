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
    urlBD = 'mongodb://user_addmi:Escuela1234@ds127362.mlab.com:27362/cafe';
}

process.env.URLDB = urlBD;