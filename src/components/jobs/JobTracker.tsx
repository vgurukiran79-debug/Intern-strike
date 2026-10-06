import React, { useState } from 'react';
import { InternshipApplication, ApplicationStatus, WorkMode } from '../../types';
import { 
  Plus, 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  ChevronRight, 
  CheckCircle2,
  AlertCircle,
  Briefcase
} from 'lucide-react';

interface JobTrackerProps {
  applications: InternshipApplication[];
  onSaveApplication: (app: InternshipApplication, isNew: boolean) => void;
  onDeleteApplication: (id: string) => void;
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
}

const STATUS_COLUMNS: { id: ApplicationStatus; title: string; color: string }[] = [
  { id: 'SAVED', title: 'SAVED', color: 'border-slate-700 text-slate-400' },
  { id: 'APPLIED', title: 'APPLIED', color: 'border-blue-500/40 text-blue-400' },
  { id: 'SHORTLISTED', title: 'SHORTLISTED', color: 'border-purple-500/40 text-purple-400' },
  { id: 'INTERVIEW', title: 'INTERVIEW', color: 'border-amber-500/40 text-amber-400' },
  { id: 'OFFER', title: 'OFFER', color: 'border-emerald-500/40 text-emerald-400' },
  { id: 'REJECTED', title: 'REJECTED', color: 'border-rose-500/40 text-rose-400' },
];

export const JobTracker: React.FC<JobTrackerProps> = ({
  applications,
  onSaveApplication,
  onDeleteApplication,
  onUpdateStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedApp, setSelectedApp] = useState<InternshipApplication | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<InternshipApplication>>({});

  const filteredApps = applications.filter((app) => {
    const q = searchQuery.toLowerCase();
    return (
      app.company.toLowerCase().includes(q) ||
      app.role.toLowerCase().includes(q) ||
      app.location.toLowerCase().includes(q) ||
      app.status.toLowerCase().includes(q)
    );
  });

  const handleOpenNew = () => {
    setFormData({
      company: '',
      role: '',
      location: 'Bengaluru, Karnataka',
      workMode: 'Hybrid',
      status: 'SAVED',
      appliedDate: new Date().toISOString().split('T')[0],
      deadline: '',
      interviewDate: '',
      followUpDate: '',
      jobUrl: '',
      recruiterName: '',
      recruiterContact: '',
      notes: '',
      resumeVersion: '',
      stipend: '',
    });
    setIsNew(true);
    setIsEditing(true);
  };

  const handleOpenEdit = (app: InternshipApplication) => {
    setFormData(app);
    setIsNew(false);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.role) return;

    const savedApp: InternshipApplication = {
      id: formData.id || `app-${Date.now()}`,
      company: formData.company || 'Company',
      role: formData.role || 'AI/ML Intern',
      location: formData.location || 'Bengaluru',
      workMode: (formData.workMode as WorkMode) || 'Hybrid',
      status: (formData.status as ApplicationStatus) || 'SAVED',
      appliedDate: formData.appliedDate || new Date().toISOString().split('T')[0],
      deadline: formData.deadline,
      interviewDate: formData.interviewDate,
      followUpDate: formData.followUpDate,
      jobUrl: formData.jobUrl,
      recruiterName: formData.recruiterName,
      recruiterContact: formData.recruiterContact,
      notes: formData.notes,
      resumeVersion: formData.resumeVersion,
      stipend: formData.stipend,
    };

    onSaveApplication(savedApp, isNew);
    setIsEditing(false);
    setSelectedApp(savedApp);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">💼</span>
            <h1 className="text-xl md:text-2xl font-extrabold text-white font-mono tracking-tight">
              INTERNSHIP TRACKER
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Track applications from Saved to Offer. Applications yield +20 strikes, Interviews +30 strikes.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company, role..."
              className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-44 md:w-56"
            />
          </div>

          {/* Add Application Button */}
          <button
            onClick={handleOpenNew}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider rounded-xl shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Role</span>
          </button>
        </div>
      </div>

      {/* Empty State Banner if no applications yet */}
      {applications.length === 0 && (
        <div className="p-8 rounded-3xl bg-[#0a0e17] border border-cyan-500/30 text-center max-w-xl mx-auto space-y-4 my-2 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-2xl">
            💼
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-mono">
              Your internship journey starts here.
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              No applications tracked yet. Start tracking your pipeline from Saved to Applied and Interview rounds to earn strikes.
            </p>
          </div>
          <button
            onClick={handleOpenNew}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider rounded-xl shadow-lg shadow-cyan-500/20"
          >
            + ADD FIRST APPLICATION
          </button>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {STATUS_COLUMNS.map((column) => {
          const colApps = filteredApps.filter((a) => a.status === column.id);

          return (
            <div
              key={column.id}
              className="flex flex-col rounded-2xl bg-[#090d15] border border-slate-800/80 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold ${column.color}`}>
                    {column.title}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full">
                    {colApps.length}
                  </span>
                </div>
              </div>

              {/* Column Cards */}
              <div className="flex-1 p-2 space-y-2.5 overflow-y-auto">
                {colApps.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-center p-3 text-slate-600 border border-dashed border-slate-800/60 rounded-xl">
                    <span className="text-xs">No roles in {column.title.toLowerCase()}</span>
                  </div>
                ) : (
                  colApps.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] group text-left"
                    >
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                          {app.company}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400">
                          {app.workMode}
                        </span>
                      </div>

                      <div className="text-xs font-medium text-slate-300 mb-2 leading-tight">
                        {app.role}
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-2 font-mono">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{app.location}</span>
                      </div>

                      {app.interviewDate && (
                        <div className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/30 flex items-center gap-1 mb-2">
                          <Clock className="w-3 h-3" />
                          <span>Interview: {new Date(app.interviewDate).toLocaleDateString()}</span>
                        </div>
                      )}

                      {/* Card Footer */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>Applied: {app.appliedDate.slice(5)}</span>
                        <select
                          value={app.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                          className="bg-slate-800 text-slate-300 text-[10px] rounded px-1.5 py-0.5 border border-slate-700 focus:outline-none focus:border-cyan-400"
                        >
                          <option value="SAVED">Saved</option>
                          <option value="APPLIED">Applied</option>
                          <option value="SHORTLISTED">Shortlisted</option>
                          <option value="INTERVIEW">Interview</option>
                          <option value="OFFER">Offer</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Application Detail View Modal */}
      {selectedApp && !isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-3xl bg-[#0a0e17] border border-cyan-500/30 p-6 md:p-8 text-left shadow-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    {selectedApp.status}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">· {selectedApp.workMode}</span>
                </div>
                <h3 className="text-2xl font-black text-white font-mono">
                  {selectedApp.company}
                </h3>
                <p className="text-sm font-semibold text-cyan-200 mt-0.5">
                  {selectedApp.role}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(selectedApp)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  title="Edit details"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete application for ${selectedApp.company}?`)) {
                      onDeleteApplication(selectedApp.id);
                      setSelectedApp(null);
                    }
                  }}
                  className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/50"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4 my-6 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block mb-1 font-mono uppercase tracking-wider">Location</span>
                  <span className="text-white font-medium">{selectedApp.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1 font-mono uppercase tracking-wider">Stipend</span>
                  <span className="text-emerald-400 font-medium font-mono">{selectedApp.stipend || 'Competitive'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1 font-mono uppercase tracking-wider">Applied Date</span>
                  <span className="text-white font-mono">{selectedApp.appliedDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1 font-mono uppercase tracking-wider">Follow-Up Target</span>
                  <span className="text-amber-400 font-mono">{selectedApp.followUpDate || 'None set'}</span>
                </div>
              </div>

              {selectedApp.interviewDate && (
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200">
                  <div className="font-bold flex items-center gap-1.5 mb-1 font-mono">
                    <Clock className="w-4 h-4" /> UPCOMING INTERVIEW
                  </div>
                  <div>Scheduled: {new Date(selectedApp.interviewDate).toLocaleString()}</div>
                </div>
              )}

              {selectedApp.recruiterName && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block mb-1 font-mono uppercase tracking-wider">Recruiter Contact</span>
                  <div className="text-white font-semibold">{selectedApp.recruiterName}</div>
                  <div className="text-slate-400 font-mono mt-0.5">{selectedApp.recruiterContact}</div>
                </div>
              )}

              {selectedApp.notes && (
                <div>
                  <span className="text-slate-400 block mb-1 font-mono uppercase tracking-wider">Notes & Prep</span>
                  <p className="text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                    {selectedApp.notes}
                  </p>
                </div>
              )}

              {selectedApp.resumeVersion && (
                <div className="text-slate-400 font-mono">
                  Resume Used: <span className="text-slate-200">{selectedApp.resumeVersion}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              {selectedApp.jobUrl ? (
                <a
                  href={selectedApp.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  <span>Visit Job Posting</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : <div />}

              <button
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add Modal Form */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <form
            onSubmit={handleSave}
            className="w-full max-w-xl rounded-3xl bg-[#0a0e17] border border-cyan-500/40 p-6 md:p-8 text-left shadow-2xl my-8"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-xl font-bold text-white font-mono">
                {isNew ? 'Track New Internship Opportunity' : 'Edit Application Details'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1 font-mono uppercase">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Foreset AI"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-mono uppercase">Role Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. AI Engineer Intern"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1 font-mono uppercase">Status</label>
                  <select
                    value={formData.status || 'SAVED'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
                  >
                    <option value="SAVED">Saved</option>
                    <option value="APPLIED">Applied</option>
                    <option value="SHORTLISTED">Shortlisted</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-mono uppercase">Work Mode</label>
                  <select
                    value={formData.workMode || 'Hybrid'}
                    onChange={(e) => setFormData({ ...formData, workMode: e.target.value as WorkMode })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-mono uppercase">Stipend</label>
                  <input
                    type="text"
                    value={formData.stipend || ''}
                    onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                    placeholder="e.g. ₹35,000 / mo"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1 font-mono uppercase">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Bengaluru (HSR Layout)"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-mono uppercase">Job Posting URL</label>
                  <input
                    type="url"
                    value={formData.jobUrl || ''}
                    onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1 font-mono uppercase">Applied Date</label>
                  <input
                    type="date"
                    value={formData.appliedDate || ''}
                    onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-mono uppercase">Interview Date</label>
                  <input
                    type="datetime-local"
                    value={formData.interviewDate || ''}
                    onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-mono uppercase">Follow-up Target</label>
                  <input
                    type="date"
                    value={formData.followUpDate || ''}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1 font-mono uppercase">Recruiter Name</label>
                  <input
                    type="text"
                    value={formData.recruiterName || ''}
                    onChange={(e) => setFormData({ ...formData, recruiterName: e.target.value })}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-mono uppercase">Recruiter Email / Contact</label>
                  <input
                    type="text"
                    value={formData.recruiterContact || ''}
                    onChange={(e) => setFormData({ ...formData, recruiterContact: e.target.value })}
                    placeholder="ananya@company.ai"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono uppercase">Notes & Tech Stack Expected</label>
                <textarea
                  rows={3}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Key topics to revise, referral contacts, specific interview expectations..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-800 mt-6">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider shadow-lg shadow-cyan-500/20"
              >
                Save Role
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
