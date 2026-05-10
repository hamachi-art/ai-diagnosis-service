import { Box } from '@mui/material';

import { BottomCtaSection } from './components/BottomCtaSection';
import { FeaturesSection } from './components/FeaturesSection';
import { HeroSection } from './components/HeroSection';
import { SiteFooter } from './components/SiteFooter';
import { StepsSection } from './components/StepsSection';

export default function Page() {
  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
      <HeroSection />
      <FeaturesSection />
      <StepsSection />
      <BottomCtaSection />
      <SiteFooter />
    </Box>
  );
}

