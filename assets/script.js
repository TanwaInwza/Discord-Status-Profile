// Function to convert URLs in a string to clickable links
function convertToLinks(text) {
    // Regex to find URLs (http://, https://, or www.)
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    
    // Replace URLs with <a> tags
    return text.replace(urlRegex, function(url) {
        let href = url.startsWith('http') ? url : 'https://' + url;
        return `<a href="${href}" target="_blank">${url}</a>`;
    });
}

async function fetchConfig() {
    const response = await fetch('./assets/config.json');
    return await response.json();
}

async function fetchUserData(userID) {
    const apiUrl = `https://corsproxy.io/?https://api.slamy.in.th/api/v1/discord/users/${userID}`;

    try {
        const response = await fetch(apiUrl);
        const apiResponse = await response.json();

        const userData = apiResponse.data.userData;

        // Update the user's information on the page
        document.getElementById('userInfo').textContent = `${userData.username}`;
        document.getElementById('userAvatar').src = userData.avatar || 'assets/images/unknow.png';
        document.getElementById('userGlobalName').textContent = `${userData.global_name}`;

        // Set the user status and message based on the API response (example)
        setUserStatus(userData.status, userData.status_message);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Function to set the status icon and status message based on the user's status
function setUserStatus(status, statusMessage) {
    const statusIndicator = document.getElementById('statusIndicator');
    const statusMessageElement = document.getElementById('statusMessage');

    // Reset status classes
    statusIndicator.classList.remove('status-online', 'status-idle', 'status-dnd', 'status-offline');

    // Set the status indicator color and message
    switch (status) {
        case 'online':
            statusIndicator.classList.add('status-online');
            statusMessageElement.textContent = statusMessage || "Online";
            break;
        case 'idle':
            statusIndicator.classList.add('status-idle');
            statusMessageElement.textContent = statusMessage || "Idle";
            break;
        case 'dnd':
            statusIndicator.classList.add('status-dnd');
            statusMessageElement.textContent = statusMessage || "Do Not Disturb";
            break;
        case 'offline':
            statusIndicator.classList.add('status-offline');
            statusMessageElement.textContent = statusMessage || "Offline";
            break;
        default:
            statusIndicator.classList.add('status-offline'); // Default to offline if no status
            statusMessageElement.textContent = "Offline";
            break;
    }
}

(async function initialize() {
    const config = await fetchConfig();

    try {
        // Update the page title and favicon
        document.title = config.Page.PageTitle;
        const link = document.createElement('link');
        link.rel = 'shortcut icon';
        link.href = config.Page.PageIcon;
        link.type = 'image/x-icon';
        document.head.appendChild(link);

        // Update description section with clickable links
        const des = document.getElementById('des');
        des.innerHTML = convertToLinks(config.description);

        // Fetch and display user data if userID is provided
        const userID = config.userID;
        if (userID) {
            fetchUserData(userID);
        } else {
            console.error('UserID not found in config.json');
        }
    } catch (error) {
        console.error('Error during initialization:', error);
    }
})();
