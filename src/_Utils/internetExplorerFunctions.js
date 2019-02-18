export const decodeBase64 = (s) => {
  var e = {}, i, b = 0, c, x, l = 0, a, r = '', w = String.fromCharCode, L = s.length;
  var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (i = 0; i < 64; i++) { e[A.charAt(i)] = i; }
  for (x = 0; x < L; x++) {
    c = e[s.charAt(x)]; b = (b << 6) + c; l += 6;
    while (l >= 8) { ((a = (b >>> (l -= 8)) & 0xff) || (x < (L - 2))) && (r += w(a)); }
  }
  return r;
};

export const exportPDFIE = (base64Cedulon, fileName) => {
  if (!base64Cedulon || base64Cedulon == '') return false;

  var data = base64Cedulon;
  var fileName = fileName + ".pdf";
  if (window.navigator && window.navigator.msSaveOrOpenBlob) { // IE workaround
    var byteCharacters = decodeBase64(data);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var blob = new Blob([byteArray], { type: 'application/pdf' });
    window.navigator.msSaveOrOpenBlob(blob, fileName);
  }
  else { // much easier if not IE
    window.open("data:application/pdf;base64, " + data, '', "height=600,width=800");
  }
}

export const esIE = () => {
  return /*@cc_on!@*/false || !!document.documentMode;
}