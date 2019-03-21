import {
  imageHombre0,
  imageHombre1,
  imageHombre2,
  imageHombre3,
  imageMujer0,
  imageMujer1,
  imageMujer2,
  imageMujer3
} from './defaultImagesBase64.js'

const metodos = {
  getUrlFotoMiniatura: (identificadorFotoPersonal, sexoMasculino) => {
    let urlFotoUsuario;
    if (identificadorFotoPersonal) {
      urlFotoUsuario = window.Config.URL_CORDOBA_FILES + "/Archivo/" + identificadorFotoPersonal + "/3";
    } else {
      if (sexoMasculino == undefined || sexoMasculino == true) {
        urlFotoUsuario = window.Config.URL_CORDOBA_FILES + "/Archivo/" + window.Config.IDENTIFICADOR_FOTO_DEFAULT_MALE + "/3";
      } else {
        urlFotoUsuario = window.Config.URL_CORDOBA_FILES + "/Archivo/" + window.Config.IDENTIFICADOR_FOTO_DEFAULT_FEMALE + "/3";
      }
    }

    return urlFotoUsuario;
  },
  getUrlFotoMediana: (identificadorFotoPersonal, sexoMasculino) => {
    let urlFotoUsuario;
    if (identificadorFotoPersonal) {
      urlFotoUsuario = window.Config.URL_CORDOBA_FILES + "/Archivo/" + identificadorFotoPersonal + "/2";
    } else {
      if (sexoMasculino == undefined || sexoMasculino == true) {
        urlFotoUsuario = window.Config.URL_CORDOBA_FILES + "/Archivo/" + window.Config.IDENTIFICADOR_FOTO_DEFAULT_MALE + "/3";
      } else {
        urlFotoUsuario = window.Config.URL_CORDOBA_FILES + "/Archivo/" + window.Config.IDENTIFICADOR_FOTO_DEFAULT_FEMALE + "/3";
      }
    }

    return urlFotoUsuario;
  },
  getUrlFotoGrande: (identificadorFotoPersonal, sexoMasculino) => {
    let urlFotoUsuario;
    if (identificadorFotoPersonal) {
      urlFotoUsuario = window.Config.URL_CORDOBA_FILES + "/Archivo/" + identificadorFotoPersonal + "/1";
    } else {
      if (sexoMasculino == undefined || sexoMasculino == true) {
        urlFotoUsuario = window.Config.URL_CORDOBA_FILES + "/Archivo/" + window.Config.IDENTIFICADOR_FOTO_DEFAULT_MALE + "/3";
      } else {
        urlFotoUsuario = window.Config.URL_CORDOBA_FILES + "/Archivo/" + window.Config.IDENTIFICADOR_FOTO_DEFAULT_FEMALE + "/3";
      }
    }

    return urlFotoUsuario;
  },
  getBase64Foto: (identificadorFotoPersonal, sexoMasculino, size) => {

    var promise = new Promise(function (resolve, reject) {
      let base64FotoUsuario;
      let tamano = 1;
      if (size)
        tamano = size;

      if (sexoMasculino == undefined || sexoMasculino == true) {
        switch (tamano) {
          case 0:
            base64FotoUsuario = imageHombre0;
            break;
          case 1:
            base64FotoUsuario = imageHombre1;
            break;
          case 2:
            base64FotoUsuario = imageHombre2;
            break;
          case 3:
            base64FotoUsuario = imageHombre3;
            break;
          default:
            base64FotoUsuario = imageHombre0;
            break;
        }
      } else {
        switch (tamano) {
          case 0:
            base64FotoUsuario = imageMujer0;
            break;
          case 1:
            base64FotoUsuario = imageMujer1;
            break;
          case 2:
            base64FotoUsuario = imageMujer2;
            break;
          case 3:
            base64FotoUsuario = imageMujer3;
            break;
          default:
            base64FotoUsuario = imageMujer0;
            break;
        }
      }
      
      if (identificadorFotoPersonal) {

        fetch("https://servicios2.cordoba.gov.ar/CordobaFilesApiBridge/Archivo/v2/Content?key=" + identificadorFotoPersonal + "&size=" + tamano, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          }
        })
          .then(data => data.json())
          .then(data => {
            if (data.ok != true) {
              reject(data.error);
              return;
            }

            resolve('data:image/png;base64,' + data.return.content);
          })
          .catch(error => {
            reject(base64FotoUsuario);
          });

      } else {
        resolve(base64FotoUsuario);
      }
    });

    return promise;
  }
};

export default metodos;