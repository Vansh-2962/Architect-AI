import { useState, useEffect } from 'react';
import { Timer, GraduationCap, CheckCircle2, Circle, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { INTERVIEW_QUESTIONS } from '@/lib/mock-data';
import { cx } from '@/lib/helpers';

const STEPS = [
  'Requirements',
  'Capacity Estimation',
  'Architecture',
  'Database',
  'Scalability',
  'Failure Handling',
  'Trade-offs',
];

export function InterviewMode() {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleNextStep = () => {
    if (stepIdx < STEPS.length - 1) {
      setThinking(true);
      setAiFeedback(null);
      setTimeout(() => {
        setThinking(false);
        setAiFeedback(`Good progress on ${STEPS[stepIdx]}. Consider also discussing edge cases and operational concerns. Let's move to ${STEPS[stepIdx + 1]}.`);
        setStepIdx((s) => s + 1);
      }, 1500);
    } else {
      setCompleted(true);
    }
  };

  const handleNextQuestion = () => {
    setQuestionIdx((i) => (i + 1) % INTERVIEW_QUESTIONS.length);
    setStepIdx(0);
    setCompleted(false);
    setAiFeedback(null);
    setSeconds(0);
  };

  if (completed) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-[700px] mx-auto px-6 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap size={16} className="text-[var(--accent-primary)]" strokeWidth={1.8} />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">INTERVIEW SUMMARY</span>
            </div>
            <h1 className="text-[24px] font-bold tracking-tight text-[var(--text-primary)] mb-2">Engineering Review</h1>
            <p className="font-mono text-[11px] text-[var(--text-muted)]">Question 0{questionIdx + 1} · Completed in {formatTime(seconds)}</p>
          </div>

          {/* Step evaluation */}
          <div className="border border-[var(--border-subtle)] mb-6">
            {STEPS.map((step, i) => (
              <div
                key={step}
                className={cx(
                  'flex items-center gap-3 px-4 py-3',
                  i > 0 && 'border-t border-[var(--border-subtle)]'
                )}
              >
                <CheckCircle2 size={15} className="text-[var(--accent-primary)] shrink-0" strokeWidth={1.8} />
                <span className="text-[13px] font-medium text-[var(--text-primary)] flex-1">{step}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Covered</span>
              </div>
            ))}
          </div>

          {/* AI evaluation */}
          <div className="border border-dashed border-[var(--accent-primary)] p-4 bg-[var(--accent-subtle)] mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={13} className="text-[var(--accent-primary)]" strokeWidth={1.8} />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-primary)] font-semibold">AI Reviewer Notes</span>
            </div>
            <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed mb-3">
              The candidate demonstrated solid understanding of distributed systems concepts. Architecture was well-reasoned with appropriate technology choices. Capacity estimation was thorough and backed by clear calculations.
            </p>
            <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-2">Areas to explore next:</div>
            <ul className="space-y-1">
              {['Consistent hashing for cache distribution', 'Database partitioning strategies', 'Rate limiting at API gateway level', 'Multi-region write conflict resolution'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-[12px] text-[var(--text-secondary)]">
                  <span className="w-1 h-1 bg-[var(--accent-primary)] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleNextQuestion}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--accent-primary)] text-white font-medium text-[12px] hover:brightness-110 transition-all"
          >
            <span>Next Question</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[800px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap size={14} className="text-[var(--accent-primary)]" strokeWidth={1.8} />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">SYSTEM DESIGN INTERVIEW</span>
            </div>
            <h1 className="text-[20px] font-bold tracking-tight text-[var(--text-primary)]">Question {String(questionIdx + 1).padStart(2, '0')} / {String(INTERVIEW_QUESTIONS.length).padStart(2, '0')}</h1>
          </div>
          <div className="flex items-center gap-2 border border-[var(--border-default)] px-3 py-2 bg-[var(--bg-elevated)]">
            <Timer size={15} className="text-[var(--accent-primary)]" strokeWidth={1.8} />
            <span className="font-mono text-[16px] font-semibold text-[var(--text-primary)]">{formatTime(seconds)}</span>
          </div>
        </div>

        {/* Question */}
        <div className="border border-dashed border-[var(--accent-primary)] p-5 bg-[var(--accent-subtle)] mb-6">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-primary)] mb-2 font-semibold">AI INTERVIEWER</div>
          <p className="text-[16px] text-[var(--text-primary)] leading-relaxed font-medium">
            {INTERVIEW_QUESTIONS[questionIdx]}
          </p>
        </div>

        {/* Progress steps */}
        <div className="mb-6">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-3">Interview Progress</div>
          <div className="flex items-center gap-1">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-1 flex-1">
                <button
                  onClick={() => setStepIdx(i)}
                  className="flex items-center gap-1.5 flex-1 min-w-0"
                >
                  {i <= stepIdx ? (
                    <CheckCircle2 size={14} className="text-[var(--accent-primary)] shrink-0" strokeWidth={1.8} />
                  ) : (
                    <Circle size={14} className="text-[var(--border-strong)] shrink-0" strokeWidth={1.5} />
                  )}
                  <span className={cx(
                    'font-mono text-[9px] uppercase tracking-wider truncate hidden sm:inline',
                    i <= stepIdx ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'
                  )}>{step}</span>
                </button>
                {i < STEPS.length - 1 && <span className="h-px w-2 bg-[var(--border-subtle)] shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* Current step content */}
        <div className="border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-primary)] font-semibold">
              STEP {String(stepIdx + 1).padStart(2, '0')} — {STEPS[stepIdx]}
            </span>
          </div>
          <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed mb-4">
            {stepIdx === 0 && "Start by identifying functional and non-functional requirements. What does the system need to do? What are the scale and performance constraints?"}
            {stepIdx === 1 && "Estimate the capacity requirements. Calculate DAU, RPS, storage, and bandwidth based on the problem constraints."}
            {stepIdx === 2 && "Design the high-level architecture. Draw the main components and their interactions. Think about data flow."}
            {stepIdx === 3 && "Design the database schema. What tables do you need? How are they related? What indexes will you create?"}
            {stepIdx === 4 && "How would you scale this system? Think about caching, sharding, load balancing, and CDN strategies."}
            {stepIdx === 5 && "What happens when components fail? Design for resilience. Think about circuit breakers, fallbacks, and redundancy."}
            {stepIdx === 6 && "Discuss the key trade-offs in your design. Why did you choose certain technologies over alternatives?"}
          </p>

          <textarea
            placeholder="Type your answer here..."
            rows={5}
            className="w-full bg-[var(--bg-base)] border border-[var(--border-default)] outline-none px-3 py-2 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none focus:border-[var(--accent-primary)] transition-colors"
          />
        </div>

        {/* AI Feedback */}
        {thinking && (
          <div className="flex items-center gap-2 mb-4 animate-fade-in">
            <Loader2 size={13} className="animate-spin text-[var(--accent-primary)]" />
            <span className="font-mono text-[11px] text-[var(--text-muted)]">AI reviewer is evaluating your response...</span>
          </div>
        )}
        {aiFeedback && !thinking && (
          <div className="border border-dashed border-[var(--border-default)] p-3 mb-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={12} className="text-[var(--accent-primary)]" strokeWidth={1.8} />
              <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--accent-primary)] font-semibold">AI FEEDBACK</span>
            </div>
            <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">{aiFeedback}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleNextStep}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--accent-primary)] text-white font-medium text-[12px] hover:brightness-110 transition-all"
          >
            <span>{stepIdx === STEPS.length - 1 ? 'Complete Interview' : 'Next Step'}</span>
            <ArrowRight size={14} />
          </button>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">
            Step {stepIdx + 1} of {STEPS.length}
          </span>
        </div>
      </div>
    </div>
  );
}
