import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { User } from '../../types/auth';
import { Edit3, Mail, Phone, Building, GraduationCap } from 'lucide-react';

interface PersonalDetailsProps {
  user: User;
  onEdit: () => void;
}

export const PersonalDetails: React.FC<PersonalDetailsProps> = ({ user, onEdit }) => {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[var(--accent-muted)] border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] font-bold text-lg font-mono">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">{user.name}</h3>
            <span className="text-[13px] text-[var(--text-secondary)] font-mono">{user.id}</span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit} leftIcon={<Edit3 className="w-4 h-4" />}>
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] text-[var(--text-secondary)]">
        <div className="flex items-center gap-2.5">
          <Mail className="w-4 h-4 text-[var(--accent)] shrink-0" />
          <span><strong className="text-[var(--text-primary)]">Email:</strong> {user.email}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Phone className="w-4 h-4 text-[var(--accent)] shrink-0" />
          <span><strong className="text-[var(--text-primary)]">Phone:</strong> {user.phone}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Building className="w-4 h-4 text-[var(--accent)] shrink-0" />
          <span><strong className="text-[var(--text-primary)]">College:</strong> {user.college}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <GraduationCap className="w-4 h-4 text-[var(--accent)] shrink-0" />
          <span><strong className="text-[var(--text-primary)]">Dept & Year:</strong> {user.department} ({user.year})</span>
        </div>
      </div>
    </Card>
  );
};
