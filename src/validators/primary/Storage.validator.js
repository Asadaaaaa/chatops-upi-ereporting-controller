class StorageValidator {
  store = {
    type: 'object',
    properties: {
      bot_token: {
        type: 'string',
        minLength: 1,
        nullable: false
      },
      file_id: {
        type: 'string',
        minLength: 1,
        nullable: false
      },
      file_name: {
        type: 'string',
        minLength: 1,
        nullable: false
      },
      mime_type: {
        type: 'string',
        minLength: 1,
        pattern: '^\\S+$',
        nullable: false
      }
    },
    required: [
      'bot_token',
      'file_id',
      'file_name',
      'mime_type'
    ],
    additionalProperties: false
  }
}

export default StorageValidator;
