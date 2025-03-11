
// Initialize topics list
let topics = JSON.parse(localStorage.getItem('topics')) || [];

// Navigate to different pages
function navigate(page) {
    alert('Navigating to: ' + page);
}

// Load top 3 topics
function loadTopTopics() {
    const topTopicsList = document.getElementById('top-topics-list');
    topTopicsList.innerHTML = ''; // Clear existing list

    const sortedTopics = topics.sort((a, b) => b.promotions - a.promotions).slice(0, 3);
    sortedTopics.forEach(topic => {
        const li = document.createElement('li');
        li.textContent = `${topic.name} (Promotions: ${topic.promotions})`;
        topTopicsList.appendChild(li);
    });
}

// Load top topics on page load
document.addEventListener('DOMContentLoaded', loadTopTopics);

// Add or Promote a Topic
function addOrPromoteTopic(topicName) {
    const ignoredWords = ['a', 'the', 'and', 'to', 'for'];

    // Normalize and filter words from the input
    const filteredTopicName = topicName
        .toLowerCase()
        .split(' ')
        .filter(word => !ignoredWords.includes(word))
        .join(' ');

    // Check if the topic already exists (with matching keywords)
    let existingTopic = topics.find(topic => {
        const filteredExistingName = topic.name
            .toLowerCase()
            .split(' ')
            .filter(word => !ignoredWords.includes(word))
            .join(' ');

        return filteredExistingName === filteredTopicName;
    });

    if (existingTopic) {
        // If topic exists, increment its promotion count
        existingTopic.promotions += 1;
        alert(`Promoted topic: ${existingTopic.name}`);
    } else {
        // If topic doesn't exist, add it as a new topic
        topics.push({ name: topicName, promotions: 1, claimedBy: [] });
        alert(`Added new topic: ${topicName}`);
    }

    // Save the updated topics list to localStorage
    localStorage.setItem('topics', JSON.stringify(topics));

    // Reload top topics display
    loadTopTopics();
}

// Navigate to Add/Promote Topic page
function navigate(page) {
    document.querySelectorAll('div[id$="-page"]').forEach(page => page.style.display = 'none');
    document.getElementById(`${page}-topic-page`).style.display = 'block';
}

// Submit topic
function submitTopic() {
    const topicInput = document.getElementById('topic-input');
    const topicName = topicInput.value.trim();
    if (topicName) {
        addOrPromoteTopic(topicName);
        topicInput.value = ''; // Clear input field
    } else {
        alert('Please enter a topic name.');
    }
}

// Go back to the homepage
function goBack() {
    document.querySelectorAll('div[id$="-page"]').forEach(page => page.style.display = 'none');
    document.querySelector('.container').style.display = 'block';
}

// Claim a Topic
function claimTopic(topicName, userName) {
    const topic = topics.find(t => t.name.toLowerCase() === topicName.toLowerCase());

    if (!topic) {
        alert(`Topic "${topicName}" not found.`);
        return;
    }

    if (topic.claimedBy.length >= 2) {
        alert(`Topic "${topicName}" has already been claimed by two users.`);
        return;
    }

    if (topic.claimedBy.includes(userName)) {
        alert(`You have already claimed this topic.`);
        return;
    }

    topic.claimedBy.push(userName);
    alert(`Successfully claimed "${topicName}" as ${userName}.`);

    // Save the updated topics list to localStorage
    localStorage.setItem('topics', JSON.stringify(topics));
}

// Submit a claim for a topic
function submitClaim() {
    const topicInput = document.getElementById('claim-topic-input');
    const userNameInput = document.getElementById('user-name-input');

    const topicName = topicInput.value.trim();
    const userName = userNameInput.value.trim();

    if (topicName && userName) {
        claimTopic(topicName, userName);
        topicInput.value = ''; // Clear input field
        userNameInput.value = ''; // Clear user field
    } else {
        alert('Please enter both a topic name and your name.');
    }
}

// View Topics List
function loadTopicsList() {
    const topicsListContainer = document.getElementById('topics-list-container');
    topicsListContainer.innerHTML = ''; // Clear the list

    if (topics.length === 0) {
        topicsListContainer.innerHTML = '<p>No topics available.</p>';
        return;
    }

    const sortedTopics = topics.sort((a, b) => b.promotions - a.promotions);
    const list = document.createElement('ul');

    sortedTopics.forEach(topic => {
        const listItem = document.createElement('li');
        const claimedBy = topic.claimedBy.length > 0 ? ` (Claimed by: ${topic.claimedBy.join(', ')})` : '';
        listItem.textContent = `${topic.name} (Promotions: ${topic.promotions})${claimedBy}`;
        list.appendChild(listItem);
    });

    topicsListContainer.appendChild(list);
}

// Navigate to View Topics List page
function navigate(page) {
    document.querySelectorAll('div[id$="-page"]').forEach(page => page.style.display = 'none');
    if (page === 'view') {
        document.getElementById('view-topics-page').style.display = 'block';
        loadTopicsList();
    } else {
        document.getElementById(`${page}-topic-page`).style.display = 'block';
    }
}

// Delete a Topic
function deleteTopic(topicName, code) {
    if (code !== '1289') {
        alert('Incorrect code. Unable to delete the topic.');
        return;
    }

    const topicIndex = topics.findIndex(t => t.name.toLowerCase() === topicName.toLowerCase());
    if (topicIndex === -1) {
        alert(`Topic "${topicName}" not found.`);
        return;
    }

    topics.splice(topicIndex, 1); // Remove the topic from the array
    alert(`Topic "${topicName}" has been deleted.`);

    // Save the updated topics list to localStorage
    localStorage.setItem('topics', JSON.stringify(topics));

    // Reload topics list if on the View Topics List page
    if (document.getElementById('view-topics-page').style.display === 'block') {
        loadTopicsList();
    }
}

// Submit deletion of a topic
function submitDeletion() {
    const topicInput = document.getElementById('delete-topic-input');
    const codeInput = document.getElementById('delete-code-input');

    const topicName = topicInput.value.trim();
    const code = codeInput.value.trim();

    if (topicName && code) {
        deleteTopic(topicName, code);
        topicInput.value = ''; // Clear input field
        codeInput.value = ''; // Clear code field
    } else {
        alert('Please enter both a topic name and the code.');
    }
}

// Populate dropdown for Claim a Topic
function populateClaimDropdown() {
    const dropdown = document.getElementById('claim-topic-dropdown');
    dropdown.innerHTML = ''; // Clear existing options

    topics.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic.name;
        option.textContent = topic.name;
        dropdown.appendChild(option);
    });
}

// Modify navigation to populate the dropdown when opening the Claim page
function navigate(page) {
    document.querySelectorAll('div[id$="-page"]').forEach(page => page.style.display = 'none');
    if (page === 'claim') {
        document.getElementById('claim-topic-page').style.display = 'block';
        populateClaimDropdown();
    } else if (page === 'view') {
        document.getElementById('view-topics-page').style.display = 'block';
        loadTopicsList();
    } else {
        document.getElementById(`${page}-topic-page`).style.display = 'block';
    }
}

// View Topics List with delete functionality
function loadTopicsList() {
    const topicsListContainer = document.getElementById('topics-list-container');
    topicsListContainer.innerHTML = ''; // Clear the list

    if (topics.length === 0) {
        topicsListContainer.innerHTML = '<p>No topics available.</p>';
        return;
    }

    const sortedTopics = topics.sort((a, b) => b.promotions - a.promotions);
    const list = document.createElement('ul');

    sortedTopics.forEach(topic => {
        const listItem = document.createElement('li');
        const claimedBy = topic.claimedBy.length > 0 ? ` (Claimed by: ${topic.claimedBy.join(', ')})` : '';
        listItem.textContent = `${topic.name} (Promotions: ${topic.promotions})${claimedBy}`;

        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.marginLeft = '10px';
        deleteButton.onclick = () => {
            const code = prompt('Enter the deletion code:');
            deleteTopic(topic.name, code);
        };

        listItem.appendChild(deleteButton);
        list.appendChild(listItem);
    });

    topicsListContainer.appendChild(list);
}
