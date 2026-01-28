{
  "name": "Tool",
  "type": "object",
  "properties": {
    "garden": {
      "type": "string",
      "description": "Garden ID reference"
    },
    "name": {
      "type": "string",
      "description": "Tool name"
    },
    "status": {
      "type": "string",
      "enum": [
        "available",
        "in_use",
        "maintenance"
      ],
      "default": "available"
    },
    "location": {
      "type": "string",
      "description": "Where the tool is stored"
    },
    "tracking_type": {
      "type": "string",
      "enum": [
        "manual",
        "qr",
        "nfc"
      ],
      "default": "manual"
    },
    "current_user": {
      "type": "string",
      "description": "User currently using the tool"
    },
    "description": {
      "type": "string"
    }
  },
  "required": [
    "garden",
    "name"
  ]
}