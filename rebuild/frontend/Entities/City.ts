{
  "name": "City",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "City name"
    },
    "state": {
      "type": "string",
      "description": "State or province"
    },
    "region": {
      "type": "string",
      "description": "Region or area"
    },
    "is_active": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "name"
  ]
}