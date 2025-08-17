# April Xu's Learning Website

An interactive educational website designed for young learners (Pre-K through 2nd grade) featuring engaging games, activities, a points-based reward system, and **real-world API integrations**.

## 🚀 Latest Features
- **API-Powered Games**: Real dictionary definitions, NASA space images, and trivia questions
- **Automatic Deployment**: GitHub Actions for seamless updates to GitHub Pages
- **Enhanced Vocabulary**: Word Explorer with live pronunciation and definitions

## Features

### 🎓 Learning Activities
- **Language Learning**: Vocabulary, grammar, conversation practice, and **Word Explorer** with real dictionary API
- **Reading**: Story time, comprehension, phonics, and interactive reading games
- **Emotion Learning**: Emotion recognition, feeling wheel, and empathy exercises

### 🌐 API-Powered Content ⭐
- **Word Explorer**: Uses Free Dictionary API for real definitions, pronunciation, and examples
- **Trivia Challenge**: Live trivia questions from Open Trivia Database
- **Space Explorer**: Daily NASA space images and educational content

### 👨‍🎓 Student Management
- Student registration with name and grade level
- Progress tracking and data persistence using localStorage
- Personalized experience based on grade level
- Achievement tracking with timestamps

### 🏆 Points & Rewards System
- Earn points by completing educational activities
- Spend points to unlock games and prizes (points-as-money system)
- Prize shop with redeemable rewards and unique mini-games
- Visual feedback and animations

### 🎮 Interactive Features
- **Educational Games Arcade**: Math Adventure, Word Builder, Memory Master, Color Quest
- **API-Powered Games**: Trivia Challenge ⭐, Space Explorer ⭐
- **Prize Games**: Sticker Collection, Badge Builder, Certificate Designer, Trophy Case, Royal Kingdom
- **Reading Games**: Story Builder and Reading Comprehension
- **Physical Activities**: Available through conversation and feeling wheel

## 🌐 Automatic Deployment

This project uses **GitHub Actions** for automatic deployment to GitHub Pages whenever you push to the main branch.

### Setup Instructions:
1. Push your code to GitHub
2. Go to your repository settings → Pages
3. Set source to "GitHub Actions"
4. Every push to `main` will automatically deploy the `site/` folder!

### Deployment Command:
The GitHub Action runs: `git subtree push --prefix site origin gh-pages`

Your site will be available at: `https://yourusername.github.io/april_website/`

## Technologies Used

- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **JavaScript**: Interactive functionality, API integrations, and local storage
- **APIs**: 
  - Free Dictionary API (no key required)
  - Open Trivia Database (no key required)
  - NASA API (demo key included)
- **Font Awesome**: Beautiful icons throughout the interface
- **Google Fonts**: Comic Neue font for a child-friendly appearance
- **GitHub Actions**: Automated deployment to GitHub Pages

## API Integrations

### 📚 Free Dictionary API
- **URL**: `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`
- **Usage**: Word Explorer game in Language Learning
- **Features**: Definitions, pronunciation, examples, audio playback
- **Cost**: FREE - No API key required ✅

### 🧠 Open Trivia Database
- **URL**: `https://opentdb.com/api.php`
- **Usage**: Trivia Challenge in the Educational Games Arcade
- **Features**: Multiple categories, difficulty levels, real questions from around the world
- **Cost**: FREE - No API key required ✅

### 🚀 NASA API
- **URL**: `https://api.nasa.gov/planetary/apod`
- **Usage**: Space Explorer in the Educational Games Arcade
- **Features**: Daily space images, educational descriptions, astronomy content
- **Cost**: FREE - Demo key included ✅

## Game Categories

### Language Learning
- Color Words, Animal Sounds, Shape Hunt, Family Words
- Rhyme Time, Opposites, Weather Words, Synonyms
- **Word Explorer ⭐** - Real dictionary definitions with audio pronunciation

### Grammar & Writing
- Letter Hunt, Letter Sounds, Big vs Small Letters
- Noun Detective, Action Words, Describing Words
- Sentence Builder, Punctuation Fun, Past and Present Tense

### Reading
- Picture Stories, Story Builder Game
- Reading Comprehension with grade-appropriate stories
- Interactive reading exercises with questions and feedback

### Educational Games Arcade
- Math Adventure, Word Builder, Memory Master, Color Quest
- **Trivia Challenge ⭐** - Real trivia questions from around the world
- **Space Explorer ⭐** - NASA space images and astronomy education

### Emotion Learning
- Feeling Detective, Emotion Wheel, Situation Helper
- Empathy exercises and social-emotional learning

## File Structure

```
april_website/
├── .github/
│   └── workflows/
│       ├── deploy.yml              # Full GitHub Pages deployment
│       └── subtree-deploy.yml      # Simple git subtree deployment
├── site/                           # Deployable website files
│   ├── index.html                  # Main website structure
│   ├── styles.css                  # All styling and visual design
│   └── script.js                   # Interactive functionality and API integrations
├── .gitignore                      # Git ignore rules
└── README.md                       # This documentation
```

## How to Use

1. **For Users**: 
   - Visit the deployed website (GitHub Pages URL)
   - Register with your name and grade level
   - Explore learning sections and play games
   - Earn and spend points in the reward system

2. **For Developers**:
   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/april_website.git
   cd april_website
   
   # Make changes in the site/ directory
   # Then push to automatically deploy
   git add .
   git commit -m "Update educational content"
   git push origin main
   # 🚀 GitHub Actions will automatically deploy!
   ```

## Design Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **API Integration**: Real-world data enhances learning experience
- **Child-Friendly UI**: Bright colors, large buttons, and intuitive navigation
- **Smooth Animations**: Engaging transitions and visual feedback
- **Data Persistence**: Student progress saved locally in the browser
- **Economic Learning**: Points-as-money system teaches resource management
- **Progressive Difficulty**: Games adapt to student grade level

## Educational Benefits

- **Real-World Learning**: API integrations provide current, accurate information
- **Vocabulary Expansion**: Real dictionary definitions and pronunciation
- **Global Knowledge**: Trivia questions from around the world
- **Space Education**: Current NASA content and space exploration
- **Reading Comprehension**: Interactive stories with questions
- **Social-Emotional Learning**: Emotion recognition and empathy building
- **Economic Concepts**: Point-spending system teaches budgeting

## Browser Compatibility

This website works best in modern browsers including:
- Chrome 70+ (recommended for API features)
- Firefox 65+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment Commands

### Automatic (Recommended):
```bash
git push origin main
# GitHub Actions automatically runs: git subtree push --prefix site origin gh-pages
```

### Manual:
```bash
git subtree push --prefix site origin gh-pages
```

## Contributing

This is an educational project designed for young learners. Suggestions and improvements are welcome!

To contribute:
1. Fork the repository
2. Make changes in the `site/` directory
3. Test locally by opening `site/index.html`
4. Submit a pull request

## Future Enhancements

- Additional API integrations (weather, geography, math problems)
- Multiplayer capabilities
- Teacher dashboard and progress reports
- Cloud-based progress synchronization
- Accessibility improvements
- Audio narration and text-to-speech

## License

Educational use only. Created for learning and development purposes.

---

*Created with ❤️ for young learners everywhere. Now powered by real-world APIs! 🌟*