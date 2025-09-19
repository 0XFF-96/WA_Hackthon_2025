# API 接口文档

## 🌐 API 概览

HealthAI 平台提供完整的 RESTful API 接口，支持医疗诊断、病例管理、AI 分析、系统监控等功能。

### 基础信息
- **Base URL**: `http://localhost:3000/api`
- **认证方式**: Session-based Authentication
- **数据格式**: JSON
- **字符编码**: UTF-8

### 通用响应格式
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}
```

## 🔐 认证接口

### 用户登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "doctor@example.com",
  "password": "password123"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "username": "doctor@example.com",
      "role": "doctor"
    },
    "sessionId": "session_456"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 用户登出
```http
POST /api/auth/logout
```

### 获取当前用户
```http
GET /api/auth/me
```

## 🤖 AI 分析接口

### 多智能体分析
```http
POST /api/ai/analyze
Content-Type: application/json

{
  "query": "患者主诉右腿疼痛，活动受限，怀疑微骨折",
  "patientContext": {
    "name": "张三",
    "age": 45,
    "symptoms": "右腿疼痛，活动受限",
    "medicalHistory": "无重大疾病史"
  },
  "caseId": "case_123"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "analysisId": "analysis_789",
    "agents": [
      {
        "agentType": "orchestrator",
        "agentName": "HealthAI Orchestrator",
        "content": "正在协调专业团队进行综合分析...",
        "confidence": 95,
        "reasoning": "协调多智能体分析流程"
      },
      {
        "agentType": "diagnostician",
        "agentName": "Dr. Neural",
        "content": "基于症状分析，建议考虑应力性骨折...",
        "confidence": 92,
        "reasoning": "症状模式匹配分析"
      }
    ],
    "overallConfidence": 93,
    "processingTime": 2.3,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### 医学影像分析
```http
POST /api/ai/analyze-image
Content-Type: multipart/form-data

{
  "image": <file>,
  "caseId": "case_123",
  "imageType": "x-ray",
  "bodyPart": "leg"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "analysisId": "img_analysis_456",
    "findings": [
      {
        "type": "micro-fracture",
        "location": "right tibia",
        "confidence": 87,
        "description": "疑似应力性骨折，建议进一步检查"
      }
    ],
    "recommendations": [
      "建议 MRI 检查确认",
      "限制负重活动",
      "疼痛管理"
    ],
    "processingTime": 3.2
  }
}
```

## 👥 患者管理接口

### 获取患者列表
```http
GET /api/patients?page=1&limit=20&search=张三
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": "patient_123",
        "name": "张三",
        "age": 45,
        "gender": "male",
        "medicalId": "MED001",
        "phoneNumber": "13800138000",
        "email": "zhangsan@example.com",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8
    }
  }
}
```

### 创建患者
```http
POST /api/patients
Content-Type: application/json

{
  "name": "李四",
  "age": 35,
  "gender": "female",
  "medicalId": "MED002",
  "dateOfBirth": "1989-05-15",
  "phoneNumber": "13900139000",
  "email": "lisi@example.com",
  "address": "北京市朝阳区",
  "medicalHistory": "无重大疾病史",
  "allergies": "青霉素过敏"
}
```

### 获取患者详情
```http
GET /api/patients/{patientId}
```

### 更新患者信息
```http
PUT /api/patients/{patientId}
Content-Type: application/json

{
  "name": "李四",
  "phoneNumber": "13900139001",
  "medicalHistory": "高血压病史"
}
```

## 📋 病例管理接口

### 获取病例列表
```http
GET /api/cases?status=pending&priority=high&page=1&limit=20
```

**查询参数**:
- `status`: 病例状态 (pending, analyzing, diagnosed, treated, discharged)
- `priority`: 优先级 (low, medium, high, critical)
- `patientId`: 患者ID
- `assignedPhysician`: 分配医生
- `page`: 页码
- `limit`: 每页数量

### 创建病例
```http
POST /api/cases
Content-Type: application/json

{
  "patientId": "patient_123",
  "title": "右腿疼痛疑似微骨折",
  "description": "患者主诉右腿疼痛，活动受限，怀疑应力性骨折",
  "priority": "medium",
  "assignedPhysician": "Dr. Wang",
  "department": "骨科"
}
```

### 获取病例详情
```http
GET /api/cases/{caseId}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "case_123",
    "caseNumber": "CASE-2024-001",
    "patient": {
      "id": "patient_123",
      "name": "张三",
      "age": 45,
      "gender": "male"
    },
    "title": "右腿疼痛疑似微骨折",
    "description": "患者主诉右腿疼痛，活动受限",
    "status": "analyzing",
    "priority": "medium",
    "riskScore": 65,
    "aiAnalysis": {
      "confidence": 87,
      "diagnosis": "疑似应力性骨折",
      "recommendations": ["MRI检查", "限制活动"]
    },
    "assignedPhysician": "Dr. Wang",
    "department": "骨科",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

### 更新病例状态
```http
PUT /api/cases/{caseId}/status
Content-Type: application/json

{
  "status": "diagnosed",
  "diagnosis": "应力性骨折",
  "treatmentPlan": "保守治疗，限制负重"
}
```

## 📊 生命体征接口

### 记录生命体征
```http
POST /api/vitals
Content-Type: application/json

{
  "caseId": "case_123",
  "temperature": 98.6,
  "bloodPressureSystolic": 120,
  "bloodPressureDiastolic": 80,
  "heartRate": 72,
  "respiratoryRate": 16,
  "oxygenSaturation": 98,
  "painScale": 6,
  "symptoms": [
    {
      "name": "右腿疼痛",
      "severity": "moderate",
      "duration": "3天"
    }
  ],
  "notes": "患者疼痛明显，活动受限",
  "recordedBy": "Dr. Wang"
}
```

### 获取病例生命体征
```http
GET /api/vitals/{caseId}?startDate=2024-01-01&endDate=2024-01-31
```

## 🖼️ 医学影像接口

### 上传医学影像
```http
POST /api/imaging
Content-Type: multipart/form-data

{
  "caseId": "case_123",
  "type": "x-ray",
  "bodyPart": "leg",
  "image": <file>,
  "technician": "Tech. Li",
  "equipment": "Siemens X-ray Machine"
}
```

### 获取病例影像
```http
GET /api/imaging/{caseId}
```

### 更新影像分析
```http
PUT /api/imaging/{imageId}
Content-Type: application/json

{
  "findings": "疑似应力性骨折",
  "impression": "建议MRI进一步检查",
  "radiologistNotes": "骨皮质连续性中断，符合应力性骨折表现"
}
```

## 📝 临床记录接口

### 创建临床记录
```http
POST /api/notes
Content-Type: application/json

{
  "caseId": "case_123",
  "type": "soap",
  "content": {
    "subjective": "患者主诉右腿疼痛",
    "objective": "右腿肿胀，压痛明显",
    "assessment": "疑似应力性骨折",
    "plan": "MRI检查，疼痛管理"
  },
  "author": "Dr. Wang",
  "isPrivate": false
}
```

### 获取病例记录
```http
GET /api/notes/{caseId}?type=soap&page=1&limit=10
```

## 🎯 AI 智能体接口

### 获取智能体状态
```http
GET /api/agents
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "agents": [
      {
        "id": "orchestrator",
        "name": "HealthAI Orchestrator",
        "type": "orchestrator",
        "status": "idle",
        "performance": {
          "totalTasks": 156,
          "successRate": 98.5,
          "averageResponseTime": 1.2,
          "confidence": 95,
          "rubricScore": 92.3,
          "improvementTrend": "improving"
        },
        "health": {
          "cpu": 15,
          "memory": 45,
          "uptime": 99.8
        }
      }
    ]
  }
}
```

### 获取智能体性能
```http
GET /api/agents/{agentId}/performance?timeRange=30d
```

## 📈 分析接口

### 获取系统分析
```http
GET /api/analytics/system-performance?timeRange=30d
```

### 获取诊断分析
```http
GET /api/analytics/diagnostic-accuracy?timeRange=30d&groupBy=diseaseType
```

### 获取业务分析
```http
GET /api/analytics/business-intelligence?timeRange=30d
```

## 🔍 搜索接口

### 全局搜索
```http
GET /api/search?q=微骨折&type=all&page=1&limit=20
```

**查询参数**:
- `q`: 搜索关键词
- `type`: 搜索类型 (all, patients, cases, notes, imaging)
- `page`: 页码
- `limit`: 每页数量

## 📊 统计接口

### 获取仪表板数据
```http
GET /api/dashboard/stats
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "totalPatients": 1256,
    "activeCases": 89,
    "pendingCases": 23,
    "aiAccuracy": 96.5,
    "averageResponseTime": 2.3,
    "systemUptime": 99.9,
    "recentActivity": [
      {
        "type": "case_created",
        "description": "新病例创建",
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

## ⚠️ 错误处理

### 错误代码
| 错误代码 | HTTP状态码 | 描述 |
|---------|-----------|------|
| `INVALID_REQUEST` | 400 | 请求参数无效 |
| `UNAUTHORIZED` | 401 | 未授权访问 |
| `FORBIDDEN` | 403 | 权限不足 |
| `NOT_FOUND` | 404 | 资源不存在 |
| `VALIDATION_ERROR` | 422 | 数据验证失败 |
| `INTERNAL_ERROR` | 500 | 服务器内部错误 |
| `SERVICE_UNAVAILABLE` | 503 | 服务不可用 |

### 错误响应示例
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求数据验证失败",
    "details": {
      "field": "email",
      "message": "邮箱格式不正确"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🔒 安全考虑

### 认证和授权
- 所有 API 接口都需要有效的会话认证
- 基于角色的访问控制 (RBAC)
- API 请求频率限制
- 敏感数据加密传输

### 数据保护
- 患者数据脱敏处理
- 审计日志记录
- 数据备份和恢复
- HIPAA 合规性

## 📚 使用示例

### JavaScript/TypeScript 示例
```typescript
// 创建患者
const createPatient = async (patientData: PatientData) => {
  const response = await fetch('/api/patients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patientData),
  });
  
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error.message);
  }
  
  return result.data;
};

// AI 分析
const analyzeCase = async (query: string, patientContext: PatientContext) => {
  const response = await fetch('/api/ai/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, patientContext }),
  });
  
  return await response.json();
};
```

### Python 示例
```python
import requests

# 获取病例列表
def get_cases(status=None, priority=None):
    params = {}
    if status:
        params['status'] = status
    if priority:
        params['priority'] = priority
    
    response = requests.get('/api/cases', params=params)
    return response.json()

# 记录生命体征
def record_vitals(case_id, vitals_data):
    response = requests.post('/api/vitals', json={
        'caseId': case_id,
        **vitals_data
    })
    return response.json()
```

---

**HealthAI API** - 为医疗 AI 应用提供强大的后端支持 🏥🤖
