class User {
    constructor(id,email, password, profileImage, username, phoneNumber) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.profileImage = profileImage;
        this.username = username;
        this.phoneNumber = phoneNumber;

        this.isLoggedIn = false;
    }
}
export { User }