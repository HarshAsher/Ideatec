//Vars
const user_name = JSON.parse(document.getElementById('user_name').textContent);
const sub_id = JSON.parse(document.getElementById('sub_id').textContent);
const per_page = JSON.parse(document.getElementById('per_page').textContent);
const dictPageObjects = {};
const elCarousel = document.getElementsByClassName("carousel-inner")[0];
const popup = document.getElementById("no-internet-popup");
var socket_data = null;
var boolFirstUpdate = true;
var dtCurrentTime = null;
// var colors = ["black", "white"];
var currentColorIndex = 0;
var updateInterval = setInterval(function () {}, 60000);

function fWait(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

let currentTheme = 'default';

function toggleTheme()
{
    const body = document.body;
    if(currentTheme==='default')
        {
            currentTheme='alternate';
        }
        else
        {
            currentTheme='default';
        }
    console.log(socket_data.data);
    for(let i of Object.keys(socket_data.data)){
        fChangeColor(i, socket_data.data[i]);
    }
}

function fChangeColor(id,data) {
    
    

    try{
        const body = document.body;
        if(currentTheme==='default')
        {
            body.style.backgroundColor = "var(--color-black)";
            document.getElementById("card-status-value-"+id).innerHTML = data.status;
            document.getElementById("card-online-time-value-"+id).innerHTML = "for " + fSecondsToHm(data.runDuration*60);
            document.getElementById("card-runtime-value-"+id).innerHTML = fSecondsToHm((new Date().getTime()/1000) - data.lastDataReceived);
            document.getElementById("card-lastbackwash-value-"+id).innerHTML = moment(data.lastDataReceived*1000).format("DD-MM-YYYY h:mm:ss");
            // document.getElementById("card-lastbackwash-value-"+id).innerHTML = moment.utc((data.lastDataReceived)*1000).format("DD-MM-YYYY hh:mm:ss"); // support for pi devices
            document.getElementById("card-title-"+id).style.color = "var(--color-white)";
            document.getElementById("card-background-"+id).style.color = "var(--color-black)";
            document.getElementById("card-rof-"+id).style.display = "none";
            document.getElementById("card-rof-value-"+id).style.display = "none";
            document.getElementById("card-loh-"+id).style.display = "none";
            document.getElementById("card-loh-value-"+id).style.display = "none";
            document.getElementById("card-press1-"+id).style.display = "none";
            document.getElementById("card-press1-value-"+id).style.display = "none";
            document.getElementById("card-press2-"+id).style.display = "none";
            document.getElementById("card-press2-value-"+id).style.display = "none";
    
            if(data.status == ""){
    
                document.getElementById("card-"+id).style.backgroundColor = "var(--color-red-dark)";
                document.getElementById("card-background-"+id).style.backgroundColor = "var(--color-red-light)";
                document.getElementById("card-status-value-"+id).innerHTML = "Data not received";
    
            }
            else if(data.status == "Maintenance"){
    
                document.getElementById("card-"+id).style.backgroundColor = "var(--color-red-dark)";
                document.getElementById("card-background-"+id).style.backgroundColor = "var(--color-red-light)";
                document.getElementById("card-status-value-"+id).innerHTML = "Maintenance";
    
            }
            else if( data.status == "Filtration"){
    
                document.getElementById("card-"+id).style.backgroundColor = "var(--color-green-dark)";
                document.getElementById("card-background-"+id).style.backgroundColor = "var(--color-green-light)";
                document.getElementById("card-rof-"+id).style.display = "inline";
                document.getElementById("card-rof-value-"+id).innerHTML = data.rof.value + " m<sup>3</sup>/hr";
                document.getElementById("card-rof-value-"+id).style.display = "inline";
                document.getElementById("card-loh-"+id).style.display = "inline";
                document.getElementById("card-loh-value-"+id).innerHTML = data.loh.value + " %";
                document.getElementById("card-loh-value-"+id).style.display = "inline";
                document.getElementById("card-loh-value-"+id).style.color = "var(--color-white)";
    
                if(data.loh.value < 10){
                    document.getElementById("card-loh-value-"+id).style.backgroundColor = " var(--color-green-dark)";
                }
                else if(data.loh.value >= 10 && data.loh.value < 20){
                    document.getElementById("card-loh-value-"+id).style.backgroundColor = " var(--color-amber-dark)";
                }
                else {
                    document.getElementById("card-loh-value-"+id).style.backgroundColor = " var(--color-red-dark)";
                }
            }
            else if(data.status == "Backwash"){
                document.getElementById("card-"+id).style.backgroundColor = "var(--color-blue-dark)";
                document.getElementById("card-background-"+id).style.backgroundColor = "var(--color-blue-light)";
                document.getElementById("card-press1-"+id).style.display = "inline";
                document.getElementById("card-press1-value-"+id).innerHTML = data.press1.value + " bar";
                document.getElementById("card-press1-value-"+id).style.display = "inline";
                document.getElementById("card-press2-"+id).style.display = "inline";
                document.getElementById("card-press2-value-"+id).innerHTML = data.press2.value + " bar";
                document.getElementById("card-press2-value-"+id).style.display = "inline";
            }
            else if(data.status == "Idle"){
                document.getElementById("card-"+id).style.backgroundColor = "var(--color-amber-dark)";
                document.getElementById("card-background-"+id).style.backgroundColor = "var(--color-amber-light)";
            }
    }
    else 
    {
        body.style.backgroundColor = "var(--color-lightthemebg)";
        document.getElementById("card-status-value-"+id).innerHTML = data.status;
        document.getElementById("card-online-time-value-"+id).innerHTML = "for " + fSecondsToHm(data.runDuration*60);
        document.getElementById("card-runtime-value-"+id).innerHTML = fSecondsToHm((new Date().getTime()/1000) - data.lastDataReceived);
        document.getElementById("card-lastbackwash-value-"+id).innerHTML = moment(data.lastDataReceived*1000).format("DD-MM-YYYY h:mm:ss");
        // document.getElementById("card-lastbackwash-value-"+id).innerHTML = moment.utc((data.lastDataReceived)*1000).format("DD-MM-YYYY hh:mm:ss"); // support for pi devices
        document.getElementById("card-title-"+id).style.color = "var(--color-white)";
        document.getElementById("card-background-"+id).style.color = "var(--color-white)";
        document.getElementById("card-rof-"+id).style.display = "none";
        document.getElementById("card-rof-value-"+id).style.display = "none";
        document.getElementById("card-loh-"+id).style.display = "none";
        document.getElementById("card-loh-value-"+id).style.display = "none";
        document.getElementById("card-press1-"+id).style.display = "none";
        document.getElementById("card-press1-value-"+id).style.display = "none";
        document.getElementById("card-press2-"+id).style.display = "none";
        document.getElementById("card-press2-value-"+id).style.display = "none";

        if(data.status == ""){

            document.getElementById("card-"+id).style.backgroundColor = "var(--color-rd)";
            document.getElementById("card-background-"+id).style.backgroundColor = "var(--color-rl)";
            document.getElementById("card-status-value-"+id).innerHTML = "Data not received";

        }
        else if(data.status == "Maintenance"){

            document.getElementById("card-"+id).style.backgroundColor = "var(--color-red-dark)";
            document.getElementById("card-background-"+id).style.backgroundColor = "var(--color-red-light)";
            document.getElementById("card-status-value-"+id).innerHTML = "Maintenance";

        }
        else if( data.status == "Filtration"){

            document.getElementById("card-"+id).style.backgroundColor = "var(--color-black)";
            document.getElementById("card-background-"+id).style.backgroundColor = "var(--color-gd)";
            document.getElementById("card-rof-"+id).style.display = "inline";
            document.getElementById("card-rof-value-"+id).innerHTML = data.rof.value + " m<sup>3</sup>/hr";
            document.getElementById("card-rof-value-"+id).style.display = "inline";
            document.getElementById("card-loh-"+id).style.display = "inline";
            document.getElementById("card-loh-value-"+id).innerHTML = data.loh.value + " %";
            document.getElementById("card-loh-value-"+id).style.display = "inline";
            document.getElementById("card-loh-value-"+id).style.color = "var(--color-black)";

            if(data.loh.value < 10){
                document.getElementById("card-loh-value-"+id).style.backgroundColor = " var(--color-gl)";
            }
            else if(data.loh.value >= 10 && data.loh.value < 20){
                document.getElementById("card-loh-value-"+id).style.backgroundColor = " var(--color-amber-light)";
            }
            else {
                document.getElementById("card-loh-value-"+id).style.backgroundColor = " var(--color-red-light)";
            }
        }
        else if(data.status == "Backwash"){
            document.getElementById("card-"+id).style.backgroundColor = "var(--color-blue-dark)";
            document.getElementById("card-background-"+id).style.backgroundColor = "var(--color-blue-light)";
            document.getElementById("card-press1-"+id).style.display = "inline";
            document.getElementById("card-press1-value-"+id).innerHTML = data.press1.value + " bar";
            document.getElementById("card-press1-value-"+id).style.display = "inline";
            document.getElementById("card-press2-"+id).style.display = "inline";
            document.getElementById("card-press2-value-"+id).innerHTML = data.press2.value + " bar";
            document.getElementById("card-press2-value-"+id).style.display = "inline";
        }
        else if(data.status == "Idle"){
            document.getElementById("card-"+id).style.backgroundColor = "var(--color-orange-dark)";
            document.getElementById("card-background-"+id).style.backgroundColor = "var(--color-orange-light)";
        }
    }
        }
        
    catch (e){
        console.log(e);
    }
    /*document.body.style.backgroundColor = white;
    currentColorIndex = (currentColorIndex + 1) % colors.length;*/
 }

//Socket connection and handles
function fSocketConnect() {
    const Socket = new WebSocket('ws://' + window.location.host + '/ws/socketdjb/' + user_name + "/");
    Socket.onopen = function () {

        Socket.send(JSON.stringify({
            'message': "UPDATE",
            'sub_id': sub_id,
        }));
    }
    Socket.onmessage = function (e) {
        try{
            socket_data = JSON.parse(e.data);
  
            if(boolFirstUpdate == true &&  socket_data.type == "noInternet"){
                popup.style.display = 'block'; /* Show if hidden */
                setTimeout(() => popup.style.opacity = 1, 10); /* Fade in */
                fWait(20);
                Socket.send(JSON.stringify({
                    'message': "UPDATE",
                    'sub_id': sub_id,
                }));
            }
            else if(boolFirstUpdate == true &&  socket_data.type == "update"){
                console.log(socket_data);
                popup.style.opacity = 0; /* Fade out */
                setTimeout(() => popup.style.display = 'none', 500); /* Hide after fading */
                result_data = fSortObject(socket_data.data);
                // console.log(result_data);
                boolFirstUpdate = false;
                let count = 20;
                let order = -1;
                for(let i of Object.keys(result_data)){
                    if(count >= parseInt(per_page)){
                        order += 1;
                        dictPageObjects[order] = fCreatePage("live-page", order);
                        count = 0;
                    }
                    // console.log(i);
                    fCreateCard(i, result_data[i], order);
                    count += 1;
    
                }
                document.getElementsByClassName('carousel-item')[0].classList.add('active');
            }
            else if(boolFirstUpdate == false&&  socket_data.type == "update"){
                result_data = fSortObject(socket_data.data);
                for(let i of Object.keys(result_data)){
                    fUpdateReadings(i, result_data[i]);
                }
            }
        }
        catch (e){
            // console.log(e);
        }
        
    };
    Socket.onclose = function () {
        // console.error('socket closed unexpectedly. Reconnecting!');
        setTimeout(function () {
            fSocketConnect();
        }, 1000);
    };

    function data_update() {
        if(boolFirstUpdate == false){
            Socket.send(JSON.stringify({
                'message': "UPDATE",
                'sub_id': sub_id,
            }));

        }
    }

    clearInterval(updateInterval);
    var updateInterval = setInterval(data_update, 60000);
}


function fCreateElement(tag, attributes, text){
    let element =  document.createElement(tag);
    let att = null;
    for(let att_key in attributes){
        att = document.createAttribute(att_key);
        document.set
        att.value = attributes[att_key];
        element.setAttributeNode(att);
    }
    if(text != null){
        element.innerHTML = text;
    }
    return element;
}

function fCreateAttrib(element, id, name){
    att = document.createAttribute("id");
    att.value = name +"-"+id;
    element.setAttributeNode(att);
}

function fCreatePage(unique_page_name, page_id) {
    let elPage = fCreateElement("div", {"class":"carousel-item " + unique_page_name + page_id + " page-item"}, null)
    let elContainer = fCreateElement("div", {"class":"page-container"}, null);
    let elCreatedPage = null;
    if(unique_page_name == "live-page"){elCreatedPage = createBoxContainer(page_id);}
    else if(unique_page_name == "live-svg"){elCreatedPage = createSvg(page_id);}
    else {elCreatedPage = document.createElement("div");}
    elContainer.appendChild(elCreatedPage);
    elPage.appendChild(elContainer);
    elCarousel.appendChild(elPage)
    return elPage;
}

function fCreateCard(id, data, page_id) {

    let elInputCardContainer = document.getElementById("live-"+page_id);
    // <div class="background"></div>
    // <div class="status-rect"></div>
    // <h1 class="status-value">Backwash</h1>
    // <div class="runtime-value">2 hours 10 minutes</div>
    // <div class="last-backwash-value">14:12 24-04-2024</div>
    // <div class="rof-value">3.12 bar</div>
    // <div class="rof-value1">3.56 bar</div>
    // <div class="title">FILTER BED - 02</div>
    // <div class="status">STATUS</div>
    // <div class="rof">PRESSURE 1</div>
    // <div class="rof1">PRESSURE 2</div>
    // <div class="last-backwash">LAST BACKWASH</div>
    // <div class="runtime">RUN HOURS</div>

    let elCard = fCreateElement("div", {"class":"card-container inter-normal", 
                                                "id":"card-"+id}, null);

    let elTitle = fCreateElement("div", {"class":"card-title inter-bold", 
                                                "id":"card-title-"+id}, data.alias);
    elCard.appendChild(elTitle);    

    let elBackground = fCreateElement("div", {"class":"card-background", 
                                                "id":"card-background-"+id}, null);
    elCard.appendChild(elBackground);

    let elStatus = fCreateElement("div", {"class":"card-status", 
                                                "id":"card-status-"+id}, "STATUS");
    elBackground.appendChild(elStatus);

    let elStatusValue = fCreateElement("div", {"class":"card-status-value inter-bold", 
                                                "id":"card-status-value-"+id}, null); //DELETE VAL
    elBackground.appendChild(elStatusValue);

    let elOnlineTimeValue = fCreateElement("div", {"class":"card-online-time-value inter-italic", 
                                                "id":"card-online-time-value-"+id}, null); //DELETE VAL
    elBackground.appendChild(elOnlineTimeValue);

    let elRuntime = fCreateElement("div", {"class":"card-runtime", 
                                                "id":"card-runtime-"+id}, "LAST UPDATE");
    elBackground.appendChild(elRuntime);

    let elRuntimeValue = fCreateElement("div", {"class":"card-runtime-value", 
                                                "id":"card-runtime-value-"+id}, null);   //DELETE VAL

    elBackground.appendChild(elRuntimeValue);

    let elROF = fCreateElement("div", {"class":"card-rof", 
                                                "id":"card-rof-"+id}, "RATE OF FLOW");
    elBackground.appendChild(elROF);

    let elROFValue = fCreateElement("div", {"class":"card-rof-value", 
                                                "id":"card-rof-value-"+id}, null);    
    elBackground.appendChild(elROFValue);

    let elLOH = fCreateElement("div", {"class":"card-loh", 
                                                "id":"card-loh-"+id}, "LOSS OF HEAD");
    elBackground.appendChild(elLOH);

    let elLOHValue = fCreateElement("div", {"class":"card-loh-value", 
                                                "id":"card-loh-value-"+id}, null);                                               
    elBackground.appendChild(elLOHValue);

    let elPress1 = fCreateElement("div", {"class":"card-press1", 
                                                "id":"card-press1-"+id}, "PRESSURE 1");
    elBackground.appendChild(elPress1);

    let elPress1Value = fCreateElement("div", {"class":"card-press1-value", 
                                                "id":"card-press1-value-"+id},null);    
    elBackground.appendChild(elPress1Value);

    let elPress2 = fCreateElement("div", {"class":"card-press2", 
                                                "id":"card-press2-"+id}, "PRESSURE 2");
    elBackground.appendChild(elPress2);

    let elPress2Value = fCreateElement("div", {"class":"card-press2-value", 
                                                "id":"card-press2-value-"+id}, null);
    elBackground.appendChild(elPress2Value);

    let elLastBackwash = fCreateElement("div", {"class":"card-lastbackwash", 
                                                "id":"card-lastbackwash-"+id}, "READING TIME");
    elBackground.appendChild(elLastBackwash);

    let elLastBackwashValue = fCreateElement("div", {"class":"card-lastbackwash-value", 
                                                "id":"card-lastbackwash-value-"+id}, null);  
    elBackground.appendChild(elLastBackwashValue);

    elInputCardContainer.appendChild(elCard);
    fUpdateReadings(id, data);

}

function fSecondsToHm(d) {
    d = Number(d);
    if(d<=60){d = 60;}
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
    return hDisplay + mDisplay; 
}

function fSortObject(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
}

let cardStatuses = {};

function initializeCardStatuses() {
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        const cardId = card.id.split("-")[85]; // Assuming id is in the format "card-1", "card-2", etc.
        const statusElement = card.querySelector(".card-status-value"); // Adjust the selector based on your HTML structure
        if (statusElement) {
            const initialStatus = statusElement.innerHTML.trim();
            cardStatuses[cardId] = initialStatus;
        }
    });
}

window.onload = function() {
    document.querySelectorAll('.card').forEach(card => {
        const id = card.id.split('-')[85]; // Assuming the id is like 'card-1'
        const initialStatus = document.getElementById("card-status-value-" + id).innerText;
        cardStatuses[id] = initialStatus; // Initialize with the current status
    });
};

function fUpdateReadings(id, data){
    
    try {
        const card = document.getElementById("card-" + id);
        
        // Update the current card's status in the stored statuses
        const currentStatus = cardStatuses[id] || "";
        console.log(currentStatus);
        // Check if the status has changed
        if (data.status !== currentStatus) {
            
            card.classList.remove("glow-animation");

            // Apply the glow animation
            card.classList.add("glow-animation");

            // Update the stored status to the new status
            cardStatuses[id] = data.status;

            // Remove the glow effect after 2 seconds
            setTimeout(() => {
                card.classList.remove("glow-animation");
            }, 5000); // Match this to the duration of the CSS animation
        }
        

        // Updating card data with received data
        document.getElementById("card-status-value-" + id).innerHTML = data.status;
        document.getElementById("card-online-time-value-" + id).innerHTML = "for " + data.runDuration + " minutes";
        document.getElementById("card-runtime-value-" + id).innerHTML = data.runtime;
        document.getElementById("card-lastbackwash-value-" + id).innerHTML = data.lastBackwash;

    } catch (e) {
        console.log(e);
    }


    try{

        document.getElementById("card-status-value-"+id).innerHTML = data.status;
        document.getElementById("card-online-time-value-"+id).innerHTML = "for " + fSecondsToHm(data.runDuration*60);
        document.getElementById("card-runtime-value-"+id).innerHTML = fSecondsToHm((new Date().getTime()/1000) - data.lastDataReceived);
        document.getElementById("card-lastbackwash-value-"+id).innerHTML = moment(data.lastDataReceived*1000).format("DD-MM-YYYY h:mm:ss");
        // document.getElementById("card-lastbackwash-value-"+id).innerHTML = moment.utc((data.lastDataReceived)*1000).format("DD-MM-YYYY hh:mm:ss"); // support for pi devices
        document.getElementById("card-title-"+id).style.color = "var(--color-white)";
        document.getElementById("card-background-"+id).style.color = "var(--color-black)";
        document.getElementById("card-rof-"+id).style.display = "none";
        document.getElementById("card-rof-value-"+id).style.display = "none";
        document.getElementById("card-loh-"+id).style.display = "none";
        document.getElementById("card-loh-value-"+id).style.display = "none";
        document.getElementById("card-press1-"+id).style.display = "none";
        document.getElementById("card-press1-value-"+id).style.display = "none";
        document.getElementById("card-press2-"+id).style.display = "none";
        document.getElementById("card-press2-value-"+id).style.display = "none";

        if(data.status == ""){

            document.getElementById("card-"+id).style.backgroundColor = "var(--color-red-dark)";
            document.getElementById("card-background-"+id).style.backgroundColor = "var(--color-red-light)";
            document.getElementById("card-status-value-"+id).innerHTML = "Data not received";

        }
        else if(data.status == "Maintenance"){

            document.getElementById("card-"+id).style.backgroundColor = "var(--color-red-dark)";
            document.getElementById("card-background-"+id).style.backgroundColor = "var(--color-red-light)";
            document.getElementById("card-status-value-"+id).innerHTML = "Maintenance";

        }
        else if( data.status == "Filtration"){

            document.getElementById("card-"+id).style.backgroundColor = "var(--color-green-dark)";
            document.getElementById("card-background-"+id).style.backgroundColor = "var(--color-green-light)";
            document.getElementById("card-rof-"+id).style.display = "inline";
            document.getElementById("card-rof-value-"+id).innerHTML = data.rof.value + " m<sup>3</sup>/hr";
            document.getElementById("card-rof-value-"+id).style.display = "inline";
            document.getElementById("card-loh-"+id).style.display = "inline";
            document.getElementById("card-loh-value-"+id).innerHTML = data.loh.value + " %";
            document.getElementById("card-loh-value-"+id).style.display = "inline";
            document.getElementById("card-loh-value-"+id).style.color = "var(--color-white)";

            if(data.loh.value < 10){
                document.getElementById("card-loh-value-"+id).style.backgroundColor = " var(--color-green-dark)";
            }
            else if(data.loh.value >= 10 && data.loh.value < 20){
                document.getElementById("card-loh-value-"+id).style.backgroundColor = " var(--color-amber-dark)";
            }
            else {
                document.getElementById("card-loh-value-"+id).style.backgroundColor = " var(--color-red-dark)";
            }
        }
        else if(data.status == "Backwash"){
            document.getElementById("card-"+id).style.backgroundColor = "var(--color-blue-dark)";
            document.getElementById("card-background-"+id).style.backgroundColor = "var(--color-blue-light)";
            document.getElementById("card-press1-"+id).style.display = "inline";
            document.getElementById("card-press1-value-"+id).innerHTML = data.press1.value + " bar";
            document.getElementById("card-press1-value-"+id).style.display = "inline";
            document.getElementById("card-press2-"+id).style.display = "inline";
            document.getElementById("card-press2-value-"+id).innerHTML = data.press2.value + " bar";
            document.getElementById("card-press2-value-"+id).style.display = "inline";
        }
        else if(data.status == "Idle"){
            document.getElementById("card-"+id).style.backgroundColor = "var(--color-amber-dark)";
            document.getElementById("card-background-"+id).style.backgroundColor = "var(--color-amber-light)";
        }
    }
    catch (e){
        console.log(e);
    }
    

}

/* Function to simulate status change and check for glow*/

function simulateStatusChange(cardId) {
    const statuses = ["Maintenance", "Filtration", "Backwash", "Idle"];
    let index = 0;

    // Function to cycle through statuses
    function changeStatus() {
        // Get the current status
        const currentStatus = statuses[index % statuses.length];
        
        // Create a mock data object with the new status
        const mockData = {
            status: currentStatus,
            runDuration: Math.floor(Math.random() * 1000), // Random duration for testing
            lastDataReceived: Math.floor(Date.now() / 1000), // Current timestamp
            rof: { value: Math.random() * 100 }, // Random ROF value
            loh: { value: Math.random() * 100 }, // Random LOH value
            press1: { value: Math.random() * 10 }, // Random pressure 1
            press2: { value: Math.random() * 10 }  // Random pressure 2
        };

        // Call the fUpdateReadings function with the mock data
        fUpdateReadings(cardId, mockData);

        // Increment the index to cycle through statuses
        index++;

        // Repeat the change every 3 seconds
        setTimeout(changeStatus, 7000);
    }

    // Start the status change simulation
    changeStatus();
}

// To use this function, call it with the ID of the card you want to test
// Example: simulateStatusChange('1');




function fUpdateSVGCard(){}

function fCreateSVGCard(id, pressure1, pressure2, LOH, ROF){
    let elSVGCardContainer = document.getElementById(id);
    let elSVG =  fCreateElement("object", {"type":"image/svg+xml", "id": "svg-"+id, "class":"svg-element", "data":svg_url}, null);
    elSVG.addEventListener("load",function(){
        var svgDoc = elSVG.contentDocument;
        let elPressure1 = svgDoc.getElementsByClassName('svg-pressure1-text')[0];
        fCreateAttrib(elPressure1, id, 'svg-pressure1-text');
        elPressure1.innerHTML = pressure1;
        let elPressure2 = svgDoc.getElementsByClassName('svg-pressure2-text')[0];
        fCreateAttrib(elPressure2, id, 'svg-pressure2-text');
        elPressure2.innerHTML = pressure2;
        let elLOH = svgDoc.getElementsByClassName('svg-loh-text')[0];
        fCreateAttrib(elLOH, id, 'svg-loh-text');
        elLOH.innerHTML = LOH;
        let elROF = svgDoc.getElementsByClassName('svg-rof-text')[0];
        fCreateAttrib(elROF, id, 'svg-rof-text');
        elROF.innerHTML = ROF;
    }, false);
    elSVGCardContainer.appendChild(elSVG);

}

function createSvg(id){
    let elBox = fCreateElement("div", {"class":"box-container data-box-container"}, null);
    let elSVGBox = fCreateElement("div", {"class":"box-container svg-box-container","id":"live-svg-"+id}, null);
    elBox.appendChild(elSVGBox);
    return elBox;
}


function createBoxContainer(page_id){
    let elBox = fCreateElement("div", {"class":"data-box-container"}, null);

    let elInputBox = fCreateElement("div", {"class":"box-container",
                                            "id":"live-"+page_id}, null);

    elBox.appendChild(elInputBox);
    return elBox;
}






fSocketConnect();