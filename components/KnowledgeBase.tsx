import React, { useState } from 'react';
import { FileText, Trash2, Zap, Coffee, Briefcase, FileUp, CheckCircle2 } from 'lucide-react';
import { DocumentFile } from '../types';

const KnowledgeBase: React.FC = () => {
  const [vibe, setVibe] = useState<'casual' | 'formal' | 'direct'>('casual');
  const [instructions, setInstructions] = useState('');
  const [files, setFiles] = useState<DocumentFile[]>([
    { id: '1', name: 'Dinner_Menu_Winter.pdf', size: '2.4 MB', type: 'application/pdf', uploadDate: '2023-10-24', status: 'indexed' },
    { id: '2', name: 'Wine_List_2024.docx', size: '1.1 MB', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', uploadDate: '2023-11-01', status: 'indexed' }
  ]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadProgress(10);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            const newFile: DocumentFile = {
              id: Date.now().toString(),
              name: file.name,
              size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
              type: file.type,
              uploadDate: new Date().toISOString().split('T')[0],
              status: 'processing'
            };
            setFiles(prevFiles => [...prevFiles, newFile]);
            setTimeout(() => {
                setFiles(currFiles => currFiles.map(f => f.id === newFile.id ? {...f, status: 'indexed'} : f));
            }, 2000);
            return 0;
          }
          return prev + 20;
        });
      }, 300);
    }
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 2500);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Knowledge Vault</h1>
            <p className="text-gray-500 text-sm mt-1">Manage what your AI knows and how it speaks.</p>
         </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        {/* Left Column - Configuration */}
        <div className="xl:w-1/3 space-y-6">
            
            {/* Vibe Selection */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-card">
                <h3 className="text-gray-900 font-bold text-base mb-4 flex items-center gap-2">
                    <Zap size={18} className="text-primary-600" />
                    AI Vibe & Tone
                </h3>
                <div className="grid grid-cols-1 gap-3">
                    <button 
                        onClick={() => setVibe('casual')}
                        className={`relative flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 group ${
                            vibe === 'casual' 
                            ? 'border-primary-500 bg-primary-50/50 ring-1 ring-primary-500/20' 
                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        <div className={`p-3 rounded-lg ${vibe === 'casual' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
                            <Coffee size={20} />
                        </div>
                        <div>
                            <span className={`block font-bold text-sm ${vibe === 'casual' ? 'text-primary-900' : 'text-gray-900'}`}>Chilled & Casual</span>
                            <span className="text-xs text-gray-500">Friendly, emojis allowed.</span>
                        </div>
                        {vibe === 'casual' && <CheckCircle2 size={18} className="absolute top-4 right-4 text-primary-600" />}
                    </button>

                    <button 
                        onClick={() => setVibe('formal')}
                        className={`relative flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 group ${
                            vibe === 'formal' 
                            ? 'border-purple-500 bg-purple-50/50 ring-1 ring-purple-500/20' 
                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        <div className={`p-3 rounded-lg ${vibe === 'formal' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                            <Briefcase size={20} />
                        </div>
                        <div>
                            <span className={`block font-bold text-sm ${vibe === 'formal' ? 'text-purple-900' : 'text-gray-900'}`}>Polite & Formal</span>
                            <span className="text-xs text-gray-500">Professional, no slang.</span>
                        </div>
                        {vibe === 'formal' && <CheckCircle2 size={18} className="absolute top-4 right-4 text-purple-600" />}
                    </button>

                    <button 
                        onClick={() => setVibe('direct')}
                        className={`relative flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 group ${
                            vibe === 'direct' 
                            ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/20' 
                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        <div className={`p-3 rounded-lg ${vibe === 'direct' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                            <Zap size={20} />
                        </div>
                        <div>
                            <span className={`block font-bold text-sm ${vibe === 'direct' ? 'text-blue-900' : 'text-gray-900'}`}>Fast & Direct</span>
                            <span className="text-xs text-gray-500">Concise, info-focused.</span>
                        </div>
                        {vibe === 'direct' && <CheckCircle2 size={18} className="absolute top-4 right-4 text-blue-600" />}
                    </button>
                </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-card">
                <h3 className="text-gray-900 font-bold text-base mb-2">Special Instructions</h3>
                <p className="text-gray-500 text-xs mb-4">Add temporary overrides (e.g., broken elevator).</p>
                <div className="relative">
                    <textarea 
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="e.g. Tell guests the elevator is broken today..."
                        className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none placeholder:text-gray-400"
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400 pointer-events-none">
                        {instructions.length} chars
                    </div>
                </div>
            </div>

            <button 
                onClick={handleSync}
                disabled={isSyncing}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSyncing ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Syncing Neural Network...
                    </>
                ) : (
                    <>
                        <Zap size={20} fill="currentColor" />
                        Update AI Brain
                    </>
                )}
            </button>
        </div>

        {/* Right Column - Files */}
        <div className="flex-1">
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-card flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-gray-900 font-bold text-lg">Knowledge Sources</h3>
                        <p className="text-xs text-gray-500 mt-1">Supports PDF, DOCX, JPG (Menus, Flyers)</p>
                    </div>
                </div>

                {/* Upload Zone */}
                <div className="relative group border-2 border-dashed border-gray-200 hover:border-primary-400 hover:bg-primary-50/30 rounded-2xl p-8 transition-all duration-300 text-center mb-8">
                    <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <div className="flex flex-col items-center justify-center gap-3">
                        <div className="p-4 bg-primary-50 text-primary-600 rounded-full group-hover:scale-110 transition-transform duration-300">
                            <FileUp size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500 mt-1">Maximum file size 10MB</p>
                        </div>
                    </div>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="absolute inset-x-8 bottom-8">
                             <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-primary-600 h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* File List */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Indexed Documents</h4>
                    {files.map(file => (
                        <div key={file.id} className="group p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between hover:border-primary-100 hover:shadow-md hover:shadow-primary-900/5 transition-all duration-200">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm ${
                                    file.type.includes('pdf') ? 'bg-red-50 text-red-600 border-red-100' :
                                    file.type.includes('word') ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                    'bg-gray-50 text-gray-600 border-gray-100'
                                }`}>
                                    <FileText size={22} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{file.name}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-gray-400">{file.size}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        <div className="flex items-center gap-1.5">
                                            {file.status === 'indexed' && <CheckCircle2 size={12} className="text-emerald-500" />}
                                            {file.status === 'processing' && <div className="w-2 h-2 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>}
                                            <span className={`text-xs font-medium ${
                                                file.status === 'indexed' ? 'text-emerald-600' : 
                                                file.status === 'processing' ? 'text-amber-600' : 
                                                'text-red-600'
                                            }`}>
                                                {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button 
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                                onClick={() => setFiles(files.filter(f => f.id !== file.id))}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;