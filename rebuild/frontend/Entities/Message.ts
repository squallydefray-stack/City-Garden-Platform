{
  "name": "Message",
  "type": "object",
  "properties": {
    "garden": {
      "type": "string",
      "description": "Garden ID reference"
    },
    "sender": {
      "type": "string",
      "description": "Sender user ID"
    },
    "sender_name": {
      "type": "string"
    },
    "recipient": {
      "type": "string",
      "description": "Recipient user ID (null for garden-wide)"
    },
    "message_text": {
      "type": "string"
    },
    "is_announcement": {
      "type": "boolean",
      "default": false
    }
  },
  "required": [
    "garden",
    "message_text"
  ]
}