import React, { useState } from 'react';
import { FileText, Globe, Download, Printer, Copy, Check, ExternalLink, Monitor, Smartphone } from 'lucide-react';
import { PitchRecord } from '../types';
import { getPitchSiteUrl } from '../api';

interface DeliverablesHubProps {
  pitch: PitchRecord;
}

export const DeliverablesHub: React.FC<DeliverablesHubProps> = ({ pitch }) => {
  const [activeTab, setActiveTab] = useState<'report' | 'website'>('report');
  const [copied, setCopied] = useState(false);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  const reportMd = pitch.boardroom_report_md || '';
  const siteUrl = getPitchSiteUrl(pitch.id);

  const handleCopyReport = () => {
    navigator.clipboard.writeText(reportMd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    if (!pitch.pitch_site_html) return;
    const blob = new Blob([pitch.pitch_site_html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pitch.idea.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-pitch.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMd = () => {
    if (!reportMd) return;
    const blob = new Blob([reportMd], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pitch.idea.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-boardroom-report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-12">
      {/* Top Deliverables Header & Tabs */}
      <div className="border-b border-slate-200 bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider block mb-1">
            Deliverables Hub
          </span>
          <h2 className="text-lg font-bold">Synchronized Venture Deliverables</h2>
        </div>

        {/* Tab Selection */}
        <div className="flex rounded-lg bg-slate-800 p-1 border border-slate-700">
          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-all flex items-center space-x-2 ${
              activeTab === 'report'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Boardroom Report</span>
          </button>
          <button
            onClick={() => setActiveTab('website')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-all flex items-center space-x-2 ${
              activeTab === 'website'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Static Pitch Website</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Boardroom Report */}
      {activeTab === 'report' && (
        <div className="p-6">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
            <div className="text-xs text-slate-500">
              Format: <strong>Structured Markdown</strong> &bull; Complete analytical audit log
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyReport}
                className="text-xs px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center space-x-1.5 font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="text-xs px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center space-x-1.5 font-medium transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print / Save PDF</span>
              </button>
              <button
                onClick={handleDownloadMd}
                className="text-xs px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-1.5 font-medium shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report (.md)</span>
              </button>
            </div>
          </div>

          {/* Rendered Markdown Viewer */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 font-mono text-xs text-slate-800 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[600px] overflow-y-auto">
            {reportMd}
          </div>
        </div>
      )}

      {/* Tab 2: Static Pitch Website */}
      {activeTab === 'website' && (
        <div className="p-6">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
            {/* Device Switcher */}
            <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`p-1.5 rounded transition-all ${
                  deviceMode === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Desktop Viewport"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`p-1.5 rounded transition-all ${
                  deviceMode === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Mobile Viewport"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Downloads & External Link */}
            <div className="flex items-center space-x-2">
              <a
                href={siteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center space-x-1.5 font-medium transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>Open in Tab</span>
              </a>
              <button
                onClick={handleDownloadHtml}
                className="text-xs px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-1.5 font-medium shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Standalone Site (.html)</span>
              </button>
            </div>
          </div>

          {/* Iframe Preview Container */}
          <div className="bg-slate-900 rounded-xl p-4 flex justify-center shadow-inner overflow-hidden">
            <div
              className={`bg-white rounded-lg overflow-hidden transition-all duration-300 shadow-2xl ${
                deviceMode === 'mobile' ? 'w-[375px] h-[667px]' : 'w-full h-[650px]'
              }`}
            >
              <iframe
                src={siteUrl}
                title="Static Pitch Website Preview"
                className="w-full h-full border-0"
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-3">
            Genuinely standalone single-file HTML &bull; 100% embedded CSS &bull; Zero external CDN dependencies
          </p>
        </div>
      )}
    </div>
  );
};
