import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './App.css';
import { insuranceData } from './data/insuranceData';

const exportPDF = () => {
  const captureElement = document.getElementById('pdf-content');
  if (!captureElement) return;

    html2canvas(captureElement).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('insurance_policy.pdf');
  });
};

function App() {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    age: '',
    gender: 'male',
    smoker: 'no',
    icci: 'no',
    language: 'en',
  });

  const [result, setResult] = useState<any>(null);
  const [dataRows, setDataRows] = useState<Array<{ year: string; fund: string; protection: string }>>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const age = parseInt(form.age);
    let ageGroup = '';

    const specialCombo = `${form.gender}_${form.smoker}_${form.icci}_${age}`;
    const specialCases: { [key: string]: string } = {
      "male_no_yes_40": "40",
      "male_no_yes_41": "41/43",
      "male_no_yes_42": "41/43",
      "male_no_yes_43": "41/43",
      "female_no_yes_40": "40",
      "female_no_yes_41": "41/43",
      "female_no_yes_42": "41/43",
      "female_no_yes_43": "41/43",
      "female_yes_yes_40": "40",
      "female_yes_yes_41": "41/43",
      "female_yes_yes_42": "41/43",
      "female_yes_yes_43": "41/43",
      "female_no_yes_53": "53",
      "female_yes_yes_53": "53"
    };

    if (specialCombo in specialCases) {
      ageGroup = specialCases[specialCombo];
    } else {
      if (age >= 21 && age <= 25) ageGroup = '21/25';
      else if (age >= 26 && age <= 30) ageGroup = '26/30';
      else if (age >= 31 && age <= 33) ageGroup = '31/33';
      else if (age >= 34 && age <= 35) ageGroup = '34/35';
      else if (age >= 36 && age <= 37) ageGroup = '36/37';
      else if (age >= 38 && age <= 39) ageGroup = '38/39';
      else if (age >= 40 && age <= 43) ageGroup = '40/43';
      else if (age >= 44 && age <= 45) ageGroup = '44/45';
      else if (age >= 46 && age <= 48) ageGroup = '46/48';
      else if (age >= 49 && age <= 50) ageGroup = '49/50';
      else if (age >= 51 && age <= 53) ageGroup = '51/53';
      else ageGroup = 'Other';
    }

    const smokerStatus = form.smoker === 'yes' ? 'Smoker' : 'Non-Smoker';
    const icciStatus = form.icci === 'yes' ? 'With ICCI' : 'Without ICCI';
    const genderKey = form.gender === 'male' ? 'Male' : 'Female';

    const entry = insuranceData[genderKey]?.[smokerStatus]?.[icciStatus]?.[ageGroup];

    if (entry) {
      if (Array.isArray(entry.data)) {
        setDataRows(entry.data);
      } else {
        const converted = Object.entries(entry.data).map(([year, value]) => ({
          year,
          fund: value.fund,
          protection: value.protection,
        }));
        setDataRows(converted);
      }

      const premium = entry.premium || entry.monthly || 'N/A';
    
      const coverageEN = `Policy Coverage:
- Death/Disability + Fund Value: RM100,000 + Fund Value
- Accidental Death/Disability: RM100,000
- Early Stage Illness: RM50,000
- 79 Critical Illnesses: RM200,000
- Funeral Expenses: RM5,000
- Waiver of premium for critical illness

Early Stage Illness Payout Methods:
1. Option 1:
   - RM35,000 (50,000 x 70%)
   - Within 90 days: RM25,000
   - 79 Critical Illnesses: RM200,000
   - Total: RM260,000

2. Option 2:
   - RM35,000 (50,000 x 70%)
   - After 90 days: RM50,000
   - 79 Critical Illnesses: RM200,000
   - Total: RM285,000

79 Critical Illnesses (4 Payout Methods)    
   1. Coverage for 79 Critical Illnesses - Includes Malaysia's top 3 killers: Cancer, Stroke, Heart Disease, etc.

   2. Direct Payout RM200,000 for:  
      - Diagnosis of 79 Critical Illnesses
      - Surgery due to accident,  continuous hospitalization for 20 days **AND** survival for 30 days.  

   3.ICU Intubation Payout (Survive for 30 days):
     - 5-9 Days: RM60,000
     - 10-14 Days: RM100,000
     - 15+ Days: RM200,000

   4. Angioplasty Balloon Surgery: Minimum 10% payout, up to RM25,000`;

      const coverageZH = `保单保障：
- 身故/残疾 + 基金数额：RM100,000 + 基金数额
- 意外身故/残疾：RM100,000
- 初期疾病：RM50,000
- 79种重大疾病：RM200,000
- 丧葬费：RM5,000
- 中疾病保费豁免

初期疾病赔付法：
1. 方案一：
   - RM35,000（50,000 x 70%）
   - 90天内：RM25,000
   - 79种重大疾病：RM200,000
   - 总计：RM260,000

2. 方案二：
   - RM35,000（50,000 x 70%）
   - 90天后：RM50,000
   - 79种重大疾病：RM200,000
   - 总计：RM285,000

79 种疾病（4 种赔法)
   1. 79 种疾病-包括马来西亚三大杀手癌症，中风，心脏病等等

   2. 79 种疾病或意外导致开刀手术，连续住院 20 天，生存 30 天
      直接理赔 RM200,000  

   3. 重症监护插管赔付 (生存 30 天)：
      - 5-9天：RM60,000
      - 10-14天：RM100,000
      - 15天以上：RM200,000

   4. 冠状动脉球囊扩张手术：最低 10%，最高RM25,000`;

      setResult({
        premium,
        fundValue: '',
        protection: '',
        payout: form.language === 'en'
          ? 'Early stage illness: RM50,000 | 79 Critical illnesses: RM200,000'
          : '早期疾病：RM50,000｜79种重大疾病：RM200,000',
        ageGroup,
        coverage: form.language === 'en' ? coverageEN : coverageZH,
      });
    } else {
      alert('No data found.');
    }
  };

  return (
    <div className="App">
      <h2>{form.language === 'en' ? 'Critical Illness Policy Planner' : '重疾保险计划'}</h2>

      <select name="language" onChange={handleChange} value={form.language}>
        <option value="en">English</option>
        <option value="zh">中文</option>
      </select>
      <input name="name" placeholder={form.language === 'en' ? 'Name' : '姓名'} onChange={handleChange} />
      <input name="contact" placeholder={form.language === 'en' ? 'Contact' : '联系方式'} onChange={handleChange} />
      <input name="age" placeholder={form.language === 'en' ? 'Age' : '年龄'} onChange={handleChange} />
      <select name="gender" onChange={handleChange} value={form.gender}>
        <option value="male">{form.language === 'en' ? 'Male' : '男'}</option>
        <option value="female">{form.language === 'en' ? 'Female' : '女'}</option>
      </select>
      <select name="smoker" onChange={handleChange} value={form.smoker}>
        <option value="no">{form.language === 'en' ? 'Non-Smoker' : '不吸烟'}</option>
        <option value="yes">{form.language === 'en' ? 'Smoker' : '吸烟者'}</option>
      </select>
      <select name="icci" onChange={handleChange} value={form.icci}>
        <option value="no">{form.language === 'en' ? 'Without ICCI' : '无 ICCI'}</option>
        <option value="yes">{form.language === 'en' ? 'With ICCI' : '有 ICCI'}</option>
      </select>
      <p>{form.language === 'en' ? 'Remark: Data for age of 21 to 50/53' : '备注：21至50/53岁的数据'}</p>
      <button onClick={handleSubmit}>{form.language === 'en' ? 'Get Policy Info' : '获取保险资料'}</button>

      {result && (
        <div id="pdf-content" style={{
          padding: "30px",
          fontSize: "13px",
          width: "800px",
          margin: "30px auto",
          background: "#fff",
          fontFamily: "Arial, sans-serif",
          color: "#333",
          lineHeight: "1.6",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          borderRadius: "8px"
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '14px',
            color: '#222'
          }}>
            {form.language === 'en' ? 'Critical Illness Policy Summary' : '重大疾病保险摘要'}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.0rem 2rem',
            marginBottom: '1rem',
            fontSize: '12px',
            lineHeight: '0.5',
          }}>
            <p>
              <strong>{form.language === 'en' ? 'Name' : '姓名'}:</strong> {form.name}
            </p>
            <p>
              <strong>{form.language === 'en' ? 'Contact' : '联系方式'}:</strong> {form.contact}
            </p>
            <p>
              <strong>{form.language === 'en' ? 'Age' : '年龄'}:</strong> {form.age}
            </p>
            <p>
              <strong>{form.language === 'en' ? 'Gender' : '性别'}:</strong> {form.gender}
            </p>
            <p>
              <strong>{form.language === 'en' ? 'Smoker' : '抽烟'}:</strong> {form.smoker}
            </p>
            <p>
              <strong>{form.language === 'en' ? 'ICCI' : '是否有 ICCI'}:</strong> {form.icci}
            </p>
            <p>
              <strong>{form.language === 'en' ? 'Rough Monthly Premium' : '月保费大概'}:</strong> {result.premium}
            </p>
          </div>

          <h3 style={{
            fontSize: '13px',
            marginTop: '16px',
            marginBottom: '10px',
            borderBottom: '1px solid #ccc',
            paddingBottom: '5px'
          }}>{form.language === 'en' ? 'Estimated Value Table' : '估计值表格'}</h3>

          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'center',
            fontSize: '11px'
          }}>
            <thead style={{ backgroundColor: '#f0f0f0' }}>
              <tr>
                <th style={{ border: '1px solid #999', padding: '8px' }}>{form.language === 'en' ? 'Years' : '年数'}</th>
                <th style={{ border: '1px solid #999', padding: '8px' }}>{form.language === 'en' ? 'Fund Value' : '基金数'}</th>
                <th style={{ border: '1px solid #999', padding: '8px' }}>{form.language === 'en' ? 'Protection' : '保障'}</th>
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #ccc', padding: '6px' }}>{row.year}</td>
                  <td style={{ border: '1px solid #ccc', padding: '6px' }}>{`RM${row.fund}`}</td>
                  <td style={{ border: '1px solid #ccc', padding: '6px' }}>{`RM${row.protection}`}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 style={{
            fontSize: '9px',
            marginTop: '5px',
            fontWeight: 'bold',  
            paddingBottom: '0px'
          }}>{form.language === 'en' ? '**Data is for reference only, value subjuct to vary based on performance' : '**数据仅供参考，价值根据表现可能会有所变化。'}</h4>

          <h4 style={{
            fontSize: '14px',
            marginTop: '25px',
            fontWeight: 'bold',
            borderBottom: '1px solid #eee',
            paddingBottom: '2px'
          }}>{form.language === 'en' ? 'Coverage Details' : '保障详情'}</h4>

          <div style={{
            whiteSpace: 'pre-wrap',
            backgroundColor: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '15px',
            marginTop: '10px',
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#444'
          }}>
            {result.coverage}
          </div>
        </div>
      )}
         
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={exportPDF} style={{
          padding: '10px 20px',
          fontSize: '14px',
          border: 'none',
          borderRadius: '4px',
          backgroundColor: '#007bff',
          color: '#fff',
          cursor: 'pointer'
        }}>
          {form.language === 'en' ? 'Download PDF' : '下载 PDF'}
        </button>
      </div>
    </div> 
  ); 
}

export default App;