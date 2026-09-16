'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { LeadCard } from '@/components/leads/LeadCard';
import { LeadDetailDialog } from '@/components/leads/LeadDetailDialog';
import { csrfFetch } from '@/lib/csrf-fetch';

interface Lead {
  id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone?: string;
  message?: string;
  status: string;
  priority: string;
  score?: number;
  score_factors?: {
    companyEmail?: boolean;
    hasPhone?: boolean;
    phoneMatchesState?: boolean;
    highIntentMessage?: boolean;
    aiSentiment?: string;
    aiIntent?: string;
  };
  notes?: string;
  last_contacted_at?: string;
  follow_up_date?: string;
  follow_up_note?: string;
  assigned_to?: string;
  created_at: string;
  listing?: {
    id: string;
    title: string;
    price?: number;
  } | null;
}

interface TeamMember {
  id: string;
  email: string;
  company_name?: string;
}

interface LeadKanbanProps {
  leads: Lead[];
  teamMembers?: TeamMember[];
  currentUserId?: string;
  /** Column to visually emphasize (from a ?status= deep-link). */
  highlightStatus?: string;
}

// 'lost' needs a column of its own — without it, leads marked lost disappeared
// from the board entirely (while still being counted in the page header).
const columns: { id: string; label: string; color: string; muted?: boolean }[] = [
  { id: 'new', label: 'New', color: 'bg-blue-500' },
  { id: 'contacted', label: 'Contacted', color: 'bg-yellow-500' },
  { id: 'qualified', label: 'Qualified', color: 'bg-purple-500' },
  { id: 'won', label: 'Won', color: 'bg-green-500' },
  { id: 'lost', label: 'Lost', color: 'bg-muted-foreground', muted: true },
];

export function LeadKanban({ leads: initialLeads, teamMembers = [], currentUserId, highlightStatus }: LeadKanbanProps) {
  const [leads, setLeads] = useState(initialLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNote, setFollowUpNote] = useState('');
  const [notes, setNotes] = useState('');
  const [assignedTo, setAssignedTo] = useState<string | null>(null);

  const handleOpenDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setFollowUpDate(lead.follow_up_date ? lead.follow_up_date.split('T')[0] : '');
    setFollowUpNote(lead.follow_up_note || '');
    setNotes(lead.notes || '');
    setAssignedTo(lead.assigned_to || null);
    setIsDetailOpen(true);
  };

  const saveLeadDetails = async () => {
    if (!selectedLead) return;

    setIsSaving(true);
    try {
      const response = await csrfFetch(`/api/dashboard/leads/${selectedLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes,
          // Send the date as picked: new Date('2026-09-20').toISOString() is UTC
          // midnight, which renders as the previous day west of UTC.
          follow_up_date: followUpDate || null,
          follow_up_note: followUpNote || null,
          assigned_to: assignedTo || null,
        }),
      });

      if (response.ok) {
        setLeads(prev =>
          prev.map(lead =>
            lead.id === selectedLead.id
              ? { ...lead, notes, follow_up_date: followUpDate, follow_up_note: followUpNote, assigned_to: assignedTo || undefined }
              : lead
          )
        );
        toast.success('Lead updated successfully');
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    const previousStatus = leads.find(lead => lead.id === leadId)?.status;

    setLeads(prev =>
      prev.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );

    // Roll back only this lead: resetting to initialLeads would also throw away
    // every earlier move that did succeed.
    const rollback = () => {
      if (previousStatus === undefined) return;
      setLeads(prev =>
        prev.map(lead =>
          lead.id === leadId ? { ...lead, status: previousStatus } : lead
        )
      );
    };

    try {
      const response = await csrfFetch(`/api/dashboard/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        rollback();
        toast.error('Failed to move lead');
      }
    } catch (error) {
      rollback();
      toast.error('Failed to move lead');
    }
  };

  const getLeadsByStatus = (status: string) =>
    leads.filter(lead => lead.status === status);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {columns.map(column => (
          <div key={column.id} className={`space-y-3 ${column.muted ? 'opacity-70' : ''}`}>
            <div className="flex items-center gap-2 p-2">
              <div className={`w-3 h-3 rounded-full ${column.color}`} />
              <h3 className="font-semibold">{column.label}</h3>
              <Badge variant="secondary" className="ml-auto">
                {getLeadsByStatus(column.id).length}
              </Badge>
            </div>

            <div
              className={`space-y-3 min-h-[200px] p-2 rounded-lg ${
                highlightStatus === column.id
                  ? 'bg-primary/5 ring-2 ring-primary/40'
                  : 'bg-muted/30'
              }`}
            >
              {getLeadsByStatus(column.id).map(lead => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onStatusChange={updateLeadStatus}
                  onViewDetails={() => handleOpenDetail(lead)}
                  teamMembers={teamMembers}
                />
              ))}

              {getLeadsByStatus(column.id).length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No leads
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <LeadDetailDialog
        lead={selectedLead}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        isSaving={isSaving}
        followUpDate={followUpDate}
        followUpNote={followUpNote}
        notes={notes}
        assignedTo={assignedTo}
        onFollowUpDateChange={setFollowUpDate}
        onFollowUpNoteChange={setFollowUpNote}
        onNotesChange={setNotes}
        onAssignedToChange={setAssignedTo}
        onSave={saveLeadDetails}
        teamMembers={teamMembers}
        currentUserId={currentUserId}
      />
    </>
  );
}
