

var listChannels = new Vue({
            // My div elsement
            el: '#listChannels',
            data: {
                // The messages
                channels: [
                { id_channel: 1 , id_type: 1 , position: 5, name: "Channel name", description: "Channel description", user_id: 1 },
                { id_channel: 1 , id_type: 1 , position: 5, name: "Channel name", description: "Channel description", user_id: 1 }
                ]
            }
        })

var listPrivate = new Vue({
            // My div elsement
            el: '#listPrivate',
            data: {
                // The messages
                channels: [
                { id_channel: 1 , id_type: 1 , position: 5, name: "Channel name", description: "Channel description", user_id: 1 },
                { id_channel: 1 , id_type: 1 , position: 5, name: "Channel name", description: "Channel description", user_id: 1 }
                ]
            }
        })

var listUsersInChannels = new Vue({
            // My div elsement
            el: '#listUsersInChannels',
            data: {
                // The messages
                users: [
                { id_relation: , id_user: , id_channel:  }
                ]
            }
        })