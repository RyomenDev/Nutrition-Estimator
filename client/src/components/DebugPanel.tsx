
import { useState } from "react";
import { Button } from "@/components/ui/button";

type DebugPanelProps = {
  requestData: any;
  responseData: any;
};

const DebugPanel = ({ requestData, responseData }: DebugPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8 border border-dashed border-indian-brown/20 rounded-xl p-4 bg-indian-cream/50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-indian-brown">Debug Panel</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm border-indian-turmeric text-indian-turmeric hover:bg-indian-turmeric/10"
        >
          {isOpen ? "Hide" : "Show"} Raw Data
        </Button>
      </div>
      
      {isOpen && (
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="font-medium mb-2">Request:</h4>
            <pre className="bg-white p-3 rounded-lg text-sm overflow-x-auto">
              {JSON.stringify(requestData, null, 2)}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Response:</h4>
            <pre className="bg-white p-3 rounded-lg text-sm overflow-x-auto">
              {JSON.stringify(responseData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;
