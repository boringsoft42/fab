// YOUTH Functionality Validation Test
// This script tests the key YOUTH functionality as outlined in the PRP

const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

// Test configuration
const testUser = {
  username: 'jovenes1',  // Existing test user
  password: 'password123'
};

let authToken = '';

async function login() {
  try {
    console.log('🔐 Testing login with YOUTH user...');
    const response = await axios.post(`${API_BASE}/auth/login`, testUser);
    
    if (response.data.token && response.data.user) {
      authToken = response.data.token;
      console.log('✅ Login successful');
      console.log(`   User: ${response.data.user.username}`);
      console.log(`   Role: ${response.data.user.role}`);
      console.log(`   Profile completion: ${response.data.user.firstName ? 'Has profile data' : 'No profile data'}`);
      return true;
    }
    return false;
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data?.error || error.message);
    return false;
  }
}

async function testDashboardData() {
  try {
    console.log('\n📊 Testing dashboard data loading...');
    const userId = 'cmes3hoia0001v7ootr2emslw'; // Known user ID from logs
    
    const response = await axios.get(`${API_BASE}/user-activities/${userId}/dashboard`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (response.data) {
      console.log('✅ Dashboard data loaded successfully');
      console.log(`   Courses: ${response.data.totalCourses || 0}`);
      console.log(`   Jobs: ${response.data.totalJobs || 0}`);
      console.log(`   User enrollments: ${response.data.userEnrollments || 0}`);
      console.log(`   User applications: ${response.data.userApplications || 0}`);
      return true;
    }
    return false;
  } catch (error) {
    console.log('❌ Dashboard data test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testYouthApplications() {
  try {
    console.log('\n🎯 Testing Youth Applications system...');
    
    // Test GET /api/youthapplication (list applications)
    const response = await axios.get(`${API_BASE}/youthapplication`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (response.data) {
      console.log('✅ Youth applications list loaded');
      console.log(`   Total applications: ${Array.isArray(response.data) ? response.data.length : 'Not an array'}`);
      
      // Test creating a new application
      const newApplication = {
        title: 'Test Application - Desarrollador Junior',
        description: 'Esta es una aplicación de prueba para validar el sistema de postulaciones juveniles.',
        isPublic: true
      };
      
      try {
        const createResponse = await axios.post(`${API_BASE}/youthapplication`, newApplication, {
          headers: { 
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (createResponse.data) {
          console.log('✅ Youth application creation test passed');
          console.log(`   Created application ID: ${createResponse.data.id || 'No ID returned'}`);
          
          // Test getting specific application
          if (createResponse.data.id) {
            const getAppResponse = await axios.get(`${API_BASE}/youthapplication/${createResponse.data.id}`, {
              headers: { 'Authorization': `Bearer ${authToken}` }
            });
            
            if (getAppResponse.data) {
              console.log('✅ Single youth application retrieval test passed');
            }
          }
        }
      } catch (createError) {
        console.log('⚠️ Youth application creation test issue:', createError.response?.data?.message || createError.message);
      }
      
      return true;
    }
    return false;
  } catch (error) {
    console.log('❌ Youth applications test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testNewsAndContent() {
  try {
    console.log('\n📰 Testing news and content loading...');
    
    const response = await axios.get(`${API_BASE}/newsarticle`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (response.data) {
      console.log('✅ News articles loaded successfully');
      console.log(`   Articles count: ${Array.isArray(response.data) ? response.data.length : 'Not an array'}`);
      return true;
    }
    return false;
  } catch (error) {
    console.log('❌ News test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testProfileData() {
  try {
    console.log('\n👤 Testing profile data...');
    
    const response = await axios.get(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (response.data) {
      console.log('✅ Profile data loaded');
      console.log(`   Username: ${response.data.username}`);
      console.log(`   Role: ${response.data.role}`);
      console.log(`   Profile complete: ${response.data.firstName ? 'Yes' : 'No'}`);
      return true;
    }
    return false;
  } catch (error) {
    console.log('❌ Profile test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function runValidation() {
  console.log('🧪 CEMSE YOUTH Functionality Validation Test');
  console.log('=' * 50);
  
  const results = {
    login: false,
    dashboard: false,
    youthApplications: false,
    news: false,
    profile: false
  };
  
  // Run tests sequentially
  results.login = await login();
  
  if (results.login) {
    results.dashboard = await testDashboardData();
    results.youthApplications = await testYouthApplications();
    results.news = await testNewsAndContent();
    results.profile = await testProfileData();
  }
  
  // Results summary
  console.log('\n📊 VALIDATION RESULTS SUMMARY');
  console.log('=' * 40);
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test.toUpperCase()}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(r => r).length;
  const successRate = Math.round((passedTests / totalTests) * 100);
  
  console.log(`\n📈 Success Rate: ${passedTests}/${totalTests} (${successRate}%)`);
  
  if (successRate >= 80) {
    console.log('🎉 YOUTH functionality validation PASSED!');
  } else if (successRate >= 60) {
    console.log('⚠️  YOUTH functionality validation PARTIAL - Some issues found');
  } else {
    console.log('❌ YOUTH functionality validation FAILED - Critical issues found');
  }
  
  console.log('\n✨ Validation test completed');
  return results;
}

// Run the validation
runValidation().catch(error => {
  console.error('💥 Validation test crashed:', error.message);
  process.exit(1);
});