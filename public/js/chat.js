const socket = io();


// socket.on('countUpdated',(count)=>{
//     console.log("The count has been updated "+ count);
//     document.getElementById('count').innerHTML=count;
// })
// document.querySelector('#increment').addEventListener('click',()=>{
//     socket.emit('increment');
// })

//Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');
//Templates
const messageTemplae = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
const sideBarTemplate = document.querySelector('#sidebar-template').innerHTML;

//Options

const {username, room } = Qs.parse(location.search,{ignoreQueryPrefix:true})


const autoscroll = () =>{
    // new messgae element
    const $newMessage = $messages.lastElementChild

    // height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight = $messages.offsetHeight;

    // height of messages container
    const containerHeight = $messages.scrollHeight

    //how far have i scrolled?
    const scrollOffset = $messages.scrollTop+ visibleHeight


    if(containerHeight-newMessageHeight <= scrollOffset){
        console.log("running");
        $messages.scrollTop = $messages.scrollHeight // always scroll to the bottom
    }
}



socket.on('message',(message)=>{
    const html =  Mustache.render(messageTemplae,{
        username:message.username,
        message:message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html);
    autoscroll();

});


$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')
    //disable
    const message = e.target.elements.message.value;
    socket.emit('sendMessage',message, (error)=>{
        //enable
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value='';
        $messageFormInput.focus();
        if(error){
            return console.log(error);
        }

        console.log("message was delivered");
    });
});

socket.on('locationMessage',(locationMsg)=>{//listener for location mesasge
    const html =  Mustache.render(locationMessageTemplate,{
        username:locationMsg.username,
        url:locationMsg.url,
        createdAt:moment(locationMsg.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})


socket.on('roomData',({room,users})=>{
    const html = Mustache.render(sideBarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html

})


$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by user browser')
    }
    $sendLocationButton.setAttribute('disabled','disabled');
    navigator.geolocation.getCurrentPosition((position)=>{

        socket.emit('sendLocation',{
            lat:position.coords.latitude,
            long:position.coords.longitude
        },()=>{
            $sendLocationButton.removeAttribute('disabled');
            console.log("location shared");
        });
    })
})


socket.emit('join',{username, room},(error)=>{
    if (error){
        alert(error)
        location.href = '/';
    }
})