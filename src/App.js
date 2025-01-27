import { Amplify } from '@aws-amplify/core';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsconfig from './aws-exports';
import React, { useState, useEffect } from 'react';
import './App.css';
import 'semantic-ui-less/semantic.less';

// Main Component
function App({ signOut, user }) {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    configureAuth(); // Configure Amplify Authentication
    initializeCCP(); // Initialize Amazon Connect CCP
  }, []);

  // Function to configure AWS Amplify authentication
  const configureAuth = () => {
    Amplify.configure(awsconfig);
    setIsConfigured(true);
  };

  // Function to initialize Amazon Connect CCP
  const initializeCCP = () => {
    const ccpContainer = document.getElementById('ccp-container');

    if (!window.connect) {
      console.error('Amazon Connect Streams API is not loaded.');
      return;
    }

    if (ccpContainer) {
      console.log('Initializing Amazon Connect CCP...');
      window.connect.core.initCCP(ccpContainer, {
        ccpUrl: 'https://synaptis-ai.my.connect.aws/connect/ccp-v2/', // Your CCP URL
        loginPopup: false, // Prevent login popups
        region: 'eu-central-1', // Your AWS region
        softphone: {
          allowFramedSoftphone: true, // Allow iframe usage
        },
      });

      // Add event listeners to log agent state changes
      window.connect.agent((agent) => {
        console.log('Agent is now:', agent.getState().name);
        agent.onStateChange((state) => {
          console.log('New agent state:', state.newState);
        });
      });

      // Add event listener for new contacts
      window.connect.contact((contact) => {
        console.log('New contact initiated:', contact);
        contact.onAccepted(() => console.log('Contact accepted'));
        contact.onEnded(() => console.log('Contact ended'));
      });
    } else {
      console.error('CCP container element not found.');
    }
  };

  return (
    <div className="main-container">
      {/* CCP Container */}
      <div id="ccp-container" className="ccp-container"></div>

      {/* Other Content */}
      <div className="content">
        <h1>Welcome, {user.username}</h1>
        <button onClick={signOut}>Sign Out</button>
      </div>
    </div>
  );
}

export default withAuthenticator(App);
