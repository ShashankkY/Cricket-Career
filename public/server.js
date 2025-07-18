
        // Configuration - Change this to your backend API URL
        const API_BASE = 'http://localhost:3000/api';
        let currentEditingPlayer = null;

        // Sample data for demo mode
        let samplePlayers = [
            {
                id: 1,
                name: "Virat Kohli",
                dateOfBirth: "1988-11-05",
                birthplace: "Delhi, India",
                photoUrl: "https://via.placeholder.com/80x80/667eea/white?text=VK",
                career: "Former Indian captain and one of the greatest batsmen of all time. Known for his aggressive batting style and fitness.",
                matches: 274,
                runs: 12898,
                fifties: 65,
                centuries: 46,
                wickets: 4,
                average: 52.37
            },
            {
                id: 2,
                name: "MS Dhoni",
                dateOfBirth: "1981-07-07",
                birthplace: "Ranchi, India",
                photoUrl: "https://via.placeholder.com/80x80/667eea/white?text=MSD",
                career: "Former Indian captain and wicket-keeper. Known for his calm demeanor and finishing ability.",
                matches: 350,
                runs: 10773,
                fifties: 73,
                centuries: 10,
                wickets: 1,
                average: 50.58
            },
            {
                id: 3,
                name: "Rohit Sharma",
                dateOfBirth: "1987-04-30",
                birthplace: "Nagpur, India",
                photoUrl: "https://via.placeholder.com/80x80/667eea/white?text=RS",
                career: "Current Indian captain and opening batsman. Holds the record for highest individual score in ODIs.",
                matches: 243,
                runs: 9205,
                fifties: 43,
                centuries: 29,
                wickets: 8,
                average: 48.96
            }
        ];

        // Use sample data for demo mode
        let useDemoMode = true;

        // Load all players on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadAllPlayers();
        });

        // API Functions
        async function loadAllPlayers() {
            showLoading(true);
            hideMessages();
            
            try {
                if (useDemoMode) {
                    // Simulate API delay
                    await new Promise(resolve => setTimeout(resolve, 500));
                    displayPlayers(samplePlayers);
                } else {
                    const response = await fetch(`${API_BASE}/players`);
                    const players = await response.json();
                    
                    if (response.ok) {
                        displayPlayers(players);
                    } else {
                        showError('Failed to load players');
                    }
                }
            } catch (error) {
                if (useDemoMode) {
                    displayPlayers(samplePlayers);
                } else {
                    showError('Error connecting to server');
                    console.error('Error:', error);
                }
            } finally {
                showLoading(false);
            }
        }

        async function searchPlayers() {
            const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
            
            if (!searchTerm) {
                loadAllPlayers();
                return;
            }

            showLoading(true);
            hideMessages();
            
            try {
                if (useDemoMode) {
                    // Simulate API delay
                    await new Promise(resolve => setTimeout(resolve, 300));
                    const filteredPlayers = samplePlayers.filter(player =>
                        player.name.toLowerCase().includes(searchTerm) ||
                        player.birthplace.toLowerCase().includes(searchTerm)
                    );
                    displayPlayers(filteredPlayers);
                } else {
                    const response = await fetch(`${API_BASE}/players/search/${encodeURIComponent(searchTerm)}`);
                    const players = await response.json();
                    
                    if (response.ok) {
                        displayPlayers(players);
                    } else {
                        showError('Failed to search players');
                    }
                }
            } catch (error) {
                if (useDemoMode) {
                    const filteredPlayers = samplePlayers.filter(player =>
                        player.name.toLowerCase().includes(searchTerm) ||
                        player.birthplace.toLowerCase().includes(searchTerm)
                    );
                    displayPlayers(filteredPlayers);
                } else {
                    showError('Error connecting to server');
                    console.error('Error:', error);
                }
            } finally {
                showLoading(false);
            }
        }

        async function savePlayer(playerData) {
            try {
                if (useDemoMode) {
                    // Simulate API delay
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    if (currentEditingPlayer) {
                        // Update existing player
                        const index = samplePlayers.findIndex(p => p.id === currentEditingPlayer.id);
                        if (index !== -1) {
                            samplePlayers[index] = { ...playerData, id: currentEditingPlayer.id };
                        }
                        showSuccess('Player updated successfully!');
                    } else {
                        // Add new player
                        const newPlayer = { ...playerData, id: Date.now() };
                        samplePlayers.push(newPlayer);
                        showSuccess('Player added successfully!');
                    }
                    
                    closeModal();
                    loadAllPlayers();
                } else {
                    const url = currentEditingPlayer ? 
                        `${API_BASE}/players/${currentEditingPlayer.id}` : 
                        `${API_BASE}/players`;
                    
                    const method = currentEditingPlayer ? 'PUT' : 'POST';
                    
                    const response = await fetch(url, {
                        method: method,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(playerData)
                    });

                    if (response.ok) {
                        showSuccess(currentEditingPlayer ? 'Player updated successfully!' : 'Player added successfully!');
                        closeModal();
                        loadAllPlayers();
                    } else {
                        const error = await response.json();
                        showError(error.error || 'Failed to save player');
                    }
                }
            } catch (error) {
                if (useDemoMode) {
                    showError('Demo mode error - please try again');
                } else {
                    showError('Error connecting to server');
                    console.error('Error:', error);
                }
            }
        }

        async function deletePlayer(playerId) {
            if (!confirm('Are you sure you want to delete this player?')) {
                return;
            }

            try {
                if (useDemoMode) {
                    // Simulate API delay
                    await new Promise(resolve => setTimeout(resolve, 300));
                    
                    const index = samplePlayers.findIndex(p => p.id === playerId);
                    if (index !== -1) {
                        samplePlayers.splice(index, 1);
                        showSuccess('Player deleted successfully!');
                        loadAllPlayers();
                    }
                } else {
                    const response = await fetch(`${API_BASE}/players/${playerId}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        showSuccess('Player deleted successfully!');
                        loadAllPlayers();
                    } else {
                        showError('Failed to delete player');
                    }
                }
            } catch (error) {
                if (useDemoMode) {
                    showError('Demo mode error - please try again');
                } else {
                    showError('Error connecting to server');
                    console.error('Error:', error);
                }
            }
        }

        // UI Functions
        function displayPlayers(players) {
            const container = document.getElementById('playersContainer');
            
            if (players.length === 0) {
                container.innerHTML = '<div class="no-results">No players found.</div>';
                return;
            }

            container.innerHTML = players.map(player => `
                <div class="player-card">
                    <div class="player-header">
                        <img src="${player.photoUrl || 'https://via.placeholder.com/80x80/667eea/white?text=P'}" 
                             alt="${player.name}" 
                             class="player-photo"
                             onerror="this.src='https://via.placeholder.com/80x80/667eea/white?text=P'">
                        <div class="player-info">
                            <h2>${player.name}</h2>
                            <p><strong>Born:</strong> ${formatDate(player.dateOfBirth)} (${calculateAge(player.dateOfBirth)} years)</p>
                            <p><strong>Birthplace:</strong> ${player.birthplace}</p>
                        </div>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-value">${player.matches}</div>
                            <div class="stat-label">Matches</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${player.runs}</div>
                            <div class="stat-label">Runs</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${player.average}</div>
                            <div class="stat-label">Average</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${player.fifties}</div>
                            <div class="stat-label">Fifties</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${player.centuries}</div>
                            <div class="stat-label">Centuries</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${player.wickets}</div>
                            <div class="stat-label">Wickets</div>
                        </div>
                    </div>
                    
                    ${player.career ? `
                        <div class="career-description">
                            <strong>Career:</strong> ${player.career}
                        </div>
                    ` : ''}
                    
                    <div class="player-actions">
                        <button onclick="editPlayer(${player.id})" class="btn btn-secondary">Edit</button>
                        <button onclick="deletePlayer(${player.id})" class="btn btn-danger">Delete</button>
                    </div>
                </div>
            `).join('');
        }

        function showAddPlayerModal() {
            currentEditingPlayer = null;
            document.getElementById('modalTitle').textContent = 'Add New Player';
            document.getElementById('playerForm').reset();
            document.getElementById('playerModal').style.display = 'block';
        }

        function editPlayer(playerId) {
            let player;
            
            if (useDemoMode) {
                player = samplePlayers.find(p => p.id === playerId);
                if (player) {
                    fillPlayerForm(player);
                }
            } else {
                fetch(`${API_BASE}/players/${playerId}`)
                    .then(response => response.json())
                    .then(player => {
                        fillPlayerForm(player);
                    })
                    .catch(error => {
                        showError('Error loading player data');
                        console.error('Error:', error);
                    });
            }
        }

        function fillPlayerForm(player) {
            currentEditingPlayer = player;
            document.getElementById('modalTitle').textContent = 'Edit Player';
            
            // Fill form with player data
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

        function closeModal() {
            document.getElementById('playerModal').style.display = 'none';
            currentEditingPlayer = null;
        }

        function showLoading(show) {
            document.getElementById('loadingDiv').style.display = show ? 'block' : 'none';
        }

        function showError(message) {
            const errorDiv = document.getElementById('errorDiv');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }

        function showSuccess(message) {
            const successDiv = document.getElementById('successDiv');
            successDiv.textContent = message;
            successDiv.style.display = 'block';
            setTimeout(() => {
                successDiv.style.display = 'none';
            }, 5000);
        }

        function hideMessages() {
            document.getElementById('errorDiv').style.display = 'none';
            document.getElementById('successDiv').style.display = 'none';
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        function calculateAge(dateString) {
            const birthDate = new Date(dateString);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            return age;
        }

        // Form submission
        document.getElementById('playerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const playerData = {};
            
            for (let [key, value] of formData.entries()) {
                if (key === 'matches' || key === 'runs' || key === 'fifties' || key === 'centuries' || key === 'wickets') {
                    playerData[key] = parseInt(value) || 0;
                } else if (key === 'average') {
                    playerData[key] = parseFloat(value) || 0;
                } else {
                    playerData[key] = value;
                }
            }
            
            savePlayer(playerData);
        });

        // Search on Enter key
        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchPlayers();
            }
        });

        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            const modal = document.getElementById('playerModal');
            if (e.target === modal) {
                closeModal();
            }
        });

        // Toggle demo mode (for testing)
        function toggleDemoMode() {
            useDemoMode = !useDemoMode;
            loadAllPlayers();
        }
  