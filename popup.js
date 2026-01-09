// Main popup logic
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
      // Form submission
      document.getElementById('question-form').addEventListener('submit', (e) => {
        e.preventDefault();
        this.addQuestion();
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
      
      // Display questions
      this.displayQuestions(dayData.questions);
  
      // Display summary if exists
      if (dayData.summary) {
        this.showExistingSummary(dayData.summary);
      }
    }
  
    displayQuestions(questions) {
      const container = document.getElementById('questions-container');
      const countEl = document.getElementById('today-count');
      
      countEl.textContent = questions.length;
  
      if (questions.length === 0) {
        container.innerHTML = '<div class="empty-state">No questions logged yet. Add your first one above!</div>';
        return;
      }
  
      container.innerHTML = questions.map(q => this.createQuestionCard(q)).join('');
  
      // Add delete listeners
      container.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.deleteQuestion(btn.dataset.id);
        });
      });
    }
  
    createQuestionCard(question) {
      const difficultyClass = question.difficulty ? question.difficulty.toLowerCase() : '';
      const urlLink = question.url ? 
        `<a href="${question.url}" target="_blank">${question.title}</a>` : 
        question.title;
  
      return `
        <div class="question-card">
          <div class="question-header">
            <div>
              <div class="question-title">${urlLink}</div>
              <div class="question-meta">
                <span class="badge badge-platform">${question.platform}</span>
                <span class="badge badge-topic">${question.topic}</span>
                ${question.difficulty ? `<span class="badge badge-difficulty ${difficultyClass}">${question.difficulty}</span>` : ''}
              </div>
            </div>
            <button class="delete-btn" data-id="${question.id}">×</button>
          </div>
          ${question.notes ? `<div class="question-notes">${question.notes}</div>` : ''}
          ${question.timeTaken ? `<div class="question-time">⏱️ ${question.timeTaken} mins</div>` : ''}
        </div>
      `;
    }
  
    async addQuestion() {
      const question = {
        title: document.getElementById('q-title').value.trim(),
        url: document.getElementById('q-url').value.trim(),
        platform: document.getElementById('q-platform').value,
        topic: document.getElementById('q-topic').value,
        difficulty: document.getElementById('q-difficulty').value,
        timeTaken: document.getElementById('q-time').value,
        notes: document.getElementById('q-notes').value.trim()
      };
  
      await Storage.addQuestion(this.currentDate, question);
      
      // Reset form
      document.getElementById('question-form').reset();
  
      // Reload view
      await this.loadTodayView();
    }
  
    async deleteQuestion(questionId) {
      if (confirm('Delete this question?')) {
        await Storage.deleteQuestion(this.currentDate, questionId);
        await this.loadTodayView();
      }
    }
  
    async showSummarySection() {
      const dayData = await Storage.getDay(this.currentDate);
      const summarySection = document.getElementById('summary-section');
      const summaryText = document.getElementById('summary-text');
  
      // Generate auto summary if none exists
      if (!dayData.summary) {
        const autoSummary = Summary.generateDailySummary(dayData.questions);
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
      this.displayWeeklyDays(weekDays, stats.topics);
    }
  
    displayWeeklyStats(stats) {
      const container = document.getElementById('weekly-stats');
      
      container.innerHTML = `
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${stats.totalProblems}</div>
            <div class="stat-label">Total Problems</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.topicCount}</div>
            <div class="stat-label">Topics Covered</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.bestDay.split(',')[0]}</div>
            <div class="stat-label">Best Day</div>
          </div>
        </div>
        ${this.createTopicDistribution(stats.topics)}
      `;
    }
  
    createTopicDistribution(topics) {
      if (Object.keys(topics).length === 0) return '';
  
      const maxCount = Math.max(...Object.values(topics));
      const topicBars = Object.entries(topics)
        .sort((a, b) => b[1] - a[1])
        .map(([topic, count]) => {
          const percentage = (count / maxCount) * 100;
          return `
            <div class="topic-bar">
              <span class="topic-name">${topic}</span>
              <div class="topic-progress">
                <div class="topic-fill" style="width: ${percentage}%"></div>
              </div>
              <span class="topic-count">${count}</span>
            </div>
          `;
        }).join('');
  
      return `
        <div class="topic-distribution">
          <h4>Topic Distribution</h4>
          ${topicBars}
        </div>
      `;
    }
  
    displayWeeklyDays(weekDays, allTopics) {
      const container = document.getElementById('weekly-days');
      
      container.innerHTML = weekDays.map(day => {
        const questions = day.data.questions;
        const count = questions.length;
        const topics = count > 0 ? 
          [...new Set(questions.map(q => q.topic))].join(', ') : 
          'No problems';
  
        return `
          <div class="day-card" data-date="${day.date}">
            <div class="day-header">
              <span class="day-date">${Storage.formatDateDisplay(day.date)}</span>
              <span class="day-count">${count} problem${count !== 1 ? 's' : ''}</span>
            </div>
            <div class="day-topics">${topics}</div>
            <div class="day-expanded" style="display: none;">
              ${questions.map(q => this.createQuestionCard(q)).join('')}
              ${day.data.summary ? `
                <div class="summary-section" style="margin-top: 12px;">
                  <h4>Summary</h4>
                  <p style="font-size: 13px; color: #657786; margin-top: 8px;">${day.data.summary}</p>
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