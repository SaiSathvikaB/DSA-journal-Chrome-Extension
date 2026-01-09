// Storage utilities for DSA Journal (Multi-Entry Support)
const Storage = {
    // Get all data
    async getAll() {
      return new Promise((resolve) => {
        chrome.storage.local.get(['days'], (result) => {
          resolve(result.days || {});
        });
      });
    },
  
    // Get data for a specific date
    async getDay(dateStr) {
      const allData = await this.getAll();
      return allData[dateStr] || { entries: [], summary: '' };
    },
  
    // Save data for a specific date
    async saveDay(dateStr, dayData) {
      const allData = await this.getAll();
      allData[dateStr] = dayData;
      return new Promise((resolve) => {
        chrome.storage.local.set({ days: allData }, () => {
          resolve(true);
        });
      });
    },
  
    // Add an entry to today
    async addEntry(dateStr, entry) {
      const dayData = await this.getDay(dateStr);
      entry.id = this.generateId();
      entry.timestamp = new Date().toISOString();
      dayData.entries.push(entry);
      await this.saveDay(dateStr, dayData);
      return entry;
    },
  
    // Delete an entry
    async deleteEntry(dateStr, entryId) {
      const dayData = await this.getDay(dateStr);
      dayData.entries = dayData.entries.filter(e => e.id !== entryId);
      await this.saveDay(dateStr, dayData);
      return true;
    },
  
    // Update summary for a day
    async updateSummary(dateStr, summary) {
      const dayData = await this.getDay(dateStr);
      dayData.summary = summary;
      await this.saveDay(dateStr, dayData);
      return true;
    },
  
    // Get last N days
    async getLastNDays(n) {
      const allData = await this.getAll();
      const today = new Date();
      const days = [];
      
      for (let i = 0; i < n; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = this.formatDate(date);
        days.push({
          date: dateStr,
          data: allData[dateStr] || { entries: [], summary: '' }
        });
      }
      
      return days;
    },
  
    // Utility functions
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
  
    formatDateDisplay(dateStr) {
      const date = new Date(dateStr + 'T00:00:00');
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    },
  
    generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
  
    getTodayStr() {
      return this.formatDate(new Date());
    }
  };