import {
    SET_ACCESS_CAPTCHA,
    SET_STATE_ACCESS
} from "@ReduxSrc/CaptchaAccess/constants";

export const setAccessCaptcha = datos => ({ 
    type: SET_ACCESS_CAPTCHA,
    payload: datos
});

export const setStateAccess = datos => ({ 
    type: SET_STATE_ACCESS,
    payload: datos
});