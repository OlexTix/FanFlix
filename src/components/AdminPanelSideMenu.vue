<template>
    <div class="sidemenu">
        <div class="center">
            <router-link to="/"><img src="/images/nfanflix3.svg" alt="Fanflix Logo" class="logos"><br></router-link>
        </div>
        <div class="divider"></div>
        <div class="options">
            <div class="category">
                <div class="title">Users</div>
                <router-link to="/users" class="option">User list</router-link>
                <router-link to="/users/edit" class="option">Edit user</router-link>
                <router-link to="/users/register" class="option">Register user</router-link>
            </div>
            <div class="category">
                <div class="title">Cinemas</div>
                <router-link to="/cinemas" class="option">Cinema list</router-link>
                <router-link to="/cinemas/halls" class="option">Cinema halls</router-link>
                <router-link to="/cinemas/schedule" class="option">Repertoire</router-link>
            </div>
            <div class="category">
                <div class="title">Employees</div>
                <router-link to="/employees" class="option">Employee list</router-link>
                <router-link to="/employees/fire" class="option">Fire an employee</router-link>
                <router-link to="/employees/hire" class="option">Employ an employee</router-link>
            </div>
            <div class="category">
                <div class="title">Other</div>
                <router-link to="/about" class="option">Website info</router-link>
                <router-link to="/logs" class="option">Logs</router-link>
            </div>
        </div>
        <div class="divider"></div>
        <div class="options">
            <router-link to="/logout" class="option">Log out</router-link>
            <router-link to="/change-password" class="option">Change password</router-link>
        </div>
    </div>
</template>
  
<style>
.sidemenu {
    width: 250px;
}

.logo {
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.divider {
    height: 1px;
    background-color: black;
    margin: 10px 0;
}

.options {
    margin-bottom: 10px;
}

.category {
    margin-bottom: 10px;
}

.title {
    font-weight: bold;
}

.option {
    display: block;
    padding: 5px;
    color: black;
    text-decoration: none;
}

.option:hover {
    background-color: #ddd;
}

.sidemenu {
    filter: var(--color-logo);
    -webkit-filter: var(--color-logo);
}
</style>