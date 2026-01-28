{
  "name": "GardenJoinRequest",
  "type": "object",
  "properties": {
    "garden": {
      "type": "string",
      "description": "Garden ID"
    },
    "garden_name": {
      "type": "string"
    },
    "requester_name": {
      "type": "string"
    },
    "requester_email": {
      "type": "string"
    },
    "message": {
      "type": "string",
      "description": "Why they want to join"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "approved",
        "declined"
      ],
      "default": "pending"
    }
  },
  "required": [
    "garden",
    "requester_email"
  ]
}