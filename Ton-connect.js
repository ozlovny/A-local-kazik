
    const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
      manifestUrl: 'https://phenomenal-bubblegum-d6b71e.netlify.app/tonconnect-manifest.json',
      buttonRootId: 'ton-connect-button'
    });

    const recipientAddress = "EQDYXMQCS9pzb_9oFiJjV97si_kNZwh0TU-0UtmFG-bHlqGf";
    let balance = parseInt(localStorage.getItem('balance')) || 0;

    function updateBalance() {
      document.getElementById('balance').textContent = `Баланс: ${balance} Ton`;
      localStorage.setItem('balance', balance);
    }

    async function sendTon() {
      const amount = parseInt(document.getElementById('topupAmount').value);
      if (!amount || amount < 1) return;

      const wallet = tonConnectUI.wallet;
      if (!wallet) {
        alert('❌ Кошелёк не подключен');
        return;
      }

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [
          {
            address: recipientAddress,
            amount: (amount * 1e9).toString()
          }
        ]
      };

      try {
        await tonConnectUI.sendTransaction(transaction);
        balance += amount;
        updateBalance();
        alert(`✅ Пополнено на ${amount} TON`);
        document.getElementById('topupAmount').value = '';
      } catch (e) {
        alert('❌ Ошибка при отправке TON');
        console.error(e);
      }
    }

    updateBalance();
