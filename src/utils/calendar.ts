import { CalendarEvent, XenftData, SingleMintData, CointoolMintData } from '../types';
import { CHAINS } from '../config/chains';

export function createCalendarEvents(
  xenfts: XenftData[],
  singleMints: SingleMintData[],
  cointoolMints: CointoolMintData[]
): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  // Process XenFTs
  xenfts.forEach(xenft => {
    if (xenft.maturityDateTime !== 'N/A') {
      try {
        const maturityDate = new Date(xenft.maturityDateTime);
        // Validate date
        if (!isNaN(maturityDate.getTime())) {
          const chainId = Object.values(CHAINS).find(c => c.name === xenft.chain)?.chainId;
          events.push({
            title: `XenFT Due: ${xenft.name}`,
            description: `${xenft.name} on ${xenft.chain} reaches maturity. VMUs: ${xenft.vmus}, Term: ${xenft.term}, Rank: ${xenft.cRank}`,
            start: maturityDate,
            end: new Date(maturityDate.getTime() + 60 * 60 * 1000), // 1 hour duration
            chain: xenft.chain,
            chainId,
            type: 'xenft'
          });
        }
      } catch (error) {
        console.error('Error parsing XenFT date:', xenft.maturityDateTime, error);
      }
    }
  });

  // Process Single Mints
  singleMints.forEach(mint => {
    try {
      // Validate timestamp
      if (mint.maturityTs && mint.maturityTs > 0) {
        const maturityDate = new Date(mint.maturityTs * 1000);
        if (!isNaN(maturityDate.getTime())) {
          const chainId = Object.values(CHAINS).find(c => c.name === mint.chain)?.chainId;
          events.push({
            title: `XEN Mint Due: ${mint.chain}`,
            description: `Single XEN mint on ${mint.chain} reaches maturity. Term: ${mint.term} days, Rank: ${mint.rank}, Amplifier: ${mint.amplifier}`,
            start: maturityDate,
            end: new Date(maturityDate.getTime() + 60 * 60 * 1000),
            chain: mint.chain,
            chainId,
            type: 'single'
          });
        }
      }
    } catch (error) {
      console.error('Error parsing single mint date:', mint.maturityTs, error);
    }
  });

  // Process Cointool Mints
  console.log('Processing Cointool mints in createCalendarEvents:', cointoolMints);
  cointoolMints.forEach(mint => {
    console.log('Processing Cointool mint:', mint);
    try {
      // Validate timestamp
      if (mint.maturityTs && mint.maturityTs > 0) {
        const maturityDate = new Date(mint.maturityTs * 1000);
        console.log('Cointool maturity date:', maturityDate);
        if (!isNaN(maturityDate.getTime())) {
          const event = {
            title: `CT Batch Due: ${mint.count} VMUs`,
            description: `${mint.count} VMUs mature on Ethereum. Rank: ${mint.rank}, Amplifier: ${mint.amplifier}, EAA Rate: ${mint.eaaRate}%`,
            start: maturityDate,
            end: new Date(maturityDate.getTime() + 60 * 60 * 1000),
            chain: mint.chain,
            chainId: 1, // Cointool is always on Ethereum
            type: 'cointool' as const
          };
          console.log('Adding Cointool event:', event);
          events.push(event);
        } else {
          console.log('Invalid maturity date for Cointool mint:', maturityDate);
        }
      } else {
        console.log('Invalid maturityTs for Cointool mint:', mint.maturityTs);
      }
    } catch (error) {
      console.error('Error parsing cointool mint date:', mint.maturityTs, error);
    }
  });

  // Sort events by date
  return events.sort((a, b) => a.start.getTime() - b.start.getTime());
}

export function generateICSFile(events: CalendarEvent[]): string {
  const icsEvents = events.map(event => {
    const dtstart = formatDateToICS(event.start);
    const dtend = formatDateToICS(event.end);
    const uid = `${event.type}-${event.chain}-${event.start.getTime()}@xencalendar.app`;
    
    return `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${formatDateToICS(new Date())}
DTSTART:${dtstart}
DTEND:${dtend}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
END:VEVENT`;
  }).join('\n');

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//XEN Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
${icsEvents}
END:VCALENDAR`;
}

function formatDateToICS(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function downloadICSFile(content: string, filename: string = 'xen-mints.ics'): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
} 