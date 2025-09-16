const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
      manifestUrl: 'https://phenomenal-bubblegum-d6b71e.netlify.app/tonconnect-manifest.json',
      buttonRootId: 'ton-connect-button'
    });

    const recipientAddress = "EQDYXMQCS9pzb_9oFiJjV97si_kNZwh0TU-0UtmFG-bHlqGf";

    async function sendTon() {
      const amount = parseFloat(document.getElementById('topupAmount').value);
      const statusEl = document.getElementById('status');

      if (!amount || amount < 0.01) {
        statusEl.textContent = '❌ Введите сумму от 0.01 TON';
        return;
      }

      const wallet = tonConnectUI.wallet;
      if (!wallet || !wallet.account?.address) {
        statusEl.textContent = '❌ Кошелёк не подключён';
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

        // Обновляем локальный баланс
        const currentBalance = parseFloat(localStorage.getItem('balance')) || 0;
        const newBalance = parseFloat((currentBalance + amount).toFixed(2));
        localStorage.setItem('balance', newBalance);

        statusEl.textContent = `✅ Пополнено на ${amount.toFixed(2)} TON. Новый баланс: ${newBalance.toFixed(2)} TON`;
        document.getElementById('topupAmount').value = '';
      } catch (e) {
        statusEl.textContent = '❌ Ошибка при отправке TON';
        console.error(e);
      }
    }
