export const templateWall = () => {
    const containerWall = document.createElement("div");
    const contentWall = `
<div class="container wall">
    <div class="wall-content">
        <header id="header">
            <input id="search" placeholder="Búsqueda">
        </header>
        <div id="teams">
            <div id="yourTeam"></div>
            <header>
                <h3>Tus Equipos</h3>
                <button id="createTeam" class="btn">Crear Equipo</button>
            </header>
            <div class="containerTeam" id="containerTeam">
        </div>
        <div id="matches">
            <div id="nextMatches"></div>
            <header>
                <h3>Tus Partidos</h3>
                <button id="createMatch" class="btn">Crear Partido</button>
            </header>
            <div class="match-content" id="match-content">
        </div>
    </div>
</div>
<!-- TeamModal -->
<div id="createTeamModal" class="modal">

  <!-- Modal content -->
  <div class="modal-content">
    <span id="createTeamClose" class="close">&times;</span>
    <table>
        <tr>
            <td><p>Nombre Equipo</p></td>
            <td><input type="text" id="teamName" placeholder="..."></td>
        </tr>
        <tr>
            <td><p>Jugadores</p></td>
            <td>
            <select id="teamType">
            <option value="Mixto">Mixto</option>
            <option value="Femenino">Femenino</option>
            <option value="Masculino">Masculino</option>
        </select>
            </td>
            <td><input type="text" id="teamPhoto" placeholder="url..."></td>
        </tr>
    </table>
    <button id="saveTeam">Crear Equipo</button>
  </div>

</div>

<!-- MatchModal -->
<div id="createMatchModal" class="modal">

  <!-- Modal content -->
  <div class="modal-content">
    <span id="createMatchClose" class="close">&times;</span>
    <p>Some text in the Modal..</p>
  </div>

</div>
`

//Imprimir contenido en el container
containerWall.innerHTML = contentWall;


// Get the modal
let createTeamModal = containerWall.querySelector("#createTeamModal");
// Get the <span> element that closes the modal
let createMatchClose = containerWall.querySelector("#createTeamClose");
//hacer click en el enlace "Crear Equipo" abre modal con formulario
const btnCreateTeam = containerWall.querySelector("#createTeam");
btnCreateTeam.addEventListener("click", () => {
    createTeamModal.style.display = "block";
})
// When the user clicks on <span> (x), close the modal
createMatchClose.addEventListener("click", () => {
    createTeamModal.style.display = "none";
})
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == createTeamModal) {
        createTeamModal.style.display = "none";
    }
}

//cuando cargue el usuario actual, si tiene equipos, mostrarlos
//const containerTeam = document.createElement("div");
const containerTeam = containerWall.querySelector("#containerTeam");

//containerTeam.innerHTML = contentTeam;

let user = firebase.auth().currentUser;
if (user != null) {//mostrar divs de los equipos del usuario actual
    
    firebase.firestore().collection("Users").doc(user.uid).collection("teams").get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
        console.log(doc.id, " => ", doc.data());//imprimir equipos del usuario actual en consola
        // doc.data() is never undefined for query doc snapshots
        const contentTeam = document.createElement("div");
        contentTeam.innerHTML = `
            <div class="team-content" id="team-content">
                <div class="team-photo"><a href="${doc.data().photo}</div>
                <p class="team-type">${doc.data().teamType}</p>
                <h4 class="team-name">${doc.data().teamName}</h4>
                <p class="team-info">${doc.data().info}</p>
                <p class="team-members">${doc.data().members}</p>
            </div>
            `
        containerTeam.appendChild(contentTeam);

        //let textNode = document.createTextNode("Nombre del Equipo: "+doc.data().teamName+", Tipo: "+ doc.data().teamType+ ", Miembros: "+ doc.data().members);
        //contentTeam.appendChild(textNode);
        //contentTeam.appendChild(document.createElement("br"));
        
        });
    });
    containerWall.querySelector("#containerTeam");
}


//cuando presione "btnCreateTeam" guarda el equipo en el array teams del database del usuario actual
//mejoras:
//---detectar cuando hay un equipo con el mismo nombre antes de crear
const btnsaveTeam = containerWall.querySelector("#saveTeam");
btnsaveTeam.addEventListener("click", () => {
    let user = firebase.auth().currentUser;//Obtén el usuario con sesión activa

    if (user != null) { //añade una sub collección al usuario
        firebase.firestore().collection("Users").doc(user.uid).collection("teams").add({
            teamName: containerWall.querySelector("#teamName").value,
            teamType: containerWall.querySelector("#teamType").value,
            members: 0,
            photo: ""
        });
        //imprimir equipos del usuario cuando ya creó equipo nuevo
        firebase.firestore().collection("Users").doc(user.uid).collection("teams").get()
        .then(function(querySnapshot) {
            containerTeam.innerHTML = "";//borra para que no se acumulen
            querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            const contentTeam = document.createElement("div");
            contentTeam.innerHTML = `
                <div class="team-content" id="team-content">
                    <div class="team-photo"><a href="${doc.data().photo}</div>
                    <p class="team-type">${doc.data().teamType}</p>
                    <h4 class="team-name">${doc.data().teamName}</h4>
                    <p class="team-info">${doc.data().info}</p>
                    <p class="team-members">${doc.data().members}</p>
                </div>
                `
            containerTeam.appendChild(contentTeam);

            //let textNode = document.createTextNode("Nombre del Equipo: "+doc.data().teamName+", Tipo: "+ doc.data().teamType+ ", Miembros: "+ doc.data().members);
            //contentTeam.appendChild(textNode);
            //contentTeam.appendChild(document.createElement("br"));
            });
        });
        //containerTeam.appendChild(contentTeam);
    }
    createTeamModal.style.display = "none";
})



return containerWall;
}