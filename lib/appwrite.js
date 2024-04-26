import { Client, Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.waleedsy.aora",
    projectId: "662b8279affdf200de08",
    databaseId: "662b845ad764d4df441d",
    userCollectionId: "662b8482efe421fac0d3",
    videoCollectionId: "662b8595534dc89e7b1f",
    storageId: "662b879d9d3884a3e6b7"
}

// Init your react-native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
// ;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register User
export const createUser = async (email, password, username) => {
try {
    const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
    )

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username)

    await signIn(email, password)

    const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        {
            accountId: newAccount.$id,
            email,
            username,
            avatar: avatarUrl
        }
    )

    return newUser

} catch (error) {
    console.log(error)
   throw new Error(error) 
}

// account.create(ID.unique(), 'me@example.com', 'password', 'Jane Doe')
//     .then(function (response) {
//         console.log(response);
//     }, function (error) {
//         console.log(error);
//     });
}

export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailSession(email, password)

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
try {
    const currentAccount = await account.get()

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('accountId', currentAccount.$id)]
    )

    if (!currentUser) throw Error;

    return currentUser.documents[0];

} catch (error) {
    console.log(error)
}
}