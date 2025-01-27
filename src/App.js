import { Amplify } from '@aws-amplify/core';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsconfig from './aws-exports';
import React, { useState, useEffect } from 'react';
import './App.css';
import 'semantic-ui-less/semantic.less';
import Ccp from './components/ccp';
 
// Component
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
 
  // Initialize Amazon Connect CCP
  const initializeCCP = () => {
    if (window.connect) {
      window.connect.core.initCCP(document.getElementById("ccp-container"), {
        ccpUrl: "https://synaptis-ai.my.connect.aws/connect/ccp-v2/",  // Replace with the correct CCP URL
        loginPopup: false,  // Set to true if you want login via a popup
        softphone: { allowFramedSoftphone: true },  // Allows softphone within iframe
        region: "us-east-1"  // Replace with your AWS region
      });
 
      // Listen for Agent State Changes
      window.connect.agent((agent) => {
        console.log("Agent is now:", agent.getState().name);
        agent.onStateChange((state) => {
          console.log("New agent state:", state.newState);
        });
      });
    } else {
      console.error("Amazon Connect Streams API not loaded.");
    }
  };
 
  return (
<div className="main-container">
      {/* Left section for Amazon Connect Agent Workspace */}
<div className="agent-workspace">
<div id="agent-workspace"></div>
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
