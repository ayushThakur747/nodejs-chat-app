const socket = io();

//target html elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('input');
const $messageFormButton = document.querySelector('button');
const $LocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//options
const {username, room} = Qs.parse(location.search,{ignoreQueryPrefix: true})

//message templates
const messageTemplate = document.querySelector('#message-template').innerHTML;

socket.on('message',(message)=>{//message event listner
    console.log(message);
    const html = Mustache.render(messageTemplate,{//to put all the messages on the screen
        username:message.username,
        message:message.text,
        createdAt: moment(message.createdAt).format('h:mm a') //formating time with the help of moment lib take a look at moment doc
    }) 
    $messages.insertAdjacentHTML('beforeend',html);
})
//location message templates
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
socket.on('locationMessage',(locationMessage)=>{//location message event listner
    const html = Mustache.render(locationMessageTemplate,{//to put all the messages on the screen
        username:locationMessage.username,
        url:locationMessage.locationURL,
        createdAt: moment(locationMessage.createdAt).format('h:mm a')
    }) 
    $messages.insertAdjacentHTML('beforeend',html);
})
//side bar template
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;
socket.on('roomData',({room, users})=>{
    
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    }) 
    document.querySelector('#sidebar').innerHTML = html;
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    $messageFormButton.setAttribute('disabled','disabled')//dissable button

    const message = e.target.elements.message.value;//another method to do this document.querySelector('input').value; 
    socket.emit('sendMessage',message,(error)=>{
        $messageFormButton.removeAttribute('disabled') //enable
        $messageFormInput.value = '' //clear form
        $messageFormInput.focus();
        if(error){
            return console.log(error);
        }
        console.log('delivered!') //acknoledgement msg
    });
})

const locationBtn = document.querySelector('#send-location');
locationBtn.addEventListener('click',()=>{ //navigator.geolocation will help us to take live location of the user
    $LocationButton.setAttribute('disabled','disabled')//dissable button
    if(!navigator.geolocation){ 
        return alert('your browser not support geolocation')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position);
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            $LocationButton.removeAttribute('disabled')
            console.log('location shared!')
        })
    })
    
})
socket.emit('join',{username,room},(error)=>{
    
    if(error){
        alert(error);
        location.href = '/'
    }
})  
