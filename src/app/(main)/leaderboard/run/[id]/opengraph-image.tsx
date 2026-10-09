import { ImageResponse } from 'next/og';
import { getRun, placeName, jobName } from './run';
import { money, clock } from '../../board';

export const alt = 'A HEAVY HAUL RUSH run at Axleyard';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 3600;

const Amber = '#f5b400';

/** The share picture for a run: the grade big, the pay, the place and the load, the driver, and where to play. */
/** The game's heavy face, for the title, the grade and the pay; plain type for the rest if it cannot be had. */
async function googleFont(family: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family}`)).text();
    const url = css.match(/src: url\((https:[^)]+\.ttf)\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [run, font, body] = await Promise.all([getRun(id), googleFont('Archivo+Black'), googleFont('Poppins:wght@600')]);
  const H = font ? 'Archivo Black' : 'sans-serif';
  const site = process.env.NEXT_PUBLIC_APP_URL || 'https://axleyard.com';
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #0b0b0d 0%, #1c1a12 55%, #0b0b0d 100%)', color: '#fff', fontFamily: body ? 'Poppins' : 'sans-serif', padding: '56px 64px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 14, background: Amber, display: 'flex' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <img src={`${site}/play/axlon-face.png`} width={96} height={112} alt="" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 22, letterSpacing: 6, color: Amber, fontWeight: 700 }}>AXLON PRESENTS</div>
            <div style={{ fontSize: 64, fontFamily: H, lineHeight: 1.05 }}>HEAVY HAUL RUSH</div>
          </div>
        </div>
        {run ? (
          <div style={{ display: 'flex', marginTop: 40, gap: 48, alignItems: 'center' }}>
            <div style={{ width: 210, height: 210, borderRadius: 18, background: Amber, color: '#000', fontSize: 160, fontFamily: H, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{run.grade}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 88, fontFamily: H, color: '#4ee07a', lineHeight: 1.05 }}>{money(run.pay)}</div>
              <div style={{ fontSize: 40, fontWeight: 700 }}>{`${placeName(run)}  ·  ${jobName(run)}`}</div>
              <div style={{ fontSize: 32, color: '#cfcfcf' }}>{`${clock(Number(run.time_seconds))}  ·  ${run.hits === 0 ? 'no hits' : `${run.hits} hit${run.hits === 1 ? '' : 's'}`}${run.beat_storm ? '  ·  beat the storm' : ''}`}</div>
              <div style={{ fontSize: 34, marginTop: 6, display: 'flex' }}>{`${run.driver}${run.verified ? ' ✓' : ''}${run.company ? `  ·  ${run.company}` : ''}`}</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', marginTop: 70, fontSize: 56, fontWeight: 800 }}>Get the load there before the storm does.</div>
        )}
        <div style={{ position: 'absolute', left: 64, right: 64, bottom: 40, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 40, fontFamily: H, color: Amber, display: 'flex' }}>Beat it free at AXLEYARD.COM/PLAY</div>
          <div style={{ fontSize: 22, color: '#9a9a9a', display: 'flex' }}>no download · on a phone or a computer</div>
        </div>
      </div>
    ),
    { ...size, fonts: [
      ...(body ? [{ name: 'Poppins', data: body, style: 'normal' as const, weight: 600 as const }] : []),
      ...(font ? [{ name: 'Archivo Black', data: font, style: 'normal' as const, weight: 400 as const }] : []),
    ] },
  );
}
