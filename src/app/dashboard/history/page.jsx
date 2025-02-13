import { CONFIG } from 'src/config-global';

import { HistoryView } from 'src/sections/history';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <HistoryView />;
}
