import { Amplify } from '@aws-amplify/core';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsconfig from './aws-exports';
import React, { useState, useEffect } from 'react';
import './App.css';
import 'semantic-ui-less/semantic.less';
import Ccp from './components/ccp';
 
function App({ signOut, user }) {
  const [isConfigured, setIsConfigured] = useState(false);
 
  useEffect(() => {
    configureAuth();
    initializeCCP();
  }, []);
 
  // Configure Amplify Authentication
  const configureAuth = () => {
    Amplify.configure(awsconfig);
    setIsConfigured(true);
  };
 
  // Initialize Amazon Connect CCP safely
  const initializeCCP = () => {
    const ccpContainer = document.getElementById("ccp-container");
 
    if (!window.connect) {
      console.error("Amazon Connect Streams API not loaded.");
      return;
    }
 
    if (ccpContainer) {
      console.log("Initializing Amazon Connect CCP...");
      window.connect.core.initCCP(ccpContainer, {
        ccpUrl: "https://synaptis-ai.my.connect.aws/connect/ccp-v2/", 
        loginPopup: false,
        softphone: { allowFramedSoftphone: true },
        region: "eu-central-1"
      });
 
      // Listen for Agent State Changes
      window.connect.agent((agent) => {
        console.log("Agent is now:", agent.getState().name);
        agent.onStateChange((state) => {
          console.log("New agent state:", state.newState);
        });
      });
 
    } else {
      console.error("CCP container not found.");
    }
  };
 
  return (
<div className="main-container">
      {/* Left section for Amazon Connect Agent Workspace */}
<div className="agent-workspace">
<iframe 
    src="https://synaptis-ai.my.connect.aws/agent-app-v2/" 
    title="Agent Workspace"
    className="agent-workspace-iframe"
    sandbox="allow-same-origin allow-scripts allow-forms allow-modals"
></iframe>
</div>
 
      {/* Right section for CCP and Translate */}
<div className="right-section">
        {isConfigured && (
<>
            {/* CCP container */}
<div id="ccp-container"></div>
 
            {/* Translate Box */}
<div id="translate-box">
<Ccp user={user} signOut={signOut} />
</div>
</>
        )}
</div>
</div>
  );
}
 
export default withAuthenticator(App);
