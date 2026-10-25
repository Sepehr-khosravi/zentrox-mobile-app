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

    serverAddress: "zentrox-app-backend.onrender.com",

    api: {
        checkUser: "zentrox-app-backend.onrender.com/api/checkUser",
        getId: "zentrox-app-backend.onrender.com/api/auth/id",
        verifyToken: "zentrox-app-backend.onrender.com/api/auth/verify",
        login: "zentrox-app-backend.onrender.com/api/auth/login",
        register: "zentrox-app-backend.onrender.com/api/auth/register",

        getPostS: "zentrox-app-backend.onrender.com/api/post/special",
        getAPost: "zentrox-app-backend.onrender.com/api/post/get",
        explore: "zentrox-app-backend.onrender.com/api/explore/posts",
        uploadPost: "zentrox-app-backend.onrender.com/api/post/upload",
        like: "zentrox-app-backend.onrender.com/api/post/like",

        checkPremium: "zentrox-app-backend.onrender.com/api/auth/premium",

        getComments: "zentrox-app-backend.onrender.com/api/post/comment",
        uploadComment: "zentrox-app-backend.onrender.com/api/post/comment/upload",
        deleteComment: "zentrox-app-backend.onrender.com/api/post/comment/delete",

        getProfile: "zentrox-app-backend.onrender.com/api/dashboard/profile",
        openUserProfileGet: "zentrox-app-backend.onrender.com/api/post/open",
        changeName: "zentrox-app-backend.onrender.com/api/dashboard/change/name",
        deleteAcount: "zentrox-app-backend.onrender.com/api/dashboard/delete",
        getSelfePost: "zentrox-app-backend.onrender.com/api/dashboard/posts",

        searchTheUsers: "zentrox-app-backend.onrender.com/api/search/users",
        searchThePosts: "zentrox-app-backend.onrender.com/api/search/posts",
        searchThePostsJustWithTilte: "zentrox-app-backend.onrender.com/api/search/posts/title",

        adminGetUsers: "zentrox-app-backend.onrender.com/api/admin/getUsers",
        adminGetPosts: "zentrox-app-backend.onrender.com/api/admin/getPosts",
        adminDeleteUser: "zentrox-app-backend.onrender.com/api/admin/deleteUser",
        adminEditPost: "zentrox-app-backend.onrender.com/api/admin/editPost",
        adminEditUser: "zentrox-app-backend.onrender.com/api/admin/editUser",
        adminHidePost: "zentrox-app-backend.onrender.com/api/admin/hide",

        getNotifications: "zentrox-app-backend.onrender.com/api/notification/get",
        sendNotification: "zentrox-app-backend.onrender.com/api/notification/send",

        openDm: "zentrox-app-backend.onrender.com/api/chat/openDm",
        getConversations: "zentrox-app-backend.onrender.com/api/chat/conversations",
        sendFriendRequest: "zentrox-app-backend.onrender.com/api/chat/friendRequest",
        acceptFriendRequest: "zentrox-app-backend.onrender.com/api/chat/acceptRequest",
        getFriendRequestList: "zentrox-app-backend.onrender.com/api/chat/FriendRequestList"
    }
};