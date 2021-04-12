const generateMessage = (text)=>{
    console.log(text.username);
    return {
        username:text.username,
        text:text.message,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (url)=>{
    return {
        username:url.username,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}