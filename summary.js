// Summary generation utilities
const Summary = {
    // Generate auto summary for a day
    generateDailySummary(questions) {
      if (questions.length === 0) {
        return "No questions solved today.";
      }
  
      const totalProblems = questions.length;
      const topics = this.getTopicDistribution(questions);
      const platforms = this.getPlatformDistribution(questions);
      const difficulties = this.getDifficultyDistribution(questions);
      const totalTime = questions.reduce((sum, q) => sum + (parseInt(q.timeTaken) || 0), 0);
  
      let summary = `Solved ${totalProblems} problem${totalProblems > 1 ? 's' : ''} today.\n\n`;
  
      // Topics covered
      if (Object.keys(topics).length > 0) {
        summary += `Topics covered: ${Object.keys(topics).join(', ')}.\n`;
      }
  
      // Difficulty breakdown
      const difficultyText = [];
      if (difficulties.Easy) difficultyText.push(`${difficulties.Easy} Easy`);
      if (difficulties.Medium) difficultyText.push(`${difficulties.Medium} Medium`);
      if (difficulties.Hard) difficultyText.push(`${difficulties.Hard} Hard`);
      if (difficultyText.length > 0) {
        summary += `Difficulty: ${difficultyText.join(', ')}.\n`;
      }
  
      // Time spent
      if (totalTime > 0) {
        summary += `Total time: ${totalTime} minutes.\n`;
      }
  
      // Most frequent topic
      const topTopic = Object.entries(topics).sort((a, b) => b[1] - a[1])[0];
      if (topTopic && topTopic[1] > 1) {
        summary += `\nFocused mainly on ${topTopic[0]} (${topTopic[1]} problems).`;
      }
  
      return summary;
    },
  
    // Get topic distribution
    getTopicDistribution(questions) {
      const topics = {};
      questions.forEach(q => {
        if (q.topic) {
          topics[q.topic] = (topics[q.topic] || 0) + 1;
        }
      });
      return topics;
    },
  
    // Get platform distribution
    getPlatformDistribution(questions) {
      const platforms = {};
      questions.forEach(q => {
        if (q.platform) {
          platforms[q.platform] = (platforms[q.platform] || 0) + 1;
        }
      });
      return platforms;
    },
  
    // Get difficulty distribution
    getDifficultyDistribution(questions) {
      const difficulties = {};
      questions.forEach(q => {
        if (q.difficulty) {
          difficulties[q.difficulty] = (difficulties[q.difficulty] || 0) + 1;
        }
      });
      return difficulties;
    },
  
    // Generate weekly stats
    generateWeeklyStats(weekDays) {
      const allQuestions = weekDays.flatMap(day => day.data.questions);
      const totalProblems = allQuestions.length;
      const topics = this.getTopicDistribution(allQuestions);
      const topicCount = Object.keys(topics).length;
  
      // Find best day
      let bestDay = null;
      let maxProblems = 0;
      weekDays.forEach(day => {
        const count = day.data.questions.length;
        if (count > maxProblems) {
          maxProblems = count;
          bestDay = day.date;
        }
      });
  
      return {
        totalProblems,
        topicCount,
        bestDay: bestDay ? Storage.formatDateDisplay(bestDay) : 'N/A',
        topics
      };
    }
  };