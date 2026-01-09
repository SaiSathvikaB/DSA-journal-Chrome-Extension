// Main popup logic (Multi-Entry Support)
class DSAJournal {
    constructor() {
      this.currentDate = Storage.getTodayStr();
      this.currentView = 'today';
      this.init();
    }
  
    async init() {
      this.setupEventListeners();
      await this.loadTodayView();
      this.setupNavigation();
    }
  
    setupEventListeners() {
      // Entry type selector
      document.getElementById('entry-type').addEventListener('change', (e) => {
        this.showEntryForm(e.target.value);
      });
  
      // Form submissions
      document.getElementById('dsa-form').addEventListener('submit', (e) => {
        e.preventDefault();
        this.addDSAEntry();
      });
  
      document.getElementById('sql-form').addEventListener('submit', (e) => {
        e.preventDefault();
        this.addSQLEntry();
      });
  
      document.getElementById('tech-form').addEventListener('submit', (e) => {
        e.preventDefault();
        this.addTechEntry();
      });
  
      // Summarize button
      document.getElementById('summarize-btn').addEventListener('click', () => {
        this.showSummarySection();
      });
  
      // Save summary
      document.getElementById('save-summary-btn').addEventListener('click', () => {
        this.saveSummary();
      });
    }
  
    showEntryForm(type) {
      // Hide all forms
      document.querySelectorAll('.entry-form').forEach(form => {
        form.classList.add('hidden');
      });
  
      // Show selected form
      if (type === 'DSA') {
        document.getElementById('dsa-form').classList.remove('hidden');
      } else if (type === 'SQL') {
        document.getElementById('sql-form').classList.remove('hidden');
      } else if (type === 'TECH') {
        document.getElementById('tech-form').classList.remove('hidden');
      }
    }
  
    setupNavigation() {
      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const view = btn.dataset.view;
          this.switchView(view);
        });
      });
    }
  
    async switchView(view) {
      // Update nav buttons
      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
      });
  
      // Update views
      document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active');
      });
      document.getElementById(`${view}-view`).classList.add('active');
  
      this.currentView = view;
  
      if (view === 'weekly') {
        await this.loadWeeklyView();
      }
    }
  
    async loadTodayView() {
      // Set date header
      document.getElementById('current-date').textContent = 
        Storage.formatDateDisplay(this.currentDate);
  
      // Load today's data
      const dayData = await Storage.getDay(this.currentDate);
      
      // Display entries
      this.displayEntries(dayData.entries);
  
      // Display summary if exists
      if (dayData.summary) {
        this.showExistingSummary(dayData.summary);
      }
    }
  
    displayEntries(entries) {
      const container = document.getElementById('entries-container');
      const countEl = document.getElementById('today-count');
      
      countEl.textContent = entries.length;
  
      if (entries.length === 0) {
        container.innerHTML = '<div class="empty-state">No learning entries yet. Add your first one above!</div>';
        return;
      }
  
      container.innerHTML = entries.map(e => this.createEntryCard(e)).join('');
  
      // Add delete listeners
      container.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.deleteEntry(btn.dataset.id);
        });
      });
    }
  
    createEntryCard(entry) {
      if (entry.type === 'DSA') {
        return this.createDSACard(entry);
      } else if (entry.type === 'SQL') {
        return this.createSQLCard(entry);
      } else if (entry.type === 'TECH') {
        return this.createTechCard(entry);
      }
    }
  
    createDSACard(entry) {
      const difficultyClass = entry.difficulty ? entry.difficulty.toLowerCase() : '';
      const urlLink = entry.url ? 
        `<a href="${entry.url}" target="_blank">${entry.title}</a>` : 
        entry.title;
  
      return `
        <div class="entry-card type-DSA">
          <div class="entry-header">
            <div>
              <div class="entry-title">${urlLink}</div>
              <div class="entry-meta">
                <span class="badge badge-type DSA">🧠 DSA</span>
                <span class="badge badge-platform">${entry.platform}</span>
                <span class="badge badge-topic">${entry.topic}</span>
                ${entry.difficulty ? `<span class="badge badge-difficulty ${difficultyClass}">${entry.difficulty}</span>` : ''}
              </div>
            </div>
            <button class="delete-btn" data-id="${entry.id}">×</button>
          </div>
          ${entry.notes ? `<div class="entry-content">${entry.notes}</div>` : ''}
          ${entry.timeTaken ? `<div class="entry-time">⏱️ ${entry.timeTaken} mins</div>` : ''}
        </div>
      `;
    }
  
    createSQLCard(entry) {
      return `
        <div class="entry-card type-SQL">
          <div class="entry-header">
            <div>
              <div class="entry-title">${entry.title}</div>
              <div class="entry-meta">
                <span class="badge badge-type SQL">🗄️ SQL</span>
              </div>
            </div>
            <button class="delete-btn" data-id="${entry.id}">×</button>
          </div>
          ${entry.query ? `
            <div class="entry-section">
              <div class="entry-section-label">Query</div>
              <div class="entry-query">${entry.query}</div>
            </div>
          ` : ''}
          ${entry.notes ? `
            <div class="entry-section">
              <div class="entry-section-label">Notes</div>
              <div class="entry-content">${entry.notes}</div>
            </div>
          ` : ''}
          ${entry.mistake ? `
            <div class="entry-section">
              <div class="entry-section-label">Mistake / Gotcha</div>
              <div class="entry-content">${entry.mistake}</div>
            </div>
          ` : ''}
        </div>
      `;
    }
  
    createTechCard(entry) {
      return `
        <div class="entry-card type-TECH">
          <div class="entry-header">
            <div>
              <div class="entry-title">${entry.title}</div>
              <div class="entry-meta">
                <span class="badge badge-type TECH">⚙️ Tech</span>
              </div>
            </div>
            <button class="delete-btn" data-id="${entry.id}">×</button>
          </div>
          ${entry.description ? `
            <div class="entry-section">
              <div class="entry-section-label">Description</div>
              <div class="entry-content">${entry.description}</div>
            </div>
          ` : ''}
          ${entry.why ? `
            <div class="entry-section">
              <div class="entry-section-label">Why It Matters</div>
              <div class="entry-content">${entry.why}</div>
            </div>
          ` : ''}
          ${entry.stuck ? `
            <div class="entry-section">
              <div class="entry-section-label">Where I Got Stuck</div>
              <div class="entry-content">${entry.stuck}</div>
            </div>
          ` : ''}
        </div>
      `;
    }
  
    async addDSAEntry() {
      const entry = {
        type: 'DSA',
        title: document.getElementById('dsa-title').value.trim(),
        url: document.getElementById('dsa-url').value.trim(),
        platform: document.getElementById('dsa-platform').value,
        topic: document.getElementById('dsa-topic').value,
        difficulty: document.getElementById('dsa-difficulty').value,
        timeTaken: document.getElementById('dsa-time').value,
        notes: document.getElementById('dsa-notes').value.trim()
      };
  
      await Storage.addEntry(this.currentDate, entry);
      this.resetForms();
      await this.loadTodayView();
    }
  
    async addSQLEntry() {
      const entry = {
        type: 'SQL',
        title: document.getElementById('sql-title').value.trim(),
        query: document.getElementById('sql-query').value.trim(),
        notes: document.getElementById('sql-notes').value.trim(),
        mistake: document.getElementById('sql-mistake').value.trim()
      };
  
      await Storage.addEntry(this.currentDate, entry);
      this.resetForms();
      await this.loadTodayView();
    }
  
    async addTechEntry() {
      const entry = {
        type: 'TECH',
        title: document.getElementById('tech-title').value.trim(),
        description: document.getElementById('tech-description').value.trim(),
        why: document.getElementById('tech-why').value.trim(),
        stuck: document.getElementById('tech-stuck').value.trim()
      };
  
      await Storage.addEntry(this.currentDate, entry);
      this.resetForms();
      await this.loadTodayView();
    }
  
    resetForms() {
      document.getElementById('entry-type').value = '';
      document.getElementById('dsa-form').reset();
      document.getElementById('sql-form').reset();
      document.getElementById('tech-form').reset();
      document.querySelectorAll('.entry-form').forEach(form => {
        form.classList.add('hidden');
      });
    }
  
    async deleteEntry(entryId) {
      if (confirm('Delete this entry?')) {
        await Storage.deleteEntry(this.currentDate, entryId);
        await this.loadTodayView();
      }
    }
  
    async showSummarySection() {
      const dayData = await Storage.getDay(this.currentDate);
      const summarySection = document.getElementById('summary-section');
      const summaryText = document.getElementById('summary-text');
  
      // Generate auto summary if none exists
      if (!dayData.summary) {
        const autoSummary = Summary.generateDailySummary(dayData.entries);
        summaryText.value = autoSummary;
      } else {
        summaryText.value = dayData.summary;
      }
  
      summarySection.classList.remove('hidden');
      summaryText.focus();
    }
  
    showExistingSummary(summary) {
      const summarySection = document.getElementById('summary-section');
      const summaryText = document.getElementById('summary-text');
      
      summaryText.value = summary;
      summarySection.classList.remove('hidden');
    }
  
    async saveSummary() {
      const summary = document.getElementById('summary-text').value.trim();
      await Storage.updateSummary(this.currentDate, summary);
      alert('Summary saved!');
    }
  
    async loadWeeklyView() {
      const weekDays = await Storage.getLastNDays(7);
      const stats = Summary.generateWeeklyStats(weekDays);
  
      // Display stats
      this.displayWeeklyStats(stats);
  
      // Display days
      this.displayWeeklyDays(weekDays);
    }
  
    displayWeeklyStats(stats) {
      const container = document.getElementById('weekly-stats');
      
      container.innerHTML = `
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${stats.totalEntries}</div>
            <div class="stat-label">Total Entries</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.dsaCount}</div>
            <div class="stat-label">DSA Problems</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.sqlCount}</div>
            <div class="stat-label">SQL Topics</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.techCount}</div>
            <div class="stat-label">Tech Concepts</div>
          </div>
        </div>
        ${this.createTypeDistribution(stats.byType)}
      `;
    }
  
    createTypeDistribution(byType) {
      const types = ['DSA', 'SQL', 'TECH'];
      const maxCount = Math.max(...types.map(t => byType[t]?.length || 0));
      
      if (maxCount === 0) return '';
  
      const typeIcons = { DSA: '🧠', SQL: '🗄️', TECH: '⚙️' };
      const typeBars = types
        .filter(type => byType[type] && byType[type].length > 0)
        .map(type => {
          const count = byType[type].length;
          const percentage = (count / maxCount) * 100;
          return `
            <div class="type-bar">
              <span class="type-name">${typeIcons[type]} ${type}</span>
              <div class="type-progress">
                <div class="type-fill ${type}" style="width: ${percentage}%"></div>
              </div>
              <span class="type-count">${count}</span>
            </div>
          `;
        }).join('');
  
      return `
        <div class="type-distribution">
          <h4>Entry Type Distribution</h4>
          ${typeBars}
        </div>
      `;
    }
  
    displayWeeklyDays(weekDays) {
      const container = document.getElementById('weekly-days');
      
      container.innerHTML = weekDays.map(day => {
        const entries = day.data.entries;
        const count = entries.length;
        const byType = Summary.getEntriesByType(entries);
        
        const breakdown = [];
        if (byType.DSA) breakdown.push(`${byType.DSA.length} DSA`);
        if (byType.SQL) breakdown.push(`${byType.SQL.length} SQL`);
        if (byType.TECH) breakdown.push(`${byType.TECH.length} Tech`);
        const breakdownText = breakdown.length > 0 ? breakdown.join(', ') : 'No entries';
  
        return `
          <div class="day-card" data-date="${day.date}">
            <div class="day-header">
              <span class="day-date">${Storage.formatDateDisplay(day.date)}</span>
              <span class="day-count">${count} entr${count !== 1 ? 'ies' : 'y'}</span>
            </div>
            <div class="day-breakdown">${breakdownText}</div>
            <div class="day-expanded" style="display: none;">
              ${entries.map(e => this.createEntryCard(e)).join('')}
              ${day.data.summary ? `
                <div class="summary-section" style="margin-top: 12px;">
                  <h4>Summary</h4>
                  <p style="font-size: 13px; color: #657786; margin-top: 8px; white-space: pre-wrap;">${day.data.summary}</p>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');
  
      // Add click handlers to expand/collapse
      container.querySelectorAll('.day-card').forEach(card => {
        const expandedSection = card.querySelector('.day-expanded');
        card.addEventListener('click', (e) => {
          if (e.target.classList.contains('delete-btn')) return;
          
          const isExpanded = expandedSection.style.display !== 'none';
          expandedSection.style.display = isExpanded ? 'none' : 'block';
        });
      });
    }
  }
  
  // Initialize app
  document.addEventListener('DOMContentLoaded', () => {
    new DSAJournal();
  });