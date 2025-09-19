import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload,
  FileText,
  Search,
  Database,
  Settings,
  Trash2,
  Download,
  Eye,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Brain,
  Zap
} from 'lucide-react';
import { RAGDocument, RAGStats, RAGQuery, DocumentChunk } from '@/types/workflow';

interface RAGManagementProps {
  onClose?: () => void;
}

export function RAGManagement({ onClose }: RAGManagementProps) {
  const [activeTab, setActiveTab] = useState('documents');
  const [documents, setDocuments] = useState<RAGDocument[]>([]);
  const [stats, setStats] = useState<RAGStats>({
    totalDocuments: 0,
    totalChunks: 0,
    totalQueries: 0,
    averageResponseTime: 0,
    knowledgeBaseSize: 0,
    lastUpdated: new Date()
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<RAGQuery | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockDocuments: RAGDocument[] = [
      {
        id: 'doc-1',
        filename: 'medical_guidelines_2024.pdf',
        title: 'Medical Guidelines 2024',
        content: 'Comprehensive medical guidelines for micro-fracture diagnosis and treatment...',
        fileType: 'pdf',
        fileSize: 2048576,
        uploadDate: new Date('2024-01-15'),
        status: 'indexed',
        chunks: [],
        metadata: { category: 'guidelines', version: '2024.1' }
      },
      {
        id: 'doc-2',
        filename: 'case_studies.txt',
        title: 'Micro-fracture Case Studies',
        content: 'Collection of case studies for micro-fracture diagnosis...',
        fileType: 'txt',
        fileSize: 512000,
        uploadDate: new Date('2024-01-10'),
        status: 'indexed',
        chunks: [],
        metadata: { category: 'cases', count: 150 }
      }
    ];

    setDocuments(mockDocuments);
    setStats({
      totalDocuments: mockDocuments.length,
      totalChunks: 1250,
      totalQueries: 89,
      averageResponseTime: 1.2,
      knowledgeBaseSize: 2.5,
      lastUpdated: new Date()
    });
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newDoc: RAGDocument = {
          id: `doc-${Date.now()}`,
          filename: file.name,
          title: file.name.replace(/\.[^/.]+$/, ""),
          content: '',
          fileType: file.name.split('.').pop() as any || 'txt',
          fileSize: file.size,
          uploadDate: new Date(),
          status: 'uploading',
          chunks: [],
          metadata: {}
        };
        setDocuments(prev => [newDoc, ...prev]);
      });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search
    setTimeout(() => {
      const mockResults: RAGQuery = {
        id: `query-${Date.now()}`,
        query: searchQuery,
        embedding: [],
        results: [
          {
            id: 'result-1',
            documentId: 'doc-1',
            chunkId: 'chunk-1',
            content: 'Micro-fractures are small cracks in bones that can be difficult to detect...',
            score: 0.95,
            metadata: {},
            source: {
              filename: 'medical_guidelines_2024.pdf',
              pageNumber: 15,
              section: 'Diagnosis'
            }
          }
        ],
        timestamp: new Date(),
        responseTime: 1.2,
        contextUsed: 'Medical guidelines and case studies'
      };
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'indexed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'indexed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">RAG Knowledge Management</h1>
          <p className="text-gray-600">Manage your knowledge base and search capabilities</p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Documents</p>
                <p className="text-2xl font-bold">{stats.totalDocuments}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chunks</p>
                <p className="text-2xl font-bold">{stats.totalChunks.toLocaleString()}</p>
              </div>
              <Database className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Queries</p>
                <p className="text-2xl font-bold">{stats.totalQueries}</p>
              </div>
              <Search className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold">{stats.averageResponseTime}s</p>
              </div>
              <Zap className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Knowledge Base Documents</CardTitle>
                <div className="flex gap-2">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.txt,.docx,.md"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Documents
                    </label>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <FileText className="w-8 h-8 text-gray-600" />
                      <div>
                        <h3 className="font-semibold">{doc.title}</h3>
                        <p className="text-sm text-gray-600">
                          {formatFileSize(doc.fileSize)} • {doc.uploadDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(doc.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(doc.status)}
                          {doc.status}
                        </div>
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base Search</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search the knowledge base..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
                  {isSearching ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {searchResults && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Search Results</h3>
                    <Badge variant="outline">
                      {searchResults.results.length} results in {searchResults.responseTime}s
                    </Badge>
                  </div>
                  
                  {searchResults.results.map((result) => (
                    <Card key={result.id}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{result.source.filename}</h4>
                            <Badge variant="outline">
                              Score: {(result.score * 100).toFixed(1)}%
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {result.content}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Page {result.source.pageNumber}</span>
                            <span>Section: {result.source.section}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Knowledge Base Size</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Storage Used</span>
                      <span>{stats.knowledgeBaseSize} GB</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {stats.averageResponseTime}s
                      </div>
                      <div className="text-sm text-gray-600">Avg Response Time</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {stats.totalQueries}
                      </div>
                      <div className="text-sm text-gray-600">Total Queries</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Last Updated</h3>
                  <p className="text-sm text-gray-600">
                    {stats.lastUpdated.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>RAG Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Embedding Model</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Configure the embedding model for vectorization
                  </p>
                  <Input placeholder="text-embedding-ada-002" />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Chunk Size</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Size of text chunks for processing
                  </p>
                  <Input type="number" placeholder="1000" />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Vector Database</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Pinecone configuration
                  </p>
                  <div className="space-y-2">
                    <Input placeholder="Pinecone API Key" type="password" />
                    <Input placeholder="Index Name" />
                  </div>
                </div>

                <Button className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
