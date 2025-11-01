const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');

class AIService {
  constructor() {
    // Initialize Gemini
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    if (this.geminiApiKey) {
      try {
        this.geminiAI = new GoogleGenerativeAI(this.geminiApiKey);
        // Don't initialize model yet - will determine working model when first used
        this.geminiModel = null;
        this.workingModelName = null;
        console.log('✅ Gemini AI initialized (will determine model on first use)');
      } catch (error) {
        console.error('❌ Gemini initialization error:', error);
        this.geminiAI = null;
      }
    } else {
      console.log('⚠️  GEMINI_API_KEY not found, Gemini AI disabled');
      this.geminiAI = null;
    }

    // Initialize OpenAI
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    if (this.openaiApiKey) {
      try {
        this.openai = new OpenAI({ apiKey: this.openaiApiKey });
        console.log('✅ OpenAI initialized');
      } catch (error) {
        console.error('❌ OpenAI initialization error:', error);
        this.openai = null;
      }
    } else {
      console.log('⚠️  OPENAI_API_KEY not found, OpenAI disabled');
      this.openai = null;
    }

    // System prompt for beauty/makeup context
    this.systemPrompt = `Bạn là một trợ lý AI chuyên về làm đẹp và chăm sóc da của SkinVox - một nền tảng làm đẹp với công nghệ AR tiên tiến.

Nhiệm vụ của bạn:
- Tư vấn về makeup, skincare, và sản phẩm làm đẹp
- Cung cấp hướng dẫn chi tiết về kỹ thuật trang điểm
- Gợi ý sản phẩm phù hợp với từng loại da và nhu cầu
- Hướng dẫn về quy trình chăm sóc da hàng ngày
- Trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp

SkinVox có các tính năng:
- AR Makeup: Thử trang điểm ảo trực tiếp trên khuôn mặt
- BeautyBar: Xem và tìm kiếm sản phẩm makeup
- Blog: Bài viết về làm đẹp và xu hướng

Hãy trả lời ngắn gọn, dễ hiểu và hữu ích. Nếu được hỏi về sản phẩm, hãy gợi ý người dùng xem tại BeautyBar hoặc thử qua AR Makeup.`;
  }

  /**
   * Get AI response using Gemini (priority)
   */
  async getGeminiResponse(message, conversationHistory = []) {
    if (!this.geminiAI) {
      throw new Error('Gemini AI not configured');
    }

    // Determine working model if not set yet
    if (!this.geminiModel || !this.workingModelName) {
      const modelsToTry = [
        'gemini-1.5-flash',  // Fast and free - recommended
        'gemini-1.5-pro',   // More capable
        'gemini-pro',       // Legacy but stable
        'gemini-1.0-pro'    // Alternative
      ];
      
      for (const modelName of modelsToTry) {
        try {
          const testModel = this.geminiAI.getGenerativeModel({ model: modelName });
          // Test with simple string (most compatible way)
          const testResult = await testModel.generateContent('Hi');
          
          // If we get here, model works
          this.geminiModel = testModel;
          this.workingModelName = modelName;
          console.log(`✅ Gemini model initialized: ${modelName}`);
          break;
        } catch (e) {
          console.log(`⚠️  Model ${modelName} not available: ${e.message.substring(0, 60)}...`);
          // Try next model
          continue;
        }
      }
      
      if (!this.geminiModel) {
        console.error('❌ No working Gemini model found. Available models may have changed or API key needs permissions.');
        throw new Error('No working Gemini model found. Please check API key permissions and enabled APIs in Google Cloud Console.');
      }
    }

    try {
      // Build conversation context
      const history = conversationHistory.slice(-6); // Last 6 messages for context
      let conversationContext = '';
      
      if (history.length > 0) {
        conversationContext = history.map(msg => {
          const role = msg.sender === 'user' ? 'User' : 'Assistant';
          return `${role}: ${msg.text}`;
        }).join('\n') + '\n';
      }

      // Build prompt with proper format for Gemini
      const prompt = `${this.systemPrompt}\n\n${conversationContext}User: ${message}\nAssistant:`;

      // Use simple string format (most compatible)
      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text.trim();
    } catch (error) {
      console.error('❌ Gemini API error:', error.message);
      // Reset model to try different one next time
      this.geminiModel = null;
      this.workingModelName = null;
      throw error;
    }
  }

  /**
   * Get AI response using OpenAI ChatGPT
   */
  async getOpenAIResponse(message, conversationHistory = []) {
    if (!this.openai) {
      throw new Error('OpenAI not configured');
    }

    try {
      // Build conversation messages
      const messages = [
        {
          role: 'system',
          content: this.systemPrompt
        }
      ];

      // Add conversation history
      const history = conversationHistory.slice(-6); // Last 6 messages
      history.forEach(msg => {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        });
      });

      // Add current message
      messages.push({
        role: 'user',
        content: message
      });

      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('❌ OpenAI API error:', error);
      throw error;
    }
  }

  /**
   * Get AI response (try Gemini first, then OpenAI, then fallback)
   */
  async getAIResponse(message, conversationHistory = []) {
    // Try Gemini first (free tier)
    if (this.geminiAI && this.geminiModel) {
      try {
        console.log('🤖 Using Gemini AI...');
        const response = await this.getGeminiResponse(message, conversationHistory);
        return { response, provider: 'gemini' };
      } catch (error) {
        console.error('❌ Gemini failed, trying OpenAI...', error.message);
      }
    }

    // Try OpenAI if Gemini fails
    if (this.openai) {
      try {
        console.log('🤖 Using OpenAI...');
        const response = await this.getOpenAIResponse(message, conversationHistory);
        return { response, provider: 'openai' };
      } catch (error) {
        console.error('❌ OpenAI failed:', error.message);
      }
    }

    // Return null if both fail (will use fallback)
    return null;
  }

  /**
   * Check if any AI service is available
   */
  isAvailable() {
    return !!(this.geminiAI || this.openai);
  }

  /**
   * Get available AI providers
   */
  getAvailableProviders() {
    const providers = [];
    if (this.geminiAI) providers.push('Gemini');
    if (this.openai) providers.push('OpenAI');
    return providers;
  }
}

// Export singleton instance
module.exports = new AIService();
