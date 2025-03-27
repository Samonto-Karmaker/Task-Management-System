export default function CreateUserForm() {
    return (
        <div>
        <h1>Create User</h1>
        <form>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" />
            <button type="submit">Create User</button>
        </form>
        </div>
    );
}