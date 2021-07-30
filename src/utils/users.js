const users = []
//addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id,username,room})=>{
    
    //clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //validate the data
    if(!username || !room){
        return {
            error:"username and room are required"
        }
    }
    //check for existing array
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })
    //validate username
    if(existingUser){
        return {
            error: 'username is already used'
        };
    }
    //store user
    const user = {id,username,room};
    users.push(user);
    return {user};
}

const removeUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })
    if(index!==-1){
        return users.splice(index,1)[0];
    }
}
const getUser = (id)=>{
    const getuser = users.find((user)=>{
        user.id == id
    })
    if (!getuser) {
        return "user not found";
    }
    return { username: getuser.username, room: getuser.room };
}
const getUsersInRoom = (room)=>{
    roomName = room.trim().toLowerCase();
    const getUserInRoom = users.filter((temp) => {return temp.room === roomName});
    console.log("getuserInRoom*",getUsersInRoom);
    if (getUserInRoom) {
        return getUserInRoom;
    }
    return [];
}

module.exports = {
    addUser,
    getUser,
    getUsersInRoom,
    removeUser
}
// addUser({
//     id:22,
//     username:'aunty',
//     room:'mandideep'
// })
// console.log(users);
// const removedUser = removeUser(22);
// console.log("removed user",removedUser);
// console.log(users);



