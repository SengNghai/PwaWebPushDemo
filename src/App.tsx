import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import NotificationBadge from './components/NotificationBadge';
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [notificationCount, setNotificationCount] = useState(0);

  const handleNotification = () => {
    setNotificationCount(notificationCount + 1);
  };

  /*
  {
  publicKey: 'BGcX_gocys7cT-vwBT7dJGd5L_tugespkugwm2cIaz0y0dBvoOU8VZb_JYgiaSpkVZJe46dtDwx37Y1idtCr01c',
  privateKey: '8NP8ZMI4LUWaSYcBtPVFEjjy8zuXIxKvvYUfhWH1iVg'
}
  */
  const NEXT_PUBLIC_VAPID_PUBLIC_KEY = 'BGcX_gocys7cT-vwBT7dJGd5L_tugespkugwm2cIaz0y0dBvoOU8VZb_JYgiaSpkVZJe46dtDwx37Y1idtCr01c'
  const VAPID_PRIVATE_KEY = '8NP8ZMI4LUWaSYcBtPVFEjjy8zuXIxKvvYUfhWH1iVg'

  const unsubscribeUser = async () => {
    const swRegistration = await navigator.serviceWorker.ready;
    const subscription = await swRegistration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      console.log('用户已取消订阅');
    }
  };
  

  const subscribeUser = async () => {
    const swRegistration = await navigator.serviceWorker.ready;
    const subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: NEXT_PUBLIC_VAPID_PUBLIC_KEY
    });
    console.log('用户已订阅：', JSON.stringify(subscription));
    // 将订阅对象发送到后端服务器
    await fetch('http://localhost:9898/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };


  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await unsubscribeUser();
      await subscribeUser();
    }
  };

  useEffect(() => {
    const storedCount = localStorage.getItem('notificationCount');
    if (storedCount) {
      setNotificationCount(parseInt(storedCount));
    }
  }, []);

 

  return (
    <>
      <header className="App-header">
        <h1>PWA 推送通知演示</h1>
        {/* <NotificationBadge count={notificationCount} /> */}
        <button onClick={requestNotificationPermission}>
          启用通知
        </button>
      </header>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
