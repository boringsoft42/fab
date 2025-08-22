# CONTEXT-ENGINEERED PRODUCT REQUIREMENT PROMPT

# [FEATURE_NAME]

## SYSTEM CONTEXT LAYER

### Role Definition

You are a [SPECIFIC_ROLE] with [X]+ years of experience in [DOMAIN]. Your expertise includes:

- [Specific skill 1]
- [Specific skill 2]
- [Specific skill 3]

### Technical Environment

- **Framework**: [Specific framework and version]
- **Language**: [Language and version]
- **Database**: [Database type and version]
- **Architecture**: [Specific architectural pattern]
- **Deploy**: [Deployment environment]

### Domain Context

[Specific business domain context that affects implementation decisions]

## BUSINESS CONTEXT LAYER

### Goal

[One clear, measurable objective]

### Why This Matters

[Business justification with specific metrics or outcomes]

### Success Criteria

- [ ] [Measurable criterion 1]
- [ ] [Measurable criterion 2]
- [ ] [Measurable criterion 3]

## TECHNICAL CONTEXT LAYER

### All Needed Context

#### Documentation & References

- **url**: [Specific documentation URL]
  **why**: [Specific reason for this reference]
  **section**: [Specific section to focus on]

- **file**: [Specific file path in codebase]
  **why**: [Pattern or example to follow]
  **lines**: [Specific line numbers if relevant]

#### Known Gotchas & Critical Constraints

```typescript
// CRITICAL: [Specific constraint that will break implementation]
// CRITICAL: [Another critical constraint]
// WARNING: [Important gotcha to watch for]
// INFO: [Helpful tip for implementation]
Existing Patterns to Follow
typescript// From: [file_path:line_range]
// Pattern: [Description of pattern]
// Use this approach for: [When to use this pattern]

[Actual code example from codebase]
Dependencies & Versions
json{
  "[package_name]": "[specific_version]",
  "[another_package]": "[specific_version]"
}
IMPLEMENTATION BLUEPRINT
High-Level Approach
typescript// Implementation strategy overview
function [featureName]() {
  // 1. [Specific step with technical details]
  // 2. [Another specific step]
  // 3. [Final step with validation]
}
File Structure Required
src/
├── [specific_directory]/
│   ├── [specific_file_1].ts
│   ├── [specific_file_2].ts
│   └── __tests__/
│       └── [test_file].test.ts
├── types/
│   └── [interface_file].ts
└── utils/
    └── [utility_file].ts
Task Breakdown (Execute in Order)

[Task Name 1]:

Description: [Specific implementation detail]
Acceptance: [How to verify completion]
Files: [Files to create/modify]


[Task Name 2]:

Description: [Specific implementation detail]
Acceptance: [How to verify completion]
Dependencies: [What must be done first]


[Task Name 3]:

Description: [Specific implementation detail]
Acceptance: [How to verify completion]
Validation: [How to test this works]



Data Models & Interfaces
typescript// Required interfaces/types
interface [InterfaceName] {
  [property]: [type]; // [Purpose of this property]
}

type [TypeName] = {
  [property]: [type]; // [Validation rule or constraint]
}
VALIDATION FRAMEWORK
Level 1: Syntax & Style
bash# Language-specific linting and formatting
[specific_lint_command]
[specific_format_command]
Level 2: Unit Testing
bash# Execute unit test suite
[specific_test_command]
# Expected: All tests pass, coverage > [X]%
Level 3: Integration Testing
bash# Integration validation commands
[specific_integration_test_command]
# Expected: [Specific integration outcomes]
Level 4: Business Logic Validation
Manual verification checklist:

 [Business rule 1] works correctly
 [Business rule 2] handles edge cases
 [Error scenario 1] handled gracefully
 [Performance requirement] met

Level 5: Production Readiness
bash# Security, performance, monitoring checks
[security_scan_command]
[performance_test_command]
[monitoring_setup_verification]
ERROR HANDLING STRATEGY
Expected Error Cases

[Error Type 1]:

Trigger: [What causes this error]
Response: [How system should respond]
User Experience: [What user sees/does]
Recovery: [How to recover automatically]


[Error Type 2]:

Trigger: [What causes this error]
Response: [How system should respond]
Logging: [What to log for debugging]
Fallback: [Alternative approach]



Fallback Strategies

Plan A: [Primary implementation approach]
Plan B: [Secondary approach if A fails]
Plan C: [Minimal viable approach if B fails]

PERFORMANCE CONSIDERATIONS
Performance Requirements

Response Time: [Specific requirement, e.g., < 200ms]
Throughput: [Specific requirement, e.g., 1000 req/sec]
Memory Usage: [Specific constraint, e.g., < 100MB]

Optimization Strategy

Caching: [What to cache and for how long]
Database: [Query optimization strategies]
Frontend: [Loading and rendering optimizations]

SECURITY CONSIDERATIONS
Security Requirements

Authentication: [Specific auth requirements]
Authorization: [Role/permission requirements]
Data Protection: [Encryption/sanitization needs]
Input Validation: [Specific validation rules]

MONITORING & OBSERVABILITY
Metrics to Track

Business Metrics: [KPIs specific to this feature]
Technical Metrics: [Performance indicators]
Error Metrics: [Error rates and types]

Logging Strategy
typescript// Logging approach
logger.info('[FEATURE_NAME] operation started', {
  userId, requestId, timestamp
});
COMPLETION CHECKLIST
Implementation Complete

 All tasks from blueprint completed
 All validation levels pass
 Error handling implemented and tested
 Performance requirements met
 Security requirements satisfied

Documentation Updated

 API documentation updated
 Code comments added
 README updated if needed
 Deployment notes updated

Testing Complete

 Unit tests written and passing
 Integration tests passing
 Manual testing completed
 Edge cases tested
 Error scenarios tested

QUALITY ASSESSMENT
Implementation Confidence Score
Score: [X/10] - [Justification for score]
One-Pass Success Probability
Probability: [X]% - [Factors affecting success rate]
Risk Assessment
High Risk: [List high-risk aspects]
Medium Risk: [List medium-risk aspects]
Low Risk: [List low-risk aspects]

META-INFORMATION
Created: [TIMESTAMP]
Creator: prp-architect
Project: [PROJECT_NAME]
Version: 1.0
Status: active
```
