module.exports = {
    style: {
        backgroundColor: "#121212",
        iconColor: "gray",
        textColor: "white",
        borderColor: "#333",
        shadowColor: "black",
        backgroundCard: "#12121212",
        backgroundNotification: "#262626"
    },

    serverAddress: "https://zentrox-app-backend.onrender.com",

    api: {
        checkUser: "https://zentrox-app-backend.onrender.com/api/checkUser",
        getId: "https://zentrox-app-backend.onrender.com/api/auth/id",
        verifyToken: "https://zentrox-app-backend.onrender.com/api/auth/verify",
        login: "https://zentrox-app-backend.onrender.com/api/auth/login",
        register: "https://zentrox-app-backend.onrender.com/api/auth/register",

        getPostS: "https://zentrox-app-backend.onrender.com/api/post/special",
        getAPost: "https://zentrox-app-backend.onrender.com/api/post/get",
        explore: "https://zentrox-app-backend.onrender.com/api/explore/posts",
        uploadPost: "https://zentrox-app-backend.onrender.com/api/post/upload",
        like: "https://zentrox-app-backend.onrender.com/api/post/like",

        checkPremium: "https://zentrox-app-backend.onrender.com/api/auth/premium",

        getComments: "https://zentrox-app-backend.onrender.com/api/post/comment",
        uploadComment: "https://zentrox-app-backend.onrender.com/api/post/comment/upload",
        deleteComment: "https://zentrox-app-backend.onrender.com/api/post/comment/delete",

        getProfile: "https://zentrox-app-backend.onrender.com/api/dashboard/profile",
        openUserProfileGet: "https://zentrox-app-backend.onrender.com/api/post/open",
        changeName: "https://zentrox-app-backend.onrender.com/api/dashboard/change/name",
        deleteAcount: "https://zentrox-app-backend.onrender.com/api/dashboard/delete",
        getSelfePost: "https://zentrox-app-backend.onrender.com/api/dashboard/posts",

        searchTheUsers: "https://zentrox-app-backend.onrender.com/api/search/users",
        searchThePosts: "https://zentrox-app-backend.onrender.com/api/search/posts",
        searchThePostsJustWithTilte: "https://zentrox-app-backend.onrender.com/api/search/posts/title",

        adminGetUsers: "https://zentrox-app-backend.onrender.com/api/admin/getUsers",
        adminGetPosts: "https://zentrox-app-backend.onrender.com/api/admin/getPosts",
        adminDeleteUser: "https://zentrox-app-backend.onrender.com/api/admin/deleteUser",
        adminEditPost: "https://zentrox-app-backend.onrender.com/api/admin/editPost",
        adminEditUser: "https://zentrox-app-backend.onrender.com/api/admin/editUser",
        adminHidePost: "https://zentrox-app-backend.onrender.com/api/admin/hide",

        getNotifications: "https://zentrox-app-backend.onrender.com/api/notification/get",
        sendNotification: "https://zentrox-app-backend.onrender.com/api/notification/send",

        openDm: "https://zentrox-app-backend.onrender.com/api/chat/openDm",
        getConversations: "https://zentrox-app-backend.onrender.com/api/chat/conversations",
        sendFriendRequest: "https://zentrox-app-backend.onrender.com/api/chat/friendRequest",
        acceptFriendRequest: "https://zentrox-app-backend.onrender.com/api/chat/acceptRequest",
        getFriendRequestList: "https://zentrox-app-backend.onrender.com/api/chat/FriendRequestList"
    }
};