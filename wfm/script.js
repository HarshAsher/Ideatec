function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
    }
    }
}

function fScanWifi()
{
// var req = new XMLHttpRequest();
// req.open('GET', document.location, true);
// req.send(null);
// req.onload = function() {
//   var headers = req.getAllResponseHeaders().toLowerCase();
//   console.log(headers);
var headers = {"accept-ranges": "none", "connection": "close", "content-disposition": "inline",
               "filename":"wifimanager.html","content-length": "1585", "content-type": "text/html",
               "wifis": "itsipl5:-51,airtel_9894780016:-60,itsipl9:-62,itsipl 7:-69,dhil1508:-90,"
              };
console.log(headers);
}

document.addEventListener("DOMContentLoaded", function() {
    const ipCheckbox = document.getElementById('ip-checkbox');
    const gatewayCheckbox = document.getElementById('gateway-checkbox');
    const ipInput = document.getElementById('ipAddress');
    const gatewayInput = document.getElementById('gatewayAddress');
    
    // Function to toggle visibility
    function toggleInput(checkbox, input) {
        if (checkbox.checked) {
            input.style.display = 'block';
        } else {
            input.style.display = 'none';
        }
    }

    // Add event listeners to checkboxes
    ipCheckbox.addEventListener('change', function() {
        toggleInput(ipCheckbox, ipInput);
    });

    gatewayCheckbox.addEventListener('change', function() {
        toggleInput(gatewayCheckbox, gatewayInput);
    });
});


// Get references to the button and the dropdown list
const dropdownButton = document.getElementById('dropdownbutton');
const dropdownList = document.getElementById('dropdownlist');

// Add event listener to the button to toggle dropdown visibility
dropdownButton.addEventListener('click', function() {
dropdownList.classList.toggle('show');
});

// Add event listener to each list item in the dropdown
dropdownList.querySelectorAll('li').forEach(item => {
item.addEventListener('click', function() {
// Get the selected option value and text
const selectedValue = item.getAttribute('data-value');
const selectedText = item.textContent;

// Update the button text
dropdownButton.textContent = selectedText;

// Hide the dropdown
dropdownList.classList.remove('show');

// Perform any other actions based on the selected option value
// For example:
// handleSelectedOption(selectedValue);
});
});

// Close the dropdown if the user clicks outside of it
document.addEventListener('click', function(event) {
if (!dropdownButton.contains(event.target) && !dropdownList.contains(event.target)) {
dropdownList.classList.remove('show');
}
});

/*function updateSSID(networkName) {
    document.getElementById("ssid").value = networkName;
}*/

// Function to add click event listeners to list items
function initializeNetworkList() {
    var networkItems = document.querySelectorAll("#dropdownlist li");
    networkItems.forEach(function(item) {
        item.addEventListener("click", function() {
            // Call updateSSID with the clicked network's name
            updateSSID(item.innerText);
        });
    });
}

// Initialize the event listeners once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeNetworkList);



const networks = [
    { name: 'ITSIPL-5', signalStrength: -51 },
    { name: 'AIRTEL_9894780016', signalStrength: -60 },
    { name: 'ITSIPL-9', signalStrength: -62 },
    { name: 'ITSIPL-7', signalStrength: -69 },
    { name: 'DHIL1508', signalStrength: -90 }
];

function toggleDropdown() {
    const dropdown = document.getElementById("myDropdown");
    dropdown.style.display = (dropdown.style.display === "none" || dropdown.style.display === "") ? "block" : "none";
}

function hideDropdown() {
    const dropdown = document.getElementById("myDropdown");
    dropdown.style.display = "none";
}

function createDropdownItem(network) {

    const li = document.createElement("li");
    li.classList.add('wifi-item');
    li.setAttribute('data-fullname', network.name);

    // Truncate the network name if it's longer than 14 characters
    const truncatedName = network.name.length > 17 ? network.name.substring(0, 17) + '...' : network.name;

    // Create a span to hold the network name and apply CSS for truncation
    const nameSpan = document.createElement("span");
    nameSpan.textContent = truncatedName;
    nameSpan.classList.add('network-name');
    
    li.appendChild(nameSpan);

    // Create an image element for the signal strength icon
    const img = document.createElement("img");
    img.src = getSignalImage(network.signalStrength);
    img.alt = `${network.signalStrength} dBm`;
    img.classList.add('wifi-signal');
    li.appendChild(img);

    // Handle the click event to update the dropdown button
    li.addEventListener("click", function() {
        // Create a new image element for the dropdown button
        const fullName = li.getAttribute('data-fullname')
        const selectedImage = document.createElement("img");
        selectedImage.src = getSignalImage(network.signalStrength);
        selectedImage.alt = `${network.signalStrength} dBm`;
        selectedImage.classList.add('wifi-signal-selected'); // Add any additional classes for styling

        // Get the dropdown button element
        const dropdownButton = document.getElementById("dropdownbutton");
        dropdownButton.innerHTML = ''; // Clear existing content

        // Append the image
        dropdownButton.appendChild(selectedImage);

        const dropdownIcon = document.createElement("span");
        dropdownIcon.classList.add('dropdown-icon');
        dropdownIcon.innerHTML = '&#9660;'; // Unicode for the dropdown arrow
        
        
        // Append the truncated network name
        dropdownButton.append(` ${truncatedName}`);
        dropdownButton.appendChild(dropdownIcon);
        document.getElementById("ssid").value = fullName;

        // Update the selected network details
        document.getElementById("selectedNetworkName").textContent = network.name;
        document.getElementById("selectedNetworkImage").src = getSignalImage(network.signalStrength);

    
        hideDropdown();
    });

    return li;
}

function getSignalImage(signalStrength) {
    if (signalStrength <= -50 && signalStrength >= -60) {
        return "data:image/png;base64,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"; 
    } else if (signalStrength <= -61 && signalStrength >= -67) {
        return "data:image/png;base64,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"; 
    } else if (signalStrength <= -68 && signalStrength >= -75) {
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAABuoAAAbqAZ52fK4AAAeTSURBVHhe7d1fbJXlHcDxc06nqBGwE0gI8R8XE5E4UctCtljs0akjc5h4sTDCuDHZBSUuu1jWcIHJwsx2oaEade7CTWayxGy4hCEuLdTEMBSiCKLZRTs1G8xAkALK39O9b/YkXnh2eupaztv+Pp/kyfs8L+ecPGn7fntOe1JKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPz/yunIFFGr1a55qa+vZ1t/35LBwcFZ6XRLzJ8//8j9XdU3HqpWN1YqlY/SaWAi7Nq/b/0Vc2afz6YjRRr5nvK9ZXNgIgwdPryy3FapewEWYeR7y/eYzYHxNmfhgk+zQ92Lrygj7REYTyfPnLk1O9S96Io20l4piEo6MontPXjgwTQtvMm01wgEYAo4Nny8PU0LbzLtNQIBgMAEAAITAAhMACAwbwWeArYM9G9a0dnVnZYNze1+uDR9aUdajY8Tu94sHep9Lq0ay/bam+11XVrSYp4BQGACAIEJAAQmABCYAEBgAgCBCQAEJgAQmABAYAIAgQkABCYAEJgAQGACAIEJAExt92VjKBv5X2X+AgGAqe3pbFz/3+kXCQBMbc+mY10CAFPbY9nI//JX3b/+JQAQmABAYAIAgQkABCYAEJgAQGACAIEJAAQmABCYAEBgAgCBCQAEJgAQmABAYAIAgQkABCYAEJgAQGACAIEJAAQmABCYAEBgAgCB1f1b4ZGcPHPm1n3vH3zwk+Hh9nTqorv0kkvO3vq1BQOz2tu3lcvl8+l007YM9G9a0dnVnZYNze1+uDR9aUdajY8Tu94sHep9Lq0ay/bam+11XVrSYmED8OHhwyuX3t31m38eOHh5OtVy06ZfOfLrzS+8uPqBFauzENTS6VEJAF9WyJcAu9/dv/66efN+X6SLP3fmxMnyD7/34A++v3btwXQKJlS4ANRqtWvu7qpuGLlwIZ0pnj889dSNr+9769G0hAkTLgAv79zRc+LfH7elZWH9pGf9j9IUJky4AGzfsWNJmhba/t1/m5WmMGHCBWBoaHBSXFinjhwN+fMZLi5fZBCYAEBgAgCBCQAEFu6dgPeuWvnB9s0vXpuWDd320x+n2fgZ+vPW0rH3/p5Wo2rq8+OdgHxZngE0MK/zm+M+Lp89Oz06tJ4AQGACAIEJAAQmABCYAEBgAgCBCQAEJgAQmABAYAIAgQkABCYAEJgAQGACAIEJAAQmABCYAEBgAgCBCQAEJgAQmABAYAIAgQkABCYAEJgAQGACAIEJAAQmABCYAEBgAgCBNfX/z4+MjFTefv9gz/adA1179uy94fyFcy0LR/uMq07ftezOd5ZX73n+6pkzt6bTTbt31coPtm9+8dq0bOi7f3kpzcbP3sceL/3rtdfTalRNfX62DPRvWtHZ1Z2WDc3tfrg0fWlHWo2PE7veLB3qfS6tGsv22pvtdV1a0mKjfoGdOnu2o+uB+1/Z/UrfV9OpQqi0tZV+/sQTAz9bu/bb5XL5bDo9KgEQAD7X8Dt59p3/yptvW/xa0S7+XO3ChVJPd3fnL5588tV0ChijhgH41bPPvPyPA+9elpaFtP6RRzqPHj++PC2BMWgYgM0v/HZ8nytOgPyZwNa+v65JS2AMGgbgvb1vTU/TQtux87Vb0hQYg4YBOHf6TJoV27HhTwr9MgWKqmEAgKlNACAwAYDABAACG+2dZiPp2NCie6qlhzY+mlbjZ0PHt9KssRVrVn+45fnfXZeWDXknoHcC8jnPACAwAYDABAACEwAITAAgMAGAwAQAAhMACEwAIDABgMAEAAITAAhMACAwAYDABAACEwAITAAgMAGAwAQAAhMACEwAIDABgMAEAAITAAhMACAwAYDABAACEwAITAAgMAGAwAQA+J9GJsNYsWb1B9mxKfeuWpnftu7jFHA0ZctA/6bsUO/+hRtprxSEZwAQmABAYAIAgQkABNYwAJdcNi3Niq19xlWn03RUM2bMaPq2rdQ27dI0G137jJnH0rTwJtNeI2gYgJtuX3wiTQvtrmV3vpOmo6p2Lmv6tq10w9dvafpjf/vCRX9K08KbTHsN75fPPN2XHer+Oqcoo9LWNnL0+PHl2bwpH2e3LWf3yaaFHhue7M0/9k2bs3DBp9mh7mMVZaQ9MlmMjIxcef2imz/Lp0UdG3t7d2bHMVn/+OP5feo+XhHG3Jtu/Cz/2Gfzpg0dPryy3Fap+3hFGPne8j1mcyaTU2fPdnzjvurRbFr3E9uqkX/nzy/+7EJp/sVykt8nj0ARnwksXrbsaP4xz+Zjtmv/vvVXzJl9PpvWfexWjXxP+d6yOQVTTseGsgum8vb7B3u27xzo2rNn7w3nL5xr2W8P8h/45a/5l1fvef7qmTO3ptNfSv5y4I+vbFvTN7DzluHh4cvS6YvuK5VK7Y6OO4a+01XtX7Jw0cZyuVxL/zRmtVrtmpf6+nq29fctGRwcnJVOt8T8+fOP3N9VfeOhanVjpVL5KJ0GAAAAAODiKJX+A/LWY8Ap2GvAAAAAAElFTkSuQmCC"; 
    } else if (signalStrength <= -76 && signalStrength >= -84) {
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAABuoAAAbqAZ52fK4AAAUgSURBVHhe7d1NiJR1HMDxnVm33YNGSktvZEmHCMRS2yg0BF/WwiR8wYMYefAoiF4C6ZAX6ZQKQUQdjDyUr/iWZbqkOIiICh5Mu4gS+cbqwVJzdKbnsb+dFneN0Xnc3+cD/31+z7Mzexjm+e48uwPTAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0HTvZOt0tup39oBQ7p78dwJQzr8AYXyZtgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMCDUkrbQa1er7929vz5WX9e+2t4OvTQtQ0ZcnPkU0/va29v31UqlW6lw8CDcvXatfkvjR97LRvvfhZa01fH48Nq+48cXpdFyceywYPy+8WLH5daW/s8CYuwlq5YcTLbAo1Wq9Wef+LZZ/KX2X2efEVZZ86dW5FtgUY6dvLkF9mmz5OuSOvd+fMvZFtomkF5Hbqrp+eNNBbagT0/P5lGaIpBGYATp048EifW1YuX/CGQpvIEhMAEAAITAAhMACCwQflW4AVLFp9Zt+bzkWn3nsZ9tDRNjXN6286WK7/+lvb6FeLt2BRT+ADM/GFjmhrnyKerWv7YX0l7/RIAmsYlAAQmABCYAEBgAgCBCQAEJgAQmABAYAIAgQkABCYAEJgAQGACAIEJAAQmABCYAEBgAgCBCQAEJgAQmABAYAIAgQkABCYAEJgAQGACAIEJAAQmABCYAEBgAgCBCQAEJgAQ2H8fTV2v18sXei8t76kcnHygUhl181a1aXHoHD7ixvTuKccnjOta29bWtjMdHjAfDw4Dc+fJV6vVurrnzfpxz8atI+4cLYhya2vLN+vX71swe3Z3qVS6mQ73SwBgYMrZb/6hr7w+fn/RTv5c7fbtlg/mzJm0bvPm3ekQ0EDl73ds33rq6LGOtF9IH86bN6larc5Iu0CDlFevWd2V5sLKXwlUjh5emHaBBikfOVAZluZC+2n33jFpBBqkXL3xdxqL7dKVy4W+TIFHkfcBQGACAIEJAAQmABBY/i60+r/jvY2eNqVl7soVaa9xPumamKZ7W7Rs6dmvP1v1Qtq9J+8EhIHxCgACEwAITAAgMAGAwAQAAhMACEwAIDABgMAEAAITAAhMACAwAYDABAACEwAITAAgMAGAwAQAAhMACEwAIDABgMAEAAITAAhMACAwAYDABAACEwAITAAgMAGAwAQAAhMACEwAILj6o7AWLVt6JtsOyIIli/Pb9vlzCrigabwCgMAEAAITAAhMACCwcltHexqLrXP4iBtp7NeI+7htM7W2P5YmaI7y+IkTrqa50KZ3Tzmexn69N7V7wLdtptFvvflIPPYMYt9t37Y32/T176nCrHJra71arc7I5gG5kd22lN0nGwu91m7Zkj/20Dz1en3oy+PGXs/Hoq5vN236Jdvel682bMjv0+fPK8J68dUx1/PHPpuhuWq1WtfUue/3ZmOfT9Zmrfw3f37yZyfKfV8s5/fJI1DEVwKTZs7szR/zbIamKqVtfsKUL/ReWt5TOTj5QKUy6uatatP+Q5D/wS+/5p8wrmttW1vbznT4f8kvB/YfOrRwx57dYy5fudyRDj90j7UOqb09ccLpaRMn9TzX2bmyVCrV0rcAAAAAAOBBaGn5B1r+9g/XXYNGAAAAAElFTkSuQmCC"; 
    } else {
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAABuoAAAbqAZ52fK4AAAUgSURBVHhe7d1NiJR1HMDxnVm33YNGSktvZEmHCMRS2yg0BF/WwiR8wYMYefAoiF4C6ZAX6ZQKQUQdjDyUr/iWZbqkOIiICh5Mu4gS+cbqwVJzdKbnsb+dFneN0Xnc3+cD/31+z7Mzexjm+e48uwPTAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0HTvZOt0tup39oBQ7p78dwJQzr8AYXyZtgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMCDUkrbQa1er7929vz5WX9e+2t4OvTQtQ0ZcnPkU0/va29v31UqlW6lw8CDcvXatfkvjR97LRvvfhZa01fH48Nq+48cXpdFyceywYPy+8WLH5daW/s8CYuwlq5YcTLbAo1Wq9Wef+LZZ/KX2X2efEVZZ86dW5FtgUY6dvLkF9mmz5OuSOvd+fMvZFtomkF5Hbqrp+eNNBbagT0/P5lGaIpBGYATp048EifW1YuX/CGQpvIEhMAEAAITAAhMACCwQflW4AVLFp9Zt+bzkWn3nsZ9tDRNjXN6286WK7/+lvb6FeLt2BRT+ADM/GFjmhrnyKerWv7YX0l7/RIAmsYlAAQmABCYAEBgAgCBCQAEJgAQmABAYAIAgQkABCYAEJgAQGACAIEJAAQmABCYAEBgAgCBCQAEJgAQmABAYAIAgQkABCYAEJgAQGACAIEJAAQmABCYAEBgAgCBCQAEJgAQ2H8fTV2v18sXei8t76kcnHygUhl181a1aXHoHD7ixvTuKccnjOta29bWtjMdHjAfDw4Dc+fJV6vVurrnzfpxz8atI+4cLYhya2vLN+vX71swe3Z3qVS6mQ73SwBgYMrZb/6hr7w+fn/RTv5c7fbtlg/mzJm0bvPm3ekQ0EDl73ds33rq6LGOtF9IH86bN6larc5Iu0CDlFevWd2V5sLKXwlUjh5emHaBBikfOVAZluZC+2n33jFpBBqkXL3xdxqL7dKVy4W+TIFHkfcBQGACAIEJAAQmABBY/i60+r/jvY2eNqVl7soVaa9xPumamKZ7W7Rs6dmvP1v1Qtq9J+8EhIHxCgACEwAITAAgMAGAwAQAAhMACEwAIDABgMAEAAITAAhMACAwAYDABAACEwAITAAgMAGAwAQAAhMACEwAIDABgMAEAAITAAhMACAwAYDABAACEwAITAAgMAGAwAQAAhMACEwAILj6o7AWLVt6JtsOyIIli/Pb9vlzCrigabwCgMAEAAITAAhMACCwcltHexqLrXP4iBtp7NeI+7htM7W2P5YmaI7y+IkTrqa50KZ3Tzmexn69N7V7wLdtptFvvflIPPYMYt9t37Y32/T176nCrHJra71arc7I5gG5kd22lN0nGwu91m7Zkj/20Dz1en3oy+PGXs/Hoq5vN236Jdvel682bMjv0+fPK8J68dUx1/PHPpuhuWq1WtfUue/3ZmOfT9Zmrfw3f37yZyfKfV8s5/fJI1DEVwKTZs7szR/zbIamKqVtfsKUL/ReWt5TOTj5QKUy6uatatP+Q5D/wS+/5p8wrmttW1vbznT4f8kvB/YfOrRwx57dYy5fudyRDj90j7UOqb09ccLpaRMn9TzX2bmyVCrV0rcAAAAAAOBBaGn5B1r+9g/XXYNGAAAAAElFTkSuQmCC"; 
    }
}

function updateDropdown() {
    const dropdownlist = document.getElementById("dropdownlist");
    dropdownlist.innerHTML = ''; // Clear existing items
    networks.forEach(network => {
        const listItem = createDropdownItem(network);
        dropdownlist.appendChild(listItem);

        listItem.addEventListener('click', () => {
        dropdownMenu.style.display = 'none'; //Hide the dropdown menu
        });
    });
}

function addNewNetwork(name, signalStrength) {
    const newNetwork = { name: name, signalStrength: signalStrength };
    networks.push(newNetwork);
    updateDropdown();
}

document.addEventListener("DOMContentLoaded", function() {
    updateDropdown();
});

// Example usage
addNewNetwork('NEW_NETWORK', -55);

// Initial population of the dropdown
//populateDropdown();



function toggleDropdown() {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '') {
        dropdownMenu.style.display = 'block';
    } else {
        dropdownMenu.style.display = 'none';
    }
}

// Add event listener to the dropdown toggle button
document.querySelector('.dropdown-toggle').addEventListener('click', toggleDropdown);

// Event listener for clicking outside to hide dropdown
document.addEventListener("click", function(event) {
    const dropdown = document.getElementById("myDropdown");
    if (!event.target.closest('.dropdown')) {
        dropdown.style.display = "none";
    }
});

function toggleInput(fieldId) {
    var checkbox = document.getElementById(fieldId + 'Checkbox');
    var inputDiv = document.getElementById(fieldId + 'Input');
    if (checkbox.checked) {
        inputDiv.classList.remove('hidden');
    } else {
        inputDiv.classList.add('hidden');
    }
}

function validateForm() {
    
    var ssid = document.getElementById('ssid').value;
    var password = document.getElementById('password').value;
    var ipAddress = document.getElementById('ipAddressInput').value;
    var gatewayAddress = document.getElementById('gatewayAddressInput').value;
    
    // Validation for SSID
    if (ssid.trim() === '') {
        alert("SSID is empty, Enter a valid SSID");
        return false; // Prevent form submission
    }
    
    var minLength = 6;
    
    // Validation for Password
    if (password.trim() !== '' && password.length < minLength) {
        alert("Password must be at least " + minLength + " characters long.");
        document.getElementById('password').value = ''; // Clear the password field
        return false; // Prevent form submission
    }
    
    // Validate IP Address if the checkbox is checked
    if (document.getElementById('ipAddressCheckbox').checked) {
        if (ipAddress.trim() === '') {
            alert("IP Address field is empty, please provide an IP Address.");
            return false; // Prevent form submission
        } else if (!isValidIPAddress(ipAddress)) {
            alert("Invalid IP Address format. Please enter a valid IP Address.");
            return false; // Prevent form submission
        }
    }
    
    // Validate Gateway Address if the checkbox is checked
    if (document.getElementById('gatewayAddressCheckbox').checked) {
        if (gatewayAddress.trim() === '') {
            alert("Gateway Address field is empty, please provide a Gateway Address.");
            return false; // Prevent form submission
        } else if (!isValidIPAddress(gatewayAddress)) {
            alert("Invalid Gateway Address format. Please enter a valid Gateway Address.");
            return false; // Prevent form submission
        }
    }
    
    // If all validations pass, allow form submission
    return true;
    
}

function isValidIPAddress(ip) {
    // Regular expression to validate IP address format
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
}
