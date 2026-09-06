import { CalculateWorkbench } from "@/components/CalculateWorkbench";
import { IntroSection } from "@/components/IntroSection";
import { MOCK_RECOGNITION } from "@/lib/recognition/mock";

export default function CalculatePage() {
  return (
    <>
      <IntroSection specimen={MOCK_RECOGNITION} />
      <CalculateWorkbench />
    </>
  );
}
