import { Amplify } from '@aws-amplify/core';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsconfig from './aws-exports';
import React, { useState, useEffect } from 'react';
import './App.css';
import 'semantic-ui-less/semantic.less';
import connect from 'amazon-connect-streams';

// Component
function App({ signOut, user }) {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    configureAuth();
    initializeCCP(); // Initialize the CCP
  }, []);

  const configureAuth = () => {
    Amplify.configure(awsconfig);
    setIsConfigured(true);
  };

  const initializeCCP = () => {
    const ccpContainer = document.getElementById('ccp-container');

    if (!ccpContainer) {
      console.error('CCP container not found.');
      return;
    }

    // Initialize Amazon Connect CCP
    connect.core.initCCP(ccpContainer, {
      ccpUrl: 'https://synaptis-ai.my.connect.aws/ccp-v2', // Replace <YOUR_INSTANCE_ALIAS> with your instance alias
      loginPopup: true, // Set to true to enable login popup
      softphone: {
        allowFramedSoftphone: true, // Allows softphone to be embedded in an iframe
      },
    });

    // Add agent state listener
    connect.agent((agent) => {
      console.log('Agent initialized:', agent);
      agent.onStateChange((state) => {
        console.log('Agent state changed:', state.newState);
      });
    });

    // Add contact event listener
    connect.contact((contact) => {
      console.log('New contact:', contact);
      contact.onAccepted(() => {
        console.log('Contact accepted');
      });
      contact.onEnded(() => {
        console.log('Contact ended');
      });
    });
  };

  return (
    <div className="App">
      {isConfigured && (
        <>
          <div id="ccp-container" style={{ width: '330px', height: '500px', paddingTop: '15px', paddingLeft: '15px' }}></div>
          <Ccp user={user} signOut={signOut} />
        </>
      )}
    </div>
  );
}

export default withAuthenticator(App);
