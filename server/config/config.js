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
    //urlBD = 'mongodb://localhost:27017/caffe';
    urlBD = 'mongodb://user_addmi:Escuela1234@ds127362.mlab.com:27362/cafe';
} else {
    //urlBD = process.env.MONGO_URI;
    urlBD = 'mongodb://user_addmi:Escuela1234@ds127362.mlab.com:27362/cafe';
}

process.env.URLDB = urlBD;



//======================    
// Vencimiento de token
// =================

process.env.CADUCIDAD_TOKEN = '48h';

//======================    
// SEED de atutenticación
// =================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desaroollo';


//======================    
// Google client ID
// =================

process.env.CLIENT_ID = process.env.CLIENT_ID || '801416252925-dv6u379k7vo5eimqtaue110f2gedugo4.apps.googleusercontent.com';