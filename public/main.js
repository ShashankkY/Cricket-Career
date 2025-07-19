const API_BASE = 'http://localhost:3000/api';
let currentEditingPlayer = null;

document.addEventListener('DOMContentLoaded', () => {
  loadAllPlayers();
});

// Show all players
async function loadAllPlayers() {
  showLoading(true);
  hideMessages();

  try {
    const response = await fetch(`${API_BASE}/players`);
    const players = await response.json();

    if (response.ok) {
      displayPlayers(players);
    } else {
      showError('Failed to load players');
    }
  } catch (error) {
    showError('Error connecting to server');
    console.error(error);
  } finally {
    showLoading(false);
  }
}

// Search players
async function searchPlayers() {
  const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();

  if (!searchTerm) {
    loadAllPlayers();
    return;
  }

  showLoading(true);
  hideMessages();

  try {
    const response = await fetch(`${API_BASE}/players/search/${encodeURIComponent(searchTerm)}`);
    const players = await response.json();

    if (response.ok) {
      displayPlayers(players);
    } else {
      showError('Failed to search players');
    }
  } catch (error) {
    showError('Error connecting to server');
    console.error(error);
  } finally {
    showLoading(false);
  }
}

// Save new or edited player
async function savePlayer(playerData) {
  try {
    const url = currentEditingPlayer
      ? `${API_BASE}/players/${currentEditingPlayer.id}`
      : `${API_BASE}/players`;
    const method = currentEditingPlayer ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playerData)
    });

    if (response.ok) {
      const savedPlayer = await response.json();
      showSuccess(currentEditingPlayer ? 'Player updated!' : 'Player added!');
      closeModal();
      displayPlayers([savedPlayer], true); // only show new/edited player
    } else {
      const error = await response.json();
      showError(error.error || 'Failed to save player');
    }
  } catch (error) {
    showError('Error connecting to server');
    console.error(error);
  }
}

// Delete player
async function deletePlayer(playerId) {
  if (!confirm('Are you sure you want to delete this player?')) return;

  try {
    const response = await fetch(`${API_BASE}/players/${playerId}`, { method: 'DELETE' });

    if (response.ok) {
      showSuccess('Player deleted successfully!');
      loadAllPlayers();
    } else {
      showError('Failed to delete player');
    }
  } catch (error) {
    showError('Error connecting to server');
    console.error(error);
  }
}

// Display one or more players
function displayPlayers(players, isRecent = false) {
  const container = document.getElementById('playersContainer');

  if (players.length === 0) {
    container.innerHTML = '<div class="no-results">No players found.</div>';
    return;
  }

  container.innerHTML = players
    .map(
      (player) => `
      <div class="player-card ${isRecent ? 'highlight-new' : ''}">
        ${
          isRecent
            ? '<span class="close-card" onclick="closeRecentCard(this)">×</span>'
            : ''
        }
        <div class="player-header">
          <img src="${player.photoUrl || 'https://via.placeholder.com/80x80'}"
               alt="${player.name}" class="player-photo"
               onerror="this.src='https://via.placeholder.com/80x80'">
          <div class="player-info">
            <h2>${player.name}</h2>
            <p><strong>Born:</strong> ${formatDate(player.dateOfBirth)} (${calculateAge(player.dateOfBirth)} yrs)</p>
            <p><strong>Birthplace:</strong> ${player.birthplace}</p>
          </div>
        </div>
        <div class="stats-grid">
          <div class="stat-item"><div class="stat-value">${player.matches}</div><div class="stat-label">Matches</div></div>
          <div class="stat-item"><div class="stat-value">${player.runs}</div><div class="stat-label">Runs</div></div>
          <div class="stat-item"><div class="stat-value">${player.average}</div><div class="stat-label">Average</div></div>
          <div class="stat-item"><div class="stat-value">${player.fifties}</div><div class="stat-label">Fifties</div></div>
          <div class="stat-item"><div class="stat-value">${player.centuries}</div><div class="stat-label">Centuries</div></div>
          <div class="stat-item"><div class="stat-value">${player.wickets}</div><div class="stat-label">Wickets</div></div>
        </div>
        ${
          player.career
            ? `<div class="career-description"><strong>Career:</strong> ${player.career}</div>`
            : ''
        }
        <div class="player-actions">
          <button onclick="editPlayer(${player.id})" class="btn btn-secondary">Edit</button>
          <button onclick="deletePlayer(${player.id})" class="btn btn-danger">Delete</button>
        </div>
      </div>
    `
    )
    .join('');
}

// Fill form for editing
function editPlayer(playerId) {
  fetch(`${API_BASE}/players/${playerId}`)
    .then((res) => res.json())
    .then((player) => {
      fillPlayerForm(player);
    })
    .catch((error) => {
      showError('Error loading player data');
      console.error(error);
    });
}

// Fill modal form
function fillPlayerForm(player) {
  currentEditingPlayer = player;
  document.getElementById('modalTitle').textContent = 'Edit Player';
  document.getElementById('playerForm').reset();

  document.getElementById('playerName').value = player.name;
  document.getElementById('playerDob').value = player.dateOfBirth.split('T')[0];
  document.getElementById('playerBirthplace').value = player.birthplace;
  document.getElementById('playerPhoto').value = player.photoUrl || '';
  document.getElementById('playerCareer').value = player.career || '';
  document.getElementById('playerMatches').value = player.matches;
  document.getElementById('playerRuns').value = player.runs;
  document.getElementById('playerFifties').value = player.fifties;
  document.getElementById('playerCenturies').value = player.centuries;
  document.getElementById('playerWickets').value = player.wickets;
  document.getElementById('playerAverage').value = player.average;

  document.getElementById('playerModal').style.display = 'block';
}

// Open empty modal
function showAddPlayerModal() {
  currentEditingPlayer = null;
  document.getElementById('modalTitle').textContent = 'Add New Player';
  document.getElementById('playerForm').reset();
  document.getElementById('playerModal').style.display = 'block';
}

// Close modal
function closeModal() {
  document.getElementById('playerModal').style.display = 'none';
  currentEditingPlayer = null;
}

// Dismiss recent card
function closeRecentCard(button) {
  button.parentElement.remove();
}

// Form submit
document.getElementById('playerForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const playerData = {};

  for (let [key, value] of formData.entries()) {
    if (['matches', 'runs', 'fifties', 'centuries', 'wickets'].includes(key)) {
      playerData[key] = parseInt(value) || 0;
    } else if (key === 'average') {
      playerData[key] = parseFloat(value) || 0;
    } else {
      playerData[key] = value;
    }
  }

  savePlayer(playerData);
});

// Support Enter key on search
document.getElementById('searchInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    searchPlayers();
  }
});

// Close modal if clicking outside
window.addEventListener('click', function (e) {
  const modal = document.getElementById('playerModal');
  if (e.target === modal) closeModal();
});

// Utility
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function calculateAge(dateString) {
  const birth = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// Messages
function showLoading(show) {
  document.getElementById('loadingDiv').style.display = show ? 'block' : 'none';
}

function showError(message) {
  const div = document.getElementById('errorDiv');
  div.textContent = message;
  div.style.display = 'block';
  setTimeout(() => (div.style.display = 'none'), 5000);
}

function showSuccess(message) {
  const div = document.getElementById('successDiv');
  div.textContent = message;
  div.style.display = 'block';
  setTimeout(() => (div.style.display = 'none'), 5000);
}

function hideMessages() {
  document.getElementById('errorDiv').style.display = 'none';
  document.getElementById('successDiv').style.display = 'none';
}
