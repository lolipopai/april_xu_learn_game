// Global variables
let currentStudent = {
    name: '',
    grade: '',
    points: 0
};

let achievements = [];

// API Configuration
const DICTIONARY_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const TRIVIA_API_URL = 'https://opentdb.com/api.php';
const NASA_API_URL = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadStudentData();
    setupSmoothScrolling();
    animateOnScroll();
});

// Student Form Handling
document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('studentName').value.trim();
    const grade = document.getElementById('grade').value;
    
    if (name && grade) {
        currentStudent.name = name;
        currentStudent.grade = grade;
        
        // Give starting points if this is a new student
        if (currentStudent.points === 0) {
            currentStudent.points = 10; // Starting money
            addAchievement('Welcome! You received 10 starting points to spend!');
        }
        
        saveStudentData();
        displayStudentInfo();
        
        // Add welcome animation
        const studentSection = document.getElementById('currentStudent');
        studentSection.classList.add('bounce-in');
    } else {
        alert('Please enter your name and select your grade!');
    }
});

// Display student information
function displayStudentInfo() {
    const currentStudentDiv = document.getElementById('currentStudent');
    const displayName = document.getElementById('displayName');
    const displayGrade = document.getElementById('displayGrade');
    const displayPoints = document.getElementById('displayPoints');
    const totalPoints = document.getElementById('totalPoints');
    
    displayName.textContent = currentStudent.name;
    displayGrade.textContent = getGradeDisplayName(currentStudent.grade);
    displayPoints.textContent = currentStudent.points;
    totalPoints.textContent = currentStudent.points;
    
    currentStudentDiv.style.display = 'block';
    currentStudentDiv.classList.add('fade-in');
}

// Get friendly grade display name
function getGradeDisplayName(grade) {
    const gradeNames = {
        'prek': 'Pre-K',
        'kindergarten': 'Kindergarten',
        '1st': '1st Grade',
        '2nd': '2nd Grade'
    };
    return gradeNames[grade] || grade;
}

// Save student data to localStorage
function saveStudentData() {
    localStorage.setItem('aprilWebsiteStudent', JSON.stringify(currentStudent));
    localStorage.setItem('aprilWebsiteAchievements', JSON.stringify(achievements));
}

// Load student data from localStorage
function loadStudentData() {
    const savedStudent = localStorage.getItem('aprilWebsiteStudent');
    const savedAchievements = localStorage.getItem('aprilWebsiteAchievements');
    
    if (savedStudent) {
        currentStudent = JSON.parse(savedStudent);
        displayStudentInfo();
        
        // Pre-fill the form
        document.getElementById('studentName').value = currentStudent.name;
        document.getElementById('grade').value = currentStudent.grade;
    }
    
    if (savedAchievements) {
        achievements = JSON.parse(savedAchievements);
        displayAchievements();
    }
}

// Add points to student
function addPoints(points, reason) {
    currentStudent.points += points;
    saveStudentData();
    displayStudentInfo();
    
    if (reason) {
        addAchievement(`Earned ${points} points for ${reason}!`);
    }
    
    // Add visual feedback
    showPointsAnimation(points);
}

// Show points animation
function showPointsAnimation(points) {
    const pointsDisplay = document.getElementById('totalPoints');
    const originalText = pointsDisplay.textContent;
    
    pointsDisplay.style.transform = 'scale(1.2)';
    pointsDisplay.style.color = '#f39c12';
    
    setTimeout(() => {
        pointsDisplay.style.transform = 'scale(1)';
        pointsDisplay.style.color = '';
    }, 300);
}

// Add achievement
function addAchievement(text) {
    const achievement = {
        text: text,
        timestamp: new Date().toLocaleString()
    };
    
    achievements.unshift(achievement); // Add to beginning
    
    // Keep only last 5 achievements
    if (achievements.length > 5) {
        achievements = achievements.slice(0, 5);
    }
    
    saveStudentData();
    displayAchievements();
}

// Display achievements
function displayAchievements() {
    const achievementsList = document.getElementById('achievementsList');
    
    if (achievements.length === 0) {
        achievementsList.innerHTML = '<p class="no-achievements">Complete activities to earn achievements!</p>';
        return;
    }
    
    achievementsList.innerHTML = achievements.map(achievement => `
        <div class="achievement-item">
            <i class="fas fa-star"></i>
            <span>${achievement.text}</span>
            <small>${achievement.timestamp}</small>
        </div>
    `).join('');
}

// Learning Activities
function openActivity(type) {
    const activities = {
        language: {
            title: 'Language Learning',
            content: `
                <h3><i class="fas fa-language"></i> Language Learning Activities</h3>
                <div class="activity-options">
                    <button class="btn-primary" onclick="startVocabulary()">Vocabulary Practice</button>
                    <button class="btn-primary" onclick="startGrammar()">Grammar Exercises</button>
                    <button class="btn-primary" onclick="startConversation()">Conversation Practice</button>
                </div>
                <p>Choose an activity to start learning and earn points!</p>
            `
        },
        reading: {
            title: 'Reading Activities',
            content: `
                <h3><i class="fas fa-book-open"></i> Reading Adventures</h3>
                <div class="activity-options">
                    <button class="btn-primary" onclick="startStoryTime()">Story Time</button>
                    <button class="btn-primary" onclick="startComprehension()">Reading Comprehension</button>
                    <button class="btn-primary" onclick="startPhonics()">Phonics Practice</button>
                </div>
                <p>Explore wonderful stories and improve your reading skills!</p>
            `
        },
        emotion: {
            title: 'Emotion Learning',
            content: `
                <h3><i class="fas fa-heart"></i> Understanding Emotions</h3>
                <div class="activity-options">
                    <button class="btn-primary" onclick="startEmotionRecognition()">Emotion Recognition</button>
                    <button class="btn-primary" onclick="startFeelingWheel()">Feeling Wheel</button>
                    <button class="btn-primary" onclick="startEmpathy()">Empathy Exercises</button>
                </div>
                <p>Learn about feelings and how to express them in healthy ways!</p>
            `
        }
    };
    
    const activity = activities[type];
    if (activity) {
        showModal(activity.title, activity.content);
    }
}

// Free Point Earning System
function earnFreePoints(activityType, points) {
    const activities = {
        'practice': { name: 'Practice Session', icon: '📚' },
        'daily': { name: 'Daily Check-in', icon: '📅' },
        'watch': { name: 'Learning Video', icon: '📺' }
    };
    
    const activity = activities[activityType];
    addPoints(points, `free ${activity.name.toLowerCase()}`);
    
    showModal(`Free ${activity.name}! 🆓`, `
        <div class="free-activity">
            <div class="result-icon">${activity.icon}</div>
            <h3>Great job!</h3>
            <p>You earned <strong>${points} points</strong> for completing a ${activity.name}!</p>
            <p>Now you have <strong>${currentStudent.points} points</strong> total!</p>
            <p class="earning-tip">💰 Use your points to play exciting games!</p>
            <button class="btn-primary" onclick="closeModal()">Awesome!</button>
        </div>
    `);
}

// Payment System
function payAndPlayGame(category, gameId, points, difficulty, cost) {
    if (currentStudent.points < cost) {
        showModal('Not Enough Points! 💸', `
            <div class="game-result try-again">
                <div class="result-icon">💸</div>
                <h3>Oops! Not enough points!</h3>
                <p>You need <strong>${cost}</strong> points but only have <strong>${currentStudent.points}</strong>.</p>
                <p>Try some free activities first to earn more points!</p>
                <button class="btn-primary" onclick="closeModal()">Earn More Points</button>
            </div>
        `);
        return;
    }
    
    // Deduct cost first
    currentStudent.points -= cost;
    saveStudentData();
    displayStudentInfo();
    
    // Show payment confirmation
    showModal('Payment Successful! 💰', `
        <div class="payment-success">
            <div class="result-icon">💰</div>
            <h3>Payment Accepted!</h3>
            <p>You paid <strong>${cost} points</strong> to play this game.</p>
            <p>Points remaining: <strong>${currentStudent.points}</strong></p>
            <p>Starting game now...</p>
        </div>
    `);
    
    // Start the game after a short delay
    setTimeout(() => {
        playInteractiveGame(category, gameId, points, difficulty);
    }, 1500);
}

// Individual activity functions
function startVocabulary() {
    const games = getVocabularyGames(currentStudent.grade);
    showModal('Vocabulary Games', `
        <h3><i class="fas fa-language"></i> Vocabulary Learning Games</h3>
        <p>Your Points: <strong>${currentStudent.points}</strong> 💰</p>
        <p>Choose a game to play (costs points like money!):</p>
        <div class="game-difficulty-grid">
            ${games.map(game => {
                const canAfford = currentStudent.points >= game.cost;
                return `
                <div class="difficulty-card ${game.difficulty} ${!canAfford ? 'unaffordable' : ''}">
                    <div class="difficulty-icon">${game.icon}</div>
                    <h4>${game.name}</h4>
                    <p>${game.description}</p>
                    <div class="game-economics">
                        <p class="cost-display">💰 Costs ${game.cost} points</p>
                        <p class="points-reward">🏆 Win ${game.points} points!</p>
                        <p class="profit-display">📈 Profit: +${game.points - game.cost} points</p>
                    </div>
                    ${canAfford ? 
                        `<button class="btn-primary" onclick="payAndPlayGame('vocabulary', '${game.id}', ${game.points}, '${game.difficulty}', ${game.cost})">
                            Pay ${game.cost} & Play
                        </button>` :
                        `<button class="btn-primary disabled" disabled>
                            Need ${game.cost - currentStudent.points} more points
                        </button>`
                    }
                </div>
            `;
            }).join('')}
        </div>
        <div class="earning-tip">
            <p>💡 <strong>Tip:</strong> Do free activities first to earn points, then play games!</p>
            <div class="free-activities">
                <h4>🆓 Free Ways to Earn Points:</h4>
                <button class="btn-secondary" onclick="earnFreePoints('practice', 5)">Practice Session (+5 points)</button>
                <button class="btn-secondary" onclick="earnFreePoints('daily', 3)">Daily Check-in (+3 points)</button>
                <button class="btn-secondary" onclick="earnFreePoints('watch', 4)">Watch Learning Video (+4 points)</button>
            </div>
        </div>
    `);
}

function startGrammar() {
    const games = getGrammarGames(currentStudent.grade);
    showModal('Grammar Games', `
        <h3><i class="fas fa-spell-check"></i> Grammar Learning Games</h3>
        <p>Your Points: <strong>${currentStudent.points}</strong> 💰</p>
        <p>Choose a grammar game to play:</p>
        <div class="game-difficulty-grid">
            ${games.map(game => {
                const canAfford = currentStudent.points >= game.cost;
                return `
                <div class="difficulty-card ${game.difficulty} ${!canAfford ? 'unaffordable' : ''}">
                    <div class="difficulty-icon">${game.icon}</div>
                    <h4>${game.name}</h4>
                    <p>${game.description}</p>
                    <div class="game-economics">
                        <p class="cost-display">💰 Costs ${game.cost} points</p>
                        <p class="points-reward">🏆 Win ${game.points} points!</p>
                        <p class="profit-display">📈 Profit: +${game.points - game.cost} points</p>
                    </div>
                    ${canAfford ? 
                        `<button class="btn-primary" onclick="payAndPlayGame('grammar', '${game.id}', ${game.points}, '${game.difficulty}', ${game.cost})">
                            Pay ${game.cost} & Play
                        </button>` :
                        `<button class="btn-primary disabled" disabled>
                            Need ${game.cost - currentStudent.points} more points
                        </button>`
                    }
                </div>
            `;
            }).join('')}
        </div>
    `);
}

function startConversation() {
    showModal('🗣️ Conversation Activities', `
        <h3>💬 Conversation & Communication</h3>
        <p>Practice talking and communication skills!</p>
        
        <div class="activity-options">
            <button class="btn-primary" onclick="playWordBuilder()">🔤 Word Builder Game</button>
            <button class="btn-primary" onclick="earnFreePoints('practice', 8)">💬 Free Practice Session</button>
            <button class="btn-primary" onclick="playRhythmGame()">🎵 Rhythm & Speaking</button>
        </div>
        
        <p>💡 Choose an activity to practice your communication skills!</p>
    `);
}

function startStoryTime() {
    const games = getReadingGames(currentStudent.grade);
    showModal('Reading Adventure Games', `
        <h3><i class="fas fa-book-open"></i> Reading Adventure Games</h3>
        <p>Your Points: <strong>${currentStudent.points}</strong> 💰</p>
        <p>Choose a reading adventure:</p>
        <div class="game-difficulty-grid">
            ${games.map(game => {
                const canAfford = currentStudent.points >= game.cost;
                return `
                <div class="difficulty-card ${game.difficulty} ${!canAfford ? 'unaffordable' : ''}">
                    <div class="difficulty-icon">${game.icon}</div>
                    <h4>${game.name}</h4>
                    <p>${game.description}</p>
                    <div class="game-economics">
                        <p class="cost-display">💰 Costs ${game.cost} points</p>
                        <p class="points-reward">🏆 Win ${game.points} points!</p>
                        <p class="profit-display">📈 Profit: +${game.points - game.cost} points</p>
                    </div>
                    ${canAfford ? 
                        `<button class="btn-primary" onclick="payAndPlayGame('reading', '${game.id}', ${game.points}, '${game.difficulty}', ${game.cost})">
                            Pay ${game.cost} & Play
                        </button>` :
                        `<button class="btn-primary disabled" disabled>
                            Need ${game.cost - currentStudent.points} more points
                        </button>`
                    }
                </div>
            `;
            }).join('')}
        </div>
    `);
}

function startComprehension() {
    showModal('Reading Comprehension Game', `
        <h3>📚 Reading Adventure Game 📚</h3>
        <p>Read the story and answer questions to earn points!</p>
        <button class="btn-primary" onclick="playReadingComprehensionGame()">Start Reading Game</button>
        <button class="btn-secondary" onclick="playStoryBuilderGame()">Story Builder Game</button>
    `);
}

function startPhonics() {
    addPoints(10, 'phonics practice');
    showModal('Phonics Practice', `
        <h3>Fantastic phonics work!</h3>
        <p>You earned 10 points! 🔤</p>
        <p>Phonics helps us sound out words and become better readers!</p>
    `);
}

function startEmotionRecognition() {
    const games = getEmotionGames(currentStudent.grade);
    showModal('Emotion Learning Games', `
        <h3><i class="fas fa-heart"></i> Emotion Learning Games</h3>
        <p>Your Points: <strong>${currentStudent.points}</strong> 💰</p>
        <p>Choose an emotion game to play:</p>
        <div class="game-difficulty-grid">
            ${games.map(game => {
                const canAfford = currentStudent.points >= game.cost;
                return `
                <div class="difficulty-card ${game.difficulty} ${!canAfford ? 'unaffordable' : ''}">
                    <div class="difficulty-icon">${game.icon}</div>
                    <h4>${game.name}</h4>
                    <p>${game.description}</p>
                    <div class="game-economics">
                        <p class="cost-display">💰 Costs ${game.cost} points</p>
                        <p class="points-reward">🏆 Win ${game.points} points!</p>
                        <p class="profit-display">📈 Profit: +${game.points - game.cost} points</p>
                    </div>
                    ${canAfford ? 
                        `<button class="btn-primary" onclick="payAndPlayGame('emotion', '${game.id}', ${game.points}, '${game.difficulty}', ${game.cost})">
                            Pay ${game.cost} & Play
                        </button>` :
                        `<button class="btn-primary disabled" disabled>
                            Need ${game.cost - currentStudent.points} more points
                        </button>`
                    }
                </div>
            `;
            }).join('')}
        </div>
    `);
}

function startFeelingWheel() {
    addPoints(6, 'free feeling wheel exploration');
    showModal('Free Feeling Wheel! 🆓', `
        <div class="free-activity">
            <div class="result-icon">🎯</div>
            <h3>Wonderful feeling exploration!</h3>
            <p>You earned <strong>6 points</strong> for free! 🆓</p>
            <p>There are so many different feelings to discover!</p>
            <p class="earning-tip">💡 Save up for emotion games!</p>
            <button class="btn-primary" onclick="closeModal()">Awesome!</button>
        </div>
    `);
}

function startEmpathy() {
    addPoints(25, 'empathy exercises');
    showModal('Empathy Exercises', `
        <h3>Beautiful empathy work!</h3>
        <p>You earned 25 points! ❤️</p>
        <p>Caring about others' feelings makes the world a better place!</p>
    `);
}

// Games, Sports, and Prizes
function openGames() {
    // Debug: Check if function is being called
    console.log('openGames function called');
    
    showModal('🎮 Educational Games Arcade', `
        <div style="text-align: center; padding: 1rem;">
            <h3><i class="fas fa-gamepad"></i> Fun Learning Games Arcade</h3>
            <p>Choose a game to play and earn points!</p>
            
            <div class="arcade-games-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 2rem 0;">
                
                <div class="arcade-game-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; border-radius: 15px; color: white; text-align: center; transition: transform 0.3s ease; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);">
                    <div class="game-icon" style="font-size: 3.5rem; margin-bottom: 1rem;">🔢</div>
                    <h4 style="margin-bottom: 1rem; font-size: 1.3rem;">Math Adventure</h4>
                    <p style="margin-bottom: 1.5rem; opacity: 0.9;">Solve math problems and go on adventures!</p>
                    <button class="btn-primary" onclick="playMathAdventure()" style="background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.3); padding: 0.8rem 1.5rem; border-radius: 25px; cursor: pointer; font-weight: 600;">Play Now!</button>
                </div>
                
                <div class="arcade-game-card" style="background: linear-gradient(135deg, #ff9a56 0%, #ffa726 100%); padding: 2rem; border-radius: 15px; color: white; text-align: center; transition: transform 0.3s ease; box-shadow: 0 8px 25px rgba(255, 154, 86, 0.3);">
                    <div class="game-icon" style="font-size: 3.5rem; margin-bottom: 1rem;">🔤</div>
                    <h4 style="margin-bottom: 1rem; font-size: 1.3rem;">Word Builder</h4>
                    <p style="margin-bottom: 1.5rem; opacity: 0.9;">Build words from letter tiles!</p>
                    <button class="btn-primary" onclick="playWordBuilder()" style="background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.3); padding: 0.8rem 1.5rem; border-radius: 25px; cursor: pointer; font-weight: 600;">Play Now!</button>
                </div>
                
                <div class="arcade-game-card" style="background: linear-gradient(135deg, #42e695 0%, #3bb78f 100%); padding: 2rem; border-radius: 15px; color: white; text-align: center; transition: transform 0.3s ease; box-shadow: 0 8px 25px rgba(66, 230, 149, 0.3);">
                    <div class="game-icon" style="font-size: 3.5rem; margin-bottom: 1rem;">🧠</div>
                    <h4 style="margin-bottom: 1rem; font-size: 1.3rem;">Memory Master</h4>
                    <p style="margin-bottom: 1.5rem; opacity: 0.9;">Remember patterns and sequences!</p>
                    <button class="btn-primary" onclick="playMemoryMaster()" style="background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.3); padding: 0.8rem 1.5rem; border-radius: 25px; cursor: pointer; font-weight: 600;">Play Now!</button>
                </div>
                
                <div class="arcade-game-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 2rem; border-radius: 15px; color: white; text-align: center; transition: transform 0.3s ease; box-shadow: 0 8px 25px rgba(240, 147, 251, 0.3);">
                    <div class="game-icon" style="font-size: 3.5rem; margin-bottom: 1rem;">🌈</div>
                    <h4 style="margin-bottom: 1rem; font-size: 1.3rem;">Color Quest</h4>
                    <p style="margin-bottom: 1.5rem; opacity: 0.9;">Match colors and complete quests!</p>
                    <button class="btn-primary" onclick="playColorQuest()" style="background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.3); padding: 0.8rem 1.5rem; border-radius: 25px; cursor: pointer; font-weight: 600;">Play Now!</button>
                </div>
                
                <div class="arcade-game-card" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 2rem; border-radius: 15px; color: #333; text-align: center; transition: transform 0.3s ease; box-shadow: 0 8px 25px rgba(168, 237, 234, 0.3);">
                    <div class="game-icon" style="font-size: 3.5rem; margin-bottom: 1rem;">🎯</div>
                    <h4 style="margin-bottom: 1rem; font-size: 1.3rem;">Shape Shooter</h4>
                    <p style="margin-bottom: 1.5rem; opacity: 0.8;">Identify and shoot the right shapes!</p>
                    <button class="btn-primary" onclick="playShapeShooter()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 25px; cursor: pointer; font-weight: 600;">Play Now!</button>
                </div>
                
                <div class="arcade-game-card" style="background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%); padding: 2rem; border-radius: 15px; color: #333; text-align: center; transition: transform 0.3s ease; box-shadow: 0 8px 25px rgba(255, 234, 167, 0.3);">
                    <div class="game-icon" style="font-size: 3.5rem; margin-bottom: 1rem;">🎵</div>
                    <h4 style="margin-bottom: 1rem; font-size: 1.3rem;">Rhythm Learning</h4>
                    <p style="margin-bottom: 1.5rem; opacity: 0.8;">Learn with music and rhythm!</p>
                    <button class="btn-primary" onclick="playRhythmGame()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 25px; cursor: pointer; font-weight: 600;">Play Now!</button>
                </div>
                
                <div class="arcade-game-card" style="background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%); padding: 2rem; border-radius: 15px; color: white; text-align: center; transition: transform 0.3s ease; box-shadow: 0 8px 25px rgba(116, 185, 255, 0.3);">
                    <div class="game-icon" style="font-size: 3.5rem; margin-bottom: 1rem;">🧠</div>
                    <h4 style="margin-bottom: 1rem; font-size: 1.3rem;">Trivia Challenge ⭐</h4>
                    <p style="margin-bottom: 1.5rem; opacity: 0.9;">Answer real trivia questions from around the world!</p>
                    <button class="btn-primary" onclick="playTriviaGame('easy')" style="background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.3); padding: 0.8rem 1.5rem; border-radius: 25px; cursor: pointer; font-weight: 600;">Play Now!</button>
                </div>
                
                <div class="arcade-game-card" style="background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%); padding: 2rem; border-radius: 15px; color: white; text-align: center; transition: transform 0.3s ease; box-shadow: 0 8px 25px rgba(253, 121, 168, 0.3);">
                    <div class="game-icon" style="font-size: 3.5rem; margin-bottom: 1rem;">🚀</div>
                    <h4 style="margin-bottom: 1rem; font-size: 1.3rem;">Space Explorer ⭐</h4>
                    <p style="margin-bottom: 1.5rem; opacity: 0.9;">Explore real NASA space images and learn!</p>
                    <button class="btn-primary" onclick="playSpaceExplorer()" style="background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.3); padding: 0.8rem 1.5rem; border-radius: 25px; cursor: pointer; font-weight: 600;">Play Now!</button>
                </div>
                
            </div>
            
            <div style="background: linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%); padding: 1.5rem; border-radius: 15px; margin-top: 2rem; border-left: 5px solid #27ae60;">
                <p style="margin: 0; font-weight: 600; color: #2d3436; font-size: 1.1rem;">💡 All arcade games are FREE to play and give you points for learning!</p>
            </div>
        </div>
    `);
}

function openSports() {
    showModal('Sports & Activities', `
        <h3><i class="fas fa-football-ball"></i> Get Moving!</h3>
        <div class="sports-grid">
            <button class="btn-primary" onclick="doJumpingJacks()">Jumping Jacks</button>
            <button class="btn-primary" onclick="doYoga()">Kids Yoga</button>
            <button class="btn-primary" onclick="doDancing()">Dance Party</button>
            <button class="btn-primary" onclick="doStretching()">Stretching</button>
        </div>
        <p>Stay healthy and active while having fun!</p>
    `);
}

function openPrizes() {
    const availablePrizes = getPrizesForPoints(currentStudent.points);
    const ownedPrizes = JSON.parse(localStorage.getItem('ownedPrizes') || '[]');
    
    showModal('Prize Shop & Games', `
        <h3><i class="fas fa-gift"></i> Amazing Prizes & Games!</h3>
        <p>You have <strong>${currentStudent.points}</strong> points to spend!</p>
        <p>💡 Each prize unlocks a special game you can play anytime!</p>
        
        <div class="prizes-grid">
            ${availablePrizes.map(prize => `
                <div class="prize-item ${prize.canAfford ? '' : 'disabled'}">
                    <div class="prize-icon">${prize.icon}</div>
                    <h4>${prize.name}</h4>
                    <p class="prize-description">${prize.description}</p>
                    <p class="game-unlock">🎮 ${prize.gameDescription}</p>
                    <p class="prize-cost">💰 ${prize.cost} points</p>
                    ${ownedPrizes.includes(prize.id) ? 
                        `<button class="btn-secondary" onclick="playPrizeGame('${prize.id}')">Play Game!</button>` :
                        prize.canAfford ? 
                            `<button class="btn-primary" onclick="redeemPrize('${prize.id}', ${prize.cost})">Buy & Unlock Game</button>` :
                            `<button class="btn-primary" disabled>Need ${prize.cost - currentStudent.points} more points</button>`
                    }
                </div>
            `).join('')}
        </div>
        
        ${ownedPrizes.length > 0 ? `
            <div class="owned-games">
                <h4>🎮 Your Unlocked Games:</h4>
                <p>You own ${ownedPrizes.length} special game${ownedPrizes.length === 1 ? '' : 's'}! Click "Play Game!" on any owned prize above.</p>
            </div>
        ` : ''}
    `);
}

function getPrizesForPoints(points) {
    const allPrizes = [
        { 
            id: 'sticker', 
            name: 'Virtual Sticker', 
            cost: 10, 
            icon: '⭐', 
            canAfford: points >= 10,
            description: 'Unlock the Sticker Collection game!',
            gameDescription: 'Collect and arrange virtual stickers'
        },
        { 
            id: 'badge', 
            name: 'Achievement Badge', 
            cost: 25, 
            icon: '🏆', 
            canAfford: points >= 25,
            description: 'Unlock the Badge Builder game!',
            gameDescription: 'Design and customize your own badges'
        },
        { 
            id: 'certificate', 
            name: 'Learning Certificate', 
            cost: 50, 
            icon: '📜', 
            canAfford: points >= 50,
            description: 'Unlock the Certificate Designer game!',
            gameDescription: 'Create personalized learning certificates'
        },
        { 
            id: 'trophy', 
            name: 'Golden Trophy', 
            cost: 100, 
            icon: '🥇', 
            canAfford: points >= 100,
            description: 'Unlock the Trophy Case game!',
            gameDescription: 'Build and manage your trophy collection'
        },
        { 
            id: 'crown', 
            name: 'Learning Crown', 
            cost: 150, 
            icon: '👑', 
            canAfford: points >= 150,
            description: 'Unlock the Royal Kingdom game!',
            gameDescription: 'Rule your own learning kingdom'
        }
    ];
    
    return allPrizes;
}

function redeemPrize(prizeId, cost) {
    if (currentStudent.points >= cost) {
        currentStudent.points -= cost;
        saveStudentData();
        displayStudentInfo();
        
        // Add to owned prizes
        let ownedPrizes = JSON.parse(localStorage.getItem('ownedPrizes') || '[]');
        if (!ownedPrizes.includes(prizeId)) {
            ownedPrizes.push(prizeId);
            localStorage.setItem('ownedPrizes', JSON.stringify(ownedPrizes));
        }
        
        const prizeNames = {
            'sticker': 'Virtual Sticker',
            'badge': 'Achievement Badge',
            'certificate': 'Learning Certificate',
            'trophy': 'Golden Trophy',
            'crown': 'Learning Crown'
        };
        
        addAchievement(`Unlocked ${prizeNames[prizeId]} game!`);
        showModal('Prize & Game Unlocked!', `
            <div class="game-result success">
                <div class="result-icon">🎉</div>
                <h3>Congratulations!</h3>
                <p>You redeemed your <strong>${prizeNames[prizeId]}</strong>!</p>
                <p>🎮 <strong>Game Unlocked!</strong> You can now play the special ${prizeNames[prizeId]} game anytime!</p>
                <button class="btn-primary" onclick="playPrizeGame('${prizeId}')">Play Game Now!</button>
                <button class="btn-secondary" onclick="closeModal()">Play Later</button>
            </div>
        `);
    }
}

// Prize Game Functions
function playPrizeGame(prizeId) {
    const gameData = getPrizeGameData(prizeId);
    
    showModal(`${gameData.title} 🎮`, `
        <div class="prize-game-container">
            <div class="game-header">
                <h3>${gameData.icon} ${gameData.title}</h3>
                <p>${gameData.description}</p>
            </div>
            
            <div class="prize-game-area" id="prizeGameArea">
                ${gameData.content}
            </div>
            
            <div class="game-controls">
                ${gameData.controls}
            </div>
        </div>
    `);
    
    // Initialize the specific game
    initializePrizeGame(prizeId);
}

function getPrizeGameData(prizeId) {
    const games = {
        'sticker': {
            title: 'Sticker Collection Game',
            icon: '⭐',
            description: 'Collect and arrange beautiful virtual stickers!',
            content: `
                <div class="sticker-game">
                    <div class="sticker-board" id="stickerBoard">
                        <div class="board-slot" onclick="placeSticker(0)"></div>
                        <div class="board-slot" onclick="placeSticker(1)"></div>
                        <div class="board-slot" onclick="placeSticker(2)"></div>
                        <div class="board-slot" onclick="placeSticker(3)"></div>
                        <div class="board-slot" onclick="placeSticker(4)"></div>
                        <div class="board-slot" onclick="placeSticker(5)"></div>
                    </div>
                    <div class="sticker-collection">
                        <h4>Available Stickers:</h4>
                        <div class="sticker-options">
                            <div class="sticker-option" onclick="selectSticker('⭐')">⭐</div>
                            <div class="sticker-option" onclick="selectSticker('🌟')">🌟</div>
                            <div class="sticker-option" onclick="selectSticker('✨')">✨</div>
                            <div class="sticker-option" onclick="selectSticker('🎉')">🎉</div>
                            <div class="sticker-option" onclick="selectSticker('🏆')">🏆</div>
                            <div class="sticker-option" onclick="selectSticker('🎨')">🎨</div>
                        </div>
                    </div>
                    <input type="hidden" id="selectedSticker" value="⭐">
                </div>
            `,
            controls: `
                <button class="btn-primary" onclick="clearStickerBoard()">Clear Board</button>
                <button class="btn-secondary" onclick="saveStickerBoard()">Save Creation</button>
            `
        },
        'badge': {
            title: 'Badge Builder Game',
            icon: '🏆',
            description: 'Design your own custom achievement badges!',
            content: `
                <div class="badge-game">
                    <div class="badge-designer">
                        <div class="badge-preview" id="badgePreview">
                            <div class="badge-icon" id="badgeIcon">🏆</div>
                            <div class="badge-text" id="badgeText">AWESOME</div>
                        </div>
                    </div>
                    <div class="design-controls">
                        <div class="control-group">
                            <label>Choose Icon:</label>
                            <div class="icon-options">
                                <button class="icon-btn" onclick="setBadgeIcon('🏆')">🏆</button>
                                <button class="icon-btn" onclick="setBadgeIcon('⭐')">⭐</button>
                                <button class="icon-btn" onclick="setBadgeIcon('🎯')">🎯</button>
                                <button class="icon-btn" onclick="setBadgeIcon('🌟')">🌟</button>
                                <button class="icon-btn" onclick="setBadgeIcon('🎪')">🎪</button>
                            </div>
                        </div>
                        <div class="control-group">
                            <label>Badge Text:</label>
                            <input type="text" id="badgeTextInput" value="AWESOME" onchange="updateBadgeText()" maxlength="10">
                        </div>
                    </div>
                </div>
            `,
            controls: `
                <button class="btn-primary" onclick="saveBadgeDesign()">Save Badge</button>
                <button class="btn-secondary" onclick="randomizeBadge()">Random Design</button>
            `
        },
        'certificate': {
            title: 'Certificate Designer',
            icon: '📜',
            description: 'Create beautiful learning certificates!',
            content: `
                <div class="certificate-game">
                    <div class="certificate-preview" id="certificatePreview">
                        <div class="cert-header">🎓 CERTIFICATE OF ACHIEVEMENT 🎓</div>
                        <div class="cert-recipient">Awarded to: <span id="certName">${currentStudent.name || 'Student'}</span></div>
                        <div class="cert-achievement">For: <span id="certAchievement">Outstanding Learning</span></div>
                        <div class="cert-date">Date: <span id="certDate">${new Date().toLocaleDateString()}</span></div>
                        <div class="cert-signature">April Xu's Learning Website ⭐</div>
                    </div>
                    <div class="cert-controls">
                        <label>Achievement:</label>
                        <select id="achievementSelect" onchange="updateCertificate()">
                            <option value="Outstanding Learning">Outstanding Learning</option>
                            <option value="Perfect Attendance">Perfect Attendance</option>
                            <option value="Reading Champion">Reading Champion</option>
                            <option value="Math Wizard">Math Wizard</option>
                            <option value="Creative Genius">Creative Genius</option>
                            <option value="Kind Heart">Kind Heart</option>
                        </select>
                    </div>
                </div>
            `,
            controls: `
                <button class="btn-primary" onclick="printCertificate()">Save Certificate</button>
                <button class="btn-secondary" onclick="newCertificate()">New Certificate</button>
            `
        },
        'trophy': {
            title: 'Trophy Case Manager',
            icon: '🥇',
            description: 'Build and organize your trophy collection!',
            content: `
                <div class="trophy-game">
                    <div class="trophy-case" id="trophyCase">
                        <h4>🏆 Your Trophy Case 🏆</h4>
                        <div class="trophy-shelf" id="trophyShelf1">
                            <div class="trophy-slot" onclick="placeTrophy(0)"></div>
                            <div class="trophy-slot" onclick="placeTrophy(1)"></div>
                            <div class="trophy-slot" onclick="placeTrophy(2)"></div>
                        </div>
                        <div class="trophy-shelf" id="trophyShelf2">
                            <div class="trophy-slot" onclick="placeTrophy(3)"></div>
                            <div class="trophy-slot" onclick="placeTrophy(4)"></div>
                            <div class="trophy-slot" onclick="placeTrophy(5)"></div>
                        </div>
                    </div>
                    <div class="trophy-inventory">
                        <h4>Available Trophies:</h4>
                        <div class="trophy-options">
                            <div class="trophy-option" onclick="selectTrophy('🥇')">🥇</div>
                            <div class="trophy-option" onclick="selectTrophy('🥈')">🥈</div>
                            <div class="trophy-option" onclick="selectTrophy('🥉')">🥉</div>
                            <div class="trophy-option" onclick="selectTrophy('🏆')">🏆</div>
                            <div class="trophy-option" onclick="selectTrophy('🏅')">🏅</div>
                            <div class="trophy-option" onclick="selectTrophy('⭐')">⭐</div>
                        </div>
                    </div>
                    <input type="hidden" id="selectedTrophy" value="🏆">
                </div>
            `,
            controls: `
                <button class="btn-primary" onclick="clearTrophyCase()">Clear Case</button>
                <button class="btn-secondary" onclick="saveTrophyCase()">Save Collection</button>
            `
        },
        'crown': {
            title: 'Royal Kingdom Builder',
            icon: '👑',
            description: 'Rule your own magical learning kingdom!',
            content: `
                <div class="kingdom-game">
                    <div class="kingdom-map" id="kingdomMap">
                        <div class="kingdom-tile castle" onclick="buildInKingdom(0)">🏰</div>
                        <div class="kingdom-tile" onclick="buildInKingdom(1)"></div>
                        <div class="kingdom-tile" onclick="buildInKingdom(2)"></div>
                        <div class="kingdom-tile" onclick="buildInKingdom(3)"></div>
                        <div class="kingdom-tile" onclick="buildInKingdom(4)"></div>
                        <div class="kingdom-tile" onclick="buildInKingdom(5)"></div>
                        <div class="kingdom-tile" onclick="buildInKingdom(6)"></div>
                        <div class="kingdom-tile" onclick="buildInKingdom(7)"></div>
                        <div class="kingdom-tile" onclick="buildInKingdom(8)"></div>
                    </div>
                    <div class="building-options">
                        <h4>Build:</h4>
                        <div class="building-buttons">
                            <button class="building-btn" onclick="selectBuilding('🏠')">🏠 House</button>
                            <button class="building-btn" onclick="selectBuilding('🌳')">🌳 Tree</button>
                            <button class="building-btn" onclick="selectBuilding('🌸')">🌸 Garden</button>
                            <button class="building-btn" onclick="selectBuilding('🛤️')">🛤️ Path</button>
                            <button class="building-btn" onclick="selectBuilding('⛲')">⛲ Fountain</button>
                        </div>
                    </div>
                    <input type="hidden" id="selectedBuilding" value="🏠">
                    <div class="kingdom-stats">
                        <p>Population: <span id="population">1</span> | Happiness: <span id="happiness">😊</span></p>
                    </div>
                </div>
            `,
            controls: `
                <button class="btn-primary" onclick="saveKingdom()">Save Kingdom</button>
                <button class="btn-secondary" onclick="resetKingdom()">New Kingdom</button>
            `
        }
    };
    
    return games[prizeId] || games['sticker'];
}

// Prize Game Interaction Functions
let gameStates = {};

function initializePrizeGame(prizeId) {
    gameStates[prizeId] = {};
    
    // Load saved game state if exists
    const savedState = localStorage.getItem(`prizeGame_${prizeId}`);
    if (savedState) {
        gameStates[prizeId] = JSON.parse(savedState);
        loadGameState(prizeId);
    }
}

function loadGameState(prizeId) {
    const state = gameStates[prizeId];
    
    switch(prizeId) {
        case 'sticker':
            if (state.board) {
                state.board.forEach((sticker, index) => {
                    if (sticker) {
                        const slot = document.querySelectorAll('.board-slot')[index];
                        if (slot) slot.textContent = sticker;
                    }
                });
            }
            break;
        case 'trophy':
            if (state.trophies) {
                state.trophies.forEach((trophy, index) => {
                    if (trophy) {
                        const slot = document.querySelectorAll('.trophy-slot')[index];
                        if (slot) slot.textContent = trophy;
                    }
                });
            }
            break;
        case 'crown':
            if (state.kingdom) {
                state.kingdom.forEach((building, index) => {
                    if (building) {
                        const tile = document.querySelectorAll('.kingdom-tile')[index];
                        if (tile && !tile.classList.contains('castle')) {
                            tile.textContent = building;
                        }
                    }
                });
                if (state.population) {
                    document.getElementById('population').textContent = state.population;
                }
            }
            break;
    }
}

// Sticker Game Functions
function selectSticker(sticker) {
    document.getElementById('selectedSticker').value = sticker;
    document.querySelectorAll('.sticker-option').forEach(opt => opt.classList.remove('selected'));
    event.target.classList.add('selected');
}

function placeSticker(slotIndex) {
    const selectedSticker = document.getElementById('selectedSticker').value;
    const slot = document.querySelectorAll('.board-slot')[slotIndex];
    slot.textContent = selectedSticker;
    
    // Save state
    if (!gameStates['sticker'].board) gameStates['sticker'].board = [];
    gameStates['sticker'].board[slotIndex] = selectedSticker;
}

function clearStickerBoard() {
    document.querySelectorAll('.board-slot').forEach(slot => slot.textContent = '');
    gameStates['sticker'].board = [];
}

function saveStickerBoard() {
    localStorage.setItem('prizeGame_sticker', JSON.stringify(gameStates['sticker']));
    addPoints(2, 'creating sticker art');
    showModal('Sticker Art Saved! 🎨', `
        <div class="free-activity">
            <div class="result-icon">🎨</div>
            <h3>Beautiful Creation!</h3>
            <p>Your sticker art has been saved!</p>
            <p>You earned <strong>2 points</strong> for being creative!</p>
            <button class="btn-primary" onclick="closeModal()">Awesome!</button>
        </div>
    `);
}

// Badge Game Functions
function setBadgeIcon(icon) {
    document.getElementById('badgeIcon').textContent = icon;
    document.querySelectorAll('.icon-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
}

function updateBadgeText() {
    const text = document.getElementById('badgeTextInput').value.toUpperCase();
    document.getElementById('badgeText').textContent = text;
}

function saveBadgeDesign() {
    const icon = document.getElementById('badgeIcon').textContent;
    const text = document.getElementById('badgeText').textContent;
    
    gameStates['badge'] = { icon, text };
    localStorage.setItem('prizeGame_badge', JSON.stringify(gameStates['badge']));
    
    addPoints(3, 'designing a badge');
    showModal('Badge Saved! 🏆', `
        <div class="free-activity">
            <div class="result-icon">🏆</div>
            <h3>Amazing Design!</h3>
            <p>Your custom badge "${text}" has been saved!</p>
            <p>You earned <strong>3 points</strong> for your creativity!</p>
            <button class="btn-primary" onclick="closeModal()">Fantastic!</button>
        </div>
    `);
}

function randomizeBadge() {
    const icons = ['🏆', '⭐', '🎯', '🌟', '🎪'];
    const texts = ['SUPER', 'AWESOME', 'CHAMPION', 'WINNER', 'STAR', 'GENIUS'];
    
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    
    setBadgeIcon(randomIcon);
    document.getElementById('badgeTextInput').value = randomText;
    updateBadgeText();
}

// Certificate Game Functions
function updateCertificate() {
    const achievement = document.getElementById('achievementSelect').value;
    document.getElementById('certAchievement').textContent = achievement;
}

function printCertificate() {
    const achievement = document.getElementById('certAchievement').textContent;
    addPoints(4, 'creating a certificate');
    addAchievement(`Created certificate for ${achievement}!`);
    
    showModal('Certificate Created! 📜', `
        <div class="free-activity">
            <div class="result-icon">📜</div>
            <h3>Certificate Completed!</h3>
            <p>Your certificate for "${achievement}" has been created!</p>
            <p>You earned <strong>4 points</strong> for your achievement!</p>
            <button class="btn-primary" onclick="closeModal()">Excellent!</button>
        </div>
    `);
}

function newCertificate() {
    document.getElementById('achievementSelect').selectedIndex = 0;
    updateCertificate();
}

// Trophy Game Functions
function selectTrophy(trophy) {
    document.getElementById('selectedTrophy').value = trophy;
    document.querySelectorAll('.trophy-option').forEach(opt => opt.classList.remove('selected'));
    event.target.classList.add('selected');
}

function placeTrophy(slotIndex) {
    const selectedTrophy = document.getElementById('selectedTrophy').value;
    const slot = document.querySelectorAll('.trophy-slot')[slotIndex];
    slot.textContent = selectedTrophy;
    
    if (!gameStates['trophy'].trophies) gameStates['trophy'].trophies = [];
    gameStates['trophy'].trophies[slotIndex] = selectedTrophy;
}

function clearTrophyCase() {
    document.querySelectorAll('.trophy-slot').forEach(slot => slot.textContent = '');
    gameStates['trophy'].trophies = [];
}

function saveTrophyCase() {
    localStorage.setItem('prizeGame_trophy', JSON.stringify(gameStates['trophy']));
    addPoints(5, 'organizing trophy case');
    showModal('Trophy Case Saved! 🏆', `
        <div class="free-activity">
            <div class="result-icon">🏆</div>
            <h3>Trophy Case Complete!</h3>
            <p>Your trophy collection has been saved!</p>
            <p>You earned <strong>5 points</strong> for organization!</p>
            <button class="btn-primary" onclick="closeModal()">Magnificent!</button>
        </div>
    `);
}

// Kingdom Game Functions
function selectBuilding(building) {
    document.getElementById('selectedBuilding').value = building;
    document.querySelectorAll('.building-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
}

function buildInKingdom(tileIndex) {
    const selectedBuilding = document.getElementById('selectedBuilding').value;
    const tile = document.querySelectorAll('.kingdom-tile')[tileIndex];
    
    if (!tile.classList.contains('castle')) {
        tile.textContent = selectedBuilding;
        
        if (!gameStates['crown'].kingdom) gameStates['crown'].kingdom = [];
        gameStates['crown'].kingdom[tileIndex] = selectedBuilding;
        
        // Update population
        const buildings = gameStates['crown'].kingdom.filter(b => b === '🏠').length;
        const population = 1 + buildings;
        gameStates['crown'].population = population;
        document.getElementById('population').textContent = population;
        
        // Update happiness based on variety
        const uniqueBuildings = [...new Set(gameStates['crown'].kingdom.filter(b => b))].length;
        const happiness = uniqueBuildings >= 3 ? '😄' : uniqueBuildings >= 2 ? '😊' : '🙂';
        document.getElementById('happiness').textContent = happiness;
    }
}

function saveKingdom() {
    localStorage.setItem('prizeGame_crown', JSON.stringify(gameStates['crown']));
    const population = gameStates['crown'].population || 1;
    addPoints(population + 3, 'building a kingdom');
    
    showModal('Kingdom Saved! 👑', `
        <div class="free-activity">
            <div class="result-icon">👑</div>
            <h3>Royal Kingdom Complete!</h3>
            <p>Your kingdom with ${population} citizens has been saved!</p>
            <p>You earned <strong>${population + 3} points</strong> for your leadership!</p>
            <button class="btn-primary" onclick="closeModal()">Long Live the King/Queen!</button>
        </div>
    `);
}

function resetKingdom() {
    document.querySelectorAll('.kingdom-tile').forEach((tile, index) => {
        if (!tile.classList.contains('castle')) {
            tile.textContent = '';
        }
    });
    gameStates['crown'] = {};
    document.getElementById('population').textContent = '1';
    document.getElementById('happiness').textContent = '😊';
}

// Reading Game Functions
function playReadingComprehensionGame() {
    const stories = getReadingStories(currentStudent.grade);
    const randomStory = stories[Math.floor(Math.random() * stories.length)];
    
    showModal('📖 Reading Comprehension Game', `
        <div class="reading-game-container">
            <div class="story-section">
                <h3>${randomStory.title}</h3>
                <div class="story-text" id="storyText">
                    ${randomStory.text}
                </div>
            </div>
            
            <div class="comprehension-section" id="comprehensionSection">
                <h4>📝 Questions about the story:</h4>
                <div class="question-container">
                    <p class="question"><strong>Question 1:</strong> ${randomStory.questions[0].question}</p>
                    <div class="answer-options">
                        ${randomStory.questions[0].options.map((option, index) => `
                            <button class="answer-btn" onclick="selectAnswer(0, ${index}, '${randomStory.questions[0].correct}')">
                                ${option}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <div class="reading-score" id="readingScore">Score: 0 / ${randomStory.questions.length}</div>
            </div>
            
            <div class="reading-controls">
                <button class="btn-primary" onclick="nextQuestion()" id="nextBtn" style="display: none;">Next Question</button>
                <button class="btn-secondary" onclick="finishReadingGame()" id="finishBtn" style="display: none;">Finish Game</button>
            </div>
            
            <input type="hidden" id="currentQuestion" value="0">
            <input type="hidden" id="totalQuestions" value="${randomStory.questions.length}">
            <input type="hidden" id="correctAnswers" value="0">
            <input type="hidden" id="currentStory" value='${JSON.stringify(randomStory)}'>
        </div>
    `);
}

function getReadingStories(grade) {
    const stories = {
        'prek': [
            {
                title: "🐱 The Happy Cat",
                text: "There was a happy cat named Fluffy. Fluffy was orange and white. She liked to play with a red ball. Every day, Fluffy would run and jump. She was a very happy cat!",
                questions: [
                    {
                        question: "What color was Fluffy?",
                        options: ["Blue and green", "Orange and white", "Black and brown"],
                        correct: 1
                    },
                    {
                        question: "What did Fluffy like to play with?",
                        options: ["A red ball", "A blue toy", "A yellow stick"],
                        correct: 0
                    }
                ]
            },
            {
                title: "🌞 Sunny Day Fun",
                text: "Tom went to the park on a sunny day. He saw birds singing in the trees. Tom played on the swings and went down the slide. He had so much fun at the park!",
                questions: [
                    {
                        question: "Where did Tom go?",
                        options: ["To school", "To the park", "To the store"],
                        correct: 1
                    },
                    {
                        question: "What were the birds doing?",
                        options: ["Flying", "Singing", "Sleeping"],
                        correct: 1
                    }
                ]
            }
        ],
        'kindergarten': [
            {
                title: "🦋 The Magic Garden",
                text: "Emma found a secret garden behind her house. The garden had beautiful flowers of many colors. She saw butterflies dancing around the flowers. A friendly rabbit was eating carrots near the fence. Emma decided to visit the garden every day.",
                questions: [
                    {
                        question: "Where did Emma find the garden?",
                        options: ["In front of her house", "Behind her house", "At the school"],
                        correct: 1
                    },
                    {
                        question: "What was the rabbit eating?",
                        options: ["Flowers", "Grass", "Carrots"],
                        correct: 2
                    },
                    {
                        question: "What were dancing around the flowers?",
                        options: ["Butterflies", "Bees", "Birds"],
                        correct: 0
                    }
                ]
            }
        ],
        '1st': [
            {
                title: "🚀 Space Adventure",
                text: "Captain Luna and her crew were exploring a new planet. The planet had purple skies and silver trees. They discovered friendly aliens who loved to share stories. The aliens taught them about their amazing crystal caves. Captain Luna promised to return and learn more about this wonderful world.",
                questions: [
                    {
                        question: "What color were the skies on the new planet?",
                        options: ["Blue", "Purple", "Green"],
                        correct: 1
                    },
                    {
                        question: "What did the aliens love to do?",
                        options: ["Share stories", "Play games", "Sing songs"],
                        correct: 0
                    },
                    {
                        question: "What did Captain Luna promise to do?",
                        options: ["Stay forever", "Return and learn more", "Take the aliens home"],
                        correct: 1
                    }
                ]
            }
        ],
        '2nd': [
            {
                title: "🌟 The Brave Little Star",
                text: "In the dark night sky, there lived a little star named Stella. Unlike other stars, Stella was very dim and felt sad because she couldn't shine brightly. One night, a lost airplane was flying through thick clouds and couldn't find its way. Stella used all her energy to shine as bright as she could, guiding the airplane safely to the airport. From that day on, Stella realized that being different made her special, and she was proud of her unique light.",
                questions: [
                    {
                        question: "Why was Stella feeling sad?",
                        options: ["She was lonely", "She couldn't shine brightly", "She was too far away"],
                        correct: 1
                    },
                    {
                        question: "How did Stella help the airplane?",
                        options: ["She called for help", "She guided it with her light", "She moved the clouds"],
                        correct: 1
                    },
                    {
                        question: "What lesson did Stella learn?",
                        options: ["Being different made her special", "She should be like other stars", "She needed to be bigger"],
                        correct: 0
                    }
                ]
            }
        ]
    };
    
    return stories[grade] || stories['kindergarten'];
}

function selectAnswer(questionIndex, selectedIndex, correctIndex) {
    const answerBtns = document.querySelectorAll('.answer-btn');
    answerBtns.forEach(btn => btn.disabled = true);
    
    const currentQuestion = parseInt(document.getElementById('currentQuestion').value);
    const correctAnswers = parseInt(document.getElementById('correctAnswers').value);
    
    if (selectedIndex === correctIndex) {
        answerBtns[selectedIndex].style.background = 'linear-gradient(135deg, #27ae60 0%, #2ed573 100%)';
        answerBtns[selectedIndex].style.color = 'white';
        document.getElementById('correctAnswers').value = correctAnswers + 1;
        
        showFeedback("🎉 Correct! Great reading!", "success");
    } else {
        answerBtns[selectedIndex].style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
        answerBtns[correctIndex].style.background = 'linear-gradient(135deg, #27ae60 0%, #2ed573 100%)';
        answerBtns.forEach(btn => btn.style.color = 'white');
        
        showFeedback("📚 Good try! Keep reading carefully.", "try-again");
    }
    
    updateReadingScore();
    
    const totalQuestions = parseInt(document.getElementById('totalQuestions').value);
    if (currentQuestion + 1 < totalQuestions) {
        document.getElementById('nextBtn').style.display = 'inline-block';
    } else {
        document.getElementById('finishBtn').style.display = 'inline-block';
    }
}

function updateReadingScore() {
    const correctAnswers = parseInt(document.getElementById('correctAnswers').value);
    const currentQuestion = parseInt(document.getElementById('currentQuestion').value) + 1;
    const totalQuestions = parseInt(document.getElementById('totalQuestions').value);
    
    document.getElementById('readingScore').textContent = `Score: ${correctAnswers} / ${currentQuestion} answered`;
}

function nextQuestion() {
    const currentQuestion = parseInt(document.getElementById('currentQuestion').value);
    const story = JSON.parse(document.getElementById('currentStory').value);
    const nextQ = currentQuestion + 1;
    
    document.getElementById('currentQuestion').value = nextQ;
    
    const questionContainer = document.querySelector('.question-container');
    questionContainer.innerHTML = `
        <p class="question"><strong>Question ${nextQ + 1}:</strong> ${story.questions[nextQ].question}</p>
        <div class="answer-options">
            ${story.questions[nextQ].options.map((option, index) => `
                <button class="answer-btn" onclick="selectAnswer(${nextQ}, ${index}, ${story.questions[nextQ].correct})">
                    ${option}
                </button>
            `).join('')}
        </div>
    `;
    
    document.getElementById('nextBtn').style.display = 'none';
    clearFeedback();
}

function finishReadingGame() {
    const correctAnswers = parseInt(document.getElementById('correctAnswers').value);
    const totalQuestions = parseInt(document.getElementById('totalQuestions').value);
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    let points = correctAnswers * 5; // 5 points per correct answer
    let message = '';
    let icon = '';
    
    if (percentage >= 80) {
        points += 10; // Bonus for excellent performance
        message = `Outstanding reading! You got ${correctAnswers} out of ${totalQuestions} correct!`;
        icon = '🌟';
    } else if (percentage >= 60) {
        points += 5; // Small bonus for good performance
        message = `Great job reading! You got ${correctAnswers} out of ${totalQuestions} correct!`;
        icon = '📚';
    } else {
        message = `Good effort! You got ${correctAnswers} out of ${totalQuestions} correct. Keep practicing your reading!`;
        icon = '💪';
    }
    
    addPoints(points, 'completing reading comprehension game');
    
    showModal('Reading Game Complete! 📖', `
        <div class="game-result success">
            <div class="result-icon">${icon}</div>
            <h3>Reading Adventure Complete!</h3>
            <p>${message}</p>
            <p>You earned <strong>${points} points</strong>!</p>
            <p class="encouragement">Reading helps us learn and grow! 📚</p>
            <button class="btn-primary" onclick="playReadingComprehensionGame()">Play Again</button>
            <button class="btn-secondary" onclick="closeModal()">Done Reading</button>
        </div>
    `);
}

function playStoryBuilderGame() {
    showModal('📝 Story Builder Game', `
        <div class="story-builder-container">
            <h3>🎨 Create Your Own Story!</h3>
            <p>Choose words to build an amazing story!</p>
            
            <div class="story-template">
                <p>Once upon a time, there was a 
                    <select id="character" onchange="updateStory()">
                        <option value="">Choose...</option>
                        <option value="brave knight">brave knight</option>
                        <option value="friendly dragon">friendly dragon</option>
                        <option value="curious cat">curious cat</option>
                        <option value="wise owl">wise owl</option>
                        <option value="happy elephant">happy elephant</option>
                    </select>
                    who lived in a 
                    <select id="place" onchange="updateStory()">
                        <option value="">Choose...</option>
                        <option value="magical castle">magical castle</option>
                        <option value="enchanted forest">enchanted forest</option>
                        <option value="cozy house">cozy house</option>
                        <option value="beautiful garden">beautiful garden</option>
                        <option value="tall tree">tall tree</option>
                    </select>.
                </p>
                
                <p>One day, they decided to 
                    <select id="action" onchange="updateStory()">
                        <option value="">Choose...</option>
                        <option value="go on an adventure">go on an adventure</option>
                        <option value="help their friends">help their friends</option>
                        <option value="learn something new">learn something new</option>
                        <option value="explore the world">explore the world</option>
                        <option value="solve a mystery">solve a mystery</option>
                    </select>
                    and they felt very 
                    <select id="feeling" onchange="updateStory()">
                        <option value="">Choose...</option>
                        <option value="excited">excited</option>
                        <option value="happy">happy</option>
                        <option value="brave">brave</option>
                        <option value="curious">curious</option>
                        <option value="proud">proud</option>
                    </select>!
                </p>
            </div>
            
            <div class="your-story" id="yourStory">
                <h4>📖 Your Story:</h4>
                <p id="completeStory">Make your choices above to see your story!</p>
            </div>
            
            <div class="story-controls">
                <button class="btn-primary" onclick="saveStory()" id="saveStoryBtn" disabled>Save My Story</button>
                <button class="btn-secondary" onclick="randomStory()">Random Story</button>
                <button class="btn-secondary" onclick="clearStory()">Start Over</button>
            </div>
        </div>
    `);
}

function updateStory() {
    const character = document.getElementById('character').value;
    const place = document.getElementById('place').value;
    const action = document.getElementById('action').value;
    const feeling = document.getElementById('feeling').value;
    
    if (character && place && action && feeling) {
        const story = `Once upon a time, there was a ${character} who lived in a ${place}. One day, they decided to ${action} and they felt very ${feeling}! The End.`;
        
        document.getElementById('completeStory').textContent = story;
        document.getElementById('saveStoryBtn').disabled = false;
    } else {
        document.getElementById('completeStory').textContent = "Make your choices above to see your story!";
        document.getElementById('saveStoryBtn').disabled = true;
    }
}

function saveStory() {
    const story = document.getElementById('completeStory').textContent;
    
    // Save to local storage
    let savedStories = JSON.parse(localStorage.getItem('studentStories') || '[]');
    savedStories.push({
        story: story,
        date: new Date().toLocaleDateString(),
        author: currentStudent.name || 'Student'
    });
    localStorage.setItem('studentStories', JSON.stringify(savedStories));
    
    addPoints(8, 'creating an original story');
    addAchievement('Created a wonderful story!');
    
    showModal('Story Saved! 📚', `
        <div class="free-activity">
            <div class="result-icon">📖</div>
            <h3>Amazing Story Created!</h3>
            <p>Your story has been saved to your story collection!</p>
            <p>You earned <strong>8 points</strong> for being creative!</p>
            <p class="encouragement">Keep writing and creating stories! ✨</p>
            <button class="btn-primary" onclick="playStoryBuilderGame()">Write Another Story</button>
            <button class="btn-secondary" onclick="closeModal()">Done Writing</button>
        </div>
    `);
}

function randomStory() {
    const characters = ["brave knight", "friendly dragon", "curious cat", "wise owl", "happy elephant"];
    const places = ["magical castle", "enchanted forest", "cozy house", "beautiful garden", "tall tree"];
    const actions = ["go on an adventure", "help their friends", "learn something new", "explore the world", "solve a mystery"];
    const feelings = ["excited", "happy", "brave", "curious", "proud"];
    
    document.getElementById('character').value = characters[Math.floor(Math.random() * characters.length)];
    document.getElementById('place').value = places[Math.floor(Math.random() * places.length)];
    document.getElementById('action').value = actions[Math.floor(Math.random() * actions.length)];
    document.getElementById('feeling').value = feelings[Math.floor(Math.random() * feelings.length)];
    
    updateStory();
}

function clearStory() {
    document.getElementById('character').selectedIndex = 0;
    document.getElementById('place').selectedIndex = 0;
    document.getElementById('action').selectedIndex = 0;
    document.getElementById('feeling').selectedIndex = 0;
    document.getElementById('completeStory').textContent = "Make your choices above to see your story!";
    document.getElementById('saveStoryBtn').disabled = true;
}

function showFeedback(message, type) {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${type}`;
    feedback.textContent = message;
    
    const comprehensionSection = document.getElementById('comprehensionSection');
    const existingFeedback = comprehensionSection.querySelector('.feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    comprehensionSection.appendChild(feedback);
}

function clearFeedback() {
    const feedback = document.querySelector('.feedback');
    if (feedback) {
        feedback.remove();
    }
}

// Arcade Game functions
function playMathAdventure() {
    showModal('🔢 Math Adventure Game', `
        <div class="arcade-game-interface">
            <h3>🔢 Math Adventure</h3>
            <p>Solve the math problem to help the hero!</p>
            
            <div class="math-problem" id="mathProblem">
                <div class="problem-display">
                    <span id="num1">5</span> + <span id="num2">3</span> = ?
                </div>
                <div class="answer-input">
                    <input type="number" id="mathAnswer" placeholder="Your answer" min="0" max="100">
                </div>
                <button class="btn-primary" onclick="checkMathAnswer()">Submit Answer</button>
            </div>
            
            <div class="math-score">
                <p>Score: <span id="mathScore">0</span> / 5 problems</p>
            </div>
            
            <input type="hidden" id="correctAnswer" value="8">
            <input type="hidden" id="problemsCompleted" value="0">
        </div>
    `);
    generateMathProblem();
}

function generateMathProblem() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const answer = num1 + num2;
    
    document.getElementById('num1').textContent = num1;
    document.getElementById('num2').textContent = num2;
    document.getElementById('correctAnswer').value = answer;
    
    // Clear previous answer
    document.getElementById('mathAnswer').value = '';
}

function checkMathAnswer() {
    const userAnswer = parseInt(document.getElementById('mathAnswer').value);
    const correctAnswer = parseInt(document.getElementById('correctAnswer').value);
    const problemsCompleted = parseInt(document.getElementById('problemsCompleted').value);
    
    if (isNaN(userAnswer)) {
        alert('Please enter a number!');
        return;
    }
    
    if (userAnswer === correctAnswer) {
        const newScore = problemsCompleted + 1;
        document.getElementById('problemsCompleted').value = newScore;
        document.getElementById('mathScore').textContent = newScore;
        
        if (newScore >= 5) {
            addPoints(25, 'completing Math Adventure');
            showModal('Math Adventure Complete! 🏆', `
                <div class="game-result success">
                    <div class="result-icon">🏆</div>
                    <h3>Math Hero!</h3>
                    <p>You solved all 5 problems correctly!</p>
                    <p>You earned <strong>25 points</strong>!</p>
                    <button class="btn-primary" onclick="playMathAdventure()">Play Again</button>
                    <button class="btn-secondary" onclick="closeModal()">Back to Games</button>
                </div>
            `);
        } else {
            alert('🎉 Correct! Next problem...');
            generateMathProblem();
        }
    } else {
        alert(`❌ Try again! The answer is ${correctAnswer}`);
        generateMathProblem();
    }
}

function playWordBuilder() {
    showModal('🔤 Word Builder Game', `
        <div class="arcade-game-interface">
            <h3>🔤 Word Builder</h3>
            <p>Build words from the letters below!</p>
            
            <div class="word-challenge">
                <p>Make a word using these letters:</p>
                <div class="letter-tiles" id="letterTiles">
                    <span class="letter-tile">C</span>
                    <span class="letter-tile">A</span>
                    <span class="letter-tile">T</span>
                </div>
                
                <div class="word-input">
                    <input type="text" id="wordAnswer" placeholder="Type your word" maxlength="10">
                    <button class="btn-primary" onclick="checkWordAnswer()">Check Word</button>
                </div>
                
                <div class="word-hints">
                    <p>💡 Hint: A furry pet that says "meow"</p>
                </div>
            </div>
            
            <div class="word-score">
                <p>Words Found: <span id="wordsFound">0</span> / 3</p>
            </div>
            
            <input type="hidden" id="currentWordSet" value="0">
        </div>
    `);
}

function checkWordAnswer() {
    const userWord = document.getElementById('wordAnswer').value.toUpperCase();
    const wordSets = [
        { letters: ['C', 'A', 'T'], words: ['CAT'], hint: 'A furry pet that says "meow"' },
        { letters: ['D', 'O', 'G'], words: ['DOG'], hint: 'A loyal pet that barks' },
        { letters: ['S', 'U', 'N'], words: ['SUN'], hint: 'Bright star in the sky' }
    ];
    
    const currentSet = parseInt(document.getElementById('currentWordSet').value);
    const validWords = wordSets[currentSet].words;
    
    if (validWords.includes(userWord)) {
        const wordsFound = parseInt(document.getElementById('wordsFound').textContent) + 1;
        document.getElementById('wordsFound').textContent = wordsFound;
        
        if (wordsFound >= 3) {
            addPoints(20, 'completing Word Builder');
            showModal('Word Master! 📚', `
                <div class="game-result success">
                    <div class="result-icon">📚</div>
                    <h3>Word Builder Champion!</h3>
                    <p>You built all the words correctly!</p>
                    <p>You earned <strong>20 points</strong>!</p>
                    <button class="btn-primary" onclick="playWordBuilder()">Play Again</button>
                    <button class="btn-secondary" onclick="closeModal()">Back to Games</button>
                </div>
            `);
        } else {
            nextWordSet();
        }
    } else {
        alert('❌ Try again! Use the letters shown to make a word.');
    }
}

function nextWordSet() {
    const wordSets = [
        { letters: ['C', 'A', 'T'], hint: 'A furry pet that says "meow"' },
        { letters: ['D', 'O', 'G'], hint: 'A loyal pet that barks' },
        { letters: ['S', 'U', 'N'], hint: 'Bright star in the sky' }
    ];
    
    const currentSet = parseInt(document.getElementById('currentWordSet').value) + 1;
    document.getElementById('currentWordSet').value = currentSet;
    
    if (currentSet < wordSets.length) {
        const nextSet = wordSets[currentSet];
        document.getElementById('letterTiles').innerHTML = 
            nextSet.letters.map(letter => `<span class="letter-tile">${letter}</span>`).join('');
        document.querySelector('.word-hints p').textContent = `💡 Hint: ${nextSet.hint}`;
        document.getElementById('wordAnswer').value = '';
        alert('🎉 Great job! Next word...');
    }
}

function playMemoryMaster() {
    showModal('🧠 Memory Master Game', `
        <div class="arcade-game-interface">
            <h3>🧠 Memory Master</h3>
            <p>Remember the sequence and repeat it!</p>
            
            <div class="memory-game">
                <div class="memory-grid" id="memoryGrid">
                    <div class="memory-card" onclick="memoryCardClick(0)">🔴</div>
                    <div class="memory-card" onclick="memoryCardClick(1)">🟢</div>
                    <div class="memory-card" onclick="memoryCardClick(2)">🔵</div>
                    <div class="memory-card" onclick="memoryCardClick(3)">🟡</div>
                </div>
                
                <div class="memory-controls">
                    <button class="btn-primary" onclick="startMemorySequence()" id="startMemoryBtn">Start Sequence</button>
                    <p id="memoryInstructions">Click "Start Sequence" to begin!</p>
                </div>
                
                <div class="memory-score">
                    <p>Level: <span id="memoryLevel">1</span></p>
                </div>
            </div>
            
            <input type="hidden" id="currentSequence" value="">
            <input type="hidden" id="playerSequence" value="">
            <input type="hidden" id="sequenceIndex" value="0">
        </div>
    `);
}

let memorySequence = [];
let playerInput = [];
let showingSequence = false;

function startMemorySequence() {
    const level = parseInt(document.getElementById('memoryLevel').textContent);
    memorySequence = [];
    playerInput = [];
    
    // Generate sequence
    for (let i = 0; i < level + 2; i++) {
        memorySequence.push(Math.floor(Math.random() * 4));
    }
    
    document.getElementById('memoryInstructions').textContent = 'Watch the sequence...';
    document.getElementById('startMemoryBtn').disabled = true;
    showingSequence = true;
    
    showMemorySequence(0);
}

function showMemorySequence(index) {
    if (index >= memorySequence.length) {
        document.getElementById('memoryInstructions').textContent = 'Now repeat the sequence!';
        document.getElementById('startMemoryBtn').disabled = false;
        showingSequence = false;
        return;
    }
    
    const cards = document.querySelectorAll('.memory-card');
    cards[memorySequence[index]].style.transform = 'scale(1.2)';
    cards[memorySequence[index]].style.opacity = '0.7';
    
    setTimeout(() => {
        cards[memorySequence[index]].style.transform = 'scale(1)';
        cards[memorySequence[index]].style.opacity = '1';
        setTimeout(() => showMemorySequence(index + 1), 300);
    }, 600);
}

function memoryCardClick(cardIndex) {
    if (showingSequence) return;
    
    playerInput.push(cardIndex);
    
    // Check if correct so far
    for (let i = 0; i < playerInput.length; i++) {
        if (playerInput[i] !== memorySequence[i]) {
            alert('❌ Wrong sequence! Try again.');
            document.getElementById('startMemoryBtn').disabled = false;
            return;
        }
    }
    
    // Check if sequence complete
    if (playerInput.length === memorySequence.length) {
        const newLevel = parseInt(document.getElementById('memoryLevel').textContent) + 1;
        
        if (newLevel > 5) {
            addPoints(30, 'completing Memory Master');
            showModal('Memory Champion! 🧠', `
                <div class="game-result success">
                    <div class="result-icon">🧠</div>
                    <h3>Memory Master!</h3>
                    <p>You completed all 5 levels!</p>
                    <p>You earned <strong>30 points</strong>!</p>
                    <button class="btn-primary" onclick="playMemoryMaster()">Play Again</button>
                    <button class="btn-secondary" onclick="closeModal()">Back to Games</button>
                </div>
            `);
        } else {
            document.getElementById('memoryLevel').textContent = newLevel;
            alert('🎉 Perfect! Next level...');
            document.getElementById('startMemoryBtn').disabled = false;
            playerInput = [];
        }
    }
}

function playColorQuest() {
    showModal('🌈 Color Quest Game', `
        <div class="arcade-game-interface">
            <h3>🌈 Color Quest</h3>
            <p>Match the colors to complete your quest!</p>
            
            <div class="color-quest-game">
                <div class="quest-instruction">
                    <p>Click on the <strong id="targetColor">RED</strong> color!</p>
                </div>
                
                <div class="color-grid" id="colorGrid">
                    <div class="quest-color red" onclick="selectQuestColor('red')"></div>
                    <div class="quest-color blue" onclick="selectQuestColor('blue')"></div>
                    <div class="quest-color green" onclick="selectQuestColor('green')"></div>
                    <div class="quest-color yellow" onclick="selectQuestColor('yellow')"></div>
                    <div class="quest-color purple" onclick="selectQuestColor('purple')"></div>
                    <div class="quest-color orange" onclick="selectQuestColor('orange')"></div>
                </div>
                
                <div class="quest-score">
                    <p>Colors Found: <span id="colorsFound">0</span> / 5</p>
                </div>
            </div>
            
            <input type="hidden" id="currentColorTarget" value="red">
            <input type="hidden" id="colorProgress" value="0">
        </div>
    `);
    generateColorTarget();
}

function generateColorTarget() {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const colorNames = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    
    document.getElementById('targetColor').textContent = colorNames[randomIndex];
    document.getElementById('currentColorTarget').value = colors[randomIndex];
}

function selectQuestColor(selectedColor) {
    const targetColor = document.getElementById('currentColorTarget').value;
    const progress = parseInt(document.getElementById('colorProgress').value);
    
    if (selectedColor === targetColor) {
        const newProgress = progress + 1;
        document.getElementById('colorProgress').value = newProgress;
        document.getElementById('colorsFound').textContent = newProgress;
        
        if (newProgress >= 5) {
            addPoints(15, 'completing Color Quest');
            showModal('Color Quest Complete! 🌈', `
                <div class="game-result success">
                    <div class="result-icon">🌈</div>
                    <h3>Color Master!</h3>
                    <p>You found all 5 colors correctly!</p>
                    <p>You earned <strong>15 points</strong>!</p>
                    <button class="btn-primary" onclick="playColorQuest()">Play Again</button>
                    <button class="btn-secondary" onclick="closeModal()">Back to Games</button>
                </div>
            `);
        } else {
            alert('🎉 Correct! Next color...');
            generateColorTarget();
        }
    } else {
        alert('❌ Wrong color! Try again.');
    }
}

function playShapeShooter() {
    addPoints(18, 'playing Shape Shooter');
    showModal('Shape Shooter Complete! 🎯', `
        <div class="game-result success">
            <div class="result-icon">🎯</div>
            <h3>Shape Shooter Champion!</h3>
            <p>You hit all the right shapes!</p>
            <p>You earned <strong>18 points</strong>!</p>
            <button class="btn-primary" onclick="closeModal()">Great Job!</button>
        </div>
    `);
}

function playRhythmGame() {
    addPoints(22, 'playing Rhythm Learning');
    showModal('Rhythm Game Complete! 🎵', `
        <div class="game-result success">
            <div class="result-icon">🎵</div>
            <h3>Rhythm Master!</h3>
            <p>You kept perfect rhythm!</p>
            <p>You earned <strong>22 points</strong>!</p>
            <button class="btn-primary" onclick="closeModal()">Musical!</button>
        </div>
    `);
}

// Game functions
function playMathGame() {
    addPoints(15, 'playing Math Adventure');
    showModal('Math Adventure Complete!', `
        <h3>🔢 Great math skills!</h3>
        <p>You earned 15 points for completing the Math Adventure!</p>
    `);
}

function playWordGame() {
    addPoints(12, 'playing Word Puzzle');
    showModal('Word Puzzle Complete!', `
        <h3>📝 Excellent word skills!</h3>
        <p>You earned 12 points for solving the Word Puzzle!</p>
    `);
}

function playMemoryGame() {
    addPoints(10, 'playing Memory Challenge');
    showModal('Memory Challenge Complete!', `
        <h3>🧠 Amazing memory!</h3>
        <p>You earned 10 points for the Memory Challenge!</p>
    `);
}

function playColorGame() {
    addPoints(8, 'playing Color Match');
    showModal('Color Match Complete!', `
        <h3>🌈 Perfect color matching!</h3>
        <p>You earned 8 points for Color Match!</p>
    `);
}

// Sports functions
function doJumpingJacks() {
    addPoints(5, 'doing jumping jacks');
    showModal('Great Exercise!', `
        <h3>🤸‍♀️ Fantastic jumping jacks!</h3>
        <p>You earned 5 points for staying active!</p>
    `);
}

function doYoga() {
    addPoints(10, 'doing kids yoga');
    showModal('Peaceful Yoga!', `
        <h3>🧘‍♀️ Wonderful yoga session!</h3>
        <p>You earned 10 points for mindful movement!</p>
    `);
}

function doDancing() {
    addPoints(8, 'having a dance party');
    showModal('Dance Party!', `
        <h3>💃 Amazing dance moves!</h3>
        <p>You earned 8 points for dancing!</p>
    `);
}

function doStretching() {
    addPoints(5, 'doing stretching exercises');
    showModal('Great Stretching!', `
        <h3>🤸‍♂️ Excellent stretching!</h3>
        <p>You earned 5 points for taking care of your body!</p>
    `);
}

// Launch App function
function launchApp() {
    showModal('Back to School Learning App', `
        <h3><i class="fas fa-rocket"></i> Welcome to the Learning App!</h3>
        <p>🎓 Get ready for an amazing school year!</p>
        <div class="app-features">
            <div class="feature">
                <h4>📚 Grade-Level Curriculum</h4>
                <p>Activities designed specifically for ${currentStudent.grade ? getGradeDisplayName(currentStudent.grade) : 'your grade level'}!</p>
            </div>
            <div class="feature">
                <h4>🎮 Interactive Learning</h4>
                <p>Learn through games, stories, and hands-on activities!</p>
            </div>
            <div class="feature">
                <h4>📊 Progress Tracking</h4>
                <p>Watch your skills grow and celebrate your achievements!</p>
            </div>
        </div>
        <button class="btn-featured" onclick="addPoints(30, 'launching the learning app'); closeModal();">
            Start Learning Adventure! (+30 points)
        </button>
    `);
}

// Modal functions
function showModal(title, content) {
    const modal = document.getElementById('activityModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <h2>${title}</h2>
        ${content}
    `;
    
    modal.style.display = 'block';
    modal.classList.add('fade-in');
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('activityModal');
    modal.style.display = 'none';
    modal.classList.remove('fade-in');
    
    // Restore background scrolling
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('activityModal');
    if (event.target === modal) {
        closeModal();
    }
}

// ============================================
// 🚀 API INTEGRATION FUNCTIONS
// ============================================

// Dictionary API for word definitions
async function getWordDefinition(word) {
    try {
        const response = await fetch(`${DICTIONARY_API_URL}${word.toLowerCase()}`);
        if (!response.ok) {
            throw new Error('Word not found');
        }
        const data = await response.json();
        return {
            word: data[0].word,
            phonetic: data[0].phonetic || '',
            meaning: data[0].meanings[0].definitions[0].definition,
            example: data[0].meanings[0].definitions[0].example || '',
            partOfSpeech: data[0].meanings[0].partOfSpeech || '',
            audio: data[0].phonetics.find(p => p.audio)?.audio || ''
        };
    } catch (error) {
        console.error('Dictionary API error:', error);
        return null;
    }
}

// Trivia API for quiz questions
async function getTriviaQuestions(category = '', difficulty = 'easy', amount = 5) {
    try {
        let url = `${TRIVIA_API_URL}?amount=${amount}&difficulty=${difficulty}&type=multiple`;
        if (category) {
            url += `&category=${category}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.response_code === 0) {
            return data.results.map(q => ({
                question: q.question,
                correctAnswer: q.correct_answer,
                incorrectAnswers: q.incorrect_answers,
                category: q.category,
                difficulty: q.difficulty
            }));
        }
        return [];
    } catch (error) {
        console.error('Trivia API error:', error);
        return [];
    }
}

// NASA API for space content
async function getNASAImageOfDay() {
    try {
        const response = await fetch(NASA_API_URL);
        const data = await response.json();
        return {
            title: data.title,
            explanation: data.explanation,
            url: data.url,
            date: data.date
        };
    } catch (error) {
        console.error('NASA API error:', error);
        return null;
    }
}

// Smooth scrolling for navigation
function setupSmoothScrolling() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animate elements on scroll
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Add some fun interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add click effects to cards
    document.querySelectorAll('.learning-card, .points-card').forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});

// CSS for additional elements
const additionalCSS = `
.activity-options, .game-grid, .sports-grid, .prizes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
}

.prize-item {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 10px;
    text-align: center;
    border: 2px solid #e9ecef;
    transition: all 0.3s ease;
}

.prize-item:not(.disabled):hover {
    border-color: #4a90e2;
    transform: translateY(-2px);
}

.prize-item.disabled {
    opacity: 0.5;
}

.prize-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.achievement-item {
    background: rgba(255, 255, 255, 0.8);
    padding: 0.75rem;
    margin: 0.5rem 0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-left: 4px solid #f39c12;
}

.achievement-item i {
    color: #f39c12;
}

.achievement-item small {
    margin-left: auto;
    opacity: 0.7;
}

.app-features {
    margin: 1rem 0;
}

.feature {
    background: #f8f9fa;
    padding: 1rem;
    margin: 0.5rem 0;
    border-radius: 8px;
    border-left: 4px solid #4a90e2;
}

.feature h4 {
    margin-bottom: 0.5rem;
    color: #4a90e2;
}
`;

// Game Generation Functions
function getVocabularyGames(grade) {
    const games = {
        'prek': [
            { id: 'colors', name: 'Color Words', description: 'Match colors with their names', difficulty: 'easy', points: 5, cost: 2, icon: '🌈' },
            { id: 'animals', name: 'Animal Sounds', description: 'Learn animal names and sounds', difficulty: 'easy', points: 5, cost: 2, icon: '🐾' }
        ],
        'kindergarten': [
            { id: 'colors', name: 'Color Words', description: 'Match colors with their names', difficulty: 'easy', points: 5, cost: 2, icon: '🌈' },
            { id: 'shapes', name: 'Shape Hunt', description: 'Find and name different shapes', difficulty: 'medium', points: 8, cost: 3, icon: '🔷' },
            { id: 'family', name: 'Family Words', description: 'Learn family member names', difficulty: 'easy', points: 6, cost: 2, icon: '👨‍👩‍👧‍👦' },
            { id: 'word-explorer', name: 'Word Explorer 🌟', description: 'Discover real word meanings with audio!', difficulty: 'easy', points: 8, cost: 3, icon: '📖', apiGame: true }
        ],
        '1st': [
            { id: 'rhyme', name: 'Rhyme Time', description: 'Find words that rhyme', difficulty: 'medium', points: 10, cost: 4, icon: '🎵' },
            { id: 'opposite', name: 'Opposites', description: 'Match opposite words', difficulty: 'medium', points: 10, cost: 4, icon: '⚖️' },
            { id: 'weather', name: 'Weather Words', description: 'Learn weather vocabulary', difficulty: 'easy', points: 8, cost: 3, icon: '🌤️' },
            { id: 'word-explorer', name: 'Word Explorer 🌟', description: 'Discover real word meanings with audio!', difficulty: 'medium', points: 12, cost: 4, icon: '📖', apiGame: true }
        ],
        '2nd': [
            { id: 'synonyms', name: 'Synonym Match', description: 'Find words with similar meanings', difficulty: 'hard', points: 15, cost: 6, icon: '🔗' },
            { id: 'compound', name: 'Compound Words', description: 'Build compound words', difficulty: 'hard', points: 15, cost: 6, icon: '🏠' },
            { id: 'categories', name: 'Word Categories', description: 'Sort words into groups', difficulty: 'medium', points: 12, cost: 5, icon: '📚' },
            { id: 'word-explorer', name: 'Word Explorer 🌟', description: 'Discover real word meanings with audio!', difficulty: 'hard', points: 18, cost: 7, icon: '📖', apiGame: true }
        ]
    };
    return games[grade] || games['kindergarten'];
}

function getGrammarGames(grade) {
    const games = {
        'prek': [
            { id: 'letters', name: 'Letter Hunt', description: 'Find letters in the alphabet', difficulty: 'easy', points: 5, cost: 2, icon: '🔤' },
            { id: 'sounds', name: 'Letter Sounds', description: 'Match letters to sounds', difficulty: 'easy', points: 5, cost: 2, icon: '🔊' }
        ],
        'kindergarten': [
            { id: 'letters', name: 'Letter Hunt', description: 'Find letters in the alphabet', difficulty: 'easy', points: 5, cost: 2, icon: '🔤' },
            { id: 'uppercase', name: 'Big vs Small', description: 'Match uppercase and lowercase letters', difficulty: 'medium', points: 8, cost: 3, icon: 'Aa' },
            { id: 'sentence', name: 'Complete the Sentence', description: 'Fill in missing words', difficulty: 'easy', points: 6, cost: 2, icon: '📝' }
        ],
        '1st': [
            { id: 'nouns', name: 'Noun Detective', description: 'Find people, places, and things', difficulty: 'medium', points: 10, cost: 4, icon: '🔍' },
            { id: 'verbs', name: 'Action Words', description: 'Identify action words', difficulty: 'medium', points: 10, cost: 4, icon: '🏃‍♂️' },
            { id: 'punctuation', name: 'Punctuation Fun', description: 'Add periods and question marks', difficulty: 'easy', points: 8, cost: 3, icon: '❓' }
        ],
        '2nd': [
            { id: 'adjectives', name: 'Describing Words', description: 'Find words that describe', difficulty: 'hard', points: 15, cost: 6, icon: '🎨' },
            { id: 'tense', name: 'Past and Present', description: 'Change verb tenses', difficulty: 'hard', points: 15, cost: 6, icon: '⏰' },
            { id: 'sentences', name: 'Sentence Builder', description: 'Build complete sentences', difficulty: 'medium', points: 12, cost: 5, icon: '🏗️' }
        ]
    };
    return games[grade] || games['kindergarten'];
}

function getReadingGames(grade) {
    const games = {
        'prek': [
            { id: 'picture', name: 'Picture Stories', description: 'Tell stories from pictures', difficulty: 'easy', points: 5, cost: 2, icon: '🖼️' },
            { id: 'sequence', name: 'Story Order', description: 'Put story pictures in order', difficulty: 'easy', points: 5, cost: 2, icon: '📖' }
        ],
        'kindergarten': [
            { id: 'picture', name: 'Picture Stories', description: 'Tell stories from pictures', difficulty: 'easy', points: 5, cost: 2, icon: '🖼️' },
            { id: 'sight', name: 'Sight Words', description: 'Practice common words', difficulty: 'medium', points: 8, cost: 3, icon: '👁️' },
            { id: 'phonics', name: 'Sound It Out', description: 'Sound out simple words', difficulty: 'easy', points: 6, cost: 2, icon: '🔊' }
        ],
        '1st': [
            { id: 'comprehension', name: 'Story Questions', description: 'Answer questions about stories', difficulty: 'medium', points: 10, cost: 4, icon: '❓' },
            { id: 'main_idea', name: 'Main Idea', description: 'Find the main idea of stories', difficulty: 'medium', points: 10, cost: 4, icon: '💡' },
            { id: 'characters', name: 'Character Match', description: 'Learn about story characters', difficulty: 'easy', points: 8, cost: 3, icon: '👥' }
        ],
        '2nd': [
            { id: 'inference', name: 'Reading Detective', description: 'Make inferences from clues', difficulty: 'hard', points: 15, cost: 6, icon: '🔍' },
            { id: 'compare', name: 'Compare Stories', description: 'Compare characters and events', difficulty: 'hard', points: 15, cost: 6, icon: '⚖️' },
            { id: 'sequence', name: 'Event Order', description: 'Put story events in order', difficulty: 'medium', points: 12, cost: 5, icon: '📊' }
        ]
    };
    return games[grade] || games['kindergarten'];
}

function getEmotionGames(grade) {
    const games = {
        'prek': [
            { id: 'faces', name: 'Happy or Sad', description: 'Identify basic emotions', difficulty: 'easy', points: 5, cost: 2, icon: '😊' },
            { id: 'feelings', name: 'How Do You Feel?', description: 'Express your feelings', difficulty: 'easy', points: 5, cost: 2, icon: '❤️' }
        ],
        'kindergarten': [
            { id: 'faces', name: 'Emotion Faces', description: 'Match faces to feelings', difficulty: 'easy', points: 5, cost: 2, icon: '😊' },
            { id: 'situations', name: 'Feeling Situations', description: 'How would you feel?', difficulty: 'medium', points: 8, cost: 3, icon: '🤔' },
            { id: 'express', name: 'Express Yourself', description: 'Show different emotions', difficulty: 'easy', points: 6, cost: 2, icon: '🎭' }
        ],
        '1st': [
            { id: 'emotions', name: 'Emotion Wheel', description: 'Explore different emotions', difficulty: 'medium', points: 10, cost: 4, icon: '🎯' },
            { id: 'empathy', name: 'Understanding Others', description: 'How do others feel?', difficulty: 'medium', points: 10, cost: 4, icon: '🤝' },
            { id: 'coping', name: 'Feeling Better', description: 'Ways to feel better', difficulty: 'easy', points: 8, cost: 3, icon: '🌟' }
        ],
        '2nd': [
            { id: 'complex', name: 'Complex Emotions', description: 'Learn about mixed feelings', difficulty: 'hard', points: 15, cost: 6, icon: '🌈' },
            { id: 'social', name: 'Social Feelings', description: 'Emotions in friendships', difficulty: 'hard', points: 15, cost: 6, icon: '👫' },
            { id: 'regulation', name: 'Emotion Control', description: 'Managing strong emotions', difficulty: 'medium', points: 12, cost: 5, icon: '🧘‍♀️' }
        ]
    };
    return games[grade] || games['kindergarten'];
}

// Game Play Functions
function playVocabularyGame(gameId, points, difficulty) {
    playInteractiveGame('vocabulary', gameId, points, difficulty);
}

function playGrammarGame(gameId, points, difficulty) {
    playInteractiveGame('grammar', gameId, points, difficulty);
}

function playReadingGame(gameId, points, difficulty) {
    playInteractiveGame('reading', gameId, points, difficulty);
}

function playEmotionGame(gameId, points, difficulty) {
    playInteractiveGame('emotion', gameId, points, difficulty);
}

function playInteractiveGame(category, gameId, points, difficulty) {
    const gameData = getGameContent(category, gameId, difficulty);
    
    showModal(`${gameData.title} - ${difficulty.toUpperCase()} Level`, `
        <div class="interactive-game">
            <div class="game-header">
                <h3>${gameData.title} ${gameData.icon}</h3>
                <div class="game-stats">
                    <span class="difficulty-badge ${difficulty}">${difficulty.toUpperCase()}</span>
                    <span class="points-badge">+${points} points</span>
                </div>
            </div>
            
            <div class="game-content">
                <p class="game-instruction">${gameData.instruction}</p>
                <div class="game-area" id="gameArea">
                    ${gameData.content}
                </div>
            </div>
            
            <div class="game-controls">
                <button class="btn-primary" onclick="checkGameAnswer('${gameId}', ${points}, '${difficulty}')">
                    Check Answer
                </button>
                <button class="btn-secondary" onclick="skipGame(${Math.floor(points/2)})">
                    Skip (+${Math.floor(points/2)} points)
                </button>
            </div>
        </div>
    `);
    
    // Initialize game-specific interactions
    initializeGameInteractions(gameId);
}

function getGameContent(category, gameId, difficulty) {
    const gameDatabase = {
        vocabulary: {
            colors: {
                title: 'Color Match',
                icon: '🌈',
                instruction: 'Click on the correct color!',
                content: `
                    <div class="color-game">
                        <p class="question">What color is this? <span class="color-word" id="colorWord">RED</span></p>
                        <div class="color-options">
                            <div class="color-box red" onclick="selectColor('red')"></div>
                            <div class="color-box blue" onclick="selectColor('blue')"></div>
                            <div class="color-box green" onclick="selectColor('green')"></div>
                            <div class="color-box yellow" onclick="selectColor('yellow')"></div>
                        </div>
                        <input type="hidden" id="selectedColor" value="">
                        <input type="hidden" id="correctColor" value="red">
                    </div>
                `
            },
            animals: {
                title: 'Animal Sounds',
                icon: '🐾',
                instruction: 'Which animal makes this sound?',
                content: `
                    <div class="animal-game">
                        <p class="question">What animal says "MOO"? 🐄</p>
                        <div class="animal-options">
                            <button class="animal-btn" onclick="selectAnimal('cow')">🐄 Cow</button>
                            <button class="animal-btn" onclick="selectAnimal('cat')">🐱 Cat</button>
                            <button class="animal-btn" onclick="selectAnimal('dog')">🐶 Dog</button>
                        </div>
                        <input type="hidden" id="selectedAnimal" value="">
                        <input type="hidden" id="correctAnimal" value="cow">
                    </div>
                `
            },
            'word-explorer': {
                title: 'Word Explorer',
                icon: '📖',
                instruction: 'Enter a word to explore its meaning!',
                content: `
                    <div class="word-explorer-game">
                        <p class="question">🔍 What word would you like to explore today?</p>
                        <div class="word-input-section">
                            <input type="text" id="wordInput" placeholder="Type any word..." 
                                   style="padding: 10px; font-size: 16px; border: 2px solid #ddd; border-radius: 8px; width: 80%; margin-bottom: 10px;">
                            <button class="btn-primary" onclick="exploreWord()" style="margin-left: 10px;">
                                🔍 Explore Word
                            </button>
                        </div>
                        <div id="wordResult" style="margin-top: 20px; display: none;">
                            <div class="word-definition-card" style="background: #f8f9fa; padding: 20px; border-radius: 12px; border-left: 4px solid #007bff;">
                                <h4 id="exploredWord" style="color: #007bff; margin-bottom: 10px;"></h4>
                                <p id="wordPhonetic" style="color: #6c757d; font-style: italic; margin-bottom: 10px;"></p>
                                <div id="wordAudio" style="margin-bottom: 15px;"></div>
                                <p><strong>Part of Speech:</strong> <span id="wordType"></span></p>
                                <p><strong>Definition:</strong> <span id="wordDefinition"></span></p>
                                <p id="wordExample" style="margin-top: 10px; font-style: italic; color: #495057;"></p>
                            </div>
                        </div>
                        <input type="hidden" id="explorationComplete" value="false">
                    </div>
                `
            }
        },
        grammar: {
            letters: {
                title: 'Letter Hunt',
                icon: '🔤',
                instruction: 'Find the letter A!',
                content: `
                    <div class="letter-game">
                        <p class="question">Click on the letter 'A':</p>
                        <div class="letter-options">
                            <button class="letter-btn" onclick="selectLetter('A')">A</button>
                            <button class="letter-btn" onclick="selectLetter('B')">B</button>
                            <button class="letter-btn" onclick="selectLetter('C')">C</button>
                            <button class="letter-btn" onclick="selectLetter('D')">D</button>
                        </div>
                        <input type="hidden" id="selectedLetter" value="">
                        <input type="hidden" id="correctLetter" value="A">
                    </div>
                `
            }
        },
        reading: {
            picture: {
                title: 'Picture Story',
                icon: '🖼️',
                instruction: 'What do you see in this picture?',
                content: `
                    <div class="picture-game">
                        <p class="question">What is the child doing? 🧒</p>
                        <div class="picture-story">📚👦</div>
                        <div class="story-options">
                            <button class="story-btn" onclick="selectStory('reading')">Reading a book</button>
                            <button class="story-btn" onclick="selectStory('sleeping')">Sleeping</button>
                            <button class="story-btn" onclick="selectStory('running')">Running</button>
                        </div>
                        <input type="hidden" id="selectedStory" value="">
                        <input type="hidden" id="correctStory" value="reading">
                    </div>
                `
            }
        },
        emotion: {
            faces: {
                title: 'Emotion Faces',
                icon: '😊',
                instruction: 'How is this person feeling?',
                content: `
                    <div class="emotion-game">
                        <p class="question">This face shows: 😊</p>
                        <div class="emotion-options">
                            <button class="emotion-btn" onclick="selectEmotion('happy')">😊 Happy</button>
                            <button class="emotion-btn" onclick="selectEmotion('sad')">😢 Sad</button>
                            <button class="emotion-btn" onclick="selectEmotion('angry')">😠 Angry</button>
                        </div>
                        <input type="hidden" id="selectedEmotion" value="">
                        <input type="hidden" id="correctEmotion" value="happy">
                    </div>
                `
            }
        }
    };
    
    return gameDatabase[category]?.[gameId] || {
        title: 'Fun Game',
        icon: '🎮',
        instruction: 'Let\'s play!',
        content: '<p>Game loading...</p>'
    };
}

// Game Interaction Functions
function selectColor(color) {
    document.getElementById('selectedColor').value = color;
    document.querySelectorAll('.color-box').forEach(box => box.classList.remove('selected'));
    document.querySelector(`.color-box.${color}`).classList.add('selected');
}

function selectAnimal(animal) {
    document.getElementById('selectedAnimal').value = animal;
    document.querySelectorAll('.animal-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
}

function selectLetter(letter) {
    document.getElementById('selectedLetter').value = letter;
    document.querySelectorAll('.letter-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
}

function selectStory(story) {
    document.getElementById('selectedStory').value = story;
    document.querySelectorAll('.story-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
}

function selectEmotion(emotion) {
    document.getElementById('selectedEmotion').value = emotion;
    document.querySelectorAll('.emotion-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
}

function initializeGameInteractions(gameId) {
    // Add any game-specific initialization here
    console.log(`Initializing game: ${gameId}`);
}

function checkGameAnswer(gameId, points, difficulty) {
    let isCorrect = false;
    let selectedAnswer = '';
    let correctAnswer = '';
    
    // Check different game types
    const colorInput = document.getElementById('selectedColor');
    const animalInput = document.getElementById('selectedAnimal');
    const letterInput = document.getElementById('selectedLetter');
    const storyInput = document.getElementById('selectedStory');
    const emotionInput = document.getElementById('selectedEmotion');
    
    if (colorInput) {
        selectedAnswer = colorInput.value;
        correctAnswer = document.getElementById('correctColor').value;
        isCorrect = selectedAnswer === correctAnswer;
    } else if (animalInput) {
        selectedAnswer = animalInput.value;
        correctAnswer = document.getElementById('correctAnimal').value;
        isCorrect = selectedAnswer === correctAnswer;
    } else if (letterInput) {
        selectedAnswer = letterInput.value;
        correctAnswer = document.getElementById('correctLetter').value;
        isCorrect = selectedAnswer === correctAnswer;
    } else if (storyInput) {
        selectedAnswer = storyInput.value;
        correctAnswer = document.getElementById('correctStory').value;
        isCorrect = selectedAnswer === correctAnswer;
    } else if (emotionInput) {
        selectedAnswer = emotionInput.value;
        correctAnswer = document.getElementById('correctEmotion').value;
        isCorrect = selectedAnswer === correctAnswer;
    }
    
    if (selectedAnswer === '') {
        alert('Please make a selection first!');
        return;
    }
    
    if (isCorrect) {
        addPoints(points, `completing ${gameId} game (${difficulty})`);
        showModal('Excellent Work! 🎉', `
            <div class="game-result success">
                <div class="result-icon">🌟</div>
                <h3>Fantastic Job!</h3>
                <p>You got it right and earned <strong>${points} points</strong>!</p>
                <p class="encouragement">Keep up the great learning!</p>
                <button class="btn-primary" onclick="closeModal()">Play Another Game</button>
            </div>
        `);
    } else {
        const encouragementPoints = Math.floor(points / 3);
        addPoints(encouragementPoints, 'trying your best');
        showModal('Good Try! 💪', `
            <div class="game-result try-again">
                <div class="result-icon">💪</div>
                <h3>Good Effort!</h3>
                <p>The correct answer was: <strong>${correctAnswer}</strong></p>
                <p>You still earned <strong>${encouragementPoints} points</strong> for trying!</p>
                <p class="encouragement">Practice makes perfect!</p>
                <button class="btn-primary" onclick="closeModal()">Try Again</button>
            </div>
        `);
    }
}

function skipGame(points) {
    addPoints(points, 'participating in learning');
    showModal('Thanks for Playing! 😊', `
        <div class="game-result skip">
            <div class="result-icon">😊</div>
            <h3>Thanks for Participating!</h3>
            <p>You earned <strong>${points} points</strong> just for trying!</p>
            <p class="encouragement">Every step counts in learning!</p>
            <button class="btn-primary" onclick="closeModal()">Keep Learning</button>
        </div>
    `);
}

// ============================================
// 🌟 API-POWERED GAME FUNCTIONS
// ============================================

// Word Explorer - using Dictionary API
async function exploreWord() {
    const wordInput = document.getElementById('wordInput');
    const word = wordInput.value.trim().toLowerCase();
    
    if (!word) {
        alert('Please enter a word to explore!');
        return;
    }
    
    // Show loading
    const resultDiv = document.getElementById('wordResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 2rem;">🔍</div>
            <p>Exploring the word "${word}"...</p>
        </div>
    `;
    
    // Fetch word definition
    const wordData = await getWordDefinition(word);
    
    if (wordData) {
        document.getElementById('exploredWord').textContent = wordData.word;
        document.getElementById('wordPhonetic').textContent = wordData.phonetic || 'Pronunciation not available';
        document.getElementById('wordType').textContent = wordData.partOfSpeech || 'Word';
        document.getElementById('wordDefinition').textContent = wordData.meaning;
        
        // Add example if available
        const exampleElement = document.getElementById('wordExample');
        if (wordData.example) {
            exampleElement.innerHTML = `<strong>Example:</strong> "${wordData.example}"`;
            exampleElement.style.display = 'block';
        } else {
            exampleElement.style.display = 'none';
        }
        
        // Add audio if available
        const audioDiv = document.getElementById('wordAudio');
        if (wordData.audio) {
            audioDiv.innerHTML = `
                <audio controls style="width: 100%;">
                    <source src="${wordData.audio}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
                <p style="font-size: 12px; color: #666;">🔊 Click to hear pronunciation</p>
            `;
        } else {
            audioDiv.innerHTML = '<p style="font-size: 12px; color: #666;">🔇 Audio not available</p>';
        }
        
        // Show success result
        resultDiv.innerHTML = `
            <div class="word-definition-card" style="background: #f8f9fa; padding: 20px; border-radius: 12px; border-left: 4px solid #28a745;">
                <h4 style="color: #28a745; margin-bottom: 10px;">📖 ${wordData.word}</h4>
                <p style="color: #6c757d; font-style: italic; margin-bottom: 10px;">${wordData.phonetic || 'Pronunciation not available'}</p>
                ${wordData.audio ? `
                    <div style="margin-bottom: 15px;">
                        <audio controls style="width: 100%;">
                            <source src="${wordData.audio}" type="audio/mpeg">
                        </audio>
                        <p style="font-size: 12px; color: #666;">🔊 Click to hear pronunciation</p>
                    </div>
                ` : '<p style="font-size: 12px; color: #666; margin-bottom: 15px;">🔇 Audio not available</p>'}
                <p><strong>Part of Speech:</strong> ${wordData.partOfSpeech || 'Word'}</p>
                <p><strong>Definition:</strong> ${wordData.meaning}</p>
                ${wordData.example ? `<p style="margin-top: 10px; font-style: italic; color: #495057;"><strong>Example:</strong> "${wordData.example}"</p>` : ''}
                <div style="margin-top: 15px; padding: 10px; background: #d4edda; border-radius: 8px;">
                    <p style="margin: 0; color: #155724;">✅ Great exploration! You've successfully learned about a new word!</p>
                </div>
            </div>
        `;
        
        // Mark exploration as complete
        document.getElementById('explorationComplete').value = 'true';
        
    } else {
        // Show error
        resultDiv.innerHTML = `
            <div style="background: #f8d7da; padding: 20px; border-radius: 12px; border-left: 4px solid #dc3545;">
                <h4 style="color: #721c24;">❌ Word Not Found</h4>
                <p style="color: #721c24;">Sorry, we couldn't find "${word}" in our dictionary.</p>
                <p style="color: #721c24;">Try checking the spelling or try a different word!</p>
                <div style="margin-top: 10px;">
                    <strong>Suggested words to try:</strong> cat, dog, happy, run, book, sun
                </div>
            </div>
        `;
    }
}

// Add trivia game powered by Trivia API
async function playTriviaGame(difficulty = 'easy', category = '') {
    const questions = await getTriviaQuestions(category, difficulty, 1);
    
    if (questions.length > 0) {
        const question = questions[0];
        const allAnswers = [...question.incorrectAnswers, question.correctAnswer].sort(() => Math.random() - 0.5);
        
        showModal('🧠 Trivia Challenge', `
            <div class="trivia-game">
                <div class="game-header">
                    <h3>Trivia Challenge 🧠</h3>
                    <span class="difficulty-badge ${difficulty}">${difficulty.toUpperCase()}</span>
                </div>
                <div class="question-section">
                    <p class="trivia-question">${question.question}</p>
                    <div class="trivia-answers">
                        ${allAnswers.map((answer, index) => 
                            `<button class="trivia-btn" onclick="selectTriviaAnswer('${answer}', '${question.correctAnswer}')">${answer}</button>`
                        ).join('')}
                    </div>
                </div>
                <div id="triviaResult" style="margin-top: 20px;"></div>
            </div>
        `);
    } else {
        showModal('Error', 'Could not load trivia questions. Please try again!');
    }
}

function selectTriviaAnswer(selected, correct) {
    const resultDiv = document.getElementById('triviaResult');
    const isCorrect = selected === correct;
    const points = isCorrect ? 10 : 3;
    
    if (isCorrect) {
        addPoints(points, 'trivia challenge');
        resultDiv.innerHTML = `
            <div class="game-result success">
                <div class="result-icon">🎉</div>
                <h3>Correct!</h3>
                <p>You earned <strong>${points} points</strong>!</p>
            </div>
        `;
    } else {
        addPoints(points, 'trying your best');
        resultDiv.innerHTML = `
            <div class="game-result try-again">
                <div class="result-icon">💪</div>
                <h3>Good Try!</h3>
                <p>The correct answer was: <strong>${correct}</strong></p>
                <p>You earned <strong>${points} points</strong> for trying!</p>
            </div>
        `;
    }
}

// NASA Space Explorer Game
async function playSpaceExplorer() {
    const spaceData = await getNASAImageOfDay();
    
    if (spaceData) {
        showModal('🚀 Space Explorer', `
            <div class="space-explorer">
                <div class="game-header">
                    <h3>NASA Picture of the Day 🚀</h3>
                    <p style="color: #666; font-size: 14px;">${spaceData.date}</p>
                </div>
                <div class="space-content">
                    <h4>${spaceData.title}</h4>
                    <div class="space-image" style="text-align: center; margin: 20px 0;">
                        <img src="${spaceData.url}" alt="${spaceData.title}" 
                             style="max-width: 100%; max-height: 300px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    </div>
                    <div class="space-description" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <p>${spaceData.explanation}</p>
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                        <button class="btn-primary" onclick="addPoints(15, 'space exploration'); closeModal();">
                            🌟 Amazing! (+15 points)
                        </button>
                    </div>
                </div>
            </div>
        `);
    } else {
        showModal('Error', 'Could not load space content. Please try again!');
    }
}

// Update checkGameAnswer to handle word-explorer
const originalCheckGameAnswer = checkGameAnswer;
function checkGameAnswer(gameId, points, difficulty) {
    if (gameId === 'word-explorer') {
        const explorationComplete = document.getElementById('explorationComplete');
        if (explorationComplete && explorationComplete.value === 'true') {
            addPoints(points, 'word exploration');
            showModal('Excellent Exploration! 🌟', `
                <div class="game-result success">
                    <div class="result-icon">📖</div>
                    <h3>Word Explorer Champion!</h3>
                    <p>You successfully explored a new word!</p>
                    <p>You earned <strong>${points} points</strong>!</p>
                    <p class="encouragement">Keep exploring words to expand your vocabulary! 🚀</p>
                    <button class="btn-primary" onclick="closeModal()">Explore More Words</button>
                </div>
            `);
        } else {
            showModal('Explore a Word First! 🔍', `
                <div class="game-result try-again">
                    <div class="result-icon">🔍</div>
                    <h3>Not Yet!</h3>
                    <p>Please enter a word and click "Explore Word" first!</p>
                    <button class="btn-primary" onclick="closeModal()">Try Again</button>
                </div>
            `);
        }
        return;
    }
    
    // Call original function for other games
    return originalCheckGameAnswer(gameId, points, difficulty);
}

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);
