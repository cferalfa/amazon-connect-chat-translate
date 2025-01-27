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
  }, []);

  const configureAuth = () => {
    Amplify.configure(awsconfig);
    setIsConfigured(true);
  };

  return (
    <div className="main-container">
      {/* Left section for Agent Workspace */}
      <div className="agent-workspace">
        <iframe
          src="https://synaptis-ai.my.connect.aws/agent-app-v2" // Replace with the correct Agent Workspace URL
          title="Agent Workspace"
          className="agent-workspace-iframe"
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
