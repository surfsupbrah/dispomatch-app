export function formatLastUpdated(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    
    // Convert to EST
    const estOptions = { timeZone: 'America/New_York' };
    const estDate = new Intl.DateTimeFormat('en-US', {
      ...estOptions,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
    
    const monthDay = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
    
    const year = date.getFullYear();
    
    return `Last updated: ${estDate} EST, ${monthDay} ${year}`;
  }