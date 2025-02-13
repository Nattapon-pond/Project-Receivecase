import { CONFIG } from 'src/config-global';

import AnalyticsView from 'src/sections/Analytics/components/view/AnalyticsRePort';


// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <AnalyticsView />;
}
