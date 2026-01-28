{
  "name": "MemberInvite",
  "type": "object",
  "properties": {
    "garden": {
      "type": "string",
      "description": "Garden ID"
    },
    "garden_name": {
      "type": "string"
    },
    "email": {
      "type": "string"
    },
    "invited_by": {
      "type": "string"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "accepted",
        "expired"
      ],
      "default": "pending"
    },
    "role": {
      "type": "string",
      "enum": [
        "member",
        "organizer"
      ],
      "default": "member"
    }
  },
  "required": [
    "garden",
    "email"
  ]
}