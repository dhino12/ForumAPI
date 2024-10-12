const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'THREAD_ADD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan title dan body'),
  'THREAD_ADD_USECASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan title dan body'),
  'THREAD_ADD_USECASE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('harus mengirimkan title dan body'),
  'THREAD_ADD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('harus mengirimkan title dan body'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'COMMENT_USECASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan content dan thread yang dikomentari'),
  'COMMENT_USECASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('Harus menggunakan huruf / string untuk mengirimkan komentar'),
  'COMMENT_DELETE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('Harus mengirimkan commentId, userId, threadId'),
  'COMMENT_DELETE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('Harus mengirimkan commentId, userId, threadId dalam bentuk string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
};

module.exports = DomainErrorTranslator;
