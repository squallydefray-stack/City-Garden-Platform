{
  "name": "ProduceRequest",
  "type": "object",
  "properties": {
    "garden": {
      "type": "string",
      "description": "Garden ID reference"
    },
    "requester_name": {
      "type": "string"
    },
    "requester_email": {
      "type": "string"
    },
    "message": {
      "type": "string"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "approved",
        "fulfilled",
        "declined"
      ],
      "default": "pending"
    }
  },
  "required": [
    "garden",
    "requester_name",
    "requester_email"
  ]
}