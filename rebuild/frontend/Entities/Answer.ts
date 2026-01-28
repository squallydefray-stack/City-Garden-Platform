{
  "name": "Answer",
  "type": "object",
  "properties": {
    "question": {
      "type": "string",
      "description": "Question ID reference"
    },
    "answer": {
      "type": "string"
    },
    "author_name": {
      "type": "string"
    },
    "is_accepted": {
      "type": "boolean",
      "default": false
    }
  },
  "required": [
    "question",
    "answer"
  ]
}