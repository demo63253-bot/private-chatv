const socket = io();
let typingTimer;

function enc(t){ return btoa(t); }
function dec(t){ return atob(t); }

function login(){
  socket.emit("auth", { password: pass.value });
}

socket.on("auth-success", ()=>{
  login.classList.add("hidden");
  chat.classList.remove("hidden");
  gsap.from("#chat",{scale:.9,opacity:0});
});

socket.on("auth-fail", ()=> alert("Wrong password"));

input.addEventListener("input", ()=>{
  socket.emit("typing");
});

socket.on("typing", ()=>{
  typing.classList.remove("hidden");
  clearTimeout(typingTimer);
  typingTimer = setTimeout(()=> typing.classList.add("hidden"), 2000);
});

function send(){
  if(!input.value) return;
  const id = Date.now().toString();
  add(input.value,"me",id,"✔");
  socket.emit("message",{ text: enc(input.value), id });
  input.value="";
}

socket.on("message",(d)=>{
  add(dec(d.text),"other",d.id,"✔✔");
  socket.emit("seen",d.id);
});

socket.on("delivered",(id)=>{
  document.getElementById(`tick-${id}`).innerText="✔✔";
});

socket.on("seen",(id)=>{
  const t=document.getElementById(`tick-${id}`);
  t.classList.add("seen");
});

function react(id,e){
  socket.emit("react",{id,emoji:e});
  document.getElementById(`react-${id}`).innerText=e;
}

socket.on("react",({id,emoji})=>{
  document.getElementById(`react-${id}`).innerText=emoji;
});

function add(text,type,id,tick){
  const d=document.createElement("div");
  d.className=`bubble ${type}`;
  d.innerHTML=`
    ${text}
    <span class="tick" id="tick-${id}">${tick}</span>
    <div class="reactions" id="react-${id}" onclick="pick('${id}')"></div>
  `;
  messages.appendChild(d);
  messages.scrollTop=messages.scrollHeight;
}

function pick(id){
  const e=prompt("❤️ 😂 😮 😢 🔥");
  if(e) react(id,e);
}
