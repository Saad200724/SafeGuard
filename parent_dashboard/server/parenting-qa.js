// Simple pre-defined parenting questions and answers
const parentingQA = [
  {
    question: "How much screen time is appropriate for my child?",
    answer: "Screen time recommendations vary by age. For children 2-5 years, limit to 1 hour per day of high-quality content. For 6-12 years, establish consistent limits, ensuring it doesn't replace physical activity, sleep, and social interaction. For teens, focus on maintaining a healthy balance with other activities.",
    keywords: ["screen time", "digital", "media", "device", "limit", "tablet", "phone", "computer", "TV", "television"]
  },
  {
    question: "How do I talk to my child about online safety?",
    answer: "Start conversations early and keep them ongoing. Use age-appropriate language explaining potential risks without causing fear. Teach them to protect personal information and never share details like full name, address, school, or photos with strangers. Establish clear internet safety rules including which sites are acceptable and when to ask for permission.",
    keywords: ["online", "safety", "internet", "protect", "danger", "stranger", "predator", "privacy", "security", "digital"]
  },
  {
    question: "What are signs my child might be experiencing cyberbullying?",
    answer: "Watch for behavioral changes like withdrawing from social activities, appearing anxious when receiving notifications, or becoming upset after using devices. They might be reluctant to discuss online activities, suddenly stop using devices, or switch screens when you approach. Other signs include decreased self-esteem, declining grades, or changes in eating or sleeping habits.",
    keywords: ["cyberbullying", "bullying", "harassment", "online", "mean", "threat", "abuse", "social media"]
  },
  {
    question: "How can I monitor my child's online activities without invading their privacy?",
    answer: "Balance monitoring with trust by being transparent about your oversight. Explain that supervision is for safety, not a lack of trust. Keep devices in common areas rather than private spaces like bedrooms. For younger children, use parental controls designed for their age group, gradually reducing restrictions as they demonstrate responsibility.",
    keywords: ["monitor", "track", "supervise", "spy", "control", "app", "parental control", "check", "privacy"]
  },
  {
    question: "How do I set up parental controls on devices?",
    answer: "For iOS devices, use Screen Time in Settings to limit app usage, restrict content, and set downtime periods. On Android, use Digital Wellbeing or Google Family Link. For Windows computers, set up Microsoft Family Safety. On Mac, use Screen Time in System Preferences. Gaming consoles have parental controls in their settings menus.",
    keywords: ["parental control", "restriction", "limit", "filter", "block", "settings", "setup", "configure"]
  },
  {
    question: "What's the right age to give my child their first smartphone?",
    answer: "There's no single right age for a first smartphone, but most experts suggest waiting until at least middle school (11-13 years) when children have developed some self-regulation and understanding of online risks. Consider your child's maturity level, responsibility with other devices, ability to follow rules, and legitimate communication needs.",
    keywords: ["smartphone", "phone", "mobile", "cell", "device", "age", "appropriate", "first", "buy", "ready"]
  },
  {
    question: "How can I help my child develop healthy digital habits?",
    answer: "Model healthy digital habits yourself by limiting your own screen time when with family. Create tech-free zones and times, like during meals or in bedrooms. Balance screen activities with physical play, reading, and face-to-face social interactions. Teach mindful technology use by encouraging awareness of how much time they're spending on devices.",
    keywords: ["habit", "digital", "health", "balance", "addiction", "healthy", "routine", "limit", "manage"]
  },
  {
    question: "What should I do if I discover inappropriate content on my child's device?",
    answer: "Stay calm and avoid immediate accusations or punishment which may damage trust and communication. Find a private moment to have a conversation, using a curious rather than confrontational tone. Ask open-ended questions about how they encountered the content and how it made them feel. Listen without judgment to understand the context.",
    keywords: ["inappropriate", "content", "explicit", "adult", "violent", "discover", "find", "history", "access"]
  },
  {
    question: "How do I know what video games are appropriate for my child?",
    answer: "Use the ESRB (Entertainment Software Rating Board) ratings as a starting point: E (Everyone), E10+ (Everyone 10+), T (Teen), M (Mature 17+), and A (Adults Only). Read the content descriptors that explain why a game received its rating, covering elements like violence, language, or mature themes.",
    keywords: ["video game", "game", "gaming", "appropriate", "rating", "violent", "console", "play", "age"]
  },
  {
    question: "What do I do if my child is contacted by a stranger online?",
    answer: "First, stay calm and commend your child if they told you about the contact. Explain that they should never share personal information with online strangers. Show them how to block and report unwanted contacts on the platforms they use. For younger children, closely monitor their online interactions and use platforms with strong parental controls.",
    keywords: ["stranger", "contact", "message", "unknown", "predator", "approach", "talk", "chat", "friend request"]
  }
];

/**
 * Find the best answer for a given question
 */
function findAnswer(query) {
  if (!query || query.trim() === '') {
    return "I'm your AI parenting assistant. Feel free to ask me any questions about parenting, child online safety, or how to interpret your child's online activities.";
  }

  query = query.toLowerCase();
  
  // First, try direct keyword matching
  let bestMatch = null;
  let highestScore = 0;
  
  for (const qa of parentingQA) {
    // Check if query contains keywords
    let score = 0;
    for (const keyword of qa.keywords) {
      if (query.includes(keyword.toLowerCase())) {
        score++;
      }
    }
    
    // Also check for question similarity
    if (query.includes(qa.question.toLowerCase())) {
      score += 5; // Give higher weight to question matches
    }
    
    if (score > highestScore) {
      highestScore = score;
      bestMatch = qa;
    }
  }
  
  // If we found a good match, return the answer
  if (bestMatch && highestScore > 0) {
    return bestMatch.answer;
  }
  
  // If no good match, provide a general response
  return "I don't have specific information about that parenting topic. I can help with questions about screen time, online safety, child development, behavior management, and many other parenting concerns. Could you try rephrasing your question?";
}

module.exports = { findAnswer };