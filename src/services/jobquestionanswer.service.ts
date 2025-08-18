import { apiCall } from '@/lib/api';
import { JobQuestionAnswer } from '@/types/jobs';

// Extendemos el tipo para incluir id que probablemente necesite el backend
interface JobQuestionAnswerWithId extends JobQuestionAnswer {
  id: string;
  applicationId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class JobQuestionAnswerService {
  static async getAll(): Promise<JobQuestionAnswerWithId[]> {
    return await apiCall('/jobquestionanswer');
  }

  static async getById(id: string): Promise<JobQuestionAnswerWithId> {
    return await apiCall(`/jobquestionanswer/${id}`);
  }

  static async create(data: Partial<JobQuestionAnswerWithId>): Promise<JobQuestionAnswerWithId> {
    return await apiCall('/jobquestionanswer', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async update(id: string, data: Partial<JobQuestionAnswerWithId>): Promise<JobQuestionAnswerWithId> {
    return await apiCall(`/jobquestionanswer/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(id: string): Promise<void> {
    await apiCall(`/jobquestionanswer/${id}`, { method: 'DELETE' });
  }

  // Métodos específicos para job question answers
  static async getByApplication(applicationId: string): Promise<JobQuestionAnswerWithId[]> {
    return await apiCall(`/jobquestionanswer?applicationId=${applicationId}`);
  }

  static async getByQuestion(questionId: string): Promise<JobQuestionAnswerWithId[]> {
    return await apiCall(`/jobquestionanswer?questionId=${questionId}`);
  }

  static async getByJobOffer(jobOfferId: string): Promise<JobQuestionAnswerWithId[]> {
    return await apiCall(`/jobquestionanswer?jobOfferId=${jobOfferId}`);
  }

  static async createMultiple(answers: Partial<JobQuestionAnswerWithId>[]): Promise<JobQuestionAnswerWithId[]> {
    return await apiCall('/jobquestionanswer/bulk', {
      method: 'POST',
      body: JSON.stringify(answers)
    });
  }

  static async getAnswersForApplication(applicationId: string): Promise<JobQuestionAnswerWithId[]> {
    return await apiCall(`/jobquestionanswer/application/${applicationId}`);
  }

  static async updateAnswer(id: string, answer: string): Promise<JobQuestionAnswerWithId> {
    return await apiCall(`/jobquestionanswer/${id}/answer`, {
      method: 'PUT',
      body: JSON.stringify({ answer })
    });
  }
} 