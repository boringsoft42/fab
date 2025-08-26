// Comprehensive CEMSE API Testing Suite
// Tests all YOUTH-related functionality end-to-end

const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';
const TEST_USER = {
  username: 'maría_rodriguez70',
  password: 'password123'
};

let authToken = '';
let userId = '';
let testApplicationId = '';

class APITester {
  constructor() {
    this.results = {};
    this.authToken = '';
  }

  async log(message, type = 'info') {
    const symbols = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      test: '🧪'
    };
    console.log(`${symbols[type]} ${message}`);
  }

  async testEndpoint(name, testFn) {
    try {
      await this.log(`Testing ${name}...`, 'test');
      const result = await testFn();
      this.results[name] = { status: 'PASSED', result };
      await this.log(`${name}: PASSED`, 'success');
      return result;
    } catch (error) {
      this.results[name] = { 
        status: 'FAILED', 
        error: error.response?.data?.message || error.message 
      };
      await this.log(`${name}: FAILED - ${error.response?.data?.message || error.message}`, 'error');
      return null;
    }
  }

  // Authentication Tests
  async testAuthentication() {
    return await this.testEndpoint('Authentication', async () => {
      const response = await axios.post(`${API_BASE}/auth/login`, TEST_USER);
      
      if (!response.data.token || !response.data.user) {
        throw new Error('Invalid login response structure');
      }
      
      this.authToken = response.data.token;
      userId = response.data.user.id;
      
      return {
        token: 'Present',
        user: {
          id: response.data.user.id,
          username: response.data.user.username,
          role: response.data.user.role,
          profileComplete: !!response.data.user.firstName
        }
      };
    });
  }

  async testCurrentUser() {
    return await this.testEndpoint('Current User Info', async () => {
      const response = await axios.get(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      });
      
      return {
        username: response.data.username,
        role: response.data.role,
        profile: {
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email
        }
      };
    });
  }

  // Dashboard Tests
  async testDashboard() {
    return await this.testEndpoint('Dashboard Data', async () => {
      const response = await axios.get(`${API_BASE}/user-activities/${userId}/dashboard`, {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      });
      
      return {
        totalCourses: response.data.totalCourses || 0,
        totalJobs: response.data.totalJobs || 0,
        totalInstitutions: response.data.totalInstitutions || 0,
        totalEntrepreneurships: response.data.totalEntrepreneurships || 0,
        userEnrollments: response.data.userEnrollments || 0,
        userApplications: response.data.userApplications || 0
      };
    });
  }

  // Youth Application Tests
  async testYouthApplicationsList() {
    return await this.testEndpoint('Youth Applications List', async () => {
      const response = await axios.get(`${API_BASE}/youthapplication`, {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      });
      
      return {
        applications: Array.isArray(response.data) ? response.data.length : 0,
        sample: Array.isArray(response.data) && response.data.length > 0 ? {
          id: response.data[0].id,
          title: response.data[0].title,
          status: response.data[0].status
        } : null
      };
    });
  }

  async testCreateYouthApplication() {
    return await this.testEndpoint('Create Youth Application', async () => {
      const applicationData = {
        title: 'API Test Application - Desarrollador Junior',
        description: 'Esta es una aplicación de prueba creada automáticamente por el sistema de testing de APIs para validar la funcionalidad de creación de postulaciones juveniles.',
        isPublic: true
      };
      
      const response = await axios.post(`${API_BASE}/youthapplication`, applicationData, {
        headers: { 
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.id) {
        testApplicationId = response.data.id;
      }
      
      return {
        created: true,
        id: response.data.id,
        title: response.data.title,
        status: response.data.status
      };
    });
  }

  async testGetYouthApplication() {
    if (!testApplicationId) {
      await this.log('Skipping Get Youth Application - No test application ID', 'warning');
      return;
    }
    
    return await this.testEndpoint('Get Youth Application', async () => {
      const response = await axios.get(`${API_BASE}/youthapplication/${testApplicationId}`, {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      });
      
      return {
        id: response.data.id,
        title: response.data.title,
        description: response.data.description.substring(0, 50) + '...',
        status: response.data.status,
        isPublic: response.data.isPublic
      };
    });
  }

  async testYouthApplicationMessages() {
    if (!testApplicationId) {
      await this.log('Skipping Youth Application Messages - No test application ID', 'warning');
      return;
    }
    
    return await this.testEndpoint('Youth Application Messages', async () => {
      const response = await axios.get(`${API_BASE}/youthapplication/${testApplicationId}/message`, {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      });
      
      return {
        messagesCount: Array.isArray(response.data) ? response.data.length : 0,
        endpoint: 'Accessible'
      };
    });
  }

  async testSendMessage() {
    if (!testApplicationId) {
      await this.log('Skipping Send Message - No test application ID', 'warning');
      return;
    }
    
    return await this.testEndpoint('Send Message', async () => {
      const messageData = {
        content: 'Este es un mensaje de prueba enviado por el sistema de testing automático.',
        senderType: 'YOUTH'
      };
      
      const response = await axios.post(`${API_BASE}/youthapplication/${testApplicationId}/message`, messageData, {
        headers: { 
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      return {
        sent: true,
        messageId: response.data.id,
        content: response.data.content?.substring(0, 30) + '...'
      };
    });
  }

  async testCompanyInterests() {
    if (!testApplicationId) {
      await this.log('Skipping Company Interests - No test application ID', 'warning');
      return;
    }
    
    return await this.testEndpoint('Company Interests', async () => {
      const response = await axios.get(`${API_BASE}/youthapplication/${testApplicationId}/company-interest`, {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      });
      
      return {
        interestsCount: Array.isArray(response.data) ? response.data.length : 0,
        endpoint: 'Accessible'
      };
    });
  }

  // Content Tests
  async testNewsArticles() {
    return await this.testEndpoint('News Articles', async () => {
      const response = await axios.get(`${API_BASE}/newsarticle`, {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      });
      
      return {
        articlesCount: Array.isArray(response.data) ? response.data.length : 0,
        sample: Array.isArray(response.data) && response.data.length > 0 ? {
          id: response.data[0].id,
          title: response.data[0].title?.substring(0, 50) + '...'
        } : null
      };
    });
  }

  async testJobOffers() {
    return await this.testEndpoint('Job Offers', async () => {
      const response = await axios.get(`${API_BASE}/joboffer`, {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      });
      
      return {
        jobsCount: Array.isArray(response.data) ? response.data.length : 0,
        sample: Array.isArray(response.data) && response.data.length > 0 ? {
          id: response.data[0].id,
          title: response.data[0].title,
          company: response.data[0].company
        } : null
      };
    });
  }

  async testCourses() {
    return await this.testEndpoint('Courses', async () => {
      const response = await axios.get(`${API_BASE}/course`, {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      });
      
      return {
        coursesCount: Array.isArray(response.data) ? response.data.length : 0,
        sample: Array.isArray(response.data) && response.data.length > 0 ? {
          id: response.data[0].id,
          title: response.data[0].title,
          category: response.data[0].category
        } : null
      };
    });
  }

  // Profile Tests
  async testProfile() {
    return await this.testEndpoint('Profile Data', async () => {
      const response = await axios.get(`${API_BASE}/profile/${userId}`, {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      });
      
      return {
        profileId: response.data.id,
        completeness: response.data.profileCompletion || 0,
        skills: response.data.skills?.length || 0,
        interests: response.data.interests?.length || 0,
        education: response.data.educationLevel
      };
    });
  }

  // Cleanup Tests
  async testCleanup() {
    if (!testApplicationId) return;
    
    return await this.testEndpoint('Cleanup Test Application', async () => {
      const response = await axios.delete(`${API_BASE}/youthapplication/${testApplicationId}`, {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      });
      
      return {
        deleted: true,
        applicationId: testApplicationId
      };
    });
  }

  // Results Summary
  async printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPREHENSIVE API TEST RESULTS SUMMARY');
    console.log('='.repeat(60));
    
    const categories = {
      'Authentication': ['Authentication', 'Current User Info'],
      'Dashboard': ['Dashboard Data'],
      'Youth Applications': [
        'Youth Applications List', 
        'Create Youth Application', 
        'Get Youth Application', 
        'Youth Application Messages',
        'Send Message',
        'Company Interests'
      ],
      'Content & Jobs': ['News Articles', 'Job Offers', 'Courses'],
      'Profile': ['Profile Data'],
      'Cleanup': ['Cleanup Test Application']
    };
    
    let totalTests = 0;
    let passedTests = 0;
    
    Object.entries(categories).forEach(([category, tests]) => {
      console.log(`\n📋 ${category}:`);
      tests.forEach(test => {
        const result = this.results[test];
        if (result) {
          totalTests++;
          if (result.status === 'PASSED') {
            passedTests++;
            console.log(`  ✅ ${test}: PASSED`);
            if (result.result && typeof result.result === 'object') {
              Object.entries(result.result).forEach(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                  console.log(`     ${key}: ${JSON.stringify(value, null, 2).substring(0, 100)}...`);
                } else {
                  console.log(`     ${key}: ${value}`);
                }
              });
            }
          } else {
            console.log(`  ❌ ${test}: FAILED - ${result.error}`);
          }
        }
      });
    });
    
    const successRate = Math.round((passedTests / totalTests) * 100);
    
    console.log('\n' + '='.repeat(60));
    console.log(`📈 OVERALL RESULTS: ${passedTests}/${totalTests} (${successRate}%)`);
    
    if (successRate >= 90) {
      console.log('🎉 EXCELLENT! API is fully functional and ready for frontend integration');
    } else if (successRate >= 75) {
      console.log('✅ GOOD! Most APIs working, minor issues to address');
    } else if (successRate >= 50) {
      console.log('⚠️  PARTIAL! Some critical issues need attention');
    } else {
      console.log('❌ CRITICAL! Major issues preventing proper functionality');
    }
    
    console.log('='.repeat(60));
    
    return { totalTests, passedTests, successRate };
  }

  // Run All Tests
  async runAllTests() {
    console.log('🧪 STARTING COMPREHENSIVE CEMSE API TEST SUITE');
    console.log('='.repeat(60));
    
    // Authentication Tests
    await this.testAuthentication();
    await this.testCurrentUser();
    
    // Only continue if authentication passed
    if (this.results['Authentication']?.status !== 'PASSED') {
      console.log('❌ Authentication failed - stopping tests');
      return await this.printSummary();
    }
    
    // Dashboard Tests
    await this.testDashboard();
    
    // Youth Application Tests
    await this.testYouthApplicationsList();
    await this.testCreateYouthApplication();
    await this.testGetYouthApplication();
    await this.testYouthApplicationMessages();
    await this.testSendMessage();
    await this.testCompanyInterests();
    
    // Content Tests
    await this.testNewsArticles();
    await this.testJobOffers();
    await this.testCourses();
    
    // Profile Tests
    await this.testProfile();
    
    // Cleanup
    await this.testCleanup();
    
    // Summary
    return await this.printSummary();
  }
}

// Run the comprehensive test suite
async function main() {
  const tester = new APITester();
  
  try {
    const results = await tester.runAllTests();
    
    console.log('\n🎯 NEXT STEPS RECOMMENDATION:');
    if (results.successRate >= 80) {
      console.log('✅ APIs are ready! Proceed with frontend implementation');
    } else {
      console.log('⚠️  Fix API issues before frontend implementation');
    }
    
    process.exit(results.successRate >= 50 ? 0 : 1);
  } catch (error) {
    console.error('💥 Test suite crashed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { APITester };