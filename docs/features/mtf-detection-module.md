# MTF检测与患者外联模块

## 📋 模块概述

MTF（微创骨折）检测与患者外联模块是一个完整的智能医疗解决方案，旨在自动化检测微创骨折、评估骨质疏松风险，并生成个性化的患者外联内容。该模块解决了当前医疗系统中MTF漏诊、延迟治疗和患者沟通不足的关键问题。

## 🎯 解决的核心问题

### 1. **识别难题**
- **问题**: 放射学报告包含大量骨折信息，无法自动区分交通事故、癌症、手足等非相关骨折
- **解决方案**: AI智能分析，自动识别和分类骨折类型，专门检测从站立高度或更低跌倒引起的微创骨折

### 2. **信息孤岛**
- **问题**: 放射科报告→专科医生，延迟10-20天以上
- **解决方案**: 实时AI分析和自动专科转诊系统，将延迟缩短至4-24小时

### 3. **沟通缺失**
- **问题**: GP关注急性损伤，忽略骨质疏松长期管理，患者未及时获得治疗
- **解决方案**: 自动化患者外联系统，多通道个性化沟通

### 4. **人力耗费**
- **问题**: 护士需逐一打电话重复问诊，大量简单病例占用专家资源
- **解决方案**: AI自动筛选和优先级管理，智能外联内容生成

### 5. **患者教育不足**
- **问题**: 老年患者不擅长使用数字工具，无法得到清晰、友好的信息
- **解决方案**: 多通道沟通（邮件、短信、电话），老年友好的个性化内容

## 🏗️ 系统架构

### 工作流程概览
```
报告上传/导入 → AI扫描分析 → 风险评估 → 自动外联生成 → 患者响应跟踪
```

### 核心组件

#### 1. **报告导入系统** (`ReportImportHub`)
- **手动输入**: 支持直接输入报告文本和患者信息
- **文件上传**: 支持PDF、DOC、DOCX、TXT文件的批量上传和OCR提取
- **系统集成**: 与Epic MyChart、Cerner PowerChart、PACS等医疗系统集成
- **邮件导入**: 自动监控指定邮箱，处理邮件附件中的报告

#### 2. **AI扫描引擎** (`enhancedReportScanningService`)
- **NLP处理**: 使用GPT-4o进行医学报告的自然语言处理
- **MTF检测**: 专门识别微创骨折的特征和模式
- **质量控制**: 置信度评估和质量检查机制
- **批量处理**: 支持多报告并发处理

#### 3. **风险评估系统** (`riskAssessmentService`)
- **综合评分**: 结合年龄、性别、病史、药物等多因素评估
- **优先级分类**: 自动分类为低、中、高、紧急四个优先级
- **个性化建议**: 基于患者特征生成针对性的医疗建议
- **成本估算**: 预估治疗费用和资源需求

#### 4. **智能外联系统** (`intelligentOutreachService`)
- **多通道支持**: 邮件、短信、电话脚本、患者自评表单
- **个性化内容**: 基于年龄、性别、风险等级生成定制内容
- **语言适配**: 支持不同教育水平和语言偏好的内容调整
- **跟踪监测**: 外联效果跟踪和响应率分析

## 📊 技术规格

### 前端技术栈
- **框架**: React 18 + TypeScript
- **UI库**: Radix UI + Tailwind CSS
- **状态管理**: React Query (TanStack Query)
- **路由**: Wouter
- **图表**: Recharts

### 后端技术栈
- **框架**: Node.js + Express + TypeScript
- **AI服务**: OpenAI GPT-4o
- **数据验证**: Zod schemas
- **文件处理**: Multer + OCR libraries

### 数据库设计
- **主数据库**: PostgreSQL with Drizzle ORM
- **核心表**:
  - `radiology_reports`: 放射学报告存储
  - `report_analysis`: AI分析结果
  - `patient_outreach`: 患者外联记录
  - `self_assessments`: 患者自评数据

## 🚀 快速开始

### 1. 环境配置

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
```

必需的环境变量：
```env
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=your_postgresql_url
BASE_URL=https://your-domain.com
```

### 2. 数据库初始化

```bash
# 推送数据库schema
npm run db:push
```

### 3. 启动开发环境

```bash
# 启动开发服务器
npm run dev
```

### 4. 访问应用

打开浏览器访问：`http://localhost:5000/mtf-detection`

## 📚 API接口文档

### 1. 报告扫描接口

#### POST `/api/mtf/scan-report`
扫描单个放射学报告

**请求体:**
```json
{
  "reportText": "放射学报告内容",
  "reportType": "xray|mri|ct|discharge_summary|gp_notes",
  "patientContext": {
    "patientId": "string",
    "age": "number",
    "gender": "male|female|other",
    "medicalHistory": "string"
  },
  "metadata": {
    "facility": "string",
    "orderingPhysician": "string", 
    "reportDate": "string"
  }
}
```

**响应:**
```json
{
  "success": true,
  "data": {
    "scanResult": {
      "patientId": "string",
      "riskScore": "number (0-100)",
      "riskLevel": "low|medium|high|critical",
      "mtfSuspected": "boolean",
      "confidence": "number (0-100)",
      "keyFindings": {
        "fractures": [...],
        "riskFactors": [...],
        "recommendations": [...],
        "followUpRequired": "boolean"
      },
      "processingTime": "number"
    },
    "qualityCheck": {...}
  }
}
```

#### POST `/api/mtf/batch-scan`
批量扫描多个报告

**请求体:**
```json
{
  "reports": [
    // 报告对象数组，格式同单个扫描
  ]
}
```

### 2. 风险评估接口

#### POST `/api/mtf/risk-assessment`
生成风险评估报告

**请求体:**
```json
{
  "scanResult": {
    // 扫描结果对象
  },
  "patientContext": {
    "age": "number",
    "gender": "string",
    "medicalHistory": "string",
    "previousFractures": "number",
    "medications": ["string"],
    "lifestyle": {
      "smoking": "boolean",
      "alcohol": "boolean",
      "exercise": "boolean",
      "calciumIntake": "boolean"
    }
  }
}
```

### 3. 患者外联接口

#### POST `/api/mtf/generate-outreach`
生成个性化外联内容

**请求体:**
```json
{
  "patient": {
    "id": "string",
    "name": "string", 
    "email": "string",
    "age": "number",
    "gender": "string",
    "educationLevel": "basic|intermediate|advanced"
  },
  "scanResult": {...},
  "riskAssessment": {...}
}
```

### 4. 完整工作流程接口

#### POST `/api/mtf/complete-workflow`
一次性完成从报告分析到外联生成的完整流程

**请求体:**
```json
{
  "reportData": {
    // 报告数据
  },
  "patientContext": {
    // 患者上下文
  },
  "patient": {
    // 患者信息
  }
}
```

## 🎨 用户界面指南

### 1. 主控制台 (MTFDetectionDashboard)

**功能特性:**
- 实时系统统计概览
- 待处理案例列表
- 紧急案例突出显示
- 快速筛选和搜索
- 批量操作支持

**使用方法:**
1. 查看系统总览和关键指标
2. 浏览待处理的MTF案例
3. 点击案例查看详细信息
4. 执行批量操作（联系患者、生成外联等）

### 2. 报告导入中心 (ReportImportHub)

**功能特性:**
- 多种导入方式（手动、文件、集成、邮件）
- 实时处理进度显示
- 批量文件处理
- OCR文本提取
- 质量验证

**使用方法:**
1. 选择导入方式（推荐从手动输入开始）
2. 填写必要的患者信息
3. 输入或上传报告内容
4. 提交并等待AI分析
5. 查看分析结果和建议

### 3. 患者外联中心 (PatientOutreachCenter)

**功能特性:**
- 多通道外联内容生成（邮件、短信、电话、自评表单）
- 个性化内容定制
- 实时发送状态跟踪
- 响应效果分析
- 模板编辑和管理

**使用方法:**
1. 选择需要外联的患者案例
2. 点击"生成外联内容"
3. 查看和编辑各通道的内容
4. 选择合适的通道发送
5. 跟踪患者响应状态

## 🔧 配置和定制

### 1. AI配置

在 `client/src/types/reportScanning.ts` 中调整AI检测参数：

```typescript
export const REPORT_SCANNER_CONFIG: ReportScannerConfig = {
  confidenceThresholds: {
    low: 30,      // 可调整阈值
    medium: 50,
    high: 70,
    critical: 85
  },
  medicalCriteria: {
    mtfKeywords: [
      // 可添加更多关键词
      'fall from standing height',
      'low energy trauma',
      // ...
    ]
  }
};
```

### 2. 风险评估配置

在 `server/services/riskAssessmentService.ts` 中调整评分权重：

```typescript
// 年龄调整权重
if (patientContext.age > 80) {
  score += 20;  // 可调整分数增量
} else if (patientContext.age > 75) {
  score += 15;
}
```

### 3. 外联内容模板

在 `server/services/intelligentOutreachService.ts` 中定制外联模板：

```typescript
private generateUrgentMTFContent(patient: any, scanResult: any): string {
  return `尊敬的${patient.name}：
  
  // 可定制模板内容
  我们已完成您近期影像检查的分析...
  `;
}
```

## 📈 性能监控

### 关键指标

1. **处理性能**
   - 平均处理时间：< 3秒
   - 并发处理能力：10个报告/批次
   - AI置信度：> 85%

2. **检测准确性**
   - MTF检出率：> 90%
   - 假阳性率：< 10%
   - 假阴性率：< 5%

3. **患者外联效果**
   - 邮件打开率：> 80%
   - 短信响应率：> 60%
   - 电话接通率：> 70%

### 监控接口

```bash
# 健康检查
GET /api/mtf/health

# 系统统计
GET /api/mtf/statistics

# 患者扫描历史
GET /api/mtf/patient/:patientId/scan-history
```

## 🛠️ 故障排除

### 常见问题

#### 1. AI分析失败
**症状**: API返回500错误，提示"Failed to scan radiology report"
**解决方案**:
- 检查OPENAI_API_KEY是否正确配置
- 确认OpenAI API配额和限制
- 查看报告文本是否包含有效医学内容

#### 2. 文件上传失败
**症状**: 文件上传后状态显示"error"
**解决方案**:
- 确认文件格式支持（PDF、DOC、DOCX、TXT）
- 检查文件大小限制（通常<10MB）
- 验证OCR服务配置

#### 3. 外联内容生成失败
**症状**: 点击"生成外联内容"无响应或报错
**解决方案**:
- 确认患者信息完整
- 检查扫描结果和风险评估数据
- 验证外联模板配置

### 日志调试

开启详细日志：
```bash
NODE_ENV=development DEBUG=mtf:* npm run dev
```

查看关键日志：
```bash
# AI服务日志
grep "AI Service" logs/app.log

# 外联服务日志  
grep "Outreach" logs/app.log

# 错误日志
grep "ERROR" logs/app.log
```

## 📝 最佳实践

### 1. 报告质量优化
- 确保报告文本完整、清晰
- 包含患者基本信息（年龄、性别）
- 提供详细的医学历史
- 标注报告类型和检查日期

### 2. 风险评估准确性
- 收集完整的患者病史
- 更新药物信息
- 记录生活方式因素
- 定期校准评估算法

### 3. 患者外联效果
- 根据患者偏好选择沟通渠道
- 使用年龄和教育水平适应的语言
- 提供明确的行动指导
- 及时跟进患者响应

### 4. 系统维护
- 定期更新AI模型
- 监控系统性能指标
- 备份重要数据
- 更新医学知识库

## 🔐 安全和合规

### HIPAA合规
- 所有患者数据加密存储
- API通信使用HTTPS
- 访问日志记录
- 数据保留政策

### 隐私保护
- 最小化数据收集
- 匿名化处理选项
- 患者同意管理
- 数据删除功能

## 🚀 未来路线图

### 短期计划（3个月）
- [ ] 支持更多文件格式（DICOM、HL7）
- [ ] 增加多语言支持
- [ ] 移动端适配
- [ ] 高级分析报告

### 中期计划（6个月）
- [ ] 机器学习模型优化
- [ ] 集成更多医疗系统
- [ ] 患者门户网站
- [ ] 临床决策支持工具

### 长期计划（12个月）
- [ ] 预测性分析
- [ ] 人工智能辅助诊断
- [ ] 多中心临床研究支持
- [ ] 区块链数据安全

## 📞 技术支持

如有问题或建议，请联系：

- **技术文档**: [GitHub Wiki](https://github.com/your-org/mtf-detection/wiki)
- **问题报告**: [GitHub Issues](https://github.com/your-org/mtf-detection/issues)
- **邮件支持**: support@mtf-detection.ai
- **电话支持**: +86-400-123-4567

---

*最后更新：2024年1月15日*
*版本：v1.0.0*
