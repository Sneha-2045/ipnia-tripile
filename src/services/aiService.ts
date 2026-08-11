// AI Service for Chatbot Integration
// This service handles communication with Google Gemini AI

interface AIResponse {
  text: string;
  confidence?: number;
  suggestions?: string[];
}

interface ChatContext {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  userInfo?: {
    background?: string;
    interests?: string[];
    currentPage?: string;
  };
}

class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  // Get AI response using Google Gemini API
  async getAIResponse(userInput: string, context?: ChatContext): Promise<AIResponse> {
    if (!this.apiKey) {
      // Fallback to local response if no API key
      return this.getLocalResponse(userInput);
    }

    try {
      // Prepare the conversation history for Gemini
      const conversationHistory = context?.messages || [];
      
      // Create the system prompt
      const systemPrompt = `You are IPNIA's AI assistant, a helpful and knowledgeable guide for students interested in AI courses. 
      
      About IPNIA:
      - We offer AI courses in Law, Technology, Medicine, Finance, HR, Business, and Architecture
      - Three programs: Online Immersion ($99), India Immersion ($999), Global Exposure ($9999)
      - India and Global programs include on-site internships with accommodation and meals
      - All programs provide certificates and lifetime course access
      - Scholarships available for deserving candidates
      
      Your role:
      - Help students choose the right course based on their background
      - Provide detailed information about programs, pricing, and benefits
      - Guide them through the application process
      - Be friendly, professional, and encouraging
      - Keep responses concise but informative (2-3 sentences max)
      - Always mention specific prices and program names when relevant
      
      Respond in a conversational, helpful manner.`;

      // Build the conversation for Gemini
      const contents = [
        {
          parts: [{ text: systemPrompt }]
        },
        ...conversationHistory.map(msg => ({
          parts: [{ text: msg.content }]
        })),
        {
          parts: [{ text: userInput }]
        }
      ];

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 300,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const aiText = data.candidates[0].content.parts[0].text;
        return {
          text: aiText,
          confidence: 0.9
        };
      } else {
        throw new Error('Invalid response format from Gemini API');
      }

    } catch (error) {
      console.error('Gemini API Error:', error);
      // Fallback to local response
      return this.getLocalResponse(userInput);
    }
  }

  // Local response system (fallback when API is not available)
  private getLocalResponse(userInput: string): AIResponse {
    const input = userInput.toLowerCase();
    
    // Course recommendation logic
    if (input.includes('law') || input.includes('legal')) {
      return {
        text: "Perfect! Our Legal AI track is designed specifically for law students and professionals. It covers AI tools for legal research, document analysis, and case management. The $999 India Immersion Program includes 3 months of training with on-site internship. Would you like to know more about the curriculum?",
        confidence: 0.8
      };
    }
    
    if (input.includes('tech') || input.includes('computer') || input.includes('software')) {
      return {
        text: "Excellent choice! Our Technology AI track focuses on AI integration in software development, automation, and system optimization. The program includes hands-on projects with real tech companies. The $999 program offers the best value with accommodation and meals included. Should I show you the detailed syllabus?",
        confidence: 0.8
      };
    }
    
    if (input.includes('medical') || input.includes('health') || input.includes('doctor')) {
      return {
        text: "Great! Our Medical AI track is perfect for healthcare professionals. Learn AI applications in diagnosis, patient care, and medical research. The program includes industry visits to leading hospitals and research centers. The $9999 Global program even includes international medical AI exposure. Interested in the medical AI curriculum?",
        confidence: 0.8
      };
    }
    
    if (input.includes('finance') || input.includes('banking') || input.includes('accounting')) {
      return {
        text: "Smart choice! Our Finance AI track covers AI in banking, investment analysis, risk assessment, and financial planning. You'll work with real financial data and tools. The $999 program includes internship with financial institutions. Want to see the finance AI course structure?",
        confidence: 0.8
      };
    }
    
    if (input.includes('hr') || input.includes('human resource')) {
      return {
        text: "Excellent! Our HR AI track focuses on AI in recruitment, employee management, and organizational development. Learn to use AI for talent acquisition, performance analysis, and workplace optimization. The $999 program includes HR tech company internships. Ready to explore HR AI applications?",
        confidence: 0.8
      };
    }
    
    if (input.includes('business') || input.includes('management')) {
      return {
        text: "Perfect! Our Business AI track covers AI in business strategy, operations, marketing, and decision-making. You'll learn to implement AI solutions for business growth and efficiency. The $999 program includes business consulting projects. Want to see how AI transforms business operations?",
        confidence: 0.8
      };
    }
    
    if (input.includes('architecture') || input.includes('design')) {
      return {
        text: "Amazing! Our Architecture AI track explores AI in architectural design, urban planning, and construction. Learn to use AI for sustainable design, 3D modeling, and project management. The $999 program includes architecture firm collaborations. Interested in AI-powered design innovation?",
        confidence: 0.8
      };
    }
    
    if (input.includes('price') || input.includes('cost') || input.includes('fee')) {
      return {
        text: "We have three programs: Online Immersion ($99), India Immersion ($999), and Global Exposure ($9999). The India program includes accommodation, meals, and on-site internship. Scholarships are available for deserving candidates. Which program interests you most?",
        confidence: 0.9
      };
    }
    
    if (input.includes('internship') || input.includes('placement')) {
      return {
        text: "Yes! Our India Immersion ($999) and Global programs include guaranteed on-site internships with accommodation and meals. You'll work on real industry projects and get mentorship from professionals. Many students receive job offers from our partner companies. Would you like to know about our industry partners?",
        confidence: 0.9
      };
    }
    
    if (input.includes('reputed companies') || input.includes('top companies') || input.includes('partner companies')) {
      return {
        text: "Excellent! We partner with leading companies across industries including tech giants, law firms, hospitals, financial institutions, and consulting firms. Our students have interned at companies like TCS, Infosys, leading law firms, hospitals, and startups. The $999 and $9999 programs guarantee placement with our reputed partner companies!",
        confidence: 0.9
      };
    }
    
    if (input.includes('personalized') || input.includes('customized') || input.includes('individual training')) {
      return {
        text: "Absolutely! Our personalized training approach ensures you get individual attention and customized learning paths. Each student receives one-on-one mentorship, personalized project assignments, and tailored curriculum based on their background and career goals. This is included in all our programs, with enhanced personalization in the $999 and $9999 programs!",
        confidence: 0.9
      };
    }
    
    if (input.includes('certificate') || input.includes('certification')) {
      return {
        text: "Absolutely! All programs include a professional certificate and Letter of Recommendation. The India and Global programs also provide industry evaluation and networking opportunities. These certificates are recognized by our partner companies and can boost your career prospects significantly!",
        confidence: 0.9
      };
    }
    
    if (input.includes('scholarship') || input.includes('discount')) {
      return {
        text: "Yes! We offer scholarships for deserving candidates in the $999 and $9999 programs. Scholarships are based on academic performance, financial need, and interview performance. You can apply during the registration process. Would you like to know more about the scholarship criteria?",
        confidence: 0.8
      };
    }
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return {
        text: "Hello! 👋 I'm here to help you find the perfect AI course at IPNIA. What's your background or area of interest? I can guide you through our programs and help you choose the best option for your career goals!",
        confidence: 0.9
      };
    }
    
    if (input.includes('apply') || input.includes('register') || input.includes('enroll')) {
      return {
        text: "Great! You can apply directly through our website. Click the 'Apply Now' button on any course card, or I can guide you through the process. You'll need to provide basic information and choose your preferred program. Would you like me to walk you through the application steps?",
        confidence: 0.8
      };
    }
    
    // Default response
    return {
      text: "That's interesting! I'd love to help you find the perfect AI course. Could you tell me more about your background or what specific area you're interested in? I can recommend courses in Law, Technology, Medicine, Finance, HR, Business, or Architecture AI.",
      confidence: 0.6
    };
  }

  // Get quick suggestions based on user input
  getSuggestions(userInput: string): string[] {
    const input = userInput.toLowerCase();
    
    if (input.includes('law') || input.includes('legal')) {
      return ['Tell me about the curriculum', 'What about internships?', 'How much does it cost?'];
    }
    
    if (input.includes('tech') || input.includes('computer')) {
      return ['Show me the syllabus', 'What projects will I work on?', 'Tell me about placements'];
    }
    
    if (input.includes('internship') || input.includes('placement')) {
      return ['Which companies do you partner with?', 'What about personalized training?', 'Tell me about the certificate'];
    }
    
    if (input.includes('personalized') || input.includes('training')) {
      return ['How is training customized?', 'What about internship opportunities?', 'Tell me about the programs'];
    }
    
    if (input.includes('price') || input.includes('cost')) {
      return ['Online program details', 'India program benefits', 'Global program features'];
    }
    
    return ['Tell me about courses', 'What are the prices?', 'How do I apply?'];
  }
}

export const aiService = new AIService();
export default aiService; 