/*eslint-disable no-undef*/
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code
} else {
    _webpack_public_path_ = window.Config.BASE_URL + "/"; 
}
/*eslint-enable no-undef*/