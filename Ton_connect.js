const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
      manifestUrl: 'https://phenomenal-bubblegum-d6b71e.netlify.app/tonconnect-manifest.json',
      buttonRootId: 'ton-connect-button'
    });

    const recipientAddress = "EQDYXMQCS9pzb_9oFiJjV97si_kNZwh0TU-0UtmFG-bHlqGf";

async function checkPendingTopUp() {
  const pending = parseFloat(localStorage.getItem('pendingTopUp'));
  if (!pending || pending < 0.01) return;

  if (!tonConnectUI.wallet?.account?.address) {
    alert("❌ Кошелёк не подключён");
    return;
  }

  const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 60,
    messages: [
      {
        address: recipientAddress,
        amount: (pending * 1e9).toString()
      }
    ]
  };

  try {
    await tonConnectUI.sendTransaction(transaction);
    const currentBalance = parseFloat(localStorage.getItem('balance')) || 0;
    const newBalance = parseFloat((currentBalance + pending).toFixed(2));
    localStorage.setItem('balance', newBalance);
    localStorage.removeItem('pendingTopUp');
    alert(`✅ Пополнено на ${pending} TON`);
    updateBalance();
  } catch (e) {
    alert("❌ Ошибка при отправке TON");
    console.error(e);
  }
}

checkPendingTopUp();
