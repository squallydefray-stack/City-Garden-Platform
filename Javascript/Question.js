// JavaScript Example: Reading Entities
// Filterable fields: garden, city, title, content, visibility, category
async function fetchResourceEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/6978d279311c338a4846cd15/entities/Resource`, {
        headers: {
            'api_key': '67842a749e4b495ea15bbb07ee621eec', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: garden, city, title, content, visibility, category
async function updateResourceEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/6978d279311c338a4846cd15/entities/Resource/${entityId}`, {
        method: 'PUT',
        headers: {
            'api_key': '67842a749e4b495ea15bbb07ee621eec', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    console.log(data);
}