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

    serverAddress: "https://zentrox-app-backend.vercel.app",

    api: {
        checkUser: "https://zentrox-app-backend.vercel.app/api/checkUser",
        getId: "https://zentrox-app-backend.vercel.app/api/auth/id",
        verifyToken: "https://zentrox-app-backend.vercel.app/api/auth/verify",
        login: "https://zentrox-app-backend.vercel.app/api/auth/login",
        register: "https://zentrox-app-backend.vercel.app/api/auth/register",

        getPostS: "https://zentrox-app-backend.vercel.app/api/post/special",
        getAPost: "https://zentrox-app-backend.vercel.app/api/post/get",
        explore: "https://zentrox-app-backend.vercel.app/api/explore/posts",
        uploadPost: "https://zentrox-app-backend.vercel.app/api/post/upload",
        like: "https://zentrox-app-backend.vercel.app/api/post/like",

        checkPremium: "https://zentrox-app-backend.vercel.app/api/auth/premium",

        getComments: "https://zentrox-app-backend.vercel.app/api/post/comment",
        uploadComment: "https://zentrox-app-backend.vercel.app/api/post/comment/upload",
        deleteComment: "https://zentrox-app-backend.vercel.app/api/post/comment/delete",

        getProfile: "https://zentrox-app-backend.vercel.app/api/dashboard/profile",
        openUserProfileGet: "https://zentrox-app-backend.vercel.app/api/post/open",
        changeName: "https://zentrox-app-backend.vercel.app/api/dashboard/change/name",
        deleteAcount: "https://zentrox-app-backend.vercel.app/api/dashboard/delete",
        getSelfePost: "https://zentrox-app-backend.vercel.app/api/dashboard/posts",

        searchTheUsers: "https://zentrox-app-backend.vercel.app/api/search/users",
        searchThePosts: "https://zentrox-app-backend.vercel.app/api/search/posts",
        searchThePostsJustWithTilte: "https://zentrox-app-backend.vercel.app/api/search/posts/title",

        adminGetUsers: "https://zentrox-app-backend.vercel.app/api/admin/getUsers",
        adminGetPosts: "https://zentrox-app-backend.vercel.app/api/admin/getPosts",
        adminDeleteUser: "https://zentrox-app-backend.vercel.app/api/admin/deleteUser",
        adminEditPost: "https://zentrox-app-backend.vercel.app/api/admin/editPost",
        adminEditUser: "https://zentrox-app-backend.vercel.app/api/admin/editUser",
        adminHidePost: "https://zentrox-app-backend.vercel.app/api/admin/hide",

        getNotifications: "https://zentrox-app-backend.vercel.app/api/notification/get",
        sendNotification: "https://zentrox-app-backend.vercel.app/api/notification/send",

        openDm: "https://zentrox-app-backend.vercel.app/api/chat/openDm",
        getConversations: "https://zentrox-app-backend.vercel.app/api/chat/conversations",
        sendFriendRequest: "https://zentrox-app-backend.vercel.app/api/chat/friendRequest",
        acceptFriendRequest: "https://zentrox-app-backend.vercel.app/api/chat/acceptRequest",
        getFriendRequestList: "https://zentrox-app-backend.vercel.app/api/chat/FriendRequestList"
    }
};