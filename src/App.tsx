import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import { QuickAccessSection } from "./components/quick-access-section";
import { WorkflowStepper } from "./components/workflow-stepper";
import { Button } from "./components/ui/button";

export default function App() {
  const [activeTab, setActiveTab] = useState("automation");
  const [showStepper, setShowStepper] = useState(false);
  const [debugEmptyState, setDebugEmptyState] = useState(false);

  // Reset stepper when debug state changes
  const handleDebugToggle = () => {
    setShowStepper(false);
    setDebugEmptyState(!debugEmptyState);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {" "}
      {/* Changed from eggshell to gray-50 */}
      {/* Dark Blue Navbar */}
      <nav className="bg-[#1e3a8a] text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="bg-transparent border-b border-blue-300/20 h-auto p-0 rounded-none">
                <TabsTrigger
                  value="insights"
                  className="bg-transparent text-blue-100 data-[state=active]:bg-blue-600/30 data-[state=active]:text-white border-b-2 border-transparent data-[state=active]:border-white rounded-none px-6 py-3"
                >
                  Insights
                </TabsTrigger>
                <TabsTrigger
                  value="automation"
                  className="bg-transparent text-blue-100 data-[state=active]:bg-blue-600/30 data-[state=active]:text-white border-b-2 border-transparent data-[state=active]:border-white rounded-none px-6 py-3"
                >
                  Automation
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Debug Toggle */}
            <div className="ml-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDebugToggle}
                className="bg-blue-700 border-blue-500 text-white hover:bg-blue-600 hover:border-blue-400"
              >
                Debug:{" "}
                {debugEmptyState
                  ? "With Data"
                  : "With Empty State"}
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="insights" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm p-8 min-h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">
                Insights dashboard coming soon...
              </p>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="mt-0">
            {showStepper ? (
              <WorkflowStepper
                onClose={() => setShowStepper(false)}
              />
            ) : (
              <QuickAccessSection
                onCreateNew={() => setShowStepper(true)}
                debugEmptyState={debugEmptyState}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}