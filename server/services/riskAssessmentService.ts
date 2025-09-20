import { ReportScanResult, RiskAssessment } from "../../client/src/types/reportScanning";

export class RiskAssessmentService {
  
  /**
   * 生成综合风险评估
   */
  async generateRiskAssessment(
    scanResult: ReportScanResult,
    patientContext: {
      age: number;
      gender: string;
      medicalHistory?: string;
      previousFractures?: number;
      medications?: string[];
      familyHistory?: string[];
      lifestyle?: {
        smoking: boolean;
        alcohol: boolean;
        exercise: boolean;
        calciumIntake: boolean;
      };
    }
  ): Promise<RiskAssessment> {
    
    const { riskScore, mtfSuspected, keyFindings } = scanResult;
    
    // 计算综合风险评分
    const adjustedRiskScore = this.calculateAdjustedRiskScore(scanResult, patientContext);
    
    // 确定优先级和紧急程度
    const { priority, urgency } = this.determinePriorityAndUrgency(adjustedRiskScore, mtfSuspected, patientContext, scanResult);
    
    // 生成推荐措施
    const recommendations = this.generateRecommendations(scanResult, patientContext, priority);
    
    // 识别风险因素
    const riskFactors = this.identifyRiskFactors(scanResult, patientContext);
    
    // 生成预防措施
    const preventionMeasures = this.generatePreventionMeasures(scanResult, patientContext);
    
    // 确定是否需要专科转诊
    const specialistReferral = this.determineSpecialistReferral(priority, mtfSuspected, patientContext);
    
    // 估算治疗成本
    const estimatedCost = this.estimateTreatmentCost(priority, specialistReferral, scanResult);
    
    return {
      priority,
      urgency,
      recommendations,
      followUpRequired: keyFindings.followUpRequired || mtfSuspected || priority !== 'low',
      specialistReferral,
      estimatedCost,
      riskFactors,
      preventionMeasures
    };
  }
  
  /**
   * 计算调整后的风险评分
   */
  private calculateAdjustedRiskScore(
    scanResult: ReportScanResult,
    patientContext: any
  ): number {
    let score = scanResult.riskScore;
    
    // 年龄调整 - 主要风险因素
    if (patientContext.age > 80) {
      score += 20;
    } else if (patientContext.age > 75) {
      score += 15;
    } else if (patientContext.age > 70) {
      score += 10;
    } else if (patientContext.age > 65) {
      score += 5;
    }
    
    // 性别调整 - 女性绝经后风险增加
    if (patientContext.gender === 'female' && patientContext.age > 50) {
      score += 10;
      if (patientContext.age > 65) {
        score += 5; // 绝经后额外风险
      }
    }
    
    // 既往骨折史 - 强预测因子
    if (patientContext.previousFractures) {
      score += Math.min(patientContext.previousFractures * 8, 25); // 最多加25分
    }
    
    // 药物风险调整
    if (patientContext.medications) {
      const riskyMedications = this.identifyRiskyMedications(patientContext.medications);
      score += riskyMedications.length * 5;
    }
    
    // 家族史调整
    if (patientContext.familyHistory?.includes('osteoporosis') || 
        patientContext.familyHistory?.includes('fracture')) {
      score += 8;
    }
    
    // 生活方式调整
    if (patientContext.lifestyle) {
      if (patientContext.lifestyle.smoking) score += 7;
      if (patientContext.lifestyle.alcohol) score += 5;
      if (!patientContext.lifestyle.exercise) score += 6;
      if (!patientContext.lifestyle.calciumIntake) score += 4;
    }
    
    // MTF存在时的额外风险
    if (scanResult.mtfSuspected) {
      score += 15;
    }
    
    return Math.min(100, Math.max(0, score));
  }
  
  /**
   * 确定优先级和紧急程度
   */
  private determinePriorityAndUrgency(
    adjustedRiskScore: number,
    mtfSuspected: boolean,
    patientContext: any,
    scanResult: ReportScanResult
  ): { priority: 'low' | 'medium' | 'high' | 'critical'; urgency: number } {
    
    let priority: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let urgency = 168; // 默认1周
    
    // 基于风险评分确定基础优先级
    if (adjustedRiskScore >= 85 || mtfSuspected) {
      priority = 'critical';
      urgency = 4; // 4小时内
    } else if (adjustedRiskScore >= 70) {
      priority = 'high';
      urgency = 12; // 12小时内
    } else if (adjustedRiskScore >= 50) {
      priority = 'medium';
      urgency = 48; // 48小时内
    } else if (adjustedRiskScore >= 30) {
      priority = 'medium';
      urgency = 72; // 72小时内
    }
    
    // 年龄调整紧急程度
    if (patientContext.age > 80) {
      urgency = Math.min(urgency, urgency * 0.5); // 高龄患者更紧急
    } else if (patientContext.age > 75) {
      urgency = Math.min(urgency, urgency * 0.7);
    }
    
    // 多发骨折或高风险位置调整
    const highRiskLocations = ['hip', 'vertebral', 'femur'];
    const hasHighRiskFracture = scanResult.keyFindings.fractures.some((f: any) => 
      highRiskLocations.some(loc => f.location.toLowerCase().includes(loc))
    );
    
    if (hasHighRiskFracture) {
      if (priority === 'medium') priority = 'high';
      if (priority === 'high') priority = 'critical';
      urgency = Math.min(urgency, urgency * 0.6);
    }
    
    return { priority, urgency: Math.round(urgency) };
  }
  
  /**
   * 生成个性化推荐措施
   */
  private generateRecommendations(
    scanResult: ReportScanResult,
    patientContext: any,
    priority: string
  ): string[] {
    const recommendations: string[] = [];
    
    // 包含原始推荐
    recommendations.push(...scanResult.keyFindings.recommendations);
    
    // 基于优先级的推荐
    if (priority === 'critical') {
      recommendations.push('立即安排骨科专科医生会诊');
      recommendations.push('24小时内完成DEXA骨密度检查');
      recommendations.push('紧急跌倒风险评估和干预');
      recommendations.push('考虑住院观察和治疗');
    } else if (priority === 'high') {
      recommendations.push('48小时内骨科专科医生评估');
      recommendations.push('1周内完成DEXA骨密度检查');
      recommendations.push('跌倒预防和家庭安全评估');
      recommendations.push('抗骨质疏松药物治疗评估');
    } else if (priority === 'medium') {
      recommendations.push('2周内专科医生咨询');
      recommendations.push('骨健康评估和生活方式咨询');
      recommendations.push('钙和维生素D补充评估');
    }
    
    // 基于患者特征的推荐
    if (patientContext.age > 75) {
      recommendations.push('综合老年医学评估');
      recommendations.push('多学科团队协作管理');
      recommendations.push('家庭护理和支持服务评估');
    }
    
    if (patientContext.gender === 'female' && patientContext.age > 50) {
      recommendations.push('激素替代治疗评估（如适用）');
      recommendations.push('妇科内分泌专科咨询');
    }
    
    if (patientContext.previousFractures && patientContext.previousFractures > 0) {
      recommendations.push('既往骨折部位复查和监测');
      recommendations.push('骨折愈合质量评估');
    }
    
    // 去重并排序
    return Array.from(new Set(recommendations)).sort();
  }
  
  /**
   * 识别所有风险因素
   */
  private identifyRiskFactors(scanResult: ReportScanResult, patientContext: any): string[] {
    const riskFactors: string[] = [];
    
    // 从扫描结果中获取
    riskFactors.push(...scanResult.keyFindings.riskFactors);
    
    // 年龄风险因素
    if (patientContext.age > 80) {
      riskFactors.push('高龄（>80岁）');
    } else if (patientContext.age > 70) {
      riskFactors.push('高龄（>70岁）');
    } else if (patientContext.age > 50) {
      riskFactors.push('中老年（>50岁）');
    }
    
    // 性别风险因素
    if (patientContext.gender === 'female') {
      if (patientContext.age > 50) {
        riskFactors.push('绝经后女性');
      } else {
        riskFactors.push('女性');
      }
    }
    
    // 骨折史
    if (patientContext.previousFractures && patientContext.previousFractures > 0) {
      riskFactors.push(`既往骨折史（${patientContext.previousFractures}次）`);
    }
    
    // 药物风险
    if (patientContext.medications) {
      const riskyMeds = this.identifyRiskyMedications(patientContext.medications);
      riskyMeds.forEach(med => riskFactors.push(`高风险药物使用：${med}`));
    }
    
    // 家族史
    if (patientContext.familyHistory) {
      if (patientContext.familyHistory.includes('osteoporosis')) {
        riskFactors.push('骨质疏松家族史');
      }
      if (patientContext.familyHistory.includes('fracture')) {
        riskFactors.push('骨折家族史');
      }
    }
    
    // 生活方式风险因素
    if (patientContext.lifestyle) {
      if (patientContext.lifestyle.smoking) riskFactors.push('吸烟');
      if (patientContext.lifestyle.alcohol) riskFactors.push('过量饮酒');
      if (!patientContext.lifestyle.exercise) riskFactors.push('缺乏运动');
      if (!patientContext.lifestyle.calciumIntake) riskFactors.push('钙摄入不足');
    }
    
    return Array.from(new Set(riskFactors));
  }
  
  /**
   * 生成预防措施
   */
  private generatePreventionMeasures(scanResult: ReportScanResult, patientContext: any): string[] {
    const measures: string[] = [];
    
    // 基础预防措施
    measures.push('规律的负重运动和力量训练');
    measures.push('充足的钙摄入（每日1000-1200mg）');
    measures.push('维生素D补充（每日800-1000 IU）');
    measures.push('跌倒预防策略和环境改造');
    
    // 基于风险等级的措施
    if (scanResult.riskScore >= 70) {
      measures.push('抗骨质疏松药物治疗');
      measures.push('定期骨密度监测（每1-2年）');
      measures.push('物理治疗和平衡训练');
      measures.push('营养评估和干预');
    }
    
    // 基于年龄的措施
    if (patientContext.age > 75) {
      measures.push('家庭安全改造（扶手、防滑垫等）');
      measures.push('定期视力和听力检查');
      measures.push('药物评估（减少致跌倒风险）');
      measures.push('社会支持网络建立');
    }
    
    // 基于性别的措施
    if (patientContext.gender === 'female' && patientContext.age > 50) {
      measures.push('绝经后健康管理');
      measures.push('激素水平监测');
    }
    
    // 生活方式改善
    if (patientContext.lifestyle?.smoking) {
      measures.push('戒烟计划和支持');
    }
    if (patientContext.lifestyle?.alcohol) {
      measures.push('减少酒精摄入');
    }
    
    return measures;
  }
  
  /**
   * 确定是否需要专科转诊
   */
  private determineSpecialistReferral(
    priority: string,
    mtfSuspected: boolean,
    patientContext: any
  ): boolean {
    // 高优先级或MTF疑似案例需要专科转诊
    if (priority === 'critical' || priority === 'high' || mtfSuspected) {
      return true;
    }
    
    // 高龄患者伴多个风险因素
    if (patientContext.age > 75 && patientContext.previousFractures > 0) {
      return true;
    }
    
    // 复杂病例需要专科评估
    if (patientContext.medications && 
        this.identifyRiskyMedications(patientContext.medications).length > 1) {
      return true;
    }
    
    return false;
  }
  
  /**
   * 估算治疗成本
   */
  private estimateTreatmentCost(
    priority: string,
    specialistReferral: boolean,
    scanResult: ReportScanResult
  ): number {
    let cost = 0;
    
    // 基础评估费用
    cost += 150; // 基础医疗评估
    
    // 专科费用
    if (specialistReferral) {
      cost += 300; // 专科医生咨询
    }
    
    // 检查费用
    if (priority === 'high' || priority === 'critical') {
      cost += 200; // DEXA扫描
      cost += 100; // 实验室检查
    }
    
    // 治疗费用（基于风险等级）
    if (scanResult.riskScore >= 70) {
      cost += 500; // 抗骨质疏松药物（年费用）
      cost += 300; // 物理治疗
    }
    
    // 紧急处理费用
    if (priority === 'critical') {
      cost += 1000; // 紧急评估和可能的住院
    }
    
    return cost;
  }
  
  /**
   * 识别高风险药物
   */
  private identifyRiskyMedications(medications: string[]): string[] {
    const riskyMeds: string[] = [];
    const riskPatterns = [
      { pattern: /corticosteroid|prednisone|prednisolone/i, name: '糖皮质激素' },
      { pattern: /proton pump inhibitor|omeprazole|lansoprazole/i, name: '质子泵抑制剂' },
      { pattern: /anticonvulsant|phenytoin|carbamazepine/i, name: '抗癫痫药' },
      { pattern: /warfarin|heparin|anticoagulant/i, name: '抗凝药物' },
      { pattern: /sedative|benzodiazepine|diazepam/i, name: '镇静药物' },
      { pattern: /thyroid hormone|levothyroxine/i, name: '甲状腺激素（过量）' }
    ];
    
    medications.forEach(med => {
      riskPatterns.forEach(risk => {
        if (risk.pattern.test(med)) {
          riskyMeds.push(risk.name);
        }
      });
    });
    
    return Array.from(new Set(riskyMeds));
  }
  
  /**
   * 生成风险评估报告摘要
   */
  generateAssessmentSummary(riskAssessment: RiskAssessment, scanResult: ReportScanResult): string {
    const { priority, urgency } = riskAssessment;
    const { mtfSuspected } = scanResult;
    const riskLevel = scanResult.riskLevel;
    
    let summary = `风险评估摘要：\n`;
    summary += `- 优先级：${priority.toUpperCase()}\n`;
    summary += `- 建议处理时间：${urgency}小时内\n`;
    summary += `- MTF疑似：${mtfSuspected ? '是' : '否'}\n`;
    summary += `- 风险等级：${riskLevel}\n`;
    summary += `- 风险评分：${scanResult.riskScore}/100\n`;
    summary += `- AI置信度：${scanResult.confidence}%\n\n`;
    
    if (riskAssessment.specialistReferral) {
      summary += `需要专科转诊：是\n`;
    }
    
    summary += `主要风险因素：\n`;
    riskAssessment.riskFactors.slice(0, 5).forEach(factor => {
      summary += `- ${factor}\n`;
    });
    
    summary += `\n关键推荐措施：\n`;
    riskAssessment.recommendations.slice(0, 3).forEach(rec => {
      summary += `- ${rec}\n`;
    });
    
    return summary;
  }
}

export const riskAssessmentService = new RiskAssessmentService();
