{
  "name": "Question",
  "type": "object",
  "properties": {
    "garden": {
      "type": "string",
      "description": "Garden ID reference"
    },
    "question": {
      "type": "string"
    },
    "author_name": {
      "type": "string"
    },
    "is_resolved": {
      "type": "boolean",
      "default": false
    },
    "category": {
      "type": "string",
      "enum": [
        "general",
        "plants",
        "pests",
        "tools",
        "events"
      ],
      "default": "general"
    }
  },
  "required": [
    "garden",
    "question"
  ]
}