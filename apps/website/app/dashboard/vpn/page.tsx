'use client';

import { useState, useEffect } from 'react';
import { getToken } from '../auth';
import QRCode from 'qrcode';

const VPN_API_URL = process.env.NEXT_PUBLIC_VPN_API_URL || 'http://localhost:3000';

async function vpnApi(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${VPN_API_URL}/api/vpn${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка');
  return data;
}

export default function VpnPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingDevice, setAddingDevice] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const [showQr, setShowQr] = useState<string | null>(null);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const data = await vpnApi('/devices');
      setDevices(data.devices);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addDevice = async () => {
    if (!deviceName.trim()) return;
    setAddingDevice(true);
    try {
      await vpnApi('/devices', {
        method: 'POST',
        body: JSON.stringify({ name: deviceName }),
      });
      setDeviceName('');
      await loadDevices();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setAddingDevice(false);
    }
  };

  const showQrCode = async (deviceId: string) => {
    if (qrCodes[deviceId]) {
      setShowQr(deviceId);
      return;
    }
    try {
      const data = await vpnApi(`/devices/${deviceId}/qr`);
      const qr = await QRCode.toDataURL(data.config, { width: 300, margin: 2 });
      setQrCodes((prev) => ({ ...prev, [deviceId]: qr }));
      setShowQr(deviceId);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const deleteDevice = async (deviceId: string) => {
    if (!confirm('Удалить устройство?')) return;
    try {
      await vpnApi(`/devices/${deviceId}`, { method: 'DELETE' });
      await loadDevices();
    } catch (e: any) {
      alert(e.message);
    }
  };

const subscribe = async (deviceId: string, plan: string, billingType: string) => {
  setSubscribing(deviceId);
  try {
    const token = getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscription/vpn-device`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ deviceId, plan, billingType }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка');
    alert(data.data.message);
    await loadDevices();
  } catch (e: any) {
    alert(e.message);
  } finally {
    setSubscribing(null);
  }
};

  const getStatus = (device: any) => {
    const now = new Date();
    if (device.subscriptionEndsAt && new Date(device.subscriptionEndsAt) > now) {
      return { text: 'Активна', color: '#22c55e', active: true };
    }
    if (device.trialEndsAt && new Date(device.trialEndsAt) > now) {
      const days = Math.ceil((new Date(device.trialEndsAt).getTime() - now.getTime()) / 86400000);
      return { text: `Trial: ${days} дн.`, color: '#f59e0b', active: true };
    }
    return { text: 'Истекла', color: '#ef4444', active: false };
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ color: '#a1a1aa' }}>Загрузка...</p>
      </div>
    );

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Заголовок */}
        <div style={{ marginBottom: '32px' }}>
          <a
            href="/dashboard"
            style={{ color: '#a1a1aa', fontSize: '14px', textDecoration: 'none' }}
          >
            ← Назад
          </a>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#ffffff',
              marginTop: '16px',
              marginBottom: '8px',
            }}
          >
            🛡️ VELIUM VPN
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '15px' }}>Управляй своими VPN устройствами</p>
        </div>

        {/* Инструкция */}
        <div
          style={{
            backgroundColor: '#141414',
            borderRadius: '16px',
            padding: '20px 24px',
            border: '1px solid #2a2a2a',
            marginBottom: '24px',
          }}
        >
          <p style={{ color: '#ffffff', fontWeight: 600, marginBottom: '8px' }}>
            📱 Как подключиться:
          </p>
          <p style={{ color: '#a1a1aa', fontSize: '14px', lineHeight: '1.6' }}>
            1. Скачай приложение <strong style={{ color: '#ffffff' }}>WireGuard</strong> из App
            Store или Google Play
            <br />
            2. Добавь устройство ниже
            <br />
            3. Нажми «QR код» и отсканируй его в WireGuard
            <br />
            4. Готово — VPN подключён!
          </p>
        </div>

        {/* Добавить устройство */}
        {devices.length < 5 && (
          <div
            style={{
              backgroundColor: '#141414',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #2a2a2a',
              marginBottom: '24px',
            }}
          >
            <p style={{ color: '#ffffff', fontWeight: 600, marginBottom: '16px' }}>
              ➕ Добавить устройство
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="Название (например: iPhone)"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addDevice()}
                style={{
                  flex: 1,
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  fontSize: '15px',
                  color: '#ffffff',
                  outline: 'none',
                }}
              />
              <button
                onClick={addDevice}
                disabled={addingDevice || !deviceName.trim()}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: addingDevice ? 'not-allowed' : 'pointer',
                  opacity: addingDevice ? 0.7 : 1,
                }}
              >
                {addingDevice ? 'Добавляем...' : 'Добавить'}
              </button>
            </div>
            <p style={{ color: '#52525b', fontSize: '12px', marginTop: '8px' }}>
              3 дня бесплатного trial при добавлении
            </p>
          </div>
        )}

        {/* Список устройств */}
        {devices.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px',
              backgroundColor: '#141414',
              borderRadius: '16px',
              border: '1px solid #2a2a2a',
            }}
          >
            <p style={{ fontSize: '40px', marginBottom: '16px' }}>📱</p>
            <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
              Нет устройств
            </p>
            <p style={{ color: '#a1a1aa', fontSize: '14px' }}>
              Добавь первое устройство чтобы начать
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {devices.map((device) => {
              const status = getStatus(device);
              return (
                <div
                  key={device.id}
                  style={{
                    backgroundColor: '#141414',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid #2a2a2a',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '17px',
                          marginBottom: '4px',
                        }}
                      >
                        📱 {device.name}
                      </p>
                      <span
                        style={{
                          backgroundColor: `${status.color}20`,
                          color: status.color,
                          padding: '3px 10px',
                          borderRadius: '100px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {status.text}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteDevice(device.id)}
                      style={{
                        backgroundColor: 'rgba(239,68,68,0.1)',
                        color: '#ef4444',
                        border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      Удалить
                    </button>
                  </div>

                  {/* QR кнопка */}
                  {status.active && (
                    <button
                      onClick={() => showQrCode(device.id)}
                      style={{
                        width: '100%',
                        backgroundColor: 'rgba(124,58,237,0.15)',
                        color: '#a78bfa',
                        border: '1px solid rgba(124,58,237,0.3)',
                        borderRadius: '10px',
                        padding: '12px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginBottom: '12px',
                      }}
                    >
                      📷 Показать QR код
                    </button>
                  )}

                  {/* QR код */}
                  {showQr === device.id && qrCodes[device.id] && (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '20px',
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        marginBottom: '12px',
                      }}
                    >
                      <img
                        src={qrCodes[device.id]}
                        alt="QR код"
                        style={{ width: '250px', height: '250px' }}
                      />
                      <p style={{ color: '#0a0a0a', fontSize: '13px', marginTop: '8px' }}>
                        Отсканируй в приложении WireGuard
                      </p>
                      <button
                        onClick={() => setShowQr(null)}
                        style={{
                          marginTop: '8px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#7c3aed',
                          cursor: 'pointer',
                          fontSize: '13px',
                        }}
                      >
                        Скрыть
                      </button>
                    </div>
                  )}

                  {/* Тарифы если нет подписки */}
                  {!status.active && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {[
                        {
                          plan: 'basic',
                          billing: 'monthly',
                          label: 'Basic 10Mbps',
                          price: '100₽/мес',
                        },
                        {
                          plan: 'basic',
                          billing: 'yearly',
                          label: 'Basic 10Mbps',
                          price: '960₽/год',
                        },
                        {
                          plan: 'standard',
                          billing: 'monthly',
                          label: 'Standard 20Mbps',
                          price: '180₽/мес',
                        },
                        {
                          plan: 'standard',
                          billing: 'yearly',
                          label: 'Standard 20Mbps',
                          price: '1728₽/год',
                        },
                      ].map((opt) => (
                        <button
                          key={`${opt.plan}-${opt.billing}`}
                          onClick={() => subscribe(device.id, opt.plan, opt.billing)}
                          disabled={subscribing === device.id}
                          style={{
                            backgroundColor: 'rgba(14,165,233,0.1)',
                            color: '#38bdf8',
                            border: '1px solid rgba(14,165,233,0.2)',
                            borderRadius: '10px',
                            padding: '10px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: subscribing === device.id ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {opt.label}
                          <br />
                          {opt.price}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
