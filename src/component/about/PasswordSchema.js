export default {
    password: {
      presence: { allowEmpty: false, message: 'is required' },
      length: {
        maximum: 64
      }
    }
};
