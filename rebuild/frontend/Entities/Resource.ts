{
  "name": "Resource",
  "type": "object",
  "properties": {
    "garden": {
      "type": "string",
      "description": "Garden ID (null for city-wide)"
    },
    "city": {
      "type": "string",
      "description": "City ID for city-wide resources"
    },
    "title": {
      "type": "string"
    },
    "content": {
      "type": "string"
    },
    "visibility": {
      "type": "string",
      "enum": [
        "public",
        "members"
      ],
      "default": "members"
    },
    "category": {
      "type": "string",
      "enum": [
        "guide",
        "event",
        "announcement",
        "tip"
      ],
      "default": "guide"
    }
  },
  "required": [
    "title",
    "content"
  ]
}