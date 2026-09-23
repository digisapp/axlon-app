import { Zap, MessageSquare, Phone, Check, X } from 'lucide-react';
import { TryAxlonLive } from '@/components/home/TryAxlonLive';

/**
 * The live call/chat demo, the two conversation mock-ups and the listing-site
 * comparison. Moved off the homepage (Sep 2026): its traffic is buyers, and
 * dealers are reached by calls and email that land here.
 */
export function AiSalesTeamShowcase() {
  return (
    <>
      {/* AXLON in action */}
      <section className="w-full max-w-5xl mx-auto mb-10 md:mb-16 px-4">
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
            <Zap className="w-3 h-3" />
            See it in action
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Your AI-powered sales team</h2>
          <p className="text-sm md:text-base text-muted-foreground dark:text-foreground/60 max-w-xl mx-auto">
            AXLON, Axleyard&apos;s AI assistant, answers every call, chat, and lead for your
            dealership — day and night — and turns them into pipeline.
          </p>
        </div>

        {/* Live demo first: a real phone line beats any transcript */}
        <TryAxlonLive />

        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
          {/* AI Conversation Demo */}
          <div className="rounded-xl border bg-white/80 dark:bg-white/[0.08] p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">AI Sales Assistant</p>
                <p className="text-xs text-muted-foreground dark:text-foreground/50">Handles buyer inquiries 24/7</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-end">
                <div className="bg-primary/10 rounded-2xl rounded-tr-md px-4 py-2.5 max-w-[85%]">
                  <p className="text-sm">Do you have any lowboy trailers under $100k?</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[85%]">
                  <p className="text-sm">Yes! We have 3 right now. Best deal: <strong>2023 Trail King TK110HDG</strong> — 55-ton, hydraulic detachable, $92,500. Want specs and photos?</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-primary/10 rounded-2xl rounded-tr-md px-4 py-2.5 max-w-[85%]">
                  <p className="text-sm">Yes please. Can someone call me today?</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[85%]">
                  <p className="text-sm">Absolutely. What&apos;s the best number? I&apos;ll have a salesperson call you today with photos and details.</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t">
              <p className="text-xs text-muted-foreground dark:text-foreground/50 text-center">Lead qualified and sent to your team — automatically</p>
            </div>
          </div>

          {/* Voice Agent Demo */}
          <div className="rounded-xl border bg-white/80 dark:bg-white/[0.08] p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Phone className="w-4 h-4 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm font-semibold">Voice Agent</p>
                <p className="text-xs text-muted-foreground dark:text-foreground/50">Answers calls like a real person</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-muted/50 rounded-xl p-4 space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5">AXLON:</span>
                  <p className="text-muted-foreground dark:text-foreground/70">&quot;Thanks for calling ABC Truck Sales. How can I help you?&quot;</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold text-foreground/70 dark:text-foreground/80 shrink-0 mt-0.5">Caller:</span>
                  <p className="text-muted-foreground dark:text-foreground/70">&quot;I&apos;m looking for a 48-foot flatbed under $55k.&quot;</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5">AXLON:</span>
                  <p className="text-muted-foreground dark:text-foreground/70">&quot;We have two in that range. Let me get your info so I can send details with photos and pricing.&quot;</p>
                </div>
              </div>

              <div className="bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900/30 rounded-lg p-3">
                <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 mb-1.5">Lead Captured</p>
                <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground dark:text-foreground/60">
                  <span>Name: John D.</span>
                  <span>Intent: High</span>
                  <span>Looking for: Flatbed 48&apos;</span>
                  <span>Budget: &lt;$55k</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t">
              <p className="text-xs text-muted-foreground dark:text-foreground/50 text-center">This call came in at 8:47 PM — after hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Axleyard Different — compares against a generic listing
          site rather than naming competitors whose features we can't vouch for */}
      <section className="w-full max-w-2xl mx-auto mb-6 md:mb-10 px-4">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-2">What Makes Axleyard Different</h2>
        <p className="text-sm text-muted-foreground dark:text-foreground/60 text-center mb-6 max-w-lg mx-auto">
          A listing site gets your inventory seen. Axleyard also answers the calls and chats it brings in.
        </p>
        <div className="rounded-xl border bg-white/80 dark:bg-white/[0.08] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left py-3 px-3 sm:px-4 font-medium text-muted-foreground">Feature</th>
                <th className="text-center py-3 px-2 sm:px-4 font-bold text-primary w-20 sm:w-32">Axleyard</th>
                <th className="text-center py-3 px-2 sm:px-4 font-medium text-muted-foreground w-20 sm:w-32">Typical listing site</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { feature: 'List your equipment for buyers', listingSite: true },
                { feature: 'Built for trucks, trailers & equipment', listingSite: true },
                { feature: 'AI voice agent answers calls 24/7', listingSite: false },
                { feature: 'AI chat answers buyers on your listings', listingSite: false },
                { feature: 'AI lead capture & qualification', listingSite: false },
                { feature: 'Built-in CRM & deal desk', listingSite: false },
              ].map((row) => (
                <tr key={row.feature}>
                  <td className="py-2.5 px-3 sm:px-4 text-foreground/80 dark:text-foreground/70">{row.feature}</td>
                  <td className="py-2.5 px-2 sm:px-4 text-center">
                    <Check className="w-4.5 h-4.5 text-primary mx-auto" aria-label="Yes" />
                  </td>
                  <td className="py-2.5 px-2 sm:px-4 text-center">
                    {row.listingSite ? (
                      <Check className="w-4 h-4 text-muted-foreground/50 mx-auto" aria-label="Yes" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground/30 mx-auto" aria-label="No" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground dark:text-foreground/50 text-center mt-3">
          Purpose-built for heavy haul, crane &amp; rigging, and equipment businesses.
        </p>
      </section>
    </>
  );
}
