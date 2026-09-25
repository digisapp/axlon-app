import { describe, it, expect } from 'vitest';
import { linkify } from '@/lib/linkify';
import { cleanListingDescription } from '@/lib/listings/clean-description';

describe('linkify', () => {
  it('turns bare marketplace listing URLs into short internal links', () => {
    const tokens = linkify('2021 XL60 $31,499\naxleyard.com/listing/402db49c-99f8-4da9-9a1a-2d0af9ced2d8\n');
    expect(tokens).toEqual([
      { type: 'text', value: '2021 XL60 $31,499\n' },
      { type: 'link', href: '/listing/402db49c-99f8-4da9-9a1a-2d0af9ced2d8', label: 'View listing', internal: true },
      { type: 'text', value: '\n' },
    ]);
  });

  it('handles scheme, www and catalog URLs, keeping trailing punctuation as text', () => {
    const tokens = linkify('See https://www.axleyard.com/new-trailers/fontaine/renegade-20c.');
    expect(tokens[1]).toEqual({ type: 'link', href: '/new-trailers/fontaine/renegade-20c', label: 'View specs', internal: true });
    expect(tokens[2]).toEqual({ type: 'text', value: '.' });
  });

  it('keeps markdown link labels and treats other hosts as external', () => {
    const tokens = linkify('[Trail King site](https://trailking.com/products) and (axleyard.com/search?q=lowboy)');
    expect(tokens[0]).toEqual({ type: 'link', href: 'https://trailking.com/products', label: 'Trail King site', internal: false });
    expect(tokens[2]).toEqual({ type: 'link', href: '/search?q=lowboy', label: 'axleyard.com/search', internal: true });
    expect(tokens[3]).toEqual({ type: 'text', value: ')' });
  });

  it('leaves text without links untouched', () => {
    expect(linkify('Call (469) 421-3536 for axle weights.')).toEqual([
      { type: 'text', value: 'Call (469) 421-3536 for axle weights.' },
    ]);
  });
});

describe('cleanListingDescription', () => {
  it('drops a description that is only a scraped contact form', () => {
    const junk = 'Name(Required)\n \n \n First\n \n Last\n \n Company Name Email(Required)\n \n PhoneQuestions/Comments';
    expect(cleanListingDescription(junk)).toBeNull();
  });

  it('cuts a contact form appended to real copy', () => {
    expect(cleanListingDescription('Clean 53ft reefer, new tires.\nName (Required) First Last Email (Required)')).toBe(
      'Clean 53ft reefer, new tires.'
    );
  });

  it('keeps normal descriptions', () => {
    expect(cleanListingDescription('Phone us about this unit. Name brand axles.')).toBe('Phone us about this unit. Name brand axles.');
    expect(cleanListingDescription(null)).toBeNull();
  });
});
