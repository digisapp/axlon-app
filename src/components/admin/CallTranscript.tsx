/**
 * A phone call's transcript, collapsed by default. Lines arrive from the voice
 * agent as "Caller: …" / "Agent: …"; the speaker is set in bold so a long call
 * can be scanned for what the caller actually said.
 *
 * <details> rather than client state: it works in a server component and
 * needs no JavaScript.
 */
export function CallTranscript({ transcript }: { transcript: string }) {
  const lines = transcript.split('\n').filter((line) => line.trim());

  return (
    <details className="group mt-2">
      <summary className="cursor-pointer select-none text-sm text-primary hover:underline">
        <span className="group-open:hidden">Show transcript</span>
        <span className="hidden group-open:inline">Hide transcript</span>
      </summary>
      <div className="mt-2 max-h-96 space-y-1.5 overflow-y-auto rounded-md border bg-background p-3 text-sm">
        {lines.map((line, i) => {
          const match = line.match(/^(Caller|Agent):\s*(.*)$/);
          if (!match) return <p key={i}>{line}</p>;
          return (
            <p key={i}>
              <span className={match[1] === 'Caller' ? 'font-semibold' : 'font-semibold text-muted-foreground'}>
                {match[1]}:
              </span>{' '}
              {match[2]}
            </p>
          );
        })}
      </div>
    </details>
  );
}
