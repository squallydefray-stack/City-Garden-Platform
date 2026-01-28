{
  "name": "Event",
  "type": "object",
  "properties": {
    "garden": {
      "type": "string",
      "description": "Garden ID (null for city-wide events)"
    },
    "city": {
      "type": "string",
      "description": "City ID for city-wide events"
    },
    "title": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "date": {
      "type": "string",
      "format": "date"
    },
    "time": {
      "type": "string",
      "description": "Event time"
    },
    "location": {
      "type": "string"
    },
    "is_public": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "title",
    "date"
  ]
}