import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Code2, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { EVENT_CONFIG } from '../../config/event';
import { cseaStats } from '../../data/content';

export const AboutCsea: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const cseaParagraphs = [
    "The Computer Science and Engineering Association (CSEA) of PSG College of Technology is a student-driven professional body that aims to enhance the technical knowledge, leadership qualities, and overall development of Computer Science and Engineering students.",

    "CSEA serves as a platform for students to explore emerging technologies, share knowledge, and develop skills beyond the classroom curriculum. The association organizes various technical events such as workshops, coding competitions, hackathons, seminars, guest lectures, and industrial interactions.",

    "In addition to technical activities, CSEA also focuses on soft skill development, teamwork, and leadership through cultural events, quizzes, and outreach programs.",

    "By encouraging innovation, collaboration, and continuous learning, CSEA bridges the gap between academic learning and real-world applications, helping students prepare for careers in industry, research, and entrepreneurship.",
  ];

  return (
    <Card className="h-full flex flex-col justify-between space-y-6">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-3 text-[var(--accent)]">
            <Code2 className="w-7 h-7 shrink-0" />
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              About CSEA – Computer Science and Engineering Association
            </h3>
          </div>
          <a
            href={EVENT_CONFIG.organizerWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-secondary)] hover:bg-[var(--accent-muted)] border border-[var(--border-color)] hover:border-[var(--accent)] text-[13px] font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] rounded-lg transition-colors shrink-0"
          >
            <span>Visit CSEA website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Paragraphs with spacing 14px and leading 1.7 */}
        <div className="space-y-4 text-[15px] text-[var(--text-primary)]/85 dark:text-zinc-300 leading-[1.7]">
          {/* Always show first 2 paragraphs */}
          <p>{cseaParagraphs[0]}</p>
          <p>{cseaParagraphs[1]}</p>

          {/* Desktop shows all 4; Mobile toggles 3 & 4 */}
          <div className={`${isExpanded ? 'block' : 'hidden sm:block'} space-y-4`}>
            <p>{cseaParagraphs[2]}</p>
            <p>{cseaParagraphs[3]}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        {/* Mobile Toggle Button */}
        <div className="sm:hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] hover:underline focus:outline-none"
          >
            <span>{isExpanded ? 'Show less' : 'Read more'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Stat Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {cseaStats.map((stat, idx) => (
            <div key={idx} className="p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] text-center">
              <span className="block text-xl font-bold text-[var(--accent)] font-mono">{stat.value}</span>
              <span className="block text-[12px] text-[var(--text-secondary)] font-medium mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
