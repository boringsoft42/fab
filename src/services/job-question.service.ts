import { apiCall, getAuthHeaders } from '@/lib/api';

export interface JobQuestion {
  id: string;
  jobOfferId: string;
  question: string;
  type: 'text' | 'multiple_choice' | 'boolean';
  required: boolean;
  options: string[];
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobQuestionRequest {
  jobOfferId: string;
  question: string;
  type: 'text' | 'multiple_choice' | 'boolean';
  required: boolean;
  options: string[];
  orderIndex: number;
}

export interface UpdateJobQuestionRequest {
  question?: string;
  type?: 'text' | 'multiple_choice' | 'boolean';
  required?: boolean;
  options?: string[];
  orderIndex?: number;
}

export class JobQuestionService {
  /**
   * Create questions for a job offer (Companies only)
   */
  static async createJobQuestions(questions: CreateJobQuestionRequest[]): Promise<JobQuestion[]> {
    try {
      console.log('🏢 JobQuestionService.createJobQuestions - Creating questions:', questions);
      
      const response = await apiCall('/jobquestion', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(questions)
      });

      console.log('✅ JobQuestionService.createJobQuestions - Questions created:', response);
      return response;
    } catch (error) {
      console.error('❌ JobQuestionService.createJobQuestions - Error:', error);
      throw error;
    }
  }

  /**
   * Get questions for a job offer
   */
  static async getJobQuestions(jobOfferId?: string): Promise<JobQuestion[]> {
    try {
      console.log('🔍 JobQuestionService.getJobQuestions - Fetching questions for job offer:', jobOfferId);
      
      const url = jobOfferId ? `/jobquestion?jobOfferId=${jobOfferId}` : '/jobquestion';
      const response = await apiCall(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      console.log('✅ JobQuestionService.getJobQuestions - Questions fetched:', response);
      return response;
    } catch (error) {
      console.error('❌ JobQuestionService.getJobQuestions - Error:', error);
      throw error;
    }
  }

  /**
   * Update a specific question (Companies only)
   */
  static async updateJobQuestion(id: string, data: UpdateJobQuestionRequest): Promise<JobQuestion> {
    try {
      console.log('🏢 JobQuestionService.updateJobQuestion - Updating question:', id, data);
      
      const response = await apiCall(`/jobquestion/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });

      console.log('✅ JobQuestionService.updateJobQuestion - Question updated:', response);
      return response;
    } catch (error) {
      console.error('❌ JobQuestionService.updateJobQuestion - Error:', error);
      throw error;
    }
  }

  /**
   * Delete a question (Companies only)
   */
  static async deleteJobQuestion(id: string): Promise<void> {
    try {
      console.log('🏢 JobQuestionService.deleteJobQuestion - Deleting question:', id);
      
      await apiCall(`/jobquestion/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      console.log('✅ JobQuestionService.deleteJobQuestion - Question deleted');
    } catch (error) {
      console.error('❌ JobQuestionService.deleteJobQuestion - Error:', error);
      throw error;
    }
  }
}
