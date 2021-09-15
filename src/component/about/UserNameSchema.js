export default {
    username: {
        presence: { allowEmpty: false, message: 'is required' },
        length: {
            maximum: 64
        }
    }
};
