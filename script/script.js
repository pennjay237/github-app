const suggestionList = ['torvalds', 'gaearon', 'sindresorhus', 'octocat', 'mojombo'];


function searchSuggestions() {
  const input = document.getElementById('username').value.toLowerCase();
  const suggestions = document.getElementById('suggestions');
  suggestions.innerHTML = '';

  if (input === '') return;

  for (let i = 0; i < suggestionList.length; i++) {
    const name = suggestionList[i];
    if (name.includes(input)) {
      const li = document.createElement('li');
      li.textContent = name;

      li.onclick = function () {
        const confirmed = confirm(`Search for ${name}?`);
        switch (confirmed) {
          case true:
            document.getElementById('username').value = name;
            suggestions.innerHTML = '';
            fetchProfile();
            break;
          default:
            break;
        }
      };
      suggestions.appendChild(li);
    }
  }
}


async function fetchProfile() {
  const username = document.getElementById('username').value.trim();
  const profileDiv = document.getElementById('profile');
  const suggestions = document.getElementById('suggestions');
  suggestions.innerHTML = '';

  if (!username) {
    profileDiv.innerHTML = `<p class="error-message">Please enter a GitHub username.</p>`;
    return;
  }

  const url = `https://api.github.com/users/${username}`;

  try {
    profileDiv.innerHTML = `<p>Loading...</p>`;
    const response = await fetch(url);

    switch (response.status) {
      case 200:
        const data = await response.json();
        renderProfile(data);
        break;

      case 404:
        throw new Error('User not found. Please check the username.');

      case 403:
        throw new Error('Rate limit exceeded. Try again later.');

      default:
        throw new Error('An unknown error occurred.');
    }
  } catch (error) {
    profileDiv.innerHTML = `<p class="error-message">${error.message}</p>`;
  }
}


function renderProfile(data) {
  const profileDiv = document.getElementById('profile');

  const displayName = data.name ? data.name : data.login;
  const displayBio = data.bio ? data.bio : 'No bio available';

  profileDiv.innerHTML = `
    <div class="profile-card">
      <img src="${data.avatar_url}" alt="${data.login}" />
      <h2>${displayName}</h2>
      <p>${displayBio}</p>
      <p>Followers: ${data.followers} | Following: ${data.following}</p>
      <p>Public Repos: ${data.public_repos}</p>
      <a href="${data.html_url}" target="_blank">Visit GitHub Profile</a>
    </div>
  `;
}
