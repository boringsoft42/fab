import { apiCall, getAuthHeaders } from '@/lib/api';

export interface JobQuestionAnswer {
  id: string;
  applicationId: string;
  questionId: string;
  answer: string;
  createdAt: string;
}

export interface CreateJobQuestionAnswerRequest {
  applicationId: string;
  questionId: string;
  answer: string;
}

export interface JobQuestionAnswerResponse {
  id: string;
  question: string;
  answer: string;
}

export class JobQuestionAnswerService {
  /**
   * Submit answers to job questions (Youth/Students only)
   */
  static async submitAnswers(answers: CreateJobQuestionAnswerRequest[]): Promise<JobQuestionAnswer[]> {
    try {
      console.log('👥 JobQuestionAnswerService.submitAnswers - Submitting answers:', answers);
      
      const response = await apiCall('/jobquestionanswer', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(answers)
      });

      console.log('✅ JobQuestionAnswerService.submitAnswers - Answers submitted:', response);
      return response;
    } catch (error) {
      console.error('❌ JobQuestionAnswerService.submitAnswers - Error:', error);
      throw error;
    }
  }

  /**
   * Get all question answers (Companies only)
   */
  static async getAllAnswers(): Promise<JobQuestionAnswerResponse[]> {
    try {
      console.log('🏢 JobQuestionAnswerService.getAllAnswers - Fetching all answers');
      
      const response = await apiCall('/jobquestionanswer', {
        method: 'GET',
        headers: getAuthHeaders()
      });

      console.log('✅ JobQuestionAnswerService.getAllAnswers - Answers fetched:', response);
      return response;
    } catch (error) {
      console.error('❌ JobQuestionAnswerService.getAllAnswers - Error:', error);
      throw error;
    }
  }

  /**
   * Get user's question answers (Youth/Students only)
   */
  static async getUserAnswers(): Promise<JobQuestionAnswerResponse[]> {
    try {
      console.log('👥 JobQuestionAnswerService.getUserAnswers - Fetching user answers');
      
      const response = await apiCall('/jobquestionanswer', {
        method: 'GET',
        headers: getAuthHeaders()
      });

      console.log('✅ JobQuestionAnswerService.getUserAnswers - User answers fetched:', response);
      return response;
    } catch (error) {
      console.error('❌ JobQuestionAnswerService.getUserAnswers - Error:', error);
      throw error;
    }
  }

  /**
   * Get specific answer by ID
   */
  static async getAnswer(id: string): Promise<JobQuestionAnswerResponse> {
    try {
      console.log('🔍 JobQuestionAnswerService.getAnswer - Fetching answer:', id);
      
      const response = await apiCall(`/jobquestionanswer/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      console.log('✅ JobQuestionAnswerService.getAnswer - Answer fetched:', response);
      return response;
    } catch (error) {
      console.error('❌ JobQuestionAnswerService.getAnswer - Error:', error);
      throw error;
    }
  }
}
