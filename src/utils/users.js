const users =[]
// addUser, removeUser, getUser, getUsersInRoom
const addUser = ({id, username, room}) =>{
    // Clean the data
    username =  username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // vaidate the data
    if(!username || !room){
        return {
            error: 'Username and room are required!'
        }
    }

    // check for existing user
    const existingUser = users.find((user)=>{
        console.log("running");
        return user.room === room && user.username === username
    })

    //validate username

    if(existingUser){
        return {
            error: 'Username is Already in use!'
        }
    }

    //Store user
    const user = {id, username, room}
    users.push(user)
    return {user}
}


const reomveUser = (id) =>{
    const index = users.findIndex((user)=> user.id === id)

    if(index!=-1){
        return users.splice(index,1)[0]
    }
}

const getUser = ((id)=>{
    return  user = users.find((user)=> user.id === id);

});

const getUsersInRoom = (room)=>{
    room = room.trim().toLowerCase();
    const usersInRoom = users.filter((user)=>user.room === room);

    return usersInRoom;
}

module.exports = {
    addUser,
    reomveUser,getUser,
    getUsersInRoom
}