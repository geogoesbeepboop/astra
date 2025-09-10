import React, { useState } from "react";
import { QuickAccessSection } from "../../components/quick-access-section";
import { WorkflowStepper } from "./components/WorkflowStepper";
import { TriggerJobsProps } from "../../types";

export function TriggerJobs({ debugEmptyState = false }: TriggerJobsProps) {
  const [showStepper, setShowStepper] = useState(false);

  return (
    <div className="w-full">
      {showStepper ? (
        <WorkflowStepper onClose={() => setShowStepper(false)} />
      ) : (
        <QuickAccessSection
          onCreateNew={() => setShowStepper(true)}
          debugEmptyState={debugEmptyState}
        />
      )}
    </div>
  );
}