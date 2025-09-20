import { OutreachGeneration, ReportScanResult, RiskAssessment } from "../../client/src/types/reportScanning";

export class IntelligentOutreachService {
  
  /**
   * 生成个性化的多通道患者外联内容
   */
  async generatePersonalizedOutreach(
    patient: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      address?: string;
      age: number;
      gender: string;
      preferredLanguage?: string;
      communicationPreferences?: string[];
      educationLevel?: 'basic' | 'intermediate' | 'advanced';
    },
    scanResult: ReportScanResult,
    riskAssessment: RiskAssessment
  ): Promise<OutreachGeneration> {
    
    const outreachGeneration: OutreachGeneration = {
      email: await this.generateEmailOutreach(patient, scanResult, riskAssessment),
      sms: await this.generateSMSOutreach(patient, scanResult, riskAssessment),
      phone: await this.generatePhoneScript(patient, scanResult, riskAssessment),
      letter: await this.generateLetterOutreach(patient, scanResult, riskAssessment),
      selfAssessment: await this.generateSelfAssessmentForm(patient, scanResult, riskAssessment)
    };
    
    return outreachGeneration;
  }
  
  /**
   * 生成个性化邮件内容
   */
  private async generateEmailOutreach(patient: any, scanResult: ReportScanResult, riskAssessment: RiskAssessment) {
    const { priority, urgency } = riskAssessment;
    const { mtfSuspected, riskLevel } = scanResult;
    
    // 选择合适的邮件模板
    const templateType = this.selectEmailTemplate(riskLevel, priority, mtfSuspected);
    
    // 生成个性化内容
    const content = this.generateEmailContent(templateType, patient, scanResult, riskAssessment);
    
    return {
      template: templateType,
      subject: this.generateEmailSubject(templateType, patient.name, mtfSuspected),
      content: content.content,
      personalizedContent: this.addEmailPersonalization(content.content, patient, scanResult, riskAssessment)
    };
  }
  
  /**
   * 选择邮件模板类型
   */
  private selectEmailTemplate(riskLevel: string, priority: string, mtfSuspected: boolean): string {
    if (mtfSuspected || priority === 'critical') {
      return 'urgent_mtf_template';
    } else if (riskLevel === 'high' || priority === 'high') {
      return 'high_risk_template';
    } else if (riskLevel === 'medium' || priority === 'medium') {
      return 'medium_risk_template';
    } else {
      return 'routine_followup_template';
    }
  }
  
  /**
   * 生成邮件主题
   */
  private generateEmailSubject(templateType: string, patientName: string, mtfSuspected: boolean): string {
    switch (templateType) {
      case 'urgent_mtf_template':
        return `紧急：${patientName}的影像检查结果需要立即关注`;
      case 'high_risk_template':
        return `重要：您的影像检查结果需要进一步评估`;
      case 'medium_risk_template':
        return `建议随访：您的影像检查结果和骨健康建议`;
      default:
        return `您的影像检查结果更新`;
    }
  }
  
  /**
   * 生成邮件内容
   */
  private generateEmailContent(templateType: string, patient: any, scanResult: ReportScanResult, riskAssessment: RiskAssessment) {
    const baseContent = this.getEmailTemplate(templateType, patient, scanResult, riskAssessment);
    
    return {
      content: baseContent,
      attachments: this.generateEmailAttachments(scanResult, riskAssessment),
      callToAction: this.generateEmailCallToAction(templateType, riskAssessment.priority)
    };
  }
  
  /**
   * 获取邮件模板内容
   */
  private getEmailTemplate(templateType: string, patient: any, scanResult: ReportScanResult, riskAssessment: RiskAssessment): string {
    const fracturesDescription = this.formatFracturesForPatient(scanResult.keyFindings.fractures);
    
    switch (templateType) {
      case 'urgent_mtf_template':
        return `尊敬的${patient.name}：\n\n我们已完成您近期影像检查的分析，发现了一些需要立即关注的重要发现。\n\n检查发现：\n${fracturesDescription}\n\n为什么这很重要：\n这些发现提示可能存在微创骨折，这可能是骨质健康的重要指标。早期发现和治疗有助于预防未来骨折，维护您的生活质量。\n\n立即行动步骤：\n1. 请立即完成我们的在线评估：[评估链接]\n2. 我们将在24小时内致电安排紧急专科会诊\n3. 在此期间，请避免可能导致跌倒的活动\n\n您可以期待：\n- 24-48小时内的专科医生会诊\n- 骨密度检测（DEXA扫描）\n- 综合治疗方案制定\n- 持续监测和支持\n\n如有任何疑问或担忧，请立即致电我们：[联系电话]\n\n此致\n您的医疗团队`;
      
      case 'high_risk_template':
        return `亲爱的${patient.name}：\n\n我们已完成您近期影像检查的评估，希望与您讨论一些发现。\n\n检查发现：\n${fracturesDescription}\n\n后续步骤：\n1. 请完成我们的在线评估：[评估链接]\n2. 我们将在48小时内联系您安排随访预约\n3. 考虑参加我们的骨健康监测项目：[监测链接]\n\n预防重点：\n- 规律运动和力量训练\n- 充足的钙和维生素D摄入\n- 跌倒预防策略\n- 定期骨健康监测\n\n我们将全程支持您的健康管理。\n\n此致\n您的医疗团队`;
      
      case 'medium_risk_template':
        return `亲爱的${patient.name}：\n\n我们已完成您近期影像检查的评估。虽然结果总体良好，但我们有一些关于您骨健康的建议。\n\n检查发现：\n${fracturesDescription}\n\n建议：\n1. 完成我们的骨健康评估：[评估链接]\n2. 考虑加入我们的骨健康监测项目：[监测链接]\n3. 安排下周内的随访预约\n\n骨健康小贴士：\n- 保持规律的身体活动\n- 确保充足的钙和维生素D\n- 实施跌倒预防策略\n- 定期健康检查\n\n我们致力于帮助您维护强健的骨骼。\n\n此致\n您的医疗团队`;
      
      default:
        return `亲爱的${patient.name}：\n\n我们已完成您近期影像检查的评估。结果总体在正常范围内，我们有一些维护骨健康的积极建议。\n\n检查发现：\n${fracturesDescription}\n\n维护建议：\n1. 继续规律的身体活动\n2. 保持充足的钙和维生素D摄入\n3. 考虑我们的骨健康监测项目：[监测链接]\n4. 定期健康检查\n\n预防重点：\n- 规律运动和力量训练\n- 均衡营养\n- 跌倒预防策略\n- 定期骨健康监测\n\n继续保持您的健康管理！\n\n此致\n您的医疗团队`;
    }
  }
  
  /**
   * 为患者格式化骨折描述
   */
  private formatFracturesForPatient(fractures: any[]): string {
    if (fractures.length === 0) {
      return '• 影像检查显示骨骼结构基本正常';
    }
    
    return fractures.map(fracture => {
      const location = this.translateMedicalTerms(fracture.location);
      const type = this.translateMedicalTerms(fracture.type);
      const traumaNote = fracture.isMinimalTrauma ? '（微创性骨折）' : '';
      
      return `• ${location}：${type}${traumaNote}`;
    }).join('\n');
  }
  
  /**
   * 翻译医学术语为患者友好的语言
   */
  private translateMedicalTerms(term: string): string {
    const translations: Record<string, string> = {
      'L1 vertebral body': '第一腰椎椎体',
      'compression fracture': '压缩性骨折',
      'hip fracture': '髋部骨折',
      'wrist fracture': '腕部骨折',
      'vertebral': '脊椎',
      'femoral neck': '股骨颈',
      'distal radius': '桡骨远端',
      'humerus': '肱骨',
      'osteoporotic': '骨质疏松性',
      'minimal trauma': '微创性',
      'compression': '压缩性',
      'displaced': '移位性',
      'undisplaced': '无移位'
    };
    
    let translated = term;
    Object.entries(translations).forEach(([english, chinese]) => {
      translated = translated.replace(new RegExp(english, 'gi'), chinese);
    });
    
    return translated;
  }
  
  /**
   * 添加邮件个性化内容
   */
  private addEmailPersonalization(content: string, patient: any, scanResult: ReportScanResult, riskAssessment: RiskAssessment): string {
    let personalized = content;
    
    // 添加年龄特定建议
    if (patient.age > 75) {
      personalized += `\n\n针对75岁以上患者的特别建议：\n- 考虑家庭安全改造\n- 定期视力和听力检查\n- 药物评估以降低跌倒风险\n- 综合老年医学评估`;
    } else if (patient.age > 65) {
      personalized += `\n\n针对65岁以上患者的建议：\n- 加强平衡和力量训练\n- 定期骨密度检查\n- 跌倒预防策略\n- 营养评估和优化`;
    }
    
    // 添加性别特定建议
    if (patient.gender === 'female' && patient.age > 50) {
      personalized += `\n\n女性健康重点：\n- 绝经后骨健康考虑\n- 激素替代治疗评估（如适用）\n- 专门的女性健康项目\n- 妊娠和哺乳期考虑（如适用）`;
    }
    
    // 添加教育水平适应的解释
    if (patient.educationLevel === 'basic') {
      personalized += `\n\n简单说明：\n我们发现您的骨骼可能需要额外关注。就像建筑物需要坚固的框架一样，我们的身体需要强健的骨骼。我们会帮助您保持骨骼健康，预防未来的问题。`;
    } else if (patient.educationLevel === 'advanced') {
      personalized += `\n\n详细信息：\n基于当前影像学发现和风险评估算法，您的骨质疏松症风险评分为${scanResult.riskScore}/100。我们建议采用循证医学方法进行综合管理，包括药物干预、生活方式调整和定期监测。`;
    }
    
    return personalized;
  }
  
  /**
   * 生成SMS外联内容
   */
  private async generateSMSOutreach(patient: any, scanResult: ReportScanResult, riskAssessment: RiskAssessment) {
    const { priority, urgency } = riskAssessment;
    const { mtfSuspected } = scanResult;
    
    let message = '';
    
    if (mtfSuspected || priority === 'critical') {
      message = `${patient.name}您好，您的影像检查发现重要情况需要紧急处理。请立即完成评估：[链接] 我们将在24小时内致电。- 医疗团队`;
    } else if (priority === 'high') {
      message = `${patient.name}您好，您的影像检查结果需要进一步评估。请完成在线评估：[链接] 我们将在48小时内联系您。- 医疗团队`;
    } else {
      message = `${patient.name}您好，您的影像检查结果已出，请完成健康评估：[链接] 我们很快会联系您。- 医疗团队`;
    }
    
    return {
      message,
      priority,
      urgency,
      link: this.generateShortLink(patient.id, 'assessment'),
      tracking: true
    };
  }
  
  /**
   * 生成电话脚本
   */
  private async generatePhoneScript(patient: any, scanResult: ReportScanResult, riskAssessment: RiskAssessment) {
    const { priority, urgency } = riskAssessment;
    const { mtfSuspected } = scanResult;
    
    return {
      opening: `您好，${patient.name}，我是[姓名]，来自[医院/诊所]。我致电是关于您近期的影像检查结果。`,
      keyPoints: this.generatePhoneKeyPoints(scanResult, riskAssessment),
      closing: this.generatePhoneClosing(priority, urgency),
      followUp: this.generatePhoneFollowUp(priority, urgency)
    };
  }
  
  /**
   * 生成电话要点
   */
  private generatePhoneKeyPoints(scanResult: ReportScanResult, riskAssessment: RiskAssessment): string[] {
    const points = [];
    
    if (scanResult.mtfSuspected) {
      points.push('用简单语言解释微创骨折的含义');
      points.push('强调早期治疗的重要性');
      points.push('讨论骨健康和骨质疏松预防');
    }
    
    points.push('清楚解释后续步骤');
    points.push('提供在线自评表单');
    points.push('安排随访预约');
    points.push('回答任何担忧或问题');
    points.push('提供24小时联系方式');
    
    if (riskAssessment.specialistReferral) {
      points.push('解释专科转诊的必要性');
      points.push('说明专科医生的专业领域');
    }
    
    return points;
  }
  
  /**
   * 生成电话结尾
   */
  private generatePhoneClosing(priority: string, urgency: number): string {
    if (priority === 'critical') {
      return '我们将在24小时内再次致电安排紧急预约。如果您有任何问题，请随时联系我们。这非常重要，请不要延误。';
    } else if (priority === 'high') {
      return '我们将在48小时内联系您安排随访预约。请务必完成我们发送给您的评估表单。';
    } else {
      return '我们将在下周内联系您安排随访预约。请在方便时完成评估表单。';
    }
  }
  
  /**
   * 生成电话随访计划
   */
  private generatePhoneFollowUp(priority: string, urgency: number): any {
    return {
      timeframe: urgency < 24 ? '24小时内' : urgency < 48 ? '48小时内' : '1周内',
      method: 'phone',
      purpose: 'schedule_appointment',
      backup: 'email',
      attempts: priority === 'critical' ? 3 : 2,
      escalation: priority === 'critical' ? 'supervisor' : 'standard'
    };
  }
  
  /**
   * 生成信件外联
   */
  private async generateLetterOutreach(patient: any, scanResult: ReportScanResult, riskAssessment: RiskAssessment) {
    return {
      recipient: patient.name,
      address: patient.address,
      content: this.generateLetterContent(patient, scanResult, riskAssessment),
      priority: riskAssessment.priority,
      delivery: riskAssessment.priority === 'critical' ? 'express_mail' : 'standard_mail'
    };
  }
  
  /**
   * 生成信件内容
   */
  private generateLetterContent(patient: any, scanResult: ReportScanResult, riskAssessment: RiskAssessment): string {
    const date = new Date().toLocaleDateString('zh-CN');
    
    return `[医院/诊所抬头]\n\n${date}\n\n${patient.name}\n${patient.address || '[患者地址]'}\n\n尊敬的${patient.name}：\n\n我们写信通知您近期影像检查的结果，并讨论您骨健康的重要后续步骤。\n\n${this.formatFracturesForPatient(scanResult.keyFindings.fractures)}\n\n基于这些发现，我们建议您尽快联系我们安排随访预约。早期干预对于维护您的骨健康和预防未来问题至关重要。\n\n请在收到此信后立即致电我们：[联系电话]\n\n我们已为您准备了个性化的治疗方案，期待与您讨论最佳的治疗选择。\n\n此致\n\n[医生签名]\n[医生姓名]\n[科室]\n[联系信息]`;
  }
  
  /**
   * 生成自评表单
   */
  private async generateSelfAssessmentForm(patient: any, scanResult: ReportScanResult, riskAssessment: RiskAssessment) {
    const baseQuestions = this.getBaseAssessmentQuestions();
    const personalizedQuestions = this.getPersonalizedQuestions(scanResult, riskAssessment, patient);
    
    return {
      formId: `assessment_${patient.id}_${Date.now()}`,
      questions: [...baseQuestions, ...personalizedQuestions],
      instructions: this.generatePersonalizedInstructions(patient, scanResult, riskAssessment),
      estimatedTime: this.calculateEstimatedTime([...baseQuestions, ...personalizedQuestions]),
      rewards: this.generateAssessmentRewards(riskAssessment.priority)
    };
  }
  
  /**
   * 获取基础评估问题
   */
  private getBaseAssessmentQuestions(): any[] {
    return [
      {
        id: 'pain_level',
        type: 'scale',
        question: '在0-10的评分中，您目前的疼痛程度是？',
        description: '0表示无痛，10表示剧烈疼痛',
        options: Array.from({length: 11}, (_, i) => ({ value: i, label: i.toString() })),
        required: true
      },
      {
        id: 'pain_location',
        type: 'multi_select',
        question: '您感到疼痛的部位有哪些？（可多选）',
        options: [
          { value: 'back', label: '背部/脊椎' },
          { value: 'hip', label: '髋部' },
          { value: 'wrist', label: '腕部' },
          { value: 'shoulder', label: '肩部' },
          { value: 'ribs', label: '肋骨' },
          { value: 'other', label: '其他部位' }
        ],
        required: false
      },
      {
        id: 'mobility_impact',
        type: 'radio',
        question: '疼痛对您的行动能力有何影响？',
        options: [
          { value: 'no_impact', label: '无影响' },
          { value: 'mild_impact', label: '轻微影响日常活动' },
          { value: 'moderate_impact', label: '中度影响日常活动' },
          { value: 'severe_impact', label: '严重影响日常活动' }
        ],
        required: true
      },
      {
        id: 'fall_concern',
        type: 'radio',
        question: '您是否担心跌倒？',
        options: [
          { value: 'not_concerned', label: '不担心' },
          { value: 'slightly_concerned', label: '有点担心' },
          { value: 'moderately_concerned', label: '比较担心' },
          { value: 'very_concerned', label: '非常担心' }
        ],
        required: true
      },
      {
        id: 'previous_falls',
        type: 'number',
        question: '在过去12个月中，您跌倒过几次？',
        description: '请输入具体次数，如果没有跌倒请输入0',
        min: 0,
        max: 20,
        required: true
      },
      {
        id: 'daily_activities',
        type: 'multi_select',
        question: '以下哪些日常活动对您来说有困难？（可多选）',
        options: [
          { value: 'walking', label: '行走' },
          { value: 'climbing_stairs', label: '爬楼梯' },
          { value: 'lifting', label: '提举重物' },
          { value: 'bending', label: '弯腰' },
          { value: 'reaching', label: '够取高处物品' },
          { value: 'none', label: '以上都不困难' }
        ],
        required: false
      }
    ];
  }
  
  /**
   * 获取个性化问题
   */
  private getPersonalizedQuestions(scanResult: ReportScanResult, riskAssessment: RiskAssessment, patient: any): any[] {
    const questions = [];
    
    // 基于MTF疑似状态的问题
    if (scanResult.mtfSuspected) {
      questions.push({
        id: 'mtf_symptoms',
        type: 'multi_select',
        question: '您是否经历过以下情况？（可多选）',
        options: [
          { value: 'height_loss', label: '身高变矮' },
          { value: 'hunched_posture', label: '驼背或弯腰姿势' },
          { value: 'chronic_back_pain', label: '慢性背痛' },
          { value: 'fracture_after_minor_fall', label: '轻微跌倒后骨折' },
          { value: 'none', label: '以上都没有' }
        ]
      });
    }
    
    // 基于骨折位置的问题
    const hasVertebralFracture = scanResult.keyFindings.fractures.some(f => 
      f.location.toLowerCase().includes('vertebral') || f.location.toLowerCase().includes('spine')
    );
    
    if (hasVertebralFracture) {
      questions.push({
        id: 'back_pain_sudden',
        type: 'radio',
        question: '您是否有突然出现的背痛？',
        options: [
          { value: 'no', label: '没有' },
          { value: 'mild', label: '轻微' },
          { value: 'moderate', label: '中等' },
          { value: 'severe', label: '严重' }
        ]
      });
    }
    
    // 基于年龄的问题
    if (patient.age > 65) {
      questions.push({
        id: 'medication_review',
        type: 'textarea',
        question: '请列出您目前正在服用的所有药物（包括处方药、非处方药和补充剂）：',
        placeholder: '例如：高血压药物、钙片、维生素D等...',
        maxLength: 500
      });
    }
    
    // 基于性别的问题
    if (patient.gender === 'female' && patient.age > 45) {
      questions.push({
        id: 'menopause_status',
        type: 'radio',
        question: '您的绝经状态是？',
        options: [
          { value: 'premenopausal', label: '绝经前' },
          { value: 'perimenopausal', label: '围绝经期' },
          { value: 'postmenopausal', label: '绝经后' },
          { value: 'unknown', label: '不确定' }
        ]
      });
    }
    
    return questions;
  }
  
  /**
   * 生成个性化说明
   */
  private generatePersonalizedInstructions(patient: any, scanResult: ReportScanResult, riskAssessment: RiskAssessment): string {
    let instructions = `亲爱的${patient.name}，\n\n`;
    instructions += '请完成这个评估，帮助我们更好地了解您的当前状况。';
    
    if (scanResult.mtfSuspected) {
      instructions += '这个评估特别重要，因为我们希望确保您获得最适合的护理。';
    }
    
    if (riskAssessment.priority === 'high' || riskAssessment.priority === 'critical') {
      instructions += '请尽快完成，以便我们能够及时为您提供护理。';
    }
    
    instructions += '\n\n您的回答将帮助我们为您制定个性化的治疗方案。所有信息都将严格保密。';
    
    return instructions;
  }
  
  /**
   * 计算预估完成时间
   */
  private calculateEstimatedTime(questions: any[]): number {
    // 估算每个问题的平均完成时间（分钟）
    const timePerQuestion = {
      'radio': 0.5,
      'multi_select': 1,
      'scale': 0.5,
      'number': 0.5,
      'textarea': 2,
      'text': 1
    };
    
    const totalTime = questions.reduce((total, question) => {
      return total + (timePerQuestion[question.type as keyof typeof timePerQuestion] || 1);
    }, 0);
    
    return Math.ceil(totalTime);
  }
  
  /**
   * 生成评估奖励
   */
  private generateAssessmentRewards(priority: string): any {
    const baseRewards = {
      'low': {
        message: '感谢您完成评估，您将收到个性化的骨健康指南',
        type: 'information'
      },
      'medium': {
        message: '完成评估后，您将获得免费的骨健康咨询',
        type: 'consultation'
      },
      'high': {
        message: '完成评估后，您将优先安排专科医生预约',
        type: 'priority_appointment'
      },
      'critical': {
        message: '完成评估后，我们将立即安排紧急医疗评估',
        type: 'urgent_care'
      }
    };
    
    return baseRewards[priority as keyof typeof baseRewards] || baseRewards.low;
  }
  
  /**
   * 生成短链接
   */
  private generateShortLink(patientId: string, type: string): string {
    // 这里应该实现实际的短链接生成逻辑
    const baseUrl = process.env.BASE_URL || 'https://healthcare-ai.com';
    const linkId = Buffer.from(`${patientId}_${type}_${Date.now()}`).toString('base64').slice(0, 8);
    return `${baseUrl}/s/${linkId}`;
  }
  
  /**
   * 生成邮件附件
   */
  private generateEmailAttachments(scanResult: ReportScanResult, riskAssessment: RiskAssessment): any[] {
    const attachments = [];
    
    if (riskAssessment.specialistReferral) {
      attachments.push({
        name: '专科转诊表.pdf',
        type: 'application/pdf',
        description: '专科医生转诊表单'
      });
    }
    
    if (scanResult.mtfSuspected || riskAssessment.priority === 'high') {
      attachments.push({
        name: '骨健康指南.pdf',
        type: 'application/pdf',
        description: '全面的骨健康管理指南'
      });
    }
    
    if (riskAssessment.preventionMeasures.length > 0) {
      attachments.push({
        name: '预防措施清单.pdf',
        type: 'application/pdf',
        description: '个性化的骨折预防措施'
      });
    }
    
    return attachments;
  }
  
  /**
   * 生成邮件行动号召
   */
  private generateEmailCallToAction(templateType: string, priority: string): any {
    const actions = {
      'urgent_mtf_template': {
        primary: '立即完成紧急评估',
        secondary: '致电医疗团队',
        urgency: 'critical',
        color: 'red'
      },
      'high_risk_template': {
        primary: '完成健康评估',
        secondary: '预约专科医生',
        urgency: 'high',
        color: 'orange'
      },
      'medium_risk_template': {
        primary: '完成骨健康评估',
        secondary: '了解更多信息',
        urgency: 'medium',
        color: 'yellow'
      },
      'routine_followup_template': {
        primary: '查看健康建议',
        secondary: '安排常规检查',
        urgency: 'low',
        color: 'green'
      }
    };
    
    return actions[templateType as keyof typeof actions] || actions.routine_followup_template;
  }
}

export const intelligentOutreachService = new IntelligentOutreachService();
