import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import _ from 'lodash';

const FractureAnalysis = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to read the file - the exact filename from the document
        const fileName = 'Mpower list of all radiology reports patients 50 and above containing word fracture in August  deidentified.xlsx';
        
        console.log('Attempting to read file:', fileName);
        const fileData = await window.fs.readFile(fileName);
        
        console.log('File read successfully, parsing Excel...');
        const workbook = XLSX.read(fileData, { type: 'array' });
        
        if (workbook.SheetNames.length === 0) {
          throw new Error('No worksheets found in the Excel file');
        }
        
        const sheetName = workbook.SheetNames[0];
        console.log('Reading sheet:', sheetName);
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        
        console.log('Raw data rows:', jsonData.length);
        console.log('First row keys:', Object.keys(jsonData[0] || {}));
        
        // Clean headers by trimming whitespace and handle empty rows
        const cleanedData = jsonData
          .filter(row => Object.keys(row).some(key => row[key] !== '')) // Remove completely empty rows
          .map(row => {
            const cleanedRow = {};
            Object.keys(row).forEach(key => {
              const cleanedKey = key.trim();
              cleanedRow[cleanedKey] = row[key];
            });
            return cleanedRow;
          });
        
        console.log('Cleaned data rows:', cleanedData.length);
        
        if (cleanedData.length === 0) {
          throw new Error('No valid data rows found in the Excel file');
        }
        
        setData(cleanedData);
        generateInsights(cleanedData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        let errorMessage = 'Failed to load the Excel file. ';
        
        if (err.message.includes('could not be found')) {
          errorMessage += 'The file was not found. Please ensure the Excel file is uploaded to the conversation.';
        } else if (err.message.includes('No worksheets found')) {
          errorMessage += 'The Excel file appears to be empty or corrupted.';
        } else if (err.message.includes('No valid data')) {
          errorMessage += 'The Excel file contains no valid data rows.';
        } else {
          errorMessage += `Error details: ${err.message}`;
        }
        
        setError(errorMessage);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const generateInsights = (data) => {
    if (!data || data.length === 0) return;

    const insights = {
      totalReports: data.length,
      columns: Object.keys(data[0] || {}),
    };

    // Analyze age distribution if age column exists
    const ageColumn = insights.columns.find(col => 
      col.toLowerCase().includes('age') || 
      col.toLowerCase().includes('patient_age') ||
      col.toLowerCase().includes('pt_age')
    );

    if (ageColumn) {
      console.log(`Found age column: ${ageColumn}`);
      const rawAges = data.map(row => row[ageColumn]);
      console.log('Sample age values:', rawAges.slice(0, 10));
      
      const ages = rawAges
        .map(age => {
          if (age === null || age === undefined || age === '') return null;
          const numAge = Number(age);
          return !isNaN(numAge) && numAge > 0 && numAge < 150 ? numAge : null;
        })
        .filter(age => age !== null);
        
      console.log(`Valid ages found: ${ages.length} out of ${data.length} total records`);
      
      if (ages.length > 0) {
        insights.ageStats = {
          mean: _.mean(ages).toFixed(1),
          median: _.sortBy(ages)[Math.floor(ages.length / 2)],
          min: _.min(ages),
          max: _.max(ages),
          validCount: ages.length,
          totalCount: data.length
        };

        // Age groups - only for ages 50+ as specified in the data description
        const ageGroups = _.groupBy(ages.filter(age => age >= 50), age => {
          if (age >= 50 && age < 60) return '50-59';
          if (age >= 60 && age < 70) return '60-69';
          if (age >= 70 && age < 80) return '70-79';
          if (age >= 80 && age < 90) return '80-89';
          if (age >= 90) return '90+';
          return 'Other';
        });

        insights.ageGroupData = Object.keys(ageGroups)
          .filter(group => group !== 'Other')
          .map(group => ({
            ageGroup: group,
            count: ageGroups[group].length
          }))
          .sort((a, b) => a.ageGroup.localeCompare(b.ageGroup));
      }
      
      insights.ageColumn = ageColumn;
    }

    // Analyze gender distribution if gender column exists
    const genderColumn = insights.columns.find(col => 
      col.toLowerCase().includes('gender') || 
      col.toLowerCase().includes('sex') ||
      col.toLowerCase().includes('patient_gender') ||
      col.toLowerCase().includes('pt_gender')
    );

    if (genderColumn) {
      console.log(`Found gender column: ${genderColumn}`);
      console.log('Sample gender values:', data.slice(0, 5).map(row => row[genderColumn]));
      
      const genderCounts = _.countBy(data, row => {
        const gender = String(row[genderColumn] || '').trim().toLowerCase();
        console.log('Processing gender value:', gender);
        
        if (gender === 'm' || gender === 'male' || gender === '1') return 'Male';
        if (gender === 'f' || gender === 'female' || gender === '0' || gender === '2') return 'Female';
        if (gender === '') return 'Not Specified';
        return `Unknown (${gender})`;
      });

      console.log('Gender counts:', genderCounts);
      
      insights.genderData = Object.keys(genderCounts)
        .filter(gender => genderCounts[gender] > 0)
        .map(gender => ({
          gender,
          count: genderCounts[gender],
          percentage: ((genderCounts[gender] / data.length) * 100).toFixed(1)
        }));
        
      insights.genderColumn = genderColumn;
      insights.genderRawValues = [...new Set(data.map(row => row[genderColumn]).filter(val => val !== undefined && val !== null))];
    }

    // Analyze body parts/locations if relevant columns exist
    const bodyPartColumns = insights.columns.filter(col => 
      col.toLowerCase().includes('body') || 
      col.toLowerCase().includes('part') ||
      col.toLowerCase().includes('location') ||
      col.toLowerCase().includes('site') ||
      col.toLowerCase().includes('bone')
    );

    // Look for fracture types in text fields
    const textColumns = insights.columns.filter(col => 
      col.toLowerCase().includes('report') || 
      col.toLowerCase().includes('finding') ||
      col.toLowerCase().includes('impression') ||
      col.toLowerCase().includes('description')
    );

    if (textColumns.length > 0) {
      const fractureTypes = {};
      const bodyParts = {};
      
      data.forEach(row => {
        textColumns.forEach(col => {
          const text = String(row[col] || '').toLowerCase();
          
          // Common fracture types
          ['displaced', 'non-displaced', 'comminuted', 'spiral', 'oblique', 'transverse', 'compression'].forEach(type => {
            if (text.includes(type)) {
              fractureTypes[type] = (fractureTypes[type] || 0) + 1;
            }
          });

          // Common fracture locations
          ['hip', 'femur', 'tibia', 'fibula', 'radius', 'ulna', 'humerus', 'spine', 'vertebr', 'rib', 'pelvis', 'ankle', 'wrist', 'shoulder'].forEach(part => {
            if (text.includes(part)) {
              bodyParts[part] = (bodyParts[part] || 0) + 1;
            }
          });
        });
      });

      insights.fractureTypes = Object.keys(fractureTypes).map(type => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        count: fractureTypes[type]
      })).filter(item => item.count > 0).sort((a, b) => b.count - a.count);

      insights.bodyParts = Object.keys(bodyParts).map(part => ({
        part: part.charAt(0).toUpperCase() + part.slice(1),
        count: bodyParts[part]
      })).filter(item => item.count > 0).sort((a, b) => b.count - a.count);
    }

    setInsights(insights);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading radiology data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
          <p className="text-red-600 mb-4">{error}</p>
          
          <div className="bg-white rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-gray-800 mb-2">Troubleshooting Steps:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              <li>Verify that you've uploaded the Excel file to this conversation</li>
              <li>Check that the filename exactly matches: "Mpower list of all radiology reports patients 50 and above containing word fracture in August  deidentified.xlsx"</li>
              <li>Ensure the file is a valid Excel format (.xlsx)</li>
              <li>Make sure the file contains data and isn't empty</li>
            </ol>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-blue-800 mb-2">Alternative Options:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
              <li>Re-upload the Excel file to this conversation</li>
              <li>Check if the file has a slightly different name</li>
              <li>Verify the file isn't corrupted</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Radiology Fracture Analysis</h1>
        <p className="text-gray-600 mb-4">Analysis of fracture reports for patients 50+ years old in August</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800">Total Reports</h3>
            <p className="text-2xl font-bold text-blue-600">{insights.totalReports}</p>
          </div>
          
          {insights.ageStats && (
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800">Age Statistics</h3>
              <p className="text-2xl font-bold text-green-600">{insights.ageStats.mean} years avg</p>
              <p className="text-sm text-green-700">Range: {insights.ageStats.min}-{insights.ageStats.max}</p>
              <p className="text-xs text-green-600">{insights.ageStats.validCount}/{insights.ageStats.totalCount} valid ages</p>
            </div>
          )}
          
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-800">Data Columns</h3>
            <p className="text-2xl font-bold text-purple-600">{insights.columns?.length || 0}</p>
          </div>
        </div>
      </div>

      {insights.ageGroupData && insights.ageGroupData.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Age Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={insights.ageGroupData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageGroup" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {insights.genderData && insights.genderData.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Gender Distribution</h2>
          
          {/* Debug information */}
          <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm">
            <p><strong>Gender Column:</strong> {insights.genderColumn}</p>
            <p><strong>Raw Values Found:</strong> {insights.genderRawValues?.join(', ') || 'None'}</p>
            <p><strong>Total Records:</strong> {data.length}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={insights.genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({gender, percentage}) => `${gender}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {insights.genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {insights.genderData.map((item, index) => (
                <div key={item.gender} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="font-medium">{item.gender}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">{item.count}</span>
                    <span className="text-gray-600 ml-2">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {insights.bodyParts && insights.bodyParts.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Most Common Fracture Locations</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={insights.bodyParts.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="part" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {insights.fractureTypes && insights.fractureTypes.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Fracture Types</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={insights.fractureTypes.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Structure Overview</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Available Columns:</h3>
          <div className="flex flex-wrap gap-2">
            {insights.columns?.map((col, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {col}
              </span>
            ))}
          </div>
        </div>
        
        {data.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Sample Data (First 3 rows):</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    {insights.columns?.slice(0, 6).map((col, index) => (
                      <th key={index} className="px-3 py-2 text-left font-medium">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 3).map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b">
                      {insights.columns?.slice(0, 6).map((col, colIndex) => (
                        <td key={colIndex} className="px-3 py-2">
                          {String(row[col] || '').substring(0, 50)}
                          {String(row[col] || '').length > 50 ? '...' : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Key Clinical Insights</h2>
        <div className="space-y-3 text-gray-700">
          <p>• This dataset contains <strong>{insights.totalReports}</strong> fracture reports from patients aged 50 and above during August</p>
          
          {insights.ageStats && (
            <p>• Patient age ranges from <strong>{insights.ageStats.min}</strong> to <strong>{insights.ageStats.max}</strong> years, with an average of <strong>{insights.ageStats.mean}</strong> years</p>
          )}
          
          {insights.genderData && insights.genderData.length > 0 && (
            <p>• Gender distribution shows important patterns in fracture prevalence among older adults</p>
          )}
          
          {insights.bodyParts && insights.bodyParts.length > 0 && (
            <p>• Most commonly fractured locations include: <strong>{insights.bodyParts.slice(0, 3).map(item => item.part).join(', ')}</strong></p>
          )}
          
          <p>• This data can help identify fracture patterns, risk factors, and inform prevention strategies for the 50+ population</p>
        </div>
      </div>
    </div>
  );
};

export default FractureAnalysis;