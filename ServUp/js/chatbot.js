document.addEventListener('DOMContentLoaded', () => {
    console.log('Chatbot DOMContentLoaded: Script starting.'); // Debug log

    const chatIcon = document.getElementById('chatIcon');
    const chatWindow = document.getElementById('chatWindow');
    const closeChatBtn = document.getElementById('closeChat');
    const chatMessagesContainer = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendChatButton = document.getElementById('sendChatButton');

    if (!chatIcon || !chatWindow || !closeChatBtn || !chatMessagesContainer || !chatInput || !sendChatButton) {
        console.error('Chatbot CRITICAL: One or more UI elements were not found. Chatbot will not initialize. Please check IDs in HTML and JS.');
        console.log('chatIcon:', chatIcon);
        console.log('chatWindow:', chatWindow);
        console.log('closeChatBtn:', closeChatBtn);
        console.log('chatMessagesContainer:', chatMessagesContainer);
        console.log('chatInput:', chatInput);
        console.log('sendChatButton:', sendChatButton);
        return;
    }

    console.log('Chatbot DOMContentLoaded: All chat UI elements found. Attaching listeners.', { chatIcon, chatWindow }); // Debug log
    
    chatIcon.addEventListener('click', () => {
        console.log('Chatbot Event: chatIcon clicked!'); // Log click
        chatWindow.classList.toggle('open');
        if (chatWindow.classList.contains('open')) {
            console.log('Chatbot State: chatWindow toggled to OPEN.'); // Log state
            chatInput.focus();
            scrollToBottom();
        } else {
            console.log('Chatbot State: chatWindow toggled to CLOSED.'); // Log state
        }
    });

    closeChatBtn.addEventListener('click', () => {
        console.log('Chatbot Event: closeChatBtn clicked!'); // Log click
        chatWindow.classList.remove('open');
        console.log('Chatbot State: chatWindow explicitly CLOSED.'); // Log state
    });

    sendChatButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage === '') return;

        console.log('Chatbot Action: Sending message - User:', userMessage); // Log message sending

        addMessageToChat(userMessage, 'user');
        chatInput.value = '';

        // Show typing indicator
        const typingIndicatorId = 'typing-' + Date.now();
        addMessageToChat('ServUp Assistant est en train d\'écrire...', 'bot-typing', typingIndicatorId);
        console.log('Chatbot UI: Typing indicator shown.');

        // Process and get bot response
        const botResponse = getBotResponse(userMessage);
        setTimeout(() => { // Simulate bot thinking time
            removeMessageById(typingIndicatorId); // Remove typing indicator
            addMessageToChat(botResponse, 'bot');
            console.log('Chatbot Action: Bot response added - Bot:', botResponse);
        }, 1000);
    }

    function addMessageToChat(message, sender, messageId = null) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);
        if (messageId) {
            messageElement.id = messageId;
        }
        
        const paragraphElement = document.createElement('p');
        paragraphElement.textContent = message;
        messageElement.appendChild(paragraphElement);
        
        chatMessagesContainer.appendChild(messageElement);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    function removeMessageById(idToRemove) {
        const messageToRemove = document.getElementById(idToRemove);
        if (messageToRemove && messageToRemove.parentNode === chatMessagesContainer) {
            chatMessagesContainer.removeChild(messageToRemove);
        }
    }

    function getBotResponse(userInput) {
        const lowerInput = userInput.toLowerCase();

        if (lowerInput.includes('bonjour') || lowerInput.includes('salut') || lowerInput.includes('hello') || lowerInput.includes('hi')) {
            return 'Bonjour! En quoi puis-je vous aider?';
        }
        if (lowerInput.includes('comment ajouter stock') || lowerInput.includes('ajouter un produit')) {
            return 'Pour ajouter un produit au stock, allez à la page "Stocks" et cliquez sur le bouton "Ajouter Produit".';
        }
        if (lowerInput.includes('voir les rapports') || lowerInput.includes('rapports')) {
            return 'Vous pouvez consulter les rapports et analyses sur la page "Rapports".';
        }
        if (lowerInput.includes('qu\'est-ce que servup') || lowerInput.includes('servup c\'est quoi')) {
            return 'ServUp est une application qui aide les restaurateurs à gérer leurs stocks, commandes et l\'organisation de leur établissement.';
        }
        if (lowerInput.includes('aide') || lowerInput.includes('support')) {
            return 'Je peux vous aider avec des questions sur l\'utilisation de ServUp. Essayez de me demander comment ajouter un produit, changer de thème, ou gérer les employés, par exemple.';
        }
        if (lowerInput.includes('merci')) {
            return 'De rien! N\'hésitez pas si vous avez d\'autres questions.';
        }
        if (lowerInput.includes('changer mot de passe') || lowerInput.includes('modifier mdp')) {
            return 'Vous pouvez changer votre mot de passe (simulation) dans la section "Paramètres".';
        }
        if (lowerInput.includes('déconnexion') || lowerInput.includes('déconnecter') || lowerInput.includes('logout')) {
            return 'Pour vous déconnecter, cliquez sur le bouton "Déconnexion" en haut à droite de la barre de navigation.';
        }
        if (lowerInput.includes('gérer employés') || lowerInput.includes('ajouter employé')) {
            return 'La gestion des employés se fait sur la page "Employés". Vous pouvez y ajouter, modifier ou supprimer des employés si vous avez les droits.';
        }
        if (lowerInput.includes('gérer commandes') || lowerInput.includes('ajouter commande') || lowerInput.includes('modifier statut commande')) {
            return 'Les commandes sont gérées sur la page "Commandes". Vous pouvez y ajouter des commandes ou modifier leur statut.';
        }
        if (lowerInput.includes('dark mode') || lowerInput.includes('thème sombre') || lowerInput.includes('changer thème')) {
            return 'Vous pouvez activer ou désactiver le mode sombre dans les "Paramètres", sous la section Préférences.';
        }
        if (lowerInput.includes('où suis-je') || lowerInput.includes('quelle page')) {
            // More advanced: window.location.pathname could be parsed, but for a simple bot:
            return 'Je suis un assistant virtuel au sein de l\'application ServUp. Le titre de la page devrait vous indiquer où vous êtes!';
        }
        if (lowerInput.includes('au revoir') || lowerInput.includes('bye') || lowerInput.includes('quitter')) {
            return 'Au revoir! N\'hésitez pas à me solliciter de nouveau.';
        }

        return 'Désolé, je ne suis pas sûr de comprendre. Pouvez-vous reformuler votre question? Vous pouvez me demander "aide" pour voir ce que je peux faire.';
    }
}); 