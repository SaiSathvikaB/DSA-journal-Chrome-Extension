# DSA Journal - Multi-Entry Learning Tracker

A local-first Chrome Extension for logging daily learning across DSA problems, SQL/database concepts, and general tech topics.

## Features

### ✅ Core Features (v1.0)
- **Multi-Entry Types**: Track DSA problems, SQL topics, and tech concepts
- **Date-wise Logging**: Log entries only for the current day
- **Smart Entry Cards**: Different layouts for each entry type
- **Daily Summary**: Auto-generate or manually write reflections
- **Weekly Overview**: View last 7 days with stats and type distribution
- **Local Storage**: All data stored locally using `chrome.storage.local`
- **Read-only Past Days**: View but not edit previous days

### 📝 Entry Types

#### 🧠 DSA Problem
- Problem title and URL
- Platform (LeetCode, GFG, Codeforces, etc.)
- Topic (Array, DP, Graph, etc.)
- Difficulty (Easy, Medium, Hard)
- Time taken
- Approach, mistakes, insights

#### 🗄️ SQL / DB / Query
- Topic title (e.g., "GROUP BY vs HAVING")
- SQL query or example
- Explanation and notes
- Common mistakes or gotchas

#### ⚙️ Tech Concept
- Concept title (e.g., "Database Indexing")
- Description of what you learned
- Why it matters
- Where you got stuck (optional)

## Installation

### From Source
1. Download all files to a folder:
   - `manifest.json`
   - `popup.html`
   - `popup.js`
   - `storage.js`
   - `summary.js`
   - `styles.css`

2. Create placeholder icons (or use your own):
   - `icon16.png` (16x16)
   - `icon48.png` (48x48)
   - `icon128.png` (128x128)

3. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the folder containing the files

## Usage

### Adding an Entry
1. Click the extension icon
2. Select entry type from dropdown:
   - 🧠 DSA Problem
   - 🗄️ SQL / DB / Query
   - ⚙️ Tech Concept
3. Fill in the relevant form fields
4. Click "Add Entry"

### Daily Summary
1. Click "Summarize Day" button
2. Review auto-generated summary that includes:
   - DSA problems solved
   - SQL topics revised
   - Tech concepts learned
3. Edit to add personal reflections
4. Click "Save Summary"

### Weekly View
1. Click "Weekly" tab
2. View stats:
   - Total entries
   - Breakdown by type (DSA, SQL, Tech)
3. See type distribution bar chart
4. Click any day to expand and view details

## Data Structure

```json
{
  "days": {
    "2026-01-09": {
      "entries": [
        {
          "id": "unique_id",
          "type": "DSA",
          "title": "Two Sum",
          "url": "https://leetcode.com/problems/two-sum/",
          "platform": "LeetCode",
          "topic": "Array",
          "difficulty": "Easy",
          "timeTaken": "20",
          "notes": "Used hashmap approach...",
          "timestamp": "2026-01-09T10:30:00Z"
        },
        {
          "id": "unique_id_2",
          "type": "SQL",
          "title": "GROUP BY vs HAVING",
          "query": "SELECT dept, COUNT(*) FROM emp GROUP BY dept HAVING COUNT(*) > 5",
          "notes": "HAVING filters after aggregation, WHERE filters before",
          "mistake": "Initially tried to use WHERE with COUNT()"
        },
        {
          "id": "unique_id_3",
          "type": "TECH",
          "title": "Database Indexing",
          "description": "Learned how B-tree indexes work in PostgreSQL",
          "why": "Critical for query performance optimization",
          "stuck": "Confused about when NOT to use indexes"
        }
      ],
      "summary": "Solved 2 DSA problems (Array, DP), revised 1 SQL concept, and learned about database indexing. Need more practice with joins."
    }
  }
}
```

## Design Principles

1. **Multi-dimensional learning**: Track diverse learning activities
2. **Date-wise, not streak-based**: Focus on learning, not gamification
3. **Reflection over quantity**: Quality notes matter more than count
4. **Local-first**: Your data stays on your machine
5. **Fast to use**: Minimal friction during learning
6. **No editing past days**: Maintain journal integrity

## Visual Design

- **Color-coded entries**:
  - Blue border (🧠) for DSA problems
  - Green border (🗄️) for SQL topics
  - Orange border (⚙️) for Tech concepts
- **Context-aware forms**: Only show relevant fields per entry type
- **SQL query styling**: Code-style formatting for queries
- **Clean, modern UI**: Twitter-inspired design language

## Future Enhancements (Post-MVP)

- AI-generated summaries using LLM
- Spaced repetition reminders for revision
- Export journal to PDF/Markdown
- Type-specific heatmaps
- Search across all notes by entry type
- More entry types (System Design, Frontend, etc.)
- Desktop app version (Electron)

## Development

### File Structure
```
dsa-journal/
├── manifest.json          # Extension configuration
├── popup.html            # Main UI with type selector
├── popup.js              # UI logic for all entry types
├── storage.js            # Chrome storage utilities
├── summary.js            # Multi-type summary generation
├── styles.css            # Type-specific styling
├── icon16.png           # Extension icons
├── icon48.png
├── icon128.png
└── README.md
```

### Key Components

**Storage (storage.js)**
- `getAll()` - Get all stored data
- `getDay(date)` - Get specific day's data
- `addEntry()` - Add new entry (any type)
- `deleteEntry()` - Remove entry
- `updateSummary()` - Save daily summary

**Summary (summary.js)**
- `generateDailySummary()` - Auto-generate with type breakdown
- `getEntriesByType()` - Group entries by type
- `generateWeeklyStats()` - Weekly analytics across all types

**UI (popup.js)**
- Type selector with dynamic form switching
- Type-specific entry cards (DSA, SQL, Tech)
- Multi-type summary generation
- Weekly stats with type distribution

## Example Daily Summaries

**Balanced Day:**
```
Solved 3 DSA problems (Array, Stack, DP). Difficulty: 1 Easy, 2 Medium. Time spent: 75 minutes.

Revised 2 SQL/DB topics. Topics: Joins, Indexing.

Learned 1 tech concept. Topics: Redis Caching.
```

**DSA-Focused Day:**
```
Solved 5 DSA problems (Graph, Tree, DP). Difficulty: 2 Easy, 2 Medium, 1 Hard. Time spent: 150 minutes.

Focused mainly on Graph (3 problems).
```

## Browser Compatibility

- Chrome (v88+)
- Edge (v88+)
- Other Chromium-based browsers with Manifest V3 support

## Privacy

- All data stored locally on your machine
- No external API calls
- No user tracking
- No data collection


---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**From**: DSA Journal → Multi-Entry Learning Tracker
