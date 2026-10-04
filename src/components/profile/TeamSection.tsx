import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Input } from '../common/Input';
import { HackathonTeam } from '../../types/user';
import { Users, Crown, Plus, Copy, Check } from 'lucide-react';

interface TeamSectionProps {
  team?: HackathonTeam;
  onCreateTeam: (name: string) => void;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ team, onCreateTeam }) => {
  const [newTeamName, setNewTeamName] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleCopyCode = () => {
    if (team?.code) {
      navigator.clipboard.writeText(team.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeamName.trim()) {
      onCreateTeam(newTeamName.trim());
      setIsCreating(false);
    }
  };

  if (!team) {
    return (
      <Card className="space-y-4">
        <div className="flex items-center gap-3 text-[var(--text-primary)]">
          <Users className="w-6 h-6 text-[var(--accent)]" />
          <h3 className="text-xl font-bold">Hackathon Team</h3>
        </div>
        <p className="text-[15px] text-[var(--text-secondary)]">
          You are currently not part of any registered team. Create a team or ask your leader for a join code.
        </p>

        {isCreating ? (
          <form onSubmit={handleCreate} className="space-y-3 pt-2">
            <Input
              label="Team Name"
              placeholder="e.g., CyberPunks 50"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <Button type="submit" variant="primary" size="sm">
                Create Team
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button variant="primary" size="sm" onClick={() => setIsCreating(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Create New Team
          </Button>
        )}
      </Card>
    );
  }

  return (
    <Card className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <span className="text-[13px] text-[var(--text-secondary)] uppercase font-semibold">Registered Team</span>
          <h3 className="text-xl font-bold text-[var(--text-primary)]">{team.name}</h3>
        </div>
        <div className="flex items-center gap-2 bg-[var(--bg-secondary)] px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-[13px] font-mono">
          <span className="text-[var(--text-secondary)]">Join Code:</span>
          <span className="text-[var(--accent)] font-bold">{team.code}</span>
          <button
            onClick={handleCopyCode}
            className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            aria-label="Copy team code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[var(--accent)]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-[13px] text-[var(--text-secondary)] font-medium">
          <span>Team Members ({team.members.length} / {team.maxMembers})</span>
          <span>Max Capacity: 4</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {team.members.map((member) => (
            <div
              key={member.id}
              className="p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] flex items-center justify-between text-[13px]"
            >
              <div className="space-y-0.5">
                <span className="font-semibold text-[var(--text-primary)] block">{member.name}</span>
                <span className="text-[12px] text-[var(--text-secondary)] block">{member.email}</span>
              </div>
              {member.role === 'Leader' ? (
                <Badge variant="warning" className="text-[11px]">
                  <Crown className="w-3 h-3 mr-1 inline text-[var(--gold)]" /> Team Leader
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-[11px]">Member</Badge>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
