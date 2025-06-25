describe('Chat Application', () => {
  // Test data matching your new schema
  const testUser = {
    _id: 'user123',
    displayName: 'Test User',
    profilePic: '/test-user.jpg',
    status: 'online'
  };

  const testContact = {
    _id: 'contact456',
    displayName: 'John Smith',
    profilePic: '/john-smith.jpg',
    status: 'offline'
  };

  const testChat = {
    _id: 'chat789',
    participant1: testUser._id,
    participant2: testContact._id,
    lastMessage: null,
    unreadCount: 0
  };

  const testMessages = [
    {
      _id: 'msg1',
      chat: testChat._id,
      sender: testContact._id,
      text: 'Hey there!',
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      _id: 'msg2',
      chat: testChat._id,
      sender: testUser._id,
      text: 'Hi John!',
      read: true,
      createdAt: new Date(Date.now() - 1800000).toISOString()
    }
  ];

  beforeEach(() => {
    // Mock API responses
    cy.intercept('GET', 'http://localhost:3001/users/me', {
      statusCode: 200,
      body: testUser
    }).as('getCurrentUser');

    cy.intercept('GET', 'http://localhost:3001/chats', {
      statusCode: 200,
      body: [{
        ...testChat,
        participant1: testUser,
        participant2: testContact,
        lastMessage: testMessages[1]
      }]
    }).as('getChats');

    cy.intercept('GET', `http://localhost:3001/messages/${testChat._id}`, {
      statusCode: 200,
      body: testMessages
    }).as('getMessages');

    // Mock socket.io connection
    cy.visit('/messages', {
      onBeforeLoad(win) {
        win.socket = {
          emit: cy.stub().as('socketEmit'),
          on: cy.stub().as('socketOn')
        };
      }
    });

    cy.wait('@getCurrentUser');
    cy.wait('@getChats');
  });

  describe('Initial Load', () => {
    it('should display the chat list with contacts', () => {
      cy.get('[data-testid="chat-list"]').should('be.visible');
      cy.get('[data-testid="chat-item"]').should('have.length', 1);
      cy.contains('[data-testid="chat-item"]', testContact.displayName).should('be.visible');
      cy.contains('[data-testid="last-message"]', testMessages[1].text).should('be.visible');
    });
  });

  describe('Chat Selection', () => {
    it('should load and display chat messages', () => {
      cy.get('[data-testid="chat-item"]').first().click();
      cy.wait('@getMessages');
      
      cy.get('[data-testid="chat-window"]').should('be.visible');
      cy.get('[data-testid="message"]').should('have.length', 2);
      cy.contains('[data-testid="message"]', testMessages[0].text).should('be.visible');
      
      // Verify mark as read was called
      cy.intercept('POST', `http://localhost:3001/chats/${testChat._id}/read`).as('markRead');
      cy.wait('@markRead');
    });
  });

  describe('Message Functionality', () => {
    beforeEach(() => {
      cy.get('[data-testid="chat-item"]').first().click();
      cy.wait('@getMessages');
    });

    it('should send a message', () => {
      const testMessage = 'New test message';
      
      cy.intercept('POST', 'http://localhost:3001/messages/send', {
        statusCode: 201,
        body: {
          _id: 'newmsg',
          chat: testChat._id,
          sender: testUser._id,
          text: testMessage,
          createdAt: new Date().toISOString()
        }
      }).as('sendMessage');
      
      // Test optimistic UI update
      cy.get('[data-testid="message-input"]').type(testMessage);
      cy.get('[data-testid="send-button"]').click();
      
      // Verify message appears immediately
      cy.contains('[data-testid="message"]', testMessage).should('be.visible');
      
      // Verify API call
      cy.wait('@sendMessage').its('request.body').should('deep.equal', {
        chatId: testChat._id,
        text: testMessage,
        sender: testUser._id
      });
      
      // Verify socket emission
      cy.get('@socketEmit').should('have.been.calledWith', 'send-message', {
        chatId: testChat._id,
        text: testMessage,
        sender: testUser._id
      });
    });

    it('should receive a message via socket.io', () => {
      const newMessage = {
        chatId: testChat._id,
        text: 'New received message',
        sender: testContact._id
      };
      
      // Trigger socket.io event
      cy.window().then(win => {
        win.socket.on.args.forEach(([event, callback]) => {
          if (event === 'receive-message') {
            callback(newMessage);
          }
        });
      });
      
      // Verify message appears
      cy.contains('[data-testid="message"]', newMessage.text).should('be.visible');
      
      // Verify unread count updates
      cy.get('[data-testid="unread-count"]').should('contain', '1');
    });
  });

  describe('User Status', () => {
    it('should display online status', () => {
      cy.get('[data-testid="chat-item"]').first().within(() => {
        cy.get('[data-testid="user-status"]').should('have.class', 'online');
      });
    });
  });
});