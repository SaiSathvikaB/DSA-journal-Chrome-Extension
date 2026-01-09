// Summary generation utilities (Multi-Entry Support)
const Summary = {
    // Generate auto summary for a day
    generateDailySummary(entries) {
      if (entries.length === 0) {
        return "No learning entries today.";
      }
  
      const byType = this.getEntriesByType(entries);
      const dsaCount = byType.DSA?.length || 0;
      const sqlCount = byType.SQL?.length || 0;
      const techCount = byType.TECH?.length || 0;
  
      let summary = "";
  
      // DSA Summary
      if (dsaCount > 0) {
        const topics = this.getTopicsFromEntries(byType.DSA);
        const difficulties = this.getDifficultyDistribution(byType.DSA);
        const totalTime = byType.DSA.reduce((sum, e) => sum + (parseInt(e.timeTaken) || 0), 0);
  
        summary += `Solved ${dsaCount} DSA problem${dsaCount > 1 ? 's' : ''}`;
        if (Object.keys(topics).length > 0) {
          summary += ` (${Object.keys(topics).join(', ')})`;
        }
        summary += ". ";
  
        if (difficulties.Easy || difficulties.Medium || difficulties.Hard) {
          const diffParts = [];
          if (difficulties.Easy) diffParts.push(`${difficulties.Easy} Easy`);
          if (difficulties.Medium) diffParts.push(`${difficulties.Medium} Medium`);
          if (difficulties.Hard) diffParts.push(`${difficulties.Hard} Hard`);
          summary += `Difficulty: ${diffParts.join(', ')}. `;
        }
  
        if (totalTime > 0) {
          summary += `Time spent: ${totalTime} minutes. `;
        }
      }
  
      // SQL Summary
      if (sqlCount > 0) {
        summary += `\n\nRevised ${sqlCount} SQL/DB topic${sqlCount > 1 ? 's' : ''}. `;
        const sqlTitles = byType.SQL.map(e => e.title).slice(0, 3);
        if (sqlTitles.length > 0) {
          summary += `Topics: ${sqlTitles.join(', ')}${sqlCount > 3 ? ', ...' : ''}. `;
        }
      }
  
      // Tech Summary
      if (techCount > 0) {
        summary += `\n\nLearned ${techCount} tech concept${techCount > 1 ? 's' : ''}. `;
        const techTitles = byType.TECH.map(e => e.title).slice(0, 3);
        if (techTitles.length > 0) {
          summary += `Topics: ${techTitles.join(', ')}${techCount > 3 ? ', ...' : ''}. `;
        }
      }
  
      return summary.trim();
    },
  
    // Get entries grouped by type
    getEntriesByType(entries) {
      const grouped = {};
      entries.forEach(entry => {
        if (!grouped[entry.type]) {
          grouped[entry.type] = [];
        }
        grouped[entry.type].push(entry);
      });
      return grouped;
    },
  
    // Get topics from DSA entries
    getTopicsFromEntries(entries) {
      const topics = {};
      entries.forEach(e => {
        if (e.topic) {
          topics[e.topic] = (topics[e.topic] || 0) + 1;
        }
      });
      return topics;
    },
  
    // Get difficulty distribution
    getDifficultyDistribution(entries) {
      const difficulties = {};
      entries.forEach(e => {
        if (e.difficulty) {
          difficulties[e.difficulty] = (difficulties[e.difficulty] || 0) + 1;
        }
      });
      return difficulties;
    },
  
    // Generate weekly stats
    generateWeeklyStats(weekDays) {
      const allEntries = weekDays.flatMap(day => day.data.entries);
      const byType = this.getEntriesByType(allEntries);
      
      const dsaCount = byType.DSA?.length || 0;
      const sqlCount = byType.SQL?.length || 0;
      const techCount = byType.TECH?.length || 0;
      const totalEntries = allEntries.length;
  
      // Get DSA topics
      const dsaTopics = byType.DSA ? this.getTopicsFromEntries(byType.DSA) : {};
      const topicCount = Object.keys(dsaTopics).length;
  
      // Find best day
      let bestDay = null;
      let maxEntries = 0;
      weekDays.forEach(day => {
        const count = day.data.entries.length;
        if (count > maxEntries) {
          maxEntries = count;
          bestDay = day.date;
        }
      });
  
      return {
        totalEntries,
        dsaCount,
        sqlCount,
        techCount,
        topicCount,
        bestDay: bestDay ? Storage.formatDateDisplay(bestDay) : 'N/A',
        byType
      };
    }
  };