import * as actionTypes from '../constants/index';
const setFormData = (data) => {
    return {
        type: actionTypes.SET_FORMDATA,
        data
    }
};
export { setFormData };
