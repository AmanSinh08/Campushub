export interface GreetingInfo {
  greeting: string;
  emoji: string;
  fullGreeting: string;
}

export const getDynamicGreeting = (fullName?: string): GreetingInfo => {
  const hour = new Date().getHours();
  const firstName = fullName ? fullName.trim().split(' ')[0] : 'Student';

  if (hour >= 5 && hour < 12) {
    return {
      greeting: `Good morning, ${firstName}`,
      emoji: '☀️',
      fullGreeting: `Good morning, ${firstName} ☀️`,
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      greeting: `Good afternoon, ${firstName}`,
      emoji: '👋',
      fullGreeting: `Good afternoon, ${firstName} 👋`,
    };
  } else if (hour >= 17 && hour < 22) {
    return {
      greeting: `Good evening, ${firstName}`,
      emoji: '🌆',
      fullGreeting: `Good evening, ${firstName} 🌆`,
    };
  } else {
    return {
      greeting: `Good night, ${firstName}`,
      emoji: '🌙',
      fullGreeting: `Good night, ${firstName} 🌙`,
    };
  }
};
