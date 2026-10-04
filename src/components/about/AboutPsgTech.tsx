import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '../common/Badge';

export const AboutPsgTech: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const psgChips = [
    'Est. 1951',
    '21 UG + 24 PG programmes',
    'ARIIA 2021: Rank 2',
    'G20 Outreach: 1 of 75 institutions',
  ];

  const psgParagraphs = [
    "PSG College of Technology (PSG CT), established in 1951 by PSG & Sons' Charities, is a premier engineering institution known for academic excellence and industry-focused education. The college offers 21 undergraduate and 24 postgraduate programmes in Engineering, Technology, Computer Applications, and Applied Sciences.",

    "PSG Tech houses advanced Centers of Excellence such as the TIFAC Core, Virtual Reality Centre, and Nano-tool Centre, and operates in-campus manufacturing units. The institution maintains strong industry and research collaborations, promoting innovation and practical learning.",

    "PSG CT has received several national recognitions, including 2nd rank in ARIIA 2021 and the AICTE–CII Best Industry-Linked Institute Award (2012). During India's G20 Presidency in 2022, the college was selected among 75 institutions nationwide for academic and cultural outreach.",

    "With a strong alumni network in leadership roles across government and corporate sectors, PSG Tech continues to contribute significantly to technical education and national development.",
  ];

  return (
    <Card className="h-full flex flex-col justify-between space-y-6">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3 text-[var(--accent)] border-b border-[var(--border-color)] pb-3">
          <Building2 className="w-7 h-7 shrink-0" />
          <h3 className="text-xl font-bold text-[var(--text-primary)]">About PSG College of Technology</h3>
        </div>

        {/* Highlight Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {psgChips.map((chip, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="text-xs font-semibold px-2.5 py-1 bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)]"
            >
              {chip}
            </Badge>
          ))}
        </div>

        {/* Paragraphs with spacing 14px and leading 1.7 */}
        <div className="space-y-4 text-[15px] text-[var(--text-primary)]/85 dark:text-zinc-300 leading-[1.7]">
          {/* Always show first 2 paragraphs */}
          <p>{psgParagraphs[0]}</p>
          <p>{psgParagraphs[1]}</p>

          {/* Desktop shows all 4; Mobile toggles 3 & 4 */}
          <div className={`${isExpanded ? 'block' : 'hidden sm:block'} space-y-4`}>
            <p>{psgParagraphs[2]}</p>
            <p>{psgParagraphs[3]}</p>
          </div>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <div className="sm:hidden pt-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] hover:underline focus:outline-none"
        >
          <span>{isExpanded ? 'Show less' : 'Read more'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
    </Card>
  );
};
