import { Amplify } from '@aws-amplify/core';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsconfig from './aws-exports';
import React, { useState, useEffect } from 'react';
import './App.css';
import Ccp from './components/ccp';

// Component
function App({ signOut, user }) {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    configureAuth();
    initializeCCP();
  }, []);

  // Configure AWS Amplify
  const configureAuth = () => {
    Amplify.configure(awsconfig);
    setIsConfigured(true);
  };

  // Initialize Amazon Connect CCP
  const initializeCCP = () => {
    const ccpContainer = document.getElementById('ccp-container');

    if (!window.connect) {
      console.error('Amazon Connect Streams API not loaded.');
      return;
    }

    if (ccpContainer) {
      window.connect.core.initCCP(ccpContainer, {
        ccpUrl: 'https://synaptis-ai.my.connect.aws/connect/ccp-v2/',
        loginPopup: false,
        softphone: { allowFramedSoftphone: true },
        region: 'eu-central-1',
      });

      // Listen for agent state changes
      window.connect.agent((agent) => {
        console.log('Agent state:', agent.getState().name);
        agent.onStateChange((state) => {
          console.log('Agent new state:', state.newState);
        });
      });

      // Error handling for postMessage issues
      window.addEventListener('message', (event) => {
        if (event.origin !== 'https://synaptis-ai.my.connect.aws') {
          console.warn('Message from unauthorized origin:', event.origin);
          return;
        }
        console.log('Message from CCP:', event.data);
      });
    } else {
      console.error('CCP container not found.');
    }
  };

  return (
    <div className="main-container">
      {/* Left: Agent Workspace */}
      <div className="agent-workspace">
        <iframe
          src="https://synaptis-ai.my.connect.aws/agent-app-v2/"
          title="Agent Workspace"
          className="agent-workspace-iframe"
        ></iframe>
      </div>

      {/* Right: CCP and Translate */}
      <div className="right-section">
        {isConfigured && (
          <>
            {/* CCP Container */}
            <div id="ccp-container" style={{ height: '500px', paddingTop: '15px', paddingLeft: '15px', width: '330px' }}></div>

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
